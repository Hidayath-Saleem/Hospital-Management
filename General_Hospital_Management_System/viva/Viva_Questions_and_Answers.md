# VIVA VOCE EXAMINATION PREPARATION GUIDE
## Experiment 11 – General Hospital Management System (DBMS)
### 25+ Comprehensive Questions, Conceptual Explanations & Query Execution Walkthrough

---

### Q1. What is a Database Management System (DBMS)?
**Answer:**
A Database Management System (DBMS) is specialized software that enables users and applications to define, create, maintain, and control access to structured data. A relational DBMS (RDBMS) like Oracle organizes data into two-dimensional tables (relations) consisting of rows (tuples) and columns (attributes). It guarantees data consistency and reliability through **ACID properties**:
- **Atomicity:** All operations in a transaction succeed or none do.
- **Consistency:** Data moves from one valid state to another satisfying all integrity constraints.
- **Isolation:** Concurrent transactions execute without interfering with one another.
- **Durability:** Once committed, transaction changes survive system failures.

---

### Q2. What is an Entity and an Attribute in an ER Model?
**Answer:**
- **Entity:** A real-world object or concept that has an independent existence and is distinguishable from other objects (e.g., `PATIENT`, `DOCTOR`, `WARD`). In the ER diagram, an entity is represented by a rectangle.
- **Attribute:** A particular property or characteristic that describes an entity (e.g., `Patient_Name`, `Blood_Group`, `Capacity`). In the ER diagram, attributes are represented by ovals connected to their respective entity rectangles.

---

### Q3. What is a Primary Key and how does it differ from a Unique Key?
**Answer:**
- **Primary Key (PK):** A column or set of columns chosen to uniquely identify each tuple in a relation. It is mandatory, cannot contain `NULL` values, and each table can possess only **one** primary key.
- **Unique Key (UK):** A column or set of columns that prevents duplicate non-null entries. A table can have multiple unique keys, and depending on the RDBMS, unique columns can permit one or more `NULL` values.
- In our project: `Patient_ID` is the Primary Key of `PATIENT`, while `Phone` is configured with a `UNIQUE` constraint.

---

### Q4. What is a Foreign Key and what is Referential Integrity?
**Answer:**
- **Foreign Key (FK):** An attribute in a child relation that references the primary key of a parent relation, establishing a logical link between them.
- **Referential Integrity:** A fundamental relational database rule stating that any foreign key value in a child table must either match an existing primary key value in the referenced parent table or be `NULL`.
- In our schema: `ADMISSION.Patient_ID` references `PATIENT.Patient_ID`. If a user attempts to insert an admission with `Patient_ID = 9999` (which doesn't exist), Oracle raises error `ORA-02291: integrity constraint violated - parent key not found`.

---

### Q5. What is Cardinality in Database Relationships?
**Answer:**
Cardinality defines the numerical constraints of relationships between entities:
1. **One-to-One (1:1):** Each occurrence of entity A relates to at most one occurrence of entity B.
2. **One-to-Many (1:N):** An occurrence of entity A relates to multiple occurrences of entity B, but entity B relates to only one occurrence of A (e.g., One `WARD` contains many `ADMISSION` records).
3. **Many-to-Many (M:N):** Multiple occurrences of entity A can relate to multiple occurrences of entity B (e.g., Patients and Medical Tests). M:N relationships cannot be directly modeled with a foreign key without data redundancy and must be decomposed using a **Junction Table**.

---

### Q6. What is Normalization and why is it essential?
**Answer:**
Normalization is a systematic mathematical design process that decomposes complex, redundant relations into smaller, well-structured relations with minimal redundancy and no update, insertion, or deletion anomalies:
- **Insertion Anomaly:** Inability to record certain information without creating artificial or dummy data.
- **Deletion Anomaly:** Unintended loss of crucial auxiliary data when a primary tuple is deleted.
- **Update Anomaly:** Multiple copies of the same data item requiring repetitive updates, risking data inconsistency.

---

### Q7. Explain First Normal Form (1NF) with an example from this project.
**Answer:**
A relation is in **1NF** if and only if all attribute values are atomic (indivisible) and there are no repeating groups or multivalued columns.
- **Violation:** A single patient table row storing `Medical_Tests_Taken = "ECG, CBC, Chest X-Ray"`.
- **1NF Solution:** Every test instance is split into distinct atomic rows, each with one test value, or moved into a dedicated related relation.

---

### Q8. Explain Second Normal Form (2NF) and Partial Dependency.
**Answer:**
A relation is in **2NF** if it is in 1NF and every non-prime attribute is fully functionally dependent on the entire composite candidate key (no **partial functional dependency**).
- **Violation:** Suppose we created an unnormalized table `TEST_RECORD_DENORM(Patient_ID, Test_ID, Patient_Name, Test_Name, Result)`. The composite primary key is `(Patient_ID, Test_ID)`. However, `Patient_Name` depends solely on `Patient_ID`, and `Test_Name` depends solely on `Test_ID`. This is a partial dependency.
- **2NF Solution:** Decompose into `PATIENT`, `MEDICAL_TEST`, and `TEST_RECORD`. In `TEST_RECORD`, `Result` depends on both `Patient_ID` and `Test_ID`.

---

### Q9. Explain Third Normal Form (3NF) and Transitive Dependency.
**Answer:**
A relation is in **3NF** if it is in 2NF and no non-prime attribute is transitively dependent on the primary key ($X \to Y$ and $Y \to Z$, where $Z$ is not a candidate key).
- **Violation:** In an unnormalized admission record: `Admission_ID -> Ward_ID`, and `Ward_ID -> Capacity`. Here, `Capacity` is transitively dependent on `Admission_ID` via `Ward_ID`. If the capacity of Cardiology Ward changes, all historical admission records for that ward would need updating.
- **3NF Solution:** Isolate `Ward_ID -> Ward_Name, Capacity` into the dedicated `WARD` table and reference only `Ward_ID` in `ADMISSION`.

---

### Q10. What is a Junction Table (Bridge Entity) and where is it used in this system?
**Answer:**
A **Junction Table** (also known as an associative entity or bridge table) resolves a Many-to-Many ($M:N$) relationship into two One-to-Many ($1:N$) relationships.
In this project:
1. `TEST_RECORD`: Resolves $M:N$ between `PATIENT` and `MEDICAL_TEST`. It holds foreign keys `Patient_ID`, `Test_ID`, `Doctor_ID`, plus attributes `Test_Date`, `Test_Result`, and `Status`.
2. `TREATMENT_RECORD`: Resolves $M:N$ between `PATIENT` and `TREATMENT`. It holds `Patient_ID`, `Treatment_ID`, `Doctor_ID`, `Treatment_Date`, and `Remarks`.

---

### Q11. What is the difference between DELETE, TRUNCATE, and DROP?
**Answer:**
| Feature | DELETE | TRUNCATE | DROP |
| :--- | :--- | :--- | :--- |
| **Command Category** | DML (Data Manipulation Language) | DDL (Data Definition Language) | DDL (Data Definition Language) |
| **WHERE Clause** | Supported (removes selective rows) | Not supported (removes all rows) | Not applicable |
| **Rollback** | Can be rolled back (undo log generated) | Cannot be rolled back in standard SQL | Cannot be rolled back |
| **Triggers** | Fires `ON DELETE` database triggers | Does not fire triggers | Does not fire triggers |
| **Space Deallocation** | Space is retained for high-water mark | High-water mark reset, space freed | Entire table and metadata removed |
| **Speed** | Slower (row-by-row logging) | Very fast | Very fast |

---

### Q12. What is the difference between the WHERE and HAVING clauses in SQL?
**Answer:**
- **WHERE Clause:** Filters individual rows *before* any grouping or aggregate functions are executed. It cannot contain aggregate functions directly (e.g., `WHERE COUNT(*) > 2` is illegal).
- **HAVING Clause:** Filters grouped summary records *after* the `GROUP BY` clause has performed aggregation. It is specifically designed to filter on aggregate conditions (e.g., `HAVING COUNT(tr.Test_Record_ID) > 2`).

---

### Q13. Explain the differences between INNER JOIN, LEFT OUTER JOIN, and RIGHT OUTER JOIN.
**Answer:**
- **INNER JOIN:** Returns only rows where there is an exact match in both joined tables based on the join predicate.
- **LEFT OUTER JOIN:** Returns all records from the left table, along with matching columns from the right table. If no match exists, the right table's columns evaluate to `NULL`. (Example: Q17 uses `LEFT JOIN` on `WARD` to include wards with zero admissions).
- **RIGHT OUTER JOIN:** Returns all records from the right table, and matched rows from the left table (or `NULL` if unmatched).

---

### Q14. What is a Subquery and what is a Correlated Subquery?
**Answer:**
- **Subquery (Nested Query):** A `SELECT` statement enclosed inside another SQL statement. A non-correlated subquery is independent and executes once; its result is passed to the outer query.
- **Correlated Subquery:** A subquery that references one or more columns from the outer query. It cannot execute independently and is re-evaluated once for every candidate row processed by the outer query.
- Example from project: Q22 uses `WHERE EXISTS (SELECT 1 FROM EXAMINATION e WHERE e.Doctor_ID = d.Doctor_ID)` to evaluate doctors.

---

### Q15. What are SQL Aggregate Functions? Name the standard Oracle functions.
**Answer:**
Aggregate functions perform a calculation on a set of values across rows and return a single summary value.
Common Oracle aggregate functions:
1. `COUNT(*)` / `COUNT(col)`: Counts total rows or non-null values.
2. `SUM(col)`: Computes the arithmetic sum of numeric values.
3. `AVG(col)`: Computes the arithmetic mean of numeric values.
4. `MIN(col)`: Finds the minimum value (numeric, string, or date).
5. `MAX(col)`: Finds the maximum value.
*Note:* All aggregate functions except `COUNT(*)` ignore `NULL` values.

---

### Q16. Why is ADMISSION stored as a separate entity rather than an attribute of PATIENT?
**Answer:**
In a general hospital, a single patient can have multiple admissions over their lifetime to different wards, under different consultants, and for different medical complaints. If admission details were embedded inside the `PATIENT` table:
- Creating columns like `Admission_Date_1`, `Admission_Date_2` would violate **1NF** (repeating groups).
- Storing duplicate patient rows for every admission would create massive redundancy (violating **2NF/3NF**).
- Normalizing `ADMISSION` as a distinct entity with a $1:N$ relationship solves this cleanly.

---

### Q17. Why do we need an EXAMINATION table separate from ADMISSION?
**Answer:**
During a patient's hospital stay or outpatient care, they are typically examined multiple times across several days by different attending physicians (e.g., consultant rounds, emergency duty doctor, second opinions).
An `EXAMINATION` entity maintains a full chronological clinical log with timestamps, specific physical findings, and recommendations, without corrupting the overall admission dates.

---

### Q18. Why do we need TEST_RECORD separate from MEDICAL_TEST?
**Answer:**
`MEDICAL_TEST` is a static master catalog defining standard hospital diagnostic tests, descriptions, and procedure fees (e.g., "12-Lead ECG", Cost: ₹600).
`TEST_RECORD` is an operational transaction recording when a specific patient underwent that test, which doctor ordered it, the date, the clinical finding (e.g., "ST elevation V1-V4"), and the completion status.

---

### Q19. What CHECK constraints were implemented in this Oracle database?
**Answer:**
1. `CHK_PATIENT_GENDER`: `CHECK (Gender IN ('Male', 'Female', 'Other'))`
2. `CHK_PATIENT_BG`: Validates allowable ABO blood groups (`A+`, `A-`, `B+`, etc.)
3. `CHK_WARD_CAPACITY`: `CHECK (Capacity > 0)` ensuring physical validity.
4. `CHK_TEST_COST` & `CHK_TREAT_COST`: `CHECK (Cost >= 0)` preventing negative tariffs.
5. `CHK_TR_STATUS`: Restricts status to `'Pending'`, `'Completed'`, `'In Progress'`, or `'Cancelled'`.
6. `CHK_ADM_DISCHARGE`: `CHECK (Discharge_Date IS NULL OR Discharge_Date >= Admission_Date)`.

---

### Q20. Explain the role of the GP (General Practitioner) entity in this project.
**Answer:**
In modern health systems, patients are referred to secondary/tertiary hospital wards by external General Practitioners. Storing `GP` as an entity captures the referring doctor's name, clinic name, and phone number, satisfying administrative audit and GP referral tracking while preventing doctor data duplication.

---

### Q21. How do you handle NULL values in Oracle SQL arithmetic and display?
**Answer:**
In Oracle SQL, any mathematical operation involving `NULL` yields `NULL`.
To handle this safely:
- `NVL(expr1, expr2)`: Replaces `expr1` with `expr2` if `expr1` is `NULL` (e.g., `NVL(SUM(mt.Test_Cost), 0)` in Q20).
- `COALESCE(expr1, expr2, ...)`: Returns the first non-null expression.
- `IS NULL` / `IS NOT NULL`: Used in `WHERE` clauses because `= NULL` evaluates to Unknown.

---

### Q22. How does Oracle SQL handle date formatting and calculations?
**Answer:**
- `TO_DATE('2023-09-01', 'YYYY-MM-DD')`: Converts a string literal into Oracle's internal binary `DATE` format.
- `TO_CHAR(Date_Col, 'YYYY-MM-DD')`: Converts an internal `DATE` value to a formatted display string.
- `SYSDATE`: Returns the current server date and time.
- `MONTHS_BETWEEN(d1, d2)`: Computes the number of months between two dates, used in Q10 for exact patient age calculation: `TRUNC(MONTHS_BETWEEN(SYSDATE, Date_of_Birth) / 12)`.

---

### Q23. What is ON DELETE CASCADE and where is it used in this schema?
**Answer:**
`ON DELETE CASCADE` is a referential constraint option where deleting a parent row automatically deletes all corresponding child rows in dependent tables.
In our schema, if a `PATIENT` record is purged, their associated records in `ADMISSION`, `EXAMINATION`, `TEST_RECORD`, and `TREATMENT_RECORD` are automatically removed, preventing foreign key violation errors and orphan clinical data.

---

### Q24. How was Query 21 (Patients with more than 2 tests) constructed?
**Answer:**
```sql
SELECT p.Patient_ID, p.Patient_Name, COUNT(tr.Test_Record_ID) AS Test_Count
FROM PATIENT p
JOIN TEST_RECORD tr ON p.Patient_ID = tr.Patient_ID
GROUP BY p.Patient_ID, p.Patient_Name
HAVING COUNT(tr.Test_Record_ID) > 2
ORDER BY Test_Count DESC;
```
It joins `PATIENT` and `TEST_RECORD`, aggregates by patient identity, and uses `HAVING COUNT(...) > 2` to filter for high-utilization diagnostic patients.

---

### Q25. How do you execute this project in Oracle SQL Developer or SQL*Plus during viva?
**Answer:**
1. Open terminal and launch SQL*Plus: `sqlplus username/password@localhost:1521/xe`
2. Run table creation script: `@01_create_tables.sql`
3. Run sample data insertion script: `@02_insert_sample_data.sql`
4. Confirm row count: `SELECT COUNT(*) FROM PATIENT;` (returns 15)
5. Run query script: `@03_basic_queries.sql` or individual queries (e.g. Q11, Q21, Q26)
6. Run constraint validation: `@07_testing_queries.sql` to demonstrate error traps!

---

### Q26. Explain the Hospital ER Diagram structure in one minute for the examiner.
**Answer:**
"Our Hospital Management System models 10 normalized tables. The core entity is `PATIENT`. When a patient arrives, an `ADMISSION` record is created linking the patient to a `WARD`, an external referring `GP`, and an assigned lead `DOCTOR` (Consultant). During their stay, the patient undergoes clinical `EXAMINATIONS` conducted by doctors. Diagnostic tests and therapeutic procedures represent Many-to-Many relationships: we resolved these using two junction tables, `TEST_RECORD` (linking Patient, Medical Test, and Prescribing Doctor) and `TREATMENT_RECORD` (linking Patient, Treatment, and Administering Doctor). Every table is in 3NF and enforces full referential integrity."
