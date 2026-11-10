import React, { useState } from 'react';
import {
  Building2,
  Bed,
  Calendar,
  UserPlus,
  CheckCircle,
  Clock,
  LogOut,
  X,
  AlertTriangle,
  Stethoscope,
  Building,
  UserCheck,
} from 'lucide-react';
import { Admission, HospitalDatabase } from '../types/hospital';

interface WardsAdmissionsViewProps {
  db: HospitalDatabase;
  onAdmitPatient: (admission: Admission) => void;
  onDischargePatient: (admissionId: number, dischargeDate: string) => void;
  isAdmitModalOpen: boolean;
  setIsAdmitModalOpen: (open: boolean) => void;
}

export const WardsAdmissionsView: React.FC<WardsAdmissionsViewProps> = ({
  db,
  onAdmitPatient,
  onDischargePatient,
  isAdmitModalOpen,
  setIsAdmitModalOpen,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'DISCHARGED'>('ACTIVE');
  const [selectedWardFilter, setSelectedWardFilter] = useState<number | 'ALL'>('ALL');

  // Admit form state
  const [formData, setFormData] = useState<Partial<Admission>>({
    patientId: db.patients[0]?.patientId || 101,
    wardId: db.wards[0]?.wardId || 1,
    gpId: db.gps[0]?.gpId || 301,
    consultantId: db.doctors[0]?.doctorId || 201,
    admissionDate: new Date().toISOString().split('T')[0],
    admissionReason: '',
  });
  const [admitError, setAdmitError] = useState<string | null>(null);

  // Discharge modal state
  const [dischargingAdmissionId, setDischargingAdmissionId] = useState<number | null>(null);
  const [dischargeDate, setDischargeDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const activeAdmissions = db.admissions.filter((a) => !a.dischargeDate);

  // Filter admissions
  const filteredAdmissions = db.admissions.filter((a) => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && !a.dischargeDate) ||
      (filterStatus === 'DISCHARGED' && a.dischargeDate);

    const matchesWard = selectedWardFilter === 'ALL' || a.wardId === selectedWardFilter;

    return matchesStatus && matchesWard;
  });

  const handleOpenAdmit = () => {
    const nextId = Math.max(...db.admissions.map((a) => a.admissionId), 400) + 1;
    setFormData({
      admissionId: nextId,
      patientId: db.patients[0]?.patientId || 101,
      wardId: db.wards[0]?.wardId || 1,
      gpId: db.gps[0]?.gpId || 301,
      consultantId: db.doctors[0]?.doctorId || 201,
      admissionDate: new Date().toISOString().split('T')[0],
      admissionReason: '',
    });
    setAdmitError(null);
    setIsAdmitModalOpen(true);
  };

  const handleSubmitAdmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.wardId || !formData.consultantId || !formData.gpId || !formData.admissionReason) {
      setAdmitError('Please complete all admission fields.');
      return;
    }

    // Check ward capacity
    const ward = db.wards.find((w) => w.wardId === formData.wardId);
    const activeInWard = activeAdmissions.filter((a) => a.wardId === formData.wardId).length;
    if (ward && activeInWard >= ward.capacity) {
      setAdmitError(`Ward Capacity Exceeded: ${ward.wardName} is at full capacity (${ward.capacity} beds).`);
      return;
    }

    const nextId = Math.max(...db.admissions.map((a) => a.admissionId), 400) + 1;
    const newAdm: Admission = {
      admissionId: formData.admissionId || nextId,
      patientId: Number(formData.patientId),
      wardId: Number(formData.wardId),
      gpId: Number(formData.gpId),
      consultantId: Number(formData.consultantId),
      admissionDate: formData.admissionDate || new Date().toISOString().split('T')[0],
      dischargeDate: null,
      admissionReason: formData.admissionReason.trim(),
    };

    onAdmitPatient(newAdm);
    setIsAdmitModalOpen(false);
  };

  const handleConfirmDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    if (dischargingAdmissionId) {
      const adm = db.admissions.find((a) => a.admissionId === dischargingAdmissionId);
      if (adm && dischargeDate < adm.admissionDate) {
        alert('Oracle Check Constraint (CHK_ADM_DISCHARGE): Discharge Date cannot be earlier than Admission Date.');
        return;
      }
      onDischargePatient(dischargingAdmissionId, dischargeDate);
      setDischargingAdmissionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Ward Operations & Inpatient Admissions
          </h2>
          <p className="text-xs text-slate-500">
            Enforces bed allocation limits and links patients, wards, lead consultants, and GP referrals
          </p>
        </div>

        <button
          onClick={handleOpenAdmit}
          className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Admit New Patient</span>
        </button>
      </div>

      {/* Ward Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {db.wards.map((ward) => {
          const currentCount = activeAdmissions.filter((a) => a.wardId === ward.wardId).length;
          const available = ward.capacity - currentCount;
          const pct = Math.round((currentCount / ward.capacity) * 100);

          return (
            <div
              key={ward.wardId}
              onClick={() => setSelectedWardFilter(ward.wardId === selectedWardFilter ? 'ALL' : ward.wardId)}
              className={`p-4 rounded-xl border transition cursor-pointer ${
                selectedWardFilter === ward.wardId
                  ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    WARD ID: {ward.wardId}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 mt-1">{ward.wardName}</h3>
                  <span className="text-xs text-slate-500">{ward.wardType} • {ward.location}</span>
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    pct >= 25 ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <Bed className="w-4 h-4" />
                </div>
              </div>

              {/* Bed meter */}
              <div className="mt-4 space-y-1 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-600">Current Occupancy:</span>
                  <span className="text-slate-900 font-bold">
                    {currentCount} / {ward.capacity} Beds ({available} available)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pct >= 25 ? 'bg-rose-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.max(5, pct)}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{selectedWardFilter === ward.wardId ? 'Filtered' : 'Click to filter list'}</span>
                <span className="font-semibold text-slate-700">{pct}% Occupied</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admissions Management Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Admissions Register (ADMISSION Table)
            </h3>
            <p className="text-slate-500">
              Foreign Keys: Patient_ID, Ward_ID, GP_ID, Consultant_ID (Doctor)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
              {(['ACTIVE', 'DISCHARGED', 'ALL'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 font-medium transition ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {status === 'ACTIVE'
                    ? `Active (${activeAdmissions.length})`
                    : status === 'DISCHARGED'
                    ? `Discharged (${db.admissions.length - activeAdmissions.length})`
                    : `All (${db.admissions.length})`}
                </button>
              ))}
            </div>

            {selectedWardFilter !== 'ALL' && (
              <button
                onClick={() => setSelectedWardFilter('ALL')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-medium"
              >
                Clear Ward Filter ✕
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3 text-left">Adm ID</th>
                <th className="py-2.5 px-3 text-left">Patient</th>
                <th className="py-2.5 px-3 text-left">Ward</th>
                <th className="py-2.5 px-3 text-left">Consultant Doctor</th>
                <th className="py-2.5 px-3 text-left">Referring GP</th>
                <th className="py-2.5 px-3 text-left">Admission Date</th>
                <th className="py-2.5 px-3 text-left">Discharge Date</th>
                <th className="py-2.5 px-3 text-left">Admission Reason</th>
                <th className="py-2.5 px-3 text-right">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No admission records match current filters.
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((adm) => {
                  const patient = db.patients.find((p) => p.patientId === adm.patientId);
                  const ward = db.wards.find((w) => w.wardId === adm.wardId);
                  const consultant = db.doctors.find((d) => d.doctorId === adm.consultantId);
                  const gp = db.gps.find((g) => g.gpId === adm.gpId);
                  const isActive = !adm.dischargeDate;

                  return (
                    <tr key={adm.admissionId} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                        {adm.admissionId}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {patient?.patientName || `ID ${adm.patientId}`}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-medium">
                          {ward?.wardName}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">{consultant?.doctorName}</td>
                      <td className="py-2.5 px-3">
                        <span title={gp?.clinicName}>{gp?.gpName}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{adm.admissionDate}</td>
                      <td className="py-2.5 px-3 font-mono">
                        {adm.dischargeDate ? (
                          adm.dischargeDate
                        ) : (
                          <span className="text-rose-600 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Inpatient
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 max-w-xs truncate" title={adm.admissionReason}>
                        {adm.admissionReason}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {isActive ? (
                          <button
                            onClick={() => {
                              setDischargingAdmissionId(adm.admissionId);
                              setDischargeDate(new Date().toISOString().split('T')[0]);
                            }}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold border border-rose-200 transition"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Discharge</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-[11px]">
                            Discharged
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admit Patient Modal */}
      {isAdmitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                Admit Patient to Ward (ADMISSION Table)
              </h3>
              <button
                onClick={() => setIsAdmitModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdmit} className="p-5 space-y-4 text-xs">
              {admitError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{admitError}</span>
                </div>
              )}

              {/* Patient Selection */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Select Patient (FK: Patient_ID) *
                </label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  {db.patients.map((p) => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.patientName} (ID: {p.patientId}, Blood: {p.bloodGroup})
                    </option>
                  ))}
                </select>
              </div>

              {/* Ward Selection */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Allocated Ward (FK: Ward_ID) *
                </label>
                <select
                  required
                  value={formData.wardId}
                  onChange={(e) => setFormData({ ...formData, wardId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  {db.wards.map((w) => {
                    const currentIn = activeAdmissions.filter((a) => a.wardId === w.wardId).length;
                    return (
                      <option key={w.wardId} value={w.wardId}>
                        {w.wardName} — {currentIn}/{w.capacity} beds occupied
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Consultant Doctor Selection */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Lead Consultant (FK: Consultant_ID - Doctor) *
                </label>
                <select
                  required
                  value={formData.consultantId}
                  onChange={(e) => setFormData({ ...formData, consultantId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  {db.doctors.map((d) => (
                    <option key={d.doctorId} value={d.doctorId}>
                      {d.doctorName} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              {/* GP Selection */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Referring General Practitioner (FK: GP_ID) *
                </label>
                <select
                  required
                  value={formData.gpId}
                  onChange={(e) => setFormData({ ...formData, gpId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  {db.gps.map((g) => (
                    <option key={g.gpId} value={g.gpId}>
                      {g.gpName} ({g.clinicName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Admission Date */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Admission Date (NOT NULL) *
                </label>
                <input
                  type="date"
                  required
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Admitting Reason / Clinical Complaint *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.admissionReason || ''}
                  onChange={(e) => setFormData({ ...formData, admissionReason: e.target.value })}
                  placeholder="e.g. Acute Coronary Syndrome evaluation"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAdmitModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow transition"
                >
                  Admit Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discharge Patient Modal */}
      {dischargingAdmissionId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 space-y-4 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <LogOut className="w-4 h-4 text-rose-600" />
              Discharge Inpatient
            </h3>
            <p className="text-xs text-slate-600">
              Record discharge date for Admission ID <strong>{dischargingAdmissionId}</strong>.
              This will update <code className="bg-slate-100 px-1 py-0.5 rounded">Discharge_Date</code> in Oracle ADMISSION table and free the ward bed.
            </p>
            <form onSubmit={handleConfirmDischarge} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Discharge Date:
                </label>
                <input
                  type="date"
                  required
                  value={dischargeDate}
                  onChange={(e) => setDischargeDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDischargingAdmissionId(null)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold shadow"
                >
                  Confirm Discharge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
