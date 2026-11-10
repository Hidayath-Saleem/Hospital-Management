import React, { useState } from 'react';
import {
  Stethoscope,
  Building,
  Phone,
  Mail,
  Search,
  UserCheck,
  Activity,
  Award,
} from 'lucide-react';
import { HospitalDatabase } from '../types/hospital';

interface DoctorsViewProps {
  db: HospitalDatabase;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({ db }) => {
  const [activeTab, setActiveTab] = useState<'DOCTORS' | 'GPS'>('DOCTORS');
  const [searchTerm, setSearchTerm] = useState('');
  const [specFilter, setSpecFilter] = useState('ALL');

  const specializations = Array.from(new Set(db.doctors.map((d) => d.specialization)));

  const filteredDoctors = db.doctors.filter((d) => {
    const matchesSearch =
      d.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = specFilter === 'ALL' || d.specialization === specFilter;
    return matchesSearch && matchesSpec;
  });

  const filteredGps = db.gps.filter((g) =>
    g.gpName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.clinicName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Medical Staff & General Practitioner Directory
          </h2>
          <p className="text-xs text-slate-500">
            DOCTOR and GP relational tables tracking credentials, sub-specialties, and referral clinics
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
          <button
            onClick={() => setActiveTab('DOCTORS')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'DOCTORS'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Hospital Doctors ({db.doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('GPS')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'GPS'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            General Practitioners ({db.gps.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === 'DOCTORS'
                ? 'Search doctor by name, specialty, email...'
                : 'Search GP by name or clinic...'
            }
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {activeTab === 'DOCTORS' && (
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Specialization:</span>
            <select
              value={specFilter}
              onChange={(e) => setSpecFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeTab === 'DOCTORS' ? (
        /* Doctors Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => {
            const activeConsults = db.admissions.filter(
              (a) => a.consultantId === doc.doctorId && !a.dischargeDate
            ).length;
            const totalExams = db.examinations.filter((e) => e.doctorId === doc.doctorId).length;
            const totalTests = db.testRecords.filter((t) => t.doctorId === doc.doctorId).length;

            return (
              <div
                key={doc.doctorId}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      DOC ID: {doc.doctorId}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{doc.doctorName}</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      <Award className="w-3 h-3" /> {doc.specialization}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{doc.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono truncate">{doc.email}</span>
                  </div>
                </div>

                {/* Workload statistics */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-xs text-slate-400 block font-medium">Inpatients</span>
                    <span className="text-sm font-bold text-slate-800">{activeConsults}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-xs text-slate-400 block font-medium">Exams</span>
                    <span className="text-sm font-bold text-slate-800">{totalExams}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-xs text-slate-400 block font-medium">Tests</span>
                    <span className="text-sm font-bold text-slate-800">{totalTests}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* GPs Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGps.map((gp) => {
            const totalReferrals = db.admissions.filter((a) => a.gpId === gp.gpId).length;
            return (
              <div
                key={gp.gpId}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:border-indigo-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      GP ID: {gp.gpId}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{gp.gpName}</h3>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-indigo-500" /> {gp.clinicName}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <Building className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{gp.phone}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Hospital Referrals:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                    {totalReferrals} Admissions Referred
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
