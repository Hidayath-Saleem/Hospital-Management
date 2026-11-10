import { QUERIES } from './hospitalData';

export function generateCompleteSqlScript(): string {
  const querySections = [
    { cat: 'Basic', label: 'SECTION 3.1: BASIC QUERIES (Q1 - Q5)' },
    { cat: 'Where & Order By', label: 'SECTION 3.2: WHERE, ORDER BY, LIKE & DATE QUERIES (Q6 - Q10)' },
    { cat: 'Joins', label: 'SECTION 3.3: MULTI-TABLE JOIN QUERIES (Q11 - Q15)' },
    { cat: 'Aggregate Functions', label: 'SECTION 3.4: AGGREGATE FUNCTION QUERIES (Q16 - Q20)' },
    { cat: 'Advanced Queries', label: 'SECTION 3.5: ADVANCED SUBQUERIES, HAVING, EXISTS & NOT EXISTS (Q21 - Q26)' },
  ];

  let queriesSqlBlock = '';

  for (const sec of querySections) {
    queriesSqlBlock += `\n-- ============================================================================\n`;
    queriesSqlBlock += `-- ${sec.label}\n`;
    queriesSqlBlock += `-- ============================================================================\n\n`;

    const secQueries = QUERIES.filter((q) => q.category === sec.cat);
    for (const q of secQueries) {
      queriesSqlBlock += `-- ----------------------------------------------------------------------------\n`;
      queriesSqlBlock += `-- QUERY Q${q.id}: ${q.title.toUpperCase()}\n`;
      queriesSqlBlock += `-- QUESTION: ${q.question}\n`;
      queriesSqlBlock += `-- CONCEPTS: ${q.concepts}\n`;
      queriesSqlBlock += `-- ----------------------------------------------------------------------------\n`;
      queriesSqlBlock += `PROMPT >>> RUNNING Q${q.id}: ${q.title}...\n`;
      queriesSqlBlock += `${q.sql}\n\n`;
    }
  }

  return `-- ============================================================================
-- PROJECT: GENERAL HOSPITAL MANAGEMENT SYSTEM
-- EXPERIMENT 11: DATABASE MANAGEMENT SYSTEMS (DBMS) LABORATORY
-- COMPLETE MASTER SQL BUNDLE (DDL + DML + ALL 26 QUERIES + TEST SUITE)
-- ============================================================================
-- Compatible with: Oracle Database 11g, 12c, 18c, 19c, 21c, 23c & Oracle Live SQL
-- ============================================================================

SET ECHO OFF;
SET FEEDBACK ON;
SET HEADING ON;
SET LINESIZE 150;
SET PAGESIZE 50;
SET SERVEROUTPUT ON;

PROMPT ========================================================================
PROMPT STARTING GENERAL HOSPITAL MANAGEMENT SYSTEM ORACLE SQL MASTER SCRIPT
PROMPT ========================================================================

-- ============================================================================
-- PART 1: DROP EXISTING TABLES (REVERSE DEPENDENCY ORDER)
-- ============================================================================
PROMPT Dropping existing tables if any...
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TREATMENT_RECORD CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TREATMENT CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TEST_RECORD CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE MEDICAL_TEST CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE EXAMINATION CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE ADMISSION CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE GP CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE DOCTOR CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE WARD CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE PATIENT CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

-- ============================================================================
-- PART 2: DDL - CREATE 10 RELATIONAL TABLES WITH INTEGRITY CONSTRAINTS
-- ============================================================================
PROMPT Creating Table 1: PATIENT (Master Entity)...
CREATE TABLE PATIENT (
    Patient_ID      NUMBER(6)       CONSTRAINT PK_PATIENT PRIMARY KEY,
    Patient_Name    VARCHAR2(50)    CONSTRAINT NN_PATIENT_NAME NOT NULL,
    Date_of_Birth   DATE            CONSTRAINT NN_PATIENT_DOB NOT NULL,
    Gender          VARCHAR2(10)    CONSTRAINT NN_PATIENT_GENDER NOT NULL,
    Phone           VARCHAR2(15)    CONSTRAINT NN_PATIENT_PHONE NOT NULL,
    Address         VARCHAR2(150)   CONSTRAINT NN_PATIENT_ADDR NOT NULL,
    Blood_Group     VARCHAR2(5)     CONSTRAINT NN_PATIENT_BG NOT NULL,
    CONSTRAINT CHK_PATIENT_GENDER CHECK (Gender IN ('Male', 'Female', 'Other')),
    CONSTRAINT CHK_PATIENT_BG CHECK (Blood_Group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    CONSTRAINT UQ_PATIENT_PHONE UNIQUE (Phone)
);

PROMPT Creating Table 2: WARD (Master Entity)...
CREATE TABLE WARD (
    Ward_ID         NUMBER(4)       CONSTRAINT PK_WARD PRIMARY KEY,
    Ward_Name       VARCHAR2(50)    CONSTRAINT NN_WARD_NAME NOT NULL,
    Ward_Type       VARCHAR2(30)    CONSTRAINT NN_WARD_TYPE NOT NULL,
    Location        VARCHAR2(50)    CONSTRAINT NN_WARD_LOC NOT NULL,
    Capacity        NUMBER(4)       CONSTRAINT NN_WARD_CAP NOT NULL,
    CONSTRAINT UQ_WARD_NAME UNIQUE (Ward_Name),
    CONSTRAINT CHK_WARD_CAPACITY CHECK (Capacity > 0)
);

PROMPT Creating Table 3: DOCTOR (Master Entity)...
CREATE TABLE DOCTOR (
    Doctor_ID       NUMBER(6)       CONSTRAINT PK_DOCTOR PRIMARY KEY,
    Doctor_Name     VARCHAR2(50)    CONSTRAINT NN_DOC_NAME NOT NULL,
    Specialization  VARCHAR2(50)    CONSTRAINT NN_DOC_SPEC NOT NULL,
    Phone           VARCHAR2(15)    CONSTRAINT NN_DOC_PHONE NOT NULL,
    Email           VARCHAR2(80)    CONSTRAINT NN_DOC_EMAIL NOT NULL,
    CONSTRAINT UQ_DOCTOR_PHONE UNIQUE (Phone),
    CONSTRAINT UQ_DOCTOR_EMAIL UNIQUE (Email)
);

PROMPT Creating Table 4: GP - GENERAL PRACTITIONER (Master Entity)...
CREATE TABLE GP (
    GP_ID           NUMBER(6)       CONSTRAINT PK_GP PRIMARY KEY,
    GP_Name         VARCHAR2(50)    CONSTRAINT NN_GP_NAME NOT NULL,
    Clinic_Name     VARCHAR2(100)   CONSTRAINT NN_GP_CLINIC NOT NULL,
    Phone           VARCHAR2(15)    CONSTRAINT NN_GP_PHONE NOT NULL,
    CONSTRAINT UQ_GP_PHONE UNIQUE (Phone)
);

PROMPT Creating Table 5: ADMISSION (Transactional / Associative Entity)...
CREATE TABLE ADMISSION (
    Admission_ID        NUMBER(8)       CONSTRAINT PK_ADMISSION PRIMARY KEY,
    Patient_ID          NUMBER(6)       CONSTRAINT NN_ADM_PATIENT NOT NULL,
    Ward_ID             NUMBER(4)       CONSTRAINT NN_ADM_WARD NOT NULL,
    GP_ID               NUMBER(6)       CONSTRAINT NN_ADM_GP NOT NULL,
    Consultant_ID       NUMBER(6)       CONSTRAINT NN_ADM_CONSULT NOT NULL,
    Admission_Date      DATE            CONSTRAINT NN_ADM_DATE NOT NULL,
    Discharge_Date      DATE,
    Admission_Reason    VARCHAR2(200)   CONSTRAINT NN_ADM_REASON NOT NULL,
    CONSTRAINT FK_ADM_PATIENT FOREIGN KEY (Patient_ID) 
        REFERENCES PATIENT(Patient_ID) ON DELETE CASCADE,
    CONSTRAINT FK_ADM_WARD FOREIGN KEY (Ward_ID) 
        REFERENCES WARD(Ward_ID),
    CONSTRAINT FK_ADM_GP FOREIGN KEY (GP_ID) 
        REFERENCES GP(GP_ID),
    CONSTRAINT FK_ADM_CONSULTANT FOREIGN KEY (Consultant_ID) 
        REFERENCES DOCTOR(Doctor_ID),
    CONSTRAINT CHK_ADM_DISCHARGE CHECK (Discharge_Date IS NULL OR Discharge_Date >= Admission_Date)
);

PROMPT Creating Table 6: EXAMINATION (Clinical Transaction Entity)...
CREATE TABLE EXAMINATION (
    Examination_ID      NUMBER(8)       CONSTRAINT PK_EXAMINATION PRIMARY KEY,
    Patient_ID          NUMBER(6)       CONSTRAINT NN_EXAM_PATIENT NOT NULL,
    Doctor_ID           NUMBER(6)       CONSTRAINT NN_EXAM_DOC NOT NULL,
    Examination_Date    DATE            CONSTRAINT NN_EXAM_DATE NOT NULL,
    Findings            VARCHAR2(300)   CONSTRAINT NN_EXAM_FINDINGS NOT NULL,
    Remarks             VARCHAR2(200),
    CONSTRAINT FK_EXAM_PATIENT FOREIGN KEY (Patient_ID) 
        REFERENCES PATIENT(Patient_ID) ON DELETE CASCADE,
    CONSTRAINT FK_EXAM_DOCTOR FOREIGN KEY (Doctor_ID) 
        REFERENCES DOCTOR(Doctor_ID)
);

PROMPT Creating Table 7: MEDICAL_TEST (Master Catalog Entity)...
CREATE TABLE MEDICAL_TEST (
    Test_ID         NUMBER(4)       CONSTRAINT PK_MEDICAL_TEST PRIMARY KEY,
    Test_Name       VARCHAR2(100)   CONSTRAINT NN_TEST_NAME NOT NULL,
    Test_Cost       NUMBER(8, 2)    CONSTRAINT NN_TEST_COST NOT NULL,
    Description     VARCHAR2(250),
    CONSTRAINT UQ_TEST_NAME UNIQUE (Test_Name),
    CONSTRAINT CHK_TEST_COST CHECK (Test_Cost >= 0)
);

PROMPT Creating Table 8: TEST_RECORD (Junction Entity: PATIENT - MEDICAL_TEST)...
CREATE TABLE TEST_RECORD (
    Test_Record_ID  NUMBER(8)       CONSTRAINT PK_TEST_RECORD PRIMARY KEY,
    Patient_ID      NUMBER(6)       CONSTRAINT NN_TR_PATIENT NOT NULL,
    Test_ID         NUMBER(4)       CONSTRAINT NN_TR_TEST NOT NULL,
    Doctor_ID       NUMBER(6)       CONSTRAINT NN_TR_DOC NOT NULL,
    Test_Date       DATE            CONSTRAINT NN_TR_DATE NOT NULL,
    Test_Result     VARCHAR2(200)   CONSTRAINT NN_TR_RESULT NOT NULL,
    Status          VARCHAR2(20)    CONSTRAINT NN_TR_STATUS NOT NULL,
    CONSTRAINT FK_TR_PATIENT FOREIGN KEY (Patient_ID) 
        REFERENCES PATIENT(Patient_ID) ON DELETE CASCADE,
    CONSTRAINT FK_TR_TEST FOREIGN KEY (Test_ID) 
        REFERENCES MEDICAL_TEST(Test_ID),
    CONSTRAINT FK_TR_DOCTOR FOREIGN KEY (Doctor_ID) 
        REFERENCES DOCTOR(Doctor_ID),
    CONSTRAINT CHK_TR_STATUS CHECK (Status IN ('Pending', 'Completed', 'In Progress', 'Cancelled'))
);

PROMPT Creating Table 9: TREATMENT (Master Catalog Entity)...
CREATE TABLE TREATMENT (
    Treatment_ID    NUMBER(4)       CONSTRAINT PK_TREATMENT PRIMARY KEY,
    Treatment_Name  VARCHAR2(100)   CONSTRAINT NN_TREAT_NAME NOT NULL,
    Cost            NUMBER(10, 2)   CONSTRAINT NN_TREAT_COST NOT NULL,
    Description     VARCHAR2(250),
    CONSTRAINT UQ_TREATMENT_NAME UNIQUE (Treatment_Name),
    CONSTRAINT CHK_TREAT_COST CHECK (Cost >= 0)
);

PROMPT Creating Table 10: TREATMENT_RECORD (Junction Entity: PATIENT - TREATMENT)...
CREATE TABLE TREATMENT_RECORD (
    Treatment_Record_ID NUMBER(8)       CONSTRAINT PK_TREATMENT_RECORD PRIMARY KEY,
    Patient_ID          NUMBER(6)       CONSTRAINT NN_TREC_PATIENT NOT NULL,
    Treatment_ID        NUMBER(4)       CONSTRAINT NN_TREC_TREAT NOT NULL,
    Doctor_ID           NUMBER(6)       CONSTRAINT NN_TREC_DOC NOT NULL,
    Treatment_Date      DATE            CONSTRAINT NN_TREC_DATE NOT NULL,
    Remarks             VARCHAR2(200),
    CONSTRAINT FK_TREC_PATIENT FOREIGN KEY (Patient_ID) 
        REFERENCES PATIENT(Patient_ID) ON DELETE CASCADE,
    CONSTRAINT FK_TREC_TREATMENT FOREIGN KEY (Treatment_ID) 
        REFERENCES TREATMENT(Treatment_ID),
    CONSTRAINT FK_TREC_DOCTOR FOREIGN KEY (Doctor_ID) 
        REFERENCES DOCTOR(Doctor_ID)
);

-- ============================================================================
-- PART 3: DML - INSERT 141 SAMPLE RECORDS (USING TO_DATE)
-- ============================================================================
PROMPT Inserting Patients...
INSERT INTO PATIENT VALUES (101, 'Rahul Sharma', TO_DATE('1982-05-14', 'YYYY-MM-DD'), 'Male', '9876543210', '12 MG Road, Bangalore', 'O+');
INSERT INTO PATIENT VALUES (102, 'Priya Nair', TO_DATE('1995-08-22', 'YYYY-MM-DD'), 'Female', '9876543211', '45 Lake View, Bangalore', 'A+');
INSERT INTO PATIENT VALUES (103, 'Amitabh Sen', TO_DATE('1968-11-03', 'YYYY-MM-DD'), 'Male', '9876543212', '88 Park Street, Kolkata', 'B+');
INSERT INTO PATIENT VALUES (104, 'Sneha Patel', TO_DATE('1990-03-19', 'YYYY-MM-DD'), 'Female', '9876543213', '23 Ring Road, Surat', 'AB+');
INSERT INTO PATIENT VALUES (105, 'Vikram Malhotra', TO_DATE('1975-09-30', 'YYYY-MM-DD'), 'Male', '9876543214', '14 Civil Lines, Delhi', 'O-');
INSERT INTO PATIENT VALUES (106, 'Ananya Roy', TO_DATE('2018-07-12', 'YYYY-MM-DD'), 'Female', '9876543215', '9 Salt Lake, Kolkata', 'A-');
INSERT INTO PATIENT VALUES (107, 'Kavita Deshmukh', TO_DATE('1988-12-05', 'YYYY-MM-DD'), 'Female', '9876543216', '67 Shivaji Nagar, Pune', 'B-');
INSERT INTO PATIENT VALUES (108, 'Rohan Mehra', TO_DATE('2015-02-17', 'YYYY-MM-DD'), 'Male', '9876543217', '30 Sector 15, Chandigarh', 'AB-');
INSERT INTO PATIENT VALUES (109, 'Deepak Verma', TO_DATE('1962-04-25', 'YYYY-MM-DD'), 'Male', '9876543218', '55 Gomti Nagar, Lucknow', 'O+');
INSERT INTO PATIENT VALUES (110, 'Meenakshi Sundaram', TO_DATE('1980-10-10', 'YYYY-MM-DD'), 'Female', '9876543219', '7 T Nagar, Chennai', 'A+');
INSERT INTO PATIENT VALUES (111, 'Arjun Das', TO_DATE('1993-01-28', 'YYYY-MM-DD'), 'Male', '9876543220', '18 Jubilee Hills, Hyderabad', 'B+');
INSERT INTO PATIENT VALUES (112, 'Sunita Rao', TO_DATE('1971-06-14', 'YYYY-MM-DD'), 'Female', '9876543221', '42 Malleshwaram, Bangalore', 'AB+');
INSERT INTO PATIENT VALUES (113, 'Farhan Akhtar', TO_DATE('1986-09-08', 'YYYY-MM-DD'), 'Male', '9876543222', '99 Bandra West, Mumbai', 'O+');
INSERT INTO PATIENT VALUES (114, 'Pooja Hegde', TO_DATE('1998-11-20', 'YYYY-MM-DD'), 'Female', '9876543223', '11 Indiranagar, Bangalore', 'A+');
INSERT INTO PATIENT VALUES (115, 'Suresh Raina', TO_DATE('1984-03-02', 'YYYY-MM-DD'), 'Male', '9876543224', '22 Cantt Road, Kanpur', 'O+');

PROMPT Inserting Wards...
INSERT INTO WARD VALUES (1, 'Maternity Ward', 'Obstetrics', 'Building A, Floor 1', 20);
INSERT INTO WARD VALUES (2, 'Pediatric Ward', 'Child Care', 'Building A, Floor 2', 15);
INSERT INTO WARD VALUES (3, 'Oncology Ward', 'Cancer Care', 'Building B, Floor 3', 12);
INSERT INTO WARD VALUES (4, 'Cardiology Ward', 'Heart Care', 'Building B, Floor 2', 18);
INSERT INTO WARD VALUES (5, 'Orthopedic Ward', 'Bone & Joint', 'Building C, Floor 1', 16);
INSERT INTO WARD VALUES (6, 'General Medicine Ward', 'General Care', 'Building C, Floor 2', 30);

PROMPT Inserting Doctors...
INSERT INTO DOCTOR VALUES (201, 'Dr. Ramesh Gupta', 'Cardiology', '9123456780', 'r.gupta@hospital.org');
INSERT INTO DOCTOR VALUES (202, 'Dr. Shalini Menon', 'Oncology', '9123456781', 's.menon@hospital.org');
INSERT INTO DOCTOR VALUES (203, 'Dr. Suresh Kulkarni', 'Orthopedics', '9123456782', 's.kulkarni@hospital.org');
INSERT INTO DOCTOR VALUES (204, 'Dr. Anita Desai', 'Obstetrics & Gynecology', '9123456783', 'a.desai@hospital.org');
INSERT INTO DOCTOR VALUES (205, 'Dr. Rajesh Khanna', 'Pediatrics', '9123456784', 'r.khanna@hospital.org');
INSERT INTO DOCTOR VALUES (206, 'Dr. Manisha Bansal', 'General Medicine', '9123456785', 'm.bansal@hospital.org');
INSERT INTO DOCTOR VALUES (207, 'Dr. Arvind Swamy', 'Cardiology', '9123456786', 'a.swamy@hospital.org');
INSERT INTO DOCTOR VALUES (208, 'Dr. Neha Kapoor', 'Oncology', '9123456787', 'n.kapoor@hospital.org');
INSERT INTO DOCTOR VALUES (209, 'Dr. Vikram Seth', 'Radiology', '9123456788', 'v.seth@hospital.org');
INSERT INTO DOCTOR VALUES (210, 'Dr. Pooja Bhatt', 'Pathology', '9123456789', 'p.bhatt@hospital.org');

PROMPT Inserting GPs...
INSERT INTO GP VALUES (301, 'Dr. Alok Nath', 'CarePlus Family Clinic', '9811122233');
INSERT INTO GP VALUES (302, 'Dr. Sunita Williams', 'Community Health Center', '9811122234');
INSERT INTO GP VALUES (303, 'Dr. Harish Chandra', 'City Polyclinic', '9811122235');
INSERT INTO GP VALUES (304, 'Dr. Geeta Pillai', 'Wellness Medical Centre', '9811122236');
INSERT INTO GP VALUES (305, 'Dr. Tariq Mansoor', 'Metro Primary Care', '9811122237');

PROMPT Inserting Admissions...
INSERT INTO ADMISSION VALUES (401, 101, 4, 301, 201, TO_DATE('2023-09-01', 'YYYY-MM-DD'), TO_DATE('2023-09-08', 'YYYY-MM-DD'), 'Acute Chest Angina');
INSERT INTO ADMISSION VALUES (402, 102, 1, 302, 204, TO_DATE('2023-09-05', 'YYYY-MM-DD'), TO_DATE('2023-09-09', 'YYYY-MM-DD'), 'Normal Delivery Care');
INSERT INTO ADMISSION VALUES (403, 103, 3, 303, 202, TO_DATE('2023-09-10', 'YYYY-MM-DD'), NULL, 'Chemotherapy Cycle 3');
INSERT INTO ADMISSION VALUES (404, 104, 5, 304, 203, TO_DATE('2023-09-12', 'YYYY-MM-DD'), TO_DATE('2023-09-20', 'YYYY-MM-DD'), 'Right Tibia Fracture');
INSERT INTO ADMISSION VALUES (405, 105, 6, 305, 206, TO_DATE('2023-09-15', 'YYYY-MM-DD'), TO_DATE('2023-09-22', 'YYYY-MM-DD'), 'Dengue with Thrombocytopenia');
INSERT INTO ADMISSION VALUES (406, 106, 2, 301, 205, TO_DATE('2023-09-18', 'YYYY-MM-DD'), NULL, 'Severe Bronchopneumonia');
INSERT INTO ADMISSION VALUES (407, 107, 1, 302, 204, TO_DATE('2023-09-20', 'YYYY-MM-DD'), NULL, 'High Risk Pregnancy Monitoring');
INSERT INTO ADMISSION VALUES (408, 108, 2, 303, 205, TO_DATE('2023-09-22', 'YYYY-MM-DD'), TO_DATE('2023-09-26', 'YYYY-MM-DD'), 'Acute Viral Gastroenteritis');
INSERT INTO ADMISSION VALUES (409, 109, 4, 304, 207, TO_DATE('2023-09-25', 'YYYY-MM-DD'), NULL, 'Congestive Heart Failure');
INSERT INTO ADMISSION VALUES (410, 110, 3, 305, 208, TO_DATE('2023-09-28', 'YYYY-MM-DD'), NULL, 'Breast Carcinoma Evaluation');
INSERT INTO ADMISSION VALUES (411, 111, 5, 301, 203, TO_DATE('2023-10-01', 'YYYY-MM-DD'), TO_DATE('2023-10-05', 'YYYY-MM-DD'), 'ACL Tear Reconstruction');
INSERT INTO ADMISSION VALUES (412, 112, 6, 302, 206, TO_DATE('2023-10-03', 'YYYY-MM-DD'), NULL, 'Uncontrolled Type 2 Diabetes');
INSERT INTO ADMISSION VALUES (413, 113, 4, 303, 201, TO_DATE('2023-10-05', 'YYYY-MM-DD'), NULL, 'Post-Myocardial Infarction Rehab');
INSERT INTO ADMISSION VALUES (414, 114, 1, 304, 204, TO_DATE('2023-10-07', 'YYYY-MM-DD'), TO_DATE('2023-10-10', 'YYYY-MM-DD'), 'Hyperemesis Gravidarum');
INSERT INTO ADMISSION VALUES (415, 101, 4, 301, 201, TO_DATE('2023-10-12', 'YYYY-MM-DD'), NULL, 'Coronary Stent Follow-up');
INSERT INTO ADMISSION VALUES (416, 104, 5, 305, 203, TO_DATE('2023-10-15', 'YYYY-MM-DD'), NULL, 'Post-Op Physical Therapy Admission');
INSERT INTO ADMISSION VALUES (417, 103, 3, 303, 202, TO_DATE('2023-10-18', 'YYYY-MM-DD'), NULL, 'Immunotherapy Infusion Session');
INSERT INTO ADMISSION VALUES (418, 107, 1, 302, 204, TO_DATE('2023-10-20', 'YYYY-MM-DD'), NULL, 'Pre-term Labor Observation');
INSERT INTO ADMISSION VALUES (419, 109, 4, 304, 207, TO_DATE('2023-10-22', 'YYYY-MM-DD'), NULL, 'Arrhythmia Management');
INSERT INTO ADMISSION VALUES (420, 105, 6, 305, 206, TO_DATE('2023-10-25', 'YYYY-MM-DD'), NULL, 'Bilateral Pneumonia');

PROMPT Inserting Examinations...
INSERT INTO EXAMINATION VALUES (501, 101, 201, TO_DATE('2023-09-02', 'YYYY-MM-DD'), 'Elevated ST segment, BP 150/95', 'Started on beta blockers');
INSERT INTO EXAMINATION VALUES (502, 102, 204, TO_DATE('2023-09-06', 'YYYY-MM-DD'), 'Normal fetal heart rate, 38 weeks gestation', 'Scheduled for delivery room');
INSERT INTO EXAMINATION VALUES (503, 103, 202, TO_DATE('2023-09-11', 'YYYY-MM-DD'), 'Mild neutropenia, tumor stable', 'Continue antiemetics');
INSERT INTO EXAMINATION VALUES (504, 104, 203, TO_DATE('2023-09-13', 'YYYY-MM-DD'), 'Compound fracture right tibia with swelling', 'Prepared for surgery');
INSERT INTO EXAMINATION VALUES (505, 105, 206, TO_DATE('2023-09-16', 'YYYY-MM-DD'), 'Platelet count dropped to 45000/uL', 'IV fluids given');
INSERT INTO EXAMINATION VALUES (506, 106, 205, TO_DATE('2023-09-19', 'YYYY-MM-DD'), 'Bilateral wheezing, tachypnea', 'Nebulization Q4H');
INSERT INTO EXAMINATION VALUES (507, 107, 204, TO_DATE('2023-09-21', 'YYYY-MM-DD'), 'Mild hypertension 140/90, 32 weeks', 'Bed rest prescribed');
INSERT INTO EXAMINATION VALUES (508, 108, 205, TO_DATE('2023-09-23', 'YYYY-MM-DD'), 'Moderate dehydration, abdomen soft', 'Oral rehydration ongoing');
INSERT INTO EXAMINATION VALUES (509, 109, 207, TO_DATE('2023-09-26', 'YYYY-MM-DD'), 'Bilateral pedal edema, ejection fraction 38%', 'Diuretic adjusted');
INSERT INTO EXAMINATION VALUES (510, 110, 208, TO_DATE('2023-09-29', 'YYYY-MM-DD'), 'Palpable left breast mass, painless', 'Advised biopsy');
INSERT INTO EXAMINATION VALUES (511, 111, 203, TO_DATE('2023-10-02', 'YYYY-MM-DD'), 'Positive Lachman test, joint effusion', 'Arthroscopy recommended');
INSERT INTO EXAMINATION VALUES (512, 112, 206, TO_DATE('2023-10-04', 'YYYY-MM-DD'), 'Random blood sugar 320 mg/dL, HbA1c 10.2%', 'Insulin sliding scale');
INSERT INTO EXAMINATION VALUES (513, 113, 201, TO_DATE('2023-10-06', 'YYYY-MM-DD'), 'Post-MI rhythm sinus, exercise intolerance', 'Cardiac rehab routine');
INSERT INTO EXAMINATION VALUES (514, 114, 204, TO_DATE('2023-10-08', 'YYYY-MM-DD'), 'Urine ketones 2+, weight loss noted', 'IV dextrose & ondansetron');
INSERT INTO EXAMINATION VALUES (515, 101, 207, TO_DATE('2023-10-13', 'YYYY-MM-DD'), 'Second opinion: coronary patency intact', 'Good recovery');
INSERT INTO EXAMINATION VALUES (516, 104, 203, TO_DATE('2023-10-16', 'YYYY-MM-DD'), 'Callus formation visible on x-ray', 'Partial weight bearing');
INSERT INTO EXAMINATION VALUES (517, 103, 208, TO_DATE('2023-10-19', 'YYYY-MM-DD'), 'No new lymphadenopathy observed', 'Proceed with cycle 4');
INSERT INTO EXAMINATION VALUES (518, 105, 206, TO_DATE('2023-10-26', 'YYYY-MM-DD'), 'Crepitations at right lung base', 'Oxygen therapy started');
INSERT INTO EXAMINATION VALUES (519, 109, 201, TO_DATE('2023-10-23', 'YYYY-MM-DD'), 'Frequent premature ventricular contractions', 'Electrolytes checked');
INSERT INTO EXAMINATION VALUES (520, 107, 204, TO_DATE('2023-10-21', 'YYYY-MM-DD'), 'Cervical dilation 1cm, contractions mild', 'Tocolytic therapy');

PROMPT Inserting Medical Tests...
INSERT INTO MEDICAL_TEST VALUES (601, 'Complete Blood Count (CBC)', 450.00, 'Evaluation of red cells, white cells, and platelets');
INSERT INTO MEDICAL_TEST VALUES (602, '12-Lead Electrocardiogram (ECG)', 600.00, 'Electrical activity record of the cardiac chambers');
INSERT INTO MEDICAL_TEST VALUES (603, 'Chest X-Ray PA View', 800.00, 'Radiographic evaluation of thoracic cavity & lungs');
INSERT INTO MEDICAL_TEST VALUES (604, '2D Echocardiography', 2500.00, 'Ultrasound evaluation of cardiac chambers and valves');
INSERT INTO MEDICAL_TEST VALUES (605, 'CT Scan Thorax Contrast', 5500.00, 'High resolution computed tomography of chest');
INSERT INTO MEDICAL_TEST VALUES (606, 'MRI Knee Joint', 6500.00, 'Magnetic resonance imaging for ligament/meniscus');
INSERT INTO MEDICAL_TEST VALUES (607, 'Lipid Profile', 750.00, 'Total cholesterol, HDL, LDL, and triglycerides');
INSERT INTO MEDICAL_TEST VALUES (608, 'Liver Function Test (LFT)', 850.00, 'Bilirubin, SGOT, SGPT, alkaline phosphatase');
INSERT INTO MEDICAL_TEST VALUES (609, 'Kidney Function Test (KFT)', 800.00, 'Serum creatinine, urea, BUN, and electrolytes');
INSERT INTO MEDICAL_TEST VALUES (610, 'Ultrasound Abdomen & Pelvis', 1800.00, 'Sonographic imaging of abdominal viscera');

PROMPT Inserting Test Records...
INSERT INTO TEST_RECORD VALUES (701, 101, 602, 201, TO_DATE('2023-09-02', 'YYYY-MM-DD'), 'ST segment elevation in V1-V4', 'Completed');
INSERT INTO TEST_RECORD VALUES (702, 101, 604, 201, TO_DATE('2023-09-03', 'YYYY-MM-DD'), 'Anterior wall hypokinesia, EF 45%', 'Completed');
INSERT INTO TEST_RECORD VALUES (703, 101, 607, 201, TO_DATE('2023-09-04', 'YYYY-MM-DD'), 'Total Cholesterol: 240 mg/dL, LDL: 160 mg/dL', 'Completed');
INSERT INTO TEST_RECORD VALUES (704, 102, 601, 204, TO_DATE('2023-09-06', 'YYYY-MM-DD'), 'Hb 11.8 g/dL, Platelets 210,000', 'Completed');
INSERT INTO TEST_RECORD VALUES (705, 102, 610, 204, TO_DATE('2023-09-06', 'YYYY-MM-DD'), 'Single live fetus in cephalic presentation', 'Completed');
INSERT INTO TEST_RECORD VALUES (706, 103, 601, 202, TO_DATE('2023-09-11', 'YYYY-MM-DD'), 'WBC 3,200/uL, Platelets 95,000', 'Completed');
INSERT INTO TEST_RECORD VALUES (707, 103, 605, 209, TO_DATE('2023-09-12', 'YYYY-MM-DD'), 'Reduction in mediastinal mass by 22%', 'Completed');
INSERT INTO TEST_RECORD VALUES (708, 103, 608, 202, TO_DATE('2023-09-14', 'YYYY-MM-DD'), 'SGOT 42, SGPT 48, normal bilirubin', 'Completed');
INSERT INTO TEST_RECORD VALUES (709, 104, 603, 203, TO_DATE('2023-09-12', 'YYYY-MM-DD'), 'Displaced transverse fracture of right tibia', 'Completed');
INSERT INTO TEST_RECORD VALUES (710, 104, 606, 209, TO_DATE('2023-09-14', 'YYYY-MM-DD'), 'Associated collateral ligament strain', 'Completed');
INSERT INTO TEST_RECORD VALUES (711, 105, 601, 206, TO_DATE('2023-09-15', 'YYYY-MM-DD'), 'Platelets 38,000, hematocrit 44%', 'Completed');
INSERT INTO TEST_RECORD VALUES (712, 105, 609, 206, TO_DATE('2023-09-17', 'YYYY-MM-DD'), 'Serum creatinine 1.1 mg/dL, normal', 'Completed');
INSERT INTO TEST_RECORD VALUES (713, 106, 603, 205, TO_DATE('2023-09-19', 'YYYY-MM-DD'), 'Bilateral perihilar patchy consolidation', 'Completed');
INSERT INTO TEST_RECORD VALUES (714, 106, 601, 205, TO_DATE('2023-09-20', 'YYYY-MM-DD'), 'Leukocytosis 16,500/uL with neutrophilia', 'Completed');
INSERT INTO TEST_RECORD VALUES (715, 107, 601, 204, TO_DATE('2023-09-21', 'YYYY-MM-DD'), 'Hb 10.4 g/dL, Platelets 180,000', 'Completed');
INSERT INTO TEST_RECORD VALUES (716, 108, 609, 205, TO_DATE('2023-09-23', 'YYYY-MM-DD'), 'Serum sodium 132 mEq/L, potassium 3.4 mEq/L', 'Completed');
INSERT INTO TEST_RECORD VALUES (717, 109, 602, 207, TO_DATE('2023-09-26', 'YYYY-MM-DD'), 'Atrial fibrillation with rapid ventricular response', 'Completed');
INSERT INTO TEST_RECORD VALUES (718, 109, 604, 207, TO_DATE('2023-09-27', 'YYYY-MM-DD'), 'Dilated left ventricle, EF 35%', 'Completed');
INSERT INTO TEST_RECORD VALUES (719, 110, 610, 208, TO_DATE('2023-09-29', 'YYYY-MM-DD'), 'Hypoechoic lesion 2.4cm in upper outer quadrant', 'Completed');
INSERT INTO TEST_RECORD VALUES (720, 111, 606, 209, TO_DATE('2023-10-02', 'YYYY-MM-DD'), 'Complete mid-substance rupture of anterior cruciate ligament', 'Completed');
INSERT INTO TEST_RECORD VALUES (721, 112, 601, 206, TO_DATE('2023-10-04', 'YYYY-MM-DD'), 'Fasting glucose 210 mg/dL, HbA1c 10.4%', 'Completed');
INSERT INTO TEST_RECORD VALUES (722, 112, 609, 206, TO_DATE('2023-10-05', 'YYYY-MM-DD'), 'Microalbuminuria detected, GFR 82 mL/min', 'Completed');
INSERT INTO TEST_RECORD VALUES (723, 113, 602, 201, TO_DATE('2023-10-06', 'YYYY-MM-DD'), 'Normal sinus rhythm with pathological Q waves in II, III, aVF', 'Completed');
INSERT INTO TEST_RECORD VALUES (724, 114, 609, 204, TO_DATE('2023-10-08', 'YYYY-MM-DD'), 'Hypokalemia: Serum potassium 3.1 mEq/L', 'Completed');
INSERT INTO TEST_RECORD VALUES (725, 101, 605, 209, TO_DATE('2023-10-14', 'YYYY-MM-DD'), 'Coronary CT angiography: Patent DES in LAD', 'Completed');

PROMPT Inserting Treatments...
INSERT INTO TREATMENT VALUES (801, 'Percutaneous Coronary Intervention (PCI)', 120000.00, 'Angioplasty with drug-eluting stent placement');
INSERT INTO TREATMENT VALUES (802, 'Chemotherapy Infusion Cycle', 45000.00, 'Intravenous systemic antineoplastic regimen');
INSERT INTO TREATMENT VALUES (803, 'Open Reduction & Internal Fixation (ORIF)', 65000.00, 'Surgical fixation of bone fracture using titanium plates');
INSERT INTO TREATMENT VALUES (804, 'Arthroscopic ACL Reconstruction', 75000.00, 'Endoscopic tendon graft repair of cruciate ligament');
INSERT INTO TREATMENT VALUES (805, 'Platelet Transfusion Therapy', 15000.00, 'Single donor apheresis platelet concentrate transfusion');
INSERT INTO TREATMENT VALUES (806, 'Obstetric Normal Delivery Suite Care', 25000.00, 'Labor management, delivery assistance and postpartum care');
INSERT INTO TREATMENT VALUES (807, 'Pediatric Nebulization & Oxygenation Protocol', 8000.00, 'Continuous bronchodilator & high flow nasal cannula support');
INSERT INTO TREATMENT VALUES (808, 'Intravenous Insulin Infusion Protocol', 12000.00, 'Automated sliding scale glycemic correction therapy');
INSERT INTO TREATMENT VALUES (809, 'Cardioversion & Antiarrhythmic Protocol', 30000.00, 'Electrical/pharmacological rhythm stabilization');
INSERT INTO TREATMENT VALUES (810, 'Targeted Immunotherapy Infusion', 85000.00, 'Monoclonal antibody biological therapy');

PROMPT Inserting Treatment Records...
INSERT INTO TREATMENT_RECORD VALUES (901, 101, 801, 201, TO_DATE('2023-09-04', 'YYYY-MM-DD'), 'Stent placed in proximal LAD successfully');
INSERT INTO TREATMENT_RECORD VALUES (902, 102, 806, 204, TO_DATE('2023-09-07', 'YYYY-MM-DD'), 'Delivered healthy female newborn, uneventful');
INSERT INTO TREATMENT_RECORD VALUES (903, 103, 802, 202, TO_DATE('2023-09-13', 'YYYY-MM-DD'), 'Cisplatin regimen administered without allergy');
INSERT INTO TREATMENT_RECORD VALUES (904, 104, 803, 203, TO_DATE('2023-09-15', 'YYYY-MM-DD'), 'Anatomical reduction achieved with 8-hole plate');
INSERT INTO TREATMENT_RECORD VALUES (905, 105, 805, 206, TO_DATE('2023-09-18', 'YYYY-MM-DD'), '2 units SDP transfused; platelets rose to 85000');
INSERT INTO TREATMENT_RECORD VALUES (906, 106, 807, 205, TO_DATE('2023-09-21', 'YYYY-MM-DD'), 'SpO2 improved from 88% to 98%');
INSERT INTO TREATMENT_RECORD VALUES (907, 107, 806, 204, TO_DATE('2023-09-22', 'YYYY-MM-DD'), 'Tocolytic infusion sustained for 48 hours');
INSERT INTO TREATMENT_RECORD VALUES (908, 108, 807, 205, TO_DATE('2023-09-24', 'YYYY-MM-DD'), 'Electrolyte balance restored; tolerated feeding');
INSERT INTO TREATMENT_RECORD VALUES (909, 109, 809, 207, TO_DATE('2023-09-28', 'YYYY-MM-DD'), 'Direct current cardioversion converted rhythm to sinus');
INSERT INTO TREATMENT_RECORD VALUES (910, 110, 802, 208, TO_DATE('2023-10-01', 'YYYY-MM-DD'), 'Neoadjuvant cycle initiated');
INSERT INTO TREATMENT_RECORD VALUES (911, 111, 804, 203, TO_DATE('2023-10-03', 'YYYY-MM-DD'), 'Hamstring autograft successfully placed');
INSERT INTO TREATMENT_RECORD VALUES (912, 112, 808, 206, TO_DATE('2023-10-06', 'YYYY-MM-DD'), 'Blood sugar stabilized between 130-160 mg/dL');
INSERT INTO TREATMENT_RECORD VALUES (913, 113, 809, 201, TO_DATE('2023-10-08', 'YYYY-MM-DD'), 'Oral beta blocker maintenance titration');
INSERT INTO TREATMENT_RECORD VALUES (914, 114, 808, 204, TO_DATE('2023-10-09', 'YYYY-MM-DD'), 'Electrolyte repletion and antiemetic therapy');
INSERT INTO TREATMENT_RECORD VALUES (915, 101, 809, 207, TO_DATE('2023-10-14', 'YYYY-MM-DD'), 'Cardiac rehab and rhythm monitoring');
INSERT INTO TREATMENT_RECORD VALUES (916, 103, 810, 202, TO_DATE('2023-10-20', 'YYYY-MM-DD'), 'Pembrolizumab infusion tolerated well');
INSERT INTO TREATMENT_RECORD VALUES (917, 104, 804, 203, TO_DATE('2023-10-18', 'YYYY-MM-DD'), 'Secondary rehabilitation therapy');
INSERT INTO TREATMENT_RECORD VALUES (918, 105, 805, 206, TO_DATE('2023-10-27', 'YYYY-MM-DD'), 'Maintenance platelet support');
INSERT INTO TREATMENT_RECORD VALUES (919, 101, 808, 201, TO_DATE('2023-10-16', 'YYYY-MM-DD'), 'Stress glycemic control therapy');
INSERT INTO TREATMENT_RECORD VALUES (920, 109, 801, 207, TO_DATE('2023-10-24', 'YYYY-MM-DD'), 'Secondary balloon angioplasty');

COMMIT;
PROMPT All 141 sample records successfully inserted and committed!

-- ============================================================================
-- PART 4: ALL 26 ORACLE SQL BENCHMARK QUERIES WITH EXPLANATIONS
-- ============================================================================
${queriesSqlBlock}

-- ============================================================================
-- PART 5: CONSTRAINT INTEGRITY & FAILURE VALIDATION TESTS
-- ============================================================================
PROMPT ========================================================================
PROMPT RUNNING INTEGRITY CONSTRAINT TESTS
PROMPT ========================================================================

PROMPT TEST 1: Primary Key Uniqueness (Duplicate Patient_ID)...
BEGIN
    INSERT INTO PATIENT VALUES (101, 'Duplicate Test', DATE '1990-01-01', 'Male', '9999999999', 'City', 'O+');
    DBMS_OUTPUT.PUT_LINE('FAIL: Duplicate primary key was accepted unexpectedly!');
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        DBMS_OUTPUT.PUT_LINE('SUCCESS: ORA-00001 Caught! Primary Key uniqueness enforced on Patient_ID.');
END;
/

PROMPT TEST 2: Foreign Key Orphan Prevention (Invalid Patient in Admission)...
BEGIN
    INSERT INTO ADMISSION VALUES (999, 9999, 1, 301, 201, DATE '2023-11-01', NULL, 'Invalid Patient');
    DBMS_OUTPUT.PUT_LINE('FAIL: Orphan foreign key was accepted!');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2291 THEN
            DBMS_OUTPUT.PUT_LINE('SUCCESS: ORA-02291 Caught! Foreign Key prevented orphan child tuple.');
        ELSE
            DBMS_OUTPUT.PUT_LINE('Exception: ' || SQLERRM);
        END IF;
END;
/

PROMPT TEST 3: Check Constraint on Gender...
BEGIN
    INSERT INTO PATIENT VALUES (999, 'Invalid Gender', DATE '1990-01-01', 'Robot', '9999988888', 'City', 'O+');
    DBMS_OUTPUT.PUT_LINE('FAIL: Check constraint bypassed!');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2290 THEN
            DBMS_OUTPUT.PUT_LINE('SUCCESS: ORA-02290 Caught! Check Constraint blocked invalid gender.');
        ELSE
            DBMS_OUTPUT.PUT_LINE('Exception: ' || SQLERRM);
        END IF;
END;
/

PROMPT ========================================================================
PROMPT EXECUTION COMPLETE: ALL 10 TABLES, 141 ROWS, 26 QUERIES & TESTS FINISHED!
PROMPT ========================================================================
`;
}
