import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Retrivo — AI-Powered Lost & Found Platform",
  description:
    "Retrivo uses cutting-edge AI to intelligently match lost and found items, helping reunite people with their belongings faster than ever before.",
};

export default function HomePage() {
  return (
    <main className={styles.main}>
      {/* ── Animated Background ── */}
      <div className={styles.bgOrbs}>
        <span className={styles.orb1} />
        <span className={styles.orb2} />
        <span className={styles.orb3} />
      </div>

      {/* ── Navbar ── */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🔍</span>
          <span className={styles.logoText}>Retrivo</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/lost" className={styles.navLink}>Report Lost</Link>
          <Link href="/found" className={styles.navLink}>Report Found</Link>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
        </div>
        <div className={styles.navActions}>
          <Link href="/login" className={styles.btnOutline}>Log In</Link>
          <Link href="/register" className={styles.btnPrimary}>Get Started</Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          AI-Powered Matching Engine
        </div>

        <h1 className={styles.heroTitle}>
          Retrivo —{" "}
          <span className={styles.gradientText}>Lost &amp; Found</span>
          <br />
          Reimagined with AI
        </h1>

        <p className={styles.heroSubtitle}>
          Our intelligent platform automatically matches lost items with found reports,
          using computer vision and natural language processing to reunite people with
          their belongings — faster than ever.
        </p>

        <div className={styles.heroCTA}>
          <Link href="/lost" className={styles.ctaPrimary}>
            <span>📋</span> Report a Lost Item
          </Link>
          <Link href="/found" className={styles.ctaSecondary}>
            <span>🎁</span> Report a Found Item
          </Link>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>10K+</span>
            <span className={styles.statLabel}>Items Recovered</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>94%</span>
            <span className={styles.statLabel}>Match Accuracy</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>48h</span>
            <span className={styles.statLabel}>Avg. Recovery Time</span>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className={styles.features}>
        {[
          {
            icon: "🤖",
            title: "AI Matching",
            desc: "Our engine compares descriptions, images, and locations to find the best matches automatically.",
          },
          {
            icon: "📍",
            title: "Location-Aware",
            desc: "Search within a custom radius — your items are matched with nearby reports first.",
          },
          {
            icon: "🔔",
            title: "Instant Alerts",
            desc: "Get notified the moment a match is found. Never miss a potential match again.",
          },
          {
            icon: "🔒",
            title: "Secure Claims",
            desc: "Verified identity checks and secure claim workflows protect both reporters and finders.",
          },
        ].map((f) => (
          <div key={f.title} className={styles.featureCard}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <span>© 2026 Retrivo. Built with ❤️ and AI.</span>
      </footer>
    </main>
  );
}
