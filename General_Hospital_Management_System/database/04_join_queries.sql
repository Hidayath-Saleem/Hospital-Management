-- ============================================================================
-- PROJECT: GENERAL HOSPITAL MANAGEMENT SYSTEM
-- EXPERIMENT 11: DATABASE MANAGEMENT SYSTEMS (DBMS)
-- SCRIPT 04: MULTI-TABLE JOIN QUERIES (Q11 TO Q15)
-- ============================================================================
-- Demonstrates INNER JOIN across master, transactional, and junction tables.
-- ============================================================================

SET PAGESIZE 50;
SET LINESIZE 140;
SET FEEDBACK ON;

-- ----------------------------------------------------------------------------
-- Q11. Display patient names along with their ward names.
-- Concepts: Joining ADMISSION with PATIENT and WARD using foreign keys.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q11: DISPLAY PATIENT NAMES ALONG WITH ASSIGNED WARD NAMES
PROMPT ========================================================================
SELECT a.Admission_ID, p.Patient_Name, w.Ward_Name, 
       TO_CHAR(a.Admission_Date, 'YYYY-MM-DD') AS Admission_Date
FROM ADMISSION a
JOIN PATIENT p ON a.Patient_ID = p.Patient_ID
JOIN WARD w ON a.Ward_ID = w.Ward_ID
ORDER BY a.Admission_ID;

-- ----------------------------------------------------------------------------
-- Q12. Display patient names, consultant names and admission dates.
-- Concepts: Multi-table JOIN linking ADMISSION to PATIENT and supervising DOCTOR.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q12: DISPLAY PATIENT NAMES, CONSULTANT NAMES, AND ADMISSION DATES
PROMPT ========================================================================
SELECT a.Admission_ID, p.Patient_Name, d.Doctor_Name AS Consultant_Name,
       d.Specialization, TO_CHAR(a.Admission_Date, 'YYYY-MM-DD') AS Admission_Date
FROM ADMISSION a
JOIN PATIENT p ON a.Patient_ID = p.Patient_ID
JOIN DOCTOR d ON a.Consultant_ID = d.Doctor_ID
ORDER BY a.Admission_ID;

-- ----------------------------------------------------------------------------
-- Q13. Display patients along with their referring GP names.
-- Concepts: INNER JOIN connecting ADMISSION, PATIENT, and external GP clinic.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q13: DISPLAY PATIENTS ALONG WITH REFERRING GP AND CLINIC
PROMPT ========================================================================
SELECT a.Admission_ID, p.Patient_Name, g.GP_Name, g.Clinic_Name, a.Admission_Reason
FROM ADMISSION a
JOIN PATIENT p ON a.Patient_ID = p.Patient_ID
JOIN GP g ON a.GP_ID = g.GP_ID
ORDER BY a.Admission_ID;

-- ----------------------------------------------------------------------------
-- Q14. Display examination details with patient and doctor names.
-- Concepts: Joining clinical transaction entity EXAMINATION to PATIENT and DOCTOR.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q14: DISPLAY CLINICAL EXAMINATIONS WITH PATIENT AND DOCTOR NAMES
PROMPT ========================================================================
SELECT e.Examination_ID, p.Patient_Name, d.Doctor_Name, 
       TO_CHAR(e.Examination_Date, 'YYYY-MM-DD') AS Exam_Date,
       e.Findings, e.Remarks
FROM EXAMINATION e
JOIN PATIENT p ON e.Patient_ID = p.Patient_ID
JOIN DOCTOR d ON e.Doctor_ID = d.Doctor_ID
ORDER BY e.Examination_ID;

-- ----------------------------------------------------------------------------
-- Q15. Display medical tests undergone by each patient along with results.
-- Concepts: Junction table TEST_RECORD resolving M:N relationship between
--           PATIENT and MEDICAL_TEST with test outcome status.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q15: DISPLAY MEDICAL TESTS UNDERGONE BY EACH PATIENT WITH RESULTS
PROMPT ========================================================================
SELECT tr.Test_Record_ID, p.Patient_Name, mt.Test_Name, 
       tr.Test_Result, tr.Status,
       TO_CHAR(tr.Test_Date, 'YYYY-MM-DD') AS Test_Date
FROM TEST_RECORD tr
JOIN PATIENT p ON tr.Patient_ID = p.Patient_ID
JOIN MEDICAL_TEST mt ON tr.Test_ID = mt.Test_ID
ORDER BY tr.Test_Record_ID;
