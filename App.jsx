import { useState, useEffect } from "react";
import {
  ShoppingCart, Package, FileText, Home, LogOut, ChevronRight,
  Plus, Minus, Trash2, Tag, AlertCircle, CheckCircle, Clock,
  TrendingUp, Euro, Search, Filter, X, ChevronDown, Star,
  MapPin, Phone, Building2, ArrowRight, Sparkles, Gift,
  Download, Receipt, CreditCard, CalendarClock, RotateCcw, PackageCheck, PackageX, Truck,
  Heart, User, Mail, RefreshCw, Send
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { getAuth, signInAnonymously, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

/* ── Firebase ── */
const firebaseConfig = {
  apiKey: "AIzaSyDNj0GlusY9akmJsDL4gmWfwXEKkyKStYI",
  authDomain: "empro-plataforma.firebaseapp.com",
  projectId: "empro-plataforma",
  storageBucket: "empro-plataforma.firebasestorage.app",
  messagingSenderId: "1019620030255",
  appId: "1:1019620030255:web:45d823642969d12a3313da",
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

let authReady = false;
const authReadyPromise = new Promise(resolve => {
  signInAnonymously(auth)
    .then(() => { authReady = true; resolve(); })
    .catch(e => { console.warn("Auth anónima falhou:", e.message); resolve(); });
});

function useAuthReady() {
  const [ready, setReady] = React.useState(authReady);
  React.useEffect(() => {
    if (!authReady) authReadyPromise.then(() => setReady(true));
  }, []);
  return ready;
}

/* ── Google Fonts ── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

/* ── Tokens ── */
const T = {
  navy:   "#13294B", navyD: "#0a1a30", navyL: "#1e3d6e",
  red:    "#E73C3E", redL:  "#ff6b6d",
  bg:     "#F5F4F0", bgWarm:"#FDFCF8",
  white:  "#ffffff",
  text:   "#1a2744", muted: "#7a8ba8", mutedL:"#b0bdd0",
  border: "#E2DDD6",
  green:  "#1aab6d", orange:"#f59e0b", blue:"#3b82f6",
};

const S = {
  font:    "'DM Sans', sans-serif",
  display: "'Playfair Display', Georgia, serif",
};

/* ── Demo Data ── */
const INVITE_CODE = "EMPRO2025";

const CLIENT = {
  name: "Restaurante Marina", nif: "501234567", local: "Albufeira",
  tipo: "A", comercial: "João Ferreira", phone: "+351 912 000 000",
  saldo: 2740.80, limite: 8000, credito: 5259.20,
  desconto_base: 5,
};

const FAMILIAS = [
  { id:"cerveja",      label:"Cerveja",        icon:"🍺", color: T.orange },
  { id:"vinho",        label:"Vinho",           icon:"🍷", color: T.red    },
  { id:"espumante",    label:"Espumante",       icon:"🥂", color: T.navy   },
  { id:"refrigerante", label:"Refrigerantes",   icon:"🥤", color: T.blue   },
  { id:"agua",         label:"Água",            icon:"💧", color: "#06b6d4"},
  { id:"energetica",   label:"Energéticas",     icon:"⚡", color: T.green  },
  { id:"sucovmo",      label:"Sumos",           icon:"🍊", color: "#f97316"},
];

const PRODUTOS = [
  { id:1,  familia:"cerveja",      nome:"Sagres 33cl NR",           ref:"SAG-33NR", unidade:"cx 24un", preco:17.28,  iva:23, min:1,  destaque:true,  novo:false, desc:"A cerveja mais vendida em Portugal. Ideal para esplanadas e restauração." },
  { id:2,  familia:"cerveja",      nome:"Super Bock 33cl",          ref:"SB-33",    unidade:"cx 24un", preco:16.32,  iva:23, min:1,  destaque:true,  novo:false, desc:"Clássico nacional, preferência dos consumidores do Norte ao Sul." },
  { id:3,  familia:"cerveja",      nome:"Heineken 33cl",            ref:"HNK-33",   unidade:"cx 24un", preco:21.60,  iva:23, min:1,  destaque:false, novo:false, desc:"A cerveja internacional de referência para os clientes mais exigentes." },
  { id:4,  familia:"cerveja",      nome:"Sagres Preta 33cl",        ref:"SAG-PT",   unidade:"cx 24un", preco:18.00,  iva:23, min:1,  destaque:false, novo:true,  desc:"Cerveja torrada com sabor intenso e aroma a malte." },
  { id:5,  familia:"vinho",        nome:"Vinho Verde Gazela",       ref:"GAZ-VV",   unidade:"cx 6un",  preco:14.40,  iva:23, min:1,  destaque:true,  novo:false, desc:"Vinho verde frescante, perfeito para petiscos e peixe." },
  { id:6,  familia:"vinho",        nome:"Herdade do Esporão Branco",ref:"ESP-BR",   unidade:"cx 6un",  preco:43.80,  iva:23, min:1,  destaque:false, novo:false, desc:"Vinho premium do Alentejo, notas frutadas e mineral." },
  { id:7,  familia:"vinho",        nome:"Pêra-Manca Tinto",         ref:"PM-TT",    unidade:"cx 6un",  preco:98.40,  iva:23, min:1,  destaque:false, novo:false, desc:"Referência do vinho alentejano de topo." },
  { id:8,  familia:"espumante",    nome:"Murganheira Bruto",        ref:"MUR-BR",   unidade:"cx 6un",  preco:34.80,  iva:23, min:1,  destaque:true,  novo:false, desc:"Espumante nacional de qualidade, ideal para celebrações e aperitivos." },
  { id:9,  familia:"espumante",    nome:"Porta Nova Extra Bruto",   ref:"PN-XB",    unidade:"cx 6un",  preco:41.40,  iva:23, min:1,  destaque:false, novo:true,  desc:"Novo na gama — espumante vinhão de alta intensidade." },
  { id:10, familia:"refrigerante", nome:"Coca-Cola 33cl",           ref:"CC-33",    unidade:"cx 24un", preco:13.92,  iva:23, min:1,  destaque:true,  novo:false, desc:"O refrigerante mais consumido do mundo. Essencial em qualquer carta." },
  { id:11, familia:"refrigerante", nome:"Fanta Laranja 33cl",       ref:"FNT-33",   unidade:"cx 24un", preco:12.96,  iva:23, min:1,  destaque:false, novo:false, desc:"Alternativa frutada, ideal para famílias e público jovem." },
  { id:12, familia:"refrigerante", nome:"Lipton Ice Tea 33cl",      ref:"LIP-33",   unidade:"cx 24un", preco:14.88,  iva:23, min:1,  destaque:false, novo:false, desc:"Chá frio com sabor a limão, tendência crescente no verão." },
  { id:13, familia:"agua",         nome:"Água Monchique 1L",        ref:"MON-1L",   unidade:"cx 12un", preco:4.20,   iva:6,  min:2,  destaque:true,  novo:false, desc:"Água alcalina de nascente, a favorita dos clientes do Algarve." },
  { id:14, familia:"agua",         nome:"Água Luso 0,5L",           ref:"LUS-05",   unidade:"cx 24un", preco:5.76,   iva:6,  min:2,  destaque:false, novo:false, desc:"A água portuguesa mais reconhecida a nível nacional." },
  { id:15, familia:"energetica",   nome:"Red Bull 25cl",            ref:"RB-25",    unidade:"cx 24un", preco:34.80,  iva:23, min:1,  destaque:true,  novo:false, desc:"Líder mundial de bebidas energéticas. Alta margem e rotação rápida." },
  { id:16, familia:"energetica",   nome:"Monster Energy 50cl",      ref:"MON-50",   unidade:"cx 24un", preco:38.40,  iva:23, min:1,  destaque:false, novo:true,  desc:"Formato grande, tendência entre público 18–35 anos." },
  { id:17, familia:"sucovmo",      nome:"Compal Pêssego 33cl",      ref:"CMP-PE",   unidade:"cx 24un", preco:15.36,  iva:23, min:1,  destaque:false, novo:false, desc:"Sumo nacional de referência, grande aceitação em todas as idades." },
  { id:18, familia:"sucovmo",      nome:"Sumol Laranja 33cl",       ref:"SML-LR",   unidade:"cx 24un", preco:13.44,  iva:23, min:1,  destaque:false, novo:false, desc:"Clássico português com alta rotação em pastelarias e snack bars." },
];

const PROMOS = [
  { id:1, titulo:"Pack Verão Cerveja", desc:"Compre 5 caixas, leve 6", valor:"17% OFF", cor: T.red,    produtos:["SAG-33NR","SB-33"] },
  { id:2, titulo:"Promoção Red Bull",  desc:"Encomendas +10cx: €0.20/cx desconto", valor:"€0.20/cx", cor: T.blue,   produtos:["RB-25"] },
  { id:3, titulo:"Vinho Verde Quintas",desc:"Seleção Vinhos Verdes +50un", valor:"10% OFF", cor: T.green,  produtos:["GAZ-VV"] },
];

const HISTORICO = [
  { id:"ENC-2025-042", data:"26 Fev 2025", total:842.50,  items:5,  estado:"entregue",   prods:["Sagres 33cl ×3cx","Red Bull 25cl ×2cx"] },
  { id:"ENC-2025-031", data:"14 Fev 2025", total:1230.00, items:8,  estado:"entregue",   prods:["Super Bock 33cl ×5cx","Coca-Cola 33cl ×2cx","Água Monchique ×3cx"] },
  { id:"ENC-2025-018", data:"03 Fev 2025", total:390.80,  items:3,  estado:"entregue",   prods:["Vinho Verde Gazela ×4cx","Murganheira ×2cx"] },
  { id:"ENC-2025-007", data:"22 Jan 2025", total:2150.00, items:12, estado:"entregue",   prods:["Heineken 33cl ×8cx","Red Bull 25cl ×4cx"] },
  { id:"ENC-2025-001", data:"08 Jan 2025", total:590.80,  items:4,  estado:"entregue",   prods:["Sagres 33cl ×2cx","Fanta Laranja ×1cx","Sumol ×1cx"] },
];

const FATURAS = [
  { id:"FT 2025/042", enc:"ENC-2025-042", data:"28 Fev 2025", venc:"28 Mar 2025", total:842.50,  iva:162.50, liquido:680.00, estado:"pendente",  vencida:false },
  { id:"FT 2025/031", enc:"ENC-2025-031", data:"16 Fev 2025", venc:"18 Mar 2025", total:1230.00, iva:237.20, liquido:992.80, estado:"pendente",  vencida:false },
  { id:"FT 2025/018", enc:"ENC-2025-018", data:"05 Fev 2025", venc:"05 Mar 2025", total:390.80,  iva:75.40,  liquido:315.40, estado:"vencida",   vencida:true  },
  { id:"FT 2025/007", enc:"ENC-2025-007", data:"24 Jan 2025", venc:"24 Fev 2025", total:2150.00, iva:414.80, liquido:1735.20,estado:"paga",      vencida:false },
  { id:"FT 2025/001", enc:"ENC-2025-001", data:"10 Jan 2025", venc:"10 Fev 2025", total:590.80,  iva:113.92, liquido:476.88, estado:"paga",      vencida:false },
  { id:"FT 2024/198", enc:"ENC-2024-198", data:"22 Dez 2024", venc:"22 Jan 2025", total:1840.20, iva:355.00, liquido:1485.20,estado:"paga",      vencida:false },
];
function precoCliente(p, desconto_base = 0) {
  const d = desconto_base / 100;
  return p.preco * (1 - d);
}

function fmt(n) { return n.toLocaleString("pt-PT", { minimumFractionDigits:2, maximumFractionDigits:2 }); }

function openPdf(pdfData) {
  if (!pdfData) return;
  try {
    if (pdfData.startsWith("data:")) {
      const base64 = pdfData.split(",")[1];
      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob), "_blank");
    } else {
      window.open(pdfData, "_blank");
    }
  } catch(e) { alert("Erro ao abrir PDF: " + e.message); }
}

/* ── Components ── */

function Badge({ children, color, small }) {
  return (
    <span style={{ background: color+"22", color, padding: small ? "2px 7px" : "3px 10px", borderRadius:20, fontSize: small ? 10 : 11, fontWeight:700, fontFamily:"monospace", letterSpacing:0.4, whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, variant="primary", size="md", icon: Icon, full, disabled }) {
  const styles = {
    primary:   { bg: T.red,    color:"white",  border: "none" },
    secondary: { bg: "white",  color: T.navy,  border: `1px solid ${T.border}` },
    ghost:     { bg: "transparent", color: T.muted, border: "none" },
    navy:      { bg: T.navy,   color:"white",  border: "none" },
  };
  const sizes = { sm:"8px 14px", md:"11px 20px", lg:"14px 28px" };
  const st = styles[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: st.bg, color: st.color, border: st.border,
      padding: sizes[size], borderRadius:10, fontSize: size==="sm" ? 12 : 14,
      fontWeight:600, fontFamily: S.font, cursor: disabled ? "not-allowed" : "pointer",
      display:"inline-flex", alignItems:"center", gap:6, opacity: disabled ? 0.5 : 1,
      width: full ? "100%" : "auto", justifyContent:"center",
      transition:"all .15s", boxShadow: variant==="primary" ? `0 3px 12px ${T.red}44` : "none",
    }}
      onMouseEnter={e => { if(!disabled && variant==="primary") e.currentTarget.style.background=T.navyD; }}
      onMouseLeave={e => { if(!disabled && variant==="primary") e.currentTarget.style.background=T.red; }}
    >
      {Icon && <Icon size={size==="sm"?13:15} />}{children}
    </button>
  );
}

/* ── ECRÃ: Acesso por Convite ── */
function EcrãLogin({ onAccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return setError("Preencha o email e a password.");
    setLoading(true); setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Verificar se cliente está activo no Firestore
      const snap = await new Promise(resolve => {
        const unsub = onSnapshot(
          query(collection(db, "clientes")),
          s => { unsub(); resolve(s); }
        );
      });
      const clienteDoc = snap.docs.find(d => d.data().uid === cred.user.uid || d.data().email === email);
      if (clienteDoc && clienteDoc.data().ativo === false) {
        await signOut(auth);
        setError("Conta desactivada. Contacte a EMPRO.");
        setShake(true); setTimeout(() => setShake(false), 500);
      } else {
        onAccess(cred.user, clienteDoc?.data() || {});
      }
    } catch (e) {
      const msgs = {
        "auth/invalid-credential": "Email ou password incorrectos.",
        "auth/user-not-found": "Email não encontrado.",
        "auth/wrong-password": "Password incorrecta.",
        "auth/too-many-requests": "Demasiadas tentativas. Tente mais tarde.",
        "auth/invalid-email": "Email inválido.",
      };
      setError(msgs[e.code] || "Erro ao entrar. Tente novamente.");
      setShake(true); setTimeout(() => setShake(false), 500);
    } finally { setLoading(false); }
  };

  const handleReset = async () => {
    if (!email) return setError("Introduza o seu email para recuperar a password.");
    setLoading(true); setError("");
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth");
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (e) {
      setError("Não foi possível enviar o email. Verifique o endereço.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background: T.navyD, display:"flex", fontFamily: S.font, overflow:"hidden", position:"relative" }}>
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }`}</style>
      {/* Fundo geométrico */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:-120, right:-120, width:500, height:500, borderRadius:"50%", background:`${T.red}12`, border:`1px solid ${T.red}22` }} />
        <div style={{ position:"absolute", bottom:-80, left:-80, width:400, height:400, borderRadius:"50%", background:`${T.navyL}44`, border:`1px solid ${T.navyL}33` }} />
        {[0,1,2,3,4].map(i => <div key={i} style={{ position:"absolute", left:0, right:0, top:`${i*25}%`, height:1, background:`${T.navyL}22` }} />)}
      </div>

      {/* Lado esquerdo */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 80px", position:"relative" }}>
        <div style={{ marginBottom:60 }}>
          <div style={{ fontSize:11, color: T.red, letterSpacing:4, fontFamily:"monospace", marginBottom:8 }}>DISTRIBUIDORA DE BEBIDAS</div>
          <div style={{ fontSize:48, fontWeight:800, color:"white", fontFamily: S.display, lineHeight:1 }}>EMPRO</div>
          <div style={{ fontSize:13, color: T.muted, letterSpacing:2, marginTop:4 }}>EMPRODALBE, LDA · DESDE 1990</div>
        </div>
        <div style={{ maxWidth:460 }}>
          <h1 style={{ fontSize:38, fontWeight:700, color:"white", fontFamily: S.display, lineHeight:1.2, marginBottom:16 }}>
            A sua loja<br /><span style={{ color: T.red }}>B2B privada.</span>
          </h1>
          <p style={{ fontSize:16, color: T.muted, lineHeight:1.7, marginBottom:40 }}>
            Acesso exclusivo para clientes EMPRO.<br />Encomende 24h/dia com os seus preços personalizados.
          </p>
          {[
            { Icon: Tag,      text: "Preços personalizados para a sua empresa" },
            { Icon: Package,  text: "Catálogo completo com stock em tempo real" },
            { Icon: FileText, text: "Histórico e faturas sempre disponíveis" },
          ].map((f,i) => {
            const FIcon = f.Icon;
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${T.red}22`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <FIcon size={16} color={T.red} />
                </div>
                <span style={{ fontSize:14, color: T.mutedL }}>{f.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lado direito — form */}
      <div style={{ width:460, display:"flex", alignItems:"center", justifyContent:"center", padding:40, position:"relative" }}>
        <div style={{ background: T.bgWarm, borderRadius:24, padding:48, width:"100%", boxShadow:"0 32px 80px rgba(0,0,0,.4)", animation: shake ? "shake .4s ease" : "none" }}>

          {resetSent ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:40, marginBottom:16 }}>📧</div>
              <div style={{ fontSize:20, fontWeight:700, color: T.navy, fontFamily: S.display, marginBottom:10 }}>Email enviado!</div>
              <div style={{ fontSize:14, color: T.muted, marginBottom:28 }}>Verifique a sua caixa de entrada e siga as instruções para repor a password.</div>
              <Btn onClick={() => { setResetMode(false); setResetSent(false); }} full>Voltar ao Login</Btn>
            </div>
          ) : resetMode ? (
            <>
              <div style={{ marginBottom:28 }}>
                <button onClick={() => setResetMode(false)} style={{ background:"none", border:"none", cursor:"pointer", color: T.muted, fontSize:13, marginBottom:16, display:"flex", alignItems:"center", gap:6 }}>
                  ← Voltar
                </button>
                <div style={{ fontSize:22, fontWeight:700, color: T.navy, fontFamily: S.display, marginBottom:8 }}>Recuperar password</div>
                <div style={{ fontSize:14, color: T.muted }}>Enviamos um link para repor a sua password.</div>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11, fontWeight:700, color: T.muted, textTransform:"uppercase", letterSpacing:1.5, display:"block", marginBottom:8, fontFamily:"monospace" }}>Email</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="o-seu@email.pt"
                  style={{ width:"100%", padding:"13px 16px", borderRadius:12, boxSizing:"border-box", border:`2px solid ${error ? T.red : T.border}`, fontSize:15, color: T.navy, background: T.white, outline:"none" }} />
              </div>
              {error && <div style={{ color: T.red, fontSize:13, marginBottom:14, display:"flex", alignItems:"center", gap:6 }}><AlertCircle size={14}/>{error}</div>}
              <Btn onClick={handleReset} disabled={loading} full size="lg">{loading ? "A enviar..." : "Enviar link de recuperação"}</Btn>
            </>
          ) : (
            <>
              <div style={{ marginBottom:32 }}>
                <div style={{ fontSize:22, fontWeight:700, color: T.navy, fontFamily: S.display, marginBottom:8 }}>Bem-vindo</div>
                <div style={{ fontSize:14, color: T.muted }}>Entre com as credenciais enviadas pelo seu comercial EMPRO.</div>
              </div>

              <div style={{ marginBottom:18 }}>
                <label style={{ fontSize:11, fontWeight:700, color: T.muted, textTransform:"uppercase", letterSpacing:1.5, display:"block", marginBottom:8, fontFamily:"monospace" }}>Email</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="o-seu@email.pt"
                  style={{ width:"100%", padding:"13px 16px", borderRadius:12, boxSizing:"border-box", border:`2px solid ${error ? T.red : T.border}`, fontSize:15, color: T.navy, background: error ? `${T.red}08` : T.white, outline:"none", transition:"border .2s" }} />
              </div>

              <div style={{ marginBottom:10 }}>
                <label style={{ fontSize:11, fontWeight:700, color: T.muted, textTransform:"uppercase", letterSpacing:1.5, display:"block", marginBottom:8, fontFamily:"monospace" }}>Password</label>
                <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••"
                  style={{ width:"100%", padding:"13px 16px", borderRadius:12, boxSizing:"border-box", border:`2px solid ${error ? T.red : T.border}`, fontSize:15, color: T.navy, background: error ? `${T.red}08` : T.white, outline:"none", transition:"border .2s" }} />
              </div>

              <button onClick={() => { setResetMode(true); setError(""); }} style={{ background:"none", border:"none", cursor:"pointer", color: T.muted, fontSize:12, marginBottom:22, textDecoration:"underline" }}>
                Esqueci a password
              </button>

              {error && <div style={{ color: T.red, fontSize:13, marginBottom:16, display:"flex", alignItems:"center", gap:6 }}><AlertCircle size={14}/>{error}</div>}

              <Btn onClick={handleLogin} disabled={loading} full size="lg" icon={ArrowRight}>
                {loading ? "A entrar..." : "Entrar na Loja"}
              </Btn>

              <div style={{ marginTop:24, padding:"14px 16px", background: T.bg, borderRadius:12, display:"flex", gap:12, alignItems:"flex-start" }}>
                <Phone size={14} color={T.muted} style={{ marginTop:2, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color: T.navy }}>Ainda não tem acesso?</div>
                  <div style={{ fontSize:12, color: T.muted, marginTop:2 }}>Contacte a EMPRO: <strong style={{ color: T.navy }}>+351 289 400 450</strong></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── ECRÃ: Dashboard ── */
function EcrãDashboard({ onNav, cart, cliente = CLIENT }) {
  const pct = Math.round(cliente.saldo / cliente.limite * 100);

  return (
    <div>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, ${T.navyD}, ${T.navy})`, borderRadius:20, padding:"32px 36px", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:240, height:240, borderRadius:"50%", background:`${T.red}18` }} />
        <div style={{ position:"absolute", bottom:-40, right:120, width:160, height:160, borderRadius:"50%", background:`${T.navyL}44` }} />
        <div style={{ position:"relative" }}>
          <div style={{ fontSize:12, color: T.mutedL, letterSpacing:2, textTransform:"uppercase", fontFamily:"monospace", marginBottom:6 }}>Bem-vindo de volta</div>
          <h1 style={{ fontSize:28, fontWeight:700, color:"white", fontFamily: S.display, margin:"0 0 4px" }}>{cliente.name}</h1>
          <div style={{ display:"flex", gap:16, alignItems:"center", marginTop:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, color: T.mutedL, fontSize:13 }}><MapPin size={13} />{cliente.local}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, color: T.mutedL, fontSize:13 }}><Building2 size={13} />NIF {cliente.nif}</div>
            <Badge color={T.orange}>Tipo {cliente.tipo}</Badge>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
        {[
          { label:"Saldo em Aberto", value:`€${fmt(cliente.saldo)}`, sub:"em faturas por vencer", color: T.red,    Icon: Euro,       warn: pct > 70 },
          { label:"Crédito Disponível", value:`€${fmt(cliente.credito)}`, sub:`de €${fmt(cliente.limite)} de limite`, color: T.green, Icon: TrendingUp, warn: false },
          { label:"Desconto Personalizado", value:`${cliente.desconto_base}%`, sub:"aplicado a todo o catálogo", color: T.navy, Icon: Tag, warn: false },
        ].map((k,i) => {
          const KIcon = k.Icon;
          return (
          <div key={i} style={{ background: T.white, borderRadius:16, padding:"20px 22px", border:`1px solid ${T.border}`, borderTop:`3px solid ${k.color}` }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${k.color}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
              <KIcon size={18} color={k.color} />
            </div>
            <div style={{ fontSize:24, fontWeight:800, color: k.color, fontFamily: S.display }}>{k.value}</div>
            <div style={{ fontSize:12, color: T.muted, marginTop:3 }}>{k.label}</div>
            {i === 0 && (
              <div style={{ marginTop:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:10, color: T.muted }}>{pct}% do limite</span>
                </div>
                <div style={{ height:4, background: T.bg, borderRadius:2 }}>
                  <div style={{ width:`${pct}%`, height:"100%", background: pct>70 ? T.red : T.green, borderRadius:2 }} />
                </div>
              </div>
            )}
          </div>
          );
        })}
      </div>

      {/* Promoções */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:18, fontWeight:700, color: T.navy, fontFamily: S.display }}>Promoções Ativas</div>
          <Btn variant="ghost" size="sm" onClick={() => onNav("catalogo")} icon={ChevronRight}>Ver catálogo</Btn>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {PROMOS.map(p => (
            <div key={p.id} onClick={() => onNav("catalogo")} style={{ background: T.white, borderRadius:14, padding:"18px 20px", border:`1px solid ${T.border}`, cursor:"pointer", borderLeft:`4px solid ${p.cor}`, transition:"box-shadow .15s" }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.08)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <Gift size={18} color={p.cor} />
                <span style={{ background:`${p.cor}22`, color:p.cor, fontWeight:800, fontSize:13, padding:"3px 10px", borderRadius:20 }}>{p.valor}</span>
              </div>
              <div style={{ fontSize:14, fontWeight:700, color: T.navy, fontFamily: S.display, marginBottom:4 }}>{p.titulo}</div>
              <div style={{ fontSize:12, color: T.muted }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Últimas encomendas */}
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:18, fontWeight:700, color: T.navy, fontFamily: S.display }}>Últimas Encomendas</div>
          <Btn variant="ghost" size="sm" onClick={() => onNav("historico")} icon={ChevronRight}>Ver todas</Btn>
        </div>
        <div style={{ background: T.white, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden" }}>
          {HISTORICO.slice(0,3).map((enc,i) => (
            <div key={enc.id} style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 20px", borderBottom: i<2 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${T.green}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <CheckCircle size={18} color={T.green} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color: T.navy }}>{enc.id}</div>
                <div style={{ fontSize:12, color: T.muted }}>{enc.data} · {enc.items} artigos</div>
              </div>
              <div style={{ fontWeight:700, color: T.navy, fontSize:15 }}>€{fmt(enc.total)}</div>
              <Badge color={T.green} small>entregue</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── ECRÃ: Catálogo ── */
function EcrãCatalogo({ produtos, loadingProdutos, cart, onCart, favorites, onToggleFav, cliente = CLIENT }) {
  const [familia, setFamilia] = useState("todos");
  const [search, setSearch] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [showFavs, setShowFavs] = useState(false);
  const [qtds, setQtds] = useState({});

  const filtered = produtos.filter(p => {
    const matchFam = familia === "todos" || p.familia === familia;
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.ref.toLowerCase().includes(search.toLowerCase());
    const matchPromo = !showPromo || PROMOS.some(pr => pr.produtos.includes(p.ref));
    const matchFav = !showFavs || favorites.includes(p.id);
    return matchFam && matchSearch && matchPromo && matchFav;
  });

  const setQtd = (id, v) => setQtds(q => ({ ...q, [id]: Math.max(0, v) }));

  const addToCart = (prod) => {
    const qty = qtds[prod.id] || prod.min;
    onCart(prod, qty);
    setQtds(q => ({ ...q, [prod.id]: 0 }));
  };

  const inCart = (id) => cart.find(c => c.id === id);

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:11, color: T.muted, letterSpacing:2, textTransform:"uppercase", fontFamily:"monospace", marginBottom:4 }}>Loja EMPRO</div>
          <h1 style={{ margin:0, fontSize:28, fontWeight:700, color: T.navy, fontFamily: S.display }}>Catálogo</h1>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, background: T.white, border:`1px solid ${T.border}`, borderRadius:10, padding:"9px 14px" }}>
            <Search size={14} color={T.muted} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar produto ou ref..." style={{ border:"none", outline:"none", fontSize:13, color: T.text, width:200, background:"transparent", fontFamily: S.font }} />
            {search && <X size={13} color={T.muted} style={{ cursor:"pointer" }} onClick={() => setSearch("")} />}
          </div>
          <button onClick={() => setShowPromo(!showPromo)} style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 14px", borderRadius:10, border:`1px solid ${showPromo ? T.red : T.border}`, background: showPromo ? `${T.red}11` : T.white, color: showPromo ? T.red : T.muted, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily: S.font }}>
            <Sparkles size={14} />Promoções
          </button>
          <button onClick={() => setShowFavs(!showFavs)} style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 14px", borderRadius:10, border:`1px solid ${showFavs ? T.orange : T.border}`, background: showFavs ? `${T.orange}11` : T.white, color: showFavs ? T.orange : T.muted, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily: S.font }}>
            <Heart size={14} fill={showFavs ? T.orange : "none"} />Favoritos {favorites.length > 0 && `(${favorites.length})`}
          </button>
        </div>
      </div>

      {/* Famílias */}
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        <button onClick={() => setFamilia("todos")} style={{ padding:"8px 16px", borderRadius:20, border:`1px solid ${familia==="todos" ? T.navy : T.border}`, background: familia==="todos" ? T.navy : T.white, color: familia==="todos" ? "white" : T.muted, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily: S.font }}>
          Todos ({produtos.length})
        </button>
        {FAMILIAS.map(f => {
          const count = produtos.filter(p => p.familia === f.id).length;
          const active = familia === f.id;
          return (
            <button key={f.id} onClick={() => setFamilia(f.id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:20, border:`1px solid ${active ? f.color : T.border}`, background: active ? `${f.color}18` : T.white, color: active ? f.color : T.muted, fontSize:13, fontWeight: active ? 700 : 400, cursor:"pointer", fontFamily: S.font }}>
              <span>{f.icon}</span>{f.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:14 }}>
        {filtered.map(p => {
          const preco = precoCliente(p, cliente.desconto_base);
          const precoIva = preco * (1 + p.iva/100);
          const inC = inCart(p.id);
          const famColor = FAMILIAS.find(f => f.id === p.familia)?.color || T.navy;
          const promoAtiva = PROMOS.find(pr => pr.produtos.includes(p.ref));

          return (
            <div key={p.id} style={{ background: T.white, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden", transition:"box-shadow .15s, transform .15s" }}
              onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 8px 28px rgba(19,41,75,.1)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              {/* Topo — quadrado com badges e botões sobrepostos */}
              <div style={{ position:"relative", width:"100%", paddingBottom:"100%", background:`linear-gradient(135deg, ${famColor}15, ${famColor}05)`, borderBottom:`1px solid ${T.border}`, overflow:"hidden" }}>
                {p.foto
                  ? <img src={p.foto} alt={p.nome} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"contain", padding:"16px" }} />
                  : <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}><Package size={52} color={famColor + "33"} /></div>
                }
                {/* Badges topo esquerda */}
                <div style={{ position:"absolute", top:10, left:10, display:"flex", gap:5, flexWrap:"wrap", zIndex:2 }}>
                  <Badge color={famColor} small>{FAMILIAS.find(f=>f.id===p.familia)?.label}</Badge>
                  {p.destaque && <Badge color={T.orange} small>⭐ Destaque</Badge>}
                  {p.novo && <Badge color={T.green} small>Novo</Badge>}
                  {promoAtiva && <Badge color={T.red} small>🎁 Promo</Badge>}
                </div>
                {/* Botões topo direita */}
                <div style={{ position:"absolute", top:10, right:10, display:"flex", flexDirection:"column", gap:6, zIndex:2 }}>
                  <button onClick={(e) => { e.stopPropagation(); onToggleFav(p.id); }} style={{ width:32, height:32, background:"white", border:"none", cursor:"pointer", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 6px #0002" }}>
                    <Heart size={15} color={favorites.includes(p.id) ? T.orange : T.mutedL} fill={favorites.includes(p.id) ? T.orange : "none"} style={{ transition:"all .2s" }} />
                  </button>
                  {inC && <div style={{ width:32, height:32, borderRadius:"50%", background: T.green, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 6px #0002" }}><CheckCircle size={15} color="white" /></div>}
                </div>
                {/* Botão PDF fundo esquerda */}
                {p.pdf && (
                  <button onClick={(e) => { e.stopPropagation(); openPdf(p.pdf); }}
                    style={{ position:"absolute", bottom:10, left:10, zIndex:2, display:"flex", alignItems:"center", gap:5, background:"white", border:`1px solid ${T.red}`, borderRadius:8, padding:"5px 10px", color: T.red, fontSize:11, fontWeight:700, cursor:"pointer", boxShadow:"0 1px 6px #0002" }}>
                    <FileText size={13} /> Ficha Técnica
                  </button>
                )}
              </div>

              {/* Corpo */}
              <div style={{ padding:"16px 18px" }}>
                <div style={{ fontSize:11, color: T.muted, fontFamily:"monospace", marginBottom:4 }}>{p.ref}</div>
                <div style={{ fontSize:15, fontWeight:700, color: T.navy, fontFamily: S.display, marginBottom:6, lineHeight:1.3 }}>{p.nome}</div>
                <div style={{ fontSize:12, color: T.muted, lineHeight:1.5, marginBottom:14, minHeight:36 }}>{p.desc}</div>

                {/* Preços */}
                <div style={{ background: T.bg, borderRadius:10, padding:"10px 12px", marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                    <div>
                      <div style={{ fontSize:18, fontWeight:800, color: T.navy, fontFamily: S.display }}>€{fmt(preco)}</div>
                      <div style={{ fontSize:10, color: T.muted }}>s/ IVA · por {p.unidade}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:13, color: T.muted }}>€{fmt(precoIva)}</div>
                      <div style={{ fontSize:10, color: T.muted }}>c/ IVA {p.iva}%</div>
                    </div>
                  </div>
                  {cliente.desconto_base > 0 && (
                    <div style={{ marginTop:6, fontSize:11, color: T.green, fontWeight:600 }}>
                      ✓ Desconto {cliente.desconto_base}% aplicado
                    </div>
                  )}
                </div>

                {/* Quantidade + Add */}
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", border:`1px solid ${T.border}`, borderRadius:8, overflow:"hidden" }}>
                    <button onClick={() => setQtd(p.id, (qtds[p.id]||p.min) - 1)} style={{ width:32, height:36, background:"none", border:"none", cursor:"pointer", color: T.muted, display:"flex", alignItems:"center", justifyContent:"center" }}><Minus size={13} /></button>
                    <div style={{ width:36, textAlign:"center", fontSize:14, fontWeight:700, color: T.navy }}>{qtds[p.id] || p.min}</div>
                    <button onClick={() => setQtd(p.id, (qtds[p.id]||p.min) + 1)} style={{ width:32, height:36, background:"none", border:"none", cursor:"pointer", color: T.muted, display:"flex", alignItems:"center", justifyContent:"center" }}><Plus size={13} /></button>
                  </div>
                  <Btn onClick={() => addToCart(p)} full icon={ShoppingCart} size="sm">
                    {inC ? "Atualizar" : "Adicionar"}
                  </Btn>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 20px", color: T.muted }}>
          <Package size={48} color={T.border} style={{ margin:"0 auto 12px" }} />
          <div style={{ fontSize:16 }}>Nenhum produto encontrado.</div>
        </div>
      )}
    </div>
  );
}

/* ── ECRÃ: Carrinho ── */
function EcrãCarrinho({ cart, onUpdateCart, onRemove, onNav, onCheckout, cliente = CLIENT }) {
  const [obs, setObs] = useState("");
  const [success, setSuccess] = useState(false);

  const subtotal = cart.reduce((s,c) => s + precoCliente(c) * c.qty, 0);
  const ivaTotal = cart.reduce((s,c) => s + precoCliente(c) * c.qty * (c.iva/100), 0);
  const total    = subtotal + ivaTotal;

  const handleOrder = async () => {
    // Guarda encomenda no Firebase
    try {
      const encomenda = {
        cliente: cliente.name,
        nif: cliente.nif,
        local: cliente.local,
        comercial: cliente.comercial,
        items: cart.map(c => ({
          id: c.id,
          nome: c.nome,
          ref: c.ref,
          qty: c.qty,
          unidade: c.unidade,
          precoUnit: precoCliente(c),
          total: precoCliente(c) * c.qty,
        })),
        subtotal,
        iva: ivaTotal,
        total,
        observacoes: obs,
        estado: "pendente",
        criadoEm: serverTimestamp(),
      };
      await addDoc(collection(db, "encomendas"), encomenda);
    } catch (e) {
      console.error("Erro ao guardar encomenda:", e);
    }

    // Abre email de confirmação
    const linhas = cart.map(c => `- ${c.nome} × ${c.qty} ${c.unidade} = €${fmt(precoCliente(c)*c.qty)}`).join("%0D%0A");
    const obsLine = obs ? `%0D%0AObservações: ${encodeURIComponent(obs)}` : "";
    const subject = encodeURIComponent(`Nova Encomenda — ${cliente.name} — ${new Date().toLocaleDateString("pt-PT")}`);
    const body = encodeURIComponent(`Boa tarde,\n\nO cliente ${cliente.name} (NIF ${cliente.nif}) submeteu uma nova encomenda:\n\n`)
      + linhas
      + `%0D%0A%0D%0ASubtotal s/ IVA: €${fmt(subtotal)}%0D%0AIVA: €${fmt(ivaTotal)}%0D%0ATotal c/ IVA: €${fmt(total)}`
      + obsLine
      + `%0D%0A%0D%0AEncomenda submetida via Loja B2B EMPRO.`;
    window.open(`mailto:geral@empro.pt?subject=${subject}&body=${body}`);
    setSuccess(true);
    onCheckout();
  };

  if (success) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", textAlign:"center" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:`${T.green}18`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
        <CheckCircle size={40} color={T.green} />
      </div>
      <h2 style={{ fontFamily: S.display, color: T.navy, fontSize:28, marginBottom:8 }}>Encomenda enviada!</h2>
      <p style={{ color: T.muted, marginBottom:8, fontSize:15 }}>O seu comercial <strong>{cliente.comercial}</strong> vai confirmar em breve.</p>
      <div style={{ display:"flex", alignItems:"center", gap:7, background:`${T.blue}11`, border:`1px solid ${T.blue}33`, borderRadius:10, padding:"10px 18px", marginBottom:32, color:T.blue, fontSize:13 }}>
        <Mail size={14} />
        Email de confirmação aberto no seu cliente de correio.
      </div>
      <Btn onClick={() => { setSuccess(false); onNav("dashboard"); }} icon={Home}>Voltar ao início</Btn>
    </div>
  );

  if (cart.length === 0) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", textAlign:"center" }}>
      <ShoppingCart size={56} color={T.border} style={{ marginBottom:20 }} />
      <h2 style={{ fontFamily: S.display, color: T.navy, fontSize:24, marginBottom:8 }}>Carrinho vazio</h2>
      <p style={{ color: T.muted, marginBottom:28 }}>Adicione produtos do catálogo para encomendar.</p>
      <Btn onClick={() => onNav("catalogo")} icon={Package}>Ir ao catálogo</Btn>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color: T.muted, letterSpacing:2, textTransform:"uppercase", fontFamily:"monospace", marginBottom:4 }}>Revisão da</div>
        <h1 style={{ margin:0, fontSize:28, fontWeight:700, color: T.navy, fontFamily: S.display }}>Encomenda</h1>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20, alignItems:"start" }}>
        {/* Itens */}
        <div style={{ background: T.white, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden" }}>
          {cart.map((item,i) => {
            const preco = precoCliente(item);
            return (
              <div key={item.id} style={{ display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:16, padding:"16px 20px", borderBottom: i<cart.length-1 ? `1px solid ${T.border}` : "none", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color: T.navy, fontFamily: S.display }}>{item.nome}</div>
                  <div style={{ fontSize:12, color: T.muted }}>{item.ref} · {item.unidade}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", border:`1px solid ${T.border}`, borderRadius:8 }}>
                  <button onClick={() => onUpdateCart(item.id, item.qty-1)} style={{ width:30, height:32, background:"none", border:"none", cursor:"pointer", color: T.muted, display:"flex", alignItems:"center", justifyContent:"center" }}><Minus size={12} /></button>
                  <div style={{ width:30, textAlign:"center", fontSize:13, fontWeight:700, color: T.navy }}>{item.qty}</div>
                  <button onClick={() => onUpdateCart(item.id, item.qty+1)} style={{ width:30, height:32, background:"none", border:"none", cursor:"pointer", color: T.muted, display:"flex", alignItems:"center", justifyContent:"center" }}><Plus size={12} /></button>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontWeight:700, color: T.navy }}>€{fmt(preco * item.qty)}</div>
                  <div style={{ fontSize:11, color: T.muted }}>€{fmt(preco)}/un</div>
                </div>
                <button onClick={() => onRemove(item.id)} style={{ background:"none", border:"none", cursor:"pointer", color: T.muted, padding:4 }}><Trash2 size={15} /></button>
              </div>
            );
          })}
        </div>

        {/* Resumo */}
        <div style={{ background: T.white, borderRadius:16, border:`1px solid ${T.border}`, padding:24, position:"sticky", top:20 }}>
          <div style={{ fontSize:16, fontWeight:700, color: T.navy, fontFamily: S.display, marginBottom:20 }}>Resumo</div>

          {[
            { label: "Subtotal s/ IVA", value: `€${fmt(subtotal)}` },
            { label: `IVA`, value: `€${fmt(ivaTotal)}` },
          ].map(r => (
            <div key={r.label} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:13, color: T.muted }}>{r.label}</span>
              <span style={{ fontSize:13, color: T.navy }}>{r.value}</span>
            </div>
          ))}

          <div style={{ display:"flex", justifyContent:"space-between", padding:"14px 0", borderTop:`2px solid ${T.border}`, margin:"10px 0 20px" }}>
            <span style={{ fontSize:16, fontWeight:700, color: T.navy }}>Total c/ IVA</span>
            <span style={{ fontSize:20, fontWeight:800, color: T.red, fontFamily: S.display }}>€{fmt(total)}</span>
          </div>

          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:11, fontWeight:700, color: T.muted, textTransform:"uppercase", letterSpacing:1, display:"block", marginBottom:6, fontFamily:"monospace" }}>Observações</label>
            <textarea value={obs} onChange={e => setObs(e.target.value)} placeholder="Hora de entrega, instruções especiais..." rows={3} style={{ width:"100%", padding:"10px 12px", border:`1px solid ${T.border}`, borderRadius:10, fontSize:13, color: T.text, background: T.bg, outline:"none", resize:"vertical", fontFamily: S.font, boxSizing:"border-box" }} />
          </div>

          <Btn onClick={() => handleOrder()} full size="lg" icon={CheckCircle}>
            Confirmar Encomenda
          </Btn>

          <div style={{ marginTop:12, fontSize:12, color: T.muted, textAlign:"center" }}>
            O seu comercial <strong>{cliente.comercial}</strong> irá confirmar.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ECRÃ: Histórico ── */
function EcrãHistorico({ onRepetir, onNav }) {
  const [expanded, setExpanded] = useState(null);
  const [repetido, setRepetido] = useState(null);
  const estadoColor = { entregue: T.green, confirmada: T.orange, pendente: T.muted };

  const handleRepetir = (enc) => {
    onRepetir(enc);
    setRepetido(enc.id);
    setTimeout(() => { setRepetido(null); onNav("carrinho"); }, 800);
  };

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color: T.muted, letterSpacing:2, textTransform:"uppercase", fontFamily:"monospace", marginBottom:4 }}>Conta Corrente</div>
        <h1 style={{ margin:0, fontSize:28, fontWeight:700, color: T.navy, fontFamily: S.display }}>Histórico de Encomendas</h1>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
        <div style={{ background: T.white, borderRadius:14, padding:"18px 20px", border:`1px solid ${T.border}`, borderTop:`3px solid ${T.navy}` }}>
          <div style={{ fontSize:22, fontWeight:800, color: T.navy, fontFamily: S.display }}>{HISTORICO.length}</div>
          <div style={{ fontSize:12, color: T.muted }}>Encomendas totais</div>
        </div>
        <div style={{ background: T.white, borderRadius:14, padding:"18px 20px", border:`1px solid ${T.border}`, borderTop:`3px solid ${T.red}` }}>
          <div style={{ fontSize:22, fontWeight:800, color: T.red, fontFamily: S.display }}>€{fmt(HISTORICO.reduce((s,e) => s+e.total, 0))}</div>
          <div style={{ fontSize:12, color: T.muted }}>Volume total comprado</div>
        </div>
        <div style={{ background: T.white, borderRadius:14, padding:"18px 20px", border:`1px solid ${T.border}`, borderTop:`3px solid ${T.green}` }}>
          <div style={{ fontSize:22, fontWeight:800, color: T.green, fontFamily: S.display }}>€{fmt(cliente.saldo)}</div>
          <div style={{ fontSize:12, color: T.muted }}>Saldo em aberto</div>
        </div>
      </div>

      {/* Lista */}
      <div style={{ background: T.white, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden" }}>
        {HISTORICO.map((enc,i) => (
          <div key={enc.id}>
            <div onClick={() => setExpanded(expanded === enc.id ? null : enc.id)} style={{ display:"grid", gridTemplateColumns:"auto 1fr auto auto auto", gap:16, padding:"16px 20px", borderBottom:`1px solid ${T.border}`, alignItems:"center", cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.background=T.bg+"88"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{ width:40, height:40, borderRadius:10, background:`${estadoColor[enc.estado]}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <CheckCircle size={18} color={estadoColor[enc.estado]} />
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color: T.navy }}>{enc.id}</div>
                <div style={{ fontSize:12, color: T.muted }}>{enc.data} · {enc.items} artigos</div>
              </div>
              <Badge color={estadoColor[enc.estado]} small>{enc.estado}</Badge>
              <div style={{ fontWeight:800, color: T.navy, fontSize:16, fontFamily: S.display }}>€{fmt(enc.total)}</div>
              <ChevronDown size={16} color={T.muted} style={{ transform: expanded===enc.id ? "rotate(180deg)" : "none", transition:"transform .2s" }} />
            </div>
            {expanded === enc.id && (
              <div style={{ background: T.bg, padding:"14px 20px 14px 76px", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ fontSize:11, fontWeight:700, color: T.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:8, fontFamily:"monospace" }}>Artigos</div>
                {enc.prods.map((pr,j) => (
                  <div key={j} style={{ fontSize:13, color: T.text, padding:"4px 0", borderBottom: j<enc.prods.length-1 ? `1px solid ${T.border}` : "none" }}>{pr}</div>
                ))}
                <div style={{ marginTop:12, display:"flex", gap:8 }}>
                  <Btn variant="secondary" size="sm" icon={FileText}>Ver Fatura</Btn>
                  <Btn variant="secondary" size="sm" icon={repetido===enc.id ? CheckCircle : RefreshCw}
                    onClick={() => handleRepetir(enc)}>
                    {repetido===enc.id ? "Adicionado!" : "Repetir Encomenda"}
                  </Btn>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ECRÃ: Faturas ── */
function EcrãFaturas({ cliente = CLIENT }) {
  const [filtro, setFiltro] = useState("todas");
  const [downloading, setDownloading] = useState(null);

  const totalDivida  = FATURAS.filter(f => f.estado !== "paga").reduce((s,f) => s+f.total, 0);
  const totalVencido = FATURAS.filter(f => f.vencida).reduce((s,f) => s+f.total, 0);
  const plafond      = cliente.limite - cliente.saldo;
  const pctCredito   = Math.round(cliente.saldo / cliente.limite * 100);

  const filtered = FATURAS.filter(f => {
    if (filtro === "pendentes") return f.estado === "pendente";
    if (filtro === "vencidas")  return f.estado === "vencida";
    if (filtro === "pagas")     return f.estado === "paga";
    return true;
  });

  const estadoCor  = { pendente: T.orange, vencida: T.red, paga: T.green };
  const estadoIcon = { pendente: Clock, vencida: AlertCircle, paga: CheckCircle };

  const handleDownload = (fatura) => {
    setDownloading(fatura.id);
    // Gera PDF simulado como blob de texto
    const conteudo = `EMPRO — EMPRODALBE, LDA
NIF: 501 234 567
Estrada Nacional 125, Loulé, Algarve
Tel: +351 289 400 450 | geral@empro.pt
${"─".repeat(50)}

FATURA: ${fatura.id}
Data:   ${fatura.data}
Venc.:  ${fatura.venc}
${"─".repeat(50)}

Cliente: ${cliente.name}
NIF:     ${cliente.nif}
Morada:  ${cliente.local}
${"─".repeat(50)}

Encomenda: ${fatura.enc}

Valor Líquido:  €${fmt(fatura.liquido)}
IVA (23%):      €${fmt(fatura.iva)}
─────────────────────────────────────
TOTAL:          €${fmt(fatura.total)}
${"─".repeat(50)}

Estado: ${fatura.estado.toUpperCase()}
${"─".repeat(50)}

Obrigado pela sua preferência.
EMPRO — Distribuidora de Bebidas HoReCa
    `;
    setTimeout(() => {
      const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${fatura.id.replace(" ","-").replace("/","-")}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(null);
    }, 800);
  };

  const handleDownloadAll = () => {
    filtered.forEach((f, i) => setTimeout(() => handleDownload(f), i * 400));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:11, color:T.muted, letterSpacing:2, textTransform:"uppercase", fontFamily:"monospace", marginBottom:4 }}>Conta Corrente</div>
          <h1 style={{ margin:0, fontSize:28, fontWeight:700, color:T.navy, fontFamily:S.display }}>Faturas</h1>
        </div>
        <Btn variant="secondary" size="sm" icon={Download} onClick={handleDownloadAll}>
          Descarregar Selecionadas
        </Btn>
      </div>

      {/* KPIs financeiros */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:28 }}>

        {/* Dívida total */}
        <div style={{ background:T.white, borderRadius:16, padding:"22px 24px", border:`1px solid ${T.border}`, borderTop:`3px solid ${T.navy}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${T.navy}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Receipt size={18} color={T.navy} />
            </div>
            <span style={{ fontSize:12, color:T.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:1, fontFamily:"monospace" }}>Dívida Total</span>
          </div>
          <div style={{ fontSize:28, fontWeight:800, color:T.navy, fontFamily:S.display, marginBottom:4 }}>€{fmt(totalDivida)}</div>
          <div style={{ fontSize:12, color:T.muted }}>{FATURAS.filter(f=>f.estado!=="paga").length} faturas por liquidar</div>
        </div>

        {/* Valor vencido */}
        <div style={{ background:T.white, borderRadius:16, padding:"22px 24px", border:`1px solid ${totalVencido>0?T.red:T.border}`, borderTop:`3px solid ${totalVencido>0?T.red:T.green}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${totalVencido>0?T.red:T.green}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <CalendarClock size={18} color={totalVencido>0?T.red:T.green} />
            </div>
            <span style={{ fontSize:12, color:T.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:1, fontFamily:"monospace" }}>Valor Vencido</span>
          </div>
          <div style={{ fontSize:28, fontWeight:800, color:totalVencido>0?T.red:T.green, fontFamily:S.display, marginBottom:4 }}>
            €{fmt(totalVencido)}
          </div>
          {totalVencido > 0
            ? <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:T.red }}><AlertCircle size={12} />Pagamento em atraso</div>
            : <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:T.green }}><CheckCircle size={12} />Sem valores em atraso</div>
          }
        </div>

        {/* Plafond disponível */}
        <div style={{ background:T.white, borderRadius:16, padding:"22px 24px", border:`1px solid ${T.border}`, borderTop:`3px solid ${T.green}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${T.green}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <CreditCard size={18} color={T.green} />
            </div>
            <span style={{ fontSize:12, color:T.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:1, fontFamily:"monospace" }}>Plafond Disponível</span>
          </div>
          <div style={{ fontSize:28, fontWeight:800, color:T.green, fontFamily:S.display, marginBottom:8 }}>€{fmt(plafond)}</div>
          <div style={{ height:6, background:T.bg, borderRadius:3, marginBottom:4 }}>
            <div style={{ width:`${pctCredito}%`, height:"100%", background: pctCredito>80?T.red:pctCredito>50?T.orange:T.green, borderRadius:3, transition:"width .5s" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.muted }}>
            <span>Utilizado: €{fmt(cliente.saldo)}</span>
            <span>Limite: €{fmt(cliente.limite)}</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[
          { key:"todas",     label:"Todas",     count: FATURAS.length },
          { key:"pendentes", label:"Pendentes", count: FATURAS.filter(f=>f.estado==="pendente").length },
          { key:"vencidas",  label:"Vencidas",  count: FATURAS.filter(f=>f.estado==="vencida").length },
          { key:"pagas",     label:"Pagas",     count: FATURAS.filter(f=>f.estado==="paga").length },
        ].map(f => (
          <button key={f.key} onClick={() => setFiltro(f.key)} style={{
            padding:"8px 16px", borderRadius:20, border:`1px solid ${filtro===f.key?T.navy:T.border}`,
            background: filtro===f.key?T.navy:T.white, color: filtro===f.key?"white":T.muted,
            fontSize:13, fontWeight: filtro===f.key?700:400, cursor:"pointer", fontFamily:S.font,
          }}>
            {f.label} <span style={{ opacity:0.7 }}>({f.count})</span>
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden" }}>
        {/* Cabeçalho */}
        <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr 90px 90px 110px 90px 80px", gap:0, padding:"10px 20px", background:T.bg, borderBottom:`1px solid ${T.border}` }}>
          {["Fatura","Encomenda","Data","Vencimento","Total c/ IVA","Estado",""].map(h => (
            <div key={h} style={{ fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:1, fontFamily:"monospace" }}>{h}</div>
          ))}
        </div>

        {filtered.map((f, i) => {
          const Icon = estadoIcon[f.estado];
          const cor  = estadoCor[f.estado];
          const isLast = i === filtered.length - 1;
          return (
            <div key={f.id} style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr 90px 90px 110px 90px 80px", gap:0, padding:"14px 20px", borderBottom: isLast?"none":`1px solid ${T.border}`, alignItems:"center", background: f.vencida ? `${T.red}04` : "transparent" }}
              onMouseEnter={e=>e.currentTarget.style.background=f.vencida?`${T.red}08`:T.bg+"88"}
              onMouseLeave={e=>e.currentTarget.style.background=f.vencida?`${T.red}04`:"transparent"}
            >
              {/* Fatura */}
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:8, background:`${cor}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon size={16} color={cor} />
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:T.navy, fontFamily:S.display }}>{f.id}</div>
              </div>

              {/* Encomenda */}
              <div style={{ fontSize:12, color:T.muted, fontFamily:"monospace" }}>{f.enc}</div>

              {/* Data emissão */}
              <div style={{ fontSize:12, color:T.muted }}>{f.data}</div>

              {/* Vencimento */}
              <div style={{ fontSize:12, color: f.vencida?T.red:T.text, fontWeight: f.vencida?700:400 }}>{f.venc}</div>

              {/* Total */}
              <div style={{ fontWeight:800, color:T.navy, fontSize:15, fontFamily:S.display }}>€{fmt(f.total)}</div>

              {/* Estado */}
              <div>
                <span style={{ background:`${cor}18`, color:cor, padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, fontFamily:"monospace" }}>
                  {f.estado}
                </span>
              </div>

              {/* Download */}
              <div>
                <button onClick={() => handleDownload(f)} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, border:`1px solid ${T.border}`, background: downloading===f.id?T.navy:T.white, color: downloading===f.id?"white":T.navy, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .2s", fontFamily:S.font }}>
                  <Download size={12} />
                  {downloading===f.id ? "..." : "PDF"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nota */}
      <div style={{ marginTop:12, fontSize:12, color:T.muted, display:"flex", alignItems:"center", gap:6 }}>
        <AlertCircle size={13} />
        Para questões sobre faturas contacte: <strong style={{ color:T.navy }}>geral@empro.pt</strong> ou <strong style={{ color:T.navy }}>+351 289 400 450</strong>
      </div>
    </div>
  );
}

/* ── ECRÃ: Vasilhame ── */
const VASILHAME = [
  { id:"V001", tipo:"Barril 50L — Inox",       ref:"BAR-50L",  entregue:12, devolvido:8,  emAberto:4,  deposito:18.00, img:"🛢️" },
  { id:"V002", tipo:"Barril 30L — Inox",        ref:"BAR-30L",  entregue:6,  devolvido:6,  emAberto:0,  deposito:14.00, img:"🛢️" },
  { id:"V003", tipo:"Barril 20L — Inox",        ref:"BAR-20L",  entregue:8,  devolvido:5,  emAberto:3,  deposito:10.00, img:"🛢️" },
  { id:"V004", tipo:"Caixas Plástico 24un",     ref:"CX-24PL",  entregue:45, devolvido:38, emAberto:7,  deposito:2.50,  img:"📦" },
  { id:"V005", tipo:"Caixas Plástico 12un",     ref:"CX-12PL",  entregue:20, devolvido:20, emAberto:0,  deposito:1.80,  img:"📦" },
  { id:"V006", tipo:"Paletes de Madeira",       ref:"PAL-MAD",  entregue:10, devolvido:7,  emAberto:3,  deposito:8.00,  img:"🪵" },
];

const MOVIMENTOS_VAS = [
  { data:"26 Fev 2025", tipo:"Entrega", ref:"BAR-50L", qtd:+2, enc:"ENC-2025-042" },
  { data:"26 Fev 2025", tipo:"Entrega", ref:"CX-24PL", qtd:+5, enc:"ENC-2025-042" },
  { data:"20 Fev 2025", tipo:"Devolução", ref:"BAR-50L", qtd:-1, enc:"—" },
  { data:"14 Fev 2025", tipo:"Entrega", ref:"BAR-50L", qtd:+3, enc:"ENC-2025-031" },
  { data:"14 Fev 2025", tipo:"Devolução", ref:"CX-24PL", qtd:-8, enc:"—" },
  { data:"03 Fev 2025", tipo:"Devolução", ref:"BAR-20L", qtd:-2, enc:"—" },
  { data:"03 Fev 2025", tipo:"Entrega", ref:"PAL-MAD",  qtd:+3, enc:"ENC-2025-018" },
];

function EcrãVasilhame() {
  const [tab, setTab] = useState("saldo");

  const totalEmAberto = VASILHAME.reduce((s,v) => s + v.emAberto, 0);
  const totalDeposito = VASILHAME.reduce((s,v) => s + v.emAberto * v.deposito, 0);
  const totalEntregue = VASILHAME.reduce((s,v) => s + v.entregue, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:11, color:T.muted, letterSpacing:2, textTransform:"uppercase", fontFamily:"monospace", marginBottom:4 }}>Conta de</div>
          <h1 style={{ margin:0, fontSize:28, fontWeight:700, color:T.navy, fontFamily:S.display }}>Vasilhame</h1>
        </div>
        <div style={{ background:`${T.orange}18`, border:`1px solid ${T.orange}44`, borderRadius:12, padding:"10px 16px", display:"flex", alignItems:"center", gap:8 }}>
          <AlertCircle size={16} color={T.orange} />
          <span style={{ fontSize:13, color:T.orange, fontWeight:600 }}>Para devoluções contacte o seu comercial</span>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
        <div style={{ background:T.white, borderRadius:16, padding:"20px 22px", border:`1px solid ${T.border}`, borderTop:`3px solid ${T.navy}` }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`${T.navy}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
            <Truck size={18} color={T.navy} />
          </div>
          <div style={{ fontSize:26, fontWeight:800, color:T.navy, fontFamily:S.display }}>{totalEntregue}</div>
          <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>Total entregue</div>
          <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>histórico acumulado</div>
        </div>

        <div style={{ background:T.white, borderRadius:16, padding:"20px 22px", border:`1px solid ${T.border}`, borderTop:`3px solid ${T.green}` }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`${T.green}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
            <PackageCheck size={18} color={T.green} />
          </div>
          <div style={{ fontSize:26, fontWeight:800, color:T.green, fontFamily:S.display }}>{VASILHAME.reduce((s,v)=>s+v.devolvido,0)}</div>
          <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>Já devolvido</div>
          <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>unidades recebidas</div>
        </div>

        <div style={{ background:T.white, borderRadius:16, padding:"20px 22px", border:`1px solid ${totalEmAberto>0?T.orange:T.border}`, borderTop:`3px solid ${totalEmAberto>0?T.orange:T.green}` }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`${totalEmAberto>0?T.orange:T.green}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
            <PackageX size={18} color={totalEmAberto>0?T.orange:T.green} />
          </div>
          <div style={{ fontSize:26, fontWeight:800, color:totalEmAberto>0?T.orange:T.green, fontFamily:S.display }}>{totalEmAberto}</div>
          <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>Em aberto</div>
          <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>por devolver</div>
        </div>

        <div style={{ background:T.white, borderRadius:16, padding:"20px 22px", border:`1px solid ${T.border}`, borderTop:`3px solid ${T.red}` }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`${T.red}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
            <Euro size={18} color={T.red} />
          </div>
          <div style={{ fontSize:26, fontWeight:800, color:T.red, fontFamily:S.display }}>€{fmt(totalDeposito)}</div>
          <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>Depósito em aberto</div>
          <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>valor caução total</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:T.white, border:`1px solid ${T.border}`, borderRadius:12, padding:4, width:"fit-content" }}>
        {[
          { key:"saldo",      label:"Saldo por Tipo"     },
          { key:"movimentos", label:"Histórico de Movimentos" },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding:"8px 20px", borderRadius:9, border:"none", background: tab===t.key?T.navy:"transparent", color: tab===t.key?"white":T.muted, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:S.font, transition:"all .15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Saldo por tipo */}
      {tab === "saldo" && (
        <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 100px 100px", padding:"10px 20px", background:T.bg, borderBottom:`1px solid ${T.border}` }}>
            {["Tipo de Vasilhame","Entregue","Devolvido","Em Aberto","Depósito/un","Total Caução"].map(h => (
              <div key={h} style={{ fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:1, fontFamily:"monospace" }}>{h}</div>
            ))}
          </div>

          {VASILHAME.map((v, i) => {
            const caucao = v.emAberto * v.deposito;
            const pct = Math.round(v.devolvido / v.entregue * 100);
            return (
              <div key={v.id} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 100px 100px", padding:"16px 20px", borderBottom: i<VASILHAME.length-1?`1px solid ${T.border}`:"none", alignItems:"center" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg+"88"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                {/* Tipo */}
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ fontSize:24 }}>{v.img}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:T.navy }}>{v.tipo}</div>
                    <div style={{ fontSize:11, color:T.muted, fontFamily:"monospace" }}>{v.ref}</div>
                  </div>
                </div>

                {/* Entregue */}
                <div style={{ fontSize:15, fontWeight:700, color:T.navy }}>{v.entregue} un</div>

                {/* Devolvido + barra */}
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:T.green }}>{v.devolvido} un</div>
                  <div style={{ height:3, background:T.bg, borderRadius:2, marginTop:4, width:60 }}>
                    <div style={{ width:`${pct}%`, height:"100%", background:T.green, borderRadius:2 }} />
                  </div>
                </div>

                {/* Em aberto */}
                <div>
                  {v.emAberto > 0
                    ? <span style={{ background:`${T.orange}18`, color:T.orange, padding:"4px 10px", borderRadius:20, fontSize:13, fontWeight:700 }}>{v.emAberto} un</span>
                    : <span style={{ background:`${T.green}18`, color:T.green, padding:"4px 10px", borderRadius:20, fontSize:13, fontWeight:700 }}>✓ 0</span>
                  }
                </div>

                {/* Depósito/un */}
                <div style={{ fontSize:13, color:T.muted }}>€{fmt(v.deposito)}</div>

                {/* Caução */}
                <div style={{ fontSize:15, fontWeight:800, color: caucao>0?T.red:T.muted, fontFamily:S.display }}>
                  {caucao > 0 ? `€${fmt(caucao)}` : "—"}
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 100px 100px", padding:"14px 20px", background:T.bg, borderTop:`2px solid ${T.border}` }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.navy }}>TOTAIS</div>
            <div style={{ fontSize:14, fontWeight:800, color:T.navy }}>{totalEntregue}</div>
            <div style={{ fontSize:14, fontWeight:800, color:T.green }}>{VASILHAME.reduce((s,v)=>s+v.devolvido,0)}</div>
            <div style={{ fontSize:14, fontWeight:800, color:T.orange }}>{totalEmAberto}</div>
            <div></div>
            <div style={{ fontSize:15, fontWeight:800, color:T.red, fontFamily:S.display }}>€{fmt(totalDeposito)}</div>
          </div>
        </div>
      )}

      {/* Tab: Movimentos */}
      {tab === "movimentos" && (
        <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"110px 120px 1fr 80px 1fr", padding:"10px 20px", background:T.bg, borderBottom:`1px solid ${T.border}` }}>
            {["Data","Tipo","Referência","Qtd.","Encomenda"].map(h => (
              <div key={h} style={{ fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:1, fontFamily:"monospace" }}>{h}</div>
            ))}
          </div>
          {MOVIMENTOS_VAS.map((m, i) => {
            const isEntrega = m.tipo === "Entrega";
            return (
              <div key={i} style={{ display:"grid", gridTemplateColumns:"110px 120px 1fr 80px 1fr", padding:"13px 20px", borderBottom: i<MOVIMENTOS_VAS.length-1?`1px solid ${T.border}`:"none", alignItems:"center" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg+"88"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <div style={{ fontSize:12, color:T.muted }}>{m.data}</div>
                <div>
                  <span style={{ background: isEntrega?`${T.blue}18`:`${T.green}18`, color: isEntrega?T.blue:T.green, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:5, width:"fit-content" }}>
                    {isEntrega ? <Truck size={10} /> : <RotateCcw size={10} />}
                    {m.tipo}
                  </span>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:T.navy, fontFamily:"monospace" }}>{m.ref}</div>
                <div style={{ fontSize:15, fontWeight:800, color: isEntrega?T.blue:T.green }}>
                  {isEntrega ? `+${m.qtd}` : m.qtd}
                </div>
                <div style={{ fontSize:12, color:T.muted, fontFamily:"monospace" }}>{m.enc}</div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop:12, fontSize:12, color:T.muted, display:"flex", alignItems:"center", gap:6 }}>
        <AlertCircle size={13} />
        Divergências no saldo? Contacte: <strong style={{ color:T.navy }}>geral@empro.pt</strong> ou <strong style={{ color:T.navy }}>+351 289 400 450</strong>
      </div>
    </div>
  );
}

/* ── ECRÃ: Perfil ── */
function EcrãPerfil({ onNav, cliente = CLIENT, onLogout }) {
  const pct = Math.round(cliente.saldo / cliente.limite * 100);
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:T.muted, letterSpacing:2, textTransform:"uppercase", fontFamily:"monospace", marginBottom:4 }}>A minha</div>
        <h1 style={{ margin:0, fontSize:28, fontWeight:700, color:T.navy, fontFamily:S.display }}>Conta</h1>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

        {/* Dados da empresa */}
        <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.border}`, padding:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${T.navy}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Building2 size={18} color={T.navy} />
            </div>
            <div style={{ fontSize:16, fontWeight:700, color:T.navy, fontFamily:S.display }}>Dados da Empresa</div>
          </div>
          {[
            { label:"Nome",         value: cliente.name },
            { label:"NIF",          value: cliente.nif },
            { label:"Localidade",   value: cliente.local },
            { label:"Tipo de Cliente", value: `Tipo ${cliente.tipo}` },
            { label:"Desconto Base",value: `${cliente.desconto_base}%` },
          ].map(f => (
            <div key={f.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
              <span style={{ fontSize:12, color:T.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:0.8, fontFamily:"monospace" }}>{f.label}</span>
              <span style={{ fontSize:14, fontWeight:600, color:T.text }}>{f.value}</span>
            </div>
          ))}
          <div style={{ marginTop:16 }}>
            <Btn variant="secondary" size="sm" icon={Mail} onClick={() => window.open(`mailto:geral@empro.pt?subject=Atualização de dados — ${cliente.name}&body=Boa tarde,%0D%0A%0D%0AGostaria de atualizar os seguintes dados da minha conta:%0D%0A%0D%0A`)}>
              Solicitar atualização de dados
            </Btn>
          </div>
        </div>

        {/* Condições comerciais */}
        <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.border}`, padding:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${T.green}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <CreditCard size={18} color={T.green} />
            </div>
            <div style={{ fontSize:16, fontWeight:700, color:T.navy, fontFamily:S.display }}>Condições Comerciais</div>
          </div>

          <div style={{ display:"flex", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, background:T.bg, borderRadius:12, padding:"14px 16px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, color:T.red, fontFamily:S.display }}>€{fmt(cliente.saldo)}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Saldo em aberto</div>
            </div>
            <div style={{ flex:1, background:T.bg, borderRadius:12, padding:"14px 16px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, color:T.green, fontFamily:S.display }}>€{fmt(cliente.credito)}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Crédito disponível</div>
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:12, color:T.muted }}>Utilização de crédito</span>
              <span style={{ fontSize:12, fontWeight:700, color: pct>80?T.red:pct>50?T.orange:T.green }}>{pct}%</span>
            </div>
            <div style={{ height:8, background:T.bg, borderRadius:4 }}>
              <div style={{ width:`${pct}%`, height:"100%", background: pct>80?T.red:pct>50?T.orange:T.green, borderRadius:4, transition:"width .5s" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
              <span style={{ fontSize:11, color:T.muted }}>Limite: €{fmt(cliente.limite)}</span>
              <span style={{ fontSize:11, color:T.muted }}>Prazo: 30 dias</span>
            </div>
          </div>

          <Btn variant="secondary" size="sm" icon={FileText} onClick={() => onNav("faturas")}>
            Ver faturas em aberto
          </Btn>
        </div>

        {/* Comercial responsável */}
        <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.border}`, padding:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${T.blue}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <User size={18} color={T.blue} />
            </div>
            <div style={{ fontSize:16, fontWeight:700, color:T.navy, fontFamily:S.display }}>Comercial Responsável</div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:`linear-gradient(135deg,${T.navy},${T.navyL})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:"white", fontWeight:700, fontFamily:S.display, flexShrink:0 }}>
              {cliente.comercial.split(" ").map(n=>n[0]).join("")}
            </div>
            <div>
              <div style={{ fontSize:17, fontWeight:700, color:T.navy, fontFamily:S.display }}>{cliente.comercial}</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>Zona Algarve · EMPRO</div>
              <Badge color={T.green} small>Disponível</Badge>
            </div>
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <Btn full icon={Phone} onClick={() => window.open(`tel:${cliente.phone}`)}>
              {cliente.phone}
            </Btn>
            <Btn variant="secondary" full icon={Mail} onClick={() => window.open(`mailto:geral@empro.pt?subject=Contacto de ${cliente.name}`)}>
              Email
            </Btn>
          </div>
        </div>

        {/* Ações rápidas */}
        <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.border}`, padding:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${T.orange}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Sparkles size={18} color={T.orange} />
            </div>
            <div style={{ fontSize:16, fontWeight:700, color:T.navy, fontFamily:S.display }}>Ações Rápidas</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { label:"Nova Encomenda",          Icon:ShoppingCart, page:"catalogo",  color:T.red   },
              { label:"Ver Faturas em Aberto",   Icon:Receipt,      page:"faturas",   color:T.navy  },
              { label:"Saldo de Vasilhame",      Icon:RotateCcw,    page:"vasilhame", color:T.blue  },
              { label:"Histórico de Encomendas", Icon:FileText,     page:"historico", color:T.green },
            ].map(a => {
              const AIcon = a.Icon;
              return (
              <button key={a.label} onClick={() => onNav(a.page)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderRadius:10, border:`1px solid ${T.border}`, background:T.bg, cursor:"pointer", fontFamily:S.font, transition:"all .15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=`${a.color}11`; e.currentTarget.style.borderColor=`${a.color}44`; }}
                onMouseLeave={e=>{ e.currentTarget.style.background=T.bg; e.currentTarget.style.borderColor=T.border; }}
              >
                <div style={{ width:32, height:32, borderRadius:8, background:`${a.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <AIcon size={15} color={a.color} />
                </div>
                <span style={{ fontSize:14, fontWeight:600, color:T.text }}>{a.label}</span>
                <ChevronRight size={14} color={T.muted} style={{ marginLeft:"auto" }} />
              </button>
              );
            })}
          </div>
          {onLogout && (
            <button onClick={onLogout} style={{ width:"100%", marginTop:14, padding:"12px 16px", borderRadius:10, border:`1px solid ${T.border}`, background:"white", cursor:"pointer", display:"flex", alignItems:"center", gap:10, color:T.red, fontSize:14, fontWeight:600 }}
              onMouseEnter={e=>{ e.currentTarget.style.background=`${T.red}08`; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="white"; }}>
              <div style={{ width:32, height:32, borderRadius:8, background:`${T.red}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <LogOut size={15} color={T.red} />
              </div>
              <span>Terminar Sessão</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default function LojaEmpro() {
  const [utilizador,  setUtilizador]  = useState(null);   // Firebase user
  const [clienteData, setClienteData] = useState(null);   // dados do Firestore
  const [page,        setPage]        = useState("dashboard");
  const [cart,        setCart]        = useState([]);
  const [favorites,   setFavorites]   = useState([]);
  const [produtos,    setProdutos]    = useState(PRODUTOS);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const authReady = useAuthReady();

  // Ouvir alterações de autenticação
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user && !user.isAnonymous) {
        setUtilizador(user);
      } else {
        setUtilizador(null);
        setClienteData(null);
      }
    });
    return unsub;
  }, []);

  // Carregar produtos do Firestore em tempo real
  useEffect(() => {
    if (!authReady) return;
    const q = query(collection(db, "produtos"), orderBy("nome"));
    const unsub = onSnapshot(q, snap => {
      if (snap.docs.length > 0) {
        const fromDb = snap.docs
          .filter(d => d.data().ativo !== false)
          .map(d => {
            const data = d.data();
            return {
              id: d.id,
              familia: (data.familia || "outros").toLowerCase(),
              nome: data.nome || "",
              ref: data.ref || "",
              unidade: data.unidade || "cx",
              preco: data.preco || 0,
              iva: 23,
              min: 1,
              destaque: false,
              novo: false,
              desc: data.descricao || "",
              foto: data.foto || "",
              pdf: data.pdf || "",
              stock: data.stock || 0,
            };
          });
        setProdutos(fromDb);
      }
      setLoadingProdutos(false);
    }, () => setLoadingProdutos(false));
    return unsub;
  }, [authReady]);

  const handleLogin = (user, dados) => {
    setUtilizador(user);
    setClienteData(dados);
    setPage("dashboard");
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUtilizador(null);
    setClienteData(null);
    setCart([]);
    setPage("dashboard");
  };

  const addToCart = (prod, qty) => {
    setCart(c => {
      const exists = c.find(x => x.id === prod.id);
      if (exists) return c.map(x => x.id === prod.id ? { ...x, qty } : x);
      return [...c, { ...prod, qty }];
    });
  };

  const repetirEncomenda = (enc) => {
    enc.prods.forEach(linha => {
      const match = PRODUTOS.find(p => linha.toLowerCase().includes(p.nome.toLowerCase().split(" ")[0].toLowerCase()));
      if (match) {
        const qty = parseInt(linha.match(/×(\d+)/)?.[1]) || match.min;
        addToCart(match, qty);
      }
    });
  };

  const toggleFavorite = (id) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  };

  const updateCart = (id, qty) => {
    if (qty <= 0) setCart(c => c.filter(x => x.id !== id));
    else setCart(c => c.map(x => x.id === id ? { ...x, qty } : x));
  };

  const removeFromCart = (id) => setCart(c => c.filter(x => x.id !== id));
  const clearCart = () => setCart([]);

  // Dados do cliente activo (do Firebase ou dados fixos como fallback)
  const clienteActivo = clienteData ? {
    ...CLIENT,
    nome: clienteData.nome || CLIENT.nome,
    nif: clienteData.nif || CLIENT.nif,
    tipo: clienteData.tipo || CLIENT.tipo,
    desconto_base: clienteData.desconto || CLIENT.desconto_base,
    comercial: clienteData.comercial || CLIENT.comercial,
    email: utilizador?.email || CLIENT.email,
  } : CLIENT;

  if (!utilizador) return <EcrãLogin onAccess={handleLogin} />;

  const cartCount = cart.reduce((s,c) => s+c.qty, 0);

  const NAV = [
    { id:"dashboard", icon: Home,         label:"Início"    },
    { id:"catalogo",  icon: Package,       label:"Catálogo"  },
    { id:"carrinho",  icon: ShoppingCart,  label:"Carrinho", badge: cartCount },
    { id:"faturas",   icon: Receipt,       label:"Faturas"   },
    { id:"vasilhame", icon: RotateCcw,     label:"Vasilhame" },
    { id:"historico", icon: FileText,      label:"Histórico" },
    { id:"perfil",    icon: User,          label:"Conta"     },
  ];

  return (
    <div style={{ fontFamily: S.font, background: T.bg, minHeight:"100vh", color: T.text }}>
      {/* Topbar */}
      <div style={{ position:"sticky", top:0, zIndex:100, background: T.bgWarm, borderBottom:`1px solid ${T.border}`, backdropFilter:"blur(8px)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div>
              <div style={{ fontSize:8, color: T.red, letterSpacing:3, fontFamily:"monospace" }}>DISTRIBUIDORA</div>
              <div style={{ fontSize:20, fontWeight:800, color: T.navy, fontFamily: S.display, lineHeight:1 }}>EMPRO</div>
            </div>
            <div style={{ width:1, height:28, background: T.border }} />
            <div style={{ fontSize:12, color: T.muted }}>{cliente.name}</div>
          </div>

          {/* Nav central */}
          <nav style={{ display:"flex", gap:2 }}>
            {NAV.map(item => {
              const NavIcon = item.icon;
              return (
              <button key={item.id} onClick={() => setPage(item.id)} style={{
                display:"flex", alignItems:"center", gap:7, padding:"8px 14px", borderRadius:8, border:"none",
                background: page===item.id ? T.navy : "transparent",
                color: page===item.id ? "white" : T.muted,
                fontSize:13, fontWeight:600, cursor:"pointer", fontFamily: S.font, position:"relative",
              }}>
                <NavIcon size={14} />{item.label}
                {item.badge > 0 && (
                  <span style={{ position:"absolute", top:4, right:4, width:16, height:16, borderRadius:"50%", background: T.red, color:"white", fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {item.badge}
                  </span>
                )}
              </button>
              );
            })}
          </nav>

          {/* Right */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:12, fontWeight:600, color: T.navy }}>{cliente.name}</div>
              <div style={{ fontSize:10, color: T.muted }}>Tipo {cliente.tipo} · {cliente.desconto_base}% desconto</div>
            </div>
            <button onClick={handleLogout} style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:8, padding:"7px 10px", cursor:"pointer", color: T.muted, display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 32px 60px" }}>
        {page === "dashboard" && <EcrãDashboard onNav={setPage} cart={cart} cliente={clienteActivo} />}
        {page === "catalogo"  && <EcrãCatalogo produtos={produtos} loadingProdutos={loadingProdutos} cart={cart} onCart={addToCart} favorites={favorites} onToggleFav={toggleFavorite} cliente={clienteActivo} />}
        {page === "carrinho"  && <EcrãCarrinho cart={cart} onUpdateCart={updateCart} onRemove={removeFromCart} onNav={setPage} onCheckout={clearCart} cliente={clienteActivo} />}
        {page === "faturas"   && <EcrãFaturas cliente={clienteActivo} />}
        {page === "vasilhame" && <EcrãVasilhame />}
        {page === "historico" && <EcrãHistorico onRepetir={repetirEncomenda} onNav={setPage} />}
        {page === "perfil"    && <EcrãPerfil onNav={setPage} cliente={clienteActivo} onLogout={handleLogout} />}
      </div>
    </div>
  );
}
