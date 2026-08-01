import { portfolio } from "@/data/portfolio";
import Link from "next/link";

const mobileZones = [
  { href: "#mobile-about", label: "ABOUT" },
  { href: "#mobile-experience", label: "XP" },
  { href: "#mobile-clearance", label: "CERTS" },
  { href: "#mobile-projects", label: "OPS" },
  { href: "#mobile-contact", label: "UPLINK" },
];

export function MobileResume() {
  return (
    <div className="mobile-resume">
      <div className="mobile-scanline" aria-hidden="true" />

      <header>
        <p>{"SEC://RESUME · MOBILE TERMINAL"}</p>
        <div className="mobile-avatar" aria-hidden="true"><span>{portfolio.initials}</span></div>
        <h1># {portfolio.name}</h1>
        <h2>{portfolio.role}</h2>
        <div className="mobile-year-chip">{portfolio.years}</div>
        <p>Interactive world is available on desktop. The complete readable resume is below.</p>
        <div className="mobile-hero-actions">
          <a className="mobile-primary-action" href={`mailto:${portfolio.contact.email}`}>OPEN CHANNEL →</a>
          <a className="mobile-secondary-action" href="#mobile-projects">VIEW PROJECTS ↓</a>
        </div>
      </header>

      <nav className="mobile-nav" aria-label="Mobile resume sections">
        {mobileZones.map((zone) => <a href={zone.href} key={zone.href}>{zone.label}</a>)}
      <Link href="/blog">BLOG</Link>
      </nav>

      <MobileSection id="mobile-about" title="ABOUT" command="cat about.txt">
        <p>{portfolio.about}</p>
        <div className="mobile-tags">
          {portfolio.coreSkills.map((skill) => <span key={skill}>{skill}</span>)}
        </div>
      </MobileSection>

      <MobileSection id="mobile-experience" title="EXPERIENCE" command="ls mission_log/">
        <div className="mobile-stack">
          {portfolio.experience.map((item, index) => (
            <article key={`${item.period}-${item.title}`}>
              <div className="mobile-card-index">MISSION_{String(index + 1).padStart(2, "0")}</div>
              <small>{item.period}</small>
              <h3>{item.title}</h3>
              <h4>{item.company}</h4>
              <ul>{item.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}</ul>
            </article>
          ))}
        </div>
      </MobileSection>

      <MobileSection id="mobile-clearance" title="CLEARANCE" command="verify certifications.key">
        <div className="mobile-badges">
          {portfolio.certifications.map((item) => (
            <article key={`${item.short}-${item.description}`}>
              <strong>{item.short}</strong>
              <span>{item.description}</span>
            </article>
          ))}
        </div>
      </MobileSection>

      <MobileSection id="mobile-projects" title="PROJECTS" command="git status --deployed">
        <div className="mobile-stack">
          {portfolio.projects.map((project, index) => (
            <article key={project.name}>
              <div className="mobile-card-index">REPO_{String(index + 1).padStart(3, "0")}</div>
              <small>{project.icon} DEPLOYED REPOSITORY</small>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="mobile-tags">{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div>
              <a href={project.url} target="_blank" rel="noopener noreferrer">{project.cta} →</a>
            </article>
          ))}
        </div>
      </MobileSection>

      <MobileSection id="mobile-contact" title="CONTACT" command="cat contact_info.txt">
        <p className="mobile-contact-message">{portfolio.contact.message}</p>
        <div className="mobile-contact">
          <a href={`mailto:${portfolio.contact.email}`}>{portfolio.contact.email}</a>
          <a href={`tel:${portfolio.contact.phone}`}>{portfolio.contact.phone}</a>
        </div>
        <div className="mobile-socials">
          {portfolio.socials.map((social) => (
            <a href={social.url} target="_blank" rel="noopener noreferrer" key={social.label}>{social.label}</a>
          ))}
        </div>
      </MobileSection>

      <footer>SESSION COMPLETE{" // "}{new Date().getFullYear()}</footer>
    </div>
  );
}

function MobileSection({
  id,
  title,
  command,
  children,
}: {
  id: string;
  title: string;
  command: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <div className="mobile-section-heading">
        <div className="mobile-section-label">ZONE{" // "}{title}</div>
        <h2>{title}</h2>
      </div>
      <p className="mobile-command">root@brahim:~# {command}</p>
      {children}
    </section>
  );
}