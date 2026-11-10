import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  AlertTriangle,
  Calendar,
  Phone,
  MapPin,
  Droplet,
  FileText,
  Activity,
  History,
} from 'lucide-react';
import { Patient, HospitalDatabase } from '../types/hospital';

interface PatientsViewProps {
  db: HospitalDatabase;
  onAddPatient: (patient: Patient) => void;
  onUpdatePatient: (patient: Patient) => void;
  onDeletePatient: (patientId: number) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  db,
  onAddPatient,
  onUpdatePatient,
  onDeletePatient,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');

  // Modal & Drawer states
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [deletingPatientId, setDeletingPatientId] = useState<number | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState<Partial<Patient>>({
    patientName: '',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    phone: '',
    address: '',
    bloodGroup: 'O+',
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Filter patients
  const filteredPatients = db.patients.filter((p) => {
    const matchesSearch =
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientId.toString().includes(searchTerm);

    const matchesBg = selectedBloodGroup === 'ALL' || p.bloodGroup === selectedBloodGroup;
    const matchesGender = selectedGender === 'ALL' || p.gender === selectedGender;

    return matchesSearch && matchesBg && matchesGender;
  });

  const handleOpenAdd = () => {
    const nextId = Math.max(...db.patients.map((p) => p.patientId), 100) + 1;
    setFormData({
      patientId: nextId,
      patientName: '',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      phone: '',
      address: '',
      bloodGroup: 'O+',
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({ ...patient });
    setFormError(null);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.phone || !formData.address) {
      setFormError('Please fill in all mandatory attributes.');
      return;
    }
    // Check phone uniqueness
    if (db.patients.some((p) => p.phone === formData.phone)) {
      setFormError('Oracle Constraint Violation: Phone number must be UNIQUE (UQ_PATIENT_PHONE).');
      return;
    }

    const newPatient: Patient = {
      patientId: formData.patientId || Math.max(...db.patients.map((p) => p.patientId)) + 1,
      patientName: formData.patientName.trim(),
      dateOfBirth: formData.dateOfBirth || '1990-01-01',
      gender: formData.gender as any,
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      bloodGroup: formData.bloodGroup as any,
    };

    onAddPatient(newPatient);
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.phone || !formData.address || !editingPatient) {
      setFormError('Please fill in all mandatory attributes.');
      return;
    }
    // Check phone uniqueness against others
    if (db.patients.some((p) => p.phone === formData.phone && p.patientId !== editingPatient.patientId)) {
      setFormError('Oracle Constraint Violation: Phone number must be UNIQUE (UQ_PATIENT_PHONE).');
      return;
    }

    const updated: Patient = {
      ...editingPatient,
      patientName: formData.patientName.trim(),
      dateOfBirth: formData.dateOfBirth || editingPatient.dateOfBirth,
      gender: formData.gender as any,
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      bloodGroup: formData.bloodGroup as any,
    };

    onUpdatePatient(updated);
    setEditingPatient(null);
  };

  const confirmDelete = () => {
    if (deletingPatientId) {
      onDeletePatient(deletingPatientId);
      setDeletingPatientId(null);
      if (viewingPatient?.patientId === deletingPatientId) {
        setViewingPatient(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header & Search Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Patient Registry (PATIENT Entity Table)
          </h2>
          <p className="text-xs text-slate-500">
            Relational master table storing patient demographics with unique phone numbers and blood types
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, phone, or city..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Blood Group:</span>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Types</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Gender:</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-left">Patient ID (PK)</th>
                <th className="py-3 px-4 text-left">Patient Name</th>
                <th className="py-3 px-4 text-left">Date of Birth</th>
                <th className="py-3 px-4 text-left">Gender</th>
                <th className="py-3 px-4 text-left">Blood Group</th>
                <th className="py-3 px-4 text-left">Phone (UK)</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No patients match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const hasActiveAdm = db.admissions.some(
                    (a) => a.patientId === patient.patientId && !a.dischargeDate
                  );
                  return (
                    <tr key={patient.patientId} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {patient.patientId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          {patient.patientName}
                          {hasActiveAdm && (
                            <span className="w-2 h-2 rounded-full bg-rose-500" title="Currently Admitted" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">{patient.dateOfBirth}</td>
                      <td className="py-3 px-4">{patient.gender}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {patient.bloodGroup}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{patient.phone}</td>
                      <td className="py-3 px-4 max-w-[200px] truncate" title={patient.address}>
                        {patient.address}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => setViewingPatient(patient)}
                          title="View clinical history"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(patient)}
                          title="Edit patient"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingPatientId(patient.patientId)}
                          title="Delete patient (Cascades to admissions/records)"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredPatients.length} of {db.patients.length} registered patients</span>
          <span>Constraint: UNIQUE (Phone), CHECK (Gender, Blood_Group)</span>
        </div>
      </div>

      {/* Add / Edit Patient Modal */}
      {(isAddModalOpen || editingPatient) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                {editingPatient ? 'Update Patient Demographics' : 'Register New Patient (PATIENT Entity)'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingPatient(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={editingPatient ? handleSubmitEdit : handleSubmitAdd}
              className="p-5 space-y-4 text-xs"
            >
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Patient ID (Primary Key)
                  </label>
                  <input
                    type="number"
                    disabled
                    value={formData.patientId || ''}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Blood Group (CHECK)
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Full Name (NOT NULL) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.patientName || ''}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Gender (CHECK) *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Phone (UNIQUE) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10 digit contact number"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Residential Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, City, Postal Code"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingPatient(null);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow transition"
                >
                  {editingPatient ? 'Save Changes' : 'Commit to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Clinical History Drawer */}
      {viewingPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-blue-400">PATIENT ID: {viewingPatient.patientId}</span>
                <h3 className="text-base font-bold text-white">{viewingPatient.patientName}</h3>
                <p className="text-xs text-slate-400">
                  {viewingPatient.gender} • DOB: {viewingPatient.dateOfBirth} • Blood: {viewingPatient.bloodGroup}
                </p>
              </div>
              <button
                onClick={() => setViewingPatient(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
              {/* Admissions History */}
              <div>
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Admissions Record (1:N)
                </h4>
                {db.admissions.filter((a) => a.patientId === viewingPatient.patientId).length === 0 ? (
                  <p className="text-slate-400 italic">No admission history.</p>
                ) : (
                  <div className="space-y-2">
                    {db.admissions
                      .filter((a) => a.patientId === viewingPatient.patientId)
                      .map((adm) => {
                        const ward = db.wards.find((w) => w.wardId === adm.wardId);
                        const consultant = db.doctors.find((d) => d.doctorId === adm.consultantId);
                        return (
                          <div
                            key={adm.admissionId}
                            className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1"
                          >
                            <div className="flex justify-between font-semibold text-slate-800">
                              <span>{ward?.wardName}</span>
                              <span className={adm.dischargeDate ? 'text-slate-500' : 'text-rose-600'}>
                                {adm.dischargeDate ? 'Discharged' : 'Active Inpatient'}
                              </span>
                            </div>
                            <div className="text-slate-600">
                              Admitted: {adm.admissionDate} | Discharged: {adm.dischargeDate || 'Present'}
                            </div>
                            <div className="text-slate-600">Consultant: {consultant?.doctorName}</div>
                            <div className="text-slate-700 font-medium">Reason: {adm.admissionReason}</div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Diagnostic Tests History */}
              <div>
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  Medical Diagnostic Tests (TEST_RECORD)
                </h4>
                {db.testRecords.filter((tr) => tr.patientId === viewingPatient.patientId).length === 0 ? (
                  <p className="text-slate-400 italic">No diagnostic test records.</p>
                ) : (
                  <div className="space-y-2">
                    {db.testRecords
                      .filter((tr) => tr.patientId === viewingPatient.patientId)
                      .map((tr) => {
                        const test = db.medicalTests.find((t) => t.testId === tr.testId);
                        const doctor = db.doctors.find((d) => d.doctorId === tr.doctorId);
                        return (
                          <div
                            key={tr.testRecordId}
                            className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/80 space-y-1"
                          >
                            <div className="flex justify-between font-semibold text-slate-800">
                              <span>{test?.testName}</span>
                              <span className="text-amber-700 font-mono">₹{test?.testCost}</span>
                            </div>
                            <div className="text-slate-600">
                              Date: {tr.testDate} | Doctor: {doctor?.doctorName}
                            </div>
                            <div className="text-slate-800 font-medium bg-white p-2 rounded border border-amber-100">
                              Result: {tr.testResult}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Treatments History */}
              <div>
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                  <History className="w-4 h-4 text-emerald-600" />
                  Administered Treatments (TREATMENT_RECORD)
                </h4>
                {db.treatmentRecords.filter((tr) => tr.patientId === viewingPatient.patientId).length === 0 ? (
                  <p className="text-slate-400 italic">No treatments recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {db.treatmentRecords
                      .filter((tr) => tr.patientId === viewingPatient.patientId)
                      .map((tr) => {
                        const treat = db.treatments.find((t) => t.treatmentId === tr.treatmentId);
                        const doctor = db.doctors.find((d) => d.doctorId === tr.doctorId);
                        return (
                          <div
                            key={tr.treatmentRecordId}
                            className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/80 space-y-1"
                          >
                            <div className="flex justify-between font-semibold text-slate-800">
                              <span>{treat?.treatmentName}</span>
                              <span className="text-emerald-700 font-mono">₹{treat?.cost}</span>
                            </div>
                            <div className="text-slate-600">
                              Date: {tr.treatmentDate} | Doctor: {doctor?.doctorName}
                            </div>
                            <div className="text-slate-700">Remarks: {tr.remarks}</div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewingPatient(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPatientId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Confirm Patient Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete Patient ID{' '}
              <strong className="text-slate-900">{deletingPatientId}</strong>?
              <br />
              <br />
              <strong className="text-rose-600">Oracle Referential Action Warning:</strong> The foreign key
              constraint <code className="bg-slate-100 px-1 py-0.5 rounded">ON DELETE CASCADE</code> will
              automatically remove all associated admissions, examinations, test records, and treatment records for this patient.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeletingPatientId(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow"
              >
                Delete & Cascade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
