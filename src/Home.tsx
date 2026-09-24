import { useNavigate } from 'react-router';

// ─── Background ECG line spanning full hero width ────────────────────────────
function HeroEcgLine() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none overflow-hidden">
      <svg viewBox="0 0 1440 112" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
        <path
          d="M0 72 L140 72 L155 62 L170 72 L200 72 L208 54 L214 86 L218 36 L226 94 L234 72 L260 72 L268 62 L278 72
             L320 72 L335 62 L350 72 L380 72 L388 54 L394 86 L398 36 L406 94 L414 72 L440 72 L448 62 L458 72
             L500 72 L515 62 L530 72 L560 72 L568 54 L574 86 L578 36 L586 94 L594 72 L620 72 L628 62 L638 72
             L680 72 L695 62 L710 72 L740 72 L748 54 L754 86 L758 36 L766 94 L774 72 L800 72 L808 62 L818 72
             L860 72 L875 62 L890 72 L920 72 L928 54 L934 86 L938 36 L946 94 L954 72 L980 72 L988 62 L998 72
             L1040 72 L1055 62 L1070 72 L1100 72 L1108 54 L1114 86 L1118 36 L1126 94 L1134 72 L1160 72 L1168 62 L1178 72
             L1220 72 L1235 62 L1250 72 L1280 72 L1288 54 L1294 86 L1298 36 L1306 94 L1314 72 L1340 72 L1348 62 L1358 72 L1440 72"
          fill="none"
          stroke="#0d9488"
          strokeWidth="1.5"
          opacity="0.07"
        />
      </svg>
    </div>
  );
}

// ─── Heart + AI Network Graphic ──────────────────────────────────────────────
function HeartAIGraphic() {
  return (
    <div className="animate-float select-none w-full max-w-[500px] mx-auto">
      <svg viewBox="0 0 500 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <defs>
          <radialGradient id="hbg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.18" />
            <stop offset="65%" stopColor="#0d9488" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
          </radialGradient>
          <filter id="hglow" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="nglow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ecgfx" x="-5%" y="-50%" width="110%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Ambient glow behind heart */}
        <ellipse cx="250" cy="218" rx="185" ry="168" fill="url(#hbg)" />

        {/* Outer decorative dashed rings */}
        <circle cx="250" cy="215" r="198" stroke="#0d9488" strokeWidth="0.8" strokeDasharray="3 7" opacity="0.1" />
        <circle cx="250" cy="215" r="222" stroke="#0d9488" strokeWidth="0.5" opacity="0.04" />

        {/* Network connection lines */}
        <line x1="68" y1="86" x2="30" y2="168" stroke="#0d9488" strokeWidth="0.8" opacity="0.22" />
        <line x1="30" y1="168" x2="50" y2="258" stroke="#0d9488" strokeWidth="0.8" opacity="0.18" />
        <line x1="50" y1="258" x2="116" y2="358" stroke="#0d9488" strokeWidth="0.8" opacity="0.15" />
        <line x1="432" y1="86" x2="470" y2="168" stroke="#0d9488" strokeWidth="0.8" opacity="0.22" />
        <line x1="470" y1="168" x2="450" y2="258" stroke="#0d9488" strokeWidth="0.8" opacity="0.18" />
        <line x1="450" y1="258" x2="384" y2="358" stroke="#0d9488" strokeWidth="0.8" opacity="0.15" />
        <line x1="186" y1="26" x2="68" y2="86" stroke="#0d9488" strokeWidth="0.8" opacity="0.19" />
        <line x1="314" y1="26" x2="432" y2="86" stroke="#0d9488" strokeWidth="0.8" opacity="0.19" />
        <line x1="186" y1="26" x2="314" y2="26" stroke="#0d9488" strokeWidth="0.8" opacity="0.14" />
        <line x1="68" y1="86" x2="160" y2="180" stroke="#0d9488" strokeWidth="0.8" opacity="0.16" />
        <line x1="432" y1="86" x2="340" y2="180" stroke="#0d9488" strokeWidth="0.8" opacity="0.16" />
        <line x1="116" y1="358" x2="200" y2="370" stroke="#0d9488" strokeWidth="0.8" opacity="0.13" />
        <line x1="384" y1="358" x2="300" y2="370" stroke="#0d9488" strokeWidth="0.8" opacity="0.13" />

        {/* Heart - glow layer */}
        <path
          d="M250 345 C90 240 65 165 100 120 C128 83 178 80 215 110 C232 88 248 78 250 92 C252 78 268 88 285 110 C322 80 372 83 400 120 C435 165 410 240 250 345Z"
          fill="#0d948508"
          stroke="#0d9488"
          strokeWidth="10"
          opacity="0.13"
          filter="url(#hglow)"
        />

        {/* Heart - main animated outline */}
        <path
          d="M250 345 C90 240 65 165 100 120 C128 83 178 80 215 110 C232 88 248 78 250 92 C252 78 268 88 285 110 C322 80 372 83 400 120 C435 165 410 240 250 345Z"
          fill="none"
          stroke="#0d9488"
          strokeWidth="2.5"
          filter="url(#nglow)"
          className="animate-pulse"
        />

        {/* ECG waveform running through center */}
        <path
          d="M18 215 L68 215 L75 203 L82 215 L100 215 L105 199 L110 161 L115 240 L122 215 L140 215 L147 206 L155 215 L190 215 L197 203 L204 215 L222 215 L227 199 L232 161 L237 240 L244 215 L262 215 L269 206 L277 215 L312 215 L319 203 L326 215 L344 215 L349 199 L354 161 L359 240 L366 215 L384 215 L391 206 L399 215 L434 215 L441 203 L448 215 L466 215 L471 199 L476 161 L481 240 L488 215 L500 215"
          fill="none"
          stroke="#f87171"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ecgfx)"
          opacity="0.72"
        />

        {/* Pulsing halos on key nodes */}
        <circle cx="68" cy="86" r="14" fill="#0d9488" opacity="0.07" className="animate-pulse" />
        <circle cx="432" cy="86" r="14" fill="#0d9488" opacity="0.07" className="animate-pulse" />
        <circle cx="250" cy="26" r="12" fill="#0d9488" opacity="0.07" className="animate-pulse" />

        {/* Network nodes */}
        <circle cx="68" cy="86" r="5.5" fill="#0d9488" opacity="0.9" filter="url(#nglow)" />
        <circle cx="30" cy="168" r="3.5" fill="#0d9488" opacity="0.62" />
        <circle cx="50" cy="258" r="3" fill="#0d9488" opacity="0.5" />
        <circle cx="116" cy="358" r="3.5" fill="#0d9488" opacity="0.58" />
        <circle cx="432" cy="86" r="5.5" fill="#0d9488" opacity="0.9" filter="url(#nglow)" />
        <circle cx="470" cy="168" r="3.5" fill="#0d9488" opacity="0.62" />
        <circle cx="450" cy="258" r="3" fill="#0d9488" opacity="0.5" />
        <circle cx="384" cy="358" r="3.5" fill="#0d9488" opacity="0.58" />
        <circle cx="186" cy="26" r="4.5" fill="#0d9488" opacity="0.75" filter="url(#nglow)" />
        <circle cx="314" cy="26" r="4.5" fill="#0d9488" opacity="0.75" filter="url(#nglow)" />
        <circle cx="160" cy="180" r="3" fill="#0d9488" opacity="0.45" />
        <circle cx="340" cy="180" r="3" fill="#0d9488" opacity="0.45" />
        <circle cx="200" cy="370" r="3" fill="#0d9488" opacity="0.4" />
        <circle cx="300" cy="370" r="3" fill="#0d9488" opacity="0.4" />

        {/* ── Data labels ───────────────────────────────────────────────── */}

        {/* SHAP */}
        <rect x="40" y="50" width="56" height="22" rx="11" fill="#0d9488" fillOpacity="0.13" stroke="#0d9488" strokeOpacity="0.38" strokeWidth="1" />
        <text x="68" y="65.5" textAnchor="middle" fill="#0d9488" fontSize="10" fontWeight="700" letterSpacing="0.8">SHAP</text>

        {/* LIME */}
        <rect x="404" y="50" width="56" height="22" rx="11" fill="#0d9488" fillOpacity="0.13" stroke="#0d9488" strokeOpacity="0.38" strokeWidth="1" />
        <text x="432" y="65.5" textAnchor="middle" fill="#0d9488" fontSize="10" fontWeight="700" letterSpacing="0.8">LIME</text>

        {/* ML MODEL */}
        <rect x="192" y="6" width="116" height="22" rx="11" fill="#1e293b" fillOpacity="0.07" stroke="#94a3b8" strokeOpacity="0.25" strokeWidth="1" />
        <text x="250" y="21.5" textAnchor="middle" fill="#475569" fontSize="9.5" fontWeight="700" letterSpacing="0.5">ML MODEL</text>

        {/* Accuracy badge (inside heart, upper) */}
        <rect x="183" y="174" width="134" height="32" rx="16" fill="#0d9488" fillOpacity="0.14" stroke="#0d9488" strokeOpacity="0.48" strokeWidth="1.5" />
        <text x="250" y="195" textAnchor="middle" fill="#0d9488" fontSize="12.5" fontWeight="800" letterSpacing="0.2">88.5% Accuracy</text>

        {/* RISK PREDICTION badge */}
        <rect x="192" y="238" width="116" height="26" rx="13" fill="#ef4444" fillOpacity="0.1" stroke="#ef4444" strokeOpacity="0.42" strokeWidth="1.5" />
        <text x="250" y="255.5" textAnchor="middle" fill="#dc2626" fontSize="10.5" fontWeight="700" letterSpacing="0.3">RISK PREDICTION</text>

        {/* Bottom model label */}
        <rect x="143" y="364" width="214" height="22" rx="11" fill="#1e293b" fillOpacity="0.04" stroke="#cbd5e1" strokeOpacity="0.4" strokeWidth="1" />
        <text x="250" y="379" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontWeight="600" letterSpacing="0.2">Random Forest · XGBoost · SVM</text>
      </svg>
    </div>
  );
}

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ icon, color, title, description }: {
  icon: React.ReactNode; color: string; title: string; description: string;
}) {
  const bgMap: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    violet: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
  };
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-6 card-lift shadow-sm">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200 ${bgMap[color]}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800 mb-2 text-base">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ─── Pipeline Step ───────────────────────────────────────────────────────────
function PipeStep({ icon, label, sub, color }: { icon: React.ReactNode; label: string; sub: string; color: string }) {
  const colorMap: Record<string, string> = {
    teal:   'bg-teal-50 text-teal-600 border-teal-100',
    blue:   'bg-blue-50 text-blue-600 border-blue-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };
  return (
    <div className={`flex flex-col items-center text-center px-5 py-4 rounded-2xl border bg-white shadow-sm w-40 flex-shrink-0 ${colorMap[color]} card-lift`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${colorMap[color]}`}>{icon}</div>
      <div className="font-semibold text-slate-800 text-sm leading-snug">{label}</div>
      <div className="text-slate-400 text-xs mt-1 leading-snug">{sub}</div>
    </div>
  );
}

function Arrow() {
  return (
    <svg className="w-5 h-5 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden border-b border-slate-100 bg-dots">
        <HeroEcgLine />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left — text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-7 border border-teal-100">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block animate-pulse" />
                Machine Learning · Explainable AI · Heart Disease Prediction
              </div>

              <h1 className="text-4xl sm:text-[2.8rem] lg:text-5xl text-slate-900 leading-[1.1] mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Predict Early.
                <br />
                <span className="text-teal-600">Understand Better.</span>
              </h1>

              <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-lg">
                An explainable machine learning framework that predicts heart disease risk from 12 clinical features — and clearly shows which factors drove every prediction, using SHAP and LIME.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  onClick={() => navigate('/prediction')}
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-7 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  Start Prediction
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="w-full sm:w-auto border border-slate-300 hover:border-teal-300 text-slate-700 hover:text-teal-700 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
                >
                  View Methodology
                </button>
              </div>

              {/* Compact stats row */}
              <div className="grid grid-cols-3 gap-5 pt-8 border-t border-slate-100">
                {[
                  { value: '88.5%', label: 'Model Accuracy' },
                  { value: '12', label: 'Clinical Features' },
                  { value: '303', label: 'Training Samples' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-bold text-teal-600 mb-0.5">{s.value}</div>
                    <div className="text-xs text-slate-400 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — HeartAIGraphic (desktop only) */}
            <div className="hidden lg:flex items-center justify-center">
              <HeartAIGraphic />
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature cards ──────────────────────────────────────────────────── */}
      <section className="py-14 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">Core Capabilities</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <FeatureCard
              color="teal"
              title="ML-Based Prediction"
              description="Trained on the Cleveland Heart Disease dataset using Random Forest, XGBoost, and SVM — achieving up to 88.5% classification accuracy."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              }
            />
            <FeatureCard
              color="blue"
              title="Explainable AI"
              description="Every prediction is accompanied by SHAP and LIME explanations that make the model's reasoning transparent and interpretable to clinicians."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
            />
            <FeatureCard
              color="violet"
              title="Patient Risk Insights"
              description="Visualize which clinical factors contribute most to a patient's risk level — empowering better-informed, evidence-backed clinical decisions."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section className="py-14 px-4 sm:px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center font-semibold text-slate-800 text-xl mb-1.5">How It Works</h2>
          <p className="text-center text-slate-400 text-sm mb-10">The end-to-end prediction and explanation pipeline</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
            <PipeStep color="teal" label="Patient Data" sub="12 clinical features"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />
            <Arrow />
            <PipeStep color="blue" label="ML Model" sub="RF · XGBoost · SVM"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>}
            />
            <Arrow />
            <PipeStep color="violet" label="Risk Prediction" sub="High / Low + confidence"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            />
            <Arrow />
            <PipeStep color="orange" label="SHAP / LIME" sub="Feature-level explanations"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
            />
          </div>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────────────────────────── */}
      <section className="py-5 px-4 sm:px-6 bg-amber-50 border-b border-amber-100">
        <div className="max-w-5xl mx-auto flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Research Disclaimer:</strong> This system is intended for research and decision-support purposes only. It does not provide medical diagnosis or replace professional medical advice. Always consult a qualified healthcare professional for clinical decisions.
          </p>
        </div>
      </section>
    </div>
  );
}
