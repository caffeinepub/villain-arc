import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Layout } from "../components/Layout";
import { OutlinedButton } from "../components/OutlinedButton";

const FEATURES = [
  {
    index: "01",
    label: "Case Files",
    headline: "Landmark Cases",
    desc: "Forensic dossiers on landmark criminal cases. Psychological profiles, theory mappings, and clinical summaries.",
    href: "/cases",
    ocid: "feature-cases",
    meta: "12 curated cases",
  },
  {
    index: "02",
    label: "Theory Matcher",
    headline: "Theory Engine",
    desc: "Input a crime scenario. The engine ranks applicable criminological theories with confidence scores and academic rationale.",
    href: "/theory-match",
    ocid: "feature-theory",
    meta: "8 major theories",
  },
  {
    index: "03",
    label: "Flashcard Quiz",
    headline: "Spaced Repetition",
    desc: "SM-2 algorithm surfaces the cards you need most. Seven domains — terms, theorists, disorders, cases, studies.",
    href: "/quiz",
    ocid: "feature-quiz",
    meta: "SM-2 algorithm",
  },
  {
    index: "04",
    label: "Study Journal",
    headline: "Research Archive",
    desc: "Personal research log with rich text, tagging, search, and degree milestone progression.",
    href: "/journal",
    ocid: "feature-journal",
    meta: "Milestone tracking",
  },
] as const;

const DISCIPLINES = [
  "Strain Theory",
  "Rational Choice",
  "Biosocial Criminology",
  "Social Learning Theory",
  "Labeling Theory",
  "Routine Activity Theory",
  "Psychodynamic Theory",
  "General Strain Theory",
];

export default function HomePage() {
  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative min-h-[calc(100vh-56px)] flex flex-col justify-center border-b border-border overflow-hidden">
        {/* Grain texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "140px 140px",
          }}
        />

        <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-20 items-end">
            {/* Left: hero copy */}
            <div>
              <motion.p
                className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Criminal Psychology — Study Companion
              </motion.p>

              <motion.h1
                className="font-display italic text-[clamp(3.5rem,9vw,8rem)] leading-[0.92] tracking-tight text-foreground mb-10"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                The criminal
                <br />
                mind,
                <br />
                decoded.
              </motion.h1>

              <motion.div
                className="h-px bg-border w-full mb-10"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.45 }}
              />

              <motion.p
                className="font-body text-base text-muted-foreground max-w-lg leading-relaxed mb-12"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
              >
                A study companion for criminal psychology students. Explore
                landmark cases, test yourself with spaced repetition, run the
                theory engine, and log your research.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Link to="/cases">
                  <OutlinedButton size="lg" data-ocid="hero-cta-cases">
                    Browse Cases
                  </OutlinedButton>
                </Link>
                <Link to="/quiz">
                  <OutlinedButton
                    size="lg"
                    variant="ghost"
                    data-ocid="hero-cta-quiz"
                  >
                    Start Quiz
                  </OutlinedButton>
                </Link>
              </motion.div>
            </div>

            {/* Right: disciplines index */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="border border-border">
                <div className="px-6 py-4 border-b border-border">
                  <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                    Theory Domains
                  </span>
                </div>
                {DISCIPLINES.map((d, i) => (
                  <Link
                    key={d}
                    to="/theory-match"
                    className="flex items-center justify-between px-6 py-3.5 border-b border-border last:border-0 group hover:bg-card transition-colors duration-200"
                    data-ocid={`hero-theory-${i}`}
                  >
                    <span className="font-mono text-xs tracking-wide text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                      {d}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="bg-background border-b border-border py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <motion.div
            className="flex items-center gap-4 mb-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              Study Modules
            </span>
            <div className="h-px bg-border flex-1" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={[
                  "relative group",
                  i % 2 === 0 ? "border-r border-border" : "",
                  i < 2 ? "border-b border-border" : "",
                ].join(" ")}
              >
                <Link
                  to={f.href}
                  className="block p-10 h-full hover:bg-card transition-colors duration-300"
                  data-ocid={f.ocid}
                >
                  {/* Number + meta row */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground">
                      {f.index}
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
                      {f.meta}
                    </span>
                  </div>

                  {/* Label */}
                  <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-3">
                    {f.label}
                  </p>

                  {/* Headline */}
                  <h2 className="font-display italic text-3xl md:text-4xl text-foreground leading-tight mb-5">
                    {f.headline}
                  </h2>

                  {/* Divider */}
                  <div className="h-px bg-border mb-5 w-full group-hover:bg-foreground transition-colors duration-300" />

                  {/* Description */}
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
                    {f.desc}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-foreground group-hover:tracking-[0.35em] transition-all duration-300">
                      Enter
                    </span>
                    <span className="font-mono text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial Pull Quote ── */}
      <section className="bg-card border-b border-border py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px bg-border mb-12" />
            <blockquote className="font-display italic text-2xl md:text-[2rem] text-foreground leading-[1.35] mb-8">
              "Criminology is not merely the study of crime. It is a systematic
              interrogation of how societies define, construct, and respond to
              deviance."
            </blockquote>
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              — Edwin Sutherland, Criminologist
            </p>
            <div className="h-px bg-border mt-12" />
          </motion.div>
        </div>
      </section>

      {/* ── Index strip ── */}
      <section className="bg-background py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-border"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {[
              { value: "12+", label: "Case Files" },
              { value: "8", label: "Theories" },
              { value: "120+", label: "Flashcards" },
              { value: "SM-2", label: "Algorithm" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={[
                  "px-8 py-10 text-center",
                  i < 3 ? "border-r border-border" : "",
                ].join(" ")}
              >
                <p className="font-display italic text-4xl md:text-5xl text-foreground mb-2">
                  {s.value}
                </p>
                <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
