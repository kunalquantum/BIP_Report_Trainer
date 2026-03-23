// ─────────────────────────────────────────────────────────────
// BIP Trainer — Simulated Oracle SQL Engine
// Validates SQL, infers intent, returns realistic fake data
// ─────────────────────────────────────────────────────────────

// ── Fake Oracle table data ──────────────────────────────────

const TABLES = {
    'hr.employees': [
        { EMPLOYEE_ID: 100, FIRST_NAME: 'Steven', LAST_NAME: 'King', DEPARTMENT_ID: 90, JOB_ID: 'AD_PRES', SALARY: 24000, HIRE_DATE: '17-JUN-1987', EMAIL: 'SKING@corp.com', MANAGER_ID: null },
        { EMPLOYEE_ID: 101, FIRST_NAME: 'Neena', LAST_NAME: 'Kochar', DEPARTMENT_ID: 90, JOB_ID: 'AD_VP', SALARY: 17000, HIRE_DATE: '21-SEP-1989', EMAIL: 'NKOCHAR@corp.com', MANAGER_ID: 100 },
        { EMPLOYEE_ID: 102, FIRST_NAME: 'Lex', LAST_NAME: 'De Haan', DEPARTMENT_ID: 90, JOB_ID: 'AD_VP', SALARY: 17000, HIRE_DATE: '13-JAN-1993', EMAIL: 'LDEHAAN@corp.com', MANAGER_ID: 100 },
        { EMPLOYEE_ID: 103, FIRST_NAME: 'Alexander', LAST_NAME: 'Hunold', DEPARTMENT_ID: 60, JOB_ID: 'IT_PROG', SALARY: 9000, HIRE_DATE: '03-JAN-1990', EMAIL: 'AHUNOLD@corp.com', MANAGER_ID: 102 },
        { EMPLOYEE_ID: 104, FIRST_NAME: 'Bruce', LAST_NAME: 'Ernst', DEPARTMENT_ID: 60, JOB_ID: 'IT_PROG', SALARY: 6000, HIRE_DATE: '21-MAY-1991', EMAIL: 'BERNST@corp.com', MANAGER_ID: 103 },
        { EMPLOYEE_ID: 105, FIRST_NAME: 'David', LAST_NAME: 'Austin', DEPARTMENT_ID: 60, JOB_ID: 'IT_PROG', SALARY: 4800, HIRE_DATE: '25-JUN-1997', EMAIL: 'DAUSTIN@corp.com', MANAGER_ID: 103 },
        { EMPLOYEE_ID: 106, FIRST_NAME: 'Valli', LAST_NAME: 'Pataballa', DEPARTMENT_ID: 60, JOB_ID: 'IT_PROG', SALARY: 4800, HIRE_DATE: '05-FEB-1998', EMAIL: 'VPATABAL@corp.com', MANAGER_ID: 103 },
        { EMPLOYEE_ID: 107, FIRST_NAME: 'Diana', LAST_NAME: 'Lorentz', DEPARTMENT_ID: 60, JOB_ID: 'IT_PROG', SALARY: 4200, HIRE_DATE: '07-FEB-1999', EMAIL: 'DLORENTZ@corp.com', MANAGER_ID: 103 },
        { EMPLOYEE_ID: 108, FIRST_NAME: 'Nancy', LAST_NAME: 'Greenberg', DEPARTMENT_ID: 100, JOB_ID: 'FI_MGR', SALARY: 12000, HIRE_DATE: '17-AUG-1994', EMAIL: 'NGREENBE@corp.com', MANAGER_ID: 101 },
        { EMPLOYEE_ID: 109, FIRST_NAME: 'Daniel', LAST_NAME: 'Faviet', DEPARTMENT_ID: 100, JOB_ID: 'FI_ACCOUNT', SALARY: 9000, HIRE_DATE: '16-AUG-1994', EMAIL: 'DFAVIET@corp.com', MANAGER_ID: 108 },
        { EMPLOYEE_ID: 110, FIRST_NAME: 'John', LAST_NAME: 'Chen', DEPARTMENT_ID: 100, JOB_ID: 'FI_ACCOUNT', SALARY: 8200, HIRE_DATE: '28-SEP-1997', EMAIL: 'JCHEN@corp.com', MANAGER_ID: 108 },
        { EMPLOYEE_ID: 111, FIRST_NAME: 'Ismael', LAST_NAME: 'Sciarra', DEPARTMENT_ID: 100, JOB_ID: 'FI_ACCOUNT', SALARY: 7700, HIRE_DATE: '30-SEP-1997', EMAIL: 'ISCIARRA@corp.com', MANAGER_ID: 108 },
        { EMPLOYEE_ID: 112, FIRST_NAME: 'Jose', LAST_NAME: 'Urman', DEPARTMENT_ID: 100, JOB_ID: 'FI_ACCOUNT', SALARY: 7800, HIRE_DATE: '07-MAR-1998', EMAIL: 'JMURMAN@corp.com', MANAGER_ID: 108 },
        { EMPLOYEE_ID: 114, FIRST_NAME: 'Den', LAST_NAME: 'Raphaely', DEPARTMENT_ID: 30, JOB_ID: 'PU_MAN', SALARY: 11000, HIRE_DATE: '07-DEC-1994', EMAIL: 'DRAPHEAL@corp.com', MANAGER_ID: 100 },
        { EMPLOYEE_ID: 115, FIRST_NAME: 'Alexander', LAST_NAME: 'Khoo', DEPARTMENT_ID: 30, JOB_ID: 'PU_CLERK', SALARY: 3100, HIRE_DATE: '18-MAY-1995', EMAIL: 'AKHOO@corp.com', MANAGER_ID: 114 },
        { EMPLOYEE_ID: 116, FIRST_NAME: 'Shelli', LAST_NAME: 'Baida', DEPARTMENT_ID: 30, JOB_ID: 'PU_CLERK', SALARY: 2900, HIRE_DATE: '24-DEC-1997', EMAIL: 'SBAIDA@corp.com', MANAGER_ID: 114 },
        { EMPLOYEE_ID: 145, FIRST_NAME: 'John', LAST_NAME: 'Russell', DEPARTMENT_ID: 80, JOB_ID: 'SA_MAN', SALARY: 14000, HIRE_DATE: '01-OCT-1996', EMAIL: 'JRUSSEL@corp.com', MANAGER_ID: 100 },
        { EMPLOYEE_ID: 146, FIRST_NAME: 'Karen', LAST_NAME: 'Partners', DEPARTMENT_ID: 80, JOB_ID: 'SA_MAN', SALARY: 13500, HIRE_DATE: '05-JAN-1997', EMAIL: 'KPARTNER@corp.com', MANAGER_ID: 100 },
        { EMPLOYEE_ID: 150, FIRST_NAME: 'Peter', LAST_NAME: 'Tucker', DEPARTMENT_ID: 80, JOB_ID: 'SA_REP', SALARY: 10000, HIRE_DATE: '30-JAN-1997', EMAIL: 'PTUCKER@corp.com', MANAGER_ID: 145 },
        { EMPLOYEE_ID: 200, FIRST_NAME: 'Jennifer', LAST_NAME: 'Whalen', DEPARTMENT_ID: 10, JOB_ID: 'AD_ASST', SALARY: 4400, HIRE_DATE: '17-SEP-1987', EMAIL: 'JWHALEN@corp.com', MANAGER_ID: 101 },
    ],

    'hr.departments': [
        { DEPARTMENT_ID: 10, DEPARTMENT_NAME: 'Administration', MANAGER_ID: 200, LOCATION_ID: 1700 },
        { DEPARTMENT_ID: 30, DEPARTMENT_NAME: 'Purchasing', MANAGER_ID: 114, LOCATION_ID: 1700 },
        { DEPARTMENT_ID: 60, DEPARTMENT_NAME: 'IT', MANAGER_ID: 103, LOCATION_ID: 1400 },
        { DEPARTMENT_ID: 80, DEPARTMENT_NAME: 'Sales', MANAGER_ID: 145, LOCATION_ID: 2500 },
        { DEPARTMENT_ID: 90, DEPARTMENT_NAME: 'Executive', MANAGER_ID: 100, LOCATION_ID: 1700 },
        { DEPARTMENT_ID: 100, DEPARTMENT_NAME: 'Finance', MANAGER_ID: 108, LOCATION_ID: 1700 },
        { DEPARTMENT_ID: 110, DEPARTMENT_NAME: 'Accounting', MANAGER_ID: null, LOCATION_ID: 1700 },
    ],

    'hr.jobs': [
        { JOB_ID: 'AD_PRES', JOB_TITLE: 'President', MIN_SALARY: 20000, MAX_SALARY: 40000 },
        { JOB_ID: 'AD_VP', JOB_TITLE: 'Administration Vice President', MIN_SALARY: 15000, MAX_SALARY: 30000 },
        { JOB_ID: 'IT_PROG', JOB_TITLE: 'Programmer', MIN_SALARY: 4000, MAX_SALARY: 10000 },
        { JOB_ID: 'FI_MGR', JOB_TITLE: 'Finance Manager', MIN_SALARY: 8200, MAX_SALARY: 16000 },
        { JOB_ID: 'FI_ACCOUNT', JOB_TITLE: 'Accountant', MIN_SALARY: 4200, MAX_SALARY: 9000 },
        { JOB_ID: 'PU_MAN', JOB_TITLE: 'Purchasing Manager', MIN_SALARY: 8000, MAX_SALARY: 15000 },
        { JOB_ID: 'PU_CLERK', JOB_TITLE: 'Purchasing Clerk', MIN_SALARY: 2500, MAX_SALARY: 5500 },
        { JOB_ID: 'SA_MAN', JOB_TITLE: 'Sales Manager', MIN_SALARY: 10000, MAX_SALARY: 20000 },
        { JOB_ID: 'SA_REP', JOB_TITLE: 'Sales Representative', MIN_SALARY: 6000, MAX_SALARY: 12000 },
        { JOB_ID: 'AD_ASST', JOB_TITLE: 'Administration Assistant', MIN_SALARY: 3000, MAX_SALARY: 6000 },
    ],

    'hr.locations': [
        { LOCATION_ID: 1400, STREET_ADDRESS: '2014 Jabberwocky Rd', CITY: 'Southlake', STATE: 'Texas', COUNTRY_ID: 'US' },
        { LOCATION_ID: 1700, STREET_ADDRESS: '2004 Charade Rd', CITY: 'Seattle', STATE: 'Washington', COUNTRY_ID: 'US' },
        { LOCATION_ID: 2500, STREET_ADDRESS: 'Magdalen Centre', CITY: 'Oxford', STATE: null, COUNTRY_ID: 'UK' },
    ]
}

// ── Validation Rules ────────────────────────────────────────

const REQUIRED_KEYWORDS = ['SELECT', 'FROM']
const DANGEROUS_KEYWORDS = ['DROP', 'DELETE', 'TRUNCATE', 'INSERT', 'UPDATE', 'ALTER', 'CREATE', 'GRANT', 'REVOKE']
const KNOWN_TABLES = Object.keys(TABLES)

function tokenise(sql) {
    return sql.toUpperCase().replace(/\s+/g, ' ').trim().split(/\s|,|\(|\)/)
        .filter(Boolean)
}

function extractTableNames(sql) {
    const upper = sql.toUpperCase()
    const found = []
    KNOWN_TABLES.forEach(t => {
        if (upper.includes(t.toUpperCase())) found.push(t)
    })
    return found
}

function extractBindVariables(sql) {
    const matches = sql.match(/:[a-zA-Z_][a-zA-Z0-9_]*/g) || []
    return [...new Set(matches)]
}

function extractAliasedColumns(sql) {
    // Pull out AS aliases to use as column headers
    const matches = [...sql.matchAll(/AS\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi)]
    return matches.map(m => m[1].toUpperCase())
}

// ── Validator ───────────────────────────────────────────────

export function validateSQL(sql) {
    const errors = []
    const warnings = []
    const tokens = tokenise(sql)

    // Must have SELECT and FROM
    REQUIRED_KEYWORDS.forEach(kw => {
        if (!tokens.includes(kw)) {
            errors.push(`Missing keyword: ${kw}`)
        }
    })

    // Block dangerous statements
    DANGEROUS_KEYWORDS.forEach(kw => {
        if (tokens.includes(kw)) {
            errors.push(`Statement not permitted in BIP: ${kw}. Only SELECT queries are allowed.`)
        }
    })

    // Check for unmatched parentheses
    const open = (sql.match(/\(/g) || []).length
    const close = (sql.match(/\)/g) || []).length
    if (open !== close) {
        errors.push(`Unmatched parentheses: ${open} opening vs ${close} closing`)
    }

    // Warn if no WHERE / parameters
    if (!sql.toUpperCase().includes('WHERE')) {
        warnings.push('No WHERE clause detected — query will return all rows. Consider adding parameters.')
    }

    // Warn if no bind variables
    const binds = extractBindVariables(sql)
    if (binds.length === 0) {
        warnings.push('No bind variables found (:param_name). BIP reports should use parameters for runtime filtering.')
    }

    // Check tables are known
    const tables = extractTableNames(sql)
    if (tables.length === 0) {
        warnings.push('No recognised HR schema tables found. Available: ' + KNOWN_TABLES.join(', '))
    }

    return { valid: errors.length === 0, errors, warnings, tables, binds }
}

// ── Data Resolver ───────────────────────────────────────────

function joinEmployeesWithDepartments() {
    return TABLES['hr.employees'].map(emp => {
        const dept = TABLES['hr.departments'].find(d => d.DEPARTMENT_ID === emp.DEPARTMENT_ID) || {}
        const job = TABLES['hr.jobs'].find(j => j.JOB_ID === emp.JOB_ID) || {}
        return {
            ...emp,
            FULL_NAME: `${emp.FIRST_NAME} ${emp.LAST_NAME}`,
            DEPARTMENT_NAME: dept.DEPARTMENT_NAME || 'Unknown',
            JOB_TITLE: job.JOB_TITLE || 'Unknown',
            MIN_SALARY: job.MIN_SALARY,
            MAX_SALARY: job.MAX_SALARY
        }
    })
}

function applyWhere(rows, sql, params) {
    const upper = sql.toUpperCase()

    // Filter by department if bind var is provided
    if (params.p_department_id !== undefined) {
        rows = rows.filter(r => r.DEPARTMENT_ID === Number(params.p_department_id))
    }
    if (params.p_job_id !== undefined) {
        rows = rows.filter(r => r.JOB_ID === params.p_job_id)
    }
    if (params.p_min_salary !== undefined) {
        rows = rows.filter(r => r.SALARY >= Number(params.p_min_salary))
    }
    if (params.p_max_salary !== undefined) {
        rows = rows.filter(r => r.SALARY <= Number(params.p_max_salary))
    }

    // Infer filters from WHERE clause literals
    if (upper.includes("DEPARTMENT_ID = 60")) rows = rows.filter(r => r.DEPARTMENT_ID === 60)
    if (upper.includes("DEPARTMENT_ID = 90")) rows = rows.filter(r => r.DEPARTMENT_ID === 90)
    if (upper.includes("DEPARTMENT_ID = 100")) rows = rows.filter(r => r.DEPARTMENT_ID === 100)
    if (upper.includes("JOB_ID = 'IT_PROG'")) rows = rows.filter(r => r.JOB_ID === 'IT_PROG')
    if (upper.includes("JOB_ID = 'SA_MAN'")) rows = rows.filter(r => r.JOB_ID === 'SA_MAN')
    if (upper.includes("SALARY > 10000")) rows = rows.filter(r => r.SALARY > 10000)
    if (upper.includes("SALARY >= 10000")) rows = rows.filter(r => r.SALARY >= 10000)

    return rows
}

function applyOrderBy(rows, sql) {
    const upper = sql.toUpperCase()
    if (upper.includes('ORDER BY')) {
        if (upper.includes('SALARY DESC')) return [...rows].sort((a, b) => b.SALARY - a.SALARY)
        if (upper.includes('SALARY')) return [...rows].sort((a, b) => a.SALARY - b.SALARY)
        if (upper.includes('LAST_NAME')) return [...rows].sort((a, b) => a.LAST_NAME.localeCompare(b.LAST_NAME))
        if (upper.includes('DEPARTMENT_NAME')) return [...rows].sort((a, b) => a.DEPARTMENT_NAME.localeCompare(b.DEPARTMENT_NAME))
        if (upper.includes('HIRE_DATE')) return [...rows].sort((a, b) => a.HIRE_DATE.localeCompare(b.HIRE_DATE))
        if (upper.includes('EMPLOYEE_ID')) return [...rows].sort((a, b) => a.EMPLOYEE_ID - b.EMPLOYEE_ID)
    }
    return rows
}

function pickColumns(rows, sql) {
    const upper = sql.toUpperCase()

    // SELECT * — return all
    if (upper.match(/SELECT\s+\*/)) return rows

    // Otherwise infer columns from what is mentioned
    const wantedFields = []
    const allFields = [
        'EMPLOYEE_ID', 'FIRST_NAME', 'LAST_NAME', 'FULL_NAME', 'EMAIL',
        'DEPARTMENT_ID', 'DEPARTMENT_NAME', 'JOB_ID', 'JOB_TITLE',
        'SALARY', 'HIRE_DATE', 'MANAGER_ID', 'MIN_SALARY', 'MAX_SALARY'
    ]

    allFields.forEach(f => {
        if (upper.includes(f)) wantedFields.push(f)
    })

    // Always include at least these if nothing matched
    if (wantedFields.length === 0) {
        return rows.map(r => ({
            EMPLOYEE_ID: r.EMPLOYEE_ID,
            FULL_NAME: r.FULL_NAME,
            DEPARTMENT_NAME: r.DEPARTMENT_NAME,
            SALARY: r.SALARY
        }))
    }

    return rows.map(row => {
        const out = {}
        wantedFields.forEach(f => { if (row[f] !== undefined) out[f] = row[f] })
        return out
    })
}

// ── Main Execute Function ────────────────────────────────────

export function executeSQL(sql, params = {}) {
    // 1. Validate first
    const validation = validateSQL(sql)
    if (!validation.valid) {
        return {
            success: false,
            errors: validation.errors,
            warnings: validation.warnings,
            rows: [],
            columns: [],
            rowCount: 0,
            executionTime: 0
        }
    }

    const start = performance.now()

    try {
        const upper = sql.toUpperCase()

        // 2. Determine which tables are involved
        let rows = []

        const hasEmployees = upper.includes('HR.EMPLOYEES') || upper.includes('EMPLOYEES')
        const hasDepartments = upper.includes('HR.DEPARTMENTS') || upper.includes('DEPARTMENTS')
        const hasJobs = upper.includes('HR.JOBS') || upper.includes('JOBS')
        const hasLocations = upper.includes('HR.LOCATIONS') || upper.includes('LOCATIONS')

        if (hasEmployees) {
            // Always join with departments + jobs if they appear
            if (hasDepartments || hasJobs) {
                rows = joinEmployeesWithDepartments()
            } else {
                rows = TABLES['hr.employees'].map(e => ({
                    ...e,
                    FULL_NAME: `${e.FIRST_NAME} ${e.LAST_NAME}`
                }))
            }
        } else if (hasDepartments) {
            rows = [...TABLES['hr.departments']]
        } else if (hasJobs) {
            rows = [...TABLES['hr.jobs']]
        } else if (hasLocations) {
            rows = [...TABLES['hr.locations']]
        } else {
            // Default fallback — return employees
            rows = joinEmployeesWithDepartments()
        }

        // 3. Apply WHERE / parameter filters
        rows = applyWhere(rows, sql, params)

        // 4. Apply ORDER BY
        rows = applyOrderBy(rows, sql)

        // 5. Pick columns based on SELECT clause
        rows = pickColumns(rows, sql)

        const columns = rows.length > 0 ? Object.keys(rows[0]) : []
        const executionTime = +(performance.now() - start).toFixed(2)

        return {
            success: true,
            errors: [],
            warnings: validation.warnings,
            rows,
            columns,
            rowCount: rows.length,
            executionTime,
            bindsUsed: validation.binds,
            tablesScanned: validation.tables
        }

    } catch (err) {
        return {
            success: false,
            errors: [`Runtime error: ${err.message}`],
            warnings: [],
            rows: [],
            columns: [],
            rowCount: 0,
            executionTime: 0
        }
    }
}