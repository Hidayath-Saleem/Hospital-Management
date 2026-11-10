import React, { useState } from 'react';
import {
  HospitalDatabase,
  Patient,
  Admission,
  Examination,
  TestRecord,
  TreatmentRecord,
} from './types/hospital';
import { INITIAL_DATABASE } from './data/hospitalData';
import { generateCompleteSqlScript } from './data/exportSql';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { WardsAdmissionsView } from './components/WardsAdmissionsView';
import { DoctorsView } from './components/DoctorsView';
import { MedicalRecordsView } from './components/MedicalRecordsView';
import { SqlStudioView } from './components/SqlStudioView';
import { ErDiagramView } from './components/ErDiagramView';
import { NormalizationReportView } from './components/NormalizationReportView';
import { VivaTestsView } from './components/VivaTestsView';
import { CheckCircle2, Info } from 'lucide-react';

export default function App() {
  const [db, setDb] = useState<HospitalDatabase>(() => JSON.parse(JSON.stringify(INITIAL_DATABASE)));
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedQueryId, setSelectedQueryId] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global modals control
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset database to initial seed data
  const handleResetDb = () => {
    setDb(JSON.parse(JSON.stringify(INITIAL_DATABASE)));
    showToast('Database successfully reset to initial Oracle SQL seed records (141 rows).');
  };

  // Export complete SQL package including all 26 queries
  const handleExportSql = () => {
    const text = generateCompleteSqlScript();
    const blob = new Blob([text], { type: 'text/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'general_hospital_complete_master.sql';
    a.click();
    showToast('Complete Oracle SQL Master Script (DDL + 141 Rows + All 26 Queries) exported!');
  };

  // Patient handlers
  const handleAddPatient = (patient: Patient) => {
    setDb((prev) => ({
      ...prev,
      patients: [patient, ...prev.patients],
    }));
    showToast(`Patient "${patient.patientName}" registered successfully (Patient_ID: ${patient.patientId}).`);
  };

  const handleUpdatePatient = (patient: Patient) => {
    setDb((prev) => ({
      ...prev,
      patients: prev.patients.map((p) => (p.patientId === patient.patientId ? patient : p)),
    }));
    showToast(`Patient ${patient.patientId} updated successfully.`);
  };

  const handleDeletePatient = (patientId: number) => {
    setDb((prev) => ({
      ...prev,
      patients: prev.patients.filter((p) => p.patientId !== patientId),
      // ON DELETE CASCADE simulations
      admissions: prev.admissions.filter((a) => a.patientId !== patientId),
      examinations: prev.examinations.filter((e) => e.patientId !== patientId),
      testRecords: prev.testRecords.filter((t) => t.patientId !== patientId),
      treatmentRecords: prev.treatmentRecords.filter((tr) => tr.patientId !== patientId),
    }));
    showToast(`Patient ${patientId} and all associated records deleted (ON DELETE CASCADE executed).`);
  };

  // Admission handlers
  const handleAdmitPatient = (admission: Admission) => {
    setDb((prev) => ({
      ...prev,
      admissions: [admission, ...prev.admissions],
    }));
    const p = db.patients.find((pt) => pt.patientId === admission.patientId);
    showToast(`Inpatient Admission created for ${p?.patientName || `Patient ${admission.patientId}`}.`);
  };

  const handleDischargePatient = (admissionId: number, dischargeDate: string) => {
    setDb((prev) => ({
      ...prev,
      admissions: prev.admissions.map((a) =>
        a.admissionId === admissionId ? { ...a, dischargeDate } : a
      ),
    }));
    showToast(`Admission ID ${admissionId} marked as Discharged on ${dischargeDate}. Bed freed.`);
  };

  // Clinical handlers
  const handleAddExamination = (exam: Examination) => {
    setDb((prev) => ({
      ...prev,
      examinations: [exam, ...prev.examinations],
    }));
    showToast(`Examination ID ${exam.examinationId} recorded successfully.`);
  };

  const handleAddTestRecord = (record: TestRecord) => {
    setDb((prev) => ({
      ...prev,
      testRecords: [record, ...prev.testRecords],
    }));
    showToast(`Diagnostic Test Record ${record.testRecordId} stored.`);
  };

  const handleAddTreatmentRecord = (record: TreatmentRecord) => {
    setDb((prev) => ({
      ...prev,
      treatmentRecords: [record, ...prev.treatmentRecords],
    }));
    showToast(`Treatment Record ${record.treatmentRecordId} logged.`);
  };

  const activeInpatientsCount = db.admissions.filter((a) => !a.dischargeDate).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 text-xs animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDb={handleResetDb}
        onExportSql={handleExportSql}
        patientCount={db.patients.length}
        admittedCount={activeInpatientsCount}
      />

      {/* Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            db={db}
            setActiveTab={setActiveTab}
            onSelectQuery={(qId) => {
              setSelectedQueryId(qId);
              setActiveTab('sql');
            }}
            onOpenAdmitModal={() => setIsAdmitModalOpen(true)}
            onOpenPatientModal={() => setIsPatientModalOpen(true)}
          />
        )}

        {activeTab === 'patients' && (
          <PatientsView
            db={db}
            onAddPatient={handleAddPatient}
            onUpdatePatient={handleUpdatePatient}
            onDeletePatient={handleDeletePatient}
            isAddModalOpen={isPatientModalOpen}
            setIsAddModalOpen={setIsPatientModalOpen}
          />
        )}

        {activeTab === 'admissions' && (
          <WardsAdmissionsView
            db={db}
            onAdmitPatient={handleAdmitPatient}
            onDischargePatient={handleDischargePatient}
            isAdmitModalOpen={isAdmitModalOpen}
            setIsAdmitModalOpen={setIsAdmitModalOpen}
          />
        )}

        {activeTab === 'doctors' && <DoctorsView db={db} />}

        {activeTab === 'records' && (
          <MedicalRecordsView
            db={db}
            onAddExamination={handleAddExamination}
            onAddTestRecord={handleAddTestRecord}
            onAddTreatmentRecord={handleAddTreatmentRecord}
          />
        )}

        {activeTab === 'sql' && (
          <SqlStudioView
            db={db}
            selectedQueryId={selectedQueryId}
            onSelectQueryId={(id) => setSelectedQueryId(id)}
          />
        )}

        {activeTab === 'er' && <ErDiagramView />}

        {activeTab === 'normalization' && <NormalizationReportView />}

        {activeTab === 'viva' && <VivaTestsView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>General Hospital Management System • Experiment 11 (DBMS Laboratory)</span>
          <span className="font-mono text-[11px]">
            Relational Schema: 10 Tables • 3NF Normalized • Oracle SQL Developer Compatible
          </span>
        </div>
      </footer>
    </div>
  );
}
