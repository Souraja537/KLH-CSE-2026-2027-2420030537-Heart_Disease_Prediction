const PHASES = [
  {
    num: 1,
    title: 'Data Collection',
    desc: 'Sourced from the UCI Machine Learning Repository Cleveland Heart Disease Dataset, comprising 303 patient records with 14 clinical attributes collected from the Cleveland Clinic Foundation.',
    tags: ['Cleveland Dataset', '303 Samples', '14 Features', 'UCI Repository'],
    color: 'teal',
  },
  {
    num: 2,
    title: 'Data Preprocessing',
    desc: 'Missing values imputed using median substitution. Categorical variables encoded using one-hot encoding. Continuous features normalized using Min-Max and Standard scaling to ensure consistent model training.',
    tags: ['Missing Value Imputation', 'One-Hot Encoding', 'Feature Scaling', 'Train/Test Split'],
    color: 'blue',
  },
  {
    num: 3,
    title: 'Model Development',
    desc: 'Three supervised classification models were trained and compared: Random Forest, XGBoost, and Support Vector Machine. Hyperparameter optimization performed using 5-fold cross-validation and grid search.',
    tags: ['Random Forest', 'XGBoost', 'SVM', 'Cross-Validation', 'Grid Search'],
    color: 'violet',
  },
  {
    num: 4,
    title: 'Model Evaluation',
    desc: 'Comprehensive evaluation across accuracy, precision, recall, F1-score, and AUC-ROC. Confusion matrices analyzed to understand false positive/negative tradeoffs in a clinical context.',
    tags: ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'AUC-ROC'],
    color: 'orange',
  },
  {
    num: 5,
    title: 'Explainable Prediction',
    desc: 'SHAP (SHapley Additive exPlanations) and LIME (Local Interpretable Model-agnostic Explanations) applied post-hoc to explain individual predictions, enabling clinician-level interpretability.',
    tags: ['SHAP Values', 'LIME', 'Feature Attribution', 'Post-hoc Explainability'],
    color: 'red',
  },
];

const METRICS = [
  { model: 'Random Forest', accuracy: 88.5, precision: 87.2, recall: 89.4, f1: 88.3, auc: 0.93 },
  { model: 'XGBoost', accuracy: 87.1, precision: 85.9, recall: 88.7, f1: 87.3, auc: 0.91 },
  { model: 'SVM', accuracy: 84.3, precision: 83.1, recall: 85.2, f1: 84.1, auc: 0.88 },
];

const FEATURES = [
  { name: 'Age', type: 'Numeric', description: 'Age of the patient in years' },
  { name: 'Sex', type: 'Categorical', description: 'Biological sex (0 = Female, 1 = Male)' },
  { name: 'Chest Pain Type', type: 'Categorical', description: 'Type of chest pain (0–3)' },
  { name: 'Resting Blood Pressure', type: 'Numeric', description: 'Resting systolic BP (mmHg)' },
  { name: 'Serum Cholesterol', type: 'Numeric', description: 'Total cholesterol (mg/dl)' },
  { name: 'Fasting Blood Sugar', type: 'Binary', description: '>120 mg/dl = 1, else 0' },
  { name: 'Resting ECG', type: 'Categorical', description: 'Electrocardiographic result (0–2)' },
  { name: 'Maximum Heart Rate', type: 'Numeric', description: 'Max HR achieved in exercise (bpm)' },
  { name: 'Exercise-Induced Angina', type: 'Binary', description: 'Exercise-induced chest pain (0/1)' },
  { name: 'ST Depression', type: 'Numeric', description: 'ST depression vs. rest (0–6.2)' },
  { name: 'Number of Vessels', type: 'Categorical', description: 'Fluoroscopy-colored vessels (0–3)' },
  { name: 'Thalassemia', type: 'Categorical', description: 'Nuclear stress test result (0–2)' },
];

const colorMap: Record<string, string> = {
  teal: 'bg-teal-600 border-teal-200',
  blue: 'bg-blue-600 border-blue-200',
  violet: 'bg-violet-600 border-violet-200',
  orange: 'bg-orange-500 border-orange-200',
  red: 'bg-red-600 border-red-200',
};

const lineColorMap: Record<string, string> = {
  teal: 'border-teal-200',
  blue: 'border-blue-200',
  violet: 'border-violet-200',
  orange: 'border-orange-200',
  red: 'border-red-200',
};

const tagColorMap: Record<string, string> = {
  teal: 'bg-teal-50 text-teal-700 border-teal-100',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  violet: 'bg-violet-50 text-violet-700 border-violet-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-100',
  red: 'bg-red-50 text-red-700 border-red-100',
};

export default function About() {
  return (
    <div className="py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Methodology
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">About This Project</h1>
          <p className="text-slate-500 leading-relaxed max-w-2xl">
            This is an academic machine learning project that combines supervised classification with post-hoc explainability techniques to predict heart disease risk and provide transparent, clinician-friendly explanations.
          </p>
        </div>

        {/* Methodology timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="font-semibold text-slate-800 mb-8 text-base">5-Phase Methodology</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-slate-200 hidden sm:block" />

            <div className="space-y-8">
              {PHASES.map((phase, i) => (
                <div key={phase.num} className="flex gap-5">
                  {/* Phase number circle */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10 ${colorMap[phase.color].split(' ')[0]}`}>
                    {phase.num}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-6 ${i < PHASES.length - 1 ? 'border-b border-slate-100' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-800 text-sm">{phase.title}</h3>
                      <span className="text-xs text-slate-400">— Phase {phase.num}</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed mb-3">{phase.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.tags.map((tag) => (
                        <span key={tag} className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${tagColorMap[phase.color]}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dataset + Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-1 text-sm">Dataset Information</h2>
            <p className="text-xs text-slate-400 mb-4">Cleveland Heart Disease Dataset (UCI ML Repository)</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Total Records', value: '303' },
                { label: 'Features', value: '12 input' },
                { label: 'Positive Cases', value: '165 (54%)' },
                { label: 'Negative Cases', value: '138 (46%)' },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                  <div className="text-lg font-bold text-slate-800">{item.value}</div>
                  <div className="text-xs text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {FEATURES.map((f) => (
                <div key={f.name} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-700 font-medium">{f.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{f.description}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      f.type === 'Numeric' ? 'bg-blue-50 text-blue-600' :
                      f.type === 'Categorical' ? 'bg-violet-50 text-violet-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>{f.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* XAI techniques */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-4 text-sm">Explainable AI Techniques</h2>

            <div className="space-y-4">
              <div className="border border-blue-100 bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">SHAP</span>
                  <span className="text-sm font-semibold text-slate-800">SHapley Additive exPlanations</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  Unified framework for feature attribution based on cooperative game theory. SHAP values compute the marginal contribution of each feature by considering all possible feature coalitions.
                </p>
                <ul className="text-xs text-slate-500 space-y-0.5 list-disc list-inside">
                  <li>Global + local interpretability</li>
                  <li>Theoretically grounded (Shapley axioms)</li>
                  <li>Model-agnostic (TreeSHAP for tree models)</li>
                </ul>
              </div>

              <div className="border border-violet-100 bg-violet-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-violet-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">LIME</span>
                  <span className="text-sm font-semibold text-slate-800">Local Interpretable Model-agnostic Explanations</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  Explains individual predictions by fitting a locally faithful linear model around the specific data point. LIME samples nearby instances and learns a simple interpretable approximation.
                </p>
                <ul className="text-xs text-slate-500 space-y-0.5 list-disc list-inside">
                  <li>Instance-level explanations</li>
                  <li>Works with any black-box model</li>
                  <li>Intuitive weighted feature importance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Model performance table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm">Model Performance Comparison</h2>
            <p className="text-xs text-slate-400 mt-0.5">Evaluated on 20% held-out test set (n=61)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Model</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Accuracy</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Precision</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Recall</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">F1-Score</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">AUC-ROC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {METRICS.map((m, i) => (
                  <tr key={m.model} className={`hover:bg-slate-50 transition-colors ${i === 0 ? 'bg-teal-50/40' : ''}`}>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{m.model}</span>
                      {i === 0 && (
                        <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">Best</span>
                      )}
                    </td>
                    <td className={`px-4 py-4 text-right font-mono text-sm font-semibold ${i === 0 ? 'text-teal-700' : 'text-slate-700'}`}>{m.accuracy}%</td>
                    <td className="px-4 py-4 text-right font-mono text-sm text-slate-600">{m.precision}%</td>
                    <td className="px-4 py-4 text-right font-mono text-sm text-slate-600">{m.recall}%</td>
                    <td className="px-4 py-4 text-right font-mono text-sm text-slate-600">{m.f1}%</td>
                    <td className="px-6 py-4 text-right font-mono text-sm text-slate-600">{m.auc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">Research Disclaimer</p>
            <p className="text-sm text-amber-700 leading-relaxed">
              This system is intended for research and decision-support purposes only. It does not provide medical diagnosis or replace professional medical advice. Predictions are based on a limited dataset and should not be used as the sole basis for clinical decisions. Always consult a qualified healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
