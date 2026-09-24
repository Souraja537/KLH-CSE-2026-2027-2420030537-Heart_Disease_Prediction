import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { loadPrediction, PredictionResult } from '../lib/prediction';
import {
  BarChart, Bar, XAxis, YAxis, Cell, ReferenceLine,
  ResponsiveContainer, Tooltip,
} from 'recharts';

function NoPrediction() {
  const navigate = useNavigate();
  return (
    <div className="py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-slate-700 mb-2">No Prediction to Explain</h2>
      <p className="text-slate-400 text-sm mb-6">Run a prediction first to see the explainability analysis.</p>
      <button
        onClick={() => navigate('/prediction')}
        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
      >
        Start Prediction
      </button>
    </div>
  );
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { fullName: string; shapValue: number } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <div className="font-medium mb-0.5">{d.fullName}</div>
      <div className={d.shapValue > 0 ? 'text-red-300' : 'text-teal-300'}>
        SHAP: {d.shapValue > 0 ? '+' : ''}{d.shapValue.toFixed(3)}
      </div>
      <div className="text-slate-400 text-xs mt-0.5">
        {d.shapValue > 0 ? 'Increases risk' : 'Reduces risk'}
      </div>
    </div>
  );
}

export default function Explainability() {
  const navigate = useNavigate();
  const [result, setResult] = useState<PredictionResult | null>(null);

  useEffect(() => {
    setResult(loadPrediction());
  }, []);

  if (!result) return <NoPrediction />;

  const { features, limeFeatures, isHighRisk, confidence } = result;

  const shapData = features.map((f) => ({
    name: f.name.length > 24 ? f.name.slice(0, 22) + '…' : f.name,
    fullName: f.name,
    shapValue: f.shapValue,
    displayValue: f.displayValue,
  }));

  const limeData = limeFeatures.map((f) => ({
    name: f.name.length > 24 ? f.name.slice(0, 22) + '…' : f.name,
    fullName: f.name,
    shapValue: f.shapValue,
    displayValue: f.displayValue,
    weight: Math.abs(f.shapValue),
  })).sort((a, b) => b.weight - a.weight);

  const positiveFeatures = features.filter((f) => f.shapValue > 0).slice(0, 3);
  const negativeFeatures = features.filter((f) => f.shapValue < 0).slice(0, 3);

  const riskLabel = isHighRisk ? 'HIGH RISK' : 'LOW RISK';
  const riskTextClass = isHighRisk ? 'text-red-600' : 'text-emerald-600';

  return (
    <div className="py-10 px-4 sm:px-6 bg-dots-slate min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/results')}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Results
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Explainable AI Analysis</h1>
          <p className="text-slate-500 text-sm max-w-xl">
            Understand why the model made this prediction using SHAP and LIME — the two leading techniques in Explainable AI.
          </p>
        </div>

        {/* Context bar */}
        <div className="bg-slate-800 rounded-2xl px-6 py-4 mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-slate-400 text-xs font-medium mb-0.5">Current Prediction</p>
            <span className={`text-lg font-bold ${riskTextClass}`}>{riskLabel}</span>
            <span className="text-slate-300 text-sm ml-2">({confidence}% confidence)</span>
          </div>
          <p className="text-slate-400 text-xs max-w-sm">
            The charts below decompose each feature's contribution to this prediction. Positive values push toward high risk; negative values push toward low risk.
          </p>
        </div>

        {/* SHAP explanation */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5 card-lift">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">SHAP</span>
                <h2 className="font-semibold text-slate-800">SHapley Additive exPlanations</h2>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
                SHAP values measure the marginal contribution of each feature to the prediction, based on game-theoretic Shapley values. Each bar shows how much the feature pushes the model's output toward high risk (positive, red) or low risk (negative, teal).
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 text-xs flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-red-500" />
                <span className="text-slate-500">Increases risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-teal-500" />
                <span className="text-slate-500">Reduces risk</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={shapData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => v.toFixed(2)} />
              <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11 }} />
              <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="shapValue" radius={[0, 4, 4, 0]}>
                {shapData.map((entry, i) => (
                  <Cell key={i} fill={entry.shapValue > 0 ? '#ef4444' : '#0d9488'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LIME explanation */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5 card-lift">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-0.5 rounded-full">LIME</span>
                <h2 className="font-semibold text-slate-800">Local Interpretable Model-agnostic Explanations</h2>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
                LIME approximates the model locally around this specific patient's data point using a simple interpretable model. The weights show which features were most influential for this individual prediction.
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {limeData.map((f, i) => (
              <div key={f.fullName} className="flex items-center gap-3">
                <span className="w-6 text-right text-xs text-slate-400 font-mono flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{f.fullName}</span>
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      <span className="text-xs text-slate-400 font-mono">{f.displayValue}</span>
                      <span className={`text-xs font-semibold ${f.shapValue > 0 ? 'text-red-500' : 'text-teal-600'}`}>
                        {f.shapValue > 0 ? '+' : ''}{f.shapValue.toFixed(3)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${f.shapValue > 0 ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-700'}`}>
                        {f.shapValue > 0 ? 'Risk ↑' : 'Risk ↓'}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${f.shapValue > 0 ? 'bg-red-400' : 'bg-teal-400'}`}
                      style={{ width: `${Math.min(100, f.weight * 280)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Natural language explanation */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Why did the model make this prediction?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {positiveFeatures.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Risk-increasing factors</p>
                <ul className="space-y-1.5">
                  {positiveFeatures.map((f) => (
                    <li key={f.name} className="text-sm text-slate-700 flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                      <span><strong>{f.name}</strong>: {f.displayValue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {negativeFeatures.length > 0 && (
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">Risk-reducing factors</p>
                <ul className="space-y-1.5">
                  {negativeFeatures.map((f) => (
                    <li key={f.name} className="text-sm text-slate-700 flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><strong>{f.name}</strong>: {f.displayValue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-600 leading-relaxed">
              The model's {isHighRisk ? 'high-risk' : 'low-risk'} prediction was primarily shaped by{' '}
              <strong>{features[0]?.name}</strong>,{' '}
              <strong>{features[1]?.name}</strong>, and{' '}
              <strong>{features[2]?.name}</strong>.{' '}
              {isHighRisk
                ? 'These factors together significantly increased the predicted disease probability above the 50% decision threshold.'
                : 'These factors together kept the predicted disease probability below the 50% decision threshold.'}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate('/results')}
            className="border border-slate-300 hover:border-slate-400 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            View Results
          </button>
          <button
            onClick={() => navigate('/prediction')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            New Prediction
          </button>
        </div>
      </div>
    </div>
  );
}
