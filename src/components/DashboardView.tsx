import React from 'react';
import {
  Users,
  UserCheck,
  Building2,
  Stethoscope,
  FlaskConical,
  HeartHandshake,
  Activity,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Bed,
} from 'lucide-react';
import { HospitalDatabase } from '../types/hospital';

interface DashboardViewProps {
  db: HospitalDatabase;
  setActiveTab: (tab: string) => void;
  onSelectQuery: (queryId: number) => void;
  onOpenAdmitModal: () => void;
  onOpenPatientModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  db,
  setActiveTab,
  onSelectQuery,
  onOpenAdmitModal,
  onOpenPatientModal,
}) => {
  const totalPatients = db.patients.length;
  const totalDoctors = db.doctors.length;
  const totalWards = db.wards.length;
  const activeAdmissions = db.admissions.filter((a) => !a.dischargeDate);
  const totalTests = db.medicalTests.length;
  const totalTreatments = db.treatments.length;

  // Calculate ward occupancy
  const wardOccupancies = db.wards.map((ward) => {
    const admittedCount = activeAdmissions.filter((a) => a.wardId === ward.wardId).length;
    const occupancyRate = Math.round((admittedCount / ward.capacity) * 100);
    return {
      ...ward,
      admittedCount,
      occupancyRate,
    };
  });

  return (
    <div className="space-y-6">
      {/* Hero / Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            title: 'Total Patients',
            value: totalPatients,
            icon: Users,
            color: 'bg-blue-500/10 text-blue-600 border-blue-200',
            tab: 'patients',
          },
          {
            title: 'Total Doctors',
            value: totalDoctors,
            icon: Stethoscope,
            color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
            tab: 'doctors',
          },
          {
            title: 'Total Wards',
            value: totalWards,
            icon: Building2,
            color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
            tab: 'admissions',
          },
          {
            title: 'Current Inpatients',
            value: activeAdmissions.length,
            icon: UserCheck,
            color: 'bg-rose-500/10 text-rose-600 border-rose-200',
            tab: 'admissions',
          },
          {
            title: 'Medical Tests',
            value: totalTests,
            icon: FlaskConical,
            color: 'bg-amber-500/10 text-amber-600 border-amber-200',
            tab: 'records',
          },
          {
            title: 'Treatments',
            value: totalTreatments,
            icon: HeartHandshake,
            color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
            tab: 'records',
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => setActiveTab(stat.tab)}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{stat.title}</span>
                <div className={`p-2 rounded-lg border ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-800 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs text-blue-600 group-hover:translate-x-0.5 transition flex items-center">
                  View <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Row: Ward Capacity Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ward Bed Occupancy Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Bed className="w-5 h-5 text-blue-600" />
                Ward Bed Occupancy Status (Active Inpatients)
              </h2>
              <p className="text-xs text-slate-500">
                Monitored against maximum bed capacity defined in Oracle WARD table
              </p>
            </div>
            <button
              onClick={() => setActiveTab('admissions')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              Manage Admissions <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {wardOccupancies.map((w) => {
              const isHigh = w.occupancyRate >= 25;
              return (
                <div key={w.wardId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-700">{w.wardName}</span>
                      <span className="text-slate-400">({w.wardType})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-600">
                        {w.admittedCount} / {w.capacity} beds
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                          w.occupancyRate > 20
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {w.occupancyRate}%
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        w.occupancyRate > 20 ? 'bg-rose-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.max(8, w.occupancyRate)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Normal Occupancy
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> High Utilization
            </span>
            <span>Total Hospital Bed Capacity: {db.wards.reduce((a, b) => a + b.capacity, 0)} beds</span>
          </div>
        </div>

        {/* Quick Operations & Benchmark Queries */}
        <div className="space-y-4">
          {/* Quick Operations Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Quick Clinical Actions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Execute hospital transactional procedures
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={onOpenAdmitModal}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition"
              >
                <span>+ Admit New Patient (Create Admission)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenPatientModal}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-600 transition"
              >
                <span>+ Register New Patient (Master Table)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('sql')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-600 transition"
              >
                <span>Open SQL Query Studio (26 Queries)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Academic Highlights */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 space-y-2.5">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              DBMS Experiment 11 Highlights
            </h4>
            <ul className="text-xs text-blue-800 space-y-1.5">
              <li>• 10 Normalized 3NF Entities with zero redundancy.</li>
              <li>• 2 Junction Tables resolving M:N (Tests & Treatments).</li>
              <li>• 26 Complete Oracle SQL Queries with verified results.</li>
              <li>• Enforced PK, FK (CASCADE), and CHECK constraints.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Currently Admitted Patients Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-500" />
              Active Inpatients ({activeAdmissions.length} Currently Admitted)
            </h3>
            <p className="text-xs text-slate-500">
              Patients currently occupying beds where Discharge_Date IS NULL (Query 25)
            </p>
          </div>
          <button
            onClick={() => onSelectQuery(25)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold hover:bg-blue-100 transition"
          >
            Run SQL Q25 (Active Inpatients)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3 text-left">Adm ID</th>
                <th className="py-2.5 px-3 text-left">Patient Name</th>
                <th className="py-2.5 px-3 text-left">Ward</th>
                <th className="py-2.5 px-3 text-left">Lead Consultant</th>
                <th className="py-2.5 px-3 text-left">Admitted Date</th>
                <th className="py-2.5 px-3 text-left">Admitting Diagnosis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {activeAdmissions.slice(0, 6).map((adm) => {
                const patient = db.patients.find((p) => p.patientId === adm.patientId);
                const ward = db.wards.find((w) => w.wardId === adm.wardId);
                const doc = db.doctors.find((d) => d.doctorId === adm.consultantId);
                return (
                  <tr key={adm.admissionId} className="hover:bg-slate-50/80 transition">
                    <td className="py-2 px-3 font-mono font-medium text-slate-900">
                      ADM-{adm.admissionId}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      {patient?.patientName || 'Unknown'}
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-700">
                        {ward?.wardName || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-2 px-3">{doc?.doctorName || 'Unknown'}</td>
                    <td className="py-2 px-3 font-mono">{adm.admissionDate}</td>
                    <td className="py-2 px-3 text-slate-700">{adm.admissionReason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
