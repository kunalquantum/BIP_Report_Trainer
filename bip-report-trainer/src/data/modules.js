export const BIP_MODULES = [
  {
    id: 'MOD-001',
    title: 'Introduction to BIP Reporting',
    description: 'Understand the fundamentals of Oracle Business Intelligence Publisher',
    icon: '📘',
    color: '#C74634',
    difficulty: 'Beginner',
    estimatedTime: '45 min',
    pointsOnComplete: 100,
    steps: [
      {
        id: 1,
        title: 'What is BIP?',
        type: 'lesson',
        content: 'Oracle Business Intelligence Publisher (BIP) is an enterprise reporting solution that separates data extraction from layout design. It allows you to author, manage, and deliver highly formatted documents to users across the organization.',
        keyPoints: [
          'BIP separates data (Data Model) from presentation (Layout Template)',
          'Supports output formats: PDF, Excel, HTML, CSV, RTF, PowerPoint',
          'Reports can be scheduled, bursted, and delivered via email or FTP',
          'Integrates natively with Oracle E-Business Suite and Fusion Applications'
        ]
      },
      {
        id: 2,
        title: 'BIP Core Components',
        type: 'lesson',
        content: 'Every BIP report is built from four core components that work together to produce the final output delivered to users.',
        keyPoints: [
          'Data Model — defines the SQL, stored proc, or XML data source',
          'Layout Template — RTF, XSL, or eText file defining the visual structure',
          'Report Definition — binds the data model to one or more layouts',
          'Delivery — scheduler, bursting engine, or on-demand user request'
        ]
      },
      {
        id: 3,
        title: 'Navigating the BIP Interface',
        type: 'lesson',
        content: 'The BIP web interface is accessed via a browser. The Catalog is your home — it is a folder-based repository where all data models, reports, and templates are stored and organised by department or function.',
        keyPoints: [
          'Catalog — browse and organise all BIP objects',
          'New button — create Data Models, Reports, or Sub Templates',
          'Report Editor — design layouts and bind data',
          'Schedule — set up automated delivery'
        ]
      },
      {
        id: 4,
        title: 'Output Formats Explained',
        type: 'lesson',
        content: 'BIP can render the same report in multiple formats without changing the underlying data. The format is selected at runtime by the user or set in the schedule definition.',
        keyPoints: [
          'PDF — best for formatted, print-ready documents (payslips, invoices)',
          'Excel — best for data that users will analyse or pivot further',
          'HTML — best for online viewing inside a portal or dashboard',
          'CSV — best for raw data extraction and system integrations',
          'eText — best for EDI and flat-file integrations'
        ]
      },
      {
        id: 5,
        title: 'Quiz: BIP Fundamentals',
        type: 'quiz',
        content: 'Test your understanding of BIP fundamentals before moving on.',
        questions: [
          {
            q: 'What does BIP stand for?',
            options: [
              'Business Intelligence Publisher',
              'Business Integration Platform',
              'Basic Interface Protocol',
              'Build In Process'
            ],
            answer: 0,
            explanation: 'BIP stands for Business Intelligence Publisher — Oracle\'s enterprise reporting tool.'
          },
          {
            q: 'Which BIP component defines where data comes from?',
            options: [
              'Layout Template',
              'Report Definition',
              'Data Model',
              'Delivery Engine'
            ],
            answer: 2,
            explanation: 'The Data Model defines the data source — SQL query, stored procedure, or XML feed.'
          },
          {
            q: 'Which output format is best for a payslip that must be printed?',
            options: ['CSV', 'HTML', 'PDF', 'eText'],
            answer: 2,
            explanation: 'PDF preserves exact formatting and is ideal for print-ready documents like payslips.'
          },
          {
            q: 'Where are all BIP reports and data models stored?',
            options: ['The Schedule', 'The Catalog', 'The Layout Editor', 'The Delivery Engine'],
            answer: 1,
            explanation: 'The Catalog is the folder-based repository that holds all BIP objects.'
          }
        ]
      }
    ]
  },
  {
    id: 'MOD-002',
    title: 'Data Models',
    description: 'Create and configure BIP data models using SQL datasets, parameters, and bind variables',
    icon: '🗄️',
    color: '#0277BD',
    difficulty: 'Intermediate',
    estimatedTime: '60 min',
    pointsOnComplete: 150,
    steps: [
      {
        id: 1,
        title: 'What is a Data Model?',
        type: 'lesson',
        content: 'A Data Model is the foundation of every BIP report. It defines the dataset returned from one or more data sources. The data model is reusable — multiple report layouts can be bound to the same data model.',
        keyPoints: [
          'One data model can power multiple report layouts',
          'Supports SQL Query, MDX, HTTP Feed, Web Service, and View Object datasets',
          'Parameters defined here become filters users can set at runtime',
          'Data models produce an XML output that layouts consume'
        ]
      },
      {
        id: 2,
        title: 'Creating a SQL Dataset',
        type: 'code',
        content: 'The most common dataset type is a SQL Query. You write standard SQL against the database schema. Use bind variables prefixed with a colon (:) to accept runtime parameters from users.',
        codeExample: `SELECT
  emp.employee_id,
  emp.first_name || ' ' || emp.last_name  AS full_name,
  dept.department_name,
  job.job_title,
  emp.salary,
  emp.hire_date
FROM
  hr.employees   emp
  JOIN hr.departments dept ON emp.department_id = dept.department_id
  JOIN hr.jobs        job  ON emp.job_id        = job.job_id
WHERE
  emp.hire_date BETWEEN :p_start_date AND :p_end_date
ORDER BY
  dept.department_name,
  emp.last_name`
      },
      {
        id: 3,
        title: 'Adding Parameters',
        type: 'lesson',
        content: 'Parameters allow users to filter the report at runtime. Every bind variable in your SQL (like :p_start_date) must have a matching parameter defined in the Parameters section of the Data Model.',
        keyPoints: [
          'Parameter name must match the bind variable exactly (e.g. p_start_date)',
          'Data types: Text, Number, Date, Boolean, Menu (list of values)',
          'You can set a default value so the report always has a fallback',
          'Menu parameters can be backed by a SQL query (dynamic LOV)'
        ]
      },
      {
        id: 4,
        title: 'Previewing Data Model Output',
        type: 'lesson',
        content: 'Before building a layout, always preview your data model to verify the XML structure it produces. Click "View Data" in the Data Model editor, enter test parameter values, and inspect the XML output.',
        keyPoints: [
          'Click View Data → enter parameter values → click View',
          'BIP generates an XML sample — this is what the layout will consume',
          'Check that all expected columns appear in the XML',
          'Save the sample XML — you will need it when designing the RTF template'
        ]
      },
      {
        id: 5,
        title: 'Quiz: Data Models',
        type: 'quiz',
        content: 'Test your understanding of BIP Data Models.',
        questions: [
          {
            q: 'How do you reference a runtime parameter in a BIP SQL query?',
            options: [
              'Use ${parameter_name}',
              'Use :parameter_name',
              'Use @parameter_name',
              'Use {parameter_name}'
            ],
            answer: 1,
            explanation: 'BIP uses Oracle bind variable syntax — prefix the parameter name with a colon, e.g. :p_start_date.'
          },
          {
            q: 'What format does a BIP Data Model produce as output?',
            options: ['JSON', 'CSV', 'XML', 'YAML'],
            answer: 2,
            explanation: 'BIP Data Models always produce XML output, which is then consumed by the layout template.'
          },
          {
            q: 'Why would you save the sample XML from a Data Model preview?',
            options: [
              'To email to the end user',
              'To use when designing the RTF layout template',
              'To import into Excel directly',
              'To submit to Oracle Support'
            ],
            answer: 1,
            explanation: 'The sample XML is loaded into the BI Publisher Desktop plugin when designing RTF templates — it provides the field names available for insertion.'
          }
        ]
      }
    ]
  },
  {
    id: 'MOD-003',
    title: 'Report Layout & Templates',
    description: 'Design professional report layouts using RTF templates and the BI Publisher Desktop plugin',
    icon: '📐',
    color: '#2E7D32',
    difficulty: 'Intermediate',
    estimatedTime: '75 min',
    pointsOnComplete: 150,
    steps: [
      {
        id: 1,
        title: 'Layout Types in BIP',
        type: 'lesson',
        content: 'BIP supports several layout types. RTF (Rich Text Format) templates are the most common — they are designed in Microsoft Word using the BI Publisher Desktop plugin.',
        keyPoints: [
          'RTF Template — designed in MS Word, most flexible for formatted reports',
          'XSL-FO Template — XML stylesheet, for complex programmatic layouts',
          'eText Template — for flat file and EDI outputs',
          'Interactive Viewer — built-in drag-and-drop layout editor in the browser'
        ]
      },
      {
        id: 2,
        title: 'Installing BI Publisher Desktop',
        type: 'lesson',
        content: 'To design RTF templates you need the BI Publisher Desktop plugin for Microsoft Word. This adds a BIP toolbar to Word that lets you insert data fields, tables, and conditional logic.',
        keyPoints: [
          'Download from Oracle: BI Publisher Desktop (32-bit or 64-bit to match your Word)',
          'After install, a new "BI Publisher" tab appears in the Word ribbon',
          'Load your saved sample XML from the Data Model preview',
          'Use the Field Browser to drag and drop fields into the template'
        ]
      },
      {
        id: 3,
        title: 'Inserting Fields and Tables',
        type: 'lesson',
        content: 'Once the sample XML is loaded in Word, you can insert data fields anywhere in the document. For repeating rows (like employee records) you use a For-Each loop inside a Word table.',
        keyPoints: [
          'Single field: Insert → Field → select field name from XML tree',
          'Repeating table: Insert a For-Each group around the table rows',
          'Use <?for-each:ROW?> and <?end for-each?> tags for loops',
          'Sorting: <?sort:COLUMN_NAME;\'ascending\'?>'
        ]
      },
      {
        id: 4,
        title: 'Conditional Formatting',
        type: 'code',
        content: 'BIP RTF templates support XSL conditional logic using special field tags. This lets you highlight rows, show/hide sections, or display different content based on data values.',
        codeExample: `-- Show a warning label if salary exceeds 10000
<?if:SALARY > 10000?>
  HIGH EARNER
<?end if?>

-- Alternate row shading (odd/even)
<?if:position() mod 2 = 0?>
  [apply grey background to this row in Word]
<?end if?>

-- Show department total only when dept changes
<?if:DEPARTMENT_NAME != preceding-sibling::ROW[1]/DEPARTMENT_NAME?>
  Department Subtotal: <?DEPT_TOTAL?>
<?end if?>`
      },
      {
        id: 5,
        title: 'Quiz: Layouts & Templates',
        type: 'quiz',
        content: 'Test your understanding of BIP layout design.',
        questions: [
          {
            q: 'What tool do you use to design RTF templates for BIP?',
            options: [
              'Oracle SQL Developer',
              'Microsoft Word with BI Publisher Desktop plugin',
              'Oracle JDeveloper',
              'Adobe Acrobat'
            ],
            answer: 1,
            explanation: 'RTF templates are designed in Microsoft Word using the BI Publisher Desktop add-in.'
          },
          {
            q: 'What BIP tag do you use to repeat a table row for each data record?',
            options: [
              '<?repeat:ROW?>',
              '<?loop:ROW?>',
              '<?for-each:ROW?>',
              '<?each:ROW?>'
            ],
            answer: 2,
            explanation: 'The <?for-each:ROW?> and <?end for-each?> tags create a repeating group around table rows.'
          }
        ]
      }
    ]
  },
  {
    id: 'MOD-004',
    title: 'Bursting & Delivery',
    description: 'Configure report bursting to split and deliver personalised output to multiple recipients',
    icon: '📤',
    color: '#7B1FA2',
    difficulty: 'Advanced',
    estimatedTime: '90 min',
    pointsOnComplete: 200,
    steps: [
      {
        id: 1,
        title: 'What is Report Bursting?',
        type: 'lesson',
        content: 'Bursting allows BIP to run a single report once, split the output by a key value (e.g. department or employee), and deliver each split to a different recipient automatically.',
        keyPoints: [
          'Run once, deliver to hundreds of recipients in one job',
          'Split key is typically a field like DEPARTMENT_ID or EMPLOYEE_ID',
          'Each recipient only sees their own slice of data',
          'Delivery can be email, FTP, printer, or file system per recipient'
        ]
      },
      {
        id: 2,
        title: 'Bursting Query',
        type: 'code',
        content: 'The Bursting Query defines who gets what. It must return specific columns that BIP uses to route each output slice to the right destination.',
        codeExample: `-- Required columns for email bursting
SELECT
  department_id       AS "KEY",
  department_name     AS "TEMPLATE",
  'EMAIL'             AS "DELIVERY_CHANNEL",
  manager_email       AS "EMAIL_TO",
  'payroll@corp.com'  AS "EMAIL_FROM",
  'Monthly Payroll Report - ' || department_name AS "EMAIL_SUBJECT",
  'PDF'               AS "OUTPUT_FORMAT",
  'en-US'             AS "LOCALE"
FROM
  hr.departments
WHERE
  department_id IN (SELECT DISTINCT department_id FROM hr.employees)`
      },
      {
        id: 3,
        title: 'Quiz: Bursting',
        type: 'quiz',
        content: 'Test your understanding of BIP bursting.',
        questions: [
          {
            q: 'What is the purpose of the KEY column in a bursting query?',
            options: [
              'It sets the email subject line',
              'It identifies the split point — each unique value becomes a separate output',
              'It defines the output file format',
              'It sets the report template to use'
            ],
            answer: 1,
            explanation: 'The KEY column is the split field. BIP creates one output file per unique KEY value and routes each to the matching recipient.'
          }
        ]
      }
    ]
  },
  {
    id: 'MOD-005',
    title: 'Scheduling & Administration',
    description: 'Automate report delivery with schedules, monitor job history, and manage BIP administration',
    icon: '🕐',
    color: '#E65100',
    difficulty: 'Advanced',
    estimatedTime: '60 min',
    pointsOnComplete: 200,
    steps: [
      {
        id: 1,
        title: 'Creating a Schedule',
        type: 'lesson',
        content: 'BIP schedules allow reports to run automatically at defined intervals without user intervention. Schedules are created from the Report Viewer by clicking Schedule.',
        keyPoints: [
          'Frequency options: Once, Hourly, Daily, Weekly, Monthly, or Cron expression',
          'Parameter values are fixed at schedule creation time',
          'Output can be saved to the catalog, emailed, or FTP\'d',
          'Multiple schedules can exist for the same report with different parameters'
        ]
      },
      {
        id: 2,
        title: 'Monitoring Job History',
        type: 'lesson',
        content: 'Every scheduled job produces a history entry. You can view the status (Success, Running, Failed), the output produced, and any error messages from the Report Job History screen.',
        keyPoints: [
          'Navigate to: Manage → Report Job History',
          'Filter by status, date range, or report name',
          'Click a job to see full logs and output files',
          'Failed jobs show the exact error — common causes are SQL errors or missing parameters'
        ]
      },
      {
        id: 3,
        title: 'Quiz: Scheduling',
        type: 'quiz',
        content: 'Test your understanding of BIP scheduling.',
        questions: [
          {
            q: 'Where do you go to check why a scheduled BIP report failed?',
            options: [
              'The Data Model editor',
              'Report Job History',
              'The Catalog',
              'Oracle Support'
            ],
            answer: 1,
            explanation: 'Report Job History shows all scheduled job runs with their status and full error logs.'
          }
        ]
      }
    ]
  }
]