# RELATIONAL SCHEMA SPECIFICATION
## General Hospital Management System (Experiment 11 – DBMS)

### 1. Formal Relational Notation
Primary Keys are indicated with **PK**, and Foreign Keys are indicated with **FK** referencing the parent relation.

1. **PATIENT** (<u>Patient_ID</u>, Patient_Name, Date_of_Birth, Gender, Phone, Address, Blood_Group)
   - **PK:** `Patient_ID`
   - **Candidate Keys (CK):** `Patient_ID`, `Phone`
   - **Constraints:** `Gender IN ('Male', 'Female', 'Other')`, `Blood_Group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')`

2. **WARD** (<u>Ward_ID</u>, Ward_Name, Ward_Type, Location, Capacity)
   - **PK:** `Ward_ID`
   - **CK:** `Ward_ID`, `Ward_Name`
   - **Constraints:** `Capacity > 0`

3. **DOCTOR** (<u>Doctor_ID</u>, Doctor_Name, Specialization, Phone, Email)
   - **PK:** `Doctor_ID`
   - **CK:** `Doctor_ID`, `Phone`, `Email`

4. **GP** (<u>GP_ID</u>, GP_Name, Clinic_Name, Phone)
   - **PK:** `GP_ID`
   - **CK:** `GP_ID`, `Phone`

5. **ADMISSION** (<u>Admission_ID</u>, Patient_ID*, Ward_ID*, GP_ID*, Consultant_ID*, Admission_Date, Discharge_Date, Admission_Reason)
   - **PK:** `Admission_ID`
   - **FK 1:** `Patient_ID` references `PATIENT(Patient_ID)` ON DELETE CASCADE
   - **FK 2:** `Ward_ID` references `WARD(Ward_ID)`
   - **FK 3:** `GP_ID` references `GP(GP_ID)`
   - **FK 4:** `Consultant_ID` references `DOCTOR(Doctor_ID)`
   - **Constraints:** `Discharge_Date IS NULL OR Discharge_Date >= Admission_Date`

6. **EXAMINATION** (<u>Examination_ID</u>, Patient_ID*, Doctor_ID*, Examination_Date, Findings, Remarks)
   - **PK:** `Examination_ID`
   - **FK 1:** `Patient_ID` references `PATIENT(Patient_ID)` ON DELETE CASCADE
   - **FK 2:** `Doctor_ID` references `DOCTOR(Doctor_ID)`

7. **MEDICAL_TEST** (<u>Test_ID</u>, Test_Name, Test_Cost, Description)
   - **PK:** `Test_ID`
   - **CK:** `Test_ID`, `Test_Name`
   - **Constraints:** `Test_Cost >= 0`

8. **TEST_RECORD** (<u>Test_Record_ID</u>, Patient_ID*, Test_ID*, Doctor_ID*, Test_Date, Test_Result, Status)
   - **PK:** `Test_Record_ID`
   - **FK 1:** `Patient_ID` references `PATIENT(Patient_ID)` ON DELETE CASCADE
   - **FK 2:** `Test_ID` references `MEDICAL_TEST(Test_ID)`
   - **FK 3:** `Doctor_ID` references `DOCTOR(Doctor_ID)`
   - **Constraints:** `Status IN ('Pending', 'Completed', 'In Progress', 'Cancelled')`

9. **TREATMENT** (<u>Treatment_ID</u>, Treatment_Name, Cost, Description)
   - **PK:** `Treatment_ID`
   - **CK:** `Treatment_ID`, `Treatment_Name`
   - **Constraints:** `Cost >= 0`

10. **TREATMENT_RECORD** (<u>Treatment_Record_ID</u>, Patient_ID*, Treatment_ID*, Doctor_ID*, Treatment_Date, Remarks)
    - **PK:** `Treatment_Record_ID`
    - **FK 1:** `Patient_ID` references `PATIENT(Patient_ID)` ON DELETE CASCADE
    - **FK 2:** `Treatment_ID` references `TREATMENT(Treatment_ID)`
    - **FK 3:** `Doctor_ID` references `DOCTOR(Doctor_ID)`

---

### 2. Relationship Cardinality Matrix

| Parent Table | Child Table | Relationship Type | Cardinality | Foreign Key Column | Business Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PATIENT** | **ADMISSION** | Identifying / Clinical | 1 : N | `ADMISSION.Patient_ID` | A patient may have zero, one, or multiple hospital admissions. |
| **WARD** | **ADMISSION** | Allocation | 1 : N | `ADMISSION.Ward_ID` | A ward accommodates multiple patient admissions up to bed capacity. |
| **GP** | **ADMISSION** | Referral | 1 : N | `ADMISSION.GP_ID` | A general practitioner refers multiple patient admissions. |
| **DOCTOR** | **ADMISSION** | Clinical Oversight | 1 : N | `ADMISSION.Consultant_ID` | A consultant doctor leads inpatient treatment for multiple admissions. |
| **PATIENT** | **EXAMINATION** | Clinical Care | 1 : N | `EXAMINATION.Patient_ID` | A patient undergoes multiple clinical checkups during care. |
| **DOCTOR** | **EXAMINATION** | Clinical Work | 1 : N | `EXAMINATION.Doctor_ID` | A doctor performs clinical examinations on multiple patients. |
| **PATIENT** | **TEST_RECORD** | Diagnostic Test | 1 : N | `TEST_RECORD.Patient_ID` | A patient takes multiple diagnostic tests over time. |
| **MEDICAL_TEST** | **TEST_RECORD** | Catalog Execution | 1 : N | `TEST_RECORD.Test_ID` | A diagnostic test is performed across many patients. |
| **DOCTOR** | **TEST_RECORD** | Prescription | 1 : N | `TEST_RECORD.Doctor_ID` | A doctor orders or interprets multiple medical tests. |
| **PATIENT** | **TREATMENT_RECORD** | Medical Therapy | 1 : N | `TREATMENT_RECORD.Patient_ID` | A patient receives multiple treatments or therapies. |
| **TREATMENT** | **TREATMENT_RECORD**| Procedure Execution | 1 : N | `TREATMENT_RECORD.Treatment_ID`| A therapy procedure is administered to multiple patients. |
| **DOCTOR** | **TREATMENT_RECORD**| Procedure Execution | 1 : N | `TREATMENT_RECORD.Doctor_ID` | A doctor administers or oversees multiple treatments. |

---

### 3. Many-to-Many (M:N) Relationship Resolution

1. **PATIENT and MEDICAL_TEST (M:N):**
   - A single patient can undergo multiple medical tests (e.g., ECG, CBC, MRI).
   - A single medical test can be administered to many patients.
   - **Resolution:** Resolved by junction table `TEST_RECORD`, which adds context: `Test_Date`, `Test_Result`, `Status`, and prescribing `Doctor_ID`.

2. **PATIENT and TREATMENT (M:N):**
   - A single patient can receive multiple medical treatments over time.
   - A treatment (e.g., Chemotherapy, Angioplasty, Dialysis) is administered to many patients.
   - **Resolution:** Resolved by junction table `TREATMENT_RECORD`, recording `Treatment_Date`, administering `Doctor_ID`, and clinical `Remarks`.

3. **PATIENT and DOCTOR (M:N via Multiple Clinical Pathways):**
   - A patient interacts with many doctors (Consultants, Examining Doctors, Pathologists, Surgeons).
   - Resolved across three separate functional contexts:
     - Inpatient Supervision: `ADMISSION`
     - Routine/Ward Checkups: `EXAMINATION`
     - Diagnostic & Procedure execution: `TEST_RECORD` and `TREATMENT_RECORD`
