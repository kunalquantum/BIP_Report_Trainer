const TABLES = {
  AP_INVOICES_ALL: [
    { INVOICE_ID: 101, INVOICE_NUM: 'INV-1001', INVOICE_DATE: '2026-01-04', VENDOR_ID: 1, ORG_ID: 204, INVOICE_AMOUNT: 15000, INVOICE_CURRENCY_CODE: 'INR' },
    { INVOICE_ID: 102, INVOICE_NUM: 'INV-1002', INVOICE_DATE: '2026-01-09', VENDOR_ID: 2, ORG_ID: 204, INVOICE_AMOUNT: 9200, INVOICE_CURRENCY_CODE: 'INR' },
    { INVOICE_ID: 103, INVOICE_NUM: 'INV-1003', INVOICE_DATE: '2026-01-15', VENDOR_ID: 3, ORG_ID: 205, INVOICE_AMOUNT: 11800, INVOICE_CURRENCY_CODE: 'USD' },
    { INVOICE_ID: 104, INVOICE_NUM: 'INV-1004', INVOICE_DATE: '2026-01-18', VENDOR_ID: 1, ORG_ID: 205, INVOICE_AMOUNT: 6500, INVOICE_CURRENCY_CODE: 'USD' }
  ],
  AP_SUPPLIERS: [
    { VENDOR_ID: 1, VENDOR_NAME: 'Apex Industrial Supplies', SEGMENT1: 'SUP-1001' },
    { VENDOR_ID: 2, VENDOR_NAME: 'Blue River Logistics', SEGMENT1: 'SUP-1002' },
    { VENDOR_ID: 3, VENDOR_NAME: 'Northwind Components', SEGMENT1: 'SUP-1003' }
  ],
  AP_PAYMENT_SCHEDULES_ALL: [
    { INVOICE_ID: 101, DUE_DATE: '2026-02-02', AMOUNT_DUE_REMAINING: 15000 },
    { INVOICE_ID: 102, DUE_DATE: '2026-02-08', AMOUNT_DUE_REMAINING: 2400 },
    { INVOICE_ID: 103, DUE_DATE: '2026-02-12', AMOUNT_DUE_REMAINING: 0 },
    { INVOICE_ID: 104, DUE_DATE: '2026-02-19', AMOUNT_DUE_REMAINING: 6500 }
  ],
  RA_CUSTOMER_TRX_ALL: [
    { CUSTOMER_TRX_ID: 201, TRX_NUMBER: 'AR-2001', TRX_DATE: '2026-01-05', BILL_TO_CUSTOMER_ID: 11, ORG_ID: 205, TRX_AMOUNT: 18200 },
    { CUSTOMER_TRX_ID: 202, TRX_NUMBER: 'AR-2002', TRX_DATE: '2026-01-11', BILL_TO_CUSTOMER_ID: 12, ORG_ID: 205, TRX_AMOUNT: 9400 },
    { CUSTOMER_TRX_ID: 203, TRX_NUMBER: 'AR-2003', TRX_DATE: '2026-01-14', BILL_TO_CUSTOMER_ID: 13, ORG_ID: 204, TRX_AMOUNT: 7200 },
    { CUSTOMER_TRX_ID: 204, TRX_NUMBER: 'AR-2004', TRX_DATE: '2026-01-21', BILL_TO_CUSTOMER_ID: 11, ORG_ID: 205, TRX_AMOUNT: 12100 }
  ],
  HZ_CUST_ACCOUNTS: [
    { CUST_ACCOUNT_ID: 11, CUSTOMER_NAME: 'Vision Retail India' },
    { CUST_ACCOUNT_ID: 12, CUSTOMER_NAME: 'Skyline Services LLC' },
    { CUST_ACCOUNT_ID: 13, CUSTOMER_NAME: 'Meridian Tech GmbH' }
  ],
  AR_PAYMENT_SCHEDULES_ALL: [
    { CUSTOMER_TRX_ID: 201, DUE_DATE: '2026-02-04', AMOUNT_DUE_REMAINING: 18200 },
    { CUSTOMER_TRX_ID: 202, DUE_DATE: '2026-02-10', AMOUNT_DUE_REMAINING: 1800 },
    { CUSTOMER_TRX_ID: 203, DUE_DATE: '2026-02-16', AMOUNT_DUE_REMAINING: 0 },
    { CUSTOMER_TRX_ID: 204, DUE_DATE: '2026-02-25', AMOUNT_DUE_REMAINING: 12100 }
  ],
  GL_BALANCES: [
    { LEDGER_ID: 301, CODE_COMBINATION_ID: 401, PERIOD_NAME: 'JAN-26', ENTERED_DR: 250000, ENTERED_CR: 0, ENDING_BALANCE: 250000 },
    { LEDGER_ID: 301, CODE_COMBINATION_ID: 402, PERIOD_NAME: 'JAN-26', ENTERED_DR: 0, ENTERED_CR: 180000, ENDING_BALANCE: -180000 },
    { LEDGER_ID: 301, CODE_COMBINATION_ID: 403, PERIOD_NAME: 'JAN-26', ENTERED_DR: 95000, ENTERED_CR: 0, ENDING_BALANCE: 95000 },
    { LEDGER_ID: 302, CODE_COMBINATION_ID: 401, PERIOD_NAME: 'JAN-26', ENTERED_DR: 48000, ENTERED_CR: 0, ENDING_BALANCE: 48000 }
  ],
  GL_CODE_COMBINATIONS: [
    { CODE_COMBINATION_ID: 401, SEGMENT1: '1000', SEGMENT2: '000', SEGMENT3: '1100', ACCOUNT_DESCRIPTION: 'Cash' },
    { CODE_COMBINATION_ID: 402, SEGMENT1: '2000', SEGMENT2: '000', SEGMENT3: '2100', ACCOUNT_DESCRIPTION: 'Accounts Payable' },
    { CODE_COMBINATION_ID: 403, SEGMENT1: '4000', SEGMENT2: '000', SEGMENT3: '4100', ACCOUNT_DESCRIPTION: 'Revenue' }
  ],
  GL_LEDGERS: [
    { LEDGER_ID: 301, NAME: 'Vision Ledger', CURRENCY_CODE: 'USD' },
    { LEDGER_ID: 302, NAME: 'India Ledger', CURRENCY_CODE: 'INR' }
  ],
  HR_OPERATING_UNITS: [
    { ORGANIZATION_ID: 204, NAME: 'India BU' },
    { ORGANIZATION_ID: 205, NAME: 'Vision Operations' }
  ]
}

const REQUIRED_KEYWORDS = ['SELECT', 'FROM']
const DANGEROUS_KEYWORDS = ['DROP', 'DELETE', 'TRUNCATE', 'INSERT', 'UPDATE', 'ALTER', 'CREATE', 'GRANT', 'REVOKE']
const KNOWN_TABLES = Object.keys(TABLES)
const KNOWN_FIELDS = [
  'INVOICE_ID', 'INVOICE_NUM', 'INVOICE_DATE', 'VENDOR_ID', 'VENDOR_NAME', 'DUE_DATE', 'AMOUNT_DUE_REMAINING',
  'BU_NAME', 'CUSTOMER_TRX_ID', 'TRX_NUMBER', 'TRX_DATE', 'CUSTOMER_NAME', 'TRX_AMOUNT',
  'LEDGER_NAME', 'PERIOD_NAME', 'SEGMENT1', 'SEGMENT2', 'SEGMENT3', 'ACCOUNT_DESCRIPTION',
  'ENTERED_DR', 'ENTERED_CR', 'ENDING_BALANCE',
  'KEY', 'TEMPLATE', 'DELIVERY_CHANNEL', 'EMAIL_TO', 'EMAIL_FROM', 'EMAIL_SUBJECT', 'OUTPUT_FORMAT', 'LOCALE'
]

function tokenise(sql) {
  return sql.toUpperCase().replace(/\s+/g, ' ').trim().split(/\s|,|\(|\)/).filter(Boolean)
}

function extractTableNames(sql) {
  const upper = sql.toUpperCase()
  return KNOWN_TABLES.filter((table) => upper.includes(table))
}

export function extractBindVariables(sql) {
  const matches = sql.match(/:[a-zA-Z_][a-zA-Z0-9_]*/g) || []
  return [...new Set(matches)]
}

function buildApRows() {
  return TABLES.AP_INVOICES_ALL.map((invoice) => {
    const supplier = TABLES.AP_SUPPLIERS.find((item) => item.VENDOR_ID === invoice.VENDOR_ID) || {}
    const schedule = TABLES.AP_PAYMENT_SCHEDULES_ALL.find((item) => item.INVOICE_ID === invoice.INVOICE_ID) || {}
    const bu = TABLES.HR_OPERATING_UNITS.find((item) => item.ORGANIZATION_ID === invoice.ORG_ID) || {}

    return {
      ...invoice,
      VENDOR_NAME: supplier.VENDOR_NAME,
      SUPPLIER_NUM: supplier.SEGMENT1,
      DUE_DATE: schedule.DUE_DATE,
      AMOUNT_DUE_REMAINING: schedule.AMOUNT_DUE_REMAINING,
      BU_NAME: bu.NAME
    }
  })
}

function buildArRows() {
  return TABLES.RA_CUSTOMER_TRX_ALL.map((trx) => {
    const customer = TABLES.HZ_CUST_ACCOUNTS.find((item) => item.CUST_ACCOUNT_ID === trx.BILL_TO_CUSTOMER_ID) || {}
    const schedule = TABLES.AR_PAYMENT_SCHEDULES_ALL.find((item) => item.CUSTOMER_TRX_ID === trx.CUSTOMER_TRX_ID) || {}
    const bu = TABLES.HR_OPERATING_UNITS.find((item) => item.ORGANIZATION_ID === trx.ORG_ID) || {}

    return {
      ...trx,
      CUSTOMER_NAME: customer.CUSTOMER_NAME,
      DUE_DATE: schedule.DUE_DATE,
      AMOUNT_DUE_REMAINING: schedule.AMOUNT_DUE_REMAINING,
      BU_NAME: bu.NAME
    }
  })
}

function buildGlRows() {
  return TABLES.GL_BALANCES.map((balance) => {
    const combination = TABLES.GL_CODE_COMBINATIONS.find((item) => item.CODE_COMBINATION_ID === balance.CODE_COMBINATION_ID) || {}
    const ledger = TABLES.GL_LEDGERS.find((item) => item.LEDGER_ID === balance.LEDGER_ID) || {}

    return {
      ...balance,
      LEDGER_NAME: ledger.NAME,
      SEGMENT1: combination.SEGMENT1,
      SEGMENT2: combination.SEGMENT2,
      SEGMENT3: combination.SEGMENT3,
      ACCOUNT_DESCRIPTION: combination.ACCOUNT_DESCRIPTION
    }
  })
}

function buildBurstingRows() {
  return TABLES.HR_OPERATING_UNITS.map((bu) => ({
    KEY: bu.ORGANIZATION_ID,
    TEMPLATE: bu.NAME,
    DELIVERY_CHANNEL: 'EMAIL',
    EMAIL_TO: bu.NAME === 'India BU' ? 'ap-india@corp.com' : 'finops@corp.com',
    EMAIL_FROM: 'bip@corp.com',
    EMAIL_SUBJECT: `Aging Report - ${bu.NAME}`,
    OUTPUT_FORMAT: 'PDF',
    LOCALE: 'en-US'
  }))
}

function applyBindFilters(rows, params) {
  let filtered = [...rows]

  if (params.p_bu_name) filtered = filtered.filter((row) => row.BU_NAME === params.p_bu_name)
  if (params.p_ledger_name) filtered = filtered.filter((row) => row.LEDGER_NAME === params.p_ledger_name)
  if (params.p_period_name) filtered = filtered.filter((row) => row.PERIOD_NAME === params.p_period_name)

  return filtered
}

function applyLiteralFilters(rows, sql) {
  const upper = sql.toUpperCase()
  let filtered = [...rows]

  if (upper.includes('AMOUNT_DUE_REMAINING > 0')) filtered = filtered.filter((row) => Number(row.AMOUNT_DUE_REMAINING || 0) > 0)
  if (upper.includes("BU.NAME = 'INDIA BU'") || upper.includes("BU_NAME = 'INDIA BU'")) filtered = filtered.filter((row) => row.BU_NAME === 'India BU')
  if (upper.includes("GL.NAME = 'VISION LEDGER'") || upper.includes("LEDGER_NAME = 'VISION LEDGER'")) filtered = filtered.filter((row) => row.LEDGER_NAME === 'Vision Ledger')
  if (upper.includes("GB.PERIOD_NAME = 'JAN-26'") || upper.includes("PERIOD_NAME = 'JAN-26'")) filtered = filtered.filter((row) => row.PERIOD_NAME === 'JAN-26')

  return filtered
}

function applyOrderBy(rows, sql) {
  const upper = sql.toUpperCase()
  if (!upper.includes('ORDER BY')) return rows
  const sorted = [...rows]

  if (upper.includes('SEGMENT1') && upper.includes('SEGMENT2')) {
    return sorted.sort((a, b) => {
      const first = String(a.SEGMENT1).localeCompare(String(b.SEGMENT1))
      return first !== 0 ? first : String(a.SEGMENT2).localeCompare(String(b.SEGMENT2))
    })
  }

  if (upper.includes('DUE_DATE')) return sorted.sort((a, b) => String(a.DUE_DATE).localeCompare(String(b.DUE_DATE)))
  if (upper.includes('INVOICE_DATE')) return sorted.sort((a, b) => String(a.INVOICE_DATE).localeCompare(String(b.INVOICE_DATE)))
  if (upper.includes('TRX_DATE')) return sorted.sort((a, b) => String(a.TRX_DATE).localeCompare(String(b.TRX_DATE)))

  return sorted
}

function pickColumns(rows, sql) {
  const upper = sql.toUpperCase()
  if (upper.match(/SELECT\s+\*/)) return rows

  const requested = KNOWN_FIELDS.filter((field) => upper.includes(field))

  if (requested.length === 0) return rows

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
    if (!tokens.includes(keyword)) errors.push(`Missing keyword: ${keyword}`)
  })

  DANGEROUS_KEYWORDS.forEach((keyword) => {
    if (tokens.includes(keyword)) errors.push(`Statement not permitted in BIP: ${keyword}. Only SELECT queries are allowed.`)
  })

  const open = (sql.match(/\(/g) || []).length
  const close = (sql.match(/\)/g) || []).length
  if (open !== close) errors.push(`Unmatched parentheses: ${open} opening vs ${close} closing`)

  const binds = extractBindVariables(sql)
  const tables = extractTableNames(sql)

  if (binds.length === 0) warnings.push('No bind variables found. Oracle BIP data models usually expose :parameters.')
  if (tables.length === 0) warnings.push(`No recognised Oracle finance tables found. Available tables: ${KNOWN_TABLES.join(', ')}`)

  return { valid: errors.length === 0, errors, warnings, tables, binds }
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
    let rows = []

    if (upper.includes('DELIVERY_CHANNEL') || upper.includes('EMAIL_TO') || upper.includes('OUTPUT_FORMAT')) {
      rows = buildBurstingRows()
    } else if (upper.includes('AP_INVOICES_ALL') || upper.includes('AP_PAYMENT_SCHEDULES_ALL') || upper.includes('AP_SUPPLIERS')) {
      rows = buildApRows()
    } else if (upper.includes('RA_CUSTOMER_TRX_ALL') || upper.includes('AR_PAYMENT_SCHEDULES_ALL') || upper.includes('HZ_CUST_ACCOUNTS')) {
      rows = buildArRows()
    } else if (upper.includes('GL_BALANCES') || upper.includes('GL_CODE_COMBINATIONS') || upper.includes('GL_LEDGERS')) {
      rows = buildGlRows()
    }

    rows = applyBindFilters(rows, params)
    rows = applyLiteralFilters(rows, sql)
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
