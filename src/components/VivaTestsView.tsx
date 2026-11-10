import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Camera,
  Terminal,
  Lightbulb,
} from 'lucide-react';
import { VIVA_QUESTIONS, TEST_CASES } from '../data/hospitalData';

export const VivaTestsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'VIVA' | 'TESTS' | 'SCREENSHOTS'>('VIVA');
  const [searchViva, setSearchViva] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({ 1: true, 2: true });

  const categories = ['ALL', 'Core Concepts', 'Keys & Constraints', 'Normalization', 'SQL & Joins', 'Hospital Schema'];

  const filteredViva = VIVA_QUESTIONS.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchViva.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchViva.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || q.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const toggleQuestion = (id: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Viva Voce Preparation & Database Testing Suite
          </h2>
          <p className="text-xs text-slate-500">
            25+ Examiner Questions, Constraint Integrity Validation, and SQL Developer execution steps
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
          <button
            onClick={() => setActiveTab('VIVA')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'VIVA'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Viva Questions (25)
          </button>
          <button
            onClick={() => setActiveTab('TESTS')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'TESTS'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Testing & Verification (8)
          </button>
          <button
            onClick={() => setActiveTab('SCREENSHOTS')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'SCREENSHOTS'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            SQL Screenshot Guide
          </button>
        </div>
      </div>

      {/* Tab 1: Viva Voce Q&A */}
      {activeTab === 'VIVA' && (
        <div className="space-y-4">
          {/* Search & Categories */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchViva}
                onChange={(e) => setSearchViva(e.target.value)}
                placeholder="Search viva question or topic..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Accordion List */}
          <div className="space-y-3">
            {filteredViva.map((v) => {
              const isExpanded = !!expandedQuestions[v.id];
              return (
                <div
                  key={v.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs transition"
                >
                  <div
                    onClick={() => toggleQuestion(v.id)}
                    className="p-4 cursor-pointer flex items-center justify-between hover:bg-slate-50/80 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                        Q{v.id}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{v.question}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {v.category}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 space-y-3 border-t border-slate-100 bg-slate-50/40">
                      <p className="text-slate-700 leading-relaxed">{v.answer}</p>
                      {v.tip && (
                        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-900 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-semibold">Examiner Tip:</strong> {v.tip}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Testing & Verification Table */}
      {activeTab === 'TESTS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              DBMS Experiment 11 – Database Verification & Constraint Test Suite
            </h3>
            <p className="text-slate-500">
              Corresponds to executable tests in <code>database/07_testing_queries.sql</code>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 text-left">Test ID</th>
                  <th className="py-2.5 px-3 text-left">Category</th>
                  <th className="py-2.5 px-3 text-left">Test Case Description</th>
                  <th className="py-2.5 px-3 text-left">Test Input / SQL</th>
                  <th className="py-2.5 px-3 text-left">Expected Result</th>
                  <th className="py-2.5 px-3 text-left">Actual Result</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {TEST_CASES.map((tc) => (
                  <tr key={tc.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{tc.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{tc.category}</td>
                    <td className="py-2.5 px-3 text-slate-900 font-medium">{tc.testCase}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-blue-700 max-w-[180px] truncate" title={tc.input}>
                      {tc.input}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{tc.expectedResult}</td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{tc.actualResult}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px]">
                        <CheckCircle className="w-3 h-3" />
                        {tc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Screenshot Capture Guide */}
      {activeTab === 'SCREENSHOTS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Instructions for Capturing Genuine Screenshots in Oracle SQL Developer & SQL*Plus
            </h3>
            <p className="text-slate-500">
              Academic guidelines to ensure all project report screenshots are authentic and properly labeled.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-700" />
                Method 1: Oracle SQL Developer (GUI)
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 leading-relaxed">
                <li>Launch Oracle SQL Developer and establish a connection to your Oracle database schema (e.g. <code>HR</code> or <code>SYSTEM</code>).</li>
                <li>Open the SQL Worksheet (press <code>Alt + F10</code>).</li>
                <li>To test table creation: Open <code>01_create_tables.sql</code>, select all text, and press <strong>F5</strong> (Run Script). The <em>Script Output</em> panel displays &quot;Table PATIENT created&quot;, etc. Capture this screen.</li>
                <li>To test data insertion: Run <code>02_insert_sample_data.sql</code> with <strong>F5</strong> and verify <code>Commit complete</code>.</li>
                <li>To execute individual queries (e.g. Q11, Q21): Place cursor on the query and press <strong>F9</strong> (Run Statement). Capture the formatted <strong>Query Result</strong> data grid showing columns and multiple rows.</li>
              </ol>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-700" />
                Method 2: Command Line (SQL*Plus)
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 leading-relaxed">
                <li>Open your OS terminal or command prompt.</li>
                <li>Connect using: <code>sqlplus username/password@localhost:1521/XEPDB1</code></li>
                <li>Format output formatting for clean column alignments:
                  <pre className="bg-slate-900 text-emerald-400 p-2 rounded mt-1 font-mono text-[11px]">
                    SET LINESIZE 150;{'\n'}SET PAGESIZE 50;
                  </pre>
                </li>
                <li>Run script files directly using <code>@</code>:
                  <pre className="bg-slate-900 text-emerald-400 p-2 rounded mt-1 font-mono text-[11px]">
                    @database/01_create_tables.sql{'\n'}@database/02_insert_sample_data.sql{'\n'}@database/06_advanced_queries.sql
                  </pre>
                </li>
                <li>Capture terminal screenshots with <code>PrintScreen</code> or OS Snipping Tool.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
