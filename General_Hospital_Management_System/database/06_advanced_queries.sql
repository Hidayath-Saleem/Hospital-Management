-- ============================================================================
-- PROJECT: GENERAL HOSPITAL MANAGEMENT SYSTEM
-- EXPERIMENT 11: DATABASE MANAGEMENT SYSTEMS (DBMS)
-- SCRIPT 06: ADVANCED SQL QUERIES (Q21 TO Q26)
-- ============================================================================
-- Demonstrates HAVING, Correlated Subqueries, EXISTS, NOT EXISTS,
-- and In-line Analytic Subqueries.
-- ============================================================================

SET PAGESIZE 50;
SET LINESIZE 140;
SET FEEDBACK ON;

-- ----------------------------------------------------------------------------
-- Q21. Find patients who have undergone more than two medical tests (HAVING).
-- Concepts: Post-aggregation filtering using HAVING COUNT() > 2.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q21: PATIENTS WHO HAVE UNDERGONE MORE THAN TWO MEDICAL TESTS
PROMPT ========================================================================
SELECT p.Patient_ID, p.Patient_Name, COUNT(tr.Test_Record_ID) AS Test_Count
FROM PATIENT p
JOIN TEST_RECORD tr ON p.Patient_ID = tr.Patient_ID
GROUP BY p.Patient_ID, p.Patient_Name
HAVING COUNT(tr.Test_Record_ID) > 2
ORDER BY Test_Count DESC;

-- ----------------------------------------------------------------------------
-- Q22. Display doctors who have examined at least one patient (EXISTS).
-- Concepts: Correlated subquery with EXISTS predicate testing child row existence.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q22: DOCTORS WHO HAVE CONDUCTED AT LEAST ONE CLINICAL EXAMINATION
PROMPT ========================================================================
SELECT d.Doctor_ID, d.Doctor_Name, d.Specialization
FROM DOCTOR d
WHERE EXISTS (
    SELECT 1
    FROM EXAMINATION e
    WHERE e.Doctor_ID = d.Doctor_ID
)
ORDER BY d.Doctor_ID;

-- ----------------------------------------------------------------------------
-- Q23. Find patients who have never undergone a medical test (NOT EXISTS).
-- Concepts: Anti-join using NOT EXISTS correlated subquery.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q23: PATIENTS WHO HAVE NEVER UNDERGONE ANY MEDICAL TEST
PROMPT ========================================================================
SELECT p.Patient_ID, p.Patient_Name, p.Gender, p.Phone
FROM PATIENT p
WHERE NOT EXISTS (
    SELECT 1
    FROM TEST_RECORD tr
    WHERE tr.Patient_ID = p.Patient_ID
);

-- ----------------------------------------------------------------------------
-- Q24. Display the patient who has undergone the maximum number of treatments.
-- Concepts: Nested subquery aggregation with MAX() inside the HAVING clause.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q24: PATIENT WHO HAS RECEIVED THE MAXIMUM NUMBER OF TREATMENTS
PROMPT ========================================================================
SELECT p.Patient_ID, p.Patient_Name, COUNT(tr.Treatment_Record_ID) AS Total_Treatments
FROM PATIENT p
JOIN TREATMENT_RECORD tr ON p.Patient_ID = tr.Patient_ID
GROUP BY p.Patient_ID, p.Patient_Name
HAVING COUNT(tr.Treatment_Record_ID) = (
    SELECT MAX(treatment_count)
    FROM (
        SELECT COUNT(Treatment_Record_ID) AS treatment_count
        FROM TREATMENT_RECORD
        GROUP BY Patient_ID
    )
);

-- ----------------------------------------------------------------------------
-- Q25. Display the details of patients who are currently admitted (not discharged).
-- Concepts: Multi-table JOIN with IS NULL filter on Discharge_Date.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q25: CURRENTLY ADMITTED PATIENTS (ACTIVE INPATIENTS)
PROMPT ========================================================================
SELECT a.Admission_ID, p.Patient_Name, w.Ward_Name, d.Doctor_Name AS Consultant,
       TO_CHAR(a.Admission_Date, 'YYYY-MM-DD') AS Admission_Date, a.Admission_Reason
FROM ADMISSION a
JOIN PATIENT p ON a.Patient_ID = p.Patient_ID
JOIN WARD w ON a.Ward_ID = w.Ward_ID
JOIN DOCTOR d ON a.Consultant_ID = d.Doctor_ID
WHERE a.Discharge_Date IS NULL
ORDER BY a.Admission_Date ASC;

-- ----------------------------------------------------------------------------
-- Q26. Find the most occupied ward based on current admissions.
-- Concepts: Filtering active admissions, calculating bed occupancy rate,
--           and maximizing count via inline subquery.
-- ----------------------------------------------------------------------------
PROMPT ========================================================================
PROMPT Q26: MOST OCCUPIED WARD BASED ON CURRENT ACTIVE ADMISSIONS
PROMPT ========================================================================
SELECT w.Ward_ID, w.Ward_Name, w.Capacity, COUNT(a.Admission_ID) AS Active_Patients,
       ROUND((COUNT(a.Admission_ID) / w.Capacity) * 100, 2) AS Occupancy_Percentage
FROM WARD w
JOIN ADMISSION a ON w.Ward_ID = a.Ward_ID
WHERE a.Discharge_Date IS NULL
GROUP BY w.Ward_ID, w.Ward_Name, w.Capacity
HAVING COUNT(a.Admission_ID) = (
    SELECT MAX(active_count)
    FROM (
        SELECT COUNT(Admission_ID) AS active_count
        FROM ADMISSION
        WHERE Discharge_Date IS NULL
        GROUP BY Ward_ID
    )
);
