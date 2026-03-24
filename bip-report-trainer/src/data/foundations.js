export const FOUNDATION_TRACKS = [
  {
    id: 'FDN-001',
    title: 'Join Logic Bootcamp',
    subtitle: 'Learn how to connect business tables before building any BIP data model.',
    outcomes: [
      'Choose the correct driving table for a report request',
      'Identify primary key to foreign key relationships',
      'Decide when to use INNER JOIN versus LEFT JOIN',
      'Avoid duplicate rows caused by incorrect grain'
    ],
    drills: [
      'Start with the business question, then identify the grain of the output.',
      'List mandatory tables first, optional lookup tables second.',
      'Join keys must match the business entity, not just a similar column name.',
      'Validate row counts after every join so duplicates are caught early.'
    ]
  },
  {
    id: 'FDN-002',
    title: 'Business Table Mastery',
    subtitle: 'Understand what each table means in the business process, not just its column names.',
    outcomes: [
      'Map transaction tables, header tables, line tables, and reference tables',
      'Recognise the difference between accounting, customer, supplier, and document entities',
      'Translate a stakeholder ask into the right table family',
      'Spot missing business filters before the report reaches users'
    ],
    drills: [
      'For every report, define document header, line, status, party, and accounting dimensions.',
      'Write down the business event each table represents before writing SQL.',
      'Use business keys and statuses to explain why records should or should not appear.',
      'Test business scenarios such as cancelled, unpaid, posted, and draft records.'
    ]
  }
]

export const DOMAIN_BLUEPRINTS = {
  AP: {
    label: 'Accounts Payable',
    businessGoal: 'Supplier invoices, payments, liabilities, and invoice approval reporting.',
    joinPatterns: [
      'Invoice header -> invoice lines -> supplier master',
      'Invoice header -> payment schedules -> payment records',
      'Invoice distributions -> GL code combinations for accounting impact'
    ],
    coreTables: [
      { name: 'AP_INVOICES_ALL', purpose: 'Invoice header data such as invoice number, supplier, date, amount, and status.' },
      { name: 'AP_INVOICE_LINES_ALL', purpose: 'Invoice line detail used when the report grain is line-level.' },
      { name: 'AP_INVOICE_DISTRIBUTIONS_ALL', purpose: 'Accounting distributions for invoice costs and liability postings.' },
      { name: 'AP_SUPPLIERS', purpose: 'Supplier master data for vendor name, number, and supplier attributes.' },
      { name: 'AP_PAYMENT_SCHEDULES_ALL', purpose: 'Due dates, instalments, and payment scheduling logic.' }
    ],
    cautions: [
      'Do not join invoice headers directly to distributions unless the report grain expects multiple accounting lines.',
      'Supplier joins should use supplier identifiers, not free-text names.',
      'Payment status and approval status often need separate business filters.'
    ]
  },
  AR: {
    label: 'Accounts Receivable',
    businessGoal: 'Customer invoices, receipts, balances, and collections reporting.',
    joinPatterns: [
      'Transaction header -> transaction lines -> customer account',
      'Receipts -> receipt applications -> transaction balances',
      'Transaction distributions -> GL impact for revenue and receivable accounting'
    ],
    coreTables: [
      { name: 'RA_CUSTOMER_TRX_ALL', purpose: 'Receivables transaction header for invoices, debit memos, and credit memos.' },
      { name: 'RA_CUSTOMER_TRX_LINES_ALL', purpose: 'Line-level detail for receivables transactions.' },
      { name: 'HZ_CUST_ACCOUNTS', purpose: 'Customer account master data.' },
      { name: 'AR_CASH_RECEIPTS_ALL', purpose: 'Receipt header data for incoming customer cash.' },
      { name: 'AR_RECEIVABLE_APPLICATIONS_ALL', purpose: 'How receipts are applied to transactions.' }
    ],
    cautions: [
      'Receipts and transactions are different business objects; do not force them into one grain without applications.',
      'Customer party, site, and account are separate levels and need the right join path.',
      'Open balance reports usually require status and application filters, not just amount columns.'
    ]
  },
  GL: {
    label: 'General Ledger',
    businessGoal: 'Journal, balance, and account analysis reporting across accounting periods.',
    joinPatterns: [
      'Journal headers -> journal lines -> code combinations',
      'Balances -> ledger -> accounting period',
      'Subledger drillback -> accounting linkage -> journal lines'
    ],
    coreTables: [
      { name: 'GL_JE_HEADERS', purpose: 'Journal entry header information such as journal source, category, and posting status.' },
      { name: 'GL_JE_LINES', purpose: 'Journal line details and accounted amounts.' },
      { name: 'GL_CODE_COMBINATIONS', purpose: 'Chart of accounts segment values behind an account combination.' },
      { name: 'GL_BALANCES', purpose: 'Period balances at account combination level.' },
      { name: 'GL_LEDGERS', purpose: 'Ledger metadata including currency and accounting setup.' }
    ],
    cautions: [
      'Journal headers do not define the account; that lives on journal lines and code combinations.',
      'Balances are already summarised, so joining them to transaction-level tables can corrupt the grain.',
      'Always filter by ledger and period explicitly in finance reports.'
    ]
  }
}
