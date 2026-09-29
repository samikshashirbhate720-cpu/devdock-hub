import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, ChevronsLeft, ChevronsRight, Code2, Command, Copy, FileCode2, Menu, Moon, Search, Sun, Terminal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Dockyard — The developer home base" },
    { name: "description", content: "Find your next starting point with Dockyard's quickstart, API guides, SDKs, sample apps, and changelog." },
    { property: "og:title", content: "Dockyard — The developer home base" },
    { property: "og:description", content: "Everything you need to go from idea to shipped. Explore guides, API references, SDKs, and sample apps." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Dockyard,
});

type Language = "JavaScript" | "Python" | "cURL";
type Filter = "All" | "Guides" | "API reference" | "SDKs" | "Sample apps";

const codeSamples: Record<Language, string> = {
  JavaScript: `import { Dockyard } from '@dockyard/sdk';

const dockyard = new Dockyard({
  apiKey: process.env.DOCKYARD_API_KEY
});

const project = await dockyard.projects.create({
  name: 'My next big thing',
  region: 'us-east-1'
});

console.log(project.id); // ready to build`,
  Python: `from dockyard import Dockyard
import os

client = Dockyard(
    api_key=os.environ["DOCKYARD_API_KEY"]
)

project = client.projects.create(
    name="My next big thing",
    region="us-east-1"
)

print(project.id)  # ready to build`,
  cURL: `curl -X POST https://api.dockyard.dev/v1/projects \\
  -H "Authorization: Bearer $DOCKYARD_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My next big thing",
    "region": "us-east-1"
  }'`,
};

const resources: { title: string; type: Exclude<Filter, "All">; description: string; time: string; details: string[] }[] = [
  { title: "Your first project", type: "Guides", description: "Set up your workspace and ship your first request in minutes.", time: "5 min read", details: ["Create an API key in your workspace.", "Install an SDK or use the REST API directly.", "Create a project and inspect the response."] },
  { title: "Authentication", type: "API reference", description: "Learn how to securely authenticate every request.", time: "Reference", details: ["Send your API key as a Bearer token in the Authorization header.", "Keep secret keys on your server, never in a client app.", "Rotate keys regularly from your workspace settings."] },
  { title: "JavaScript SDK", type: "SDKs", description: "The full toolkit for Node.js and modern JavaScript apps.", time: "v2.4", details: ["Install with npm install @dockyard/sdk.", "Initialize Dockyard with your API key.", "Use the typed projects API to create and manage resources."] },
  { title: "Starter dashboard", type: "Sample apps", description: "A working dashboard to fork, remix, and make your own.", time: "Example", details: ["Explore a sample project list and detail view.", "Connect your own API key to use real data.", "Adapt the UI to fit your product."] },
  { title: "Projects API", type: "API reference", description: "Create, retrieve, update, and archive projects.", time: "Reference", details: ["POST /v1/projects creates a new project.", "GET /v1/projects lists projects in your workspace.", "Use pagination parameters for larger collections."] },
  { title: "Python SDK", type: "SDKs", description: "Build with a Pythonic interface to every endpoint.", time: "v2.4", details: ["Install with pip install dockyard.", "Initialize the client with an environment variable.", "Call client.projects.create to get started."] },
  { title: "Webhook receiver", type: "Sample apps", description: "A ready-to-run example for event-driven workflows.", time: "Example", details: ["Receive project events at a public endpoint.", "Verify event signatures before processing.", "Respond quickly and process work asynchronously."] },
  { title: "Working with webhooks", type: "Guides", description: "React to events as they happen, reliably and securely.", time: "8 min read", details: ["Register an endpoint in your workspace.", "Verify the signature on each incoming event.", "Retry failed deliveries safely with idempotent handlers."] },
  { title: "Errors & rate limits", type: "API reference", description: "Understand response codes, retries, and request limits.", time: "Reference", details: ["Use HTTP status codes to distinguish client and server errors.", "Respect Retry-After headers on rate-limited responses.", "Apply exponential backoff for temporary failures."] },
];

const filterOptions: Filter[] = ["All", "Guides", "API reference", "SDKs", "Sample apps"];
const typeIcons = { Guides: BookOpen, "API reference": Code2, SDKs: Terminal, "Sample apps": FileCode2 };

const endpoints = [
  { method: "GET", path: "/v1/projects", label: "List projects", description: "Return projects in your workspace.", response: { data: [{ id: "prj_01", name: "My next big thing", region: "us-east-1" }], has_more: false } },
  { method: "POST", path: "/v1/projects", label: "Create project", description: "Create a project in your chosen region.", response: { id: "prj_02", name: "My next big thing", region: "us-east-1", status: "ready" } },
  { method: "GET", path: "/v1/projects/{id}", label: "Retrieve project", description: "Get one project by its ID.", response: { id: "prj_01", name: "My next big thing", region: "us-east-1", status: "ready" } },
  { method: "DELETE", path: "/v1/projects/{id}", label: "Archive project", description: "Archive a project you no longer need.", response: { id: "prj_01", archived: true } },
];

const installCommands = {
  JavaScript: "npm install @dockyard/sdk",
  Python: "pip install dockyard",
  cURL: "curl https://api.dockyard.dev/v1/projects -H 'Authorization: Bearer $DOCKYARD_API_KEY'",
} satisfies Record<Language, string>;

const docsGroups = [
  { label: "01 / GET STARTED", links: [{ label: "Overview", anchor: "top" }, { label: "Quickstart", anchor: "quickstart" }, { label: "SDK installation", anchor: "sdks" }] },
  { label: "02 / BUILD", links: [{ label: "Endpoint explorer", anchor: "api" }, { label: "Resource library", anchor: "library" }, { label: "Changelog", anchor: "changelog" }] },
  { label: "03 / CONNECT", links: [{ label: "Community", anchor: "community" }] },
];

function Dockyard() {
  const [language, setLanguage] = useState<Language>("JavaScript");
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<(typeof resources)[number] | null>(null);
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [online, setOnline] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteSearch, setPaletteSearch] = useState("");
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [explorerTab, setExplorerTab] = useState<"response" | "request">("response");
  const [projectId, setProjectId] = useState("prj_01");
  const [projectName, setProjectName] = useState("My next big thing");
  const [region, setRegion] = useState("us-east-1");
  const [installLanguage, setInstallLanguage] = useState<Language>("JavaScript");
  const [installCopied, setInstallCopied] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("dockyard-theme");
    setDark(stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches));
    const updateOnline = () => setOnline(window.navigator.onLine);
    updateOnline();
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    return () => { window.removeEventListener("online", updateOnline); window.removeEventListener("offline", updateOnline); };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("dockyard-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === "Escape") { setSelected(null); setMenuOpen(false); setPaletteOpen(false); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setPaletteOpen((value) => !value); }
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !["INPUT", "TEXTAREA"].includes(target.tagName) && !target.isContentEditable) {
        event.preventDefault();
        document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
        searchRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const filtered = resources.filter((item) => (filter === "All" || item.type === filter) && `${item.title} ${item.type} ${item.description}`.toLowerCase().includes(search.toLowerCase().trim()));

  const jumpToLibrary = (nextFilter: Filter) => {
    setFilter(nextFilter);
    setSearch("");
    setMenuOpen(false);
    document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
  };

  const copyCode = async () => {
    try {
      let copiedSuccessfully = false;
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(codeSamples[language]);
          copiedSuccessfully = true;
        } catch { /* Use the selection fallback when clipboard permission is unavailable. */ }
      }
      if (!copiedSuccessfully) {
        const temporary = document.createElement("textarea");
        temporary.value = codeSamples[language];
        temporary.style.position = "fixed";
        temporary.style.opacity = "0";
        document.body.appendChild(temporary);
        temporary.select();
        copiedSuccessfully = document.execCommand("copy");
        temporary.remove();
      }
      if (!copiedSuccessfully) throw new Error("Copy unavailable");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { setCopied(false); }
  };

  const navigateTo = (anchor: string) => {
    setPaletteOpen(false);
    setMenuOpen(false);
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
  };

  const currentEndpoint = endpoints[activeEndpoint];
  const requestPath = currentEndpoint.path.replace("{id}", encodeURIComponent(projectId || "prj_01"));
  const requestPreview = currentEndpoint.method === "POST"
    ? `curl -X POST https://api.dockyard.dev${requestPath} \\\n+  -H 'Authorization: Bearer $DOCKYARD_API_KEY' \\\n+  -H 'Content-Type: application/json' \\\n+  -d '${JSON.stringify({ name: projectName, region })}'`
    : `curl -X ${currentEndpoint.method} https://api.dockyard.dev${requestPath} \\\n+  -H 'Authorization: Bearer $DOCKYARD_API_KEY'`;
  const responsePreview = JSON.stringify(activeEndpoint === 1
    ? { ...currentEndpoint.response, name: projectName, region }
    : currentEndpoint.response, null, 2);
  const paletteItems = docsGroups.flatMap((group) => group.links).filter((item) => item.label.toLowerCase().includes(paletteSearch.toLowerCase()));

  return (
    <div className={`site-shell portal-shell min-h-screen bg-background text-foreground ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      <aside className={`docs-sidebar ${menuOpen ? "mobile-open" : ""}`} aria-label="Documentation navigation">
        <div className="sidebar-brand"><a href="#top" className="brand flex items-center gap-2.5" aria-label="Dockyard home" onClick={() => setMenuOpen(false)}><span className="brand-mark" aria-hidden="true"><span>▰</span></span><span className="sidebar-text">dockyard<span className="text-primary">.</span></span></a></div>
        <nav className="docs-nav">{docsGroups.map((group) => <div className="docs-nav-group" key={group.label}><div className="docs-nav-label sidebar-text">{group.label}</div>{group.links.map((link) => <a key={link.anchor} href={`#${link.anchor}`} title={link.label} onClick={() => setMenuOpen(false)}><span className="docs-nav-marker" aria-hidden="true" /><span className="sidebar-text">{link.label}</span></a>)}</div>)}</nav>
        <div className="sidebar-bottom"><span className="sidebar-text">DOCKYARD / DOCS<br />v2.4 — STABLE</span><span className="status-dot is-online" /></div>
      </aside>
      {menuOpen && <div className="sidebar-scrim" onClick={() => setMenuOpen(false)} />}
      <div className="portal-main">
      <div className="utility-bar">
        <div className="page-container flex h-full items-center justify-between gap-4">
          <span className="font-mono text-[11px] uppercase tracking-widest">ROOT / <span className="text-primary">DOCKYARD</span> / OVERVIEW</span>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider"><span className={`status-dot ${online ? "is-online" : "is-offline"}`} aria-hidden="true" />{online ? "Connection online" : "You're offline"}<span className="ml-2 opacity-50">↗</span></span>
        </div>
      </div>

      <header className="site-header">
        <div className="page-container flex h-[76px] items-center justify-between gap-4">
           <div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="header-icon hidden lg:inline-flex" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Collapse documentation navigation" : "Expand documentation navigation"} title={sidebarOpen ? "Collapse navigation" : "Expand navigation"}>{sidebarOpen ? <ChevronsLeft /> : <ChevronsRight />}</Button><span className="header-location">DOCS <span>/</span> OVERVIEW</span></div>
          <nav className="hidden items-center gap-9 md:flex" aria-label="Main navigation">
             <a href="#quickstart">Quickstart</a><a href="#api">API</a><a href="#sdks">SDKs</a><a href="#library">Library</a>
          </nav>
          <div className="flex items-center gap-2">
             <Button variant="outline" className="command-trigger" onClick={() => setPaletteOpen(true)} aria-label="Open command palette" title="Search pages and sections"><Search size={15} /><span>Jump to...</span><kbd>⌘ K</kbd></Button>
            <Button variant="ghost" size="icon" className="header-icon" onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"}>{dark ? <Sun /> : <Moon />}</Button>
            <Button variant="ghost" size="icon" className="header-icon md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</Button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-grid border-b border-border">
          <div className="page-container hero-inner">
            <div className="hero-copy">
               <div className="eyebrow"><span className="eyebrow-line" /> THE DEVELOPER HOME BASE / V2.4</div>
               <h1>Dockyard <span className="highlight-word">Hub<span className="highlight-swoosh" aria-hidden="true" /></span><span className="text-primary">.</span></h1>
               <p>From first request to the finer details. Your guides, API reference, SDKs, and working examples in one place.</p>
               <div className="hero-actions"><Button asChild className="primary-action"><a href="#quickstart">Start building <ArrowRight /></a></Button><a href="#api" className="text-link">Explore the API <ArrowDown size={16} /></a></div>
              <div className="hero-coordinate font-mono">// YOUR NEXT BUILD STARTS HERE <span>001 — 004</span></div>
            </div>
            <div className="hero-code-wrap">
              <div className="code-window">
                <div className="code-topline"><div className="flex items-center gap-2"><span className="window-dot" /><span className="window-dot" /><span className="window-dot" /></div><span>your-first-project.{language === "JavaScript" ? "js" : language === "Python" ? "py" : "sh"}</span><span className="code-top-icon">↗</span></div>
                <div className="code-toolbar"><div className="code-tabs" role="tablist" aria-label="Code language">{(["JavaScript", "Python", "cURL"] as Language[]).map((item) => <Button key={item} variant="ghost" role="tab" aria-selected={language === item} className={`code-tab ${language === item ? "active" : ""}`} onClick={() => { setLanguage(item); setCopied(false); }}>{item}</Button>)}</div><Button variant="ghost" className="copy-button" onClick={copyCode} aria-label={copied ? "Copied code" : "Copy code"} title="Copy code">{copied ? <Check size={15} /> : <Copy size={15} />}<span>{copied ? "Copied!" : "Copy"}</span></Button></div>
                <div className="code-body" role="tabpanel"><pre><code>{codeSamples[language].split("\n").map((line, i) => <span className="code-line" key={`${language}-${i}`}><span className="line-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><span className={line.trim().startsWith("//") || line.trim().startsWith("#") ? "code-comment" : ""}>{line || " "}</span></span>)}</code></pre></div>
                <div className="code-footer"><span><span className="terminal-cursor">▸</span> ready when you are</span><span>UTF-8 <span className="ml-3">{language}</span></span></div>
              </div>
              <div className="code-sticker font-mono">BUILD / SHIP / REPEAT <ArrowUpRight size={15} /></div>
            </div>
          </div>
        </section>

        <section id="start" className="start-section section-space scroll-mt-20">
          <div className="page-container">
            <div className="section-heading"><div><div className="section-kicker">01 / THE LAUNCHPAD</div><h2>Pick a place to start<span className="text-primary">.</span></h2></div><p>There’s no wrong first step. Choose the path that fits what you’re building.</p></div>
            <div className="start-grid">
              <a className="start-card" href="#quickstart"><span className="card-index">01 / GET MOVING</span><div className="start-icon"><ArrowUpRight size={25} strokeWidth={2} /></div><div><h3>Quickstart</h3><p>Zero to first request, without the detours.</p></div><span className="start-arrow"><ArrowUpRight size={20} /></span></a>
              <Button variant="ghost" className="start-card" onClick={() => jumpToLibrary("API reference")}><span className="card-index">02 / GO DEEPER</span><span className="start-icon"><Code2 size={25} strokeWidth={2} /></span><span className="card-copy"><strong>API reference</strong><span>Every endpoint, parameter, and response.</span></span><span className="start-arrow"><ArrowUpRight size={20} /></span></Button>
              <Button variant="ghost" className="start-card" onClick={() => jumpToLibrary("SDKs")}><span className="card-index">03 / YOUR LANGUAGE</span><span className="start-icon"><Terminal size={25} strokeWidth={2} /></span><span className="card-copy"><strong>SDKs</strong><span>Good tools for the way you work.</span></span><span className="start-arrow"><ArrowUpRight size={20} /></span></Button>
              <Button variant="ghost" className="start-card" onClick={() => jumpToLibrary("Sample apps")}><span className="card-index">04 / SEE IT WORK</span><span className="start-icon"><FileCode2 size={25} strokeWidth={2} /></span><span className="card-copy"><strong>Sample apps</strong><span>Real starting points you can make your own.</span></span><span className="start-arrow"><ArrowUpRight size={20} /></span></Button>
            </div>
          </div>
        </section>

        <section id="quickstart" className="quickstart-section scroll-mt-20"><div className="page-container quickstart-inner"><div className="quickstart-label"><span className="section-kicker">THE SHORT VERSION</span><h2>Up and running<br />in three steps<span className="text-primary">.</span></h2></div><div className="quickstart-steps"><div><span>01</span><p>Create your API key</p></div><div><span>02</span><p>Choose your language above</p></div><div><span>03</span><p>Copy the sample and run it</p></div></div><a href="#top" className="quickstart-back">Back to code <ArrowUpRight size={17} /></a></div></section>

        <section id="library" className="library-section section-space scroll-mt-20"><div className="page-container"><div className="section-heading library-heading"><div><div className="section-kicker">02 / THE LIBRARY</div><h2>Answers live here<span className="text-primary">.</span></h2></div><p>Guides, references, and working examples. Find exactly what you came for.</p></div><div className="library-controls"><div className="search-field"><Search size={19} aria-hidden="true" /><input ref={searchRef} type="search" placeholder="Search the library..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search the library" /><kbd>/</kbd></div><div className="filter-tabs" role="group" aria-label="Filter resources">{filterOptions.map((item) => <Button key={item} variant="ghost" aria-pressed={filter === item} className={`filter-tab ${filter === item ? "selected" : ""}`} onClick={() => setFilter(item)}>{item}</Button>)}</div></div><div className="results-line font-mono"><span>{String(filtered.length).padStart(2, "0")} RESOURCES {filter !== "All" && ` / ${filter.toUpperCase()}`}</span><span>EXPLORE ↓</span></div><div className="resource-grid">{filtered.map((item) => { const Icon = typeIcons[item.type]; return <Button variant="ghost" className="resource-card" key={item.title} onClick={() => setSelected(item)}><span className="resource-card-top"><span className="resource-type"><Icon size={15} /> {item.type}</span><ArrowUpRight size={18} /></span><span className="resource-card-body"><strong>{item.title}</strong><span>{item.description}</span></span><span className="resource-card-bottom">{item.time}<ChevronRight size={16} /></span></Button>; })}</div>{filtered.length === 0 && <div className="empty-state"><Search size={25} /><h3>No matches in the yard.</h3><p>Try a different term or browse all resources.</p><Button variant="outline" onClick={() => { setSearch(""); setFilter("All"); }}>Clear search</Button></div>}</div></section>

        <section id="changelog" className="changelog-section section-space scroll-mt-20"><div className="page-container changelog-layout"><div className="changelog-intro"><div className="section-kicker">03 / ALWAYS BUILDING</div><h2>Fresh off<br />the dock<span className="accent-period">.</span></h2><p>What’s new, what’s improved, and what you should know about.</p><div className="changelog-mark font-mono">// CHANGE IS A GOOD THING</div></div><div className="timeline"><div className="timeline-item"><div className="timeline-date">SEP 24, 2026</div><div className="timeline-content"><span className="badge-new">NEW</span><h3>Faster project creation</h3><p>New projects are ready to use in seconds, with a simpler setup flow and clearer defaults.</p></div><ArrowUpRight size={20} /></div><div className="timeline-item"><div className="timeline-date">SEP 10, 2026</div><div className="timeline-content"><span className="badge-new">NEW</span><h3>Python SDK 2.4 is here</h3><p>Better type hints, improved retries, and a more consistent developer experience.</p></div><ArrowUpRight size={20} /></div><div className="timeline-item"><div className="timeline-date">AUG 28, 2026</div><div className="timeline-content"><span className="badge-breaking">BREAKING</span><h3>Legacy auth headers retired</h3><p>Use Bearer tokens for all requests. Existing integrations should update their headers.</p></div><ArrowUpRight size={20} /></div></div></div></section>

        <section id="community" className="community-section scroll-mt-20"><div className="page-container community-inner"><div className="community-art" aria-hidden="true"><div className="art-ring ring-one" /><div className="art-ring ring-two" /><span>?</span><div className="art-cross">+</div></div><div className="community-copy"><div className="section-kicker">04 / YOU'RE NOT ON YOUR OWN</div><h2>Stuck? Ask a human<span className="text-primary">.</span></h2><p>Real questions deserve real answers. Reach out when you need a second set of eyes.</p><a className="community-link" href="mailto:help@dockyard.dev?subject=Dockyard%20developer%20help">Get in touch <ArrowUpRight size={19} /></a></div><div className="support-stats"><div><strong>1:1</strong><span>HUMAN HELP</span></div><div><strong>24/7</strong><span>SELF-SERVE DOCS</span></div><div><strong>4</strong><span>WAYS TO START</span></div></div></div></section>
      </main>
      <footer className="site-footer"><div className="page-container footer-inner"><a href="#top" className="brand flex items-center gap-2" aria-label="Dockyard home"><span className="brand-mark" aria-hidden="true"><span>▰</span></span><span>dockyard<span className="text-primary">.</span></span></a><span className="font-mono text-xs">BUILT FOR THE BUILDERS. © 2026 DOCKYARD.</span><div className="footer-links"><a href="#library">Library</a><a href="#changelog">Updates</a><a href="mailto:help@dockyard.dev">Support</a></div></div></footer>

      {selected && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}><div className="resource-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div className="dialog-top"><span className="resource-type">{selected.type}</span><Button variant="ghost" size="icon" onClick={() => setSelected(null)} aria-label="Close resource"><X size={20} /></Button></div><h2 id="dialog-title">{selected.title}</h2><p>{selected.description}</p><ol>{selected.details.map((detail) => <li key={detail}>{detail}</li>)}</ol><Button className="primary-action" onClick={() => setSelected(null)}>Back to library <ArrowRight /></Button></div></div>}
    </div>
  );
}