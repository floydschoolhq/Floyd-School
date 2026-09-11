import React, { useState } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Download,
  Check,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import api from '../api/axios';

export default function ImportWizard() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState('');

  // Handle file select
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError('');
    }
  };

  // Upload and parse preview
  const handleUploadPreview = async () => {
    if (!file) {
      setError('Please select a spreadsheet file (.xlsx, .xls, .csv)');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/offline-admin/students/import-preview', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPreviewData(res.data);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to parse spreadsheet');
    } finally {
      setLoading(false);
    }
  };

  // Confirm import and create students
  const handleConfirmImport = async () => {
    if (!previewData || !previewData.rows) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/offline-admin/students/import-confirm', {
        rows: previewData.rows
      });
      setImportResult(res.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to commit student import');
    } finally {
      setLoading(false);
    }
  };

  // Download Sample Template CSV
  const handleDownloadTemplate = () => {
    const headers = 'Student Name,School Code,Class,Section,Father Name,Student Mobile,Father Mobile,Email,Batch Code\n';
    const sampleRow1 = 'Aarav Sharma,DPS001,10,A,Rajesh Sharma,9876543210,9876543211,aarav.sharma@example.com,DPS-AI-B01\n';
    const sampleRow2 = 'Diya Patel,DPS001,10,B,Kiran Patel,9876543212,9876543213,,DPS-AI-B01\n';
    const blob = new Blob([headers + sampleRow1 + sampleRow2], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'floyd_school_student_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Download Credentials Report CSV
  const handleDownloadCredentials = () => {
    if (!importResult || !importResult.credentialsReport) return;
    const headers = 'Student Name,Student ID,Login ID,Temporary Password,School,Batch,Grade,Section\n';
    const rows = importResult.credentialsReport.map(r =>
      `"${r.studentName}","${r.studentId}","${r.loginId}","${r.temporaryPassword}","${r.school}","${r.batch}","${r.grade}","${r.section}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `floyd_credentials_report_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Bulk Student Onboarding Wizard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Spreadsheet ingestion, duplicate verification, permanent Floyd Student ID generation, and credential issuance.
          </p>
        </div>
        <button
          onClick={handleDownloadTemplate}
          className="btn-secondary"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Download Standard CSV Template</span>
        </button>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`p-3 rounded-md border text-xs font-semibold flex items-center gap-2 ${
          step >= 1 ? 'bg-blue-950/40 border-blue-500/40 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-500'
        }`}>
          <span className="w-5 h-5 rounded-full bg-blue-600/30 flex items-center justify-center font-mono text-[10px]">1</span>
          <span>Upload Spreadsheet</span>
        </div>
        <div className={`p-3 rounded-md border text-xs font-semibold flex items-center gap-2 ${
          step >= 2 ? 'bg-blue-950/40 border-blue-500/40 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-500'
        }`}>
          <span className="w-5 h-5 rounded-full bg-blue-600/30 flex items-center justify-center font-mono text-[10px]">2</span>
          <span>Validation & Duplicates</span>
        </div>
        <div className={`p-3 rounded-md border text-xs font-semibold flex items-center gap-2 ${
          step >= 3 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
        }`}>
          <span className="w-5 h-5 rounded-full bg-emerald-600/30 flex items-center justify-center font-mono text-[10px]">3</span>
          <span>Credential Distribution</span>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Upload File */}
      {step === 1 && (
        <div className="admin-card p-8 text-center bg-slate-900/50 border-slate-800">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Select Student Roster File</h3>
              <p className="text-xs text-slate-400 mt-1">
                Upload .xlsx, .xls, or .csv containing student details, school codes, and optional batch codes.
              </p>
            </div>

            <div className="pt-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>{file ? file.name : 'Choose File from Computer'}</span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {file && (
              <p className="text-xs text-emerald-400 font-mono">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}

            <div className="pt-4">
              <button
                onClick={handleUploadPreview}
                disabled={!file || loading}
                className="btn-primary w-full justify-center py-2.5 disabled:opacity-50"
              >
                {loading ? 'Analyzing Spreadsheet...' : 'Analyze & Validate Records'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Preview & Validation */}
      {step === 2 && previewData && (
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-4 gap-3">
            <div className="admin-card p-3.5 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Total Ingested</p>
              <p className="text-xl font-bold text-slate-100 mt-1">{previewData.summary?.totalRows || 0}</p>
            </div>
            <div className="admin-card p-3.5 text-center border-emerald-500/20 bg-emerald-950/20">
              <p className="text-[10px] text-emerald-400 uppercase font-mono">Valid Records</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">{previewData.summary?.validCount || 0}</p>
            </div>
            <div className="admin-card p-3.5 text-center border-rose-500/20 bg-rose-950/20">
              <p className="text-[10px] text-rose-400 uppercase font-mono">Invalid Rows</p>
              <p className="text-xl font-bold text-rose-400 mt-1">{previewData.summary?.invalidCount || 0}</p>
            </div>
            <div className="admin-card p-3.5 text-center border-amber-500/20 bg-amber-950/20">
              <p className="text-[10px] text-amber-400 uppercase font-mono">Duplicates</p>
              <p className="text-xl font-bold text-amber-400 mt-1">{previewData.summary?.duplicateCount || 0}</p>
            </div>
          </div>

          {/* Table Preview */}
          <div className="admin-card overflow-hidden">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between text-xs bg-slate-900/60">
              <span className="font-semibold text-slate-200">Validation Breakdown (Row-by-Row)</span>
              <span className="text-slate-400 font-mono">Only valid rows will be provisioned</span>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Status</th>
                    <th>Student Name</th>
                    <th>School Code</th>
                    <th>Batch</th>
                    <th>Grade/Sec</th>
                    <th>Guardian</th>
                    <th>Errors / Warnings</th>
                  </tr>
                </thead>
                <tbody>
                  {(previewData.rows || []).map((r, idx) => (
                    <tr key={idx} className={r.isValid ? '' : 'bg-rose-950/20'}>
                      <td className="font-mono text-slate-400">{r.rowNumber}</td>
                      <td>
                        {r.isValid ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                            <Check className="w-3 h-3" /> Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                            <AlertCircle className="w-3 h-3" /> Invalid
                          </span>
                        )}
                      </td>
                      <td className="font-semibold text-slate-200">{r.data.name || '—'}</td>
                      <td className="font-mono text-blue-400">{r.data.schoolCode || '—'}</td>
                      <td className="font-mono text-slate-300">{r.data.batchCode || 'Unassigned'}</td>
                      <td>{r.data.grade} - {r.data.section || 'A'}</td>
                      <td className="text-xs text-slate-400">{r.data.fatherName || '—'}</td>
                      <td className="text-xs">
                        {r.errors && r.errors.length > 0 && (
                          <div className="text-rose-400 space-y-0.5">
                            {r.errors.map((err, eIdx) => <p key={eIdx}>❌ {err}</p>)}
                          </div>
                        )}
                        {r.warnings && r.warnings.length > 0 && (
                          <div className="text-amber-400 space-y-0.5">
                            {r.warnings.map((w, wIdx) => <p key={wIdx}>⚠ {w}</p>)}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => { setStep(1); setFile(null); }}
              className="btn-secondary text-xs"
            >
              Upload Different File
            </button>
            <button
              onClick={handleConfirmImport}
              disabled={loading || (previewData.summary?.validCount || 0) === 0}
              className="btn-primary text-xs disabled:opacity-50"
            >
              {loading ? 'Provisioning Students in Database...' : `Commit & Provision ${previewData.summary?.validCount || 0} Students`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Success & Download Credentials */}
      {step === 3 && importResult && (
        <div className="admin-card p-8 bg-slate-900/60 border-slate-800 space-y-6">
          <div className="text-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Import Committed Successfully!</h3>
            <p className="text-xs text-slate-400">
              Provisioned <strong className="text-slate-200">{importResult.count}</strong> students with permanent Floyd Student IDs, assigned schools, batches, and hashed credentials in MongoDB Atlas.
            </p>
          </div>

          <div className="p-4 rounded-md bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
            <strong>Security Notice:</strong> Temporary passwords are provided exclusively in the report below. For data security, passwords are stored in MongoDB as bcrypt hashes and will not be displayed again.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleDownloadCredentials}
              className="btn-primary py-2.5 px-6 text-xs font-semibold shadow-lg shadow-blue-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Credentials Report (CSV)</span>
            </button>
            <button
              onClick={() => {
                setStep(1);
                setFile(null);
                setPreviewData(null);
                setImportResult(null);
              }}
              className="btn-secondary text-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Import Another Spreadsheet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
