import { validateSQL, executeSQL } from './sqlEngine'

// Test 1 — basic query
const r1 = executeSQL(`SELECT employee_id, first_name, last_name, salary FROM hr.employees ORDER BY salary DESC`)
console.log('Test 1 rows:', r1.rowCount, r1.rows[0])

// Test 2 — join query
const r2 = executeSQL(`SELECT emp.first_name, dept.department_name, emp.salary FROM hr.employees emp JOIN hr.departments dept ON emp.department_id = dept.department_id WHERE emp.salary > 10000`)
console.log('Test 2 rows:', r2.rowCount, r2.rows[0])

// Test 3 — invalid SQL
const r3 = executeSQL(`DROP TABLE hr.employees`)
console.log('Test 3 errors:', r3.errors)

// Test 4 — with params
const r4 = executeSQL(`SELECT * FROM hr.employees WHERE department_id = :p_department_id`, { p_department_id: 60 })
console.log('Test 4 IT dept:', r4.rowCount, 'rows')