export const SCENARIOS = [
  {
    id: 'SC-AP-001',
    moduleId: 'MOD-002',
    domain: 'AP',
    title: 'AP Unpaid Invoice Data Model',
    description: 'Build the AP data model for unpaid and partially paid supplier invoices.',
    difficulty: 'Intermediate',
    estimatedTime: '15 min',
    pointsOnPass: 150,
    persona: {
      name: 'Kavya Rao',
      role: 'AP Operations Lead',
      avatar: 'KR',
      avatarColor: '#C74634',
      message: 'I need an unpaid invoice report for India BU. Show invoice number, supplier, invoice date, due date, and remaining amount. Only invoices that still have money due should appear.'
    },
    tasks: [
      {
        id: 1,
        title: 'Build the base AP join',
        instruction: 'Write a query using AP_INVOICES_ALL as the starting table and join AP_SUPPLIERS and AP_PAYMENT_SCHEDULES_ALL.',
        hint: 'Use ai.vendor_id = sup.vendor_id and ai.invoice_id = aps.invoice_id.',
        validation: {
          type: 'sql',
          mustIncludeTables: ['AP_INVOICES_ALL', 'AP_SUPPLIERS', 'AP_PAYMENT_SCHEDULES_ALL'],
          mustHaveJoin: true,
          mustIncludeColumns: ['INVOICE_NUM', 'VENDOR_NAME', 'AMOUNT_DUE_REMAINING'],
          minRows: 3
        },
        points: 40
      },
      {
        id: 2,
        title: 'Add the unpaid condition',
        instruction: 'Filter the report so it returns only unpaid or partially paid invoices.',
        hint: 'Use aps.amount_due_remaining > 0.',
        validation: {
          type: 'sql',
          mustHaveWhere: true,
          mustInclude: ['AMOUNT_DUE_REMAINING > 0']
        },
        points: 40
      },
      {
        id: 3,
        title: 'Add BU parameter',
        instruction: 'Join HR_OPERATING_UNITS and filter for a runtime BU parameter called :p_bu_name.',
        hint: 'Use ai.org_id = bu.organization_id and add bu.name = :p_bu_name.',
        validation: {
          type: 'sql',
          mustIncludeTables: ['HR_OPERATING_UNITS'],
          mustIncludeBinds: [':p_bu_name'],
          mustHaveWhere: true
        },
        points: 30
      },
      {
        id: 4,
        title: 'Preview India BU invoices',
        instruction: 'Run the query with :p_bu_name = India BU and verify the output contains only rows with remaining amount greater than zero.',
        hint: 'Set the BU parameter to India BU before running.',
        validation: {
          type: 'execution',
          paramValues: { p_bu_name: 'India BU' },
          minRows: 2,
          rowRules: [
            { field: 'BU_NAME', operator: '=', value: 'India BU' },
            { field: 'AMOUNT_DUE_REMAINING', operator: '>', value: 0 }
          ]
        },
        points: 40
      }
    ],
    outcome: {
      pass: 'The AP data model is ready for BIP. Finance can now build the unpaid invoice layout on top of this dataset.',
      fail: 'Review the invoice join path and make sure the remaining amount condition is taken from AP_PAYMENT_SCHEDULES_ALL.'
    }
  },
  {
    id: 'SC-AR-001',
    moduleId: 'MOD-002',
    domain: 'AR',
    title: 'AR Open Receivables Data Model',
    description: 'Create the data model for customer invoices that still have open balance.',
    difficulty: 'Intermediate',
    estimatedTime: '15 min',
    pointsOnPass: 150,
    persona: {
      name: 'Nina Dsouza',
      role: 'Collections Manager',
      avatar: 'ND',
      avatarColor: '#0277BD',
      message: 'I need open receivables by customer for Vision Operations. Show transaction number, customer name, transaction date, due date, and remaining amount. Only items with open balance should appear.'
    },
    tasks: [
      {
        id: 1,
        title: 'Build the AR join path',
        instruction: 'Start from RA_CUSTOMER_TRX_ALL and join HZ_CUST_ACCOUNTS and AR_PAYMENT_SCHEDULES_ALL.',
        hint: 'Use rct.bill_to_customer_id = hca.cust_account_id and rct.customer_trx_id = aps.customer_trx_id.',
        validation: {
          type: 'sql',
          mustIncludeTables: ['RA_CUSTOMER_TRX_ALL', 'HZ_CUST_ACCOUNTS', 'AR_PAYMENT_SCHEDULES_ALL'],
          mustHaveJoin: true,
          mustIncludeColumns: ['TRX_NUMBER', 'CUSTOMER_NAME', 'AMOUNT_DUE_REMAINING'],
          minRows: 3
        },
        points: 40
      },
      {
        id: 2,
        title: 'Filter open balance',
        instruction: 'Return only receivables that still have amount due remaining.',
        hint: 'Use aps.amount_due_remaining > 0.',
        validation: {
          type: 'sql',
          mustHaveWhere: true,
          mustInclude: ['AMOUNT_DUE_REMAINING > 0']
        },
        points: 35
      },
      {
        id: 3,
        title: 'Add BU parameter',
        instruction: 'Join HR_OPERATING_UNITS and filter for :p_bu_name.',
        hint: 'Use rct.org_id = bu.organization_id and bu.name = :p_bu_name.',
        validation: {
          type: 'sql',
          mustIncludeTables: ['HR_OPERATING_UNITS'],
          mustIncludeBinds: [':p_bu_name']
        },
        points: 35
      },
      {
        id: 4,
        title: 'Preview Vision Operations receivables',
        instruction: 'Run the query with :p_bu_name = Vision Operations and verify all rows belong to that BU and have positive remaining amount.',
        hint: 'Use Vision Operations as the test BU value.',
        validation: {
          type: 'execution',
          paramValues: { p_bu_name: 'Vision Operations' },
          minRows: 2,
          rowRules: [
            { field: 'BU_NAME', operator: '=', value: 'Vision Operations' },
            { field: 'AMOUNT_DUE_REMAINING', operator: '>', value: 0 }
          ]
        },
        points: 40
      }
    ],
    outcome: {
      pass: 'The AR open receivables data model is correct and ready for layout design.',
      fail: 'Check the transaction-to-customer and transaction-to-payment-schedule joins, then validate the open balance condition.'
    }
  },
  {
    id: 'SC-AP-002',
    moduleId: 'MOD-002',
    domain: 'AP',
    title: 'AP Supplier Outstanding Summary',
    description: 'Summarise supplier outstanding balances for a business unit.',
    difficulty: 'Intermediate',
    estimatedTime: '12 min',
    pointsOnPass: 140,
    persona: {
      name: 'Manoj Iyer',
      role: 'AP Controller',
      avatar: 'MI',
      avatarColor: '#E65100',
      message: 'Give me supplier-wise outstanding balance for India BU. I do not need invoice detail, only supplier total outstanding so I can see whom we owe the most.'
    },
    tasks: [
      {
        id: 1,
        title: 'Build the AP summary join',
        instruction: 'Use AP_INVOICES_ALL, AP_SUPPLIERS, AP_PAYMENT_SCHEDULES_ALL, and HR_OPERATING_UNITS.',
        hint: 'Use the same AP path as the invoice detail report before you aggregate.',
        validation: {
          type: 'sql',
          mustIncludeTables: ['AP_INVOICES_ALL', 'AP_SUPPLIERS', 'AP_PAYMENT_SCHEDULES_ALL', 'HR_OPERATING_UNITS'],
          mustHaveJoin: true,
          minRows: 2
        },
        points: 35
      },
      {
        id: 2,
        title: 'Apply the correct business condition',
        instruction: 'Filter for open supplier liability only.',
        hint: 'Use aps.amount_due_remaining > 0.',
        validation: {
          type: 'sql',
          mustHaveWhere: true,
          mustInclude: ['AMOUNT_DUE_REMAINING > 0']
        },
        points: 35
      },
      {
        id: 3,
        title: 'Aggregate by supplier',
        instruction: 'Return VENDOR_NAME and SUM(AMOUNT_DUE_REMAINING) grouped by supplier.',
        hint: 'Use SUM and GROUP BY VENDOR_NAME.',
        validation: {
          type: 'sql',
          mustInclude: ['SUM', 'GROUP BY'],
          mustIncludeColumns: ['VENDOR_NAME', 'AMOUNT_DUE_REMAINING']
        },
        points: 35
      },
      {
        id: 4,
        title: 'Preview India BU summary',
        instruction: 'Run the query with :p_bu_name = India BU and verify all rows belong to India BU.',
        hint: 'Use the same BU parameter pattern as the invoice detail model.',
        validation: {
          type: 'execution',
          paramValues: { p_bu_name: 'India BU' },
          minRows: 1,
          rowRules: [{ field: 'BU_NAME', operator: '=', value: 'India BU' }]
        },
        points: 35
      }
    ],
    outcome: {
      pass: 'The supplier outstanding summary is ready and the AP team can now identify major liabilities quickly.',
      fail: 'Make sure you are summarising supplier-level outstanding balance instead of returning raw invoice detail.'
    }
  },
  {
    id: 'SC-AR-002',
    moduleId: 'MOD-002',
    domain: 'AR',
    title: 'AR Customer Outstanding Summary',
    description: 'Summarise open receivables by customer for collections follow-up.',
    difficulty: 'Intermediate',
    estimatedTime: '12 min',
    pointsOnPass: 140,
    persona: {
      name: 'Rhea Kapoor',
      role: 'Collections Analyst',
      avatar: 'RK',
      avatarColor: '#7B1FA2',
      message: 'Show me customer-wise open receivables for Vision Operations. I want customer total outstanding, not transaction detail.'
    },
    tasks: [
      {
        id: 1,
        title: 'Build the AR summary join',
        instruction: 'Use RA_CUSTOMER_TRX_ALL, HZ_CUST_ACCOUNTS, AR_PAYMENT_SCHEDULES_ALL, and HR_OPERATING_UNITS.',
        hint: 'Start from the transaction table, then join customer and payment schedule logic.',
        validation: {
          type: 'sql',
          mustIncludeTables: ['RA_CUSTOMER_TRX_ALL', 'HZ_CUST_ACCOUNTS', 'AR_PAYMENT_SCHEDULES_ALL', 'HR_OPERATING_UNITS'],
          mustHaveJoin: true
        },
        points: 35
      },
      {
        id: 2,
        title: 'Apply the open balance condition',
        instruction: 'Return only transactions with remaining receivable amount.',
        hint: 'Use aps.amount_due_remaining > 0.',
        validation: {
          type: 'sql',
          mustInclude: ['AMOUNT_DUE_REMAINING > 0'],
          mustHaveWhere: true
        },
        points: 35
      },
      {
        id: 3,
        title: 'Aggregate by customer',
        instruction: 'Return CUSTOMER_NAME and SUM(AMOUNT_DUE_REMAINING) grouped by customer.',
        hint: 'Use SUM and GROUP BY CUSTOMER_NAME.',
        validation: {
          type: 'sql',
          mustInclude: ['SUM', 'GROUP BY'],
          mustIncludeColumns: ['CUSTOMER_NAME', 'AMOUNT_DUE_REMAINING']
        },
        points: 35
      },
      {
        id: 4,
        title: 'Preview Vision Operations summary',
        instruction: 'Run the query with :p_bu_name = Vision Operations and verify all rows belong to that BU.',
        hint: 'Filter with the BU parameter before running.',
        validation: {
          type: 'execution',
          paramValues: { p_bu_name: 'Vision Operations' },
          minRows: 1,
          rowRules: [{ field: 'BU_NAME', operator: '=', value: 'Vision Operations' }]
        },
        points: 35
      }
    ],
    outcome: {
      pass: 'The AR customer summary is ready for collections review.',
      fail: 'Check whether you are grouping by customer correctly and still keeping the open balance condition.'
    }
  },
  {
    id: 'SC-GL-001',
    moduleId: 'MOD-002',
    domain: 'GL',
    title: 'GL Trial Balance Data Model',
    description: 'Build a trial balance dataset for a specific ledger and accounting period.',
    difficulty: 'Intermediate',
    estimatedTime: '15 min',
    pointsOnPass: 150,
    persona: {
      name: 'Arun Menon',
      role: 'GL Reporting Analyst',
      avatar: 'AM',
      avatarColor: '#2E7D32',
      message: 'Create a trial balance for Vision Ledger for JAN-26. I need account combination, period name, entered debit, entered credit, and ending balance.'
    },
    tasks: [
      {
        id: 1,
        title: 'Build the GL balance join',
        instruction: 'Use GL_BALANCES as the starting table and join GL_CODE_COMBINATIONS and GL_LEDGERS.',
        hint: 'Join on code_combination_id and ledger_id.',
        validation: {
          type: 'sql',
          mustIncludeTables: ['GL_BALANCES', 'GL_CODE_COMBINATIONS', 'GL_LEDGERS'],
          mustHaveJoin: true,
          mustIncludeColumns: ['PERIOD_NAME', 'SEGMENT1', 'ENDING_BALANCE'],
          minRows: 3
        },
        points: 40
      },
      {
        id: 2,
        title: 'Add ledger and period parameters',
        instruction: 'Filter the trial balance using :p_ledger_name and :p_period_name.',
        hint: 'Use gl.name = :p_ledger_name and gb.period_name = :p_period_name.',
        validation: {
          type: 'sql',
          mustIncludeBinds: [':p_ledger_name', ':p_period_name'],
          mustHaveWhere: true
        },
        points: 40
      },
      {
        id: 3,
        title: 'Sort by account segment',
        instruction: 'Order the output by SEGMENT1 then SEGMENT2.',
        hint: 'Use ORDER BY gcc.segment1, gcc.segment2.',
        validation: {
          type: 'sql',
          mustInclude: ['ORDER BY']
        },
        points: 30
      },
      {
        id: 4,
        title: 'Preview Vision Ledger JAN-26',
        instruction: 'Run the query with Vision Ledger and JAN-26. Confirm you only see that ledger and period.',
        hint: 'Set p_ledger_name = Vision Ledger and p_period_name = JAN-26.',
        validation: {
          type: 'execution',
          paramValues: { p_ledger_name: 'Vision Ledger', p_period_name: 'JAN-26' },
          minRows: 2,
          rowRules: [
            { field: 'LEDGER_NAME', operator: '=', value: 'Vision Ledger' },
            { field: 'PERIOD_NAME', operator: '=', value: 'JAN-26' }
          ]
        },
        points: 40
      }
    ],
    outcome: {
      pass: 'The GL trial balance dataset is ready for BIP publishing.',
      fail: 'Make sure the balance table drives the query and the ledger/period filters are applied correctly.'
    }
  },
  {
    id: 'SC-GL-002',
    moduleId: 'MOD-002',
    domain: 'GL',
    title: 'GL Account Balance Summary',
    description: 'Build a summarised GL balance report by account segment.',
    difficulty: 'Intermediate',
    estimatedTime: '12 min',
    pointsOnPass: 140,
    persona: {
      name: 'Deepak Sharma',
      role: 'Finance Systems Lead',
      avatar: 'DS',
      avatarColor: '#009688',
      message: 'I need a ledger-period account balance summary. Show account segment and ending balance for Vision Ledger in JAN-26.'
    },
    tasks: [
      {
        id: 1,
        title: 'Use the GL balance path',
        instruction: 'Start from GL_BALANCES and join GL_CODE_COMBINATIONS and GL_LEDGERS.',
        hint: 'This is still a balance report, so do not start from journal headers.',
        validation: {
          type: 'sql',
          mustIncludeTables: ['GL_BALANCES', 'GL_CODE_COMBINATIONS', 'GL_LEDGERS'],
          mustHaveJoin: true
        },
        points: 35
      },
      {
        id: 2,
        title: 'Apply the ledger and period condition',
        instruction: 'Filter using :p_ledger_name and :p_period_name.',
        hint: 'Both are required business controls in GL reporting.',
        validation: {
          type: 'sql',
          mustIncludeBinds: [':p_ledger_name', ':p_period_name'],
          mustHaveWhere: true
        },
        points: 35
      },
      {
        id: 3,
        title: 'Return a summary shape',
        instruction: 'Return SEGMENT1, SEGMENT2, and ENDING_BALANCE sorted by account segment.',
        hint: 'Use ORDER BY on account segments.',
        validation: {
          type: 'sql',
          mustIncludeColumns: ['SEGMENT1', 'SEGMENT2', 'ENDING_BALANCE'],
          mustInclude: ['ORDER BY']
        },
        points: 35
      },
      {
        id: 4,
        title: 'Preview Vision Ledger JAN-26 summary',
        instruction: 'Run the query with Vision Ledger and JAN-26 and verify all rows belong to that ledger and period.',
        hint: 'Use p_ledger_name and p_period_name as runtime inputs.',
        validation: {
          type: 'execution',
          paramValues: { p_ledger_name: 'Vision Ledger', p_period_name: 'JAN-26' },
          minRows: 2,
          rowRules: [
            { field: 'LEDGER_NAME', operator: '=', value: 'Vision Ledger' },
            { field: 'PERIOD_NAME', operator: '=', value: 'JAN-26' }
          ]
        },
        points: 35
      }
    ],
    outcome: {
      pass: 'The GL account summary is valid and ready to be used in a lightweight BIP layout.',
      fail: 'Keep the report balance-driven and make sure ledger and period filters remain explicit.'
    }
  }
]
