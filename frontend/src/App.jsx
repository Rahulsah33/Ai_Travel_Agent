import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  Bot,
  Bus,
  Calendar,
  Check,
  CheckCheck,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  Hotel,
  Info,
  Layers,
  Luggage,
  MapPin,
  Menu,
  MessageCircle,
  Plane,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Trash2,
  X,
  BookOpen,
} from "lucide-react";
import { Link, NavLink, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Hero3DVideoVisual from "./Hero3DVideoVisual";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const QUICK_PROMPTS = [
  {
    icon: Plane,
    category: "Flights",
    title: "Delhi to Paris Flights",
    prompt: "Search available flights from Delhi to Paris on 2026-11-08",
  },
  {
    icon: Hotel,
    category: "Stays",
    title: "Luxury Goa Resorts",
    prompt: "Search hotels in Goa under ₹6000 per night",
  },
  {
    icon: Sun,
    category: "Live Weather",
    title: "Kyoto Autumn Weather",
    prompt: "What is the live weather forecast in Kyoto for next week?",
  },
  {
    icon: Luggage,
    category: "Guidelines & RAG",
    title: "Flight Baggage Limits",
    prompt: "What are the standard cabin and check-in baggage policies for flights?",
  },
  {
    icon: Bus,
    category: "Bus Routes",
    title: "Delhi to Jaipur Bus",
    prompt: "Find available buses from Delhi to Jaipur on 2026-10-11",
  },
  {
    icon: BookOpen,
    category: "Destination Guide",
    title: "Kyoto Temple Etiquette",
    prompt: "Tell me about Kyoto cultural etiquette, temple guidelines, and travel tips",
  },
];

const DESTINATIONS = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    tag: "Romantic & Cultural",
    price: "₹48,700",
    theme: "paris",
    query: "Tell me about Paris travel tips, museum passes, and available flights from Delhi",
  },
  {
    id: "goa",
    name: "Goa",
    country: "India",
    tag: "Beaches & Nightlife",
    price: "₹4,100",
    theme: "goa",
    query: "Find flights and hotels in Goa for a relaxed beach trip",
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    tag: "Heritage & Temples",
    price: "₹38,500",
    theme: "kyoto",
    query: "What is Kyoto travel etiquette, best season to visit, and temple guidelines?",
  },
  {
    id: "delhi",
    name: "Delhi",
    country: "India",
    tag: "Historic & Culinary",
    price: "₹4,500",
    theme: "delhi",
    query: "Recommend top heritage walks and food spots in Old and New Delhi",
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    country: "India",
    tag: "Adventure & Yoga",
    price: "₹1,900",
    theme: "rishikesh",
    query: "What adventure activities and Ganga aarti timings are there in Rishikesh?",
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    tag: "Cosmopolitan & Arts",
    price: "₹51,200",
    theme: "london",
    query: "How does London Oyster card transit work and what are top sights to see?",
  },
  {
    id: "amalfi",
    name: "Amalfi Coast",
    country: "Italy",
    tag: "Scenic Coastal Drive",
    price: "₹62,000",
    theme: "amalfi",
    query: "Plan a dream itinerary along Italy's Amalfi Coast with stay recommendations",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    tag: "Modern Luxury & Desert",
    price: "₹18,900",
    theme: "dubai",
    query: "Find flights from Mumbai to Dubai on 2026-10-22 and hotel suggestions",
  },
];

/* -------------------------------------------------------------------------- */
/* LAYOUT COMPONENT                                                           */
/* -------------------------------------------------------------------------- */
function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="site-nav">
        <div className="nav-container">
          <Link className="logo" to="/" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-badge">
              <Compass size={20} strokeWidth={2.4} />
            </div>
            <div className="logo-text">
              <strong>Lizza</strong>
              <span>Travel Copilot</span>
            </div>
          </Link>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className={mobileMenuOpen ? "nav-links is-open" : "nav-links"}>
            <NavLink className="nav-link" to="/" end onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink className="nav-link" to="/discover" onClick={() => setMobileMenuOpen(false)}>
              Discover
            </NavLink>
            <NavLink className="nav-link" to="/about" onClick={() => setMobileMenuOpen(false)}>
              Architecture
            </NavLink>
            <NavLink className="nav-link" to="/chat" onClick={() => setMobileMenuOpen(false)}>
              Copilot Chat
            </NavLink>
          </nav>

          <Link className="nav-cta" to="/chat" id="nav-launch-chat">
            <span>Launch Copilot</span>
            <Sparkles size={14} />
          </Link>
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <div className="section-wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-badge">
                  <Compass size={18} />
                </div>
                <div className="logo-text">
                  <strong>Lizza</strong>
                  <span>AI Travel Copilot</span>
                </div>
              </div>
              <p>
                Intelligent itinerary planning, multi-turn conversation memory, and
                retrieval-augmented guidelines for seamless journeys worldwide.
              </p>
            </div>

            <div className="footer-col">
              <h5>Agent Capabilities</h5>
              <ul>
                <li><Link to="/chat">Multi-Turn Memory</Link></li>
                <li><Link to="/chat">RAG Travel Knowledge</Link></li>
                <li><Link to="/chat">Open-Meteo Weather</Link></li>
                <li><Link to="/chat">Flight & Bus Schedules</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Explore</h5>
              <ul>
                <li><Link to="/discover">Popular Destinations</Link></li>
                <li><Link to="/about">System Architecture</Link></li>
                <li><Link to="/discover">Curated Stays</Link></li>
                <li><Link to="/chat">Policy & Luggage FAQ</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Status & Tech</h5>
              <ul>
                <li><span className="badge-pill"><span className="live-dot" /> Spring AI 2.0.1</span></li>
                <li><span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Gemini 3 Flash & RAG</span></li>
                <li><span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Open-Meteo REST API</span></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} Lizza Travel Copilot. Built with Spring AI & React.</span>
            <span>Plan with certainty. Travel with ease.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HOME PAGE                                                                  */
/* -------------------------------------------------------------------------- */
function Home() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="section-wrap hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="badge-pill">
              <span className="live-dot" />
              <span>Next-Gen Travel AI Agent</span>
            </div>

            <h1>
              The world is waiting.
              <br />
              <em>Let’s go find it.</em>
            </h1>

            <p className="hero-description">
              Meet Lizza — your proactive travel copilot powered by Google Gemini,
              conversational memory, and a curated RAG knowledge base for verified
              flights, hotels, buses, and live destination forecasts.
            </p>

            <div className="hero-actions">
              <button
                className="btn-primary"
                onClick={() => navigate("/chat")}
                id="hero-start-planning-btn"
              >
                <span>Start Planning with AI</span>
                <ArrowRight size={17} />
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate("/discover")}
                id="hero-explore-btn"
              >
                <Compass size={16} />
                <span>Explore Destinations</span>
              </button>
            </div>

            {/* Quick Prompt Bar inside Hero */}
            <div className="hero-prompt-bar">
              <div className="hero-prompt-label">
                <Sparkles size={13} />
                <span>Try an Instant Query</span>
              </div>
              <div className="hero-prompt-chips">
                {QUICK_PROMPTS.slice(0, 4).map(({ title, prompt }) => (
                  <button
                    key={title}
                    className="hero-chip"
                    onClick={() => navigate(`/chat?prompt=${encodeURIComponent(prompt)}`)}
                  >
                    <span>{title}</span>
                    <ArrowRight size={12} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Hero3DVideoVisual />
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="section-wrap">
        <div className="metrics-bar">
          <div className="metric-item">
            <div className="metric-icon">
              <Layers size={22} />
            </div>
            <div className="metric-info">
              <h4>20 Messages</h4>
              <p>Sliding Window Chat Memory</p>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon">
              <BookOpen size={22} />
            </div>
            <div className="metric-info">
              <h4>100% RAG</h4>
              <p>Curated Guides & Policies</p>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon">
              <Sun size={22} />
            </div>
            <div className="metric-info">
              <h4>15-Day Live</h4>
              <p>Weather Forecast Sync</p>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon">
              <ShieldCheck size={22} />
            </div>
            <div className="metric-info">
              <h4>Zero Fakes</h4>
              <p>Strict Database Grounding</p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="section-wrap" style={{ paddingBottom: "100px" }}>
        <div className="section-header">
          <div className="badge-pill">INTELLIGENT ARCHITECTURE</div>
          <h2>
            Engineered for thoughtful,
            <br />
            <em>frictionless travel.</em>
          </h2>
          <p>
            Unlike generic chat tools, Lizza is anchored by Spring AI function calling,
            vector semantic search, and real-time transportation inventories.
          </p>
        </div>

        <div className="capabilities-grid">
          <div className="cap-card">
            <div className="cap-icon">
              <Plane size={24} />
            </div>
            <h3>Flight Scheduling</h3>
            <p>
              Search schedules across domestic and international routes with instant price,
              date, and terminal matching.
            </p>
            <span className="cap-badge">Instant Tool Calling</span>
          </div>

          <div className="cap-card">
            <div className="cap-icon">
              <Bus size={24} />
            </div>
            <h3>Intercity Bus Routes</h3>
            <p>
              Check luxury and sleeper bus departures between key hubs like Dehradun,
              Delhi, Jaipur, and Mumbai with arrival times.
            </p>
            <span className="cap-badge">Schedule Engine</span>
          </div>

          <div className="cap-card">
            <div className="cap-icon">
              <Hotel size={24} />
            </div>
            <h3>Hotel & Resort Stays</h3>
            <p>
              Filter verified hotels by city and custom price cap, complete with user ratings
              and location suitability.
            </p>
            <span className="cap-badge">Budget Filtering</span>
          </div>

          <div className="cap-card">
            <div className="cap-icon">
              <Sun size={24} />
            </div>
            <h3>Live Weather Forecasting</h3>
            <p>
              Direct Open-Meteo REST API integration offering geocoded multi-day high/low
              temperatures and precipitation chances.
            </p>
            <span className="cap-badge">Live API Integration</span>
          </div>

          <div className="cap-card">
            <div className="cap-icon">
              <Layers size={24} />
            </div>
            <h3>Multi-Turn Chat Memory</h3>
            <p>
              Persistent session-scoped memory keeps track of your travel preferences, dates,
              and passenger count across conversation turns.
            </p>
            <span className="cap-badge">Spring AI Memory</span>
          </div>

          <div className="cap-card">
            <div className="cap-icon">
              <BookOpen size={24} />
            </div>
            <h3>RAG Knowledge Base</h3>
            <p>
              Vector-indexed travel guides, baggage allowances, temple etiquette, and cancellation
              policies augmented into every response.
            </p>
            <span className="cap-badge">SimpleVectorStore + Advisor</span>
          </div>
        </div>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* DISCOVER DESTINATIONS PAGE                                                 */
/* -------------------------------------------------------------------------- */
function Discover() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all"
    ? DESTINATIONS
    : DESTINATIONS.filter((item) => {
        if (activeFilter === "india") return item.country === "India";
        if (activeFilter === "international") return item.country !== "India";
        return true;
      });

  return (
    <main className="section-wrap discover-page">
      <div className="section-header">
        <div className="badge-pill">CURATED DESTINATIONS</div>
        <h2>
          Places that inspire
          <br />
          <em>your next journey.</em>
        </h2>
        <p>
          Explore hand-picked cities and escapes. Click on any destination to
          prompt Lizza for real-time flights, weather, and insider guides.
        </p>
      </div>

      <div className="filter-pill-row">
        <button
          className={activeFilter === "all" ? "filter-btn active" : "filter-btn"}
          onClick={() => setActiveFilter("all")}
        >
          All Destinations
        </button>
        <button
          className={activeFilter === "india" ? "filter-btn active" : "filter-btn"}
          onClick={() => setActiveFilter("india")}
        >
          India Escapes
        </button>
        <button
          className={activeFilter === "international" ? "filter-btn active" : "filter-btn"}
          onClick={() => setActiveFilter("international")}
        >
          International Gateways
        </button>
      </div>

      <div className="destinations-grid">
        {filtered.map((dest) => (
          <article className={`dest-card ${dest.theme}`} key={dest.id}>
            <div className="dest-card-bg" />
            <div className="dest-card-overlay">
              <div className="dest-card-top">
                <span className="dest-badge">{dest.tag}</span>
                <Star size={16} fill="var(--amber-500)" color="var(--amber-500)" />
              </div>

              <div className="dest-card-bottom">
                <h3>{dest.name}</h3>
                <p>{dest.country}</p>

                <div className="dest-card-actions">
                  <div className="dest-price">
                    <small>Fares From</small>
                    <strong>{dest.price}</strong>
                  </div>

                  <button
                    className="dest-ask-btn"
                    onClick={() => navigate(`/chat?prompt=${encodeURIComponent(dest.query)}`)}
                  >
                    <span>Ask Lizza</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* ARCHITECTURE & ABOUT PAGE                                                  */
/* -------------------------------------------------------------------------- */
function About() {
  return (
    <main className="section-wrap about-page">
      <div className="section-header">
        <div className="badge-pill">INTELLIGENCE STACK</div>
        <h2>
          Architecture built for
          <br />
          <em>grounded execution.</em>
        </h2>
        <p>
          Lizza combines foundational LLM reasoning with stateful chat memory,
          vector-indexed knowledge retrieval, and typed tool calling.
        </p>
      </div>

      <div className="architecture-box">
        <div className="arch-header">
          <div className="badge-pill" style={{ background: "rgba(255,255,255,0.1)", color: "var(--emerald-400)" }}>
            FLOW SPECIFICATION
          </div>
          <h3>Under the Hood: Spring AI 2.0.1</h3>
          <p>How a user query transitions from natural language to verified execution.</p>
        </div>

        <div className="arch-grid">
          <div className="arch-card">
            <div className="arch-card-icon">
              <Layers size={22} />
            </div>
            <h4>1. Chat Memory</h4>
            <p>
              Uses <code>MessageWindowChatMemory</code> (20-message sliding window). Automatically
              correlates multi-turn context using the <code>Conversation-Id</code> header.
            </p>
          </div>

          <div className="arch-card">
            <div className="arch-card-icon">
              <BookOpen size={22} />
            </div>
            <h4>2. RAG Knowledge</h4>
            <p>
              <code>SimpleVectorStore</code> with <code>QuestionAnswerAdvisor</code> injects
              relevant travel guides, luggage policies, and local cultural rules into the prompt.
            </p>
          </div>

          <div className="arch-card">
            <div className="arch-card-icon">
              <Sun size={22} />
            </div>
            <h4>3. Live Weather Tool</h4>
            <p>
              Calls the live Open-Meteo REST geocoding and forecast API with zero API-key overhead,
              returning accurate temperatures and precipitation chances.
            </p>
          </div>

          <div className="arch-card">
            <div className="arch-card-icon">
              <ShieldCheck size={22} />
            </div>
            <h4>4. Verified Booking</h4>
            <p>
              Travel tools for flights, buses, and hotels query concrete database entities,
              preventing fabricated prices or flight numbers.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* CHAT / COPILOT FLAGSHIP VIEW                                               */
/* -------------------------------------------------------------------------- */
function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedMsgIdx, setCopiedMsgIdx] = useState(null);
  const messagesEndRef = useRef(null);

  const [conversationId, setConversationId] = useState(
    () => localStorage.getItem("lizza-conversation-id") || crypto.randomUUID(),
  );

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load chat history from backend on mount or when conversationId changes
  useEffect(() => {
    localStorage.setItem("lizza-conversation-id", conversationId);
    async function loadHistory() {
      try {
        const response = await fetch(`${API_URL}/chat/history`, {
          headers: { "Conversation-Id": conversationId },
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setMessages(data);
          }
        }
      } catch {
        // Server might be booting or offline
      }
    }
    loadHistory();
  }, [conversationId]);

  // Handle URL query parameters e.g. /chat?prompt=...
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryPrompt = params.get("prompt");
    if (queryPrompt && messages.length === 0) {
      send(queryPrompt);
    }
  }, [location.search]);

  async function startNewConversation() {
    try {
      await fetch(`${API_URL}/chat/history`, {
        method: "DELETE",
        headers: { "Conversation-Id": conversationId },
      });
    } catch {
      // ignore
    }
    const newId = crypto.randomUUID();
    setConversationId(newId);
    setMessages([]);
  }

  function copySessionId() {
    navigator.clipboard.writeText(conversationId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }

  function copyMessage(text, index) {
    navigator.clipboard.writeText(text);
    setCopiedMsgIdx(index);
    setTimeout(() => setCopiedMsgIdx(null), 2000);
  }

  async function send(text = input) {
    const value = text.trim();
    if (!value || loading) return;
    setInput("");
    setMessages((current) => [...current, { role: "user", text: value }]);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Conversation-Id": conversationId,
        },
        body: JSON.stringify({ message: value }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Lizza is temporarily unavailable. Please verify backend connection.");
      }

      const data = await response.json();
      setMessages((current) => [
        ...current,
        { role: "assistant", text: data.message },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: error.message },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section-wrap chat-page-wrap">
      <div className="chat-layout">
        {/* Left Sidebar */}
        <aside className="chat-sidebar">
          <div className="sidebar-header">
            <div className="badge-pill">
              <span className="live-dot" />
              <span>Lizza Copilot Active</span>
            </div>
            <h2>Travel Assistant</h2>
            <p>Your interactive travel copilot with multi-turn memory and RAG knowledge.</p>
          </div>

          <div className="rag-status-card">
            <h4>
              <BookOpen size={14} />
              <span>RAG Knowledge Synced</span>
            </h4>
            <p>
              Curated travel guides for Paris, Goa, Kyoto, Delhi, Rishikesh & baggage policies
              are active in vector storage.
            </p>
          </div>

          <div>
            <div className="sidebar-section-title">Quick Actions</div>
            <div className="quick-category-pills">
              <button
                className="category-pill-btn"
                onClick={() => send("Search flights from Delhi to Paris on 2026-11-08")}
              >
                <span>
                  <Plane size={15} />
                  <b>Search Flights</b>
                </span>
                <ArrowRight size={13} />
              </button>

              <button
                className="category-pill-btn"
                onClick={() => send("Find available buses from Delhi to Jaipur on 2026-10-11")}
              >
                <span>
                  <Bus size={15} />
                  <b>Search Buses</b>
                </span>
                <ArrowRight size={13} />
              </button>

              <button
                className="category-pill-btn"
                onClick={() => send("Search hotels in Goa under ₹5000 per night")}
              >
                <span>
                  <Hotel size={15} />
                  <b>Find Hotels</b>
                </span>
                <ArrowRight size={13} />
              </button>

              <button
                className="category-pill-btn"
                onClick={() => send("What is the live weather forecast in London for next week?")}
              >
                <span>
                  <Sun size={15} />
                  <b>Check Weather</b>
                </span>
                <ArrowRight size={13} />
              </button>

              <button
                className="category-pill-btn"
                onClick={() => send("What are the baggage allowances and cancellation policies for domestic flights?")}
              >
                <span>
                  <Luggage size={15} />
                  <b>Baggage & Policies</b>
                </span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Chat Window */}
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-agent-info">
              <div className="agent-avatar">
                <Bot size={22} />
              </div>
              <div className="agent-details">
                <strong>Lizza Travel Copilot</strong>
                <span>
                  <span className="live-dot" />
                  Online &bull; Active
                </span>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                className="session-id-btn"
                onClick={copySessionId}
                title="Click to copy Conversation UUID"
                id="copy-session-id-btn"
              >
                {copiedId ? <CheckCheck size={13} /> : <Copy size={13} />}
                <span>{copiedId ? "Copied ID" : `Session: ${conversationId.slice(0, 8)}...`}</span>
              </button>

              <button
                className="btn-reset-chat"
                onClick={startNewConversation}
                id="new-conversation-btn"
              >
                <Trash2 size={13} />
                <span>New Session</span>
              </button>
            </div>
          </div>

          <div className="chat-messages-container">
            {messages.length === 0 && (
              <div className="chat-welcome-state">
                <div className="welcome-icon-aura">
                  <Sparkles size={28} />
                </div>
                <h3>Where would you like to travel?</h3>
                <p>
                  Ask for flights, hotels, bus routes, destination guides, or weather updates.
                  Lizza remembers details across your entire conversation.
                </p>

                <div className="welcome-prompts-grid">
                  {QUICK_PROMPTS.map(({ icon: Icon, category, title, prompt }) => (
                    <button
                      key={title}
                      className="prompt-card-btn"
                      onClick={() => send(prompt)}
                    >
                      <div className="prompt-card-top">
                        <Icon size={14} />
                        <span>{category}</span>
                      </div>
                      <p>{prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div className={`message-row ${message.role}`} key={index}>
                {message.role === "assistant" && (
                  <div className="message-avatar">
                    <Bot size={18} />
                  </div>
                )}
                <div className="message-bubble">
                  <div className="message-bubble-content">{message.text}</div>
                  <div className="message-meta">
                    <button
                      className="btn-copy-msg"
                      onClick={() => copyMessage(message.text, index)}
                      title="Copy text"
                    >
                      {copiedMsgIdx === index ? (
                        <>
                          <Check size={12} color="var(--emerald-600)" />
                          <span style={{ color: "var(--emerald-600)" }}>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row assistant">
                <div className="message-avatar">
                  <Bot size={18} />
                </div>
                <div className="typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            className="chat-input-wrapper"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <div className="chat-input-box">
              <input
                id="chat-user-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask Lizza about flights, hotels, live weather, or baggage rules..."
                disabled={loading}
              />
              <button
                className="btn-send-message"
                disabled={loading || !input.trim()}
                type="submit"
                aria-label="Send message"
                id="chat-send-btn"
              >
                <Send size={16} />
              </button>
            </div>

            <div className="input-helper-text">
              <span>Press <b>Enter</b> to send &bull; Shift + Enter for new line</span>
              <span>Memory window: 20 messages</span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* ROOT APP COMPONENT                                                         */
/* -------------------------------------------------------------------------- */
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/about" element={<About />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Layout>
  );
}
