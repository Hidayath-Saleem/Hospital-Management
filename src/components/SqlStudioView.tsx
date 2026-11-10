import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  Download,
  Filter,
  Sparkles,
  Clock,
  Database,
  Info,
  Code,
  FileSpreadsheet,
} from 'lucide-react';
import { HospitalDatabase, QueryDefinition } from '../types/hospital';
import { QUERIES } from '../data/hospitalData';
import { executeHospitalQuery, executeCustomQuery, QueryResult } from '../data/sqlEngine';

interface SqlStudioViewProps {
  db: HospitalDatabase;
  selectedQueryId?: number;
  onSelectQueryId?: (id: number) => void;
}

export const SqlStudioView: React.FC<SqlStudioViewProps> = ({
  db,
  selectedQueryId = 1,
  onSelectQueryId,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [currentQueryId, setCurrentQueryId] = useState<number>(selectedQueryId);
  const [customSql, setCustomSql] = useState<string>(
    QUERIES.find((q) => q.id === selectedQueryId)?.sql || QUERIES[0].sql
  );
  const [queryResult, setQueryResult] = useState<QueryResult>(() =>
    executeHospitalQuery(selectedQueryId, db)
  );
  const [copied, setCopied] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);

  const categories = [
    'ALL',
    'Basic',
    'Where & Order By',
    'Joins',
    'Aggregate Functions',
    'Advanced Queries',
  ];

  const filteredQueries = QUERIES.filter(
    (q) => activeCategory === 'ALL' || q.category === activeCategory
  );

  const activeDef = QUERIES.find((q) => q.id === currentQueryId) || QUERIES[0];

  const handleSelectQuery = (q: QueryDefinition) => {
    setCurrentQueryId(q.id);
    if (onSelectQueryId) onSelectQueryId(q.id);
    setCustomSql(q.sql);
    setIsCustomMode(false);
    const res = executeHospitalQuery(q.id, db);
    setQueryResult(res);
  };

  const handleRunQuery = () => {
    if (isCustomMode) {
      const res = executeCustomQuery(customSql, db);
      setQueryResult(res);
    } else {
      const res = executeHospitalQuery(currentQueryId, db);
      setQueryResult(res);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(customSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    if (!queryResult || queryResult.rows.length === 0) return;
    const headerLine = queryResult.columns.join(',');
    const rowLines = queryResult.rows.map((row) =>
      row.map((val) => (typeof val === 'string' && val.includes(',') ? `"${val}"` : val)).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headerLine, ...rowLines].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `query_q${currentQueryId}_result.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-600" />
            Oracle SQL Query Execution Studio
          </h2>
          <p className="text-xs text-slate-500">
            26 comprehensive DBMS Experiment 11 queries covering Basic, Joins, Aggregation, HAVING, and Subqueries
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Query List on Left, Editor & Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 26 Query Navigator */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Queries ({filteredQueries.length} of 26)
            </span>
            <span className="text-[11px] text-slate-500">Click to load</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {filteredQueries.map((q) => {
              const isSelected = q.id === currentQueryId;
              return (
                <div
                  key={q.id}
                  onClick={() => handleSelectQuery(q)}
                  className={`p-3 rounded-lg cursor-pointer transition text-xs ${
                    isSelected
                      ? 'bg-blue-50 border border-blue-300 text-blue-900 shadow-sm'
                      : 'hover:bg-slate-50 border border-transparent text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-blue-600 text-[11px]">
                      Q{q.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {q.category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 line-clamp-1">{q.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{q.question}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: SQL Editor & Output */}
        <div className="lg:col-span-8 space-y-4">
          {/* Query Info Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Query {activeDef.id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    Category: {activeDef.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{activeDef.title}</h3>
                <p className="text-xs text-slate-600">{activeDef.question}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopySql}
                  title="Copy SQL statement"
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs flex items-center gap-1 font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleRunQuery}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute SQL</span>
                </button>
              </div>
            </div>

            {/* DBMS Concepts Explanation Badge */}
            <div className="mt-2 p-2.5 rounded-lg bg-blue-50/60 border border-blue-200/60 text-xs text-blue-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">DBMS Concepts Applied:</strong> {activeDef.concepts}
              </div>
            </div>
          </div>

          {/* Interactive SQL Editor */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden text-xs">
            <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-slate-400">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-[11px] text-slate-300">Oracle SQL Editor</span>
                {isCustomMode && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Custom Query Mode
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500">Edit or type any query</span>
            </div>
            <textarea
              value={customSql}
              onChange={(e) => {
                setCustomSql(e.target.value);
                setIsCustomMode(true);
              }}
              rows={5}
              className="w-full bg-slate-900 text-emerald-400 font-mono p-4 text-xs focus:outline-none resize-y selection:bg-blue-600 selection:text-white"
            />
          </div>

          {/* Query Results Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-4">
            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-blue-600" />
                  Query Results Grid
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-600 font-semibold">
                  {queryResult.rowCount} {queryResult.rowCount === 1 ? 'row' : 'rows'} returned
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {queryResult.executionTimeMs} ms
                </span>
              </div>

              <button
                onClick={handleExportCsv}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>
            </div>

            {queryResult.error ? (
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {queryResult.error}
              </div>
            ) : queryResult.rows.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No rows returned by query.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50 sticky top-0 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      {queryResult.columns.map((col, idx) => (
                        <th key={idx} className="py-2.5 px-3 text-left font-mono">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    {queryResult.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/80 transition">
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="py-2 px-3 whitespace-nowrap">
                            {val === null || val === undefined ? (
                              <span className="text-slate-400 italic">NULL</span>
                            ) : typeof val === 'number' && val > 999 && !String(val).includes('.') ? (
                              val.toLocaleString()
                            ) : (
                              String(val)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
