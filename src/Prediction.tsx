import { useState } from 'react';
import { useNavigate } from 'react-router';
import { predictHeartDisease, savePrediction, PatientData } from '../lib/prediction';

interface FieldConfig {
  id: keyof PatientData;
  label: string;
  tooltip: string;
  type: 'number' | 'select';
  placeholder?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: string;
  options?: { value: string; label: string }[];
}

const FIELDS: FieldConfig[] = [
  {
    id: 'age', label: 'Age', type: 'number', placeholder: '54', unit: 'years', min: 1, max: 120,
    tooltip: 'Patient age in years. Risk of heart disease increases significantly after age 45.',
  },
  {
    id: 'sex', label: 'Sex', type: 'select',
    tooltip: 'Biological sex of the patient. Males are statistically at higher risk for coronary artery disease.',
    options: [{ value: '1', label: 'Male' }, { value: '0', label: 'Female' }],
  },
  {
    id: 'chestPain', label: 'Chest Pain Type', type: 'select',
    tooltip: 'Asymptomatic chest pain (no typical angina) is paradoxically associated with higher disease risk.',
    options: [
      { value: '0', label: 'Typical Angina' },
      { value: '1', label: 'Atypical Angina' },
      { value: '2', label: 'Non-anginal Pain' },
      { value: '3', label: 'Asymptomatic' },
    ],
  },
  {
    id: 'restingBP', label: 'Resting Blood Pressure', type: 'number', placeholder: '130', unit: 'mmHg', min: 50, max: 250,
    tooltip: 'Resting systolic blood pressure in mmHg. Normal is below 120; values above 140 indicate hypertension.',
  },
  {
    id: 'cholesterol', label: 'Serum Cholesterol', type: 'number', placeholder: '240', unit: 'mg/dl', min: 50, max: 600,
    tooltip: 'Total cholesterol level. Values above 240 mg/dl are considered high risk.',
  },
  {
    id: 'fastingBS', label: 'Fasting Blood Sugar', type: 'select',
    tooltip: 'Whether fasting blood sugar exceeds 120 mg/dl. Elevated values may indicate diabetes, a known risk factor.',
    options: [
      { value: '0', label: 'Normal (≤ 120 mg/dl)' },
      { value: '1', label: 'High (> 120 mg/dl)' },
    ],
  },
  {
    id: 'restingECG', label: 'Resting ECG Result', type: 'select',
    tooltip: 'Electrocardiographic result at rest. ST-T abnormalities and LV hypertrophy are associated with cardiac disease.',
    options: [
      { value: '0', label: 'Normal' },
      { value: '1', label: 'ST-T Wave Abnormality' },
      { value: '2', label: 'Left Ventricular Hypertrophy' },
    ],
  },
  {
    id: 'maxHR', label: 'Maximum Heart Rate', type: 'number', placeholder: '150', unit: 'bpm', min: 50, max: 250,
    tooltip: 'Maximum heart rate achieved during exercise testing. A lower maximum rate is associated with higher risk.',
  },
  {
    id: 'exerciseAngina', label: 'Exercise-Induced Angina', type: 'select',
    tooltip: 'Chest pain during physical exertion — a strong indicator of coronary artery disease.',
    options: [
      { value: '0', label: 'No' },
      { value: '1', label: 'Yes' },
    ],
  },
  {
    id: 'stDepression', label: 'ST Depression', type: 'number', placeholder: '1.0', step: '0.1', min: 0, max: 10,
    tooltip: 'ST segment depression induced by exercise relative to rest. Values above 2.0 are clinically significant.',
  },
  {
    id: 'numVessels', label: 'Major Vessels (Fluoroscopy)', type: 'select',
    tooltip: 'Number of major blood vessels colored by fluoroscopy (0–3). More affected vessels indicates more severe disease.',
    options: [
      { value: '0', label: '0 vessels' },
      { value: '1', label: '1 vessel' },
      { value: '2', label: '2 vessels' },
      { value: '3', label: '3 vessels' },
    ],
  },
  {
    id: 'thal', label: 'Thalassemia Result', type: 'select',
    tooltip: 'Nuclear stress test result. A reversible defect suggests ischemia; a fixed defect suggests scarred tissue.',
    options: [
      { value: '0', label: 'Normal' },
      { value: '1', label: 'Fixed Defect' },
      { value: '2', label: 'Reversible Defect' },
    ],
  },
];

const EMPTY: PatientData = {
  age: '', sex: '', chestPain: '', restingBP: '', cholesterol: '',
  fastingBS: '', restingECG: '', maxHR: '', exerciseAngina: '',
  stDepression: '', numVessels: '', thal: '',
};

function Tooltip({ text }: { text: string }) {
  return (
    <div className="relative group inline-flex ml-1.5">
      <button
        type="button"
        className="w-4 h-4 rounded-full bg-slate-200 hover:bg-teal-100 text-slate-500 hover:text-teal-600 text-xs flex items-center justify-center transition-colors"
        tabIndex={-1}
      >
        ?
      </button>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 leading-relaxed invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
      </div>
    </div>
  );
}

export default function Prediction() {
  const navigate = useNavigate();
  const [form, setForm] = useState<PatientData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof PatientData, string>>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(id: keyof PatientData, value: string) {
    setForm((f) => ({ ...f, [id]: value }));
    setErrors((e) => ({ ...e, [id]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof PatientData, string>> = {};

    FIELDS.forEach((field) => {
      const val = form[field.id];
      if (!val && val !== '0') {
        newErrors[field.id] = 'This field is required';
        return;
      }
      if (field.type === 'number') {
        const num = parseFloat(val);
        if (isNaN(num)) { newErrors[field.id] = 'Enter a valid number'; return; }
        if (field.min !== undefined && num < field.min) { newErrors[field.id] = `Minimum is ${field.min}`; return; }
        if (field.max !== undefined && num > field.max) { newErrors[field.id] = `Maximum is ${field.max}`; return; }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = predictHeartDisease(form);
      savePrediction(result);
      setLoading(false);
      navigate('/results');
    }, 1200);
  }

  function handleClear() {
    setForm(EMPTY);
    setErrors({});
  }

  return (
    <div className="py-10 px-4 sm:px-6 bg-dots-slate min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Patient Assessment
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Enter Patient Clinical Data</h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
            Complete all 12 clinical fields below. The model will predict heart disease risk and explain the contributing factors.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {FIELDS.map((field) => (
                <div key={field.id}>
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-1.5">
                    {field.label}
                    <Tooltip text={field.tooltip} />
                    {field.unit && (
                      <span className="ml-auto text-xs font-normal text-slate-400">{field.unit}</span>
                    )}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={form[field.id]}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white transition-colors appearance-none cursor-pointer ${
                        errors[field.id]
                          ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                          : 'border-slate-300 hover:border-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-50'
                      } outline-none`}
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={form[field.id]}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      step={field.step ?? '1'}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
                        errors[field.id]
                          ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                          : 'border-slate-300 hover:border-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-50'
                      } outline-none`}
                    />
                  )}

                  {errors[field.id] && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={handleClear}
              className="sm:order-1 px-6 py-3 rounded-xl border border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-800 text-sm font-semibold transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="sm:order-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Predict Heart Disease Risk'
              )}
            </button>
          </div>

          <p className="mt-5 text-xs text-slate-400 text-center">
            This prediction is for research and decision-support only — not a clinical diagnosis.
          </p>
        </form>
      </div>
    </div>
  );
}
