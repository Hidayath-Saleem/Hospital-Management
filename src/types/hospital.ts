export interface Patient {
  patientId: number;
  patientName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
}

export interface Ward {
  wardId: number;
  wardName: string;
  wardType: string;
  location: string;
  capacity: number;
}

export interface Doctor {
  doctorId: number;
  doctorName: string;
  specialization: string;
  phone: string;
  email: string;
}

export interface GP {
  gpId: number;
  gpName: string;
  clinicName: string;
  phone: string;
}

export interface Admission {
  admissionId: number;
  patientId: number;
  wardId: number;
  gpId: number;
  consultantId: number;
  admissionDate: string; // YYYY-MM-DD
  dischargeDate: string | null; // YYYY-MM-DD or null
  admissionReason: string;
}

export interface Examination {
  examinationId: number;
  patientId: number;
  doctorId: number;
  examinationDate: string;
  findings: string;
  remarks: string;
}

export interface MedicalTest {
  testId: number;
  testName: string;
  testCost: number;
  description: string;
}

export interface TestRecord {
  testRecordId: number;
  patientId: number;
  testId: number;
  doctorId: number;
  testDate: string;
  testResult: string;
  status: 'Pending' | 'Completed' | 'In Progress' | 'Cancelled';
}

export interface Treatment {
  treatmentId: number;
  treatmentName: string;
  description: string;
  cost: number;
}

export interface TreatmentRecord {
  treatmentRecordId: number;
  patientId: number;
  treatmentId: number;
  doctorId: number;
  treatmentDate: string;
  remarks: string;
}

export interface HospitalDatabase {
  patients: Patient[];
  wards: Ward[];
  doctors: Doctor[];
  gps: GP[];
  admissions: Admission[];
  examinations: Examination[];
  medicalTests: MedicalTest[];
  testRecords: TestRecord[];
  treatments: Treatment[];
  treatmentRecords: TreatmentRecord[];
}

export interface QueryDefinition {
  id: number;
  category: 'Basic' | 'Where & Order By' | 'Joins' | 'Aggregate Functions' | 'Advanced Queries';
  title: string;
  question: string;
  sql: string;
  concepts: string;
  expectedHeaders: string[];
  expectedRows: (string | number)[][];
}

export interface TestCase {
  id: string;
  category: string;
  testCase: string;
  input: string;
  expectedResult: string;
  actualResult: string;
  status: 'PASSED' | 'FAILED';
}

export interface VivaQuestion {
  id: number;
  category: 'Core Concepts' | 'Keys & Constraints' | 'Normalization' | 'SQL & Joins' | 'Hospital Schema';
  question: string;
  answer: string;
  tip?: string;
}
