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
    { EMPLOYEE_ID: 200, FIRST_NAME: 'Jennifer', LAST_NAME: 'Whalen', DEPARTMENT_ID: 10, JOB_ID: 'AD_ASST', SALARY: 4400, HIRE_DATE: '17-SEP-1987', EMAIL: 'JWHALEN@corp.com', MANAGER_ID: 101 }
  ],
  'hr.departments': [
    { DEPARTMENT_ID: 10, DEPARTMENT_NAME: 'Administration', MANAGER_ID: 200, LOCATION_ID: 1700 },
    { DEPARTMENT_ID: 30, DEPARTMENT_NAME: 'Purchasing', MANAGER_ID: 114, LOCATION_ID: 1700 },
    { DEPARTMENT_ID: 60, DEPARTMENT_NAME: 'IT', MANAGER_ID: 103, LOCATION_ID: 1400 },
    { DEPARTMENT_ID: 80, DEPARTMENT_NAME: 'Sales', MANAGER_ID: 145, LOCATION_ID: 2500 },
    { DEPARTMENT_ID: 90, DEPARTMENT_NAME: 'Executive', MANAGER_ID: 100, LOCATION_ID: 1700 },
    { DEPARTMENT_ID: 100, DEPARTMENT_NAME: 'Finance', MANAGER_ID: 108, LOCATION_ID: 1700 },
    { DEPARTMENT_ID: 110, DEPARTMENT_NAME: 'Accounting', MANAGER_ID: null, LOCATION_ID: 1700 }
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
    { JOB_ID: 'AD_ASST', JOB_TITLE: 'Administration Assistant', MIN_SALARY: 3000, MAX_SALARY: 6000 }
  ]
}

const REQUIRED_KEYWORDS = ['SELECT', 'FROM']
const DANGEROUS_KEYWORDS = ['DROP', 'DELETE', 'TRUNCATE', 'INSERT', 'UPDATE', 'ALTER', 'CREATE', 'GRANT', 'REVOKE']
const KNOWN_TABLES = Object.keys(TABLES)
const KNOWN_FIELDS = [
  'EMPLOYEE_ID', 'FIRST_NAME', 'LAST_NAME', 'FULL_NAME', 'EMAIL',
  'DEPARTMENT_ID', 'DEPARTMENT_NAME', 'JOB_ID', 'JOB_TITLE', 'SALARY',
  'HIRE_DATE', 'MANAGER_ID', 'MANAGER_FULL_NAME', 'MANAGER_EMAIL',
  'EMPLOYEE_COUNT', 'HEADCOUNT', 'AVG_SALARY', 'KEY', 'TEMPLATE',
  'DELIVERY_CHANNEL', 'EMAIL_TO', 'EMAIL_FROM', 'EMAIL_SUBJECT',
  'OUTPUT_FORMAT', 'LOCALE'
]

function tokenise(sql) {
  return sql.toUpperCase().replace(/\s+/g, ' ').trim().split(/\s|,|\(|\)/).filter(Boolean)
}

function extractTableNames(sql) {
  const upper = sql.toUpperCase()
  return KNOWN_TABLES.filter((table) => upper.includes(table.toUpperCase()))
}

export function extractBindVariables(sql) {
  const matches = sql.match(/:[a-zA-Z_][a-zA-Z0-9_]*/g) || []
  return [...new Set(matches)]
}

function buildEmployeeRows() {
  return TABLES['hr.employees'].map((employee) => {
    const department = TABLES['hr.departments'].find((item) => item.DEPARTMENT_ID === employee.DEPARTMENT_ID) || {}
    const job = TABLES['hr.jobs'].find((item) => item.JOB_ID === employee.JOB_ID) || {}
    const manager = TABLES['hr.employees'].find((item) => item.EMPLOYEE_ID === employee.MANAGER_ID) || null

    return {
      ...employee,
      FULL_NAME: `${employee.FIRST_NAME} ${employee.LAST_NAME}`,
      DEPARTMENT_NAME: department.DEPARTMENT_NAME || 'Unknown',
      JOB_TITLE: job.JOB_TITLE || 'Unknown',
      MANAGER_FULL_NAME: manager ? `${manager.FIRST_NAME} ${manager.LAST_NAME}` : null,
      MANAGER_EMAIL: manager ? manager.EMAIL : null
    }
  })
}

function applyWhere(rows, sql, params) {
  const upper = sql.toUpperCase()
  let filtered = [...rows]

  if (params.p_department_id !== undefined && params.p_department_id !== '') {
    filtered = filtered.filter((row) => row.DEPARTMENT_ID === Number(params.p_department_id))
  }
  if (params.p_min_salary !== undefined && params.p_min_salary !== '') {
    filtered = filtered.filter((row) => row.SALARY >= Number(params.p_min_salary))
  }
  if (params.p_max_salary !== undefined && params.p_max_salary !== '') {
    filtered = filtered.filter((row) => row.SALARY <= Number(params.p_max_salary))
  }

  if (upper.includes('DEPARTMENT_ID = 60')) filtered = filtered.filter((row) => row.DEPARTMENT_ID === 60)
  if (upper.includes('DEPARTMENT_ID = 90')) filtered = filtered.filter((row) => row.DEPARTMENT_ID === 90)
  if (upper.includes('DEPARTMENT_ID = 100')) filtered = filtered.filter((row) => row.DEPARTMENT_ID === 100)
  if (upper.includes('SALARY > 10000')) filtered = filtered.filter((row) => row.SALARY > 10000)
  if (upper.includes('SALARY >= 10000')) filtered = filtered.filter((row) => row.SALARY >= 10000)

  return filtered
}

function applyOrderBy(rows, sql) {
  const upper = sql.toUpperCase()
  if (!upper.includes('ORDER BY')) return rows

  const sorted = [...rows]

  if (upper.includes('AVG') && upper.includes('DESC')) {
    return sorted.sort((a, b) => (b.AVG_SALARY || 0) - (a.AVG_SALARY || 0))
  }
  if (upper.includes('DEPARTMENT_NAME') && upper.includes('LAST_NAME')) {
    return sorted.sort((a, b) => {
      const byDepartment = String(a.DEPARTMENT_NAME).localeCompare(String(b.DEPARTMENT_NAME))
      return byDepartment !== 0 ? byDepartment : String(a.LAST_NAME).localeCompare(String(b.LAST_NAME))
    })
  }
  if (upper.includes('SALARY DESC')) {
    return sorted.sort((a, b) => (b.SALARY || 0) - (a.SALARY || 0))
  }
  if (upper.includes('SALARY')) {
    return sorted.sort((a, b) => (a.SALARY || 0) - (b.SALARY || 0))
  }
  if (upper.includes('LAST_NAME')) {
    return sorted.sort((a, b) => String(a.LAST_NAME).localeCompare(String(b.LAST_NAME)))
  }
  if (upper.includes('DEPARTMENT_NAME')) {
    return sorted.sort((a, b) => String(a.DEPARTMENT_NAME).localeCompare(String(b.DEPARTMENT_NAME)))
  }

  return sorted
}

function aggregateDepartmentStats(rows) {
  return Object.values(rows.reduce((groups, row) => {
    const key = row.DEPARTMENT_ID
    if (!groups[key]) {
      groups[key] = {
        DEPARTMENT_ID: row.DEPARTMENT_ID,
        DEPARTMENT_NAME: row.DEPARTMENT_NAME,
        EMPLOYEE_COUNT: 0,
        HEADCOUNT: 0,
        salaryTotal: 0
      }
    }

    groups[key].EMPLOYEE_COUNT += 1
    groups[key].HEADCOUNT += 1
    groups[key].salaryTotal += row.SALARY
    return groups
  }, {})).map((group) => ({
    DEPARTMENT_ID: group.DEPARTMENT_ID,
    DEPARTMENT_NAME: group.DEPARTMENT_NAME,
    EMPLOYEE_COUNT: group.EMPLOYEE_COUNT,
    HEADCOUNT: group.HEADCOUNT,
    AVG_SALARY: Math.round(group.salaryTotal / group.EMPLOYEE_COUNT)
  }))
}

function buildBurstingRows() {
  return TABLES['hr.departments']
    .map((department) => {
      const manager = TABLES['hr.employees'].find((employee) => employee.EMPLOYEE_ID === department.MANAGER_ID)
      return {
        KEY: department.DEPARTMENT_ID,
        TEMPLATE: department.DEPARTMENT_NAME,
        DELIVERY_CHANNEL: 'EMAIL',
        EMAIL_TO: manager?.EMAIL || null,
        EMAIL_FROM: 'payroll@corp.com',
        EMAIL_SUBJECT: `Monthly Headcount Report - ${department.DEPARTMENT_NAME}`,
        OUTPUT_FORMAT: 'PDF',
        LOCALE: 'en-US'
      }
    })
    .filter((row) => row.EMAIL_TO)
}

function pickColumns(rows, sql) {
  const upper = sql.toUpperCase()
  if (upper.match(/SELECT\s+\*/)) return rows

  const requested = KNOWN_FIELDS.filter((field) => upper.includes(field))

  if (requested.length === 0) {
    return rows.map((row) => ({
      EMPLOYEE_ID: row.EMPLOYEE_ID,
      FULL_NAME: row.FULL_NAME,
      DEPARTMENT_NAME: row.DEPARTMENT_NAME,
      SALARY: row.SALARY
    }))
  }

  return rows.map((row) => requested.reduce((output, field) => {
    if (row[field] !== undefined) output[field] = row[field]
    return output
  }, {}))
}

export function validateSQL(sql) {
  const errors = []
  const warnings = []
  const tokens = tokenise(sql)

  REQUIRED_KEYWORDS.forEach((keyword) => {
    if (!tokens.includes(keyword)) {
      errors.push(`Missing keyword: ${keyword}`)
    }
  })

  DANGEROUS_KEYWORDS.forEach((keyword) => {
    if (tokens.includes(keyword)) {
      errors.push(`Statement not permitted in BIP: ${keyword}. Only SELECT queries are allowed.`)
    }
  })

  const open = (sql.match(/\(/g) || []).length
  const close = (sql.match(/\)/g) || []).length
  if (open !== close) {
    errors.push(`Unmatched parentheses: ${open} opening vs ${close} closing`)
  }

  if (!sql.toUpperCase().includes('WHERE')) {
    warnings.push('No WHERE clause detected. In BIP, runtime parameters are usually added through WHERE filters.')
  }

  const binds = extractBindVariables(sql)
  if (binds.length === 0) {
    warnings.push('No bind variables found. Data models usually expose :parameters for runtime filtering.')
  }

  const tables = extractTableNames(sql)
  if (tables.length === 0) {
    warnings.push(`No recognised HR schema tables found. Available tables: ${KNOWN_TABLES.join(', ')}`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    tables,
    binds
  }
}

export function executeSQL(sql, params = {}) {
  const validation = validateSQL(sql)
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      warnings: validation.warnings,
      rows: [],
      columns: [],
      rowCount: 0,
      executionTime: 0,
      bindsUsed: validation.binds,
      tablesScanned: validation.tables
    }
  }

  const start = performance.now()

  try {
    const upper = sql.toUpperCase()
    let rows

    if (
      upper.includes('DELIVERY_CHANNEL') ||
      upper.includes('EMAIL_TO') ||
      upper.includes('OUTPUT_FORMAT') ||
      upper.includes('"KEY"') ||
      upper.includes(' AS KEY')
    ) {
      rows = buildBurstingRows()
    } else {
      rows = buildEmployeeRows()
      rows = applyWhere(rows, sql, params)

      if (upper.includes('COUNT') && upper.includes('AVG') && upper.includes('GROUP BY')) {
        rows = aggregateDepartmentStats(rows)
      }
    }

    rows = applyOrderBy(rows, sql)
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
  } catch (error) {
    return {
      success: false,
      errors: [`Runtime error: ${error.message}`],
      warnings: [],
      rows: [],
      columns: [],
      rowCount: 0,
      executionTime: 0,
      bindsUsed: validation.binds,
      tablesScanned: validation.tables
    }
  }
}
