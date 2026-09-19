import { useContext, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { loginAdmin } from "../services/newsApi";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await loginAdmin(form.email, form.password);
      if (response.user.role !== "admin") throw new Error("This account does not have administrator access");
      signIn(response.user, response.token);
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-art"><span className="admin-login-mark">SN</span><div><p>Salone News</p><h1>The desk behind<br />the daily story.</h1><span>Editorial workspace · Freetown</span></div></section>
      <section className="admin-login-form-wrap">
        <form className="admin-login-form" onSubmit={submit}>
          <div className="admin-login-icon"><LockKeyhole size={18} /></div>
          <p className="admin-panel-kicker">Administrator access</p>
          <h2>Welcome back.</h2>
          <p className="admin-login-copy">Sign in to manage stories, follow your audience, and keep the newsroom moving.</p>
          <label>Email address<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@salonenews.com" required /></label>
          <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" minLength={6} required /></label>
          {error && <p className="admin-login-error">{error}</p>}
          <button className="admin-login-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Enter newsroom"}<ArrowRight size={17} /></button>
          <a href="/" className="admin-login-back">Return to public site</a>
        </form>
      </section>
    </main>
  );
}
