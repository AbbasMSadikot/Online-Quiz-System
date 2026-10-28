import { useState } from "react";

const emptyQuestion = () => ({ prompt: "", options: "", correctAnswer: "" });

export default function App() {
  const [mode, setMode] = useState("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [quiz, setQuiz] = useState({ title: "", instructions: "", questions: [emptyQuestion()] });

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch(\`/api/auth/\${mode}\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Request failed.");
      setSession(body.data);
      setPassword("");
      setMessage(mode === "register" ? "Account created and signed in." : "Signed in successfully.");
    } catch (error) {
      setMessage(error.message || "Could not reach the server. Check that the API is running.");
    } finally {
      setBusy(false);
    }
  }

  async function createQuiz(event) {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: \`Bearer \${session.token}\`
        },
        body: JSON.stringify({
          title: quiz.title,
          instructions: quiz.instructions,
          questions: quiz.questions.map(question => ({
            prompt: question.prompt,
            options: question.options.split("\n").map(option => option.trim()).filter(Boolean),
            correctAnswer: question.correctAnswer
          }))
        })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Could not create quiz.");
      setQuiz({ title: "", instructions: "", questions: [emptyQuestion()] });
      setMessage(\`“\${body.data.quiz.title}” was created with \${body.data.quiz.questions.length} question(s).\`);
    } catch (error) {
      setMessage(error.message || "Could not reach the server. Check that the API is running.");
    } finally {
      setBusy(false);
    }
  }

  function updateQuestion(index, field, value) {
    setQuiz(current => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [field]: value } : question)
    }));
  }

  function signOut() {
    setSession(null);
    setMessage("You have signed out.");
  }

  const canCreateQuiz = session && ["teacher", "admin"].includes(session.user.role);

  return (
    <main className="page-shell">
      <header className="brand"><span className="brand-mark">Q</span><span>Quiz<span className="brand-light">space</span></span></header>
      <section className="auth-layout">
        <div className="intro">
          <p className="eyebrow">ONLINE QUIZ SYSTEM</p>
          <h1>Make room for<br /><span>what you know.</span></h1>
          <p className="intro-copy">Sign in to continue learning, or create an account to get started.</p>
          <div className="decorative-card" aria-hidden="true">
            <div className="mini-top"><span className="mini-dot"></span><span className="mini-dot"></span><span className="mini-dot"></span><span className="mini-label">YOUR LEARNING SPACE</span></div>
            <div className="progress-title">A little progress, every day.</div>
            <div className="progress-track"><span /></div>
            <div className="progress-meta"><span>Keep your streak going</span><span>● ● ● ○ ○</span></div>
          </div>
        </div>
        <div className={canCreateQuiz ? "form-panel teacher-panel" : "form-panel"}>
          {session ? (
            <>
              <div className="signed-in-heading">
                <div><p className="eyebrow">SIGNED IN AS {session.user.role.toUpperCase()}</p><h2>{canCreateQuiz ? "Teacher workspace" : "Welcome in."}</h2></div>
                <button className="text-button" onClick={signOut}>Sign out</button>
              </div>
              {!canCreateQuiz ? (
                <div className="success-panel">
                  <div className="success-icon">✓</div>
                  <p className="support-copy">Your account is ready, <strong>{session.user.email}</strong>.</p>
                  <div className="account-chip"><span className="avatar">{session.user.email[0].toUpperCase()}</span><span><strong>{session.user.email}</strong><small>{session.user.role} account</small></span></div>
                  <p className="terms">Quiz creation is available to teacher and administrator accounts.</p>
                </div>
              ) : (
                <>
                  <p className="support-copy">Build a multiple-choice quiz for your students.</p>
                  <form onSubmit={createQuiz} className="quiz-form">
                    <label htmlFor="quiz-title">Quiz title</label>
                    <input id="quiz-title" required maxLength={120} value={quiz.title} onChange={event => setQuiz({ ...quiz, title: event.target.value })} placeholder="e.g. Science basics" />
                    <label htmlFor="quiz-instructions">Instructions</label>
                    <textarea id="quiz-instructions" required maxLength={2000} rows={3} value={quiz.instructions} onChange={event => setQuiz({ ...quiz, instructions: event.target.value })} placeholder="Tell students how to complete this quiz" />
                    {quiz.questions.map((question, index) => (
                      <fieldset className="question-editor" key={index}>
                        <legend>Question {index + 1}</legend>
                        <label htmlFor={\`question-\${index}\`}>Question</label>
                        <input id={\`question-\${index}\`} required maxLength={500} value={question.prompt} onChange={event => updateQuestion(index, "prompt", event.target.value)} placeholder="Write the question" />
                        <label htmlFor={\`options-\${index}\`}>Answer options <span className="field-hint">One option per line</span></label>
                        <textarea id={\`options-\${index}\`} required rows={4} value={question.options} onChange={event => updateQuestion(index, "options", event.target.value)} placeholder={"First option\nSecond option"} />
                        <label htmlFor={\`answer-\${index}\`}>Correct answer</label>
                        <input id={\`answer-\${index}\`} required maxLength={200} value={question.correctAnswer} onChange={event => updateQuestion(index, "correctAnswer", event.target.value)} placeholder="Enter one option exactly" />
                        {quiz.questions.length > 1 && <button type="button" className="text-button remove-question" onClick={() => setQuiz(current => ({ ...current, questions: current.questions.filter((_, i) => i !== index) }))}>Remove question</button>}
                      </fieldset>
                    ))}
                    <button type="button" className="add-question" onClick={() => setQuiz(current => ({ ...current, questions: [...current.questions, emptyQuestion()] }))}>+ Add question</button>
                    {message && <p className={message.includes("created") ? "notice success" : "notice"} role="status">{message}</p>}
                    <button className="button" type="submit" disabled={busy}>{busy ? "Saving…" : "Create quiz"}<span aria-hidden="true">→</span></button>
                  </form>
                </>
              )}
            </>
          ) : (
            <>
              <div className="form-heading"><h2>{mode === "register" ? "Create your account" : "Welcome back"}</h2><p>{mode === "register" ? "It only takes a moment to join." : "Enter your details to sign in."}</p></div>
              <div className="mode-switch" role="tablist" aria-label="Account action">
                <button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setMessage(""); }}>Create account</button>
                <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setMessage(""); }}>Sign in</button>
              </div>
              <form onSubmit={submit}>
                <label htmlFor="email">Email address</label>
                <input id="email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" />
                <div className="password-label"><label htmlFor="password">Password</label>{mode === "register" && <span>At least 8 characters</span>}</div>
                <input id="password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={mode === "register" ? 8 : undefined} value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" />
                {message && <p className={message.includes("successfully") || message.includes("created") || message.includes("signed out") ? "notice success" : "notice"} role="status">{message}</p>}
                <button className="button" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}<span aria-hidden="true">→</span></button>
              </form>
              <p className="terms">Your password is stored securely as a salted hash.</p>
            </>
          )}
        </div>
      </section>
      <footer><span>© 2026 Quizspace</span><span>Learning, one question at a time.</span></footer>
    </main>
  );
}
