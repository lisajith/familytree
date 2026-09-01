import { useState } from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  GitBranch,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck,
  TreePine,
  Users,
} from "lucide-react";

import { supabase } from "../lib/supabase";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("Unable to sign in. Please try again.");
      }

      /*
       * EXTRA SAFETY
       *
       * Even if something changes in the Supabase
       * configuration, don't allow an unverified user
       * into the application.
       */

      if (!data.user.email_confirmed_at) {
        await supabase.auth.signOut();

        setError("Please confirm your email address before signing in.");

        return;
      }

      onLogin?.(data.user);
    } catch (error) {
      console.error("Login error:", error);

      let message = error.message || "Unable to sign in.";

      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("email not confirmed")) {
        message = "Please confirm your email address before signing in.";
      } else if (
        lowerMessage.includes("invalid login") ||
        lowerMessage.includes("invalid credentials")
      ) {
        message =
          "Incorrect email or password, or your email has not been confirmed yet.";
      } else if (
        lowerMessage.includes("rate limit") ||
        lowerMessage.includes("too many requests")
      ) {
        message =
          "Too many login attempts. Please wait a little and try again.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        {/* ==================================================
            LEFT BRAND PANEL
        ================================================== */}

        <div className="relative hidden overflow-hidden bg-slate-900 lg:flex lg:w-1/2">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10" />

          <div className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-emerald-500/10" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* LOGO */}

            <div className="flex items-center gap-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <TreePine size={23} />
              </div>

              <div>
                <p className="text-lg font-bold">Family Tree</p>

                <p className="text-xs text-slate-400">
                  Your family. Your story.
                </p>
              </div>
            </div>

            {/* CENTER */}

            <div className="max-w-lg">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300">
                <TreePine size={14} />
                Welcome back
              </div>

              <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Keep your family
                <span className="block text-blue-400">connected forever.</span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                Continue building, organizing and exploring your family
                relationships in one beautiful interactive family tree.
              </p>

              {/* FEATURES */}

              <div className="mt-10 space-y-5">
                <Feature
                  icon={<Users size={19} />}
                  title="Connect your family"
                  text="Organize parents, children and spouses."
                />

                <Feature
                  icon={<GitBranch size={19} />}
                  title="Interactive family tree"
                  text="Explore your family visually."
                />

                <Feature
                  icon={<ShieldCheck size={19} />}
                  title="Secure account"
                  text="Your account protects your family tree."
                />
              </div>
            </div>

            {/* FOOTER */}

            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} Family Tree
            </p>
          </div>
        </div>

        {/* ==================================================
            LOGIN PANEL
        ================================================== */}

        <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* MOBILE LOGO */}

            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                <TreePine size={28} />
              </div>

              <h1 className="text-xl font-bold text-slate-900">Family Tree</h1>
            </div>

            {/* HEADER */}

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-blue-600">
                Welcome back 👋
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Sign in to your account
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Continue building and exploring your family tree.
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                <p>{error}</p>
              </div>
            )}

            {/* FORM */}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* EMAIL */}

              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <Mail
                    size={19}
                    className="shrink-0 text-slate-400 group-focus-within:text-blue-500"
                  />

                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <Lock
                    size={19}
                    className="shrink-0 text-slate-400 group-focus-within:text-blue-500"
                  />

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-4
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-slate-900/10
                  transition
                  hover:-translate-y-0.5
                  hover:bg-slate-800
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:translate-y-0
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* REGISTER */}

            <div className="mt-8 border-t border-slate-200 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onRegister}
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Create account
                </button>
              </p>
            </div>

            {/* SECURITY */}

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} />
              Secure account authentication
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================================================
   FEATURE
================================================== */

function Feature({ icon, title, text }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-blue-400">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-white">{title}</p>

        <p className="text-xs text-slate-500">{text}</p>
      </div>
    </div>
  );
}

export default Login;
