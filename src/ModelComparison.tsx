import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  BarChart, Bar, XAxis, YAxis, Cell, ReferenceLine,
  ResponsiveContainer, Tooltip, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend,
} from 'recharts';
import {
  loadPrediction, computeAllModelPredictions,
  PredictionResult, PerModelPrediction,
} from '../lib/prediction';
import { MODEL_RESULTS, ModelMetrics } from '../data/modelComparison';

// ── Types ──────────────────────────────────────────────────────────────────────
type PerfMetricKey = 'accuracy' | 'precision' | 'recall' | 'f1' | 'auc';

// ── Constants ──────────────────────────────────────────────────────────────────
const CHEST_PAIN_SHORT: Record<string, string> = {
  '0': 'Typical Angina', '1': 'Atypical Angina',
  '2': 'Non-anginal Pain', '3': 'Asymptomatic',
};
const THAL_SHORT: Record<string, string> = {
  '0': 'Normal Thal', '1': 'Fixed Defect', '2': 'Reversible Defect',
};

const ENSEMBLE_WEIGHTS = [
  { name: 'LR',  pct: 15, color: '#6366f1' },
  { name: 'DT',  pct: 10, color: '#f59e0b' },
  { name: 'NB',  pct: 10, color: '#ec4899' },
  { name: 'RF',  pct: 35, color: '#3b82f6' },
  { name: 'SVM', pct: 30, color: '#8b5cf6' },
];

// Models shown in the performance table (all except DT and NB which have no results)
const PERF_MODELS = MODEL_RESULTS.filter(
  (m) =>
    ['Logistic Regression', 'Random Forest', 'Support Vector Machine', 'XGBoost'].includes(m.name) ||
    m.isProposed,
);

const PERF_METRICS: Array<{ key: PerfMetricKey; label: string; short: string; isAUC: boolean }> = [
  { key: 'accuracy',  label: 'Accuracy',  short: 'Acc',  isAUC: false },
  { key: 'precision', label: 'Precision', short: 'Prec', isAUC: false },
  { key: 'recall',    label: 'Recall',    short: 'Rec',  isAUC: false },
  { key: 'f1',        label: 'F1-Score',  short: 'F1',   isAUC: false },
  { key: 'auc',       label: 'ROC-AUC',   short: 'AUC',  isAUC: true  },
];

// Manually specified improvements (shown in the hero improvement row)
const IMPROVEMENTS: Record<PerfMetricKey, { delta: number; label: string }> = {
  accuracy:  { delta: 0.80, label: '+0.80%' },
  precision: { delta: 0.42, label: '+0.42%' },
  recall:    { delta: 0.24, label: '+0.24%' },
  f1:        { delta: 0.86, label: '+0.86%' },
  auc:       { delta: 0.24, label: '+0.24%' },
};

const WHY_BETTER_CARDS = [
  {
    color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h12M3 12h8M3 16h4" />
      </svg>
    ),
    title: 'Feature Selection',
    body: 'Removes noisy, low-signal features before training, so every model focuses on the clinical variables that genuinely matter.',
  },
  {
    color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    title: 'Complementary Models',
    body: 'RF, XGBoost, SVM and LR each have different decision boundaries. Combining them captures patterns that any single classifier misses.',
  },
  {
    color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    title: 'Weighted Probability Voting',
    body: 'Higher-accuracy classifiers get proportionally more influence. The final probability is a calibrated blend, not a simple majority vote.',
  },
  {
    color: '#d97706', bg: '#fffbeb', border: '#fde68a',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'SHAP + LIME Explainability',
    body: 'Every prediction includes a patient-level explanation showing which features drove the result — building trust and enabling clinician review.',
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function getMetric(m: ModelMetrics, k: PerfMetricKey): number | null {
  const v: Record<PerfMetricKey, number | null> = {
    accuracy: m.accuracy, precision: m.precision,
    recall: m.recall, f1: m.f1, auc: m.auc,
  };
  return v[k];
}

function fmtVal(v: number | null, isAUC: boolean): string {
  if (v === null) return '—';
  return isAUC ? v.toFixed(3) : `${v.toFixed(2)}%`;
}

function fmtPct(v: number | null): string {
  if (v === null) return '—';
  return `${v.toFixed(2)}%`;
}

// ── Flow arrow ─────────────────────────────────────────────────────────────────
function FlowArrow() {
  return (
    <div className="flex flex-col items-center py-0.5">
      <div className="w-px h-3 bg-teal-300" />
      <svg className="w-3 h-2 text-teal-400" viewBox="0 0 12 8" fill="currentColor">
        <path d="M6 8L0 0h12L6 8z" />
      </svg>
    </div>
  );
}

// ── Why Better section ─────────────────────────────────────────────────────────
function WhyBetterSection() {
  const proposed = PERF_MODELS.find((m) => m.isProposed);
  if (!proposed) return null;

  return (
    <div className="space-y-5">
      <div>
        <span className="inline-block bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full tracking-wide mb-3">
          Why It Works
        </span>
        <h2
          className="text-xl sm:text-2xl font-bold text-slate-800 mb-1.5"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Why Our Model Is Better
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Four design decisions separate the proposed ensemble from any single baseline classifier.
        </p>
      </div>

      {/* 4 advantage cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {WHY_BETTER_CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border p-5 card-lift"
            style={{ background: card.bg, borderColor: card.border }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: `${card.color}18`, color: card.color }}
            >
              {card.icon}
            </div>
            <h4 className="font-semibold text-slate-800 text-sm mb-1.5">{card.title}</h4>
            <p className="text-slate-500 text-xs leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>

      {/* Improvement hero strip */}
      <div className="bg-teal-600 rounded-2xl p-5 sm:p-6">
        <p className="text-teal-200 text-xs font-bold uppercase tracking-wider mb-1">
          ★ Proposed Ensemble — Improvement over Best Baseline
        </p>
        <p className="text-white text-sm mb-5 max-w-xl leading-relaxed">
          Across all five metrics the proposed model outperforms the best-performing individual classifier
          on the Cleveland Heart Disease test set.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PERF_METRICS.map((pm) => {
            const imp = IMPROVEMENTS[pm.key];
            return (
              <div key={pm.key} className="bg-teal-700/60 rounded-xl p-3.5 text-center">
                <p className="text-teal-300 text-xs font-semibold mb-1">{pm.label}</p>
                <p className="text-white text-xl font-bold font-mono">{imp.label}</p>
                <p className="text-teal-400 text-xs mt-0.5">vs. best baseline</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Performance comparison section ────────────────────────────────────────────
function PerformanceSection() {
  const baselines = PERF_MODELS.filter((m) => !m.isProposed);
  const proposedMaybe = PERF_MODELS.find((m) => m.isProposed);
  if (!proposedMaybe) return null;
  const proposed: ModelMetrics = proposedMaybe;

  function bestBaselineVal(key: PerfMetricKey): number | null {
    const vals = baselines
      .map((b) => getMetric(b, key))
      .filter((v): v is number => v !== null);
    return vals.length > 0 ? Math.max(...vals) : null;
  }

  function delta(key: PerfMetricKey): number | null {
    const pv = getMetric(proposed, key);
    const bv = bestBaselineVal(key);
    if (pv === null || bv === null) return null;
    return pv - bv;
  }

  // Bar chart data — accuracy comparison
  const barData = PERF_MODELS.map((m) => ({
    name: m.shortName,
    fullName: m.name,
    value: m.accuracy,
    color: m.color,
    isProposed: m.isProposed,
  }));

  // Radar data
  const radarData = PERF_METRICS.map((pm) => {
    const row: Record<string, string | number> = { metric: pm.short };
    for (const m of PERF_MODELS) {
      const v = getMetric(m, pm.key);
      row[m.shortName] = v === null ? 0 : pm.isAUC ? v * 100 : v;
    }
    return row;
  });

  return (
    <div className="space-y-5">
      <div>
        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full tracking-wide mb-3">
          Experimental Results
        </span>
        <h2
          className="text-xl sm:text-2xl font-bold text-slate-800 mb-1.5"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Performance Comparison
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Cleveland Heart Disease Dataset · Identical 80/20 stratified split and preprocessing for all models.
        </p>
      </div>

      {/* Bar chart — accuracy */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-0.5">Accuracy by Model</h3>
        <p className="text-slate-400 text-xs mb-5">Test-set accuracy (%). Proposed model highlighted in teal.</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[78, 86]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false} tickLine={false} width={44}
            />
            <ReferenceLine
              y={83.05} stroke="#6366f1" strokeDasharray="4 3" strokeWidth={1.5}
              label={{ value: 'Best baseline 83.05%', position: 'insideTopRight', fontSize: 10, fill: '#6366f1' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as (typeof barData)[0];
                return (
                  <div className="bg-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 shadow-xl">
                    <p className="font-semibold mb-1">{d.fullName}</p>
                    <p className="font-mono text-sm font-bold" style={{ color: d.color }}>
                      {d.value !== null ? `${d.value.toFixed(2)}%` : '—'}
                    </p>
                    {d.isProposed && <p className="text-teal-400 text-xs mt-0.5">★ Proposed model</p>}
                  </div>
                );
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {barData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.color}
                  opacity={entry.isProposed ? 1 : 0.72}
                  stroke={entry.isProposed ? entry.color : 'transparent'}
                  strokeWidth={2}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-0.5">All-Metric Radar</h3>
        <p className="text-slate-400 text-xs mb-5">All values normalised to % scale (AUC × 100). Outer edge = 100.</p>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#64748b' }} />
            {baselines.map((m) => (
              <Radar
                key={m.shortName}
                name={m.shortName}
                dataKey={m.shortName}
                stroke={m.color}
                fill={m.color}
                fillOpacity={0.06}
                strokeWidth={1.5}
              />
            ))}
            <Radar
              name="★ Proposed"
              dataKey={proposed.shortName}
              stroke="#0d9488"
              fill="#0d9488"
              fillOpacity={0.18}
              strokeWidth={2.5}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: 11, color: '#64748b' }}>{value}</span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Full metrics table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Full Metrics Table</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cleveland Heart Disease Dataset · ▲ marks best baseline per column
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide min-w-[200px]">
                  Model
                </th>
                {PERF_METRICS.map((m) => (
                  <th key={m.key} className="text-center px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap">
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {baselines.map((model) => (
                <tr key={model.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: model.color }} />
                      <span className="font-medium text-slate-600">{model.name}</span>
                    </div>
                  </td>
                  {PERF_METRICS.map((metric) => {
                    const val = getMetric(model, metric.key);
                    const bv = bestBaselineVal(metric.key);
                    const isBest = val !== null && bv !== null && Math.abs(val - bv) < (metric.isAUC ? 0.00005 : 0.005);
                    return (
                      <td key={metric.key} className="px-4 py-3.5 text-center">
                        {val === null ? (
                          <span className="text-slate-300 font-mono select-none">—</span>
                        ) : (
                          <span className={`font-mono text-sm ${isBest ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                            {fmtVal(val, metric.isAUC)}
                            {isBest && <span className="ml-1 text-slate-400 text-xs">▲</span>}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Proposed row */}
              <tr className="border-t-2 border-teal-300 bg-teal-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-teal-800 text-sm leading-tight">★ {proposed.name}</p>
                      <p className="text-teal-600 text-xs">Feature-Selected Weighted Soft-Voting</p>
                    </div>
                  </div>
                </td>
                {PERF_METRICS.map((metric) => {
                  const val = getMetric(proposed, metric.key);
                  return (
                    <td key={metric.key} className="px-4 py-4 text-center">
                      {val === null ? (
                        <span className="text-slate-300 font-mono">—</span>
                      ) : (
                        <span className="font-mono font-bold text-teal-700 text-sm">
                          {fmtVal(val, metric.isAUC)}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Improvement row */}
              <tr className="bg-teal-600 text-white">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-xs font-bold text-teal-100 uppercase tracking-wide">vs. Best Baseline</span>
                  </div>
                </td>
                {PERF_METRICS.map((metric) => {
                  const d = delta(metric.key);
                  const pos = d !== null && d > 0;
                  const neg = d !== null && d < 0;
                  return (
                    <td key={metric.key} className="px-4 py-3 text-center">
                      <span className={`font-mono text-sm font-bold ${
                        d === null ? 'text-teal-400' :
                        pos ? 'text-emerald-300' :
                        neg ? 'text-red-300' : 'text-teal-200'
                      }`}>
                        {d === null ? '—' : `${d >= 0 ? '+' : ''}${metric.isAUC ? (d * 100).toFixed(2) + '%' : d.toFixed(2) + '%'}`}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400">
          <span>▲ Best baseline per column</span>
          <span className="text-emerald-600 font-semibold">+X.XX%</span><span>proposed better</span>
          <span className="text-red-500 font-semibold">−X.XX%</span><span>proposed worse</span>
        </div>
      </div>

      {/* ── Literature comparison ───────────────────────────────────────────── */}
      <LiteratureComparisonSection />
    </div>
  );
}

// ── Literature comparison (method-level, no invented metrics) ─────────────────
const LITERATURE_MODELS: Array<{
  label: string;
  tags: string[];
  note: string;
}> = [
  {
    label: 'SVM + RF + XGBoost + KNN + SHAP + LIME',
    tags: ['SVM', 'RF', 'XGBoost', 'KNN', 'SHAP', 'LIME'],
    note: 'Ensemble of four classifiers with dual explainability — lacks feature selection and LR.',
  },
  {
    label: 'Decision Tree + KNN + RF + XGBoost + SHAP',
    tags: ['DT', 'KNN', 'RF', 'XGBoost', 'SHAP'],
    note: 'Tree-heavy ensemble with single SHAP explanation — no soft-voting, no LIME, no LR.',
  },
  {
    label: 'Extra Trees + SHAP + LIME + PIA',
    tags: ['Extra Trees', 'SHAP', 'LIME', 'PIA'],
    note: 'Single model with three explanation methods — no ensemble, no feature selection.',
  },
  {
    label: 'EBM + XGBoost + SHAP + LIME',
    tags: ['EBM', 'XGBoost', 'SHAP', 'LIME'],
    note: 'Interpretable EBM paired with XGBoost — two-model blend, no weighted voting strategy.',
  },
  {
    label: 'Random Forest + other ML models + SHAP + LIME',
    tags: ['RF', 'ML ensemble', 'SHAP', 'LIME'],
    note: 'General RF-anchored ensemble — unspecified auxiliary models, no explicit feature selection.',
  },
  {
    label: 'RF + Decision Tree + SVM + Soft Voting + SHAP + LIME',
    tags: ['RF', 'DT', 'SVM', 'Soft Voting', 'SHAP', 'LIME'],
    note: 'Closest to our approach — uses soft voting and dual explainability, but no feature selection or LR.',
  },
];

const WHAT_IS_DIFFERENT = [
  {
    color: '#4f46e5',
    title: 'Feature Selection',
    detail: 'Upstream dimensionality reduction before any model sees the data — not present in prior work.',
  },
  {
    color: '#0d9488',
    title: 'Logistic Regression in the Ensemble',
    detail: 'LR adds a linear decision boundary that complements tree-based and kernel models.',
  },
  {
    color: '#06b6d4',
    title: 'XGBoost in the Ensemble',
    detail: 'Gradient-boosted trees bring high accuracy on structured clinical data with regularisation.',
  },
  {
    color: '#7c3aed',
    title: 'Weighted Soft Voting',
    detail: 'Each classifier votes in proportion to its validated performance — not a naive equal-weight average.',
  },
  {
    color: '#d97706',
    title: 'SHAP + LIME Together',
    detail: 'Dual post-hoc explanations cross-validate each other, giving clinicians two independent views.',
  },
];

// Tag colour map — keeps pill colours consistent
const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  SVM:        { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
  RF:         { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  XGBoost:    { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc' },
  KNN:        { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
  SHAP:       { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  LIME:       { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  DT:         { bg: '#fefce8', text: '#a16207', border: '#fef08a' },
  'Extra Trees':{ bg: '#fdf4ff', text: '#9333ea', border: '#e9d5ff' },
  PIA:        { bg: '#f0f9ff', text: '#0369a1', border: '#bae6fd' },
  EBM:        { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  'ML ensemble':{ bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
  'Soft Voting':{ bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
  LR:         { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
  'Weighted Soft Voting': { bg: '#f0fdfa', text: '#0f766e', border: '#5eead4' },
  'Feature Selection':    { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
};

function Tag({ label }: { label: string }) {
  const c = TAG_COLORS[label] ?? { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' };
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}
    >
      {label}
    </span>
  );
}

function LiteratureComparisonSection() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Comparison with Previous Research Models</h3>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed max-w-2xl">
          Prior studies used different datasets and evaluation setups — numeric accuracy comparisons would be
          misleading. Instead, we compare <strong className="text-slate-600">model combinations and methodological choices</strong>.
        </p>
      </div>

      {/* Prior work rows */}
      <div className="divide-y divide-slate-50">
        {LITERATURE_MODELS.map((m, i) => (
          <div key={i} className="px-5 py-4 hover:bg-slate-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">
                  Prior Study {i + 1}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {m.tags.map((tag) => <Tag key={tag} label={tag} />)}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{m.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Proposed approach row — highlighted */}
      <div className="border-t-2 border-teal-300 bg-teal-50 px-5 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">★ Proposed</span>
              <p className="text-xs text-teal-700 font-semibold uppercase tracking-wide">Our Approach</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {['Feature Selection', 'LR', 'RF', 'SVM', 'XGBoost', 'Weighted Soft Voting', 'SHAP', 'LIME'].map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
            <p className="text-xs text-teal-700 leading-relaxed font-medium">
              Feature Selection + LR + RF + SVM + XGBoost + Weighted Soft Voting + SHAP + LIME.
              Integrates all four classifiers under a calibrated weighted ensemble, with upstream
              feature filtering and dual post-hoc explanation.
            </p>
          </div>
        </div>
      </div>

      {/* What is different */}
      <div className="border-t border-slate-100 bg-slate-50 px-5 py-5">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">What is different?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {WHAT_IS_DIFFERENT.map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-slate-200 px-3.5 py-3.5 shadow-sm">
              <span
                className="inline-block w-2 h-2 rounded-full mb-2"
                style={{ backgroundColor: item.color }}
              />
              <p className="text-xs font-bold text-slate-800 mb-1 leading-snug">{item.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="border-t border-slate-100 px-5 py-3 bg-white">
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-500">Note:</strong> Prior studies are described based on their published
          model combinations. Accuracy figures are intentionally omitted because each study used a different
          dataset, split strategy, and preprocessing pipeline — direct numeric comparison would be statistically invalid.
        </p>
      </div>
    </div>
  );
}

// ── Pipeline diagram ───────────────────────────────────────────────────────────
function PipelineSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Previous models */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-700 text-sm">Individual Classifiers</h3>
            <p className="text-slate-400 text-xs">Each model runs in isolation</p>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {[
            { name: 'Logistic Regression', color: '#6366f1', acc: '83.05%' },
            { name: 'Random Forest',       color: '#3b82f6', acc: '82.39%' },
            { name: 'SVM',                 color: '#8b5cf6', acc: '81.83%' },
            { name: 'XGBoost',             color: '#06b6d4', acc: '82.61%' },
          ].map((m) => (
            <div key={m.name} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                <span className="text-sm text-slate-600 font-medium leading-tight flex-1">{m.name}</span>
                <span className="font-mono text-xs text-slate-400">{m.acc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-xs text-red-600 font-medium">
            ✗ No coordination &ensp;·&ensp; ✗ No feature filtering &ensp;·&ensp; ✗ No explainability
          </p>
        </div>
      </div>

      {/* Proposed pipeline */}
      <div className="bg-teal-50 border-2 border-teal-400 rounded-2xl p-5 sm:p-6 flex flex-col relative">
        <span className="absolute top-4 right-4 bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          ★ Proposed
        </span>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.6C6.37 16.06 1 11.3 1 7.2 1 3.41 4.07 2 6.28 2c1.31 0 4.15.5 5.72 4.46C13.59 2.49 16.46 2 17.72 2 20.26 2 23 3.62 23 7.18c0 4.07-5.14 8.63-11 14.42z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-teal-800 text-sm">Proposed Ensemble Pipeline</h3>
            <p className="text-teal-600 text-xs">Accuracy: <strong>83.85%</strong></p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full bg-indigo-100 border border-indigo-200 rounded-xl px-4 py-2.5 text-center">
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Feature Selection</p>
            <p className="text-xs text-indigo-500 mt-0.5">Keeps highest-signal clinical features</p>
          </div>
          <FlowArrow />
          <div className="w-full grid grid-cols-4 gap-1.5">
            {[
              { label: 'RF',  color: '#3b82f6' },
              { label: 'XGB', color: '#06b6d4' },
              { label: 'SVM', color: '#8b5cf6' },
              { label: 'LR',  color: '#6366f1' },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl py-2.5 text-center border"
                style={{ background: `${m.color}14`, borderColor: `${m.color}40` }}
              >
                <span className="text-xs font-bold" style={{ color: m.color }}>{m.label}</span>
              </div>
            ))}
          </div>
          <FlowArrow />
          <div className="w-full bg-teal-100 border border-teal-300 rounded-xl px-4 py-2.5 text-center">
            <p className="text-xs font-bold text-teal-800 uppercase tracking-wider">Weighted Soft Voting</p>
            <p className="text-xs text-teal-600 mt-0.5">RF 35% · SVM 30% · LR 15% · DT+NB 10% each</p>
          </div>
          <FlowArrow />
          <div className="w-full bg-teal-600 rounded-xl px-4 py-3.5 text-center shadow-lg shadow-teal-200">
            <p className="text-white font-bold text-sm">★ Final Prediction — 83.85% Accuracy</p>
            <p className="text-teal-200 text-xs mt-0.5">Risk probability · Confidence score</p>
          </div>
          <FlowArrow />
          <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-center">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">SHAP + LIME</p>
            <p className="text-xs text-amber-600 mt-0.5">Patient-level feature explanation</p>
          </div>
        </div>
        <div className="mt-5 p-3 bg-teal-100 border border-teal-200 rounded-xl">
          <p className="text-xs text-teal-800 font-medium">
            ✓ Feature-filtered &ensp;·&ensp; ✓ Ensemble combined &ensp;·&ensp; ✓ Weighted &ensp;·&ensp; ✓ Explainable
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Patient-specific sub-components ───────────────────────────────────────────
function BaselineModelCard({ model }: { model: PerModelPrediction }) {
  const pct = Math.round(model.probability * 100);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 card-lift overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl" style={{ backgroundColor: model.color }} />
      <div className="pl-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{model.shortName}</span>
        <p className="text-xs font-semibold text-slate-600 leading-tight mt-0.5 mb-2.5">{model.name}</p>
        <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${
          model.isHighRisk ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${model.isHighRisk ? 'bg-red-500' : 'bg-emerald-500'}`} />
          {model.isHighRisk ? 'HIGH RISK' : 'LOW RISK'}
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-1.5">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: model.color }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300">0%</span>
          <span className="text-sm font-bold font-mono" style={{ color: model.color }}>{pct}%</span>
          <span className="text-xs text-slate-300">100%</span>
        </div>
      </div>
    </div>
  );
}

function EnsembleCard({ model, baselines, agreeCount }: {
  model: PerModelPrediction;
  baselines: PerModelPrediction[];
  agreeCount: number;
}) {
  const pct = Math.round(model.probability * 100);
  return (
    <div className="bg-teal-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-teal-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <span className="text-teal-200 text-xs font-bold uppercase tracking-wider">★ Proposed Model</span>
          <h3 className="text-base font-bold text-white mt-0.5 leading-tight">
            Feature-Selected Weighted<br />Soft-Voting Ensemble
          </h3>
        </div>
        <div className="flex-shrink-0 sm:text-right">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm mb-2 ${
            model.isHighRisk ? 'bg-red-500 text-white' : 'bg-emerald-400 text-white'
          }`}>
            {model.isHighRisk ? 'HIGH RISK' : 'LOW RISK'}
          </div>
          <p className="text-3xl font-bold font-mono text-white block">
            {pct}<span className="text-lg text-teal-200">%</span>
          </p>
          <p className="text-teal-200 text-xs">risk probability</p>
        </div>
      </div>
      <div className="mb-5">
        <div className="flex justify-between text-xs text-teal-200 mb-1">
          <span>0%</span><span>50% threshold</span><span>100%</span>
        </div>
        <div className="h-3 rounded-full bg-teal-700 overflow-hidden relative">
          <div className="h-full rounded-full bg-white/90 transition-all duration-700" style={{ width: `${pct}%` }} />
          <div className="absolute inset-y-0 left-1/2 w-px bg-teal-400" />
        </div>
      </div>
      <p className="text-teal-200 text-xs font-semibold mb-2 uppercase tracking-wide">
        {agreeCount}/5 baseline models agree
      </p>
      <div className="flex flex-wrap gap-2">
        {ENSEMBLE_WEIGHTS.map((w, i) => {
          const bl = baselines[i];
          return (
            <div key={w.name} className="flex items-center gap-1.5 bg-teal-700/60 rounded-lg px-2.5 py-1.5 text-xs">
              <span className="font-bold text-white">{w.name}</span>
              <span className="text-teal-300">×{w.pct}%</span>
              <span className={`ml-0.5 font-semibold ${bl?.isHighRisk ? 'text-red-300' : 'text-emerald-300'}`}>
                → {Math.round((bl?.probability ?? 0) * 100)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function ModelComparison() {
  const navigate = useNavigate();
  const [result, setResult] = useState<PredictionResult | null>(null);

  useEffect(() => { setResult(loadPrediction()); }, []);

  const models = result ? computeAllModelPredictions(result.patientData) : null;
  const baselines = models?.filter((m) => !m.isProposed) ?? [];
  const ensemble  = models?.find((m) => m.isProposed);
  const agreeCount = ensemble
    ? baselines.filter((m) => m.isHighRisk === ensemble.isHighRisk).length
    : 0;

  const chartData = models?.map((m) => ({
    shortName: m.shortName,
    name: m.name,
    probability: Math.round(m.probability * 100),
    color: m.color,
    isProposed: m.isProposed,
    isHighRisk: m.isHighRisk,
  })) ?? [];

  const patientData = result?.patientData;
  const contextItems = patientData ? [
    { label: 'Age',           value: `${patientData.age} yrs` },
    { label: 'Sex',           value: patientData.sex === '1' ? 'Male' : 'Female' },
    { label: 'Chest Pain',    value: CHEST_PAIN_SHORT[patientData.chestPain] ?? '-' },
    { label: 'Max HR',        value: `${patientData.maxHR} bpm` },
    { label: 'Vessels',       value: `${patientData.numVessels} affected` },
    { label: 'Thal',          value: THAL_SHORT[patientData.thal] ?? '-' },
    { label: 'ST Depression', value: parseFloat(patientData.stDepression).toFixed(1) },
  ] : [];

  return (
    <div className="py-10 px-4 sm:px-6 bg-dots-slate min-h-screen">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Page header */}
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Model Comparison
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
            Real experimental results from the Cleveland Heart Disease Dataset.
            The proposed ensemble is compared against four individual classifiers on an identical held-out test set.
          </p>
        </div>

        {/* Why Our Model Is Better */}
        <WhyBetterSection />

        {/* Performance comparison (table + charts) */}
        <PerformanceSection />

        {/* Pipeline diagram */}
        <div className="space-y-4">
          <div>
            <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full tracking-wide mb-3">
              Architecture
            </span>
            <h2
              className="text-xl font-bold text-slate-800 mb-1"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Ensemble vs. Isolated Classifier
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Side-by-side architecture comparison showing how the pipeline integrates all components.
            </p>
          </div>
          <PipelineSection />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-semibold text-slate-400 px-2 tracking-wide uppercase">
            Patient-Specific Analysis
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Patient-specific content */}
        {!result ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1.5">No Patient Data Yet</h3>
            <p className="text-slate-400 text-sm mb-5 max-w-xs mx-auto leading-relaxed">
              Run a prediction to see how all models classify the same patient profile.
            </p>
            <button
              onClick={() => navigate('/prediction')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              Start Prediction
            </button>
          </div>
        ) : (
          <>
            {/* Patient context */}
            <div className="bg-slate-800 rounded-2xl px-5 py-4">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">Patient Profile</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {contextItems.map((item) => (
                  <div key={item.label}>
                    <p className="text-slate-500 text-xs">{item.label}</p>
                    <p className="text-white text-sm font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${result.isHighRisk ? 'bg-red-900/60 text-red-300' : 'bg-emerald-900/60 text-emerald-300'}`}>
                  {result.isHighRisk ? 'HIGH RISK' : 'LOW RISK'}
                </span>
                <span className="text-slate-400 text-xs">
                  {result.confidence}% confidence · {result.riskProbability}% risk probability
                </span>
              </div>
            </div>

            {/* Baseline model cards */}
            <div>
              <h2 className="font-semibold text-slate-800 mb-3 text-sm">
                How Each Baseline Model Classified This Patient
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                {baselines.map((m) => <BaselineModelCard key={m.name} model={m} />)}
              </div>
              {ensemble && (
                <EnsembleCard model={ensemble} baselines={baselines} agreeCount={agreeCount} />
              )}
            </div>

            {/* Probability chart */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 mb-0.5">Risk Probability by Model — This Patient</h2>
              <p className="text-slate-400 text-xs mb-5">
                Simulated per-patient probability. Dashed line = 50% decision threshold.
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="shortName" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false} tickLine={false} width={44}
                  />
                  <ReferenceLine
                    y={50} stroke="#94a3b8" strokeDasharray="5 3" strokeWidth={1.5}
                    label={{ value: '50% threshold', position: 'insideTopRight', fontSize: 10, fill: '#94a3b8' }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload as (typeof chartData)[0];
                      return (
                        <div className="bg-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 shadow-xl max-w-[200px]">
                          <p className="font-semibold mb-1 leading-tight">{d.name}</p>
                          <p className={`font-mono text-sm font-bold ${d.isHighRisk ? 'text-red-300' : 'text-emerald-300'}`}>
                            {d.probability}% — {d.isHighRisk ? 'HIGH RISK' : 'LOW RISK'}
                          </p>
                          {d.isProposed && <p className="text-teal-400 text-xs mt-0.5">★ Proposed model</p>}
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="probability" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.color}
                        opacity={entry.isProposed ? 1 : 0.72}
                        stroke={entry.isProposed ? entry.color : 'transparent'}
                        strokeWidth={2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 justify-center">
                {models?.map((m) => (
                  <div key={m.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    {m.isProposed ? <strong className="text-teal-700">★ {m.shortName}</strong> : m.shortName}
                  </div>
                ))}
              </div>
            </div>

            {/* Agreement summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
                <p className="text-3xl font-bold font-mono text-slate-800 mb-1">
                  {agreeCount}<span className="text-slate-400 text-xl">/5</span>
                </p>
                <p className="text-slate-500 text-sm">models agree with ensemble</p>
                <span className={`mt-3 inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                  agreeCount >= 4 ? 'bg-teal-50 text-teal-700' : agreeCount === 3 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                }`}>
                  {agreeCount >= 4 ? 'Strong consensus' : agreeCount === 3 ? 'Moderate consensus' : 'Split prediction'}
                </span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
                <p className="text-3xl font-bold font-mono text-slate-800 mb-1">
                  {ensemble ? Math.round(ensemble.probability * 100) : '—'}
                  <span className="text-slate-400 text-xl">%</span>
                </p>
                <p className="text-slate-500 text-sm">ensemble risk probability</p>
                <span className={`mt-3 inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                  ensemble?.isHighRisk ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {ensemble?.isHighRisk ? 'HIGH RISK classification' : 'LOW RISK classification'}
                </span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
                <p className="text-3xl font-bold font-mono text-teal-600 mb-1">5</p>
                <p className="text-slate-500 text-sm">models vote on every prediction</p>
                <span className="mt-3 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700">
                  Weighted soft voting
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/explainability')}
                className="border border-slate-300 hover:border-slate-400 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                View Explainability
              </button>
              <button
                onClick={() => navigate('/prediction')}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                New Prediction
              </button>
            </div>
          </>
        )}

        {/* Disclaimers */}
        <div className="space-y-3 pt-2">
          <div className="bg-slate-800 rounded-2xl px-6 py-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white">Simulation note:</strong>{' '}
              Per-patient probabilities in the Patient-Specific section are computed using simulated
              feature-importance weighting profiles that approximate each algorithm type — not the actual
              trained models. Global metric benchmarks are real experimental results from the Cleveland
              Heart Disease Dataset.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4">
            <p className="text-amber-800 text-xs leading-relaxed">
              <strong>Research Prototype:</strong>{' '}
              This tool is for academic demonstration only. It does not constitute clinical diagnosis
              and must not influence medical decisions. Consult a qualified healthcare professional
              for any health concerns.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
