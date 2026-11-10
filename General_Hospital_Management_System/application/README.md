# Hospital Management Web Application
## Full-Stack React + Oracle Database Relational Architecture

### Architecture Overview
This application serves as an interactive GUI for hospital administration and a live educational laboratory for DBMS Experiment 11:
1. **Interactive Hospital Operations:**
   - **Patient Management:** CRUD operations on the `PATIENT` master table with `ON DELETE CASCADE` simulations.
   - **Ward & Bed Management:** Inpatient capacity monitoring and real-time bed utilization rates.
   - **Admission Portal:** Inpatient admissions linking patients, wards, consultants (`DOCTOR`), and community referrals (`GP`).
   - **Clinical Medical Records:** Capturing clinical checkups (`EXAMINATION`), lab investigations (`TEST_RECORD`), and surgeries (`TREATMENT_RECORD`).
2. **Oracle SQL Execution Studio:**
   - All 26 benchmark queries preloaded with 1-click execution.
   - Formatted results grid, query duration metrics, and CSV export.
   - Custom SQL query input and execution against the relational schema.
3. **Database Architecture & Theory:**
   - Interactive ER diagram with keys and cardinality rules.
   - Step-by-step Normalization (0NF → 1NF → 2NF → 3NF) with functional dependencies.
   - 25+ Viva preparation questions with examiner tips.
   - 8 automated constraint integrity test cases.

### Running Locally
To launch the interactive application in development mode:
```bash
npm install
npm run dev
```
The server will start at `http://localhost:3000`.

### Connecting to Production Oracle Database
To connect this interface to an actual Oracle Database instance (Oracle XE, 19c, 21c, or Autonomous Database), configure an Express/Python backend running node-oracledb or cx_Oracle using the connection string:
```
username/password@localhost:1521/XEPDB1
```
All DDL and DML scripts required for initialization reside in `/General_Hospital_Management_System/database/`.
