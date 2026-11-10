-- ============================================================================
-- PROJECT: GENERAL HOSPITAL MANAGEMENT SYSTEM
-- EXPERIMENT 11: DATABASE MANAGEMENT SYSTEMS (DBMS)
-- SCRIPT 05: AGGREGATE FUNCTION QUERIES (Q16 TO Q20)
-- ============================================================================
-- Demonstrates COUNT, SUM, AVG, MIN, MAX, GROUP BY, NVL, and ROUND functions.
-- ============================================================================

SET PAGESIZE 50;
SET LINESIZE 140;
SET FEEDBACK ON;

-- ----------------------------------------------------------------------------
-- Q16. Count the total number of patients in the hospital.
-- Concepts: Scalar COUNT(*) aggregate evaluating table cardinality.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q16: COUNT TOTAL REGISTERED PATIENTS IN THE HOSPITAL
PROMPT ========================================================================
SELECT COUNT(*) AS Total_Registered_Patients
FROM PATIENT;

-- ----------------------------------------------------------------------------
-- Q17. Find the total number of patients admitted to each ward.
-- Concepts: LEFT OUTER JOIN with GROUP BY and COUNT() to evaluate occupancy.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q17: TOTAL PATIENT ADMISSIONS PER WARD
PROMPT ========================================================================
SELECT w.Ward_Name, COUNT(a.Admission_ID) AS Total_Admissions
FROM WARD w
LEFT JOIN ADMISSION a ON w.Ward_ID = a.Ward_ID
GROUP BY w.Ward_Name
ORDER BY Total_Admissions DESC, w.Ward_Name;

-- ----------------------------------------------------------------------------
-- Q18. Calculate the average cost of all treatments.
-- Concepts: ROUND(), AVG(), MIN(), MAX() functions applied to financial tariffs.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q18: AVERAGE, MINIMUM, AND MAXIMUM TREATMENT COSTS
PROMPT ========================================================================
SELECT ROUND(AVG(Cost), 2) AS Average_Treatment_Cost, 
       MIN(Cost) AS Min_Cost, 
       MAX(Cost) AS Max_Cost
FROM TREATMENT;

-- ----------------------------------------------------------------------------
-- Q19. Display the number of patients examined by each doctor.
-- Concepts: LEFT JOIN combined with GROUP BY over multiple columns to count workload.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q19: NUMBER OF EXAMINATIONS PERFORMED BY EACH DOCTOR
PROMPT ========================================================================
SELECT d.Doctor_Name, d.Specialization, COUNT(e.Examination_ID) AS Total_Examinations
FROM DOCTOR d
LEFT JOIN EXAMINATION e ON d.Doctor_ID = e.Doctor_ID
GROUP BY d.Doctor_Name, d.Specialization
ORDER BY Total_Examinations DESC, d.Doctor_Name;

-- ----------------------------------------------------------------------------
-- Q20. Find the total cost of medical tests performed for each patient.
-- Concepts: Multi-table LEFT JOIN, SUM(), and Oracle NVL() handling null values.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q20: TOTAL DIAGNOSTIC TEST COST PER PATIENT
PROMPT ========================================================================
SELECT p.Patient_ID, p.Patient_Name, COUNT(tr.Test_Record_ID) AS Total_Tests,
       NVL(SUM(mt.Test_Cost), 0) AS Total_Diagnostic_Cost
FROM PATIENT p
LEFT JOIN TEST_RECORD tr ON p.Patient_ID = tr.Patient_ID
LEFT JOIN MEDICAL_TEST mt ON tr.Test_ID = mt.Test_ID
GROUP BY p.Patient_ID, p.Patient_Name
ORDER BY Total_Diagnostic_Cost DESC;
