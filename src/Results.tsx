import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  loadPrediction, PredictionResult,
  generateSummary, generateRecommendations,
  PersonalizedSummary, RiskRecommendation,
} from '../lib/prediction';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// ─── Icons ─────────────────────────────────────────────────────────────────

function IconHeart({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}
function IconActivity({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
function IconLab({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v10.5a4.5 4.5 0 009 0V3M9 3h6M9 3H7m8 0h2" />
    </svg>
  );
}
function IconAge({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
function IconEcg({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function IconVessel({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  );
}

function RecIcon({ type, className }: { type: string; className?: string }) {
  const cls = className ?? 'w-5 h-5';
  switch (type) {
    case 'heart': return <IconHeart className={cls} />;
    case 'activity': return <IconActivity className={cls} />;
    case 'lab': return <IconLab className={cls} />;
    case 'age': return <IconAge className={cls} />;
    case 'ecg': return <IconEcg className={cls} />;
    case 'vessel': return <IconVessel className={cls} />;
    default: return <IconHeart className={cls} />;
  }
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function NoPrediction() {
  const navigate = useNavigate();
  return (
    <div className="py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-slate-700 mb-2">No Prediction Found</h2>
      <p className="text-slate-400 text-sm mb-6">Complete the patient form to generate a prediction.</p>
      <button onClick={() => navigate('/prediction')} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
        Start Prediction
      </button>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    high: 'bg-red-50 text-red-700 border-red-200',
    moderate: 'bg-orange-50 text-orange-700 border-orange-200',
    informational: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  const labels: Record<string, string> = { high: 'HIGH', moderate: 'MODERATE', informational: 'NOTE' };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${map[severity] ?? map.informational}`}>
      {labels[severity] ?? severity}
    </span>
  );
}

// ─── Section: Risk Result Card ───────────────────────────────────────────────

function RiskCard({ result }: { result: PredictionResult }) {
  const { isHighRisk, confidence, riskProbability, features } = result;
  const riskBg = isHighRisk ? 'bg-red-50 border-red-200 shadow-lg shadow-red-100' : 'bg-emerald-50 border-emerald-200 shadow-lg shadow-emerald-100';
  const riskText = isHighRisk ? 'text-red-600' : 'text-emerald-600';
  const riskBadge = isHighRisk ? 'bg-red-600' : 'bg-emerald-600';
  const topFeatures = features.slice(0, 3).map(f => f.name);

  return (
    <div className={`rounded-2xl border-2 p-7 ${riskBg}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Heart Disease Risk</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`${riskBadge} text-white text-2xl font-bold px-5 py-2 rounded-xl tracking-wide`}>
              {isHighRisk ? 'HIGH RISK' : 'LOW RISK'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`text-4xl font-bold ${riskText}`}>{confidence}%</span>
              <span className="text-slate-500 text-sm font-medium">confidence</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Primarily influenced by: <span className="font-medium">{topFeatures.join(', ')}</span>
          </p>
        </div>
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
            <circle cx="50" cy="50" r="40" fill="none" stroke={isHighRisk ? '#dc2626' : '#10b981'} strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - riskProbability / 100)}`}
              strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-bold ${riskText}`}>{riskProbability}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Personalized Risk Summary ─────────────────────────────────────

function PersonalizedSummarySection({ summary, isHighRisk }: { summary: PersonalizedSummary; isHighRisk: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 pt-6 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-800">Personalized Risk Summary</h2>
        </div>
        <p className="text-xs text-slate-400 ml-9">Plain-language interpretation of the model's reasoning — no machine learning background required</p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk factors */}
        <div>
          <p className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            Key Risk Factors
          </p>
          {summary.riskFactors.length === 0 ? (
            <p className="text-sm text-slate-400">No strongly elevated risk factors identified.</p>
          ) : (
            <div className="space-y-2.5">
              {summary.riskFactors.map((f, i) => (
                <div key={f.name} className="flex items-start gap-3 bg-red-50/60 border border-red-100 rounded-xl px-4 py-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800 text-sm leading-snug">{f.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{f.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Protective factors */}
        <div>
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
            Protective / Lower-Risk Factors
          </p>
          {summary.protectiveFactors.length === 0 ? (
            <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-400">No significant protective factors identified for this profile.</div>
          ) : (
            <div className="space-y-2.5">
              {summary.protectiveFactors.map((f) => (
                <div key={f.name} className="flex items-start gap-3 bg-teal-50/60 border border-teal-100 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800 text-sm leading-snug">{f.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{f.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Simple explanation + agreement */}
      <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <p className="text-sm text-slate-600 italic leading-relaxed">{summary.simpleExplanation}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2 bg-white border border-teal-200 rounded-xl px-4 py-2">
          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-semibold text-teal-700">
            SHAP &amp; LIME agree on {summary.shapLimeAgreement.count}/{summary.shapLimeAgreement.total} top factors
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Feature Chart (mini) ──────────────────────────────────────────

function FeatureChart({ result }: { result: PredictionResult }) {
  const topFeatures = result.features.slice(0, 5).map((f) => ({
    name: f.name.length > 20 ? f.name.slice(0, 18) + '…' : f.name,
    fullName: f.name,
    impact: Math.abs(f.shapValue),
    shapValue: f.shapValue,
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-slate-800 text-sm">SHAP Feature Importance</h2>
          <p className="text-xs text-slate-400 mt-0.5">Top 5 features by contribution magnitude</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" /> Risk ↑</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-teal-400 inline-block" /> Risk ↓</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={topFeatures} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => v.toFixed(2)} />
          <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(_, __, item) => {
            const d = item.payload as { shapValue: number };
            return [`${d.shapValue > 0 ? '+' : ''}${d.shapValue.toFixed(3)}`, 'SHAP'];
          }} />
          <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
            {topFeatures.map((e, i) => <Cell key={i} fill={e.shapValue > 0 ? '#ef4444' : '#0d9488'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Section: Risk Factor Recommendations ───────────────────────────────────

function RecommendationCard({ rec, onViewExplanation }: { rec: RiskRecommendation; onViewExplanation: () => void }) {
  const severityStyles: Record<string, { ring: string; icon: string; badge: string }> = {
    high:          { ring: 'border-red-200 hover:border-red-300',    icon: 'bg-red-100 text-red-600',    badge: 'bg-red-50 text-red-700 border-red-200' },
    moderate:      { ring: 'border-orange-200 hover:border-orange-300', icon: 'bg-orange-100 text-orange-600', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
    informational: { ring: 'border-blue-200 hover:border-blue-300',   icon: 'bg-blue-100 text-blue-600',  badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  };
  const s = severityStyles[rec.severity] ?? severityStyles.informational;

  return (
    <div className={`bg-white rounded-2xl border-2 p-5 transition-colors ${s.ring}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}>
          <RecIcon type={rec.iconType} className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h3 className="font-bold text-slate-800 text-sm">{rec.shortLabel.toUpperCase()}</h3>
            <SeverityBadge severity={rec.severity} />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{rec.context}</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl px-4 py-3 mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Suggested Awareness</p>
        <p className="text-sm text-slate-700 leading-relaxed">{rec.suggestion}</p>
      </div>

      <button
        onClick={onViewExplanation}
        className="w-full text-center text-xs font-semibold text-teal-600 hover:text-teal-700 py-1.5 border border-teal-200 hover:border-teal-300 rounded-lg transition-colors"
      >
        View Explanation →
      </button>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [summary, setSummary] = useState<PersonalizedSummary | null>(null);
  const [recommendations, setRecommendations] = useState<RiskRecommendation[]>([]);

  useEffect(() => {
    const r = loadPrediction();
    if (r) {
      setResult(r);
      setSummary(generateSummary(r));
      setRecommendations(generateRecommendations(r));
    }
  }, []);

  if (!result) return <NoPrediction />;

  return (
    <div className="py-10 px-4 sm:px-6 bg-dots-slate min-h-screen">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Back */}
        <button onClick={() => navigate('/prediction')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Prediction
        </button>

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-0.5">Prediction Results</h1>
          <p className="text-slate-500 text-sm">Random Forest model · Cleveland Heart Disease Dataset</p>
        </div>

        {/* 1 — Risk card */}
        <RiskCard result={result} />

        {/* 2 — Personalized Risk Summary */}
        {summary && <PersonalizedSummarySection summary={summary} isHighRisk={result.isHighRisk} />}

        {/* 3 — Feature chart + explainability CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <FeatureChart result={result} />
          <div className="bg-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">SHAP</span>
                <span className="bg-violet-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">LIME</span>
              </div>
              <h2 className="text-white font-semibold text-lg mb-2 leading-snug">Full Explainability Analysis</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">
                See the complete SHAP waterfall chart and LIME feature weights — with a full natural-language breakdown of why the model made this prediction.
              </p>
            </div>
            <button
              onClick={() => navigate('/explainability')}
              className="bg-teal-500 hover:bg-teal-400 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              View SHAP / LIME Explanation
            </button>
          </div>
        </div>

        {/* 4 — Risk Factor Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="font-semibold text-slate-800">Risk Factor Recommendations</h2>
              </div>
              <p className="text-xs text-slate-400 ml-9">
                General health-awareness guidance based on identified contributing factors.{' '}
                <span className="font-semibold text-amber-600">Not a medical diagnosis or treatment recommendation.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.factor}
                  rec={rec}
                  onViewExplanation={() => navigate('/explainability')}
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button onClick={() => navigate('/explainability')} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm">
            View SHAP / LIME Explanation
          </button>
          <button onClick={() => navigate('/prediction')} className="flex-1 border border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
            New Prediction
          </button>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 flex items-start gap-3">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-amber-700 leading-relaxed">
            This system is intended for research and decision-support purposes only. It does not provide medical diagnosis or replace professional medical advice. Always consult a qualified healthcare professional for clinical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
