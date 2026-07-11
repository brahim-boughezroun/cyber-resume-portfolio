"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { portfolio } from "@/data/portfolio";
import { MatrixRain } from "./matrix-rain";
import { Player } from "./player";

const zoneLabels = ["BOOT", "ABOUT", "SKILLS", "XP", "OPS", "UPLINK"];
const ZONE_COUNT = zoneLabels.length;
const DESKTOP_BREAKPOINT = 900;

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest("a, button, input, textarea, select, [contenteditable='true']"));
}

export function DesktopWorld() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState(0);
  const [jumping, setJumping] = useState(false);
  const jumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollFrame = useRef<number | null>(null);

  const maxOffset = Math.max(viewport.width * (ZONE_COUNT - 1), 1);
  const progress = Math.min(100, Math.max(0, Math.round((offset / maxOffset) * 100)));
  const currentZone = Math.min(
    ZONE_COUNT - 1,
    Math.max(0, Math.round(offset / Math.max(viewport.width, 1))),
  );

  const resize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const desktop = width >= DESKTOP_BREAKPOINT;

    setIsDesktop(desktop);
    setViewport({ width, height });

    if (!desktop) {
      setOffset(0);
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(resize);
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  useEffect(() => {
    if (!isDesktop) return;

    const sync = () => {
      if (scrollFrame.current !== null) return;

      scrollFrame.current = window.requestAnimationFrame(() => {
        setOffset(Math.min(maxOffset, Math.max(0, window.scrollY)));
        scrollFrame.current = null;
      });
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });

    return () => {
      window.removeEventListener("scroll", sync);
      if (scrollFrame.current !== null) window.cancelAnimationFrame(scrollFrame.current);
    };
  }, [isDesktop, maxOffset]);

  const jump = useCallback(() => {
    setJumping(true);
    if (jumpTimer.current) clearTimeout(jumpTimer.current);
    jumpTimer.current = setTimeout(() => setJumping(false), 620);
  }, []);

  const scrollToOffset = useCallback(
    (nextOffset: number, behavior: ScrollBehavior = "smooth") => {
      window.scrollTo({
        top: Math.min(maxOffset, Math.max(0, nextOffset)),
        behavior,
      });
    },
    [maxOffset],
  );

  const scrollToZone = useCallback(
    (index: number) => scrollToOffset(index * viewport.width),
    [scrollToOffset, viewport.width],
  );

  const move = useCallback(
    (direction: -1 | 1) => {
      const step = Math.max(220, viewport.width * 0.28);
      scrollToOffset(offset + direction * step);
    },
    [offset, scrollToOffset, viewport.width],
  );

  useEffect(() => {
    if (!isDesktop) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || isInteractiveTarget(event.target)) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        scrollToZone(0);
      } else if (event.key === "End") {
        event.preventDefault();
        scrollToZone(ZONE_COUNT - 1);
      } else if (event.code === "Space") {
        event.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDesktop, jump, move, scrollToZone]);

  useEffect(
    () => () => {
      if (jumpTimer.current) clearTimeout(jumpTimer.current);
    },
    [],
  );

  // The document scroll distance now matches the horizontal world distance exactly.
  const spacerHeight = useMemo(
    () => Math.max(viewport.height + maxOffset, viewport.height + 1),
    [maxOffset, viewport.height],
  );

  if (!isDesktop) return null;

  return (
    <div className="desktop-experience" style={{ height: spacerHeight }}>
      <div className="game-viewport">
        <MatrixRain />
        <div className="scanlines" aria-hidden="true" />
        <div className="corner corner-a" aria-hidden="true" />
        <div className="corner corner-b" aria-hidden="true" />

        <header className="hud">
          <button
            type="button"
            className="hud-brand"
            onClick={() => scrollToZone(0)}
            aria-label="Return to boot zone"
          >
            <span>{"SEC://RESUME"}</span>
            <strong>{portfolio.name}{" // "}{portfolio.role}</strong>
          </button>

          <nav className="hud-nav" aria-label="Portfolio zones">
            {zoneLabels.map((label, index) => (
              <button
                type="button"
                key={label}
                className={currentZone === index ? "active" : ""}
                aria-current={currentZone === index ? "page" : undefined}
                aria-label={`Open zone ${String(index).padStart(2, "0")}: ${label}`}
                onClick={() => scrollToZone(index)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div
            className="hud-progress"
            role="progressbar"
            aria-label="Portfolio exploration progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span>{progress}%</span>
            <div aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>
            <b>100%</b>
          </div>
        </header>

        <div
          className="world"
          style={{
            width: `${ZONE_COUNT * 100}vw`,
            transform: `translate3d(${-offset}px, 0, 0)`,
          }}
        >
          <BootZone />
          <AboutZone />
          <SkillsZone />
          <ExperienceZone />
          <ProjectsZone />
          <UplinkZone />
        </div>

        <div className="ground-grid" aria-hidden="true" />
        <div className="ground-line" aria-hidden="true" />
        <Player jumping={jumping} initials={portfolio.initials} />

        <div className="controls-hint" aria-label="World controls">
          <button type="button" className="key" onClick={() => move(-1)} aria-label="Move left">←</button>
          <button type="button" className="key" onClick={() => move(1)} aria-label="Move right">→</button>
          <small>scroll to move</small>
          <button type="button" className="key wide" onClick={jump}>SPACE</button>
          <small>jump</small>
        </div>
      </div>
    </div>
  );
}

function ZoneFrame({
  index,
  title,
  children,
  className = "",
}: {
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const zoneId = `zone-${index}`;

  return (
    <section id={zoneId} className={`zone ${className}`} aria-label={`Zone ${index}: ${title}`}>
      <div className="zone-marker">ZONE {index}{" // "}{title}</div>
      <div className="zone-content">{children}</div>
    </section>
  );
}

function BootZone() {
  return (
    <ZoneFrame index="00" title="BOOT" className="boot-zone">
      <div className="server-rack server-left" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
      </div>

      <div className="hero-terminal">
        <p className="terminal-command">root@brahim:~# ./interactive_resume.sh</p>
        <div className="eyebrow">SECURE IDENTITY LOADED</div>
        <h1>{portfolio.name}</h1>
        <div className="hero-meta">
          <h2>{portfolio.role}</h2>
          <span>{portfolio.years}</span>
        </div>
        <p className="tagline">{"// "}{portfolio.tagline}</p>
        <p className="walk-prompt">→ WALK RIGHT TO BEGIN THE MISSION</p>
      </div>

      <div className="access-terminal" aria-hidden="true">
        <span>AUTH_NODE_07</span>
        <strong>ACCESS</strong>
        <strong>GRANTED</strong>
        <small>identity verified</small>
      </div>
    </ZoneFrame>
  );
}

function AboutZone() {
  return (
    <ZoneFrame index="01" title="ABOUT ME" className="about-zone">
      <div className="about-layout">
        <div className="terminal-panel about-panel">
          <div className="panel-bar"><span>whoami.txt</span><i>● ● ●</i></div>
          <div className="terminal-copy">
            <p className="command">$ whoami</p>
            <h3>{portfolio.name} — {portfolio.role}</h3>
            <p className="command">$ cat about.txt</p>
            <p>{portfolio.about}</p>
            <p className="command">$ ls skills/</p>
            <div className="file-list">
              {portfolio.coreSkills.map((skill) => (
                <span key={skill}>./{skill.replaceAll(" ", "_").toLowerCase()}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="identity-network" aria-hidden="true">
          <div className="data-prop firewall">
            <span><b>FW</b></span>
            <small>FIREWALL<br />ACTIVE</small>
          </div>
          <div className="data-line"><i /><i /><i /><i /></div>
          <div className="data-prop identity">
            <span><b>ID</b></span>
            <small>IDENTITY<br />VERIFIED</small>
          </div>
        </div>
      </div>
    </ZoneFrame>
  );
}

function SkillsZone() {
  return (
    <ZoneFrame index="02" title="ARSENAL" className="skills-zone">
      <div className="skills-layout">
        <div className="skill-bank terminal-panel">
          <div className="panel-bar"><span>capability_matrix.sys</span><i>LIVE</i></div>
          {portfolio.skills.map((skill) => (
            <div className="skill-row" key={skill.name}>
              <div><span>{skill.name}</span><b>{skill.level}%</b></div>
              <div
                className="meter"
                role="progressbar"
                aria-label={`${skill.name} proficiency`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={skill.level}
              >
                <i style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="arsenal-side">
          <div className="tools-block">
            <p className="section-kicker">{"// TOOLS & TECH"}</p>
            <div className="tool-cloud">
              {portfolio.tools.map((tool) => <span key={tool}>{tool}</span>)}
            </div>
          </div>
          <div className="capability-grid">
            {portfolio.capabilities.map((item, index) => (
              <article key={item.title}>
                <small>MODULE_{String(index + 1).padStart(2, "0")}</small>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ZoneFrame>
  );
}

function ExperienceZone() {
  const missionStyle = {
    "--mission-count": Math.min(Math.max(portfolio.experience.length, 1), 4),
  } as CSSProperties;

  return (
    <ZoneFrame index="03" title="MISSION LOG" className="experience-zone">
      <div className="mission-track" aria-hidden="true" />
      <div className="missions" style={missionStyle}>
        {portfolio.experience.map((experience, index) => (
          <article className="mission-card" key={`${experience.period}-${experience.title}`}>
            <div className="mission-node"><i />{String(index + 1).padStart(2, "0")}</div>
            <p className="mission-date">{experience.period}</p>
            <h3>{experience.title}</h3>
            <h4>{experience.company}</h4>
            <ul>
              {experience.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </ZoneFrame>
  );
}


function ProjectsZone() {
  return (
    <ZoneFrame index="04" title="OPS REPO" className="projects-zone">
      <div className="repo-header">
        <p className="section-kicker">{"// DEPLOYED OPERATIONS"}</p>
        <h2>SELECTED REPOSITORIES</h2>
      </div>
      <div className="repo-grid">
        {portfolio.projects.map((project, index) => (
          <article className="repo-card" key={project.name}>
            <div className="repo-card-top"><span>{project.icon}</span><small>REPO_{String(index + 1).padStart(3, "0")}</small></div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="repo-tech">{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div>
            <a href={project.url} target="_blank" rel="noopener noreferrer">{project.cta} →</a>
          </article>
        ))}
      </div>
    </ZoneFrame>
  );
}

function UplinkZone() {
  return (
    <ZoneFrame index="06" title="UPLINK" className="uplink-zone">
      <div className="uplink-layout">
        <div className="uplink-terminal terminal-panel">
          <div className="panel-bar"><span>contact_info.txt</span><i>ENCRYPTED</i></div>
          <div className="terminal-copy">
            <p className="command">$ cat contact_info.txt</p>
            <div className="contact-row"><small>EMAIL</small><a href={`mailto:${portfolio.contact.email}`}>{portfolio.contact.email}</a></div>
            <div className="contact-row"><small>PHONE</small><a href={`tel:${portfolio.contact.phone}`}>{portfolio.contact.phone}</a></div>
            <p className="command">$ ls social/</p>
            <div className="social-links">
              {portfolio.socials.map((social) => (
                <a href={social.url} target="_blank" rel="noopener noreferrer" key={social.label}>{social.label}</a>
              ))}
            </div>
            <p className="command">$ ssh secure@{portfolio.domain}.sec</p>
            <p>{portfolio.contact.message}</p>
            <a className="hire-button" href={`mailto:${portfolio.contact.email}`}>
              HIRE ME / OPEN CHANNEL <span>↗</span>
            </a>
          </div>
        </div>
        <div className="signal-tower" aria-hidden="true"><i /><i /><i /><span /></div>
      </div>
    </ZoneFrame>
  );
}