export const DOMAIN_LABS = {
  AP: {
    title: 'AP Foundations Lab',
    audience: 'Accounts Payable reporting analysts',
    stages: [
      {
        id: 'ap-business',
        type: 'lesson',
        title: 'Think Like Finance First',
        body: 'Before writing SQL, define what the AP report is really about. In Accounts Payable, most reports are about invoices, suppliers, payments, approval status, due dates, or remaining liability.',
        takeaways: [
          'Start from the business question, not from table names.',
          'Invoice reports usually start from the invoice object.',
          'Ask whether the finance team wants detail, summary, overdue, unpaid, or partially paid invoices.'
        ]
      },
      {
        id: 'ap-starting-table',
        type: 'quiz',
        title: 'Choose the Starting Table',
        prompt: 'The business asks for a report of unpaid invoices. Which table should drive the query first?',
        options: [
          'AP_INVOICES_ALL',
          'AP_SUPPLIERS',
          'AP_PAYMENT_SCHEDULES_ALL',
          'HZ_PARTIES'
        ],
        answer: 0,
        feedback: {
          correct: 'Correct. The report is about invoices, so the invoice table is the right starting point.',
          incorrect: 'Start with the object the report is really about. For unpaid invoice reporting, that is the invoice header.'
        }
      },
      {
        id: 'ap-join-logic',
        type: 'quiz',
        title: 'Pick the Correct Join Path',
        prompt: 'Which join path is the clean consultant-style structure for unpaid invoice reporting?',
        options: [
          'AP_INVOICES_ALL -> AP_SUPPLIERS -> AP_PAYMENT_SCHEDULES_ALL',
          'AP_SUPPLIERS -> AP_INVOICES_ALL -> HZ_PARTIES',
          'AP_PAYMENT_SCHEDULES_ALL -> AP_SUPPLIERS -> GL_BALANCES',
          'HZ_PARTIES -> AP_SUPPLIERS -> AP_INVOICES_ALL'
        ],
        answer: 0,
        feedback: {
          correct: 'Correct. Start with invoices, then join supplier and payment schedule logic through the real business keys.',
          incorrect: 'Keep it simple and follow the data path. Start with invoices, then join supplier and payment schedule data.'
        }
      },
      {
        id: 'ap-filter-logic',
        type: 'quiz',
        title: 'Apply the Right Business Condition',
        prompt: 'What condition best captures unpaid or partially paid invoices?',
        options: [
          'invoice_amount > 0',
          'amount_due_remaining > 0',
          'amount_paid = 0',
          'due_date IS NOT NULL'
        ],
        answer: 1,
        feedback: {
          correct: 'Correct. Remaining amount greater than zero captures both fully unpaid and partially paid invoices.',
          incorrect: 'Think like finance. Remaining amount is what determines whether liability is still open.'
        }
      },
      {
        id: 'ap-business-condition',
        type: 'quiz',
        title: 'Business Condition Practice',
        prompt: 'If the AP lead asks for overdue unpaid invoices, which additional condition matters most?',
        options: [
          'invoice_amount > 0',
          'due_date < SYSDATE',
          'vendor_id IS NOT NULL',
          'invoice_num IS NOT NULL'
        ],
        answer: 1,
        feedback: {
          correct: 'Correct. Overdue means the due date has already passed.',
          incorrect: 'Translate the business word carefully. “Overdue” is a due-date condition, not just an amount condition.'
        }
      }
    ]
  },
  AR: {
    title: 'AR Foundations Lab',
    audience: 'Accounts Receivable reporting analysts',
    stages: [
      {
        id: 'ar-business',
        type: 'lesson',
        title: 'Understand the Receivables Story',
        body: 'AR reports are usually about customer invoices, receipts, applications, open balances, and collections. Always clarify whether the user wants customer transaction detail or receipt activity.',
        takeaways: [
          'Customer transactions and cash receipts are different business objects.',
          'Aging and open balance reports normally start from customer transactions.',
          'Receipt application logic matters when showing what is still outstanding.'
        ]
      },
      {
        id: 'ar-starting-table',
        type: 'quiz',
        title: 'Choose the Starting Table',
        prompt: 'The collections team wants open customer invoices by customer. Which table should drive the report?',
        options: [
          'AR_CASH_RECEIPTS_ALL',
          'RA_CUSTOMER_TRX_ALL',
          'HZ_CUST_ACCOUNTS',
          'GL_JE_HEADERS'
        ],
        answer: 1,
        feedback: {
          correct: 'Correct. The report is about customer transactions, so the AR transaction header is the best starting point.',
          incorrect: 'Start with the object the report is about. Open invoice reporting is based on receivables transactions, not receipts.'
        }
      },
      {
        id: 'ar-join-logic',
        type: 'quiz',
        title: 'Pick the Correct Join Path',
        prompt: 'Which join path best fits an AR customer invoice report?',
        options: [
          'RA_CUSTOMER_TRX_ALL -> RA_CUSTOMER_TRX_LINES_ALL -> HZ_CUST_ACCOUNTS',
          'HZ_CUST_ACCOUNTS -> AR_CASH_RECEIPTS_ALL -> GL_BALANCES',
          'AR_CASH_RECEIPTS_ALL -> HZ_CUST_ACCOUNTS -> AP_SUPPLIERS',
          'GL_CODE_COMBINATIONS -> RA_CUSTOMER_TRX_ALL -> AR_CASH_RECEIPTS_ALL'
        ],
        answer: 0,
        feedback: {
          correct: 'Correct. Start with the receivable transaction and extend to lines and customer account information.',
          incorrect: 'Follow the transaction data path. Customer accounts support the report, but they should not drive the invoice transaction query.'
        }
      },
      {
        id: 'ar-filter-logic',
        type: 'quiz',
        title: 'Apply the Right Business Condition',
        prompt: 'What should you clarify before treating all customer transactions as open receivables?',
        options: [
          'Whether the output is Excel or PDF',
          'Whether receipts have already been applied or balances reduced',
          'Whether the customer has an email address',
          'Whether the report uses BI Publisher bursting'
        ],
        answer: 1,
        feedback: {
          correct: 'Correct. Open balance reporting depends on receipt application and remaining receivable logic.',
          incorrect: 'The business meaning of “open” depends on whether receipts or credits have already been applied.'
        }
      },
      {
        id: 'ar-business-condition',
        type: 'quiz',
        title: 'Business Condition Practice',
        prompt: 'If collections asks for overdue open receivables, what extra business condition should you think about?',
        options: [
          'The due date must already be past today',
          'The customer name must not be null',
          'The output must be PDF',
          'The transaction number must be sorted'
        ],
        answer: 0,
        feedback: {
          correct: 'Correct. “Overdue” is driven by due date, not just by open amount.',
          incorrect: 'Open amount tells you it is outstanding. Overdue adds a due-date condition.'
        }
      }
    ]
  },
  GL: {
    title: 'GL Foundations Lab',
    audience: 'General Ledger reporting analysts',
    stages: [
      {
        id: 'gl-business',
        type: 'lesson',
        title: 'Start with Ledger and Grain',
        body: 'GL reports are usually about journals, balances, account combinations, ledgers, and accounting periods. The first question is always whether the business wants transaction detail or summarised balances.',
        takeaways: [
          'Trial balance and balance reports usually start from summarised balances.',
          'Journal reports usually start from journal headers and lines.',
          'Ledger and period filters should be explicit in finance reports.'
        ]
      },
      {
        id: 'gl-starting-table',
        type: 'quiz',
        title: 'Choose the Starting Table',
        prompt: 'The user wants a trial balance by account and period. Which table is the best starting point?',
        options: [
          'GL_JE_HEADERS',
          'GL_BALANCES',
          'GL_IMPORT_REFERENCES',
          'AP_INVOICES_ALL'
        ],
        answer: 1,
        feedback: {
          correct: 'Correct. Trial balance reporting is balance-oriented, so GL_BALANCES is the natural starting point.',
          incorrect: 'Think about report grain. Trial balance is a balance report, not a journal header report.'
        }
      },
      {
        id: 'gl-join-logic',
        type: 'quiz',
        title: 'Pick the Correct Join Path',
        prompt: 'Which join path best supports a GL trial balance output?',
        options: [
          'GL_BALANCES -> GL_CODE_COMBINATIONS -> GL_LEDGERS',
          'GL_JE_HEADERS -> AP_SUPPLIERS -> GL_BALANCES',
          'GL_LEDGERS -> AR_CASH_RECEIPTS_ALL -> GL_JE_LINES',
          'GL_CODE_COMBINATIONS -> HZ_CUST_ACCOUNTS -> GL_LEDGERS'
        ],
        answer: 0,
        feedback: {
          correct: 'Correct. Balances connect to account combinations and ledger context for trial balance reporting.',
          incorrect: 'Keep the grain consistent. Trial balance should stay in the balance and account structure path.'
        }
      },
      {
        id: 'gl-filter-logic',
        type: 'quiz',
        title: 'Apply the Right Business Condition',
        prompt: 'Which filter pair is most important to avoid misleading GL output?',
        options: [
          'Supplier and due date',
          'Customer and receipt number',
          'Ledger and accounting period',
          'Invoice amount and payment status'
        ],
        answer: 2,
        feedback: {
          correct: 'Correct. Ledger and period are core business controls in GL reporting.',
          incorrect: 'GL reports need accounting context first. Ledger and period are the minimum business filters.'
        }
      },
      {
        id: 'gl-business-condition',
        type: 'quiz',
        title: 'Business Condition Practice',
        prompt: 'If finance asks for a clean trial balance, what should always be explicit in the business condition?',
        options: [
          'Supplier and due date',
          'Customer and receipt status',
          'Ledger and accounting period',
          'Vendor and invoice amount'
        ],
        answer: 2,
        feedback: {
          correct: 'Correct. Trial balance meaning changes completely if ledger or period is ambiguous.',
          incorrect: 'In GL, ledger and period define the accounting context of the result.'
        }
      }
    ]
  }
}
