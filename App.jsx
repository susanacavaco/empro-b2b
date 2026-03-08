import { useState, useEffect } from "react";
import {
  ShoppingCart, Package, FileText, Home, LogOut, ChevronRight,
  Plus, Minus, Trash2, Tag, AlertCircle, CheckCircle, Clock,
  TrendingUp, Euro, Search, Filter, X, ChevronDown, Star,
  MapPin, Phone, Building2, ArrowRight, Sparkles, Gift
} from "lucide-react";

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

/* ── Helpers ── */
function precoCliente(p) {
  const d = CLIENT.desconto_base / 100;
  return p.preco * (1 - d);
}

function fmt(n) { return n.toLocaleString("pt-PT", { minimumFractionDigits:2, maximumFractionDigits:2 }); }

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
function EcrãConvite({ onAccess }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (code.trim().toUpperCase() === INVITE_CODE) {
      onAccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background: T.navyD, display:"flex", fontFamily: S.font, overflow:"hidden", position:"relative" }}>
      {/* Fundo geométrico */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:-120, right:-120, width:500, height:500, borderRadius:"50%", background:`${T.red}12`, border:`1px solid ${T.red}22` }} />
        <div style={{ position:"absolute", bottom:-80, left:-80, width:400, height:400, borderRadius:"50%", background:`${T.navyL}44`, border:`1px solid ${T.navyL}33` }} />
        <div style={{ position:"absolute", top:"40%", left:"55%", width:200, height:200, borderRadius:"50%", background:`${T.red}08` }} />
        {/* Grid lines */}
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ position:"absolute", left:0, right:0, top:`${i*25}%`, height:1, background:`${T.navyL}22` }} />
        ))}
      </div>

      {/* Lado esquerdo */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 80px", position:"relative" }}>
        {/* Logo */}
        <div style={{ marginBottom:60 }}>
          <div style={{ fontSize:11, color: T.red, letterSpacing:4, fontFamily:"monospace", marginBottom:8 }}>DISTRIBUIDORA DE BEBIDAS</div>
          <div style={{ fontSize:48, fontWeight:800, color:"white", fontFamily: S.display, lineHeight:1 }}>EMPRO</div>
          <div style={{ fontSize:13, color: T.muted, letterSpacing:2, marginTop:4 }}>EMPRODALBE, LDA · DESDE 1990</div>
        </div>

        <div style={{ maxWidth:460 }}>
          <h1 style={{ fontSize:38, fontWeight:700, color:"white", fontFamily: S.display, lineHeight:1.2, marginBottom:16 }}>
            A sua loja<br />
            <span style={{ color: T.red }}>B2B privada.</span>
          </h1>
          <p style={{ fontSize:16, color: T.muted, lineHeight:1.7, marginBottom:40 }}>
            Acesso exclusivo para clientes EMPRO.<br />
            Encomende 24h/dia com os seus preços personalizados.
          </p>

          {/* Features */}
          {[
            { icon: Tag,        text: "Preços personalizados para a sua empresa" },
            { icon: Package,    text: "Catálogo completo com stock em tempo real" },
            { icon: FileText,   text: "Histórico e faturas sempre disponíveis" },
          ].map((f,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${T.red}22`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <f.icon size={16} color={T.red} />
              </div>
              <span style={{ fontSize:14, color: T.mutedL }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lado direito — form */}
      <div style={{ width:460, display:"flex", alignItems:"center", justifyContent:"center", padding:40, position:"relative" }}>
        <div style={{
          background: T.bgWarm, borderRadius:24, padding:48, width:"100%",
          boxShadow:"0 32px 80px rgba(0,0,0,.4)",
          animation: shake ? "shake .4s ease" : "none",
        }}>
          <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }`}</style>

          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:22, fontWeight:700, color: T.navy, fontFamily: S.display, marginBottom:8 }}>Acesso restrito</div>
            <div style={{ fontSize:14, color: T.muted }}>Introduza o código de convite enviado pelo seu comercial EMPRO.</div>
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:11, fontWeight:700, color: T.muted, textTransform:"uppercase", letterSpacing:1.5, display:"block", marginBottom:8, fontFamily:"monospace" }}>
              Código de Convite
            </label>
            <input
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError(false); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="Ex: EMPRO2025"
              style={{
                width:"100%", padding:"14px 16px", borderRadius:12, boxSizing:"border-box",
                border: `2px solid ${error ? T.red : T.border}`,
                fontSize:18, fontWeight:700, letterSpacing:3, textAlign:"center",
                fontFamily:"monospace", color: T.navy, background: error ? `${T.red}08` : T.white,
                outline:"none", transition:"border .2s",
              }}
            />
            {error && (
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8, color: T.red, fontSize:13 }}>
                <AlertCircle size={14} /> Código inválido. Contacte o seu comercial.
              </div>
            )}
          </div>

          <Btn onClick={handleSubmit} full size="lg" icon={ArrowRight}>
            Entrar na Loja
          </Btn>

          <div style={{ marginTop:24, padding:"16px", background: T.bg, borderRadius:12, display:"flex", gap:12, alignItems:"flex-start" }}>
            <Phone size={14} color={T.muted} style={{ marginTop:2, flexShrink:0 }} />
            <div>
              <div style={{ fontSize:12, fontWeight:600, color: T.navy }}>Não tem código?</div>
              <div style={{ fontSize:12, color: T.muted, marginTop:2 }}>Contacte a EMPRO: <strong style={{ color: T.navy }}>+351 289 000 000</strong> ou <strong style={{ color: T.navy }}>geral@empro.pt</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ECRÃ: Dashboard ── */
function EcrãDashboard({ onNav, cart }) {
  const pct = Math.round(CLIENT.saldo / CLIENT.limite * 100);

  return (
    <div>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, ${T.navyD}, ${T.navy})`, borderRadius:20, padding:"32px 36px", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:240, height:240, borderRadius:"50%", background:`${T.red}18` }} />
        <div style={{ position:"absolute", bottom:-40, right:120, width:160, height:160, borderRadius:"50%", background:`${T.navyL}44` }} />
        <div style={{ position:"relative" }}>
          <div style={{ fontSize:12, color: T.mutedL, letterSpacing:2, textTransform:"uppercase", fontFamily:"monospace", marginBottom:6 }}>Bem-vindo de volta</div>
          <h1 style={{ fontSize:28, fontWeight:700, color:"white", fontFamily: S.display, margin:"0 0 4px" }}>{CLIENT.name}</h1>
          <div style={{ display:"flex", gap:16, alignItems:"center", marginTop:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, color: T.mutedL, fontSize:13 }}><MapPin size={13} />{CLIENT.local}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, color: T.mutedL, fontSize:13 }}><Building2 size={13} />NIF {CLIENT.nif}</div>
            <Badge color={T.orange}>Tipo {CLIENT.tipo}</Badge>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
        {[
          { label:"Saldo em Aberto", value:`€${fmt(CLIENT.saldo)}`, sub:"em faturas por vencer", color: T.red,    icon: Euro,       warn: pct > 70 },
          { label:"Crédito Disponível", value:`€${fmt(CLIENT.credito)}`, sub:`de €${fmt(CLIENT.limite)} de limite`, color: T.green, icon: TrendingUp, warn: false },
          { label:"Desconto Personalizado", value:`${CLIENT.desconto_base}%`, sub:"aplicado a todo o catálogo", color: T.navy, icon: Tag, warn: false },
        ].map((k,i) => (
          <div key={i} style={{ background: T.white, borderRadius:16, padding:"20px 22px", border:`1px solid ${T.border}`, borderTop:`3px solid ${k.color}` }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${k.color}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
              <k.icon size={18} color={k.color} />
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
        ))}
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
function EcrãCatalogo({ cart, onCart }) {
  const [familia, setFamilia] = useState("todos");
  const [search, setSearch] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [qtds, setQtds] = useState({});

  const filtered = PRODUTOS.filter(p => {
    const matchFam = familia === "todos" || p.familia === familia;
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.ref.toLowerCase().includes(search.toLowerCase());
    const matchPromo = !showPromo || PROMOS.some(pr => pr.produtos.includes(p.ref));
    return matchFam && matchSearch && matchPromo;
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
        </div>
      </div>

      {/* Famílias */}
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        <button onClick={() => setFamilia("todos")} style={{ padding:"8px 16px", borderRadius:20, border:`1px solid ${familia==="todos" ? T.navy : T.border}`, background: familia==="todos" ? T.navy : T.white, color: familia==="todos" ? "white" : T.muted, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily: S.font }}>
          Todos ({PRODUTOS.length})
        </button>
        {FAMILIAS.map(f => {
          const count = PRODUTOS.filter(p => p.familia === f.id).length;
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
          const preco = precoCliente(p);
          const precoIva = preco * (1 + p.iva/100);
          const inC = inCart(p.id);
          const famColor = FAMILIAS.find(f => f.id === p.familia)?.color || T.navy;
          const promoAtiva = PROMOS.find(pr => pr.produtos.includes(p.ref));

          return (
            <div key={p.id} style={{ background: T.white, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden", transition:"box-shadow .15s, transform .15s" }}
              onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 8px 28px rgba(19,41,75,.1)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              {/* Topo */}
              <div style={{ background:`linear-gradient(135deg, ${famColor}15, ${famColor}05)`, padding:"16px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <Badge color={famColor} small>{FAMILIAS.find(f=>f.id===p.familia)?.label}</Badge>
                  {p.destaque && <Badge color={T.orange} small>⭐ Destaque</Badge>}
                  {p.novo && <Badge color={T.green} small>Novo</Badge>}
                  {promoAtiva && <Badge color={T.red} small>🎁 Promo</Badge>}
                </div>
                {inC && <div style={{ width:20, height:20, borderRadius:"50%", background: T.green, display:"flex", alignItems:"center", justifyContent:"center" }}><CheckCircle size={12} color="white" /></div>}
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
                  {CLIENT.desconto_base > 0 && (
                    <div style={{ marginTop:6, fontSize:11, color: T.green, fontWeight:600 }}>
                      ✓ Desconto {CLIENT.desconto_base}% aplicado
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
function EcrãCarrinho({ cart, onUpdateCart, onRemove, onNav, onCheckout }) {
  const [obs, setObs] = useState("");
  const [success, setSuccess] = useState(false);

  const subtotal = cart.reduce((s,c) => s + precoCliente(c) * c.qty, 0);
  const ivaTotal = cart.reduce((s,c) => s + precoCliente(c) * c.qty * (c.iva/100), 0);
  const total    = subtotal + ivaTotal;

  const handleOrder = () => {
    setSuccess(true);
    onCheckout();
  };

  if (success) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", textAlign:"center" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:`${T.green}18`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
        <CheckCircle size={40} color={T.green} />
      </div>
      <h2 style={{ fontFamily: S.display, color: T.navy, fontSize:28, marginBottom:8 }}>Encomenda enviada!</h2>
      <p style={{ color: T.muted, marginBottom:32, fontSize:15 }}>O seu comercial {CLIENT.comercial} vai confirmar em breve.</p>
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

          <Btn onClick={handleOrder} full size="lg" icon={CheckCircle}>
            Confirmar Encomenda
          </Btn>

          <div style={{ marginTop:12, fontSize:12, color: T.muted, textAlign:"center" }}>
            O seu comercial <strong>{CLIENT.comercial}</strong> irá confirmar.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ECRÃ: Histórico ── */
function EcrãHistorico() {
  const [expanded, setExpanded] = useState(null);
  const estadoColor = { entregue: T.green, confirmada: T.orange, pendente: T.muted };

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
          <div style={{ fontSize:22, fontWeight:800, color: T.green, fontFamily: S.display }}>€{fmt(CLIENT.saldo)}</div>
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
                  <Btn variant="secondary" size="sm" icon={ShoppingCart}>Repetir Encomenda</Btn>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── LAYOUT PRINCIPAL ── */
export default function LojaEmpro() {
  const [acesso, setAcesso] = useState(false);
  const [page,   setPage]   = useState("dashboard");
  const [cart,   setCart]   = useState([]);

  const addToCart = (prod, qty) => {
    setCart(c => {
      const exists = c.find(x => x.id === prod.id);
      if (exists) return c.map(x => x.id === prod.id ? { ...x, qty } : x);
      return [...c, { ...prod, qty }];
    });
  };

  const updateCart = (id, qty) => {
    if (qty <= 0) setCart(c => c.filter(x => x.id !== id));
    else setCart(c => c.map(x => x.id === id ? { ...x, qty } : x));
  };

  const removeFromCart = (id) => setCart(c => c.filter(x => x.id !== id));
  const clearCart = () => setCart([]);

  if (!acesso) return <EcrãConvite onAccess={() => setAcesso(true)} />;

  const cartCount = cart.reduce((s,c) => s+c.qty, 0);

  const NAV = [
    { id:"dashboard", icon: Home,         label:"Início"    },
    { id:"catalogo",  icon: Package,       label:"Catálogo"  },
    { id:"carrinho",  icon: ShoppingCart,  label:"Carrinho", badge: cartCount },
    { id:"historico", icon: FileText,      label:"Histórico" },
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
            <div style={{ fontSize:12, color: T.muted }}>{CLIENT.name}</div>
          </div>

          {/* Nav central */}
          <nav style={{ display:"flex", gap:2 }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)} style={{
                display:"flex", alignItems:"center", gap:7, padding:"8px 14px", borderRadius:8, border:"none",
                background: page===item.id ? T.navy : "transparent",
                color: page===item.id ? "white" : T.muted,
                fontSize:13, fontWeight:600, cursor:"pointer", fontFamily: S.font, position:"relative",
              }}>
                <item.icon size={14} />{item.label}
                {item.badge > 0 && (
                  <span style={{ position:"absolute", top:4, right:4, width:16, height:16, borderRadius:"50%", background: T.red, color:"white", fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:12, fontWeight:600, color: T.navy }}>{CLIENT.name}</div>
              <div style={{ fontSize:10, color: T.muted }}>Tipo {CLIENT.tipo} · {CLIENT.desconto_base}% desconto</div>
            </div>
            <button onClick={() => setAcesso(false)} style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:8, padding:"7px 10px", cursor:"pointer", color: T.muted, display:"flex", alignItems:"center" }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 32px 60px" }}>
        {page === "dashboard" && <EcrãDashboard onNav={setPage} cart={cart} />}
        {page === "catalogo"  && <EcrãCatalogo cart={cart} onCart={addToCart} />}
        {page === "carrinho"  && <EcrãCarrinho cart={cart} onUpdateCart={updateCart} onRemove={removeFromCart} onNav={setPage} onCheckout={clearCart} />}
        {page === "historico" && <EcrãHistorico />}
      </div>
    </div>
  );
}
