import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_DATABASE, QUERIES } from './hospitalData';
import { executeHospitalQuery } from './sqlEngine';

test('Initial database contains required minimum row counts', () => {
  assert.equal(INITIAL_DATABASE.patients.length >= 15, true, 'At least 15 patients required');
  assert.equal(INITIAL_DATABASE.wards.length >= 6, true, 'At least 6 wards required');
  assert.equal(INITIAL_DATABASE.doctors.length >= 10, true, 'At least 10 doctors required');
  assert.equal(INITIAL_DATABASE.gps.length >= 5, true, 'At least 5 GPs required');
  assert.equal(INITIAL_DATABASE.admissions.length >= 20, true, 'At least 20 admissions required');
  assert.equal(INITIAL_DATABASE.examinations.length >= 20, true, 'At least 20 examinations required');
  assert.equal(INITIAL_DATABASE.medicalTests.length >= 10, true, 'At least 10 medical tests required');
  assert.equal(INITIAL_DATABASE.testRecords.length >= 25, true, 'At least 25 test records required');
  assert.equal(INITIAL_DATABASE.treatments.length >= 10, true, 'At least 10 treatments required');
  assert.equal(INITIAL_DATABASE.treatmentRecords.length >= 20, true, 'At least 20 treatment records required');
});

test('Referential Integrity check - all foreign keys reference existing primary keys', () => {
  const patientIds = new Set(INITIAL_DATABASE.patients.map((p) => p.patientId));
  const wardIds = new Set(INITIAL_DATABASE.wards.map((w) => w.wardId));
  const doctorIds = new Set(INITIAL_DATABASE.doctors.map((d) => d.doctorId));
  const gpIds = new Set(INITIAL_DATABASE.gps.map((g) => g.gpId));
  const testIds = new Set(INITIAL_DATABASE.medicalTests.map((t) => t.testId));
  const treatmentIds = new Set(INITIAL_DATABASE.treatments.map((tr) => tr.treatmentId));

  // Admissions
  for (const adm of INITIAL_DATABASE.admissions) {
    assert.equal(patientIds.has(adm.patientId), true, `Admission ${adm.admissionId} patient ${adm.patientId} must exist`);
    assert.equal(wardIds.has(adm.wardId), true, `Admission ${adm.admissionId} ward ${adm.wardId} must exist`);
    assert.equal(gpIds.has(adm.gpId), true, `Admission ${adm.admissionId} GP ${adm.gpId} must exist`);
    assert.equal(doctorIds.has(adm.consultantId), true, `Admission ${adm.admissionId} consultant ${adm.consultantId} must exist`);
  }

  // Examinations
  for (const exam of INITIAL_DATABASE.examinations) {
    assert.equal(patientIds.has(exam.patientId), true, `Examination ${exam.examinationId} patient ${exam.patientId} must exist`);
    assert.equal(doctorIds.has(exam.doctorId), true, `Examination ${exam.examinationId} doctor ${exam.doctorId} must exist`);
  }

  // Test Records
  for (const tr of INITIAL_DATABASE.testRecords) {
    assert.equal(patientIds.has(tr.patientId), true, `TestRecord ${tr.testRecordId} patient ${tr.patientId} must exist`);
    assert.equal(testIds.has(tr.testId), true, `TestRecord ${tr.testRecordId} test ${tr.testId} must exist`);
    assert.equal(doctorIds.has(tr.doctorId), true, `TestRecord ${tr.testRecordId} doctor ${tr.doctorId} must exist`);
  }

  // Treatment Records
  for (const tr of INITIAL_DATABASE.treatmentRecords) {
    assert.equal(patientIds.has(tr.patientId), true, `TreatmentRecord ${tr.treatmentRecordId} patient ${tr.patientId} must exist`);
    assert.equal(treatmentIds.has(tr.treatmentId), true, `TreatmentRecord ${tr.treatmentRecordId} treatment ${tr.treatmentId} must exist`);
    assert.equal(doctorIds.has(tr.doctorId), true, `TreatmentRecord ${tr.treatmentRecordId} doctor ${tr.doctorId} must exist`);
  }
});

test('All 26 predefined queries execute cleanly and return non-empty rows', () => {
  assert.equal(QUERIES.length, 26, 'Must define exactly 26 queries');
  for (let qId = 1; qId <= 26; qId++) {
    const res = executeHospitalQuery(qId, INITIAL_DATABASE);
    assert.equal(res.error, undefined, `Query ${qId} must not produce error`);
    assert.equal(res.columns.length > 0, true, `Query ${qId} must have columns`);
    assert.equal(res.rows.length > 0, true, `Query ${qId} must return at least one row`);
  }
});

test('Query 23 finds patients with no tests (NOT EXISTS verification)', () => {
  const res = executeHospitalQuery(23, INITIAL_DATABASE);
  assert.equal(res.rows.length, 1, 'Exactly one patient should have 0 tests');
  assert.equal(res.rows[0][0], 115, 'Patient 115 (Suresh Raina) has no tests');
});

test('Query 24 finds patient with maximum treatments', () => {
  const res = executeHospitalQuery(24, INITIAL_DATABASE);
  assert.equal(res.rows.length, 1);
  assert.equal(res.rows[0][0], 101, 'Patient 101 (Rahul Sharma) has highest treatments');
});

test('Query 26 finds most occupied ward based on active admissions', () => {
  const res = executeHospitalQuery(26, INITIAL_DATABASE);
  assert.equal(res.rows.length, 1);
  assert.equal(res.rows[0][1], 'Cardiology Ward');
});
