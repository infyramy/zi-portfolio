import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Lenis from "lenis";
import codexActivity from "./codex-activity.json";

const EMAIL = "iman@infyra.my";
const LINKEDIN = "https://www.linkedin.com/in/zahiruliman/";
const GITHUB = "https://github.com/zahiruliman";
const INSTAGRAM = "https://www.instagram.com/zahirul.iman/";

const workHighlights = [
  { title:"Calm & Chaos", context:"Event platform · Web experience", media:"/assets/zahirul/calm-and-chaos-highlight.jpg", ratio:1.992, alt:"Calm & Chaos beach race event website interface" },
  { tone:"mint", title:"be.mobile", context:"Visual identity · UI design", media:"https://zi.0w0.my/assets/work/Be.mobile%20website.png" },
  { tone:"apricot", title:"Innogauge", context:"UI/UX · Analytical platform", media:"https://zi.0w0.my/assets/work/Innogauge.png" },
  { tone:"lavender", title:"ZASSApp", context:"Product strategy · App design", media:"https://zi.0w0.my/assets/work/zassapp.png" },
  { tone:"rose", title:"ToyyibPay V3", context:"UI redesign proposal", media:"https://zi.0w0.my/assets/work/Redesigning%20(1).mp4", mediaType:"video" },
];

const experimentHighlights = [
  { tone:"violet", title:"LZS Exploration", context:"Visual exploration", media:"/assets/zahirul/explore-lzs.png", ratio:1.571, alt:"LZS visual design exploration" },
  { tone:"yellow", title:"MAIPS Mobility", context:"Mobility concept", media:"/assets/zahirul/explore-maips-mobility.png", ratio:1.913, alt:"MAIPS Mobility interface concept" },
  { tone:"cyan", title:"MERS999", context:"Interface exploration", media:"/assets/zahirul/explore-mers999.png", ratio:2.091, alt:"MERS999 interface exploration" },
  { tone:"coral", title:"UmrahPay", context:"Product mockup", media:"/assets/zahirul/explore-umrahpay.png", ratio:1.571, alt:"UmrahPay product mockup" },
];

const skillIcon = (name) => `/assets/zahirul/skill-icons/${name}.svg`;
const capabilityGroups = [
  { title:"Using now", tools:[
    ["Figma",skillIcon("figma")],["OpenAI Codex",skillIcon("openai")],["Claude Code",skillIcon("claude")],["Dokploy","/assets/zahirul/skill-icons/dokploy.png"],["Google AI Studio",skillIcon("google")],["GitHub",skillIcon("github")],["Docker",skillIcon("docker")],["VPS server",skillIcon("server")],
  ]},
  { title:"Less often now", tools:[
    ["WordPress",skillIcon("wordpress")],["Elementor",skillIcon("elementor")],["Adobe Lightroom",skillIcon("adobelightroom")],["MySQL",skillIcon("mysql")],
  ]},
  { title:"Familiar, needs a refresh", tools:[
    ["Adobe Photoshop",skillIcon("adobephotoshop")],["GitHub Actions",skillIcon("githubactions")],["Linux",skillIcon("linux")],["NGINX",skillIcon("nginx")],
  ]},
];

const photographyHighlights = [
  { title:"Wedding 01", context:"Portrait · Garden", media:"/assets/zahirul/pelatography-01.jpg", ratio:.8, alt:"Malay newlyweds smiling at each other in a green garden" },
  { title:"Wedding 02", context:"Preparation · Portrait", media:"/assets/zahirul/pelatography-02.jpg", ratio:.8, alt:"Malay groom preparing his traditional wedding attire outdoors" },
  { title:"Wedding 03", context:"Portrait · Minimal", media:"/assets/zahirul/pelatography-03.jpg", ratio:.804, alt:"Malay newlyweds photographed against a bright minimal sky" },
  { title:"Wedding 04", context:"People · Moments", media:"/assets/zahirul/pelatography-04.jpg", ratio:.8, alt:"Malay newlyweds holding hands beneath trees" },
  { title:"Wedding 05", context:"Pelatography · 2023", media:"/assets/zahirul/pelatography-05.jpg", ratio:.8, alt:"Pelatography Malay wedding photograph" },
  { title:"Wedding 06", context:"Pelatography · 2023", media:"/assets/zahirul/pelatography-06.jpg", ratio:.801, alt:"Pelatography Malay wedding portrait" },
  { title:"Wedding 07", context:"Pelatography · 2023", media:"/assets/zahirul/pelatography-07.jpg", ratio:.8, alt:"Pelatography wedding moment photographed in Penang" },
  { title:"Wedding 08", context:"Pelatography · 2023", media:"/assets/zahirul/pelatography-08.jpg", ratio:.8, alt:"Pelatography outdoor Malay wedding portrait" },
  { title:"Wedding 09", context:"Wide · Ceremony", media:"/assets/zahirul/pelatography-09.jpg", ratio:1.777, alt:"Malay newlyweds facing each other in warm sunlight beneath trees" },
  { title:"Wedding 10", context:"Details · Setting", media:"/assets/zahirul/pelatography-10.jpg", ratio:1.769, alt:"Wedding solemnisation welcome sign beside traditional Malay attire" },
];

const links = [
  ["SesiFoto", "https://sesifoto.my/"],
  ["Calm & Chaos", "https://calmandchaos.asia/book"],
  ["The Tulip Wedding", "https://thetulipwedding.com/"],
  ["LinkedIn", LINKEDIN],
  ["Instagram", INSTAGRAM],
  ["GitHub", GITHUB],
  ["Email", `mailto:${EMAIL}`],
];

function MenuIcon({ close = false }) {
  return <span className={`menu-icon ${close ? "close" : ""}`} aria-hidden="true"><i/><i/></span>;
}

function ThemeIcon({ dark }) {
  return <svg className={`theme-toggle-icon ${dark ? "is-dark" : "is-light"}`} viewBox="0 0 24 24" aria-hidden="true">
    <circle className="sun-core" cx="12" cy="12" r="4"/>
    <g className="sun-rays"><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></g>
    <path className="moon-shape" d="M20.3 15.2A8.4 8.4 0 0 1 8.8 3.7 8.5 8.5 0 1 0 20.3 15.2Z"/>
  </svg>;
}

function InternalLink({ href, children, className, onNavigate }) {
  const navigate = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState({}, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
    onNavigate?.();
  };
  return <a href={href} className={className} onClick={navigate}>{children}</a>;
}

function SectionLink({ id, title, onNavigate }) {
  const href = `/#${id}`;
  const navigate = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || window.location.pathname !== "/") return;
    event.preventDefault();
    onNavigate?.();
    window.history.replaceState({}, "", href);
    window.requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      if (window.__portfolioSmoothScroll) window.__portfolioSmoothScroll.scrollTo(target, { duration:1.05 });
      else target.scrollIntoView({ behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"start" });
    });
  };
  return <a href={href} onClick={navigate}>{title}</a>;
}

function SiteChrome({ route }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [preference, setPreference] = useState(() => {
    const saved = localStorage.getItem("plud-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = preference;
    document.documentElement.dataset.themePreference = preference;
    localStorage.setItem("plud-theme", preference);
    const meta = document.querySelector('meta[name="theme-color"]');
    const dark = preference === "dark";
    meta?.setAttribute("content", menuOpen ? (dark ? "#222222" : "#070707") : (dark ? "#0a0a0a" : "#ffffff"));
  }, [preference, menuOpen]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);
  const dark = preference === "dark";
  const toggleTheme = (event) => {
    const nextTheme = dark ? "light" : "dark";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) {
      setPreference(nextTheme);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--theme-transition-x", `${bounds.left + bounds.width / 2}px`);
    root.style.setProperty("--theme-transition-y", `${bounds.top + bounds.height / 2}px`);
    root.classList.add("theme-is-transitioning");

    const transition = document.startViewTransition(() => {
      flushSync(() => setPreference(nextTheme));
    });
    transition.finished.finally(() => {
      root.classList.remove("theme-is-transitioning");
      root.style.removeProperty("--theme-transition-x");
      root.style.removeProperty("--theme-transition-y");
    });
  };
  return <>
    <header className={`site-header ${menuOpen ? "menu-is-open" : ""}`}>
      <div className="site-controls" aria-label="Site controls">
        <button className="header-control menu-control" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen(v => !v)}>
          <MenuIcon close={menuOpen}/>
          <span className="header-control-label">{menuOpen ? "Close" : "Menu"}</span>
        </button>
        <button className={`header-control theme-control ${dark ? "is-dark" : "is-light"}`} aria-label={`Switch to ${dark ? "light" : "dark"} mode`} aria-pressed={dark} title={`Switch to ${dark ? "light" : "dark"} mode`} onClick={toggleTheme}><ThemeIcon dark={dark}/></button>
      </div>
    </header>
    <div id="site-menu" className={`site-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen} inert={!menuOpen}>
      <div className="menu-shell">
        <nav className="menu-nav" aria-label="Primary navigation">
          <SectionLink id="introduction" title="About" onNavigate={close}/>
          <SectionLink id="work-highlights" title="Selected work" onNavigate={close}/>
          <SectionLink id="past-work" title="Past work" onNavigate={close}/>
          <SectionLink id="experiments" title="Experiments" onNavigate={close}/>
          <SectionLink id="infyra" title="Digital products" onNavigate={close}/>
          <SectionLink id="photography" title="Photography" onNavigate={close}/>
          <SectionLink id="contact" title="Let’s talk" onNavigate={close}/>
        </nav>
        <div className="menu-footer">
          <div className="menu-contact">
            <p>Have a product, website or system in mind?</p>
            <div className="menu-actions"><a className="menu-primary-action" href={`mailto:${EMAIL}`}>Email me <span aria-hidden="true">↗</span></a><a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a></div>
            <div className="menu-socials"><a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a><a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a></div>
          </div>
          <figure className="menu-illustration" aria-hidden="true"><img src="/assets/zahirul/zahirul-creative-tools.webp" alt=""/></figure>
        </div>
      </div>
    </div>
  </>;
}

function Footer() { return <footer className="site-footer">
  <div className="footer-cta"><span>Have something in mind?</span><a href={`mailto:${EMAIL}`}>Say hello <span aria-hidden="true">↗</span></a></div>
  <div className="footer-signoff">
    <p>© 2026 Zahirul Iman · Malaysia</p>
    <nav aria-label="Footer links"><a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a><a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a><a href={`mailto:${EMAIL}`}>Email</a></nav>
  </div>
</footer>; }

function SocialIcon({ type }) {
  if (type === "linkedin") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.2H3.2V21h3.3V8.2ZM4.9 3A1.9 1.9 0 1 0 5 6.8 1.9 1.9 0 0 0 4.9 3ZM21 13.7c0-3.9-2.1-5.8-4.9-5.8-2.2 0-3.3 1.2-3.8 2.1V8.2H9V21h3.3v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2.1 1.9 2.1 3.4V21H21v-7.3Z"/></svg>;
  if (type === "instagram") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.7" r="1" className="icon-dot"/></svg>;
  if (type === "github") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.7 9.7 0 0 0-3.1 18.9c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.7.1-.7.1-.7 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-4.8 0-1.1.4-1.9 1-2.6-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.2 9.2 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.5 1 2.6 0 3.7-2.3 4.5-4.6 4.8.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.7 9.7 0 0 0 12 2.5Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.8" y="5" width="18.4" height="14" rx="2.4"/><path d="m4.2 7 7.8 6 7.8-6"/></svg>;
}

function SocialLinks({ includeGitHub = false }) {
  const items = [
    ["linkedin", "LinkedIn", LINKEDIN, "#0a66c2"],
    ["email", "Email", `mailto:${EMAIL}`, "#ea4335"],
    ["instagram", "Instagram", INSTAGRAM, "#e4405f"],
    ...(includeGitHub ? [["github", "GitHub", GITHUB, "var(--ink)"]] : []),
  ];
  return <div className="social-links" aria-label="Contact links">{items.map(([type,label,href,color])=><a key={type} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer" aria-label={label} title={label} style={{"--social-active":color}}><SocialIcon type={type}/></a>)}</div>;
}

function WhatIWorkWith() {
  return <section className="capabilities-section page-column" id="capabilities" aria-labelledby="capabilities-title" data-motion="list">
    <div className="section-heading"><h2 id="capabilities-title">Tools I’ve worked with</h2></div>
    <ul className="capability-list">
      {capabilityGroups.map((group,index)=><li className="capability-row" key={group.title} style={{"--motion-index":index}}>
        <h3>{group.title}</h3>
        <div className="capability-tools" role="list" aria-label={`${group.title} tools and skills`}>
          {group.tools.map(([name,icon])=><span className="capability-tool" role="listitem" key={name} data-label={name} title={name}>
            {icon.endsWith(".png")
              ? <img className="capability-tool-icon-image" src={icon} alt="" aria-hidden="true"/>
              : <i className="capability-tool-icon" style={{"--tool-icon":`url("${icon}")`}} aria-hidden="true"/>}
            <span className="visually-hidden">{name}</span>
          </span>)}
        </div>
      </li>)}
    </ul>
  </section>;
}

function VisualPlaceholder({ tone, label, className = "", decorative = false }) {
  return <div className={`visual-placeholder tone-${tone} ${className}`} role={decorative ? undefined : "img"} aria-label={decorative ? undefined : label} aria-hidden={decorative || undefined}/>;
}

function MediaPreview({ item, onClose }) {
  useEffect(() => {
    if (!item) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = event => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [item, onClose]);
  if (!item) return null;
  return <div className="media-preview" role="dialog" aria-modal="true" aria-label={`${item.title} preview`} onClick={onClose}>
    <div className="media-preview-panel" onClick={event => event.stopPropagation()}>
      <header>
        <div><strong>{item.title}</strong>{item.context && <span>{item.context}</span>}</div>
        <button type="button" onClick={onClose} aria-label="Close preview"><span aria-hidden="true">×</span></button>
      </header>
      <div className="media-preview-canvas">
        {item.media
          ? item.mediaType === "video"
            ? <video src={item.media} controls autoPlay muted playsInline aria-label={`${item.title} video preview`}/>
            : <img src={item.media} alt={item.alt || `${item.title} project preview`}/>
          : <VisualPlaceholder tone={item.tone || "slate"} label={`${item.title} preview placeholder`}/>}
      </div>
    </div>
  </div>;
}

function WorkReel({ items, label }) {
  const reelRef = useRef(null);
  const trackRef = useRef(null);
  const frameRef = useRef(0);
  const wheelFrameRef = useRef(0);
  const wheelIdleRef = useRef(0);
  const wheelTargetRef = useRef(0);
  const offsetRef = useRef(0);
  const state = useRef({ start:0, origin:0, dragging:false, moved:false, lastX:0, lastTime:0, velocity:0 });
  const gesture = useRef({ x:0, y:0, moved:false, lastScroll:0 });
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [wheelActive, setWheelActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const clamp = (value) => {
    const track = trackRef.current;
    const lastSlideWidth = track?.lastElementChild?.getBoundingClientRect().width || 0;
    const overflow = Math.max(0, (track?.scrollWidth || 0) - lastSlideWidth);
    return Math.max(-overflow, Math.min(0, value));
  };
  const moveTo = (value) => {
    const next = clamp(value);
    offsetRef.current = next;
    setOffset(next);
    return next;
  };
  useEffect(() => {
    const resize = () => {
      wheelTargetRef.current = moveTo(offsetRef.current);
    };
    const observer = new ResizeObserver(resize);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", resize);
    resize();
    return () => {
      cancelAnimationFrame(frameRef.current);
      cancelAnimationFrame(wheelFrameRef.current);
      window.clearTimeout(wheelIdleRef.current);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [items.length]);
  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;

    const settleWheel = () => {
      const distance = wheelTargetRef.current - offsetRef.current;
      if (Math.abs(distance) < .2) {
        moveTo(wheelTargetRef.current);
        wheelFrameRef.current = 0;
        return;
      }
      moveTo(offsetRef.current + distance * .2);
      wheelFrameRef.current = requestAnimationFrame(settleWheel);
    };
    const handleWheel = event => {
      if (event.ctrlKey || window.matchMedia("(max-width: 900px), (pointer: coarse)").matches) return;
      const rect = reel.getBoundingClientRect();
      const crossesViewportFocus = rect.top < window.innerHeight * .72 && rect.bottom > window.innerHeight * .28;
      if (!crossesViewportFocus) return;

      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const rawDelta = (Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX) * unit;
      if (Math.abs(rawDelta) < .5) return;

      const delta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), 180);
      wheelTargetRef.current = clamp(wheelTargetRef.current);
      const next = clamp(wheelTargetRef.current - delta);
      if (Math.abs(next - wheelTargetRef.current) < .2) return;

      event.preventDefault();
      event.stopPropagation();
      wheelTargetRef.current = next;
      setWheelActive(true);
      window.clearTimeout(wheelIdleRef.current);
      wheelIdleRef.current = window.setTimeout(() => setWheelActive(false), 180);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        moveTo(next);
        return;
      }
      if (!wheelFrameRef.current) wheelFrameRef.current = requestAnimationFrame(settleWheel);
    };

    reel.addEventListener("wheel", handleWheel, { passive:false });
    return () => reel.removeEventListener("wheel", handleWheel);
  }, [items.length]);
  const syncRatio = (event) => {
    const media = event.currentTarget;
    const width = media.videoWidth || media.naturalWidth;
    const height = media.videoHeight || media.naturalHeight;
    if (!width || !height) return;
    media.closest(".work-slide")?.style.setProperty("--media-ratio", width / height);
  };
  const down = (event) => {
    if (window.matchMedia("(max-width: 900px), (pointer: coarse)").matches) return;
    cancelAnimationFrame(frameRef.current);
    cancelAnimationFrame(wheelFrameRef.current);
    wheelFrameRef.current = 0;
    wheelTargetRef.current = offsetRef.current;
    state.current = { start:event.clientX, origin:offsetRef.current, dragging:true, moved:false, lastX:event.clientX, lastTime:performance.now(), velocity:0 };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event) => {
    if (!state.current.dragging) return;
    if (Math.abs(event.clientX - state.current.start) > 8) state.current.moved = true;
    const now = performance.now();
    const elapsed = Math.max(8, now - state.current.lastTime);
    state.current.velocity = ((event.clientX - state.current.lastX) / elapsed) * 16.67;
    state.current.lastX = event.clientX;
    state.current.lastTime = now;
    wheelTargetRef.current = moveTo(state.current.origin + event.clientX - state.current.start);
  };
  const release = (event, coast = true) => {
    if (!state.current.dragging) return;
    state.current.dragging = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!coast || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glide = () => {
      state.current.velocity *= .91;
      if (Math.abs(state.current.velocity) < .12) return;
      const before = offsetRef.current;
      const after = moveTo(before + state.current.velocity);
      wheelTargetRef.current = after;
      if (after === before) return;
      frameRef.current = requestAnimationFrame(glide);
    };
    frameRef.current = requestAnimationFrame(glide);
  };
  const startGesture = event => {
    gesture.current = { x:event.clientX, y:event.clientY, moved:false, lastScroll:gesture.current.lastScroll };
  };
  const trackGesture = event => {
    if (Math.hypot(event.clientX - gesture.current.x, event.clientY - gesture.current.y) > 8) gesture.current.moved = true;
  };
  const openPreview = (event, item) => {
    const justScrolled = performance.now() - gesture.current.lastScroll < 180;
    if (event.detail !== 0 && (gesture.current.moved || justScrolled)) return;
    setPreview(item);
  };
  return <><section ref={reelRef} className={`work-reel${dragging ? " is-dragging" : ""}${wheelActive ? " is-wheel-scrolling" : ""}`} aria-label={label} aria-roledescription="carousel" data-motion="media" onPointerDownCapture={startGesture} onPointerMoveCapture={trackGesture} onScroll={() => { gesture.current.lastScroll = performance.now(); }}>
    <div ref={trackRef} className="work-track" style={{ transform: `translate3d(calc((100vw - min(640px, 100vw - 32px))/2 + ${offset}px),0,0)` }} onPointerDown={down} onPointerMove={move} onPointerUp={release} onPointerCancel={event => release(event, false)}>
      {items.map(item => {
        const normalized = Array.isArray(item) ? { tone:item[0], title:item[1], context:item[2] } : item;
        return <figure className="work-slide" style={normalized.ratio ? {"--media-ratio":normalized.ratio} : undefined} key={`${label}-${normalized.title}`}><button className="work-media" type="button" onClick={event => openPreview(event, normalized)} aria-label={`Open ${normalized.title} preview`}>
          <VisualPlaceholder tone={normalized.tone} label={`${normalized.title} placeholder`} decorative={Boolean(normalized.media)}/>
          {normalized.media && (normalized.mediaType === "video"
            ? <video src={normalized.media} autoPlay muted loop playsInline onLoadedMetadata={syncRatio} aria-label={`${normalized.title} project preview`}/>
            : <img src={normalized.media} alt={normalized.alt || `${normalized.title} project preview`} loading="lazy" draggable="false" onLoad={syncRatio}/>)}
        </button><figcaption><strong>{normalized.title}</strong><span>{normalized.context}</span></figcaption></figure>;
      })}
    </div>
  </section><MediaPreview item={preview} onClose={() => setPreview(null)}/></>;
}

function ActivityCalendar({ activity, children, label }) {
  const months = [];
  let previousMonth = "";
  activity.days.forEach(day => {
    const month = day.date.slice(5,7);
    if (month === previousMonth) return;
    previousMonth = month;
    months.push({
      label:new Intl.DateTimeFormat("en", { month:"short", timeZone:"UTC" }).format(new Date(`${day.date}T00:00:00Z`)),
      week:day.week,
    });
  });
  return <div className="activity-grid-scroll" tabIndex="0" aria-label={label}>
    <div className="activity-calendar" style={{"--activity-weeks":activity.totalWeeks}}>
      <div className="activity-months" aria-hidden="true">
        {months.map(month => <span style={{gridColumn:month.week + 1}} key={`${month.label}-${month.week}`}>{month.label}</span>)}
      </div>
      {children}
    </div>
  </div>;
}

function CodexActivity() {
  const tools = {
    codex: { label:"Codex", source:"Recorded sessions with Codex" },
    claude: { label:"Claude Code", source:"Recorded sessions with Claude Code" },
    antigravity: { label:"Google Antigravity", source:"Recorded sessions with Google Antigravity" },
  };
  const [tool, setTool] = useState("all");
  const visibleTools = tool === "all" ? Object.keys(tools) : [tool];
  const selected = tool === "all" ? null : tools[tool];
  const selectedActivity = selected ? codexActivity.tools[tool] : null;
  const total = Object.values(codexActivity.tools).reduce((sum, activity) => sum + activity.total, 0);
  const combinedDays = codexActivity.tools.codex.days.map((day, index) => {
    const levels = Object.fromEntries(Object.keys(tools).map(key => [key, codexActivity.tools[key].days[index].level]));
    const counts = Object.fromEntries(Object.keys(tools).map(key => [key, codexActivity.tools[key].days[index].count]));
    const colours = Object.entries(levels).filter(([, level]) => level > 0).map(([key, level]) => `var(--${key}-${level})`);
    return { ...day, levels, counts, colours };
  });

  return <section className={`codex-activity page-column tool-${tool}`} aria-labelledby="activity-tool-title" data-motion="grid">
    <div className="codex-activity-head">
      <div>
        <h3 id="activity-tool-title">Building with AI tools</h3>
        <p className="activity-description">{selected ? selected.source : "Recorded sessions across Codex, Claude Code and Antigravity"}</p>
      </div>
      <p className="activity-total">{selected ? `${selectedActivity.total} sessions` : `${total} sessions`}</p>
    </div>
    <div className="activity-filter" role="group" aria-label="Filter activity by agent">
      {[["all","All agents"], ...Object.entries(tools).map(([key, option]) => [key, option.label])].map(([key, label]) =>
        <button type="button" className={`activity-filter-button tool-option-${key}`} aria-pressed={tool === key} onClick={() => setTool(key)} key={key}>
          {key !== "all" && <span className="tool-option-mark" aria-hidden="true"/>}{label}
        </button>)}
    </div>
    {tool === "all" && <ActivityCalendar activity={codexActivity.tools.codex} label="Scrollable combined activity grid"><div className="activity-grid activity-grid-mixed" role="img" aria-label="Combined activity sessions across Codex, Claude Code, and Antigravity in 2026">{combinedDays.map(day => <span className={`activity-cell activity-cell-mixed active-${day.colours.length}`} key={day.date} style={{gridColumn:day.week + 1,gridRow:day.weekday + 1,"--mix-a":day.colours[0] || "transparent","--mix-b":day.colours[1] || "transparent","--mix-c":day.colours[2] || "transparent"}} title={`${day.date}: Codex ${day.counts.codex}, Claude Code ${day.counts.claude}, Antigravity ${day.counts.antigravity}`} aria-hidden="true"/>)}</div></ActivityCalendar>}
    {tool !== "all" && <div className="activity-views">
      {visibleTools.map(key => {
        const activity = codexActivity.tools[key];
        return <div className={`activity-view tool-${key}`} key={key}><ActivityCalendar activity={activity} label={`Scrollable ${tools[key].label} activity grid`}><div className="activity-grid" role="img" aria-label={`${activity.total} ${tools[key].label} sessions in ${activity.year}`}>{activity.days.map(day=><span className={`activity-cell level-${day.level}`} key={day.date} style={{gridColumn:day.week + 1,gridRow:day.weekday + 1}} title={`${day.date}: ${day.count} session${day.count === 1 ? "" : "s"}`} aria-hidden="true"/>)}</div></ActivityCalendar></div>;
      })}
    </div>}
    <div className={`activity-legend ${tool === "all" ? "activity-legend-mixed" : ""}`} aria-hidden="true"><span>Less</span>{[0,1,2,3,4].map(level=><i className={`activity-cell level-${level}`} key={level}/>)}<span>More</span></div>
  </section>;
}

function SesiFotoFeature() {
  return <div className="page-column">
    <p className="infyra-feature-label">Our proudest product as a team</p>
    <a
      className="featured-product"
      data-motion="featured"
      href="https://sesifoto.my/"
      target="_blank"
      rel="noreferrer"
    >
      <svg className="feature-signal-border" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <rect className="feature-signal-track" x=".65" y=".65" width="98.7" height="98.7" rx="3" pathLength="100"/>
        <g className="feature-signal feature-signal-a">
          <rect className="feature-signal-halo" x=".65" y=".65" width="98.7" height="98.7" rx="3" pathLength="100"/>
          <rect className="feature-signal-core" x=".65" y=".65" width="98.7" height="98.7" rx="3" pathLength="100"/>
        </g>
        <g className="feature-signal feature-signal-b">
          <rect className="feature-signal-halo" x=".65" y=".65" width="98.7" height="98.7" rx="3" pathLength="100"/>
          <rect className="feature-signal-core" x=".65" y=".65" width="98.7" height="98.7" rx="3" pathLength="100"/>
        </g>
      </svg>
      <div className="featured-media"><img src="https://zi.0w0.my/assets/work/Frame.png" alt="SesiFoto product interface preview" loading="lazy" draggable="false"/></div>
      <div className="featured-copy">
        <div className="featured-heading">
          <h3>SesiFoto <span>↗</span></h3>
          <span className="feature-status"><i aria-hidden="true"/>In progress</span>
        </div>
        <p className="featured-description">Built from zero in four months for Raya 2026. Now improving it to support studios year-round.</p>
        <div className="product-proof" aria-label="SesiFoto Raya 2026 results">
          <p><strong>50+ studios</strong><span>joined the Raya session</span></p>
          <p><strong>RM3M+</strong><span>Raya photography slots booked during Ramadan</span></p>
          <p><strong>20K+</strong><span>bookings supported</span></p>
        </div>
      </div>
    </a>
  </div>;
}

function Home() {
  const heroIllustrationRef = useRef(null);
  const [showScrollRibbon, setShowScrollRibbon] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [ribbonShooting, setRibbonShooting] = useState(false);
  const [ribbonStaticShot, setRibbonStaticShot] = useState(false);
  const [ribbonMotionVisible, setRibbonMotionVisible] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraFlash, setCameraFlash] = useState(0);
  const cameraFlashTimerRef = useRef(null);
  const cameraResetTimerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("motion-enter");
        else if (entry.intersectionRatio === 0) entry.target.classList.remove("motion-enter");
      });
    }, { threshold:[0,.14], rootMargin:"0px 0px -7% 0px" });
    const targets = document.querySelectorAll("[data-motion]");
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const illustration = heroIllustrationRef.current;
    if (!illustration) return;
    const observer = new IntersectionObserver(([entry]) => {
      setShowScrollRibbon(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
    }, { threshold:0 });
    observer.observe(illustration);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    window.clearTimeout(cameraFlashTimerRef.current);
    window.clearTimeout(cameraResetTimerRef.current);
  }, []);

  useEffect(() => {
    let active = true;
    const sources = [
      "/assets/zahirul/zahirul-camera-motion-fast.webp",
      "/assets/zahirul/zahirul-camera-head-ribbon.png",
    ];
    Promise.allSettled(sources.map(source => new Promise(resolve => {
      const image = new Image();
      const done = () => resolve();
      image.onload = done;
      image.onerror = done;
      image.src = source;
      if (image.complete) done();
      else image.decode?.().then(done, () => {});
    }))).then(() => {
      if (active) setCameraReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("chat-mode", chatMode);
    document.documentElement.classList.toggle("chat-open", chatMode);
    return () => {
      document.body.classList.remove("chat-mode");
      document.documentElement.classList.remove("chat-open");
    };
  }, [chatMode]);

  const takeRibbonPhoto = () => {
    if (ribbonShooting || !cameraReady) return;
    window.clearTimeout(cameraFlashTimerRef.current);
    window.clearTimeout(cameraResetTimerRef.current);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setRibbonStaticShot(reduceMotion);
    setRibbonMotionVisible(false);
    setRibbonShooting(true);
    cameraResetTimerRef.current = window.setTimeout(() => {
      setRibbonShooting(false);
      setRibbonMotionVisible(false);
      setRibbonStaticShot(false);
    }, reduceMotion ? 700 : 1700);
  };

  const startRibbonSequence = () => {
    if (!ribbonShooting) return;
    window.clearTimeout(cameraFlashTimerRef.current);
    window.clearTimeout(cameraResetTimerRef.current);
    setRibbonMotionVisible(true);
    if (!ribbonStaticShot) {
      cameraFlashTimerRef.current = window.setTimeout(() => setCameraFlash(value => value + 1), 500);
    }
    cameraResetTimerRef.current = window.setTimeout(() => {
      setRibbonShooting(false);
      setRibbonMotionVisible(false);
      setRibbonStaticShot(false);
    }, ribbonStaticShot ? 620 : 1310);
  };

  return <main className="home-page">
    <button
      type="button"
      className={`scroll-ribbon ${showScrollRibbon && !chatMode ? "is-visible" : ""} ${ribbonShooting ? "is-shooting" : ""}`}
      onClick={takeRibbonPhoto}
      disabled={!showScrollRibbon || chatMode || !cameraReady}
      aria-label="Take a photo"
      title="Take a photo"
    >
      <span className={`scroll-ribbon-mark ${ribbonMotionVisible ? "has-motion" : ""}`}>
        <img className="ribbon-head" src="/assets/zahirul/zahirul-head.png" alt=""/>
        {ribbonShooting && <img
          className={`ribbon-motion ${ribbonMotionVisible ? "is-ready" : ""}`}
          src={ribbonStaticShot ? "/assets/zahirul/zahirul-camera-head-ribbon.png" : "/assets/zahirul/zahirul-camera-motion-fast.webp"}
          onLoad={startRibbonSequence}
          alt=""
        />}
      </span>
    </button>
    {cameraFlash > 0 && <span className="camera-flash" key={cameraFlash} aria-hidden="true" onAnimationEnd={() => setCameraFlash(0)}/>}
    <section className="home-intro page-column" id="introduction">
      <figure className="hero-illustration" ref={heroIllustrationRef}>
        <img src="/assets/zahirul/zahirul-creative-tools.webp" width="1080" height="940" alt="Illustration of Zahirul at work with product design, visual design, AI, and photography tools" fetchPriority="high"/>
      </figure>
      <h1>Hi, I&apos;m Zahirul Iman.<br/>Product Designer &amp; Digital Product Builder.</h1>
      <p>I work between product thinking, UI/UX, rapid prototyping, web, and systems, turning unclear ideas into something understandable, testable, and ready for the right people to build.</p>
      <p className="intro-note">The product comes first. Tools are how I make it real.</p>
      <SocialLinks/>
    </section>
    <WhatIWorkWith/>
    <section className="section-heading page-column" id="work-highlights" data-motion="copy"><h2>Selected work</h2><p>A closer look at products, interfaces, websites and systems I helped shape.</p></section>
    <WorkReel items={workHighlights} label="Work highlights"/>
    <PastWork/>
    <section className="experiment-section" id="experiments"><div className="page-column experiment-intro" data-motion="copy"><h2>Experiments</h2><p>I test AI, visual concepts, branding, rapid prototypes, interfaces, workflows, and new tools almost daily — mainly to understand what is possible before deciding what is actually useful.</p></div><WorkReel items={experimentHighlights} label="Creative experiments"/><CodexActivity/></section>
    <section className="infyra-chapter" id="infyra"><div className="story-section infyra-section page-column" data-motion="copy"><div><h2>Building digital products</h2><p className="section-lead"><strong>Infyra Ventures is a side venture I co-run alongside my main career.</strong></p><a className="infyra-site-link" href="https://infyra.my/" target="_blank" rel="noreferrer">Visit infyra.my <span aria-hidden="true">↗</span></a></div><div className="infyra-copy"><p>It gives us room to build selected digital products, websites, business systems, and client solutions, starting with the problem rather than the technology.</p><p>My role moves between product direction, UI/UX, prototyping, client discovery, project structure, and helping make the idea clear enough for the team to build.</p><blockquote>“Discuss first. Build only what makes sense.”</blockquote><p>Understand the real problem first. Build only the digital layer that is genuinely useful.</p></div></div><SesiFotoFeature/></section>
    <section className="photography-section" id="photography"><div className="page-column photography-intro" data-motion="copy"><div><h2>Photography</h2><p className="section-lead"><strong>Pelatography is my personal photography identity, active part-time since 2016.</strong></p></div><p>It started during university and never really left. These days I shoot mostly weddings and weekend assignments, often freelancing with different photography teams and studios rather than operating as a full-time studio.</p></div><PhotographyGear/><WorkReel items={photographyHighlights} label="Pelatography work"/></section>
    <Conversation active={chatMode} onActiveChange={setChatMode}/>
    <footer className="home-footer page-column"><p>© 2026 Zahirul Iman</p><p>Product Designer &amp; Digital Product Builder · Malaysia</p></footer>
  </main>;
}

function PhotographyGear(){
  const focalMarks = [{label:"24",position:0},{label:"35",position:18},{label:"70",position:75},{label:"85",position:100}];
  return <aside className="photography-gear page-column" aria-labelledby="photography-gear-title" data-motion="copy">
    <div className="gear-heading">
      <h3 id="photography-gear-title">Current camera kit</h3>
      <div className="gear-focal-scale" aria-hidden="true">
        {focalMarks.map(mark=><span className="gear-focal-mark" style={{"--focal-position":`${mark.position}%`}} key={mark.label}>{mark.label}</span>)}
      </div>
    </div>
    <dl className="gear-list">
      <div><dt>Body</dt><dd>Sony α7 III</dd></div>
      <div><dt>Glass</dt><dd>Sony FE 35mm f/1.8 <i/> Sony FE 85mm f/1.8 <i/> Sigma 24–70mm f/2.8</dd></div>
      <div><dt>Light</dt><dd>Godox TT685 <i/> Godox TT600 ×2</dd></div>
    </dl>
  </aside>;
}

function PastWork(){const [preview,setPreview]=useState(null);const items=[
  {type:"UX design",title:"Calm & Chaos",description:"Event booking web app; I focused on its UX and interface design.",href:"https://calmandchaos.asia/book"},
  {type:"Website",title:"The Tulip Wedding",description:"Wedding website; I worked across its content, design, and development.",href:"https://thetulipwedding.com/"},
  {type:"Campaign site",title:"Sunshine Raya Contest Submission",description:"Campaign entry website; I worked on its content, design, and development.",tone:"yellow"},
  {type:"UI/UX",title:"Innogauge Research Interface",description:"Research-platform interface; I created the UI/UX prototype in Figma.",media:"https://zi.0w0.my/assets/work/Innogauge.png",tone:"apricot"},
  {type:"Product design",title:"ZASSApp University Super App",description:"Company university super-app project; I completed the product design, with development handled separately.",media:"https://zi.0w0.my/assets/work/zassapp.png",tone:"lavender"},
];return <><section className="story-section past-work page-column" id="past-work" data-motion="list"><div className="section-heading"><h2>Past work</h2></div><div className="project-index"><div className="project-index-head" aria-hidden="true"><span>Focus</span><span>Project</span><span/></div>{items.map((item,index)=>{const content=<><span className="project-type">{item.type}</span><span className="project-summary"><strong>{item.title}</strong><span>{item.description}</span></span><span className="project-visit">{item.href ? "Visit" : "Preview"} <span aria-hidden="true">{item.href ? "↗" : "＋"}</span></span></>;const style={"--motion-index":index};return item.href?<a className="project-row" href={item.href} target="_blank" rel="noreferrer" key={item.title} style={style}>{content}</a>:<button className="project-row" type="button" onClick={()=>setPreview(item)} key={item.title} style={style}>{content}</button>})}</div></section><MediaPreview item={preview} onClose={()=>setPreview(null)}/></>}

const portfolioSections = [
  { title:"Projects", items:[
    {meta:"Product + UX",title:"Preschool Management Platform",copy:["A role-based digital platform for a multi-branch preschool organisation, connecting central administrators, branch principals, teachers, and parents.","Work covered attendance, classrooms, student progress, announcements, calendars, messaging, billing reminders, dashboards, teacher workflows, and administration. My involvement spanned requirements, product structure, user flows, UI/UX, and prototypes."]},
    {meta:"AI + Product",title:"FAQ & Knowledge Assistant PoC",copy:["A proof-of-concept assistant designed to answer questions using approved organisational knowledge instead of unrestricted generic AI answers.","The concept included bilingual English and Malay conversations, document retrieval, FAQ management, a website widget, conversation history, feedback, analytics, and controlled fallback flows. The work combined research, product flow planning, prototyping, and practical retrieval experiments."]},
    {meta:"Systems",title:"Custom Business Platforms",copy:["I have helped shape customer applications, internal dashboards, admin systems, booking workflows, role-based platforms, operational tools, and client-specific digital solutions.","My role moves between product thinking, UI/UX, business requirements, rapid prototyping, and client discussions. The exact mix depends on the project."]},
  ]},
  { title:"Infyra Ventures", items:[
    {meta:"Co-founder · Product Designer · Part-time",title:"Discuss first. Build only what makes sense.",copy:["Infyra Ventures is a small three-person digital product studio I co-run alongside my main career. We build practical digital products, websites, business systems, and client-specific solutions.","I work across product direction, UI/UX, prototyping, web design, client discovery, project structure, AI-assisted exploration, ideas, and product strategy. The goal is to understand the real problem first, then add only the digital layer that actually solves it."]},
  ]},
  { title:"Selected Web Work", items:[
    {meta:"Product + Web",title:"SesiFoto ↗",href:"https://sesifoto.my/",copy:["A product, website, and platform experience built around photography studio operations and customer booking workflows."]},
    {meta:"Web",title:"Calm & Chaos ↗",href:"https://calmandchaos.asia/book",copy:["Selected website work delivered as part of my web and digital product practice."]},
    {meta:"Web",title:"The Tulip Wedding ↗",href:"https://thetulipwedding.com/",copy:["Selected website work delivered as part of my web and digital product practice."]},
  ]},
  { title:"Product Design", items:[
    {meta:"UI/UX",title:"From Requirements to Real Product Flows",copy:["I don’t treat UI/UX as simply making screens look polished. The work starts with what users need to do, who the different users are, what happens before and after an action, which information matters, what happens when something goes wrong, and what developers actually need to build.","From there, I turn requirements into journeys, flows, interfaces, prototypes, and developer-ready product direction."]},
    {meta:"Rapid prototyping",title:"Working Product Before Perfect Screens",copy:["I use AI-assisted tools and rapid prototyping when a working experience communicates the product better than static screens.","The goal is not production code. It is to make the product clear enough for users, stakeholders, and developers to understand the real experience before committing to a full build. Figma still has its place; the medium depends on what needs to be communicated."]},
  ]},
  { title:"AI & Experimentation", items:[
    {meta:"Useful before fashionable",title:"AI is a tool in the workflow, not the product strategy.",copy:["I use it for rapid product prototyping, research, idea and UI exploration, workflow experiments, knowledge assistants, RAG and FAQ concepts, and visual experimentation.","I’m interested in where AI genuinely removes friction or makes a product better, not adding an AI button because everything suddenly needs one."]},
  ]},
  { title:"Delivery & DevOps", items:[
    {meta:"Beyond the design file",title:"Understanding what happens after design",copy:["I’m not positioning myself as a hardcore DevOps engineer, but I like understanding what happens after the design is finished. I’ve worked with Docker, AWS EC2, Cloudflare, Git, GitHub Actions, CI/CD workflows, domains, DNS, and basic server deployment.","A product still has to move from idea → flow → interface → prototype → development → deployment → real users. I like understanding that whole journey."]},
  ]},
  { title:"Visuals", items:[
    {meta:"Creative background",title:"Intentional beyond the interface",copy:["My creative background crosses UI/UX, web design, graphic design, social visuals, brand-related design, AI-assisted visual exploration, and photography.","I care about hierarchy, composition, typography, mood, and whether something feels intentional — not only whether it technically looks clean."]},
  ]},
  { title:"Photography", items:[
    {meta:"Wedding & people",title:"Composition, timing, and honest moments",copy:["Photography has been part of my creative background for years. I shoot weddings and people with a preference for real moments, cinematic framing, emotion, and a nostalgic visual feel.","It shaped how I think about design: what should be visible, what should disappear, and how small details completely change how something feels."]},
  ]},
  { title:"Selected Experience", items:[
    {meta:"Product Design · UI/UX · Digital Projects",title:"Connecting the pieces",copy:["My background spans UI/UX, digital products, websites, business systems, research, and product thinking.","Over time, my role became less about individual screens and more about connecting the business problem, user need, product flow, interface, prototype, and general technical context. That is where I work best."]},
  ]},
  { title:"Just for Fun", items:[
    {meta:"Experiments",title:"Learning by building",copy:["Not everything needs to become a startup. Sometimes I build, design, photograph, automate, self-host, or experiment simply because I want to understand how it works.","That curiosity is why my work crosses design, products, web, AI, servers, automation, and photography. Sometimes the fastest way to learn something is to try building it."]},
  ]},
];

function PortfolioContent(){return <div className="portfolio-sections page-column">{portfolioSections.map(section=><section className="portfolio-section" key={section.title}><h2>{section.title}</h2><div className="portfolio-list">{section.items.map(item=><article className="portfolio-item" key={item.title}><p className="portfolio-meta">{item.meta}</p><h3>{item.href?<a href={item.href} target="_blank" rel="noreferrer">{item.title}</a>:item.title}</h3>{item.copy.map(text=><p key={text}>{text}</p>)}</article>)}</div></section>)}</div>}

const CHAT_MAIN_OPTIONS = ["what", "fit", "start", "infyra", "photo", "contact"];
const CHAT_TOPICS = {
  what: {
    question:"What do you actually do?",
    answer:"Mostly product design, UI/UX and rapid prototyping. Usually I come in when the idea is still messy, then make it clear enough to discuss, test and pass to the right people to build.",
    next:["screens", "developer", "messy"],
  },
  screens: {
    question:"So you only design screens?",
    answer:"Not only. The screens are one part. I also look at the problem, user flow, different states, and what the product needs to communicate.",
    next:["start", "prototype", "handoff"],
  },
  developer: {
    question:"Can you code also?",
    answer:"I’m a product designer rather than a software developer. I use AI-assisted tools to make working prototypes, and I’m comfortable following how the technical pieces connect. For production work, I collaborate with developers.",
    next:["technical", "prototype", "dev-team"],
  },
  technical: {
    question:"Then how technical are you?",
    answer:"I’m comfortable discussing product structure, APIs, hosting, data flow and implementation trade-offs at a general level. It helps me design realistically and work smoothly with developers.",
    next:["dev-team", "screens", "contact"],
  },
  messy: {
    question:"What if the idea is still messy?",
    answer:"That is usually where I am most useful. We can sort out what the real problem is, who needs what, and what is worth building before spending too much time on the wrong thing.",
    next:["start", "fit", "selected-work"],
  },
  fit: {
    question:"What kind of work suits you?",
    answer:"Product design, UI/UX, rapid prototypes, websites and practical business systems. Best fit is when the team knows there is a problem, but the product direction is not clear yet.",
    next:["messy", "dev-team", "through-infyra"],
  },
  start: {
    question:"How do you usually start?",
    answer:"First I ask what is actually going wrong, who will use it, and what needs to happen. Once that is clear, then we can decide whether a flow, prototype or proper build makes sense.",
    next:["prototype", "screens", "dev-team"],
  },
  prototype: {
    question:"Why prototype first?",
    answer:"Because something clickable is easier to discuss than ten pages of explanation. It helps users, stakeholders and developers see the same thing before the team commits to a full build.",
    next:["production", "ai", "selected-work"],
  },
  production: {
    question:"Prototype means production-ready?",
    answer:"A prototype is mainly for testing the experience and making decisions clearer. When the direction works, the engineering team can turn it into the production version.",
    next:["dev-team", "handoff", "selected-work"],
  },
  "dev-team": {
    question:"Can you work with an existing dev team?",
    answer:"Yes. I can bring the product flow, interface and prototype into the discussion, then work with the developers to keep the intended experience clear as they build it.",
    next:["technical", "handoff", "contact"],
  },
  handoff: {
    question:"Do you handle documentation and QA?",
    answer:"My strongest contribution is the product flow, interface and prototype. For formal QA, documentation and engineering delivery, I work alongside the people responsible for those areas.",
    next:["technical", "what", "contact"],
  },
  ai: {
    question:"You use AI for everything?",
    answer:"No lah. I use it when it helps with research, exploration or prototyping. If it does not make the product clearer or more useful, no need to force it.",
    next:["prototype", "selected-work", "what"],
  },
  "through-infyra": {
    question:"Do projects go through Infyra?",
    answer:"Some selected projects can. Infyra is the side venture I co-run for products and client solutions outside my main role. Best to message first and see what makes sense.",
    next:["infyra", "built", "contact"],
  },
  infyra: {
    question:"Infyra is what?",
    answer:"A small three-person side venture I co-run. We build selected digital products, websites and systems when there is a real problem worth solving.",
    next:["infyra-team", "infyra-fulltime", "built"],
  },
  "infyra-team": {
    question:"Who runs Infyra?",
    answer:"Three of us. I co-run it with two other people, while keeping it separate from my main career.",
    next:["infyra-fulltime", "built", "through-infyra"],
  },
  "infyra-fulltime": {
    question:"Is Infyra your full-time job?",
    answer:"No. It is a side venture alongside my main career. It gives us space to build real products and selected client work without pretending to be a big agency.",
    next:["built", "through-infyra", "contact"],
  },
  built: {
    question:"What did you all build?",
    answer:"SesiFoto is the clearest example. It is a platform shaped around how photography studios actually handle their daily operations.",
    next:["sesifoto", "selected-work", "contact"],
  },
  sesifoto: {
    question:"What does SesiFoto do?",
    answer:"It connects studio bookings, schedules, packages, payments, communication and reporting in one practical workflow. The product is built around how the studios already work.",
    next:["sesifoto-link", "selected-work", "contact"],
  },
  photo: {
    question:"You still shoot photos?",
    answer:"Yes, still active. I started in 2016. These days it is mostly part-time, usually weddings and weekend jobs with different photography teams or studios.",
    next:["photo-work", "pelatography", "see-photography"],
  },
  "photo-work": {
    question:"What do you shoot now?",
    answer:"Mostly weddings and weekend assignments. A lot of the current work is as a freelance shooter with other teams or studios.",
    next:["pelatography", "see-photography", "instagram"],
  },
  pelatography: {
    question:"Pelatography still active?",
    answer:"Yes. Pelatography is still my personal photography identity. I just do not run it like a large full-time studio now.",
    next:["photo-work", "see-photography", "instagram"],
  },
  based: {
    question:"You are based in Malaysia?",
    answer:"Yes, Malaysia.",
    next:["fit", "contact", "selected-work"],
  },
  collaborate: {
    question:"Can we work together?",
    answer:"Possibly. Send me a short note about what you are trying to solve. We can see whether it fits me directly or makes more sense through Infyra.",
    next:["email", "linkedin", "through-infyra"],
  },
  contact: {
    question:"How can I contact you?",
    answer:"LinkedIn or email is easiest. Instagram is okay too if you are here for the photography or visual side.",
    next:["linkedin", "email", "instagram", "collaborate", "based"],
  },
};

const CHAT_ACTIONS = {
  "selected-work": { label:"See selected work", href:"#past-work" },
  "see-photography": { label:"See photography", href:"#photography" },
  "sesifoto-link": { label:"Visit SesiFoto", href:"https://sesifoto.my/" },
  linkedin: { label:"LinkedIn", href:LINKEDIN },
  email: { label:"Email", href:`mailto:${EMAIL}` },
  instagram: { label:"Instagram", href:INSTAGRAM },
};

function chatTime(date = new Date()) {
  return {
    label:date.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", hour12:false }),
    iso:date.toISOString(),
  };
}

function Conversation({ active, onActiveChange }) {
  const [renderChat, setRenderChat] = useState(active);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState(() => [
    { id:0, side:"incoming", text:"Hey, I’m Zahirul.", time:chatTime() },
    { id:1, side:"incoming", text:"What would you like to know?", time:chatTime() },
  ]);
  const [options, setOptions] = useState(CHAT_MAIN_OPTIONS);
  const [typing, setTyping] = useState(false);
  const transcriptRef = useRef(null);
  const backRef = useRef(null);
  const seen = useRef(new Set());
  const timersRef = useRef(new Set());
  const closeTimerRef = useRef(null);
  const nextId = useRef(2);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => window.clearTimeout(timer));
      window.clearTimeout(closeTimerRef.current);
    };
  }, []);
  useEffect(() => {
    window.clearTimeout(closeTimerRef.current);
    if (active) {
      setRenderChat(true);
      setClosing(false);
      return;
    }
    if (!renderChat) return;
    setClosing(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    closeTimerRef.current = window.setTimeout(() => {
      setRenderChat(false);
      setClosing(false);
    }, reducedMotion ? 0 : 190);
  }, [active, renderChat]);
  useEffect(() => {
    if (!active) return;
    window.requestAnimationFrame(() => backRef.current?.focus());
  }, [active]);
  useEffect(() => {
    const transcript = transcriptRef.current;
    if (!transcript) return;
    transcript.scrollTo({ top:transcript.scrollHeight, behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [messages, options, typing]);

  const schedule = (callback, delay) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);
    timersRef.current.add(timer);
  };
  const replyParts = answer => {
    if (Array.isArray(answer)) return answer;
    return answer.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(part => part.trim()).filter(Boolean) || [answer];
  };
  const choose = (key) => {
    if (typing) return;
    const topic = CHAT_TOPICS[key];
    setMessages(current => [...current, { id:nextId.current++, side:"outgoing", text:topic.question, time:chatTime() }]);
    setOptions([]);
    setTyping(true);
    const repeated = seen.current.has(key);
    seen.current.add(key);
    const replies = repeated
      ? ["We touched on that one earlier.", "You can scroll up or choose another topic below."]
      : replyParts(topic.answer);
    const finishReply = () => setOptions(repeated ? CHAT_MAIN_OPTIONS : topic.next);
    const deliver = index => {
      setTyping(false);
      setMessages(current => [...current, {
        id:nextId.current++,
        side:"incoming",
        text:replies[index],
        time:chatTime(),
      }]);
      if (index === replies.length - 1) {
        finishReply();
        return;
      }
      schedule(() => {
        setTyping(true);
        schedule(() => deliver(index + 1), 320 + Math.random() * 300);
      }, 120 + Math.random() * 100);
    };
    const firstDelay = Math.min(1100, 500 + replies[0].length * 4 + Math.random() * 180);
    schedule(() => deliver(0), firstDelay);
  };

  const showMainOptions = () => setOptions(CHAT_MAIN_OPTIONS);
  const showingMainOptions = options.length === CHAT_MAIN_OPTIONS.length && options.every((key, index) => key === CHAT_MAIN_OPTIONS[index]);
  const exitChat = () => onActiveChange?.(false);

  return <><section className="contact-launcher page-column" id="contact" data-motion="copy">
    <div className="contact-heading"><p>Have a project or question?</p><h2>Let’s talk</h2><span>Email or LinkedIn is the easiest way to reach me.</span></div>
    <nav className="contact-primary-actions" aria-label="Contact Zahirul"><a href={`mailto:${EMAIL}`}>Email me <span aria-hidden="true">↗</span></a><a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a></nav>
    <p className="contact-virtual">Want a quick preview first? <button type="button" className="chat-launch-button" onClick={() => onActiveChange?.(true)} aria-haspopup="dialog" aria-controls="portfolio-chat">Explore through chat <span aria-hidden="true">↗</span></button></p>
  </section>{renderChat && <section className={`conversation-section${closing ? " is-closing" : ""}`} id="portfolio-chat" role="dialog" aria-modal="true" aria-label="Conversation with Zahirul">
    <div className="chat-mobile-header">
      <button ref={backRef} type="button" className="chat-back" onClick={exitChat} aria-label="Back to portfolio">←</button>
      <span className="chat-mobile-avatar-anchor" aria-hidden="true"><img src="/assets/zahirul/zahirul-head.png" alt=""/></span>
      <span className="chat-mobile-identity"><strong>Zahirul Iman</strong><small>{typing ? "typing…" : "online"}</small></span>
      <a className="chat-header-email" href={`mailto:${EMAIL}`}>Email</a>
    </div>
    <div className="chat-shell">
    <div className="chat-transcript" aria-live="polite" aria-label="Conversation with Zahirul">
      <div className="chat-messages" ref={transcriptRef} data-lenis-prevent>
        {messages.map(message => <p className={`chat-bubble ${message.side}`} key={message.id}><span className="chat-copy">{message.text}</span><time className="chat-time" dateTime={message.time.iso}>{message.time.label}</time></p>)}
        {typing && <div className="chat-bubble incoming typing-bubble" aria-label="Zahirul is typing"><i/><i/><i/></div>}
        {!typing && <div className="chat-choices" aria-label="Quick replies">
          {options.map(key => {
            const action = CHAT_ACTIONS[key];
            if (action) {
              const external = action.href.startsWith("http");
              return <a className="chat-choice" href={action.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} onClick={!external && action.href.startsWith("#") ? exitChat : undefined} key={key}>{action.label}<span aria-hidden="true">{external ? "↗" : "→"}</span></a>;
            }
            return <button type="button" className="chat-choice" onClick={() => choose(key)} key={key}>{CHAT_TOPICS[key].question}</button>;
          })}
          {messages.length > 1 && !showingMainOptions && <button type="button" className="chat-choice chat-reset" onClick={showMainOptions}>Ask something else</button>}
        </div>}
      </div>
    </div>
  </div></section>}</>;
}

function DefinitionPage() { return <main className="definition-page page-column">
  <header className="article-hero"><h1>Product Design</h1><p className="deck">I connect business problems, user needs, product flows, interfaces, prototypes, and general technical context.</p><p>My strongest area is taking something messy or unclear and turning it into something people can actually see, understand, and test.</p></header>
  <ArticleSection eyebrow="Product thinking" title="Start before the interface exists."><p>What does the user need to do? Who are the different users? What happens first and after each action? Which information matters? What happens when something goes wrong? What does the developer need to build?</p><p>Answering those questions turns requirements into useful product direction instead of a collection of polished screens.</p></ArticleSection>
  <ArticleSection eyebrow="UI/UX" title="From requirements to real product flows."><p>I structure journeys, navigation, hierarchy, states, and interfaces so the product is coherent for users and realistic for the team building it.</p><p>The visual layer matters, but it is part of a wider job: making the product understandable.</p></ArticleSection>
  <ArticleSection eyebrow="Rapid prototyping" title="Working product before perfect screens."><p>When behavior is the question, I prefer giving people something they can click, test, and discuss. AI-assisted prototyping helps me move from an abstract idea to a concrete experience quickly.</p><p>The prototype is not automatically production code. Its job is to make decisions clearer before the full build.</p></ArticleSection>
  <ArticleSection eyebrow="Technical context" title="Understand enough to work together."><p>I am not a coder and I have not formally learned programming. I understand general technical concepts well enough to follow how the pieces connect and communicate the product clearly.</p><p>For implementation details, engineering decisions, documentation, and QA, I rely on the people who actually specialise in those areas.</p></ArticleSection>
  <Footer/>
  </main>; }

function ArticleSection({ eyebrow, title, children, className = "" }) { return <section className={`article-section ${className}`}><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{children}</section>; }

function Smiley({ large = false, mood = "auto" }) { return <div className={`smiley ${large ? "large" : ""} mood-${mood}`}><VisualPlaceholder tone="sun" label="Interactive smiley experiment placeholder" className="smiley-placeholder"/></div>; }

function InfinitePreview() { return <div className="infinite-preview"><div className="preview-cards">{Array.from({length:15},(_,i)=><i key={i}/>)}</div><span>DRAG TO EXPLORE</span></div>; }

function Playground() { return <main className="playground-page page-column"><header className="list-hero"><p>Not everything needs to become a startup. These are small interaction experiments I keep around because building is often the fastest way for me to understand an idea.</p></header><div className="playground-list">
  <InternalLink href="/playground/infinite-gallery" className="play-card"><div className="play-stage"><InfinitePreview/></div><div className="play-copy"><h2>Infinite Gallery <span>↗</span></h2><p>A draggable, zoomable field for exploring spatial interfaces and endless navigation.</p></div></InternalLink>
  <InternalLink href="/playground/smiley" className="play-card"><div className="play-stage smile-stage"><Smiley large/></div><div className="play-copy"><h2>Smiley <span>↗</span></h2><p>A tiny interaction study in cursor response, state, scale, and personality.</p></div></InternalLink>
  </div><Footer/></main>; }

function Bookmarks() { return <main className="bookmarks-page"><header className="links-intro page-column"><h1>Contact &amp; links</h1><p>Email or LinkedIn is easiest. Keep it simple.</p></header><div className="bookmark-list">{links.map(([title, href]) => <a key={title} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer"><span className="bookmark-inner"><span className="link-mark" aria-hidden="true">{title.slice(0,1)}</span><span>{title}</span><b>↗</b></span></a>)}</div><Footer/></main>; }

function BackLink() { return <InternalLink href="/playground" className="back-link">Back to Playground</InternalLink>; }

function InfiniteGallery() {
  const [position, setPosition] = useState({x:0,y:0});
  const [zoom, setZoom] = useState(100);
  const drag = useRef({active:false,x:0,y:0,ox:0,oy:0});
  const cards = useMemo(() => Array.from({length:48},(_,i)=>({x:(i%8)*230-805,y:Math.floor(i/8)*160-400,w:150+(i%3)*30,h:92+(i%2)*22})),[]);
  const down = e => { drag.current={active:true,x:e.clientX,y:e.clientY,ox:position.x,oy:position.y}; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = e => { if(drag.current.active) setPosition({x:drag.current.ox+e.clientX-drag.current.x,y:drag.current.oy+e.clientY-drag.current.y}); };
  const reset=()=>{setPosition({x:0,y:0});setZoom(100)};
  return <main className="gallery-experience" aria-label="Infinite gallery — drag to pan, pinch or use keyboard to zoom" onPointerDown={down} onPointerMove={move} onPointerUp={()=>drag.current.active=false} onPointerCancel={()=>drag.current.active=false}>
    <div className="gallery-plane" style={{transform:`translate3d(${position.x}px,${position.y}px,0) scale(${zoom/100})`}}>{cards.map((card,i)=><i key={i} style={{left:`calc(50% + ${card.x}px)`,top:`calc(50% + ${card.y}px)`,width:card.w,height:card.h}}/>)}</div>
    <div className="gallery-vignette"/>
    <div className="gallery-center"><span>✦</span><h1>Infinite Gallery</h1><p>DRAG TO WANDER · PINCH TO ZOOM</p></div>
    <p className="coordinate-readout">X {Math.round(position.x)} · Y {Math.round(position.y)} · 19 PASSED</p>
    <div className="zoom-control"><button aria-label="Zoom out" onClick={e=>{e.stopPropagation();setZoom(z=>Math.max(40,z-10))}}>−</button><button aria-label="Reset zoom to 100%" onClick={e=>{e.stopPropagation();setZoom(100)}}>{zoom}%</button><button aria-label="Zoom in" onClick={e=>{e.stopPropagation();setZoom(z=>Math.min(180,z+10))}}>+</button></div>
    {(position.x!==0||position.y!==0||zoom!==100)&&<button className="back-start" onClick={e=>{e.stopPropagation();reset()}}>Back to start</button>}
    <BackLink/><Footer/>
  </main>;
}

function SmileyExperience() {
  const [size,setSize]=useState("m"); const [mood,setMood]=useState("auto"); const [follow,setFollow]=useState(false); const [pos,setPos]=useState({x:0,y:0});
  const move=e=>{if(follow)setPos({x:(e.clientX/window.innerWidth-.5)*42,y:(e.clientY/window.innerHeight-.5)*26})};
  const reset=()=>{setSize("m");setMood("auto");setFollow(false);setPos({x:0,y:0})};
  return <main className="smiley-experience" onPointerMove={move}><BackLink/><div className={`pet size-${size}`} style={{transform:`translate(calc(-50% + ${pos.x}px),calc(-50% + ${pos.y}px))`}}><Smiley large mood={mood}/></div><p className="pet-instructions">DRAG IT · PET IT · SHAKE THE CURSOR · LET IT NAP</p><section className="pet-controls">
    <p>Size</p><div className="segmented">{["s","m","l"].map(v=><button className={size===v?"selected":""} onClick={()=>setSize(v)} key={v}>{v.toUpperCase()}</button>)}</div>
    <p>Mood</p><div className="segmented moods">{["auto","joy","nap","grr"].map(v=><button className={mood===v?"selected":""} onClick={()=>setMood(v)} key={v}>{v[0].toUpperCase()+v.slice(1)}</button>)}</div>
    <div className="follow-row"><span>Follow cursor</span><button aria-label="Follow cursor" role="switch" aria-checked={follow} className={`switch ${follow?"on":""}`} onClick={()=>setFollow(v=>!v)}><i/></button></div><button className="reset-button" onClick={reset}>Reset</button>
  </section><Footer/></main>;
}

function LoadingScreen({ onReveal, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setProgress(100);
      onReveal();
      onComplete();
      return;
    }

    let cancelled = false;
    const timers = new Set();
    const schedule = (callback, delay) => {
      const timer = window.setTimeout(callback, delay);
      timers.add(timer);
      return timer;
    };
    const start = Date.now();
    const image = new Image();
    const imageReady = new Promise(resolve => {
      image.onload = resolve;
      image.onerror = resolve;
      image.src = "/assets/zahirul/zahirul-creative-tools.webp";
      if (image.complete) resolve();
    });
    const fontsReady = document.fonts?.ready || Promise.resolve();
    const safetyTimeout = new Promise(resolve => schedule(resolve, 2400));
    const criticalReady = Promise.race([Promise.allSettled([imageReady, fontsReady]), safetyTimeout]);
    const minimumDisplay = new Promise(resolve => schedule(resolve, 700));
    const progressTimer = window.setInterval(() => {
      setProgress(current => Math.min(92, current + Math.max(1, Math.ceil((92 - current) * .09))));
    }, 42);

    Promise.all([criticalReady, minimumDisplay]).then(() => {
      if (cancelled) return;
      window.clearInterval(progressTimer);
      const elapsed = Date.now() - start;
      setProgress(100);
      schedule(() => {
        if (cancelled) return;
        setExiting(true);
        onReveal();
        schedule(() => {
          if (!cancelled) onComplete();
        }, 620);
      }, elapsed < 820 ? 120 : 70);
    });

    return () => {
      cancelled = true;
      window.clearInterval(progressTimer);
      timers.forEach(timer => window.clearTimeout(timer));
    };
  }, []);

  return <div className={`loading-screen${exiting ? " is-exiting" : ""}`} role="progressbar" aria-label="Loading portfolio" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
    <strong className="loading-progress">{String(progress).padStart(2, "0")}<small>%</small></strong>
  </div>;
}

function App() {
  const [route,setRoute]=useState(window.location.pathname.replace(/\/$/,"")||"/");
  const [siteReady, setSiteReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  useEffect(()=>{const sync=()=>{setRoute(window.location.pathname.replace(/\/$/,"")||"/");window.scrollTo(0,0)};window.addEventListener("popstate",sync);return()=>window.removeEventListener("popstate",sync)},[]);
  useEffect(()=>{
    if(route!=="/"||window.matchMedia("(prefers-reduced-motion: reduce)").matches||window.matchMedia("(pointer: coarse)").matches)return;
    const lenis=new Lenis({lerp:.085,smoothWheel:true,wheelMultiplier:.9,syncTouch:false});
    let frame;
    const raf=time=>{lenis.raf(time);frame=requestAnimationFrame(raf)};
    window.__portfolioSmoothScroll=lenis;
    frame=requestAnimationFrame(raf);
    return()=>{cancelAnimationFrame(frame);lenis.destroy();delete window.__portfolioSmoothScroll};
  },[route]);
  useEffect(()=>{
    const siteUrl="https://zahiruliman.com";
    const metadata={
      "/":{title:"Zahirul Iman · Product Designer",description:"I design digital products, practical systems and thoughtful experiences that make sense."},
      "/product-design-engineer":{title:"Product Design – Zahirul Iman",description:"How Zahirul Iman turns unclear requirements into useful product flows, interfaces and testable prototypes."},
      "/playground":{title:"Experiments – Zahirul Iman",description:"Interactive product, interface and visual experiments by Zahirul Iman."},
      "/bookmarks":{title:"Contact & Links – Zahirul Iman",description:"Contact Zahirul Iman through email, LinkedIn or Instagram."},
      "/playground/infinite-gallery":{title:"Infinite Gallery – Zahirul Iman",description:"An interactive spatial gallery experiment by Zahirul Iman."},
      "/playground/smiley":{title:"Smiley – Zahirul Iman",description:"A playful cursor and interaction experiment by Zahirul Iman."},
    };
    const current=metadata[route]||metadata["/"];
    const canonical=`${siteUrl}${route==="/"?"":route}`;
    document.title=current.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content",current.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content",current.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content",current.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content",canonical);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content",current.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content",current.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href",canonical);
  },[route]);
  let page=<Home/>;
  if(route==="/product-design-engineer") page=<DefinitionPage/>; else if(route==="/playground") page=<Playground/>; else if(route==="/bookmarks") page=<Bookmarks/>; else if(route==="/playground/infinite-gallery") page=<InfiniteGallery/>; else if(route==="/playground/smiley") page=<SmileyExperience/>;
  return <div className={`site-frame ${siteReady ? "is-ready" : "is-loading"}`}>
    <div className="site-content" aria-hidden={!siteReady} inert={!siteReady ? "" : undefined}>
      <SiteChrome route={route}/>
      <div className="route-stage" key={route}>{page}</div>
    </div>
    {showLoader && <LoadingScreen onReveal={() => setSiteReady(true)} onComplete={() => setShowLoader(false)}/>}
  </div>;
}

export { App };
export default App;
