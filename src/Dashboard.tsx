import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

// ── Risk Insights mock data ──────────────────────────────────────────────────

const SHAP_LIME_AGREEMENT = [
  { name: 'Chest Pain Type', shap: 0.44, lime: 0.41, agree: true },
  { name: 'Thalassemia', shap: 0.38, lime: 0.35, agree: true },
  { name: 'Exercise Angina', shap: 0.32, lime: 0.30, agree: true },
  { name: 'ST Depression', shap: 0.28, lime: 0.26, agree: true },
  { name: 'No. of Vessels', shap: 0.25, lime: 0.22, agree: true },
];

const FACTOR_PREVALENCE = [
  { name: 'High Cholesterol (>240)', count: 89, pct: 63 },
  { name: 'Elevated BP (>140 mmHg)', count: 74, pct: 52 },
  { name: 'Exercise Angina', count: 68, pct: 48 },
  { name: 'ST Depression >1', count: 61, pct: 43 },
  { name: 'Reversible Defect (Thal)', count: 54, pct: 38 },
  { name: 'Age >60 years', count: 47, pct: 33 },
];

const STATS = [
  { label: 'Total Predictions', value: '247', sub: '+12 this week', icon: 'chart', color: 'teal' },
  { label: 'High Risk', value: '142', sub: '57.5% of total', icon: 'alert', color: 'red' },
  { label: 'Low Risk', value: '105', sub: '42.5% of total', icon: 'check', color: 'emerald' },
  { label: 'Avg Confidence', value: '78.3%', sub: 'Across all predictions', icon: 'target', color: 'blue' },
];

const RISK_DISTRIBUTION = [
  { name: 'High Risk', value: 142, color: '#ef4444' },
  { name: 'Low Risk', value: 105, color: '#0d9488' },
];

const TOP_FACTORS = [
  { name: 'Chest Pain Type', importance: 0.44 },
  { name: 'Thalassemia', importance: 0.38 },
  { name: 'Exercise Angina', importance: 0.32 },
  { name: 'ST Depression', importance: 0.28 },
  { name: 'No. of Vessels', importance: 0.25 },
  { name: 'Max Heart Rate', importance: 0.22 },
  { name: 'Age', importance: 0.19 },
  { name: 'Cholesterol', importance: 0.15 },
];

const RECENT = [
  { id: 'P-2026-089', age: 58, sex: 'M', risk: 'HIGH', confidence: 84, date: 'Aug 22, 2026' },
  { id: 'P-2026-088', age: 43, sex: 'F', risk: 'LOW', confidence: 79, date: 'Aug 22, 2026' },
  { id: 'P-2026-087', age: 67, sex: 'M', risk: 'HIGH', confidence: 91, date: 'Aug 21, 2026' },
  { id: 'P-2026-086', age: 51, sex: 'M', risk: 'HIGH', confidence: 76, date: 'Aug 21, 2026' },
  { id: 'P-2026-085', age: 38, sex: 'F', risk: 'LOW', confidence: 88, date: 'Aug 20, 2026' },
  { id: 'P-2026-084', age: 72, sex: 'M', risk: 'HIGH', confidence: 93, date: 'Aug 20, 2026' },
  { id: 'P-2026-083', age: 46, sex: 'F', risk: 'LOW', confidence: 71, date: 'Aug 19, 2026' },
  { id: 'P-2026-082', age: 55, sex: 'M', risk: 'HIGH', confidence: 68, date: 'Aug 19, 2026' },
];

function StatIcon({ type }: { type: string }) {
  if (type === 'chart') return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
  if (type === 'alert') return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
  if (type === 'check') return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

export default function Dashboard() {
  const colorMap: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-600',
    red: 'bg-red-50 text-red-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="py-10 px-4 sm:px-6 bg-dots-slate min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">Prediction Dashboard</h1>
          <p className="text-slate-500 text-sm">Aggregate analytics across all patient predictions — August 2026</p>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STATS.map((stat) => {
            const accentMap: Record<string, string> = { teal: 'bg-teal-400', red: 'bg-red-400', emerald: 'bg-emerald-400', blue: 'bg-blue-400' };
            return (
              <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 stat-tile overflow-hidden relative">
                {/* Subtle top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentMap[stat.color] ?? 'bg-teal-400'} opacity-60`} />
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${colorMap[stat.color]}`}>
                  <StatIcon type={stat.icon} />
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-0.5">{stat.value}</div>
                <div className="text-xs font-medium text-slate-500 mb-1">{stat.label}</div>
                <div className="text-xs text-slate-400">{stat.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Pie chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 card-lift">
            <h2 className="font-semibold text-slate-800 mb-1 text-sm">Risk Distribution</h2>
            <p className="text-xs text-slate-400 mb-4">Proportion of high vs low risk predictions</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={RISK_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {RISK_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} patients`, '']} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-red-600">142</div>
                <div className="text-xs text-slate-500">High Risk (57.5%)</div>
              </div>
              <div className="bg-teal-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-teal-600">105</div>
                <div className="text-xs text-slate-500">Low Risk (42.5%)</div>
              </div>
            </div>
          </div>

          {/* Bar chart - top factors */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 card-lift">
            <h2 className="font-semibold text-slate-800 mb-1 text-sm">Top Risk Factors</h2>
            <p className="text-xs text-slate-400 mb-4">Average feature importance across all predictions</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={TOP_FACTORS} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => v.toFixed(2)} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [Number(v).toFixed(3), 'Importance']} />
                <Bar dataKey="importance" fill="#0d9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Insights section */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-sm">Risk Insights</h2>
              <p className="text-xs text-slate-400">SHAP/LIME agreement and risk factor prevalence across all predictions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* SHAP/LIME Agreement */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-700 text-sm">SHAP / LIME Agreement</h3>
                  <p className="text-xs text-slate-400 mt-0.5">How consistently both methods identify the same top features</p>
                </div>
                <div className="bg-teal-50 border border-teal-100 rounded-xl px-3 py-1.5 text-center">
                  <div className="text-lg font-bold text-teal-700">5/5</div>
                  <div className="text-xs text-teal-600">Avg agreement</div>
                </div>
              </div>
              <div className="space-y-3">
                {SHAP_LIME_AGREEMENT.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-40 flex-shrink-0 truncate">{item.name}</span>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-blue-500 font-medium">SHAP</span>
                          <span className="text-xs text-slate-400 font-mono">{item.shap}</span>
                        </div>
                        <div className="h-2 bg-blue-100 rounded-full">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${item.shap * 220}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-violet-500 font-medium">LIME</span>
                          <span className="text-xs text-slate-400 font-mono">{item.lime}</span>
                        </div>
                        <div className="h-2 bg-violet-100 rounded-full">
                          <div className="h-full bg-violet-400 rounded-full" style={{ width: `${item.lime * 220}%` }} />
                        </div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">SHAP and LIME consistently identify the same top risk factors, increasing confidence in explanation reliability.</p>
            </div>

            {/* Risk factor prevalence */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-700 text-sm mb-1">Risk Factor Prevalence</h3>
              <p className="text-xs text-slate-400 mb-4">Among high-risk patients (n=142)</p>
              <div className="space-y-3">
                {FACTOR_PREVALENCE.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600 leading-tight">{item.name}</span>
                      <span className="text-xs font-semibold text-slate-700 ml-2 flex-shrink-0">{item.count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full">
                      <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: `${item.pct}%` }} />
                    </div>
                    <div className="text-right text-xs text-slate-400 mt-0.5">{item.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent predictions table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm">Recent Predictions</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest patient assessments</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Age</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sex</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Risk</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Confidence</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECENT.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-600">{row.id}</td>
                    <td className="px-4 py-3.5 text-slate-700">{row.age}</td>
                    <td className="px-4 py-3.5 text-slate-700">{row.sex === 'M' ? 'Male' : 'Female'}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        row.risk === 'HIGH'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {row.risk}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 w-16">
                          <div
                            className={`h-full rounded-full ${row.risk === 'HIGH' ? 'bg-red-400' : 'bg-teal-400'}`}
                            style={{ width: `${row.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 font-medium">{row.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
