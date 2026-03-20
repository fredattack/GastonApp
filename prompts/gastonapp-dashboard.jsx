import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────
   GastonApp Dashboard v2
   Chat-Centric · Mobile → Tablet → Desktop
   ───────────────────────────────────────────── */

const PETS = [
  { id: 1, name: "Luna", type: "Chat", breed: "Siamois", age: "3 ans", avatar: "\ud83d\udc31", color: "#E8D9F5", status: "En forme" },
  { id: 2, name: "Max", type: "Chien", breed: "Golden Retriever", age: "5 ans", avatar: "\ud83d\udc15", color: "#B8F4DC", status: "Vaccin pr\u00e9vu" },
  { id: 3, name: "Nala", type: "Chat", breed: "Maine Coon", age: "2 ans", avatar: "\ud83d\udc08", color: "#FFD4C4", status: "En forme" },
  { id: 4, name: "Oscar", type: "Chien", breed: "Bouledogue", age: "4 ans", avatar: "\ud83d\udc36", color: "#FFE88C", status: "En forme" },
  { id: 5, name: "Milo", type: "Lapin", breed: "Nain B\u00e9lier", age: "1 an", avatar: "\ud83d\udc30", color: "#B8F4DC", status: "En forme" },
  { id: 6, name: "Cleo", type: "Chat", breed: "Persan", age: "6 ans", avatar: "\ud83d\udc31", color: "#E8D9F5", status: "Toilettage" },
  { id: 7, name: "Rex", type: "Chien", breed: "Berger Allemand", age: "3 ans", avatar: "\ud83d\udc15", color: "#FFD4C4", status: "En forme" },
  { id: 8, name: "Pip", type: "Oiseau", breed: "Canari", age: "2 ans", avatar: "\ud83d\udc26", color: "#FFE88C", status: "En forme" },
  { id: 9, name: "Zoe", type: "Chat", breed: "Bengal", age: "1 an", avatar: "\ud83d\udc08", color: "#B8F4DC", status: "Vaccin pr\u00e9vu" },
  { id: 10, name: "Rocky", type: "Chien", breed: "Labrador", age: "7 ans", avatar: "\ud83d\udc36", color: "#FFD4C4", status: "M\u00e9dicament" },
  { id: 11, name: "Simba", type: "Chat", breed: "Abyssin", age: "4 ans", avatar: "\ud83d\udc31", color: "#E8D9F5", status: "En forme" },
  { id: 12, name: "Bella", type: "Chien", breed: "Cavalier King Charles", age: "2 ans", avatar: "\ud83d\udc15", color: "#FFE88C", status: "En forme" },
];

const EVENTS = [
  { id: 1, pet: "Max", type: "Vaccin", date: "22 Mar", time: "14h00", color: "#7CEDC3" },
  { id: 2, pet: "Luna", type: "V\u00e9t\u00e9rinaire", date: "25 Mar", time: "10h30", color: "#D1B3E8" },
  { id: 3, pet: "Nala", type: "Toilettage", date: "28 Mar", time: "16h00", color: "#FFB59A" },
];

const INITIAL_MESSAGES = [
  { id: 1, from: "gaston", time: "09:00", text: "Bonjour Fred ! \ud83d\udc4b Voici le r\u00e9sum\u00e9 de ta journ\u00e9e :" },
  { id: 2, from: "gaston", time: "09:00", text: "\ud83d\udc15 Max a son vaccin annuel le 22 mars \u00e0 14h. Je te rappellerai la veille.\n\n\ud83d\udc31 Luna a mang\u00e9 normalement ce matin.\n\n\ud83d\udc08 Nala \u2014 rien de pr\u00e9vu aujourd\u2019hui, tout va bien !" },
  { id: 3, from: "user", time: "09:02", text: "Merci Gaston ! Tu peux me rappeler d\u2019acheter des croquettes pour Max ?" },
  { id: 4, from: "gaston", time: "09:02", text: "C\u2019est not\u00e9 ! \ud83d\udcdd Je t\u2019enverrai un rappel demain matin pour les croquettes de Max. Tu veux que je te sugg\u00e8re sa marque habituelle ?" },
];

const SUGGESTIONS = [
  "\ud83d\udcc5 Prochain RDV de Luna ?",
  "\ud83d\udc8a M\u00e9dicaments du jour",
  "\ud83c\udf5a Repas de ce soir",
  "\u2696\ufe0f Poids de Max",
];

// ── Icons ──
function Icon({ name, size = 24, color = "currentColor", bold = false }) {
  const sw = bold ? 2 : 1.5;
  const P = {
    paw: <><circle cx="128" cy="200" r="24" strokeWidth={sw} stroke={color} fill="none"/><circle cx="80" cy="140" r="18" strokeWidth={sw} stroke={color} fill="none"/><circle cx="176" cy="140" r="18" strokeWidth={sw} stroke={color} fill="none"/><circle cx="100" cy="84" r="16" strokeWidth={sw} stroke={color} fill="none"/><circle cx="156" cy="84" r="16" strokeWidth={sw} stroke={color} fill="none"/></>,
    chat: <><path d="M216 48H40a8 8 0 0 0-8 8V192a8 8 0 0 0 8 8H80l28 28a8 8 0 0 0 11.32 0L148 200h68a8 8 0 0 0 8-8V56A8 8 0 0 0 216 48Z" strokeWidth={sw} stroke={color} fill="none" strokeLinejoin="round"/></>,
    calendar: <><rect x="40" y="40" width="176" height="176" rx="8" strokeWidth={sw} stroke={color} fill="none"/><line x1="176" y1="24" x2="176" y2="56" strokeWidth={sw} stroke={color}/><line x1="80" y1="24" x2="80" y2="56" strokeWidth={sw} stroke={color}/><line x1="40" y1="88" x2="216" y2="88" strokeWidth={sw} stroke={color}/></>,
    mic: <><rect x="96" y="32" width="64" height="112" rx="32" strokeWidth={sw} stroke={color} fill="none"/><path d="M192 128a64 64 0 0 1-128 0" strokeWidth={sw} stroke={color} fill="none"/><line x1="128" y1="192" x2="128" y2="224" strokeWidth={sw} stroke={color}/></>,
    send: <><path d="M48 120h88" strokeWidth={sw} stroke={color}/><path d="M224 128 48 40v80l0 0v88Z" strokeWidth={sw} stroke={color} fill="none" strokeLinejoin="round"/></>,
    user: <><circle cx="128" cy="96" r="48" strokeWidth={sw} stroke={color} fill="none"/><path d="M40 224c0-44.18 39.4-80 88-80s88 35.82 88 80" strokeWidth={sw} stroke={color} fill="none"/></>,
    bell: <><path d="M168 196a40 40 0 0 1-80 0" strokeWidth={sw} stroke={color} fill="none"/><path d="M56 108a72 72 0 0 1 144 0c0 36 16 64 16 64H40s16-28 16-64Z" strokeWidth={sw} stroke={color} fill="none"/></>,
    settings: <><circle cx="128" cy="128" r="36" strokeWidth={sw} stroke={color} fill="none"/><path d="M128 44v-8M128 220v-8M44 128h-8M220 128h8M72.86 72.86l-5.66-5.66M188.8 188.8l-5.66-5.66M72.86 183.14l-5.66 5.66M188.8 67.2l-5.66 5.66" strokeWidth={sw} stroke={color}/></>,
    pill: <><rect x="72" y="72" width="112" height="112" rx="56" strokeWidth={sw} stroke={color} fill="none" transform="rotate(45 128 128)"/><line x1="88" y1="168" x2="168" y2="88" strokeWidth={sw} stroke={color}/></>,
    food: <><ellipse cx="128" cy="176" rx="80" ry="32" strokeWidth={sw} stroke={color} fill="none"/><path d="M48 176V104c0-30.93 35.82-56 80-56s80 25.07 80 56v72" strokeWidth={sw} stroke={color} fill="none"/></>,
    weight: <><circle cx="128" cy="128" r="80" strokeWidth={sw} stroke={color} fill="none"/><line x1="128" y1="128" x2="164" y2="92" strokeWidth={sw} stroke={color}/><circle cx="128" cy="128" r="6" fill={color} stroke="none"/></>,
    plus: <><line x1="128" y1="72" x2="128" y2="184" strokeWidth={sw} stroke={color}/><line x1="72" y1="128" x2="184" y2="128" strokeWidth={sw} stroke={color}/></>,
    menu: <><line x1="48" y1="80" x2="208" y2="80" strokeWidth={sw} stroke={color}/><line x1="48" y1="128" x2="176" y2="128" strokeWidth={sw} stroke={color}/><line x1="48" y1="176" x2="144" y2="176" strokeWidth={sw} stroke={color}/></>,
    home: <><path d="M216 216V115l-88-67-88 67v101" strokeWidth={sw} stroke={color} fill="none" strokeLinejoin="round"/><rect x="100" y="152" width="56" height="64" rx="4" strokeWidth={sw} stroke={color} fill="none"/></>,
    close: <><line x1="64" y1="64" x2="192" y2="192" strokeWidth={sw} stroke={color}/><line x1="192" y1="64" x2="64" y2="192" strokeWidth={sw} stroke={color}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {P[name] || null}
    </svg>
  );
}

function GastonAvatar({ size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(145deg, #ABC3B7 0%, #8FA998 40%, #657A6D 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 3px 10px rgba(101,122,109,0.25)", flexShrink: 0,
    }}>
      <Icon name="paw" size={size * 0.52} color="rgba(255,255,255,0.95)" bold />
    </div>
  );
}

function ChatBubble({ message, isLast }) {
  const g = message.from === "gaston";
  return (
    <div style={{
      display: "flex", gap: 10, alignItems: "flex-end",
      flexDirection: g ? "row" : "row-reverse",
      marginBottom: 14, maxWidth: "85%",
      alignSelf: g ? "flex-start" : "flex-end",
      animation: isLast ? "fadeInUp 0.3s ease" : "none",
    }}>
      {g && <GastonAvatar size={30} />}
      <div>
        <div style={{
          background: g ? "#FFFFFF" : "linear-gradient(135deg, #8FA998, #7A9383)",
          color: g ? "#1A1A1A" : "#FFFFFF",
          padding: "12px 16px",
          borderRadius: g ? "4px 20px 20px 20px" : "20px 4px 20px 20px",
          fontSize: 15, lineHeight: 1.55,
          boxShadow: g ? "0 2px 10px rgba(143,169,152,0.09)" : "0 3px 12px rgba(101,122,109,0.18)",
          whiteSpace: "pre-line", wordBreak: "break-word",
        }}>
          {message.text}
        </div>
        <div style={{
          fontSize: 11, marginTop: 5, padding: "0 4px",
          color: "#A99D85", textAlign: g ? "left" : "right",
        }}>
          {message.time}
        </div>
      </div>
    </div>
  );
}

function PetCard({ pet, compact = false, selected = false, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", gap: compact ? 10 : 14,
        padding: compact ? "9px 12px" : "14px 16px",
        borderRadius: 14, border: "none",
        background: selected ? "rgba(143,169,152,0.12)" : h ? "rgba(143,169,152,0.05)" : "transparent",
        width: "100%", cursor: "pointer",
        transition: "all 0.2s ease", textAlign: "left", fontFamily: "inherit",
      }}>
      <div style={{
        width: compact ? 36 : 46, height: compact ? 36 : 46,
        borderRadius: compact ? 11 : 14, background: `${pet.color}90`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: compact ? 18 : 24, flexShrink: 0,
      }}>{pet.avatar}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: compact ? 14 : 15, color: "#1A1A1A", marginBottom: 1 }}>{pet.name}</div>
        <div style={{ fontSize: compact ? 12 : 13, color: "#6B6B6B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {pet.breed} · {pet.age}
        </div>
      </div>
      {!compact && (
        <div style={{ fontSize: 11, fontWeight: 600, color: "#4FD1A1", background: "#D4F4E7", borderRadius: 99, padding: "4px 10px", whiteSpace: "nowrap" }}>
          {pet.status}
        </div>
      )}
    </button>
  );
}

function EventCard({ event }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "11px 14px", borderRadius: 14,
      background: `${event.color}18`, borderLeft: `3px solid ${event.color}`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>{event.type}</div>
        <div style={{ fontSize: 12, color: "#6B6B6B", marginTop: 2 }}>{event.pet} · {event.date} à {event.time}</div>
      </div>
      <div style={{
        width: 32, height: 32, borderRadius: 10, background: `${event.color}25`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name="calendar" size={16} color={event.color} />
      </div>
    </div>
  );
}

function NavButton({ icon, label, active }) {
  return (
    <button className={`nav-btn${active ? " active" : ""}`}>
      <Icon name={icon} size={19} color={active ? "#8FA998" : "#A99D85"} bold={active} />
      {label}
    </button>
  );
}


// ══════════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════════

export default function GastonApp() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [petsExpanded, setPetsExpanded] = useState(false);
  const [petSearch, setPetSearch] = useState("");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const handleSend = (text) => {
    const val = text || inputValue.trim();
    if (!val) return;
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { id: Date.now(), from: "user", time: now, text: val }]);
    setInputValue("");
    inputRef.current?.focus();
    setTimeout(() => {
      const t = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => [...prev, { id: Date.now(), from: "gaston", time: t, text: "Bien reçu ! Je m\u2019en occupe \ud83d\ude0a" }]);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const toggleRecording = () => {
    setIsRecording(p => !p);
    if (!isRecording) setTimeout(() => setIsRecording(false), 3000);
  };


  // ─── Sidebar content (shared between sidebar & drawer) ───
  const SidebarContent = ({ onClose }) => (
    <div className="sidebar-content">
      {/* Brand */}
      <div className="sidebar-brand">
        <GastonAvatar size={34} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A", letterSpacing: "-0.02em" }}>Gaston</div>
          <div style={{ fontSize: 11, color: "#8FA998", fontWeight: 600 }}>AI Pet Assistant</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="drawer-close-btn">
            <Icon name="close" size={20} color="#6B6B6B" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: "10px 10px 6px" }}>
        {[
          { icon: "chat", label: "Chat", id: "chat" },
          { icon: "paw", label: "Mes animaux", id: "pets" },
          { icon: "calendar", label: "Calendrier", id: "calendar" },
          { icon: "settings", label: "Réglages", id: "settings" },
        ].map(item => (
          <button key={item.id}
            className={`nav-btn${activeTab === item.id ? " active" : ""}`}
            onClick={() => { setActiveTab(item.id); if (onClose) onClose(); }}
          >
            <Icon name={item.icon} size={19} color={activeTab === item.id ? "#8FA998" : "#A99D85"} bold={activeTab === item.id} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Pets */}
      <div style={{ padding: "6px 10px 4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px", marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#A99D85", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Mes animaux
            <span style={{ fontWeight: 600, color: "#C8BDA6", marginLeft: 4 }}>({PETS.length})</span>
          </span>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8, display: "flex" }}>
            <Icon name="plus" size={15} color="#8FA998" bold />
          </button>
        </div>

        {/* Search — visible when expanded and > 5 pets */}
        {petsExpanded && PETS.length > 5 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            margin: "0 4px 6px", padding: "6px 10px",
            background: "#F4F1E8", borderRadius: 10,
          }}>
            <Icon name="search" size={14} color="#A99D85" />
            <input
              type="text" value={petSearch}
              onChange={e => setPetSearch(e.target.value)}
              placeholder="Rechercher\u2026"
              style={{
                border: "none", outline: "none", background: "transparent",
                fontFamily: "inherit", fontSize: 12, color: "#1A1A1A",
                width: "100%",
              }}
            />
            {petSearch && (
              <button onClick={() => setPetSearch("")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                <Icon name="close" size={12} color="#A99D85" />
              </button>
            )}
          </div>
        )}

        {/* Pet list */}
        <div style={{
          maxHeight: petsExpanded ? 240 : "none",
          overflowY: petsExpanded ? "auto" : "visible",
        }}>
          {(() => {
            const filtered = petSearch
              ? PETS.filter(p => p.name.toLowerCase().includes(petSearch.toLowerCase()) || p.type.toLowerCase().includes(petSearch.toLowerCase()))
              : PETS;
            const visible = petsExpanded ? filtered : filtered.slice(0, 3);
            return visible.map(pet => (
              <PetCard key={pet.id} pet={pet} compact selected={selectedPet === pet.id}
                onClick={() => setSelectedPet(pet.id === selectedPet ? null : pet.id)} />
            ));
          })()}
        </div>

        {/* Toggle */}
        {PETS.length > 3 && (
          <button
            onClick={() => { setPetsExpanded(p => !p); setPetSearch(""); }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 4, width: "100%", padding: "7px 0",
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: 12, fontWeight: 600,
              color: "#8FA998", transition: "color 0.15s ease",
              borderRadius: 8,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(143,169,152,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            {petsExpanded
              ? "Réduire"
              : `Voir tous (${PETS.length})`
            }
            <svg width="12" height="12" viewBox="0 0 256 256" fill="none" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: petsExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>
              <polyline points="48,96 128,176 208,96" strokeWidth="2" stroke="#8FA998" fill="none"/>
            </svg>
          </button>
        )}
      </div>

      {/* Upcoming events */}
      <div style={{ padding: "10px 14px 4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2px", marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#A99D85", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Prochains RDV
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {EVENTS.map(ev => (
            <div key={ev.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: 10,
              background: `${ev.color}12`,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: "#4A4A4A" }}>
                <span style={{ fontWeight: 600 }}>{ev.type}</span> · {ev.pet} · {ev.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User footer */}
      <div style={{ marginTop: "auto", padding: "14px 18px", borderTop: "1px solid #EFEADC" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #D4A574, #A97649)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 13,
            boxShadow: "0 2px 6px rgba(212,165,116,0.3)",
          }}>F</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>Fred</div>
            <div style={{ fontSize: 11, color: "#8E8E8E" }}>{PETS.length} animaux</div>
          </div>
        </div>
      </div>
    </div>
  );


  // ─── Right Sidebar (desktop) ───
  const SidebarRight = () => (
    <aside className="sidebar-right">
      <div style={{ overflowY: "auto", height: "100%" }}>
        <div style={{ padding: "20px 18px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>Prochains événements</h3>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#8FA998", cursor: "pointer" }}>Voir tout</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {EVENTS.map(ev => <EventCard key={ev.id} event={ev} />)}
          </div>
        </div>
        <div style={{ height: 1, background: "#EFEADC", margin: "0 18px" }} />
        <div style={{ padding: "14px 18px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 12 }}>Résumé du jour</h3>
          {PETS.map(pet => (
            <div key={pet.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 12,
              background: `${pet.color}18`, marginBottom: 6,
            }}>
              <span style={{ fontSize: 22 }}>{pet.avatar}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>{pet.name}</div>
                <div style={{ fontSize: 11, color: "#6B6B6B" }}>Repas OK · Humeur \ud83d\ude0a</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: "#EFEADC", margin: "0 18px" }} />
        <div style={{ padding: "14px 18px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 12 }}>Aujourd'hui</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Repas", value: "6/6", bg: "#B8F4DC" },
              { label: "Médicaments", value: "2/2", bg: "#E8D9F5" },
              { label: "Promenades", value: "1/2", bg: "#FFE88C" },
              { label: "Événements", value: "3", bg: "#FFD4C4" },
            ].map(s => (
              <div key={s.label} style={{
                padding: "12px 10px", borderRadius: 14,
                background: `${s.bg}25`, textAlign: "center",
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#6B6B6B", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );


  // ─── Bottom Tab Bar (mobile only) ───
  const BottomTabBar = () => (
    <nav className="bottom-tab-bar">
      {[
        { icon: "home", label: "Accueil", id: "home" },
        { icon: "paw", label: "Animaux", id: "pets" },
        { icon: "chat", label: "Chat", id: "chat" },
        { icon: "calendar", label: "Agenda", id: "calendar" },
        { icon: "user", label: "Profil", id: "profile" },
      ].map(item => {
        const active = activeTab === item.id;
        return (
          <button key={item.id}
            className={`tab-item${active ? " tab-active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon name={item.icon} size={20} color={active ? "#8FA998" : "#A99D85"} bold={active} />
            <span className="tab-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );


  // ─── Mobile Drawer ───
  const MobileDrawer = () => (
    <>
      <div className={`drawer-backdrop${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <div className={`drawer${drawerOpen ? " open" : ""}`}>
        <SidebarContent onClose={() => setDrawerOpen(false)} />
      </div>
    </>
  );


  // ─── Chat Area ───
  const ChatCenter = () => (
    <main className="chat-center">
      {/* Header */}
      <header className="chat-header">
        <button className="mobile-menu-btn" onClick={() => setDrawerOpen(true)}>
          <Icon name="menu" size={22} color="#1A1A1A" />
        </button>
        <GastonAvatar size={34} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>Gaston</div>
          <div style={{ fontSize: 12, color: isRecording ? "#FF6B6B" : "#8FA998", fontWeight: 600, transition: "color 0.2s" }}>
            {isRecording ? "\ud83c\udf99 Écoute en cours\u2026" : `En ligne · ${PETS.length} animaux suivis`}
          </div>
        </div>
        <button className="header-icon-btn">
          <Icon name="bell" size={19} color="#506158" />
          <span className="notif-badge">2</span>
        </button>
      </header>

      {/* Messages */}
      <div className="chat-messages">
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <span className="date-chip">Aujourd'hui</span>
        </div>
        {messages.map((msg, i) => (
          <ChatBubble key={msg.id} message={msg} isLast={i === messages.length - 1} />
        ))}
        {isRecording && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 14 }}>
            <GastonAvatar size={30} />
            <div className="typing-indicator">
              {[0, 1, 2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion chips — inline above input */}
      <div className="suggestion-strip">
        {SUGGESTIONS.map(s => (
          <button key={s} className="suggestion-chip"
            onClick={() => handleSend(s.replace(/^[\u{1F4C5}\u{1F48A}\u{1F35A}\u{2696}\u{FE0F}\s]+/u, "").trim())}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="chat-input-wrap">
        <div className="chat-input-box">
          <textarea
            ref={inputRef} value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Demande quelque chose à Gaston\u2026"
            rows={1}
          />
          <button className="send-btn" onClick={() => handleSend()} disabled={!inputValue.trim()}
            style={{ background: inputValue.trim() ? "#8FA998" : "#E9E3D0" }}>
            <Icon name="send" size={17} color={inputValue.trim() ? "#FFFFFF" : "#B9AD96"} />
          </button>
        </div>
        <button onClick={toggleRecording} className={`mic-btn${isRecording ? " recording" : ""}`}>
          <Icon name="mic" size={21} color="#FFFFFF" bold />
        </button>
      </div>
    </main>
  );


  // ─── RENDER ───
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        body {
          font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          background: #F4F1E8;
        }
        textarea::placeholder { color: #8E8E8E; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D6CBB5; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #C8BDA6; }

        /* ── Animations ── */
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ═══════════════════════════
           SHELL
           ═══════════════════════════ */
        .app-shell {
          display: flex;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ── LEFT SIDEBAR (tablet+) ── */
        .sidebar-left {
          display: none;
          width: 260px;
          background: #FDFCFA;
          border-right: 1px solid #EFEADC;
          flex-shrink: 0;
          height: 100%;
        }
        .sidebar-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow-y: auto;
        }
        .sidebar-brand {
          padding: 20px 20px 14px;
          display: flex;
          align-items: center;
          gap: 12;
          border-bottom: 1px solid #EFEADC;
        }

        /* ── RIGHT SIDEBAR (desktop) ── */
        .sidebar-right {
          display: none;
          width: 290px;
          background: #FDFCFA;
          border-left: 1px solid #EFEADC;
          flex-shrink: 0;
          height: 100%;
        }

        /* ── NAV BTN ── */
        .nav-btn {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 13px; border-radius: 11px; border: none;
          width: 100%; cursor: pointer; font-family: inherit;
          font-size: 14px; transition: all 0.15s ease;
          margin-bottom: 1px; background: transparent;
          color: #6B6B6B; font-weight: 400;
        }
        .nav-btn:hover { background: rgba(143,169,152,0.06); }
        .nav-btn.active {
          background: rgba(143,169,152,0.12);
          color: #506158; font-weight: 600;
        }

        /* ── CHAT CENTER ── */
        .chat-center {
          flex: 1; display: flex; flex-direction: column;
          height: 100%; min-width: 0; background: #F4F1E8;
        }
        .chat-header {
          display: flex; align-items: center;
          padding: 12px 16px; gap: 10;
          background: rgba(253,252,250,0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid #EFEADC;
          flex-shrink: 0; z-index: 10;
        }
        .mobile-menu-btn {
          background: none; border: none; cursor: pointer;
          padding: 6px; border-radius: 10px; display: flex;
          transition: background 0.15s ease;
        }
        .mobile-menu-btn:hover { background: rgba(143,169,152,0.08); }
        .header-icon-btn {
          position: relative; background: #FFFFFF; border: none;
          width: 38px; height: 38px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(143,169,152,0.08);
          transition: box-shadow 0.15s ease;
        }
        .header-icon-btn:hover { box-shadow: 0 3px 12px rgba(143,169,152,0.14); }
        .notif-badge {
          position: absolute; top: -2px; right: -2px;
          width: 17px; height: 17px; border-radius: 50%;
          background: #FF6B6B; color: #fff;
          font-size: 10px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 2px #F4F1E8;
        }
        .date-chip {
          font-size: 11px; font-weight: 600; color: #A99D85;
          background: #EFEADC; padding: 4px 14px; border-radius: 99px;
        }
        .chat-messages {
          flex: 1; overflow-y: auto;
          padding: 18px 16px 6px;
          display: flex; flex-direction: column;
        }
        .typing-indicator {
          background: #FFFFFF; padding: 14px 20px;
          border-radius: 4px 20px 20px 20px;
          box-shadow: 0 2px 10px rgba(143,169,152,0.09);
          display: flex; gap: 5; align-items: center;
        }
        .typing-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #8FA998;
          animation: bounce 1.2s ease-in-out infinite;
        }

        /* ── SUGGESTION CHIPS ── */
        .suggestion-strip {
          padding: 6px 16px 2px;
          display: flex; gap: 6;
          overflow-x: auto; flex-shrink: 0;
          -webkit-overflow-scrolling: touch;
        }
        .suggestion-strip::-webkit-scrollbar { height: 0; }
        .suggestion-chip {
          display: inline-flex; align-items: center;
          padding: 6px 12px; border-radius: 99px;
          background: transparent;
          border: 1px solid #E0D8C3;
          font-size: 12px; font-weight: 500; color: #6B6B6B;
          cursor: pointer; white-space: nowrap;
          font-family: inherit;
          transition: all 0.15s ease;
        }
        .suggestion-chip:hover {
          background: #FDFCFA;
          border-color: #8FA998;
          color: #506158;
        }

        /* ── INPUT ── */
        .chat-input-wrap {
          padding: 8px 14px 14px;
          display: flex; align-items: flex-end; gap: 8;
          flex-shrink: 0;
        }
        .chat-input-box {
          flex: 1; display: flex; align-items: flex-end;
          background: #FFFFFF; border-radius: 22px;
          border: 1.5px solid #E9E3D0;
          padding: 5px 5px 5px 16px;
          box-shadow: 0 2px 10px rgba(143,169,152,0.05);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .chat-input-box:focus-within {
          border-color: #8FA998;
          box-shadow: 0 2px 12px rgba(143,169,152,0.12);
        }
        .chat-input-box textarea {
          flex: 1; border: none; outline: none; resize: none;
          font-family: 'Nunito', sans-serif; font-size: 15px;
          color: #1A1A1A; padding: 7px 0; background: transparent;
          line-height: 1.4; max-height: 100px; min-height: 22px;
        }
        .send-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease; flex-shrink: 0;
        }
        .send-btn:disabled { cursor: default; }
        .mic-btn {
          width: 46px; height: 46px; border-radius: 50%;
          background: linear-gradient(145deg, #8FA998, #657A6D);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(101,122,109,0.2);
          transition: all 0.25s ease; flex-shrink: 0;
        }
        .mic-btn:hover {
          box-shadow: 0 5px 18px rgba(101,122,109,0.28);
          transform: translateY(-1px);
        }
        .mic-btn.recording {
          background: linear-gradient(145deg, #FF6B6B, #FF9670);
          box-shadow: 0 4px 16px rgba(255,107,107,0.3);
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* ═══ BOTTOM TAB BAR (mobile) ═══ */
        .bottom-tab-bar {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 6px 12px;
          padding-bottom: max(8px, env(safe-area-inset-bottom));
          background: #FDFCFA;
          border-top: 1px solid #EFEADC;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 1100;
        }
        .tab-item {
          display: flex; flex-direction: column;
          align-items: center; gap: 2px;
          background: none; border: none;
          cursor: pointer; font-family: inherit;
          padding: 6px 12px; border-radius: 12px;
          transition: all 0.15s ease;
          position: relative;
        }
        .tab-label {
          font-size: 10px; font-weight: 500;
          color: #A99D85;
          transition: color 0.15s ease;
        }
        .tab-active .tab-label {
          color: #657A6D;
          font-weight: 700;
        }
        .tab-active::before {
          content: '';
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 20px; height: 3px;
          background: #8FA998;
          border-radius: 0 0 4px 4px;
        }

        /* ═══ MOBILE DRAWER ═══ */
        .drawer-backdrop {
          position: fixed; inset: 0;
          background: rgba(26,26,26,0);
          z-index: 1200;
          pointer-events: none;
          transition: background 0.3s ease;
        }
        .drawer-backdrop.open {
          background: rgba(26,26,26,0.25);
          pointer-events: auto;
        }
        .drawer {
          position: fixed;
          top: 0; bottom: 0; left: 0;
          width: 280px; max-width: 85vw;
          background: #FDFCFA;
          z-index: 1300;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: none;
        }
        .drawer.open {
          transform: translateX(0);
          box-shadow: 8px 0 30px rgba(26,26,26,0.12);
        }
        .drawer-close-btn {
          background: none; border: none; cursor: pointer;
          padding: 6px; border-radius: 10px;
          display: flex; transition: background 0.15s ease;
        }
        .drawer-close-btn:hover { background: rgba(143,169,152,0.08); }

        /* ═══ MOBILE (<768) ═══ */
        .mobile-menu-btn { display: flex; }

        @media (max-width: 767px) {
          .chat-input-wrap { padding-bottom: 66px; }
          .chat-messages { padding-left: 12px; padding-right: 12px; }
          .suggestion-strip { padding-left: 12px; padding-right: 12px; }
        }

        /* ═══ TABLET (768+) ═══ */
        @media (min-width: 768px) {
          .sidebar-left { display: block; }
          .bottom-tab-bar { display: none; }
          .mobile-menu-btn { display: none !important; }
          .drawer, .drawer-backdrop { display: none !important; }
          .chat-header { padding: 14px 24px; }
          .chat-messages { padding: 20px 28px 8px; }
          .suggestion-strip { padding: 6px 28px 2px; }
          .chat-input-wrap { padding: 8px 24px 18px; }
        }

        /* ═══ DESKTOP (1200+) ═══ */
        @media (min-width: 1200px) {
          .sidebar-right { display: block; }
          .chat-messages { padding: 24px 40px 8px; }
          .suggestion-strip { padding: 6px 40px 2px; }
          .chat-input-wrap { padding: 8px 40px 22px; }
          .chat-header { padding: 16px 40px; }
        }

        /* ═══ WIDE (1440+) ═══ */
        @media (min-width: 1440px) {
          .sidebar-left { width: 290px; }
          .sidebar-right { width: 320px; }
          .chat-messages { padding: 24px 56px 8px; }
          .suggestion-strip { padding: 6px 56px 2px; }
          .chat-input-wrap { padding: 8px 56px 24px; }
          .chat-header { padding: 16px 56px; }
        }
      `}</style>

      <div className="app-shell">
        {/* Left sidebar (tablet+) */}
        <aside className="sidebar-left">
          <SidebarContent />
        </aside>

        {/* Chat */}
        <ChatCenter />

        {/* Right sidebar (desktop+) */}
        <SidebarRight />

        {/* Mobile only */}
        <BottomTabBar />
        <MobileDrawer />
      </div>
    </>
  );
}
