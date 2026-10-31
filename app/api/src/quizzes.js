import { Router } from "express";
import { createRequireAuth } from "./auth.js";

const TITLE_MAX_LENGTH = 120;
const INSTRUCTIONS_MAX_LENGTH = 2000;
const QUESTION_MAX_LENGTH = 500;
const OPTION_MAX_LENGTH = 200;
const QUESTION_MAX_COUNT = 50;
const OPTION_MAX_COUNT = 6;

function badRequest(res, message) {
  return res.status(400).json({
    success: false,
    error: { code: 400, message }
  });
}

function validateQuiz(body) {
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const instructions = typeof body?.instructions === "string" ? body.instructions.trim() : "";
  const questions = body?.questions;

  if (!title || title.length > TITLE_MAX_LENGTH) {
    return { error: `Title is required and must be at most ${TITLE_MAX_LENGTH} characters.` };
  }
  if (!instructions || instructions.length > INSTRUCTIONS_MAX_LENGTH) {
    return { error: `Instructions are required and must be at most ${INSTRUCTIONS_MAX_LENGTH} characters.` };
  }
  if (!Array.isArray(questions) || questions.length === 0 || questions.length > QUESTION_MAX_COUNT) {
    return { error: `Add between 1 and ${QUESTION_MAX_COUNT} questions.` };
  }

  const normalizedQuestions = [];
  for (const [index, question] of questions.entries()) {
    const prompt = typeof question?.prompt === "string" ? question.prompt.trim() : "";
    const rawOptions = question?.options;
    const options = Array.isArray(rawOptions)
      ? rawOptions.map(option => typeof option === "string" ? option.trim() : "")
      : [];
    const correctAnswer = typeof question?.correctAnswer === "string"
      ? question.correctAnswer.trim()
      : "";

    if (!prompt || prompt.length > QUESTION_MAX_LENGTH) {
      return { error: `Question ${index + 1} must have text under ${QUESTION_MAX_LENGTH + 1} characters.` };
    }
    if (options.length < 2 || options.length > OPTION_MAX_COUNT
      || options.some(option => !option || option.length > OPTION_MAX_LENGTH)
      || new Set(options).size !== options.length) {
      return { error: `Question ${index + 1} must have 2 to ${OPTION_MAX_COUNT} unique, non-empty options under ${OPTION_MAX_LENGTH + 1} characters each.` };
    }
    if (!correctAnswer || !options.includes(correctAnswer)) {
      return { error: `Question ${index + 1} must identify one of its options as the correct answer.` };
    }
    normalizedQuestions.push({ prompt, options, correctAnswer, position: index + 1 });
  }

  return { value: { title, instructions, questions: normalizedQuestions } };
}

export function createQuizRouter({ prisma, jwtSecret }) {
  const router = Router();
  const requireAuth = createRequireAuth(jwtSecret);

  router.post("/:quizId/submit", requireAuth, async (req, res, next) => {
    if (req.auth.role !== "student") {
      return res.status(403).json({
        success: false,
        error: { code: 403, message: "Only student accounts can submit quiz answers." }
      });
    }

    const quizId = Number(req.params.quizId);
    const answers = req.body?.answers;
    if (!Number.isInteger(quizId) || quizId < 1 || !Array.isArray(answers)) {
      return badRequest(res, "A valid quiz ID and an answers array are required.");
    }

    try {
      const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        select: { id: true, questions: { orderBy: { position: "asc" }, select: { id: true, correctAnswer: true } } }
      });
      if (!quiz) {
        return res.status(404).json({ success: false, error: { code: 404, message: "Quiz not found." } });
      }
      if (answers.length !== quiz.questions.length) {
        return badRequest(res, "Submit exactly one answer for each question.");
      }

      const submittedQuestionIds = new Set();
      for (const answer of answers) {
        if (!Number.isInteger(answer?.questionId) || typeof answer.answer !== "string"
          || submittedQuestionIds.has(answer.questionId)) {
          return badRequest(res, "Each answer must contain a unique questionId and an answer string.");
        }
        submittedQuestionIds.add(answer.questionId);
      }

      const questionById = new Map(quiz.questions.map(question => [question.id, question]));
      if (submittedQuestionIds.size !== questionById.size
        || [...submittedQuestionIds].some(questionId => !questionById.has(questionId))) {
        return badRequest(res, "Answers must reference every question in this quiz exactly once.");
      }

      const correct = answers.reduce((score, answer) => (
        score + (answer.answer.trim() === questionById.get(answer.questionId).correctAnswer ? 1 : 0)
      ), 0);
      const total = quiz.questions.length;
      return res.json({
        success: true,
        data: { result: { quizId: quiz.id, correct, total, percentage: Math.round((correct / total) * 100) } }
      });
    } catch (error) {
      return next(error);
    }
  });

  router.get("/", requireAuth, async (req, res, next) => {
    if (req.auth.role !== "teacher" && req.auth.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: { code: 403, message: "Teacher or administrator privileges are required to view quiz management list." }
      });
    }

    try {
      const quizzes = await prisma.quiz.findMany({
        where: req.auth.role === "admin" ? {} : { ownerId: req.auth.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          instructions: true,
          createdAt: true,
          questions: {
            select: { id: true, position: true, prompt: true }
          }
        }
      });

      return res.json({
        success: true,
        data: { quizzes }
      });
    } catch (error) {
      return next(error);
    }
  });

  router.post("/", requireAuth, async (req, res, next) => {
    if (req.auth.role !== "teacher" && req.auth.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: { code: 403, message: "Teacher or administrator privileges are required to create a quiz." }
      });
    }

    const validated = validateQuiz(req.body);
    if (validated.error) return badRequest(res, validated.error);

    try {
      const quiz = await prisma.quiz.create({
        data: {
          title: validated.value.title,
          instructions: validated.value.instructions,
          ownerId: req.auth.id,
          questions: {
            create: validated.value.questions.map(question => ({
              position: question.position,
              prompt: question.prompt,
              optionsJson: JSON.stringify(question.options),
              correctAnswer: question.correctAnswer
            }))
          }
        },
        select: {
          id: true,
          title: true,
          instructions: true,
          createdAt: true,
          questions: { select: { id: true, position: true, prompt: true, optionsJson: true } }
        }
      });

      return res.status(201).json({
        success: true,
        data: {
          quiz: {
            ...quiz,
            questions: quiz.questions.map(question => ({
              id: question.id,
              position: question.position,
              prompt: question.prompt,
              options: JSON.parse(question.optionsJson)
            }))
          }
        }
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
