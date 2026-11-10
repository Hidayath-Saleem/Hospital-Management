# General Hospital Management System
## Experiment 11 – Database Management Systems (DBMS)

### Project Overview
A complete, academic-grade **General Hospital Management System** designed for Oracle Database and implemented as an interactive full-stack learning platform.

### Directory Structure
```
General_Hospital_Management_System/
│
├── README.md                               # Project documentation & execution guide
├── report/
│   └── General_Hospital_Project_Report.md  # 15-section academic project report
│
├── database/
│   ├── 01_create_tables.sql                # Oracle DDL: creates all 10 tables & constraints
│   ├── 02_insert_sample_data.sql           # Oracle DML: 141 sample records across 10 tables
│   ├── 03_basic_queries.sql                # Q1 to Q10: Basic, WHERE, ORDER BY, LIKE
│   ├── 04_join_queries.sql                 # Q11 to Q15: Multi-table INNER & LEFT JOINs
│   ├── 05_aggregate_queries.sql            # Q16 to Q20: COUNT, SUM, AVG, MIN, MAX, GROUP BY
│   ├── 06_advanced_queries.sql             # Q21 to Q26: HAVING, EXISTS, NOT EXISTS, Subqueries
│   └── 07_testing_queries.sql              # Constraint verification & failure testing
│
├── diagrams/
│   ├── er_diagram.mmd                      # Mermaid format ER diagram
│   └── relational_schema.md                # Mathematical relational schema & cardinalities
│
├── viva/
│   └── Viva_Questions_and_Answers.md       # 25+ viva questions with examiner tips
│
└── application/                            # Interactive Web App & simulated Oracle engine
    └── (Hosted in web container root /src)
```

### Quick Start in Oracle SQL Developer / SQL*Plus
1. Connect to your Oracle Database instance:
   ```bash
   sqlplus username/password@localhost:1521/XEPDB1
   ```
2. Run table creation:
   ```sql
   @database/01_create_tables.sql
   ```
3. Insert sample data:
   ```sql
   @database/02_insert_sample_data.sql
   ```
4. Run queries:
   ```sql
   @database/03_basic_queries.sql
   @database/04_join_queries.sql
   @database/05_aggregate_queries.sql
   @database/06_advanced_queries.sql
   ```
5. Test constraints:
   ```sql
   @database/07_testing_queries.sql
   ```

### Web Application Features
- **Dashboard:** Inpatient census, bed occupancy by ward, doctor workload, quick action modals.
- **Patient Management:** Register new patients, edit demographics, search, filter by blood group.
- **Ward Management:** Real-time capacity utilization, floor breakdown, inpatient tracking.
- **Doctor Directory:** Medical specialties, contact info, clinical workload tracking.
- **Admission Portal:** Admit patients, assign wards and lead consultants, track GP referrals, discharge inpatients.
- **Medical Records:** Log clinical examinations, order diagnostic tests, record lab findings, log treatments.
- **Interactive SQL Studio:** Run any of the 26 preloaded benchmark queries or write custom SQL against the hospital relational engine with live query plan statistics and CSV export.
- **Interactive ER Diagram & Normalization Visualizer:** View entity relations, keys, cardinality markers, and 1NF -> 2NF -> 3NF decomposition steps.
- **Viva Preparation Suite:** Interactive flashcards with search and quiz modes.
