/**
 * Dashboard Mockup - Chat-Centric Architecture Reference
 * This is a structural and visual reference for the new homepage layout.
 * DO NOT use as copy-paste — use as guidance for component architecture.
 */

// Mobile (<768px) - Chat full-screen with bottom tab bar
const MobileLayout = () => (
  <div className="flex flex-col h-screen bg-lin-2">
    {/* Chat Header with Hamburger */}
    <header className="bg-lin-0 border-b border-lin-3 px-4 py-3 flex items-center justify-between">
      <button className="p-2" aria-label="Menu">
        {/* Hamburger icon */}
      </button>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white">
          {/* Gaston avatar */}
        </div>
        <div>
          <p className="font-semibold text-sm">Gaston</p>
          <p className="text-xs text-text-tertiary">En ligne · 3 animaux</p>
        </div>
      </div>
      <button className="p-2 relative" aria-label="Notifications">
        {/* Bell icon + badge */}
      </button>
    </header>

    {/* Chat Messages Area */}
    <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {/* Date separator */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-lin-3" />
        <span className="px-3 py-1 bg-lin-3 text-xs text-text-secondary rounded-full">
          Aujourd'hui
        </span>
        <div className="flex-1 h-px bg-lin-3" />
      </div>

      {/* Gaston message */}
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-primary-50 flex-shrink-0" />
        <div className="max-w-xs">
          <div className="bg-white rounded-tr-4xl rounded-br-4xl rounded-bl-4xl rounded-tl-1 p-3 shadow-xs">
            <p className="text-sm text-text-primary">Bonjour! 👋</p>
          </div>
          <p className="text-xs text-text-tertiary mt-1">10:30</p>
        </div>
      </div>

      {/* User message */}
      <div className="flex justify-end gap-2">
        <div className="max-w-xs">
          <div className="bg-gradient-to-br from-primary-400 to-primary-500 rounded-tl-4xl rounded-bl-4xl rounded-br-4xl rounded-tr-1 p-3 text-white">
            <p className="text-sm">Comment ça va?</p>
          </div>
          <p className="text-xs text-text-tertiary mt-1 text-right">10:31</p>
        </div>
      </div>

      {/* Typing indicator */}
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-primary-50 flex-shrink-0" />
        <div className="flex gap-1 p-3">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </main>

    {/* Suggestion Chips */}
    <div className="px-4 py-3 border-t border-lin-3 bg-lin-0 overflow-x-auto">
      <div className="flex gap-2">
        <button className="px-4 py-2 border border-lin-4 rounded-full text-sm text-text-secondary whitespace-nowrap hover:bg-lin-0 hover:border-primary-400">
          📅 Prochain RDV de Luna?
        </button>
        <button className="px-4 py-2 border border-lin-4 rounded-full text-sm text-text-secondary whitespace-nowrap hover:bg-lin-0 hover:border-primary-400">
          🐾 Ajouter un animal
        </button>
      </div>
    </div>

    {/* Input Bar */}
    <footer className="bg-lin-0 border-t border-lin-3 p-4">
      <div className="flex items-end gap-3">
        <div className="flex-1 rounded-6xl border border-lin-4 px-4 py-3 flex items-center bg-white focus-within:border-primary-400 focus-within:shadow-md">
          <textarea
            placeholder="Écrivez quelque chose..."
            className="flex-1 resize-none bg-transparent text-sm outline-none max-h-24"
            rows={1}
          />
        </div>
        <button className="w-9 h-9 rounded-full bg-primary-400 text-white flex items-center justify-center flex-shrink-0">
          {/* Send icon */}
        </button>
        <button className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center flex-shrink-0">
          {/* Mic icon */}
        </button>
      </div>
    </footer>

    {/* Bottom Tab Bar */}
    <nav className="bg-lin-0 border-t border-lin-3 flex justify-around items-center">
      <button className="flex-1 py-3 flex flex-col items-center gap-1 border-t-2 border-transparent hover:bg-lin-2">
        <span className="text-lg">🏠</span>
        <span className="text-xs font-medium">Accueil</span>
      </button>
      <button className="flex-1 py-3 flex flex-col items-center gap-1 border-t-2 border-transparent hover:bg-lin-2">
        <span className="text-lg">🐾</span>
        <span className="text-xs font-medium">Animaux</span>
      </button>
      <button className="flex-1 py-3 flex flex-col items-center gap-1 border-t-2 border-primary-400 bg-lin-2">
        <span className="text-lg">💬</span>
        <span className="text-xs font-medium text-primary-400">Chat</span>
      </button>
      <button className="flex-1 py-3 flex flex-col items-center gap-1 border-t-2 border-transparent hover:bg-lin-2">
        <span className="text-lg">📅</span>
        <span className="text-xs font-medium">Agenda</span>
      </button>
      <button className="flex-1 py-3 flex flex-col items-center gap-1 border-t-2 border-transparent hover:bg-lin-2">
        <span className="text-lg">👤</span>
        <span className="text-xs font-medium">Profil</span>
      </button>
    </nav>

    {/* Drawer (mobile) - slides from left */}
    {/* When hamburger clicked, drawer slides in */}
  </div>
);

// Tablet (768px+) - Sidebar + Chat center
const TabletLayout = () => (
  <div className="flex h-screen bg-lin-2">
    {/* Left Sidebar */}
    <aside className="w-64 bg-lin-0 border-r border-lin-3 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-6 border-b border-lin-3">
        <h1 className="text-xl font-bold text-text-primary">Gaston</h1>
        <p className="text-xs text-text-tertiary">Pet Care Assistant</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        <button className="w-full text-left px-4 py-3 rounded-lg bg-primary-50 text-primary-400 font-semibold text-sm">
          💬 Chat
        </button>
        <button className="w-full text-left px-4 py-3 rounded-lg text-text-primary hover:bg-lin-2 text-sm">
          🐾 Mes Animaux
        </button>
        <button className="w-full text-left px-4 py-3 rounded-lg text-text-primary hover:bg-lin-2 text-sm">
          📅 Calendrier
        </button>
        <button className="w-full text-left px-4 py-3 rounded-lg text-text-primary hover:bg-lin-2 text-sm">
          ⚙️ Réglages
        </button>
      </nav>

      {/* Pets List */}
      <div className="px-4 py-4 border-t border-lin-3 space-y-3 max-h-64 overflow-y-auto">
        <p className="text-xs uppercase font-bold text-text-tertiary tracking-wider">Mes Animaux</p>
        <button className="w-full text-left px-3 py-2 rounded-lg bg-lin-2 text-text-primary hover:bg-lin-3 text-sm flex items-center gap-2">
          <span>🐕</span>
          <span className="truncate">Luna</span>
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg bg-lin-2 text-text-primary hover:bg-lin-3 text-sm flex items-center gap-2">
          <span>🐱</span>
          <span className="truncate">Mito</span>
        </button>
        <button className="w-full text-center px-3 py-2 text-primary-400 text-xs font-semibold hover:text-primary-500">
          Voir tous (5)
        </button>
      </div>

      {/* Upcoming Events */}
      <div className="px-4 py-4 border-t border-lin-3">
        <p className="text-xs uppercase font-bold text-text-tertiary tracking-wider mb-3">Prochains RDV</p>
        <div className="text-xs space-y-2">
          <div className="p-2 bg-lin-2 rounded text-text-primary">
            <p className="font-semibold">🏥 Vaccin Luna</p>
            <p className="text-text-tertiary">15 mar, 10:30</p>
          </div>
        </div>
      </div>

      {/* Footer User */}
      <div className="p-4 border-t border-lin-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-50" />
        <div className="text-sm flex-1 min-w-0">
          <p className="font-semibold text-text-primary truncate">Fred</p>
          <p className="text-xs text-text-tertiary truncate">fred@example.com</p>
        </div>
      </div>
    </aside>

    {/* Main Chat Area */}
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Chat Header */}
      <header className="bg-lin-0 border-b border-lin-3 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600" />
          <div>
            <p className="font-semibold text-text-primary">Gaston</p>
            <p className="text-xs text-text-tertiary">En ligne</p>
          </div>
        </div>
        <button aria-label="Notifications" className="p-2 relative">
          {/* Bell */}
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Messages here */}
      </div>

      {/* Suggestions & Input */}
      <div className="bg-lin-0 border-t border-lin-3 px-6 py-4 space-y-3">
        <div className="overflow-x-auto">
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-lin-4 rounded-full text-sm text-text-secondary whitespace-nowrap">
              📅 Prochain RDV?
            </button>
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1 rounded-6xl border border-lin-4 px-4 py-3 bg-white focus-within:border-primary-400">
            <textarea placeholder="Écrivez..." className="w-full resize-none bg-transparent text-sm outline-none" rows={1} />
          </div>
          <button className="w-9 h-9 rounded-full bg-primary-400 text-white flex-shrink-0">📤</button>
          <button className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex-shrink-0">🎙</button>
        </div>
      </div>
    </main>
  </div>
);

// Desktop (1200px+) - Left Sidebar + Chat Center + Right Sidebar
const DesktopLayout = () => (
  <div className="flex h-screen bg-lin-2">
    {/* Left Sidebar (same as tablet) */}
    <aside className="w-64 bg-lin-0 border-r border-lin-3 flex flex-col">
      {/* Content same as tablet */}
    </aside>

    {/* Main Chat Area */}
    <main className="flex-1 flex flex-col overflow-hidden border-r border-lin-3">
      {/* Chat Header, Messages, Input same as tablet */}
    </main>

    {/* Right Sidebar (Desktop only) */}
    <aside className="w-80 bg-lin-0 border-l border-lin-3 flex flex-col overflow-hidden p-6 space-y-6">
      {/* Upcoming Events */}
      <div>
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3">
          Prochains Événements
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-lin-2 rounded-xl border border-lin-3">
            <p className="font-semibold text-text-primary text-sm">🏥 Vaccin Luna</p>
            <p className="text-xs text-text-tertiary">15 mars, 10:30</p>
          </div>
        </div>
      </div>

      {/* Daily Summary by Pet */}
      <div>
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3">
          Résumé du Jour
        </h3>
        <div className="space-y-2">
          <div className="p-3 bg-lin-2 rounded text-text-primary">
            <p className="text-sm font-semibold flex items-center gap-2">
              <span>🐕</span> Luna
            </p>
            <ul className="text-xs text-text-tertiary ml-6 mt-1 space-y-0.5">
              <li>✓ Repas matin (7:30)</li>
              <li>✓ Promenade (12:00)</li>
              <li>⏳ Repas soir (19:00)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div>
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3">
          Statistiques
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-lin-2 rounded-xl text-center">
            <p className="text-2xl font-bold text-primary-400">5</p>
            <p className="text-xs text-text-tertiary">Repas</p>
          </div>
          <div className="p-4 bg-lin-2 rounded-xl text-center">
            <p className="text-2xl font-bold text-secondary-400">2</p>
            <p className="text-xs text-text-tertiary">Médicaments</p>
          </div>
          <div className="p-4 bg-lin-2 rounded-xl text-center">
            <p className="text-2xl font-bold text-primary-400">3</p>
            <p className="text-xs text-text-tertiary">Promenades</p>
          </div>
          <div className="p-4 bg-lin-2 rounded-xl text-center">
            <p className="text-2xl font-bold text-secondary-400">1</p>
            <p className="text-xs text-text-tertiary">Événements</p>
          </div>
        </div>
      </div>
    </aside>
  </div>
);

export { MobileLayout, TabletLayout, DesktopLayout };