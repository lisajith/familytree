import { useMemo, useState } from "react";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GitBranch,
  LoaderCircle,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  TreePine,
  UserRound,
  Users,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import { supabase } from "../lib/supabase";

function Register({ onLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ==================================================
     PASSWORD VALIDATION
  ================================================== */

  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      letter: /[a-zA-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    };
  }, [password]);

  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;

  const passwordStrength =
    passwordScore === 0
      ? ""
      : passwordScore === 1
        ? "Weak"
        : passwordScore === 2
          ? "Fair"
          : passwordScore === 3
            ? "Good"
            : "Strong";

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  /* ==================================================
     CLEAR MESSAGES
  ================================================== */

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  /* ==================================================
     REGISTER
  ================================================== */

  const handleRegister = async (event) => {
    event.preventDefault();

    clearMessages();

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    /* -----------------------------------------------
       BASIC VALIDATION
    ----------------------------------------------- */

    if (
      !cleanName ||
      !cleanEmail ||
      !password ||
      !confirmPassword ||
      !dateOfBirth ||
      !gender
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (cleanName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!passwordChecks.letter || !passwordChecks.number) {
      setError("Password must contain at least one letter and one number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the Terms and Conditions.");
      return;
    }

    try {
      setLoading(true);

      /* -----------------------------------------------
         SUPABASE SIGN UP
      ----------------------------------------------- */

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,

        /*
         * Extra registration information.
         *
         * These values are stored inside:
         *
         * auth.users -> raw_user_meta_data
         */

        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone || null,
            date_of_birth: dateOfBirth,
            gender,
          },
        },
      });

      if (error) {
        throw error;
      }

      /* -----------------------------------------------
         EMAIL CONFIRMATION
      ----------------------------------------------- */

      if (data.user && !data.session) {
        setMessage(
          "Account created successfully! Please check your email and confirm your account before signing in.",
        );
      } else {
        setMessage("Account created successfully!");
      }

      /* -----------------------------------------------
         CLEAR PASSWORDS
      ----------------------------------------------- */

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Registration error:", error);

      const message = error.message?.toLowerCase() || "";

      if (
        message.includes("rate limit") ||
        message.includes("too many requests") ||
        message.includes("email rate limit")
      ) {
        setError(
          "Too many registration emails have been requested recently. Please wait a while before trying again.",
        );

        return;
      }

      if (
        message.includes("already registered") ||
        message.includes("already exists")
      ) {
        setError("An account with this email already exists.");
        return;
      }

      if (message.includes("invalid email")) {
        setError("Please enter a valid email address.");
        return;
      }

      if (message.includes("password")) {
        setError("Your password does not meet the required security rules.");
        return;
      }

      setError(
        error.message || "Unable to create your account. Please try again.",
      );
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
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
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
                Start your journey
              </div>

              <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Your family has a
                <span className="block text-emerald-400">
                  story worth remembering.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                Create your own digital family tree and keep important family
                connections organized in one place.
              </p>

              {/* FEATURES */}

              <div className="mt-10 grid grid-cols-2 gap-4">
                <Feature
                  icon={<Users size={21} />}
                  title="Add family"
                  description="Add parents, children and spouses."
                />

                <Feature
                  icon={<GitBranch size={21} />}
                  title="Build connections"
                  description="Connect everyone visually."
                />
              </div>
            </div>

            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} Family Tree
            </p>
          </div>
        </div>

        {/* ==================================================
            REGISTER PANEL
        ================================================== */}

        <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2">
          <div className="w-full max-w-lg">
            {/* MOBILE LOGO */}

            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                <TreePine size={28} />
              </div>

              <h1 className="text-xl font-bold text-slate-900">Family Tree</h1>
            </div>

            {/* HEADER */}

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-emerald-600">
                Let's get started 🌱
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Tell us a little about yourself and start building your family
                tree.
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                <p>{error}</p>
              </div>
            )}

            {/* SUCCESS */}

            {message && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
                <Check size={19} className="mt-0.5 shrink-0" />

                <div>
                  <p className="font-semibold">Account created!</p>

                  <p className="mt-1 leading-5">{message}</p>
                </div>
              </div>
            )}

            {/* ==================================================
                FORM
            ================================================== */}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* NAME */}

              <InputField label="Full name" icon={<UserRound size={19} />}>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearMessages();
                  }}
                  placeholder="Ur Name"
                  autoComplete="name"
                  required
                  className="input-style"
                />
              </InputField>

              {/* EMAIL */}

              <InputField label="Email address" icon={<Mail size={19} />}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearMessages();
                  }}
                  placeholder="blaa@example.com"
                  autoComplete="email"
                  required
                  className="input-style"
                />
              </InputField>

              {/* PHONE */}

              <InputField
                label={
                  <>
                    Phone number{" "}
                    <span className="font-normal text-slate-400">
                      (optional)
                    </span>
                  </>
                }
                icon={<Phone size={19} />}
              >
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearMessages();
                  }}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  className="input-style"
                />
              </InputField>

              {/* DATE + GENDER */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* DOB */}

                <InputField
                  label="Date of birth"
                  icon={<CalendarDays size={19} />}
                >
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => {
                      setDateOfBirth(e.target.value);
                      clearMessages();
                    }}
                    required
                    className="input-style"
                  />
                </InputField>

                {/* GENDER */}

                <InputField label="Gender" icon={<UserRound size={19} />}>
                  <div className="relative flex-1">
                    <select
                      value={gender}
                      onChange={(e) => {
                        setGender(e.target.value);
                        clearMessages();
                      }}
                      required
                      className="input-style appearance-none cursor-pointer"
                    >
                      <option value="">Select gender</option>

                      <option value="male">Male</option>

                      <option value="female">Female</option>

                      <option value="other">Other</option>

                      <option value="prefer_not_to_say">
                        Prefer not to say
                      </option>
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </InputField>
              </div>

              {/* PASSWORD */}

              <InputField label="Password" icon={<Lock size={19} />}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearMessages();
                  }}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                  className="input-style"
                />

                <PasswordToggle
                  visible={showPassword}
                  onClick={() => setShowPassword((value) => !value)}
                />
              </InputField>

              {/* PASSWORD STRENGTH */}

              {password && (
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="mb-2 flex justify-between">
                    <span className="text-xs text-slate-500">
                      Password strength
                    </span>

                    <span
                      className={`text-xs font-bold ${
                        passwordStrength === "Strong"
                          ? "text-emerald-600"
                          : passwordStrength === "Good"
                            ? "text-blue-600"
                            : passwordStrength === "Fair"
                              ? "text-amber-600"
                              : "text-red-500"
                      }`}
                    >
                      {passwordStrength}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition ${
                          passwordScore >= level
                            ? passwordScore === 4
                              ? "bg-emerald-500"
                              : passwordScore === 3
                                ? "bg-blue-500"
                                : passwordScore === 2
                                  ? "bg-amber-400"
                                  : "bg-red-400"
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <PasswordRequirement
                      checked={passwordChecks.length}
                      text="8+ characters"
                    />

                    <PasswordRequirement
                      checked={passwordChecks.letter}
                      text="A letter"
                    />

                    <PasswordRequirement
                      checked={passwordChecks.number}
                      text="A number"
                    />

                    <PasswordRequirement
                      checked={passwordChecks.special}
                      text="Special character"
                    />
                  </div>
                </div>
              )}

              {/* CONFIRM PASSWORD */}

              <InputField label="Confirm password" icon={<Lock size={19} />}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearMessages();
                  }}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  className="input-style"
                />

                <PasswordToggle
                  visible={showConfirmPassword}
                  onClick={() => setShowConfirmPassword((value) => !value)}
                />
              </InputField>

              {/* PASSWORD MATCH */}

              {confirmPassword && (
                <div
                  className={`flex items-center gap-2 text-xs ${
                    passwordsMatch ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  <Check size={14} />

                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"}
                </div>
              )}

              {/* TERMS */}

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    clearMessages();
                  }}
                  className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />

                <span className="text-xs leading-5 text-slate-500">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              {/* REGISTER */}

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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* LOGIN */}

            <div className="mt-8 border-t border-slate-200 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onLogin}
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Sign in
                </button>
              </p>
            </div>

            {/* SECURITY */}

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} />
              Your information is securely authenticated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================================================
   INPUT FIELD
================================================== */

function InputField({ label, icon, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
        <span className="shrink-0 text-slate-400 transition group-focus-within:text-blue-500">
          {icon}
        </span>

        {children}
      </div>
    </div>
  );
}

/* ==================================================
   PASSWORD TOGGLE
================================================== */

function PasswordToggle({ visible, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      title={visible ? "Hide password" : "Show password"}
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

/* ==================================================
   PASSWORD REQUIREMENT
================================================== */

function PasswordRequirement({ checked, text }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          checked
            ? "bg-emerald-100 text-emerald-600"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        <Check size={10} strokeWidth={3} />
      </div>

      <span className={checked ? "text-slate-600" : "text-slate-400"}>
        {text}
      </span>
    </div>
  );
}

/* ==================================================
   FEATURE
================================================== */

function Feature({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3 text-blue-400">{icon}</div>

      <p className="text-sm font-semibold text-white">{title}</p>

      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

export default Register;
