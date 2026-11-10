import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  Download,
  AlertTriangle,
  BookOpen,
  Layers,
  Sparkles,
} from 'lucide-react';

export const NormalizationReportView: React.FC = () => {
  const [activeStage, setActiveStage] = useState<'1NF' | '2NF' | '3NF' | 'REPORT'>('1NF');

  const handleDownloadReport = () => {
    fetch('/General_Hospital_Management_System/report/General_Hospital_Project_Report.md')
      .then((res) => {
        if (!res.ok) throw new Error('File not found');
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'General_Hospital_Project_Report.md';
        a.click();
      })
      .catch(() => {
        alert('Downloading report from project root...');
      });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Normalization Analysis & Academic Report
          </h2>
          <p className="text-xs text-slate-500">
            Step-by-step mathematical decomposition: Unnormalized Form (0NF) → 1NF → 2NF → 3NF
          </p>
        </div>

        {/* Stage Selector */}
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
          {(['1NF', '2NF', '3NF', 'REPORT'] as const).map((stage) => (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`px-4 py-2 font-semibold transition ${
                activeStage === stage
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {stage === 'REPORT' ? 'Complete Project Report' : `${stage} Decomposition`}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Content */}
      {activeStage === '1NF' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              STAGE A
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-2">
              First Normal Form (1NF) – Eliminating Multivalued Repeating Groups
            </h3>
            <p className="text-slate-600 mt-1">
              <strong>Core Rule:</strong> Every attribute in every row must contain atomic (indivisible) values only, and there must be no repeating groups.
            </p>
          </div>

          {/* Unnormalized Example */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              1. Unnormalized Hospital Register Row (0NF / UNF)
            </h4>
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-slate-800 font-mono text-[11px] overflow-x-auto">
              <table className="min-w-full">
                <tbody>
                  <tr>
                    <td className="font-bold py-1 pr-4">Patient_ID:</td>
                    <td>101</td>
                    <td className="font-bold py-1 pr-4">Patient_Name:</td>
                    <td>Rahul Sharma</td>
                  </tr>
                  <tr>
                    <td className="font-bold py-1 pr-4">Medical_Tests:</td>
                    <td colSpan={3} className="text-rose-700 font-bold">
                      &#123;&quot;12-Lead ECG&quot;, &quot;2D Echo&quot;, &quot;Lipid Profile&quot;&#125; (Repeating Group!)
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold py-1 pr-4">Admissions:</td>
                    <td colSpan={3} className="text-rose-700 font-bold">
                      &#123;&quot;2023-09-01, Cardiology, Stent&quot;, &quot;2023-10-12, Cardiology, Followup&quot;&#125;
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Problem & Decomposition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900">Problem Identified in 0NF</h5>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Multiple values stored in comma-separated strings.</li>
                <li>SQL relational comparison operators (=, &gt;, &lt;) cannot query individual diagnostic tests.</li>
                <li>Updating one test requires re-writing the entire multi-valued string.</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <h5 className="font-bold text-emerald-900">1NF Conversion Process</h5>
              <ul className="space-y-1.5 text-emerald-800 list-disc list-inside">
                <li>Each repeating group is unnested into discrete rows.</li>
                <li>Primary key becomes composite: (Patient_ID, Test_Name).</li>
                <li>Every cell contains exactly one atomic datum.</li>
              </ul>
            </div>
          </div>

          {/* Resulting 1NF Tables */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800">2. Resulting 1NF Table Structure</h4>
            <div className="p-3 bg-slate-900 text-emerald-400 font-mono rounded-xl text-xs space-y-1">
              <p>PATIENT_1NF(<u>Patient_ID</u>, Patient_Name, DOB, Gender, Phone, Address, Blood_Group)</p>
              <p>PATIENT_TESTS_1NF(<u>Patient_ID</u>, <u>Test_Name</u>, Test_Date, Test_Cost, Test_Result, Doctor_Name)</p>
            </div>
            <p className="text-slate-500 italic">
              Notice: PATIENT_TESTS_1NF contains composite key (Patient_ID, Test_Name). This introduces Partial Dependency (2NF violation)!
            </p>
          </div>
        </div>
      )}

      {activeStage === '2NF' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              STAGE B
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-2">
              Second Normal Form (2NF) – Eliminating Partial Functional Dependencies
            </h3>
            <p className="text-slate-600 mt-1">
              <strong>Core Rule:</strong> Must be in 1NF, and every non-prime attribute must be <em>fully functionally dependent</em> on the entire primary key (no attribute should depend on only part of a composite key).
            </p>
          </div>

          {/* Functional Dependencies in 1NF */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              1. Functional Dependencies Identified in 1NF Table
            </h4>
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2 text-slate-800 font-mono text-[11px]">
              <p>Table: PATIENT_TESTS_1NF(<u>Patient_ID</u>, <u>Test_Name</u>, Test_Cost, Test_Result, Doctor_Name)</p>
              <div className="pl-4 space-y-1 border-l-2 border-amber-300">
                <p>FD 1: (Patient_ID, Test_Name) → Test_Result [Full Dependency - OK]</p>
                <p className="text-rose-700 font-bold">
                  FD 2: Test_Name → Test_Cost [Partial Dependency! Test_Cost depends only on Test_Name, NOT Patient_ID]
                </p>
              </div>
            </div>
          </div>

          {/* Problem & Decomposition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900">Anomalies Caused by Partial Dependency</h5>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li><strong>Insertion Anomaly:</strong> Cannot define a new diagnostic test and its price until a patient actually takes that test.</li>
                <li><strong>Deletion Anomaly:</strong> If the only patient who took an MRI is discharged/deleted, we lose the MRI tariff price from the hospital system.</li>
                <li><strong>Update Anomaly:</strong> Changing the cost of an ECG requires updating thousands of past patient rows.</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <h5 className="font-bold text-emerald-900">2NF Decomposition Process</h5>
              <ul className="space-y-1.5 text-emerald-800 list-disc list-inside">
                <li>Extract the partial dependency <code>Test_Name → Test_Cost</code> into a dedicated master table: <code>MEDICAL_TEST</code>.</li>
                <li>Keep the full dependency in the junction table: <code>TEST_RECORD</code>.</li>
                <li>Repeat similarly for <code>TREATMENT</code> and <code>TREATMENT_RECORD</code>.</li>
              </ul>
            </div>
          </div>

          {/* Resulting 2NF Tables */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800">2. Resulting 2NF Tables</h4>
            <div className="p-3 bg-slate-900 text-emerald-400 font-mono rounded-xl text-xs space-y-1">
              <p>MEDICAL_TEST(<u>Test_ID</u>, Test_Name, Test_Cost, Description)</p>
              <p>TREATMENT(<u>Treatment_ID</u>, Treatment_Name, Cost, Description)</p>
              <p>TEST_RECORD(<u>Test_Record_ID</u>, Patient_ID*, Test_ID*, Doctor_ID*, Test_Date, Test_Result, Status)</p>
            </div>
          </div>
        </div>
      )}

      {activeStage === '3NF' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              STAGE C
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-2">
              Third Normal Form (3NF) – Eliminating Transitive Functional Dependencies
            </h3>
            <p className="text-slate-600 mt-1">
              <strong>Core Rule:</strong> Must be in 2NF, and no non-prime attribute must be <em>transitively dependent</em> on the primary key ($X \to Y$ and $Y \to Z$).
            </p>
          </div>

          {/* Transitive Dependency Example */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-purple-500" />
              1. Transitive Dependency in 2NF Admission Record
            </h4>
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-2 text-slate-800 font-mono text-[11px]">
              <p>Table: ADMISSION_2NF(<u>Admission_ID</u>, Patient_ID, Ward_ID, Ward_Name, Ward_Location, Ward_Capacity, GP_ID, GP_Name, GP_Clinic)</p>
              <div className="pl-4 space-y-1 border-l-2 border-purple-300">
                <p>FD 1: Admission_ID → Ward_ID</p>
                <p className="text-rose-700 font-bold">
                  FD 2: Ward_ID → Ward_Name, Ward_Location, Ward_Capacity
                </p>
                <p className="text-rose-700 font-semibold">
                  Conclusion: Capacity is transitively dependent on Admission_ID via Ward_ID!
                </p>
              </div>
            </div>
          </div>

          {/* Problem & Decomposition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900">Anomalies Caused by Transitive Dependency</h5>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li><strong>Redundancy:</strong> Ward location and capacity are duplicated across every single patient admission.</li>
                <li><strong>Update Anomaly:</strong> If Cardiology Ward expands capacity from 18 to 22 beds, hundreds of old admission rows must be updated.</li>
                <li><strong>Insertion Anomaly:</strong> A newly constructed ward cannot be registered in the system until a patient is actually admitted to it.</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <h5 className="font-bold text-emerald-900">3NF Decomposition Process</h5>
              <ul className="space-y-1.5 text-emerald-800 list-disc list-inside">
                <li>Extract <code>Ward_ID → Ward_Name, Ward_Type, Location, Capacity</code> into master table <code>WARD</code>.</li>
                <li>Extract <code>GP_ID → GP_Name, Clinic_Name, Phone</code> into master table <code>GP</code>.</li>
                <li>Extract <code>Doctor_ID → Doctor_Name, Specialization, Phone, Email</code> into master table <code>DOCTOR</code>.</li>
                <li>Retain only foreign keys in <code>ADMISSION</code>.</li>
              </ul>
            </div>
          </div>

          {/* Final 3NF Schema */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-sm">
                Final Schema: All 10 Relations are in 3NF (Zero Redundancy)
              </h4>
            </div>
            <div className="p-3 bg-slate-900 text-emerald-400 font-mono rounded-xl text-xs space-y-1">
              <p>1. PATIENT(<u>Patient_ID</u>, Patient_Name, DOB, Gender, Phone, Address, Blood_Group)</p>
              <p>2. WARD(<u>Ward_ID</u>, Ward_Name, Ward_Type, Location, Capacity)</p>
              <p>3. DOCTOR(<u>Doctor_ID</u>, Doctor_Name, Specialization, Phone, Email)</p>
              <p>4. GP(<u>GP_ID</u>, GP_Name, Clinic_Name, Phone)</p>
              <p>5. ADMISSION(<u>Admission_ID</u>, Patient_ID*, Ward_ID*, GP_ID*, Consultant_ID*, Admission_Date, Discharge_Date, Reason)</p>
              <p>6. EXAMINATION(<u>Examination_ID</u>, Patient_ID*, Doctor_ID*, Exam_Date, Findings, Remarks)</p>
              <p>7. MEDICAL_TEST(<u>Test_ID</u>, Test_Name, Test_Cost, Description)</p>
              <p>8. TEST_RECORD(<u>Test_Record_ID</u>, Patient_ID*, Test_ID*, Doctor_ID*, Test_Date, Test_Result, Status)</p>
              <p>9. TREATMENT(<u>Treatment_ID</u>, Treatment_Name, Cost, Description)</p>
              <p>10. TREATMENT_RECORD(<u>Treatment_Record_ID</u>, Patient_ID*, Treatment_ID*, Doctor_ID*, Date, Remarks)</p>
            </div>
          </div>
        </div>
      )}

      {activeStage === 'REPORT' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Academic Project Report (All 15 Sections)
              </h3>
              <p className="text-slate-500">
                Formatted for submission with student placeholders, faculty signatures, and references
              </p>
            </div>
            <button
              onClick={handleDownloadReport}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Report (.md)</span>
            </button>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4 max-h-[500px] overflow-y-auto text-slate-800 leading-relaxed font-sans">
            <h4 className="text-sm font-bold text-slate-900">Report Table of Contents:</h4>
            <ol className="list-decimal list-inside space-y-1 font-medium text-slate-700">
              <li>Cover Page (University, Department, Student Details, Guide Details)</li>
              <li>Problem Statement (Specialized wards, GP referrals, multi-doctor examinations)</li>
              <li>Objectives of the Project</li>
              <li>Data Requirement Analysis (Storage, Dependencies, Integrity)</li>
              <li>Identification of 10 Entities and Attributes</li>
              <li>E-R Diagram (Mermaid & Visual notations)</li>
              <li>Relationships and Cardinalities (1:1, 1:N, M:N resolutions)</li>
              <li>Normalization (Detailed 0NF → 1NF → 2NF → 3NF step-by-step)</li>
              <li>Logical Database Design / Relational Schema</li>
              <li>Oracle SQL Table Creation Commands (DDL scripts)</li>
              <li>SQL Insert Statements with 141 Sample Records</li>
              <li>SQL Queries with Tabular Outputs (26 Queries)</li>
              <li>Testing and Screenshots (8 Test Cases table)</li>
              <li>Conclusion</li>
              <li>References (Silberschatz, Navathe, Oracle Docs)</li>
            </ol>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
              The full report markdown file is generated at:
              <br />
              <code className="font-mono font-bold text-blue-950">
                /General_Hospital_Management_System/report/General_Hospital_Project_Report.md
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
