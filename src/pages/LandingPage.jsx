import {
  ArrowRight,
  GitBranch,
  Heart,
  Mail,
  ShieldCheck,
  Sparkles,
  TreePine,
  UserRound,
  Users,
} from "lucide-react";

function LandingPage({ onLogin, onRegister }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* LOGO */}

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <TreePine size={21} />
            </div>

            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">Family Tree</p>

              <p className="text-[10px] text-slate-400">
                Your family. Your story.
              </p>
            </div>
          </button>

          {/* NAV ACTIONS */}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLogin}
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:block"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={onRegister}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
            >
              Get Started
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ==================================================
          HERO
      ================================================== */}

      <main>
        <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:pb-28 lg:pt-28">
          {/* BACKGROUND DECORATION */}

          <div className="pointer-events-none absolute left-1/2 top-0 h-125 w-175 -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl" />

          <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-10">
              {/* HERO TEXT */}

              <div className="max-w-xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                  <Sparkles size={14} />
                  Preserve your family story
                </div>

                <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Your family has a story
                  <span className="block text-emerald-600">
                    worth remembering.
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-base leading-7 text-slate-500 sm:text-lg">
                  Build a beautiful digital family tree, connect generations,
                  and explore your family relationships in one simple
                  interactive experience. Created by{" "}
                  <span className="font-semibold text-slate-700">
                    Ajith Malle
                  </span>
                  .
                </p>

                {/* CTA */}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onRegister}
                    className="group flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
                  >
                    Start Creating Your Tree
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById("demo-tree")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Explore the Demo
                  </button>
                </div>

                {/* TRUST */}

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} />
                    Secure authentication
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={15} />
                    Built for families
                  </div>
                </div>
              </div>

              {/* DEMO TREE */}

              <DemoTree />
            </div>
          </div>
        </section>

        {/* ==================================================
            DEMO SECTION
        ================================================== */}

        <section
          id="demo-tree"
          className="border-y border-slate-200 bg-white px-5 py-20 sm:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-emerald-600">
                See it in action
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Explore a family tree
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
                This is a sample family tree. Create your own account to build
                your personal family story.
              </p>
            </div>

            <div className="mt-12">
              <DemoTree large />
            </div>

            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={onRegister}
                className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Create Your Family Tree
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </section>

        {/* ==================================================
            FEATURES
        ================================================== */}

        <section className="px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-blue-600">
                Everything in one place
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Build your family story your way
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<Users size={21} />}
                title="Add family members"
                description="Create profiles for parents, children, spouses and other family members."
              />

              <FeatureCard
                icon={<GitBranch size={21} />}
                title="Connect relationships"
                description="Connect family members and see how generations are related."
              />

              <FeatureCard
                icon={<TreePine size={21} />}
                title="Visual family tree"
                description="Explore your family through a clean and interactive visual tree."
              />

              <FeatureCard
                icon={<ShieldCheck size={21} />}
                title="Private & secure"
                description="Your personal family tree belongs to your account."
              />
            </div>
          </div>
        </section>

        {/* ==================================================
            HOW IT WORKS
        ================================================== */}

        <section className="bg-slate-900 px-5 py-20 text-white sm:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-emerald-400">
                Simple to start
              </p>

              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                Your family tree in three steps
              </h2>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              <Step
                number="01"
                title="Create your account"
                text="Sign up and create your own secure family tree."
              />

              <Step
                number="02"
                title="Add your family"
                text="Add family members and enter the information you want to remember."
              />

              <Step
                number="03"
                title="Connect the story"
                text="Create relationships and watch your family tree come together."
              />
            </div>
          </div>
        </section>

        {/* ==================================================
    ABOUT CREATOR
================================================== */}

        <section
          id="about-creator"
          className="border-t border-slate-200 bg-slate-50 px-5 py-20 sm:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
                {/* CREATOR ICON */}

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                  <UserRound size={28} />
                </div>

                {/* CREATOR INFORMATION */}

                <div className="mt-6 sm:ml-6 sm:mt-0">
                  <p className="text-sm font-semibold text-emerald-600">
                    About the creator
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Ajith Kumar Malle
                  </h2>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Also known as Ajith Malle
                  </p>

                  <p className="mt-5 text-sm leading-7 text-slate-500">
                    <strong className="font-semibold text-slate-700">
                      Family Tree
                    </strong>{" "}
                    is a project created by{" "}
                    <strong className="font-semibold text-slate-700">
                      Ajith Kumar Malle
                    </strong>
                    , a software developer who enjoys building practical and
                    user-friendly web applications.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    The project was created to provide a simple and visual way
                    to organize family members, connect relationships and
                    preserve family stories digitally.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    Built by{" "}
                    <strong className="font-semibold text-slate-700">
                      Ajith Malle
                    </strong>
                    , Family Tree combines a modern web interface with an
                    interactive family-tree experience.
                  </p>

                  {/* CREATOR LINKS */}

                  <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                    {/* PORTFOLIO */}

                    <a
                      href="https://ajithmalleportfolio.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
      inline-flex
      items-center
      gap-2
      rounded-xl
      border
      border-slate-200
      bg-white
      px-4
      py-2.5
      text-xs
      font-semibold
      text-slate-700
      transition
      hover:border-slate-300
      hover:bg-slate-50
    "
                    >
                      <UserRound size={15} />
                      Ajith Malle
                    </a>

                    {/* GITHUB */}

                    <a
                      href="https://github.com/lisajith/familytree"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
      inline-flex
      items-center
      gap-2
      rounded-xl
      bg-slate-900
      px-4
      py-2.5
      text-xs
      font-semibold
      text-white
      transition
      hover:bg-slate-800
    "
                    >
                      <GitBranch size={15} />
                      View on GitHub
                    </a>

                    {/* CONTACT */}

                    <a
                      href="mailto:ajithkumarmalle@gmail.com"
                      className="
      inline-flex
      items-center
      gap-2
      rounded-xl
      border
      border-emerald-200
      bg-emerald-50
      px-4
      py-2.5
      text-xs
      font-semibold
      text-emerald-700
      transition
      hover:border-emerald-300
      hover:bg-emerald-100
    "
                    >
                      <Mail size={15} />
                      Contact Me
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            FINAL CTA
        ================================================== */}

        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 px-6 py-14 text-center text-white shadow-2xl sm:px-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Heart size={25} />
            </div>

            <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
              Start building your family story.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Create your account and start connecting the people and
              relationships that make your family unique.
            </p>

            <button
              type="button"
              onClick={onRegister}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Get Started — It's Free
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <TreePine size={17} className="text-slate-700" />

            <p className="text-sm font-semibold text-slate-700">Family Tree</p>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Family Tree · Created by{" "}
            <span className="font-medium text-slate-500">
              Ajith Kumar Malle
            </span>{" "}
            (Ajith Malle)
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ==================================================
   DEMO TREE
================================================== */

function DemoTree({ large = false }) {
  return (
    <div
      className={`relative mx-auto w-full ${large ? "max-w-5xl" : "max-w-xl"}`}
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/70 sm:p-8">
        {/* TREE HEADER */}

        <div className="mb-7 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Demo family
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900">
              Krishna Family
            </h3>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TreePine size={18} />
          </div>
        </div>

        {/* TREE */}

        <div className="overflow-x-auto pb-2">
          <div
            className={`mx-auto min-w-150 ${
              large ? "max-w-4xl" : "max-w-xl"
            }`}
          >
            {/* GRANDPARENTS */}

            <div className="flex justify-center gap-5">
              <DemoPerson name="Shurasena" relation="Grandfather" />

              <DemoPerson name="Marisha" relation="Grandmother" />

              <DemoPerson name="Devaka" relation="Grandfather" />

              <DemoPerson name="Padmavati" relation="Grandmother" />
            </div>

            {/* CONNECTION */}

            <div className="mx-auto flex h-10 w-3/4 items-start justify-center">
              <div className="h-10 w-px bg-slate-300" />
            </div>

            {/* PARENTS */}

            <div className="flex justify-center gap-5">
              <DemoPerson name="Vasudeva" relation="Father" highlight />

              <DemoPerson name="Devaki" relation="Mother" highlight />
            </div>

            {/* CONNECTION */}

            <div className="mx-auto flex h-10 items-start justify-center">
              <div className="h-10 w-px bg-emerald-400" />
            </div>

            {/* CHILD */}

            <div className="flex justify-center">
              <DemoPerson name="Krishna" relation="You" primary />
            </div>

            {/* CHILDREN */}

            <div className="mx-auto flex h-10 items-start justify-center">
              <div className="h-10 w-px bg-slate-300" />
            </div>

            <div className="flex justify-center gap-5">
              <DemoPerson name="Subhadra" relation="Sister" />

              <DemoPerson name="Balarama" relation="Brother" />
            </div>
          </div>
        </div>

        {/* DEMO FOOTER */}

        <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
          <Sparkles size={13} />
          Interactive family tree experience
        </div>
      </div>
    </div>
  );
}

/* ==================================================
   DEMO PERSON
================================================== */

function DemoPerson({ name, relation, highlight = false, primary = false }) {
  return (
    <div
      className={`
        w-36
        shrink-0
        rounded-2xl
        border
        p-3
        text-center
        shadow-sm
        transition
        ${
          primary
            ? "border-emerald-300 bg-emerald-50 shadow-emerald-100"
            : highlight
              ? "border-blue-200 bg-blue-50"
              : "border-slate-200 bg-white"
        }
      `}
    >
      <div
        className={`
          mx-auto
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          ${
            primary
              ? "bg-emerald-600 text-white"
              : highlight
                ? "bg-blue-100 text-blue-600"
                : "bg-slate-100 text-slate-500"
          }
        `}
      >
        <UserRound size={16} />
      </div>

      <p className="mt-2 truncate text-xs font-bold text-slate-800">{name}</p>

      <p
        className={`mt-1 text-[10px] ${
          primary ? "text-emerald-600" : "text-slate-400"
        }`}
      >
        {relation}
      </p>
    </div>
  );
}

/* ==================================================
   FEATURE CARD
================================================== */

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
        {icon}
      </div>

      <h3 className="text-sm font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

/* ==================================================
   STEP
================================================== */

function Step({ number, title, text }) {
  return (
    <div className="relative text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-emerald-400">
        {number}
      </div>

      <h3 className="mt-5 text-base font-bold">{title}</h3>

      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}

export default LandingPage;
