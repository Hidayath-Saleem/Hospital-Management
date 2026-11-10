import React, { useState } from 'react';
import {
  Network,
  Copy,
  Check,
  Layers,
  Key,
  Link as LinkIcon,
  HelpCircle,
  FileCode,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ErDiagramView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<string>('PATIENT');

  const mermaidCode = `erDiagram
    PATIENT ||--o{ ADMISSION : "undergoes (1:N)"
    WARD ||--o{ ADMISSION : "accommodates (1:N)"
    GP ||--o{ ADMISSION : "refers (1:N)"
    DOCTOR ||--o{ ADMISSION : "supervises (1:N)"

    PATIENT ||--o{ EXAMINATION : "is examined in (1:N)"
    DOCTOR ||--o{ EXAMINATION : "conducts (1:N)"

    PATIENT ||--o{ TEST_RECORD : "takes (1:N)"
    MEDICAL_TEST ||--o{ TEST_RECORD : "is performed as (1:N)"
    DOCTOR ||--o{ TEST_RECORD : "orders (1:N)"

    PATIENT ||--o{ TREATMENT_RECORD : "receives (1:N)"
    TREATMENT ||--o{ TREATMENT_RECORD : "administered in (1:N)"
    DOCTOR ||--o{ TREATMENT_RECORD : "executes (1:N)"`;

  const entities = [
    {
      name: 'PATIENT',
      type: 'Master Entity',
      description: 'Core person record receiving healthcare services.',
      pk: ['Patient_ID (NUMBER)'],
      uq: ['Phone (VARCHAR2)'],
      fk: [],
      attrs: ['Patient_Name', 'Date_of_Birth', 'Gender', 'Phone', 'Address', 'Blood_Group'],
      relationships: [
        { target: 'ADMISSION', card: '1 : N', desc: 'A patient has multiple hospital stays over time' },
        { target: 'EXAMINATION', card: '1 : N', desc: 'A patient undergoes multiple physical checkups' },
        { target: 'TEST_RECORD', card: '1 : N', desc: 'A patient takes multiple diagnostic lab tests' },
        { target: 'TREATMENT_RECORD', card: '1 : N', desc: 'A patient receives various therapies and surgeries' },
      ],
    },
    {
      name: 'WARD',
      type: 'Master Entity',
      description: 'Physical hospital ward department with bed allocations.',
      pk: ['Ward_ID (NUMBER)'],
      uq: ['Ward_Name (VARCHAR2)'],
      fk: [],
      attrs: ['Ward_Name', 'Ward_Type', 'Location', 'Capacity'],
      relationships: [
        { target: 'ADMISSION', card: '1 : N', desc: 'A ward accommodates multiple patient admissions up to bed capacity' },
      ],
    },
    {
      name: 'DOCTOR',
      type: 'Master Entity',
      description: 'Medical consultant, specialist, or examining physician.',
      pk: ['Doctor_ID (NUMBER)'],
      uq: ['Phone', 'Email'],
      fk: [],
      attrs: ['Doctor_Name', 'Specialization', 'Phone', 'Email'],
      relationships: [
        { target: 'ADMISSION', card: '1 : N', desc: 'Acts as primary consultant supervising inpatient care' },
        { target: 'EXAMINATION', card: '1 : N', desc: 'Conducts patient examinations & records diagnostic findings' },
        { target: 'TEST_RECORD', card: '1 : N', desc: 'Prescribes or interprets diagnostic medical tests' },
        { target: 'TREATMENT_RECORD', card: '1 : N', desc: 'Administers surgical or medical treatments' },
      ],
    },
    {
      name: 'GP',
      type: 'Master Entity',
      description: 'External community General Practitioner referring patients.',
      pk: ['GP_ID (NUMBER)'],
      uq: ['Phone'],
      fk: [],
      attrs: ['GP_Name', 'Clinic_Name', 'Phone'],
      relationships: [
        { target: 'ADMISSION', card: '1 : N', desc: 'Refers community patients for tertiary ward admissions' },
      ],
    },
    {
      name: 'ADMISSION',
      type: 'Transactional Entity',
      description: 'Inpatient hospital stay record connecting patient to ward and doctor.',
      pk: ['Admission_ID (NUMBER)'],
      uq: [],
      fk: ['Patient_ID -> PATIENT', 'Ward_ID -> WARD', 'GP_ID -> GP', 'Consultant_ID -> DOCTOR'],
      attrs: ['Admission_Date', 'Discharge_Date', 'Admission_Reason'],
      relationships: [
        { target: 'PATIENT', card: 'N : 1', desc: 'Associated patient' },
        { target: 'WARD', card: 'N : 1', desc: 'Assigned bed ward' },
        { target: 'DOCTOR', card: 'N : 1', desc: 'Leading consultant' },
      ],
    },
    {
      name: 'EXAMINATION',
      type: 'Clinical Transaction Entity',
      description: 'Clinical findings and vital assessments recorded by doctors.',
      pk: ['Examination_ID (NUMBER)'],
      uq: [],
      fk: ['Patient_ID -> PATIENT', 'Doctor_ID -> DOCTOR'],
      attrs: ['Examination_Date', 'Findings', 'Remarks'],
      relationships: [
        { target: 'PATIENT', card: 'N : 1', desc: 'Examined patient' },
        { target: 'DOCTOR', card: 'N : 1', desc: 'Examining doctor' },
      ],
    },
    {
      name: 'MEDICAL_TEST',
      type: 'Master Catalog Entity',
      description: 'Standard diagnostic test definitions, tariffs, and scopes.',
      pk: ['Test_ID (NUMBER)'],
      uq: ['Test_Name'],
      fk: [],
      attrs: ['Test_Name', 'Test_Cost', 'Description'],
      relationships: [
        { target: 'TEST_RECORD', card: '1 : N', desc: 'Test catalog definition executed across patients' },
      ],
    },
    {
      name: 'TEST_RECORD',
      type: 'Junction Entity (M:N)',
      description: 'Resolves Many-to-Many relationship between PATIENT and MEDICAL_TEST.',
      pk: ['Test_Record_ID (NUMBER)'],
      uq: [],
      fk: ['Patient_ID -> PATIENT', 'Test_ID -> MEDICAL_TEST', 'Doctor_ID -> DOCTOR'],
      attrs: ['Test_Date', 'Test_Result', 'Status'],
      relationships: [
        { target: 'PATIENT', card: 'N : 1', desc: 'Patient taking test' },
        { target: 'MEDICAL_TEST', card: 'N : 1', desc: 'Lab test ordered' },
      ],
    },
    {
      name: 'TREATMENT',
      type: 'Master Catalog Entity',
      description: 'Standard therapeutic procedures, surgeries, and tariffs.',
      pk: ['Treatment_ID (NUMBER)'],
      uq: ['Treatment_Name'],
      fk: [],
      attrs: ['Treatment_Name', 'Cost', 'Description'],
      relationships: [
        { target: 'TREATMENT_RECORD', card: '1 : N', desc: 'Procedure administered to multiple patients' },
      ],
    },
    {
      name: 'TREATMENT_RECORD',
      type: 'Junction Entity (M:N)',
      description: 'Resolves Many-to-Many relationship between PATIENT and TREATMENT.',
      pk: ['Treatment_Record_ID (NUMBER)'],
      uq: [],
      fk: ['Patient_ID -> PATIENT', 'Treatment_ID -> TREATMENT', 'Doctor_ID -> DOCTOR'],
      attrs: ['Treatment_Date', 'Remarks'],
      relationships: [
        { target: 'PATIENT', card: 'N : 1', desc: 'Patient treated' },
        { target: 'TREATMENT', card: 'N : 1', desc: 'Therapy received' },
      ],
    },
  ];

  const currentEnt = entities.find((e) => e.name === selectedEntity) || entities[0];

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-600" />
            Entity-Relationship (ER) Architecture & Cardinality Model
          </h2>
          <p className="text-xs text-slate-500">
            Compliant with Oracle Relational Algebra • 10 Entities • Junction Tables for M:N Resolution
          </p>
        </div>

        <button
          onClick={handleCopyMermaid}
          className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 shadow-sm transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Mermaid' : 'Copy Mermaid ER'}</span>
        </button>
      </div>

      {/* Visual ER Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Entities List */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Select Schema Entity
          </span>
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
            {entities.map((ent) => {
              const isSelected = ent.name === selectedEntity;
              return (
                <div
                  key={ent.name}
                  onClick={() => setSelectedEntity(ent.name)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 ring-1 ring-blue-500 text-blue-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ent.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        ent.type.includes('Junction')
                          ? 'bg-amber-100 text-amber-800'
                          : ent.type.includes('Transactional')
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ent.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{ent.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Entity Card & Relationships */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                  {currentEnt.type}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{currentEnt.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{currentEnt.description}</p>
              </div>
            </div>

            {/* Keys & Attributes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Primary & Candidate Keys */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-600" />
                  Primary & Candidate Keys
                </h4>
                <div className="space-y-1">
                  <div>
                    <span className="text-slate-500">Primary Key (PK):</span>{' '}
                    <span className="font-mono font-bold text-slate-900 underline">
                      {currentEnt.pk.join(', ')}
                    </span>
                  </div>
                  {currentEnt.uq.length > 0 && (
                    <div>
                      <span className="text-slate-500">Unique Keys (UK):</span>{' '}
                      <span className="font-mono text-slate-800">{currentEnt.uq.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Foreign Keys */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4 text-blue-600" />
                  Foreign Key References (FK)
                </h4>
                {currentEnt.fk.length === 0 ? (
                  <p className="text-slate-500 italic">None (Independent Master Relation)</p>
                ) : (
                  <ul className="space-y-1 font-mono text-[11px] text-blue-700">
                    {currentEnt.fk.map((f, idx) => (
                      <li key={idx}>• {f}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Attributes List */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-600" />
                Table Attributes (Ovals in ER Model)
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentEnt.attrs.map((attr) => (
                  <span
                    key={attr}
                    className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-mono"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>

            {/* Relationship Cardinalities */}
            <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Relational Cardinalities & Business Rules
              </h4>
              <div className="space-y-2">
                {currentEnt.relationships.map((rel, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/60 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <span>{currentEnt.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rel.target}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{rel.desc}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-xs shrink-0">
                      {rel.card}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mermaid Code Snippet Box */}
          <div className="bg-slate-900 rounded-xl p-4 text-xs space-y-2 text-slate-300">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-mono flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-blue-400" />
                er_diagram.mmd
              </span>
              <span className="text-[11px]">Paste into Mermaid Live Editor</span>
            </div>
            <pre className="font-mono text-emerald-400 overflow-x-auto p-2 bg-slate-950 rounded-lg">
              {mermaidCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
