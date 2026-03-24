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
  }
]
