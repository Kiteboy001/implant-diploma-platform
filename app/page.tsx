import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-gray-400 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/tid-logo.svg"
                alt="The Implant Diploma"
                width={180}
                height={36}
                className="h-9 w-auto"
                priority
              />
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-sm text-[#666] hover:text-brand transition-colors font-medium"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm px-5 py-2.5 bg-brand text-white rounded font-semibold hover:bg-brand-light transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO — site-style gradient overlay on image */}
      <section className="relative min-h-[650px] flex items-center overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt="Implant dentistry training"
          fill
          className="object-cover"
          priority
        />
        {/* Match the site's gradient: white wash at top → dark slate at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(255,255,255,0.35) 0%, rgba(40,47,53,0.92) 100%)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
          <h1 className="font-[family-name:var(--font-garamond)] text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 text-white font-bold">
            Your Diploma Journey,{" "}
            <span className="text-[#7CC0E0]">Simplified</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl">
            Track your progress, submit case studies, and get personalised AI
            guidance — all in one delegate portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/auth/signup"
              className="px-7 py-3 bg-brand text-white rounded font-semibold text-base hover:bg-brand-light transition-colors text-center shadow-lg"
            >
              Apply Today
            </Link>
            <Link
              href="/auth/login"
              className="px-7 py-3 border border-white/30 text-white rounded font-medium text-base hover:bg-white/10 transition-colors text-center"
            >
              Sign in
            </Link>
          </div>

          {/* Stat badges — matching site */}
          <div className="flex flex-wrap gap-4">
            {[
              { value: "7", label: "Tutors" },
              { value: "12", label: "Modules" },
              { value: "3 days", label: "Dental Hospital" },
              { value: "Diploma", label: "Certificate" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur border border-white/20 rounded px-5 py-3 text-center min-w-[100px]"
              >
                <p className="text-white font-bold text-xl leading-none mb-1">
                  {stat.value}
                </p>
                <p className="text-white/70 text-xs uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLOGAN STRIP */}
      <section className="bg-brand py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/90 text-base md:text-lg italic font-[family-name:var(--font-garamond)]">
            &ldquo;Live patients on all modules.&rdquo;
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand font-semibold text-sm uppercase tracking-widest mb-3">
              Everything you need
            </p>
            <h2 className="font-[family-name:var(--font-garamond)] text-3xl md:text-4xl text-slate-dark font-bold mb-4">
              Built for delegates, by clinicians
            </h2>
            <p className="text-body text-lg max-w-2xl mx-auto leading-relaxed">
              The delegate portal brings together all the tools you need to
              complete your Implant Diploma with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                ),
                title: "Track Your Progress",
                desc: "See your completion percentage by module, upcoming deadlines, and submission statuses at a glance.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                ),
                title: "Submit Case Studies",
                desc: "Upload CBDA, VIPLA, and assessment files. Receive feedback and track your grades.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                ),
                title: "Course Materials",
                desc: "Access videos, documents, checklists, and resources organised by module.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                  </svg>
                ),
                title: "AI Study Coach",
                desc: "Chat with your personal Hermes agent. Get reminders, guidance, and answers 24/7.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                ),
                title: "Stay on Schedule",
                desc: "Never miss a deadline. View upcoming milestones, assessments, and placement dates.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                ),
                title: "Secure & Private",
                desc: "Your data is encrypted and private. Only you and your instructors can see your work.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded border border-gray-100 hover:border-brand/30 hover:shadow-md transition-all duration-300"
              >
                <div className="text-brand mb-5 group-hover:text-brand-light transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-[family-name:var(--font-garamond)] text-lg text-slate-dark font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="text-body text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI COACH HIGHLIGHT */}
      <section className="bg-slate-darker text-white py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <p className="text-brand-light font-semibold text-sm uppercase tracking-widest mb-3">
                Your personal assistant
              </p>
              <h2 className="font-[family-name:var(--font-garamond)] text-3xl md:text-4xl text-white font-bold mb-6">
                Meet your AI study coach
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Your Hermes agent lives in WhatsApp and Telegram. Ask about your
                progress, upcoming deadlines, or anything else about the course.
                It remembers your conversations and adapts to your learning style.
              </p>
              <ul className="space-y-4 text-gray-300">
                {[
                  "Get proactive reminders before deadlines",
                  "Ask questions about course content 24/7",
                  "Track your submission status in real-time",
                  "Receive personalised guidance based on your progress",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-light mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Chat preview */}
            <div className="flex-1 w-full max-w-md">
              <div className="bg-slate-dark rounded-2xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs text-gray-400 ml-2">Hermes AI — Student Coach</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      Y
                    </div>
                    <div className="bg-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200">
                      How am I doing with the CBDA module?
                    </div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-brand rounded-xl px-4 py-2.5 text-sm text-white max-w-[80%]">
                      You&apos;re at 65% — great progress! Need help with
                      anything?
                    </div>
                    <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      H
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-[family-name:var(--font-garamond)] text-3xl md:text-4xl text-slate-dark font-bold mb-4">
            Ready to take the next step?
          </h2>
          <p className="text-body text-lg mb-10 max-w-xl mx-auto">
            Join your cohort on the delegate portal and get the support you need
            to excel.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-brand text-white rounded font-semibold text-lg hover:bg-brand-light transition-colors shadow-lg"
          >
            Apply Today
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-dark text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/tid-logo.svg"
                alt="The Implant Diploma"
                width={140}
                height={28}
                className="h-6 w-auto opacity-70"
              />
              <span className="text-sm text-gray-500">— Delegate Portal</span>
            </div>
            <div className="flex gap-8 text-sm">
              <a
                href="https://theimplantdiploma.co.uk"
                className="hover:text-gray-200 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Course Website
              </a>
              <Link href="/auth/login" className="hover:text-gray-200 transition-colors">
                Sign in
              </Link>
            </div>
          </div>
          <p className="text-center text-xs text-gray-600 mt-10">
            &copy; {new Date().getFullYear()} The Implant Diploma. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
