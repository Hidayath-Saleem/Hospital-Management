-- ============================================================================
-- PROJECT: GENERAL HOSPITAL MANAGEMENT SYSTEM
-- EXPERIMENT 11: DATABASE MANAGEMENT SYSTEMS (DBMS)
-- SCRIPT 07: CONSTRAINT TESTING & INTEGRITY VALIDATION
-- ============================================================================
-- Contains positive and negative test cases verifying that Oracle enforces
-- Primary Key, Foreign Key, Check Constraints, NOT NULL, and Referential Actions.
-- ============================================================================

SET SERVEROUTPUT ON;

PROMPT ========================================================================
PROMPT TEST CASE 1: PRIMARY KEY UNIQUENESS CONSTRAINT (PK_PATIENT)
PROMPT Expected: ORA-00001: unique constraint violated
PROMPT ========================================================================
BEGIN
    INSERT INTO PATIENT (Patient_ID, Patient_Name, Date_of_Birth, Gender, Phone, Address, Blood_Group)
    VALUES (101, 'Duplicate ID Test', TO_DATE('1990-01-01', 'YYYY-MM-DD'), 'Male', '9999999999', 'Test City', 'O+');
    DBMS_OUTPUT.PUT_LINE('FAIL: Duplicate PK was inserted unexpectedly!');
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        DBMS_OUTPUT.PUT_LINE('SUCCESS: ORA-00001 Caught! Primary Key uniqueness enforced on Patient_ID.');
END;
/

PROMPT ========================================================================
PROMPT TEST CASE 2: FOREIGN KEY ORPHAN RECORD PREVENTION (FK_ADM_PATIENT)
PROMPT Expected: ORA-02291: integrity constraint violated - parent key not found
PROMPT ========================================================================
BEGIN
    INSERT INTO ADMISSION (Admission_ID, Patient_ID, Ward_ID, GP_ID, Consultant_ID, Admission_Date, Discharge_Date, Admission_Reason)
    VALUES (999, 9999, 1, 301, 201, TO_DATE('2023-11-01', 'YYYY-MM-DD'), NULL, 'Invalid Non-existent Patient');
    DBMS_OUTPUT.PUT_LINE('FAIL: Orphan foreign key was accepted unexpectedly!');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2291 THEN
            DBMS_OUTPUT.PUT_LINE('SUCCESS: ORA-02291 Caught! Foreign Key constraint blocked non-existent Patient_ID 9999.');
        ELSE
            DBMS_OUTPUT.PUT_LINE('Exception caught: ' || SQLERRM);
        END IF;
END;
/

PROMPT ========================================================================
PROMPT TEST CASE 3: CHECK CONSTRAINT VALIDATION (CHK_PATIENT_GENDER)
PROMPT Expected: ORA-02290: check constraint violated
PROMPT ========================================================================
BEGIN
    INSERT INTO PATIENT (Patient_ID, Patient_Name, Date_of_Birth, Gender, Phone, Address, Blood_Group)
    VALUES (999, 'Invalid Gender Test', TO_DATE('1990-01-01', 'YYYY-MM-DD'), 'UnknownGender', '9999988888', 'Test City', 'O+');
    DBMS_OUTPUT.PUT_LINE('FAIL: Invalid gender check was bypassed!');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2290 THEN
            DBMS_OUTPUT.PUT_LINE('SUCCESS: ORA-02290 Caught! Check Constraint blocked invalid gender value.');
        ELSE
            DBMS_OUTPUT.PUT_LINE('Exception caught: ' || SQLERRM);
        END IF;
END;
/

PROMPT ========================================================================
PROMPT TEST CASE 4: CHECK CONSTRAINT ON DISCHARGE DATE (CHK_ADM_DISCHARGE)
PROMPT Expected: ORA-02290: check constraint violated (Discharge < Admission)
PROMPT ========================================================================
BEGIN
    INSERT INTO ADMISSION (Admission_ID, Patient_ID, Ward_ID, GP_ID, Consultant_ID, Admission_Date, Discharge_Date, Admission_Reason)
    VALUES (998, 101, 1, 301, 201, TO_DATE('2023-10-10', 'YYYY-MM-DD'), TO_DATE('2023-10-05', 'YYYY-MM-DD'), 'Invalid Dates Test');
    DBMS_OUTPUT.PUT_LINE('FAIL: Invalid discharge date accepted!');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2290 THEN
            DBMS_OUTPUT.PUT_LINE('SUCCESS: ORA-02290 Caught! Check Constraint prevented Discharge_Date < Admission_Date.');
        ELSE
            DBMS_OUTPUT.PUT_LINE('Exception caught: ' || SQLERRM);
        END IF;
END;
/

PROMPT ========================================================================
PROMPT TEST CASE 5: NOT NULL CONSTRAINT ENFORCEMENT
PROMPT Expected: ORA-01400: cannot insert NULL into ("...PATIENT_NAME")
PROMPT ========================================================================
BEGIN
    INSERT INTO PATIENT (Patient_ID, Patient_Name, Date_of_Birth, Gender, Phone, Address, Blood_Group)
    VALUES (997, NULL, TO_DATE('1990-01-01', 'YYYY-MM-DD'), 'Male', '9999977777', 'Test City', 'O+');
    DBMS_OUTPUT.PUT_LINE('FAIL: NULL name accepted!');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -1400 THEN
            DBMS_OUTPUT.PUT_LINE('SUCCESS: ORA-01400 Caught! NOT NULL constraint enforced on Patient_Name.');
        ELSE
            DBMS_OUTPUT.PUT_LINE('Exception caught: ' || SQLERRM);
        END IF;
END;
/

PROMPT ========================================================================
PROMPT ALL CONSTRAINT TESTS COMPLETED.
PROMPT ========================================================================
