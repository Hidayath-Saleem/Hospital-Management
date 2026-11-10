import React from 'react';
import {
  Activity,
  Database,
  RotateCcw,
  Download,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onResetDb: () => void;
  onExportSql: () => void;
  patientCount: number;
  admittedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onResetDb,
  onExportSql,
  patientCount,
  admittedCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                General Hospital Management System
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Experiment 11 – DBMS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Oracle SQL Relational Database • ER Modeling • Normalization (3NF) • 26 Benchmark Queries
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Demonstration Mode Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Database className="w-3.5 h-3.5" />
            <span className="font-medium">Oracle SQL Engine (Demonstration Mode)</span>
          </div>

          <button
            onClick={onResetDb}
            title="Reset database to seed records"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>

          <button
            onClick={onExportSql}
            title="Download Oracle SQL Scripts"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SQL</span>
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none text-xs sm:text-sm">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'patients', label: `Patients (${patientCount})` },
            { id: 'admissions', label: `Wards & Admissions (${admittedCount} Active)` },
            { id: 'doctors', label: 'Doctors & Staff' },
            { id: 'records', label: 'Medical Records' },
            { id: 'sql', label: 'SQL Query Studio (26 Queries)' },
            { id: 'er', label: 'ER Diagram & Schema' },
            { id: 'normalization', label: 'Normalization & Report' },
            { id: 'viva', label: 'Viva Prep & Tests' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
