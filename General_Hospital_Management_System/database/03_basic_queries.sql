-- ============================================================================
-- PROJECT: GENERAL HOSPITAL MANAGEMENT SYSTEM
-- EXPERIMENT 11: DATABASE MANAGEMENT SYSTEMS (DBMS)
-- SCRIPT 03: BASIC QUERIES (Q1 TO Q5) & WHERE / ORDER BY (Q6 TO Q10)
-- ============================================================================
-- Format: SQL*Plus / SQL Developer executable commands with formatted outputs.
-- ============================================================================

SET PAGESIZE 50;
SET LINESIZE 120;
SET FEEDBACK ON;

-- ----------------------------------------------------------------------------
-- Q1. Display all patient details.
-- Concepts: Basic SELECT statement projecting all core attributes from PATIENT.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q1: DISPLAY ALL PATIENT DETAILS
PROMPT ========================================================================
SELECT Patient_ID, Patient_Name, TO_CHAR(Date_of_Birth, 'YYYY-MM-DD') AS DOB, 
       Gender, Phone, Address, Blood_Group
FROM PATIENT
ORDER BY Patient_ID;

-- ----------------------------------------------------------------------------
-- Q2. Display all available wards.
-- Concepts: Projection of ward department capacity and physical locations.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q2: DISPLAY ALL AVAILABLE WARDS
PROMPT ========================================================================
SELECT Ward_ID, Ward_Name, Ward_Type, Location, Capacity
FROM WARD
ORDER BY Ward_ID;

-- ----------------------------------------------------------------------------
-- Q3. Display the names and specializations of all doctors.
-- Concepts: Column projection and multiple-column sorting in DOCTOR.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q3: DISPLAY DOCTOR NAMES AND SPECIALIZATIONS
PROMPT ========================================================================
SELECT Doctor_ID, Doctor_Name, Specialization, Phone, Email
FROM DOCTOR
ORDER BY Specialization, Doctor_Name;

-- ----------------------------------------------------------------------------
-- Q4. Display all patients admitted to the hospital.
-- Concepts: DISTINCT keyword combined with an INNER JOIN to eliminate duplicates.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q4: DISPLAY DISTINCT PATIENTS ADMITTED TO HOSPITAL
PROMPT ========================================================================
SELECT DISTINCT p.Patient_ID, p.Patient_Name, p.Gender, p.Blood_Group
FROM PATIENT p
JOIN ADMISSION a ON p.Patient_ID = a.Patient_ID
ORDER BY p.Patient_ID;

-- ----------------------------------------------------------------------------
-- Q5. Display patients belonging to the Oncology ward.
-- Concepts: 3-table join filtering records matching a specific ward name.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q5: DISPLAY PATIENTS BELONGING TO ONCOLOGY WARD
PROMPT ========================================================================
SELECT DISTINCT p.Patient_ID, p.Patient_Name, w.Ward_Name, a.Admission_Reason
FROM PATIENT p
JOIN ADMISSION a ON p.Patient_ID = a.Patient_ID
JOIN WARD w ON a.Ward_ID = w.Ward_ID
WHERE w.Ward_Name = 'Oncology Ward'
ORDER BY p.Patient_ID;

-- ----------------------------------------------------------------------------
-- Q6. Display patients admitted after a particular date.
-- Concepts: Date comparison using TO_DATE() conversion in the WHERE clause.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q6: DISPLAY PATIENTS ADMITTED ON OR AFTER 2023-10-01
PROMPT ========================================================================
SELECT a.Admission_ID, p.Patient_Name, 
       TO_CHAR(a.Admission_Date, 'YYYY-MM-DD') AS Admission_Date, 
       a.Admission_Reason
FROM ADMISSION a
JOIN PATIENT p ON a.Patient_ID = p.Patient_ID
WHERE a.Admission_Date >= TO_DATE('2023-10-01', 'YYYY-MM-DD')
ORDER BY a.Admission_Date ASC;

-- ----------------------------------------------------------------------------
-- Q7. Display patients in alphabetical order.
-- Concepts: ORDER BY clause sorting varchar columns in ascending alphabetical order.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q7: DISPLAY PATIENTS IN ALPHABETICAL ORDER
PROMPT ========================================================================
SELECT Patient_Name, TO_CHAR(Date_of_Birth, 'YYYY-MM-DD') AS DOB, Gender, Blood_Group
FROM PATIENT
ORDER BY Patient_Name ASC;

-- ----------------------------------------------------------------------------
-- Q8. Display doctors belonging to a particular specialization (Cardiology).
-- Concepts: String equality filter in WHERE clause against domain values.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q8: DISPLAY DOCTORS SPECIALIZING IN CARDIOLOGY
PROMPT ========================================================================
SELECT Doctor_ID, Doctor_Name, Specialization, Phone, Email
FROM DOCTOR
WHERE Specialization = 'Cardiology'
ORDER BY Doctor_ID;

-- ----------------------------------------------------------------------------
-- Q9. Display patients whose names start with a particular letter using LIKE ('A%').
-- Concepts: Pattern matching with LIKE and wildcard '%'.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q9: DISPLAY PATIENTS WHOSE NAMES START WITH 'A'
PROMPT ========================================================================
SELECT Patient_ID, Patient_Name, Gender, Phone, Blood_Group
FROM PATIENT
WHERE Patient_Name LIKE 'A%'
ORDER BY Patient_Name;

-- ----------------------------------------------------------------------------
-- Q10. Display patients whose age is above 40.
-- Concepts: Oracle built-in MONTHS_BETWEEN() and TRUNC() for age calculation.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q10: DISPLAY PATIENTS WHOSE AGE IS ABOVE 40
PROMPT ========================================================================
SELECT Patient_ID, Patient_Name, TO_CHAR(Date_of_Birth, 'YYYY-MM-DD') AS DOB,
       TRUNC(MONTHS_BETWEEN(SYSDATE, Date_of_Birth) / 12) AS Age
FROM PATIENT
WHERE TRUNC(MONTHS_BETWEEN(SYSDATE, Date_of_Birth) / 12) > 40
ORDER BY Age DESC;
