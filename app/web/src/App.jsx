import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
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

  function signOut() {
    setSession(null);
    setMessage("You have signed out.");
  }

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
        <div className="form-panel">
          {session ? (
            <div className="success-panel">
              <div className="success-icon">✓</div>
              <p className="eyebrow">YOU'RE SIGNED IN</p>
              <h2>Welcome in.</h2>
              <p className="support-copy">Your account is ready, <strong>{session.user.email}</strong>.</p>
              <div className="account-chip"><span className="avatar">{session.user.email[0].toUpperCase()}</span><span><strong>{session.user.email}</strong><small>{session.user.role} account</small></span></div>
              <button className="button secondary" onClick={signOut}>Sign out</button>
            </div>
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
