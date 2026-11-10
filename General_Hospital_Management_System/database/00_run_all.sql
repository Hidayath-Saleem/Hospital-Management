-- ============================================================================
-- PROJECT: GENERAL HOSPITAL MANAGEMENT SYSTEM
-- EXPERIMENT 11: DATABASE MANAGEMENT SYSTEMS (DBMS)
-- SCRIPT 00: MASTER RUNNER SCRIPT (RUN ALL IN ORACLE SQL)
-- ============================================================================
-- Description: Executes the complete project sequentially in Oracle:
--   1. Drop & Recreate all 10 Tables with Constraints (01_create_tables.sql)
--   2. Insert all 141 Sample Records across 10 Tables (02_insert_sample_data.sql)
--   3. Execute Basic & WHERE Queries Q1 - Q10 (03_basic_queries.sql)
--   4. Execute Multi-Table JOIN Queries Q11 - Q15 (04_join_queries.sql)
--   5. Execute Aggregate Queries Q16 - Q20 (05_aggregate_queries.sql)
--   6. Execute Advanced Subqueries Q21 - Q26 (06_advanced_queries.sql)
--   7. Run Constraint & Integrity Validation Tests (07_testing_queries.sql)
-- ============================================================================

SET ECHO OFF;
SET FEEDBACK ON;
SET HEADING ON;
SET LINESIZE 140;
SET PAGESIZE 50;
SET SERVEROUTPUT ON;

PROMPT ========================================================================
PROMPT STARTING GENERAL HOSPITAL MANAGEMENT SYSTEM - EXPERIMENT 11 DBMS
PROMPT ========================================================================

-- STEP 1: CREATE TABLES
PROMPT [STEP 1/7] Creating 10 Relational Tables & Constraints...
@@01_create_tables.sql;

-- STEP 2: INSERT SAMPLE DATA
PROMPT [STEP 2/7] Inserting 141 Sample Records...
@@02_insert_sample_data.sql;

-- STEP 3: RUN BASIC QUERIES Q1 - Q10
PROMPT [STEP 3/7] Running Queries Q1 to Q10 (Basic, WHERE, ORDER BY, LIKE)...
@@03_basic_queries.sql;

-- STEP 4: RUN JOIN QUERIES Q11 - Q15
PROMPT [STEP 4/7] Running Queries Q11 to Q15 (Multi-Table Joins)...
@@04_join_queries.sql;

-- STEP 5: RUN AGGREGATE QUERIES Q16 - Q20
PROMPT [STEP 5/7] Running Queries Q16 to Q20 (Aggregate Functions & GROUP BY)...
@@05_aggregate_queries.sql;

-- STEP 6: RUN ADVANCED QUERIES Q21 - Q26
PROMPT [STEP 6/7] Running Queries Q21 to Q26 (HAVING, Correlated EXISTS, Subqueries)...
@@06_advanced_queries.sql;

-- STEP 7: RUN CONSTRAINT TESTS
PROMPT [STEP 7/7] Running Constraint Integrity & Failure Tests...
@@07_testing_queries.sql;

PROMPT ========================================================================
PROMPT EXPERIMENT 11 EXECUTION COMPLETED SUCCESSFULLY!
PROMPT ALL 10 TABLES CREATED, DATA COMMITTED, AND 26 QUERIES EXECUTED.
PROMPT ========================================================================
