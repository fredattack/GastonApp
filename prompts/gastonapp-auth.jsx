import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────
   GastonApp — Auth Flow (6 screens)
   Welcome → Login / Register → Forgot → Verify
   Mobile-first · Laravel Sanctum ready
   ───────────────────────────────────────────── */

// ── Icons ──
function Icon({ name, size = 24, color = "currentColor", bold = false }) {
  const sw = bold ? 2 : 1.5;
  const P = {
    paw: <><circle cx="128" cy="200" r="24" strokeWidth={sw} stroke={color} fill="none"/><circle cx="80" cy="140" r="18" strokeWidth={sw} stroke={color} fill="none"/><circle cx="176" cy="140" r="18" strokeWidth={sw} stroke={color} fill="none"/><circle cx="100" cy="84" r="16" strokeWidth={sw} stroke={color} fill="none"/><circle cx="156" cy="84" r="16" strokeWidth={sw} stroke={color} fill="none"/></>,
    eye: <><path d="M128 56C48 56 8 128 8 128s40 72 120 72 120-72 120-72S208 56 128 56Z" strokeWidth={sw} stroke={color} fill="none"/><circle cx="128" cy="128" r="32" strokeWidth={sw} stroke={color} fill="none"/></>,
    eyeOff: <><path d="M128 56C48 56 8 128 8 128s40 72 120 72 120-72 120-72S208 56 128 56Z" strokeWidth={sw} stroke={color} fill="none"/><circle cx="128" cy="128" r="32" strokeWidth={sw} stroke={color} fill="none"/><line x1="40" y1="40" x2="216" y2="216" strokeWidth={sw} stroke={color}/></>,
    arrowLeft: <><line x1="216" y1="128" x2="40" y2="128" strokeWidth={sw} stroke={color}/><polyline points="112,56 40,128 112,200" strokeWidth={sw} stroke={color} fill="none"/></>,
    mail: <><rect x="32" y="56" width="192" height="144" rx="8" strokeWidth={sw} stroke={color} fill="none"/><polyline points="32,56 128,136 224,56" strokeWidth={sw} stroke={color} fill="none"/></>,
    check: <><polyline points="40,128 96,184 216,64" strokeWidth={sw} stroke={color} fill="none"/></>,
    lock: <><rect x="48" y="112" width="160" height="112" rx="8" strokeWidth={sw} stroke={color} fill="none"/><path d="M80 112V80a48 48 0 0 1 96 0v32" strokeWidth={sw} stroke={color} fill="none"/><circle cx="128" cy="156" r="12" fill={color} stroke="none"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {P[name] || null}
    </svg>
  );
}

// ── Social Icons ──
function GoogleIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
    </svg>
  );
}

function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FD5"/>
          <stop offset="50%" stopColor="#FF543E"/>
          <stop offset="100%" stopColor="#C837AB"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig)"/>
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="#fff" strokeWidth="1.5"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="#fff"/>
    </svg>
  );
}

// ── Gaston Logo ──
function GastonLogo({ size = 64 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(145deg, #ABC3B7 0%, #8FA998 40%, #657A6D 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 6px 24px rgba(101,122,109,0.3)",
    }}>
      <Icon name="paw" size={size * 0.5} color="rgba(255,255,255,0.95)" bold />
    </div>
  );
}

// ── Reusable Components ──

function AuthInput({ label, type = "text", placeholder, value, onChange, error, icon }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === "password";
  return (
    <div style={{ marginBottom: 18 }}>
      {label && (
        <label style={{
          display: "block", fontSize: 13, fontWeight: 600,
          color: "#4A4A4A", marginBottom: 6,
        }}>{label}</label>
      )}
      <div style={{
        display: "flex", alignItems: "center",
        background: "#F9F7F4", borderRadius: 12,
        border: `1.5px solid ${error ? "#FF6B6B" : "#E9E3D0"}`,
        padding: "0 14px", minHeight: 48,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
        onFocus={e => { if (!error) { e.currentTarget.style.borderColor = "#8FA998"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(143,169,152,0.1)"; } }}
        onBlur={e => { if (!error) { e.currentTarget.style.borderColor = "#E9E3D0"; e.currentTarget.style.boxShadow = "none"; } }}
      >
        <input
          type={isPw && !showPw ? "password" : "text"}
          placeholder={placeholder} value={value} onChange={onChange}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "#1A1A1A",
            padding: "12px 0",
          }}
        />
        {isPw && (
          <button type="button" onClick={() => setShowPw(p => !p)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
            <Icon name={showPw ? "eyeOff" : "eye"} size={18} color="#A99D85" />
          </button>
        )}
      </div>
      {error && <p style={{ fontSize: 12, color: "#E54545", marginTop: 4, fontWeight: 500 }}>{error}</p>}
    </div>
  );
}

function PrimaryButton({ children, onClick, loading = false, disabled = false }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled || loading}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: "100%", minHeight: 50, borderRadius: 9999,
        background: disabled ? "#D6CBB5" : h ? "#506158" : "#1A1A1A",
        color: "#FFFFFF", border: "none", cursor: disabled ? "default" : "pointer",
        fontFamily: "'Nunito', sans-serif", fontSize: 16, fontWeight: 600,
        boxShadow: disabled ? "none" : "0 4px 14px rgba(26,26,26,0.15)",
        transition: "all 0.2s ease",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
      {loading ? <LoadingDots /> : children}
    </button>
  );
}

function SocialButton({ icon, label, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: "100%", minHeight: 48, borderRadius: 12,
        background: h ? "#F4F7F5" : "#FFFFFF",
        border: `1.5px solid ${h ? "#C7D7CF" : "#E9E3D0"}`,
        cursor: "pointer", fontFamily: "'Nunito', sans-serif",
        fontSize: 14, fontWeight: 600, color: "#1A1A1A",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        transition: "all 0.15s ease",
        boxShadow: "0 1px 4px rgba(143,169,152,0.05)",
      }}>
      {icon}{label}
    </button>
  );
}

function Divider({ text }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      margin: "22px 0",
    }}>
      <div style={{ flex: 1, height: 1, background: "#E9E3D0" }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: "#A99D85", whiteSpace: "nowrap" }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: "#E9E3D0" }} />
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer",
      padding: 6, borderRadius: 10, display: "flex",
      transition: "background 0.15s ease",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(143,169,152,0.08)"}
      onMouseLeave={e => e.currentTarget.style.background = "none"}
    >
      <Icon name="arrowLeft" size={22} color="#1A1A1A" />
    </button>
  );
}

function LoadingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "#FFFFFF",
          animation: `authBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
        }} />
      ))}
    </div>
  );
}

function TextLink({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer",
      fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 600,
      color: "#657A6D", padding: 0,
      transition: "color 0.15s ease",
    }}
      onMouseEnter={e => e.currentTarget.style.color = "#506158"}
      onMouseLeave={e => e.currentTarget.style.color = "#657A6D"}
    >
      {children}
    </button>
  );
}


// ══════════════════════════════════════════════
//  SCREENS
// ══════════════════════════════════════════════

// ─── 1. WELCOME ───
function WelcomeScreen({ onLogin, onRegister }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div className="auth-screen welcome-screen">
      {/* Background decoration */}
      <div className="welcome-bg-shape shape-1" />
      <div className="welcome-bg-shape shape-2" />
      <div className="welcome-bg-shape shape-3" />

      <div className="auth-content welcome-content" style={{
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <GastonLogo size={80} />
        </div>

        <h1 style={{
          fontSize: 34, fontWeight: 700, color: "#1A1A1A",
          textAlign: "center", lineHeight: 1.2, letterSpacing: "-0.02em",
          marginBottom: 12,
        }}>
          Gaston
        </h1>

        <p style={{
          fontSize: 16, color: "#6B6B6B", textAlign: "center",
          lineHeight: 1.55, marginBottom: 40, maxWidth: 280,
          alignSelf: "center",
        }}>
          L'assistant IA qui prend soin de vos animaux au quotidien.
        </p>

        {/* Social login buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          <SocialButton icon={<GoogleIcon />} label="Continuer avec Google" />
          <SocialButton icon={<FacebookIcon />} label="Continuer avec Facebook" />
          <SocialButton icon={<InstagramIcon />} label="Continuer avec Instagram" />
        </div>

        <Divider text="ou par email" />

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <PrimaryButton onClick={onRegister}>Créer un compte</PrimaryButton>
          <button onClick={onLogin} style={{
            width: "100%", minHeight: 50, borderRadius: 9999,
            background: "transparent", color: "#1A1A1A",
            border: "1.5px solid #E9E3D0", cursor: "pointer",
            fontFamily: "'Nunito', sans-serif", fontSize: 16, fontWeight: 600,
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#8FA998"; e.currentTarget.style.background = "#F4F7F5"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E9E3D0"; e.currentTarget.style.background = "transparent"; }}
          >
            Se connecter
          </button>
        </div>

        <p style={{
          fontSize: 11, color: "#A99D85", textAlign: "center",
          marginTop: 28, lineHeight: 1.5,
        }}>
          En continuant, vous acceptez nos <TextLink>conditions d'utilisation</TextLink> et notre <TextLink>politique de confidentialité</TextLink>.
        </p>
      </div>
    </div>
  );
}


// ─── 2. LOGIN ───
function LoginScreen({ onBack, onForgot, onRegister, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = () => {
    const errs = {};
    if (!email.trim()) errs.email = "L'email est requis";
    if (!password) errs.password = "Le mot de passe est requis";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess?.(); }, 1500);
  };

  return (
    <div className="auth-screen">
      <div className="auth-content">
        <div className="auth-header">
          <BackButton onClick={onBack} />
        </div>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <GastonLogo size={56} />
        </div>
        <h1 className="auth-title">Content de vous revoir</h1>
        <p className="auth-subtitle">Connectez-vous pour retrouver vos animaux.</p>

        {/* Social */}
        <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
          <SocialButton icon={<GoogleIcon size={18} />} label="Google" />
          <SocialButton icon={<FacebookIcon size={18} />} label="Facebook" />
          <SocialButton icon={<InstagramIcon size={18} />} label="Instagram" />
        </div>
        <Divider text="ou" />

        {/* Form */}
        <AuthInput label="Email" type="email" placeholder="votre@email.com"
          value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
        <AuthInput label="Mot de passe" type="password" placeholder="••••••••"
          value={password} onChange={e => setPassword(e.target.value)} error={errors.password} />

        <div style={{ textAlign: "right", marginTop: -10, marginBottom: 20 }}>
          <TextLink onClick={onForgot}>Mot de passe oublié ?</TextLink>
        </div>

        <PrimaryButton onClick={handleLogin} loading={loading}>Se connecter</PrimaryButton>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#6B6B6B" }}>
          Pas encore de compte ?{" "}
          <TextLink onClick={onRegister}>Créer un compte</TextLink>
        </p>
      </div>
    </div>
  );
}


// ─── 3. REGISTER ───
function RegisterScreen({ onBack, onLogin, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = (() => {
    if (password.length === 0) return { level: 0, label: "", color: "transparent" };
    if (password.length < 6) return { level: 1, label: "Faible", color: "#FF6B6B" };
    if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password))
      return { level: 2, label: "Moyen", color: "#FFD84D" };
    return { level: 3, label: "Fort", color: "#7CEDC3" };
  })();

  const handleRegister = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Le nom est requis";
    if (!email.trim()) errs.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Email invalide";
    if (password.length < 8) errs.password = "Minimum 8 caractères";
    if (password !== confirm) errs.confirm = "Les mots de passe ne correspondent pas";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess?.(); }, 1500);
  };

  return (
    <div className="auth-screen">
      <div className="auth-content">
        <div className="auth-header">
          <BackButton onClick={onBack} />
        </div>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <GastonLogo size={56} />
        </div>
        <h1 className="auth-title">Créer votre compte</h1>
        <p className="auth-subtitle">Rejoignez Gaston et prenez soin de vos compagnons.</p>

        {/* Social */}
        <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
          <SocialButton icon={<GoogleIcon size={18} />} label="Google" />
          <SocialButton icon={<FacebookIcon size={18} />} label="Facebook" />
          <SocialButton icon={<InstagramIcon size={18} />} label="Instagram" />
        </div>
        <Divider text="ou par email" />

        {/* Form */}
        <AuthInput label="Nom complet" placeholder="Jean Dupont"
          value={name} onChange={e => setName(e.target.value)} error={errors.name} />
        <AuthInput label="Email" type="email" placeholder="votre@email.com"
          value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
        <AuthInput label="Mot de passe" type="password" placeholder="Minimum 8 caractères"
          value={password} onChange={e => setPassword(e.target.value)} error={errors.password} />

        {/* Password strength */}
        {password.length > 0 && (
          <div style={{ marginTop: -12, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: i <= strength.level ? strength.color : "#E9E3D0",
                  transition: "background 0.2s ease",
                }} />
              ))}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: strength.color === "#7CEDC3" ? "#4FD1A1" : strength.color }}>
              {strength.label}
            </span>
          </div>
        )}

        <AuthInput label="Confirmer le mot de passe" type="password" placeholder="Retapez votre mot de passe"
          value={confirm} onChange={e => setConfirm(e.target.value)} error={errors.confirm} />

        <PrimaryButton onClick={handleRegister} loading={loading}>Créer mon compte</PrimaryButton>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#6B6B6B" }}>
          Déjà un compte ?{" "}
          <TextLink onClick={onLogin}>Se connecter</TextLink>
        </p>
      </div>
    </div>
  );
}


// ─── 4. FORGOT PASSWORD ───
function ForgotScreen({ onBack, onSuccess }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) { setError("L'email est requis"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Email invalide"); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess?.(email); }, 1500);
  };

  return (
    <div className="auth-screen">
      <div className="auth-content">
        <div className="auth-header">
          <BackButton onClick={onBack} />
        </div>

        <div style={{
          width: 64, height: 64, borderRadius: 20, margin: "0 auto 24px",
          background: "linear-gradient(135deg, #E8D9F5, #D1B3E8)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="lock" size={30} color="rgba(0,0,0,0.6)" />
        </div>

        <h1 className="auth-title">Mot de passe oublié ?</h1>
        <p className="auth-subtitle">
          Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        <AuthInput label="Email" type="email" placeholder="votre@email.com"
          value={email} onChange={e => setEmail(e.target.value)} error={error} />

        <PrimaryButton onClick={handleSubmit} loading={loading}>Envoyer le lien</PrimaryButton>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#6B6B6B" }}>
          Vous vous en souvenez ?{" "}
          <TextLink onClick={onBack}>Retour à la connexion</TextLink>
        </p>
      </div>
    </div>
  );
}


// ─── 5. CHECK EMAIL (after forgot) ───
function CheckEmailScreen({ email, onBack, onResend }) {
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResent(true);
    onResend?.();
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="auth-screen">
      <div className="auth-content" style={{ textAlign: "center" }}>
        <div className="auth-header">
          <BackButton onClick={onBack} />
        </div>

        <div style={{
          width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px",
          background: "linear-gradient(135deg, #B8F4DC, #7CEDC3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 20px rgba(124,237,195,0.25)",
        }}>
          <Icon name="mail" size={36} color="rgba(0,0,0,0.6)" bold />
        </div>

        <h1 className="auth-title">Vérifiez vos emails</h1>
        <p className="auth-subtitle">
          Nous avons envoyé un lien de réinitialisation à
        </p>
        <p style={{
          fontSize: 15, fontWeight: 700, color: "#1A1A1A",
          marginBottom: 32, wordBreak: "break-all",
        }}>
          {email || "votre@email.com"}
        </p>

        <div style={{
          background: "#F9F7F4", borderRadius: 16, padding: "16px 20px",
          marginBottom: 28, textAlign: "left",
        }}>
          <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6 }}>
            Le lien expire dans <strong style={{ color: "#1A1A1A" }}>30 minutes</strong>. 
            Vérifiez aussi vos spams si vous ne le trouvez pas.
          </p>
        </div>

        <PrimaryButton onClick={handleResend}>
          {resent ? "Email renvoyé ✓" : "Renvoyer l'email"}
        </PrimaryButton>

        <p style={{ marginTop: 24, fontSize: 14, color: "#6B6B6B" }}>
          <TextLink onClick={onBack}>Retour à la connexion</TextLink>
        </p>
      </div>
    </div>
  );
}


// ─── 6. VERIFY EMAIL (after register) ───
function VerifyEmailScreen({ email, onResend, onBack }) {
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleResend = () => {
    setResent(true);
    setCountdown(60);
    onResend?.();
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <div className="auth-screen">
      <div className="auth-content" style={{ textAlign: "center" }}>
        <div className="auth-header">
          <BackButton onClick={onBack} />
        </div>

        {/* Animated check icon */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px",
          background: "linear-gradient(135deg, #B8F4DC, #7CEDC3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 20px rgba(124,237,195,0.25)",
          animation: "authPulseCheck 2s ease-in-out infinite",
        }}>
          <Icon name="mail" size={36} color="rgba(0,0,0,0.6)" bold />
        </div>

        <h1 className="auth-title">Confirmez votre email</h1>
        <p className="auth-subtitle">
          Nous avons envoyé un email de vérification à
        </p>
        <p style={{
          fontSize: 15, fontWeight: 700, color: "#1A1A1A",
          marginBottom: 28, wordBreak: "break-all",
        }}>
          {email || "votre@email.com"}
        </p>

        {/* Steps */}
        <div style={{
          background: "#F9F7F4", borderRadius: 16, padding: "20px",
          marginBottom: 28, textAlign: "left",
        }}>
          {[
            "Ouvrez votre boîte email",
            "Cliquez sur le lien de vérification",
            "Revenez ici — vous serez connecté automatiquement",
          ].map((step, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              marginBottom: i < 2 ? 14 : 0,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #8FA998, #657A6D)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 12, fontWeight: 700,
              }}>{i + 1}</div>
              <p style={{ fontSize: 13, color: "#4A4A4A", lineHeight: 1.5, paddingTop: 2 }}>{step}</p>
            </div>
          ))}
        </div>

        {countdown > 0 ? (
          <p style={{ fontSize: 14, color: "#A99D85", fontWeight: 600 }}>
            Renvoyer dans {countdown}s
          </p>
        ) : (
          <PrimaryButton onClick={handleResend}>
            {resent ? "Email renvoyé ✓" : "Renvoyer l'email"}
          </PrimaryButton>
        )}

        <p style={{ marginTop: 20, fontSize: 13, color: "#A99D85" }}>
          Mauvais email ? <TextLink onClick={onBack}>Modifier</TextLink>
        </p>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════
//  APP ROUTER
// ══════════════════════════════════════════════

export default function GastonAuth() {
  const [screen, setScreen] = useState("welcome");
  const [resetEmail, setResetEmail] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");

  const screens = {
    welcome: (
      <WelcomeScreen
        onLogin={() => setScreen("login")}
        onRegister={() => setScreen("register")}
      />
    ),
    login: (
      <LoginScreen
        onBack={() => setScreen("welcome")}
        onForgot={() => setScreen("forgot")}
        onRegister={() => setScreen("register")}
        onSuccess={() => alert("Login success! → redirect to dashboard")}
      />
    ),
    register: (
      <RegisterScreen
        onBack={() => setScreen("welcome")}
        onLogin={() => setScreen("login")}
        onSuccess={() => { setRegisterEmail("fred@example.com"); setScreen("verify"); }}
      />
    ),
    forgot: (
      <ForgotScreen
        onBack={() => setScreen("login")}
        onSuccess={(email) => { setResetEmail(email); setScreen("checkEmail"); }}
      />
    ),
    checkEmail: (
      <CheckEmailScreen
        email={resetEmail}
        onBack={() => setScreen("login")}
        onResend={() => {}}
      />
    ),
    verify: (
      <VerifyEmailScreen
        email={registerEmail}
        onBack={() => setScreen("register")}
        onResend={() => {}}
      />
    ),
  };

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

        /* ── Animations ── */
        @keyframes authBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        @keyframes authPulseCheck {
          0%, 100% { box-shadow: 0 6px 20px rgba(124,237,195,0.25); }
          50% { box-shadow: 0 6px 30px rgba(124,237,195,0.40); }
        }

        /* ── Auth Layout ── */
        .auth-screen {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #F4F1E8;
          position: relative;
          overflow: hidden;
        }

        .auth-content {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
        }

        .auth-header {
          margin-bottom: 16px;
        }

        .auth-title {
          font-size: 26px;
          font-weight: 700;
          color: #1A1A1A;
          text-align: center;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .auth-subtitle {
          font-size: 15px;
          color: #6B6B6B;
          text-align: center;
          line-height: 1.5;
          margin-bottom: 28px;
        }

        /* ── Welcome background shapes ── */
        .welcome-screen {
          background: linear-gradient(170deg, #B8F4DC 0%, #F4F1E8 35%, #F4F1E8 65%, #E8D9F5 100%);
        }
        .welcome-content {
          padding-top: 20px;
        }
        .welcome-bg-shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.3;
          filter: blur(60px);
        }
        .shape-1 {
          width: 300px; height: 300px;
          background: #B8F4DC;
          top: -80px; right: -60px;
        }
        .shape-2 {
          width: 250px; height: 250px;
          background: #E8D9F5;
          bottom: -50px; left: -80px;
        }
        .shape-3 {
          width: 180px; height: 180px;
          background: #FFE88C;
          top: 40%; left: -40px;
          opacity: 0.15;
        }

        /* ── Desktop: card style ── */
        @media (min-width: 768px) {
          .auth-screen {
            background: linear-gradient(135deg, #B8F4DC22 0%, #F4F1E8 50%, #E8D9F522 100%);
          }
          .auth-content {
            background: #FDFCFA;
            border-radius: 24px;
            padding: 40px 36px;
            box-shadow: 0 8px 40px rgba(143,169,152,0.12);
            border: 1px solid #EFEADC;
          }
          .welcome-screen {
            background: linear-gradient(135deg, #B8F4DC33 0%, #F4F1E8 50%, #E8D9F533 100%);
          }
          .welcome-content {
            padding-top: 40px;
          }
          .welcome-bg-shape {
            opacity: 0.15;
          }
        }

        @media (min-width: 1200px) {
          .auth-content {
            max-width: 440px;
            padding: 48px 44px;
          }
        }
      `}</style>

      {screens[screen]}
    </>
  );
}
