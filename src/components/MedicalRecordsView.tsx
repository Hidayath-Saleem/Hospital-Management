import React, { useState } from 'react';
import {
  FileText,
  Activity,
  FlaskConical,
  HeartHandshake,
  Plus,
  X,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Search,
} from 'lucide-react';
import {
  Examination,
  MedicalTest,
  TestRecord,
  Treatment,
  TreatmentRecord,
  HospitalDatabase,
} from '../types/hospital';

interface MedicalRecordsViewProps {
  db: HospitalDatabase;
  onAddExamination: (exam: Examination) => void;
  onAddTestRecord: (record: TestRecord) => void;
  onAddTreatmentRecord: (record: TreatmentRecord) => void;
}

export const MedicalRecordsView: React.FC<MedicalRecordsViewProps> = ({
  db,
  onAddExamination,
  onAddTestRecord,
  onAddTreatmentRecord,
}) => {
  const [subTab, setSubTab] = useState<'EXAMS' | 'TESTS' | 'TREATMENTS'>('EXAMS');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);

  // Form states
  const [examForm, setExamForm] = useState({
    patientId: db.patients[0]?.patientId || 101,
    doctorId: db.doctors[0]?.doctorId || 201,
    date: new Date().toISOString().split('T')[0],
    findings: '',
    remarks: '',
  });

  const [testForm, setTestForm] = useState({
    patientId: db.patients[0]?.patientId || 101,
    testId: db.medicalTests[0]?.testId || 601,
    doctorId: db.doctors[0]?.doctorId || 201,
    date: new Date().toISOString().split('T')[0],
    result: '',
    status: 'Completed' as const,
  });

  const [treatForm, setTreatForm] = useState({
    patientId: db.patients[0]?.patientId || 101,
    treatmentId: db.treatments[0]?.treatmentId || 801,
    doctorId: db.doctors[0]?.doctorId || 201,
    date: new Date().toISOString().split('T')[0],
    remarks: '',
  });

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.findings) return;
    const nextId = Math.max(...db.examinations.map((e) => e.examinationId), 500) + 1;
    const newExam: Examination = {
      examinationId: nextId,
      patientId: Number(examForm.patientId),
      doctorId: Number(examForm.doctorId),
      examinationDate: examForm.date,
      findings: examForm.findings.trim(),
      remarks: examForm.remarks.trim() || 'Follow up required',
    };
    onAddExamination(newExam);
    setIsExamModalOpen(false);
  };

  const handleCreateTestRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testForm.result) return;
    const nextId = Math.max(...db.testRecords.map((t) => t.testRecordId), 700) + 1;
    const newRecord: TestRecord = {
      testRecordId: nextId,
      patientId: Number(testForm.patientId),
      testId: Number(testForm.testId),
      doctorId: Number(testForm.doctorId),
      testDate: testForm.date,
      testResult: testForm.result.trim(),
      status: testForm.status,
    };
    onAddTestRecord(newRecord);
    setIsTestModalOpen(false);
  };

  const handleCreateTreatmentRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!treatForm.remarks) return;
    const nextId = Math.max(...db.treatmentRecords.map((t) => t.treatmentRecordId), 900) + 1;
    const newRecord: TreatmentRecord = {
      treatmentRecordId: nextId,
      patientId: Number(treatForm.patientId),
      treatmentId: Number(treatForm.treatmentId),
      doctorId: Number(treatForm.doctorId),
      treatmentDate: treatForm.date,
      remarks: treatForm.remarks.trim(),
    };
    onAddTreatmentRecord(newRecord);
    setIsTreatmentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Clinical Records & Medical Services
          </h2>
          <p className="text-xs text-slate-500">
            Junction tables resolving M:N relations between Patients, Diagnostic Tests, and Procedures
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
          <button
            onClick={() => setSubTab('EXAMS')}
            className={`px-3.5 py-2 font-semibold transition ${
              subTab === 'EXAMS'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Examinations ({db.examinations.length})
          </button>
          <button
            onClick={() => setSubTab('TESTS')}
            className={`px-3.5 py-2 font-semibold transition ${
              subTab === 'TESTS'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Diagnostic Tests ({db.testRecords.length})
          </button>
          <button
            onClick={() => setSubTab('TREATMENTS')}
            className={`px-3.5 py-2 font-semibold transition ${
              subTab === 'TREATMENTS'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Treatments ({db.treatmentRecords.length})
          </button>
        </div>
      </div>

      {/* SubTab 1: Examinations */}
      {subTab === 'EXAMS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Clinical Examinations (EXAMINATION Entity Table)
              </h3>
              <p className="text-xs text-slate-500">
                Audit trail of clinical checkups performed by attending doctors
              </p>
            </div>
            <button
              onClick={() => setIsExamModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Examination</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 text-left">Exam ID</th>
                  <th className="py-2.5 px-3 text-left">Patient Name</th>
                  <th className="py-2.5 px-3 text-left">Examining Doctor</th>
                  <th className="py-2.5 px-3 text-left">Date</th>
                  <th className="py-2.5 px-3 text-left">Clinical Findings</th>
                  <th className="py-2.5 px-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {db.examinations.map((exam) => {
                  const patient = db.patients.find((p) => p.patientId === exam.patientId);
                  const doc = db.doctors.find((d) => d.doctorId === exam.doctorId);
                  return (
                    <tr key={exam.examinationId} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                        {exam.examinationId}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {patient?.patientName}
                      </td>
                      <td className="py-2.5 px-3">{doc?.doctorName}</td>
                      <td className="py-2.5 px-3 font-mono">{exam.examinationDate}</td>
                      <td className="py-2.5 px-3 text-slate-800 font-medium">{exam.findings}</td>
                      <td className="py-2.5 px-3 text-slate-600">{exam.remarks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 2: Diagnostic Tests */}
      {subTab === 'TESTS' && (
        <div className="space-y-6">
          {/* Diagnostic Test Catalog */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber-600" />
              Standard Medical Test Catalog (MEDICAL_TEST Master Table)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {db.medicalTests.map((t) => (
                <div key={t.testId} className="p-3 rounded-lg border border-amber-200/70 bg-amber-50/30 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span className="truncate" title={t.testName}>{t.testName}</span>
                    <span className="text-amber-700 font-mono">₹{t.testCost}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Test Records Junction Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Diagnostic Test Records (TEST_RECORD Junction Table)
                </h3>
                <p className="text-xs text-slate-500">
                  Resolves Many-to-Many relationship between PATIENT and MEDICAL_TEST
                </p>
              </div>
              <button
                onClick={() => setIsTestModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record Test Result</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 text-left">Record ID</th>
                    <th className="py-2.5 px-3 text-left">Patient</th>
                    <th className="py-2.5 px-3 text-left">Test Name</th>
                    <th className="py-2.5 px-3 text-left">Prescribing Doctor</th>
                    <th className="py-2.5 px-3 text-left">Date</th>
                    <th className="py-2.5 px-3 text-left">Diagnostic Result</th>
                    <th className="py-2.5 px-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {db.testRecords.map((tr) => {
                    const patient = db.patients.find((p) => p.patientId === tr.patientId);
                    const test = db.medicalTests.find((t) => t.testId === tr.testId);
                    const doc = db.doctors.find((d) => d.doctorId === tr.doctorId);
                    return (
                      <tr key={tr.testRecordId} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                          {tr.testRecordId}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {patient?.patientName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-800 font-medium">{test?.testName}</td>
                        <td className="py-2.5 px-3">{doc?.doctorName}</td>
                        <td className="py-2.5 px-3 font-mono">{tr.testDate}</td>
                        <td className="py-2.5 px-3 text-slate-800">{tr.testResult}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {tr.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Treatments */}
      {subTab === 'TREATMENTS' && (
        <div className="space-y-6">
          {/* Treatment Catalog */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              Standard Medical Procedures & Therapies (TREATMENT Master Table)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {db.treatments.map((tr) => (
                <div key={tr.treatmentId} className="p-3 rounded-lg border border-emerald-200/70 bg-emerald-50/30 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span className="truncate" title={tr.treatmentName}>{tr.treatmentName}</span>
                    <span className="text-emerald-700 font-mono">₹{tr.cost}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{tr.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment Records Junction Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Treatment Administration Records (TREATMENT_RECORD Junction Table)
                </h3>
                <p className="text-xs text-slate-500">
                  Resolves Many-to-Many relationship between PATIENT and TREATMENT
                </p>
              </div>
              <button
                onClick={() => setIsTreatmentModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Treatment Procedure</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 text-left">Record ID</th>
                    <th className="py-2.5 px-3 text-left">Patient</th>
                    <th className="py-2.5 px-3 text-left">Treatment / Therapy</th>
                    <th className="py-2.5 px-3 text-left">Doctor / Surgeon</th>
                    <th className="py-2.5 px-3 text-left">Date Administered</th>
                    <th className="py-2.5 px-3 text-left">Cost Tariff</th>
                    <th className="py-2.5 px-3 text-left">Clinical Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {db.treatmentRecords.map((tr) => {
                    const patient = db.patients.find((p) => p.patientId === tr.patientId);
                    const treat = db.treatments.find((t) => t.treatmentId === tr.treatmentId);
                    const doc = db.doctors.find((d) => d.doctorId === tr.doctorId);
                    return (
                      <tr key={tr.treatmentRecordId} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                          {tr.treatmentRecordId}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {patient?.patientName}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {treat?.treatmentName}
                        </td>
                        <td className="py-2.5 px-3">{doc?.doctorName}</td>
                        <td className="py-2.5 px-3 font-mono">{tr.treatmentDate}</td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-emerald-700">
                          ₹{treat?.cost.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{tr.remarks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Record Examination Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Record Clinical Examination
              </h3>
              <button onClick={() => setIsExamModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateExam} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Patient *</label>
                <select
                  value={examForm.patientId}
                  onChange={(e) => setExamForm({ ...examForm, patientId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {db.patients.map((p) => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.patientName} (ID: {p.patientId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Doctor *</label>
                <select
                  value={examForm.doctorId}
                  onChange={(e) => setExamForm({ ...examForm, doctorId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {db.doctors.map((d) => (
                    <option key={d.doctorId} value={d.doctorId}>
                      {d.doctorName} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={examForm.date}
                  onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Findings *</label>
                <textarea
                  required
                  rows={2}
                  value={examForm.findings}
                  onChange={(e) => setExamForm({ ...examForm, findings: e.target.value })}
                  placeholder="Clinical assessment observations..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Remarks</label>
                <input
                  type="text"
                  value={examForm.remarks}
                  onChange={(e) => setExamForm({ ...examForm, remarks: e.target.value })}
                  placeholder="Medication plan or advice"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
                >
                  Save Examination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Test Result Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-amber-400" />
                Store Medical Diagnostic Result
              </h3>
              <button onClick={() => setIsTestModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTestRecord} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Patient *</label>
                <select
                  value={testForm.patientId}
                  onChange={(e) => setTestForm({ ...testForm, patientId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {db.patients.map((p) => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.patientName} (ID: {p.patientId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Test *</label>
                <select
                  value={testForm.testId}
                  onChange={(e) => setTestForm({ ...testForm, testId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {db.medicalTests.map((t) => (
                    <option key={t.testId} value={t.testId}>
                      {t.testName} (₹{t.testCost})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Prescribing Doctor *</label>
                <select
                  value={testForm.doctorId}
                  onChange={(e) => setTestForm({ ...testForm, doctorId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {db.doctors.map((d) => (
                    <option key={d.doctorId} value={d.doctorId}>
                      {d.doctorName} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={testForm.date}
                  onChange={(e) => setTestForm({ ...testForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Diagnostic Result *</label>
                <input
                  type="text"
                  required
                  value={testForm.result}
                  onChange={(e) => setTestForm({ ...testForm, result: e.target.value })}
                  placeholder="e.g. Normal sinus rhythm, Hb 12.5 g/dL"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Treatment Modal */}
      {isTreatmentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                Log Treatment / Procedure
              </h3>
              <button onClick={() => setIsTreatmentModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTreatmentRecord} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Patient *</label>
                <select
                  value={treatForm.patientId}
                  onChange={(e) => setTreatForm({ ...treatForm, patientId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {db.patients.map((p) => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.patientName} (ID: {p.patientId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Treatment Procedure *</label>
                <select
                  value={treatForm.treatmentId}
                  onChange={(e) => setTreatForm({ ...treatForm, treatmentId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {db.treatments.map((t) => (
                    <option key={t.treatmentId} value={t.treatmentId}>
                      {t.treatmentName} (₹{t.cost.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Treating Doctor *</label>
                <select
                  value={treatForm.doctorId}
                  onChange={(e) => setTreatForm({ ...treatForm, doctorId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {db.doctors.map((d) => (
                    <option key={d.doctorId} value={d.doctorId}>
                      {d.doctorName} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={treatForm.date}
                  onChange={(e) => setTreatForm({ ...treatForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Remarks *</label>
                <input
                  type="text"
                  required
                  value={treatForm.remarks}
                  onChange={(e) => setTreatForm({ ...treatForm, remarks: e.target.value })}
                  placeholder="Clinical outcome or notes"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTreatmentModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold"
                >
                  Save Treatment Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
