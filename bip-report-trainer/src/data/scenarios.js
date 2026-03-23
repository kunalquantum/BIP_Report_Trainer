export const SCENARIOS = [
  {
    id: 'SC-001',
    moduleId: 'MOD-002',
    title: 'Build a Payroll Data Model',
    description: 'The Finance team needs a monthly payroll report. Your job is to write the SQL data model that powers it.',
    difficulty: 'Intermediate',
    estimatedTime: '15 min',
    pointsOnPass: 150,
    persona: {
      name: 'Sarah Mitchell',
      role: 'Finance Manager',
      avatar: 'SM',
      avatarColor: '#0277BD',
      message: `Hi! I need a monthly payroll report showing all employees with their department, job title, and salary. I need to be able to filter it by department. Can you build the data model for me?`
    },
    tasks: [
      {
        id: 1,
        title: 'Write the base SQL',
        instruction: 'Write a SELECT query that returns employee_id, full name, department_name, job_title, and salary from hr.employees joined with hr.departments and hr.jobs.',
        hint: 'Join hr.employees to hr.departments on department_id, and to hr.jobs on job_id. Use concatenation for full name.',
        validation: {
          type: 'sql',
          mustIncludeTables: ['hr.employees', 'hr.departments'],
          mustIncludeColumns: ['SALARY', 'DEPARTMENT_NAME'],
          mustHaveJoin: true,
          minRows: 5
        },
        points: 40
      },
      {
        id: 2,
        title: 'Add a department parameter',
        instruction: 'Modify your query to filter by department using a bind variable :p_department_id in the WHERE clause.',
        hint: 'Add WHERE emp.department_id = :p_department_id to your query.',
        validation: {
          type: 'sql',
          mustIncludeBinds: [':p_department_id'],
          mustHaveWhere: true
        },
        points: 40
      },
      {
        id: 3,
        title: 'Sort the results',
        instruction: 'Add an ORDER BY clause to sort results by department_name then last_name.',
        hint: 'Add ORDER BY dept.department_name, emp.last_name at the end of the query.',
        validation: {
          type: 'sql',
          mustInclude: ['ORDER BY']
        },
        points: 30
      },
      {
        id: 4,
        title: 'Preview the data',
        instruction: 'Run the query with department_id = 60 (IT department) and verify you get the right results.',
        hint: 'Set :p_department_id to 60 in the parameters panel and click Run.',
        validation: {
          type: 'execution',
          paramValues: { p_department_id: 60 },
          expectedDepartment: 'IT',
          minRows: 3
        },
        points: 40
      }
    ],
    outcome: {
      pass: `Perfect work! The data model is exactly what the Finance team needs. Sarah can now design the payroll layout template on top of this. You've earned the Data Model badge!`,
      fail: `The data model isn't quite right yet. Check that you're joining all three tables and your bind variable name matches exactly (:p_department_id).`
    }
  },

  {
    id: 'SC-002',
    moduleId: 'MOD-002',
    title: 'Executive Headcount Query',
    description: 'The CEO wants a quick headcount report grouped by department with average salary.',
    difficulty: 'Intermediate',
    estimatedTime: '10 min',
    pointsOnPass: 120,
    persona: {
      name: 'James Okonkwo',
      role: 'Chief Executive Officer',
      avatar: 'JO',
      avatarColor: '#C74634',
      message: `I need a simple report — just show me each department, how many people are in it, and what the average salary is. Highest average first.`
    },
    tasks: [
      {
        id: 1,
        title: 'Write a GROUP BY query',
        instruction: 'Write a query that returns department_name, COUNT of employees, and AVG salary grouped by department. Order by average salary descending.',
        hint: 'Use GROUP BY dept.department_name and aggregate functions COUNT(*) and AVG(emp.salary). Join employees to departments.',
        validation: {
          type: 'sql',
          mustInclude: ['GROUP BY', 'COUNT', 'AVG'],
          mustIncludeTables: ['hr.employees', 'hr.departments'],
          mustHaveJoin: true,
          minRows: 4
        },
        points: 80
      },
      {
        id: 2,
        title: 'Run and verify',
        instruction: 'Execute the query and confirm you see at least 5 departments with headcount and average salary figures.',
        hint: 'Click Run — no parameters needed for this query.',
        validation: {
          type: 'execution',
          paramValues: {},
          minRows: 5
        },
        points: 40
      }
    ],
    outcome: {
      pass: `Excellent! James now has exactly what he asked for. Clean, aggregated data ready for the executive dashboard layout.`,
      fail: `Check that you have both COUNT and AVG functions and a GROUP BY clause. Make sure you're joining employees to departments.`
    }
  },

  {
    id: 'SC-003',
    moduleId: 'MOD-002',
    title: 'High Earners Audit Report',
    description: 'The Audit team needs a list of all employees earning above a threshold, with their manager details.',
    difficulty: 'Advanced',
    estimatedTime: '20 min',
    pointsOnPass: 180,
    persona: {
      name: 'Priya Nair',
      role: 'Internal Audit Lead',
      avatar: 'PN',
      avatarColor: '#2E7D32',
      message: `We need to audit all employees whose salary exceeds a threshold we set at runtime. Show their name, department, salary, and their manager's name. This is for compliance so accuracy is critical.`
    },
    tasks: [
      {
        id: 1,
        title: 'Self-join for manager name',
        instruction: 'Write a query that joins hr.employees to itself to get the manager\'s full name. Include employee_id, full_name, department_name, salary, and manager_full_name.',
        hint: 'Use emp for the employee and mgr for the manager alias. JOIN hr.employees mgr ON emp.manager_id = mgr.employee_id. Use LEFT JOIN so employees with no manager still appear.',
        validation: {
          type: 'sql',
          mustIncludeTables: ['hr.employees'],
          mustHaveJoin: true,
          minRows: 3
        },
        points: 60
      },
      {
        id: 2,
        title: 'Add salary threshold parameter',
        instruction: 'Add a WHERE clause filtering employees where salary >= :p_min_salary.',
        hint: 'WHERE emp.salary >= :p_min_salary',
        validation: {
          type: 'sql',
          mustIncludeBinds: [':p_min_salary'],
          mustHaveWhere: true
        },
        points: 50
      },
      {
        id: 3,
        title: 'Test with threshold of 10000',
        instruction: 'Run the query with :p_min_salary = 10000 and verify you see only high earners.',
        hint: 'Set p_min_salary to 10000 in the parameters panel.',
        validation: {
          type: 'execution',
          paramValues: { p_min_salary: 10000 },
          minRows: 5,
          allRowsMustMatch: { field: 'SALARY', operator: '>=', value: 10000 }
        },
        points: 70
      }
    ],
    outcome: {
      pass: `Outstanding! The audit report is complete. Priya's compliance team can now schedule this to run monthly with different salary thresholds.`,
      fail: `Review the self-join syntax and make sure your bind variable is :p_min_salary. Run the query to check the salary filter is working correctly.`
    }
  },

  {
    id: 'SC-004',
    moduleId: 'MOD-001',
    title: 'Choose the Right Output Format',
    description: 'Three different stakeholders need the same report in different formats. Match the right format to each use case.',
    difficulty: 'Beginner',
    estimatedTime: '5 min',
    pointsOnPass: 80,
    persona: {
      name: 'Omar Shaikh',
      role: 'IT Support Analyst',
      avatar: 'OS',
      avatarColor: '#7B1FA2',
      message: `I have three colleagues all asking for the same salary report but for different purposes. Can you help me figure out the right output format for each?`
    },
    tasks: [
      {
        id: 1,
        title: 'Format selection quiz',
        instruction: 'Answer the three format questions correctly to complete this scenario.',
        hint: 'Think about what each person will DO with the report.',
        validation: {
          type: 'quiz',
          questions: [
            {
              q: 'The payroll officer needs to print official payslips for every employee.',
              options: ['CSV', 'HTML', 'PDF', 'Excel'],
              answer: 2,
              explanation: 'PDF preserves exact formatting and is suitable for printing official documents.'
            },
            {
              q: 'The FP&A analyst wants to build pivot tables and charts from the salary data.',
              options: ['PDF', 'Excel', 'HTML', 'eText'],
              answer: 1,
              explanation: 'Excel allows users to manipulate the data, build pivots, and create their own charts.'
            },
            {
              q: 'An upstream HR system needs to consume the data as a flat file via SFTP.',
              options: ['PDF', 'HTML', 'Excel', 'CSV'],
              answer: 3,
              explanation: 'CSV / eText formats are ideal for system integrations and flat-file transfers.'
            }
          ]
        },
        points: 80
      }
    ],
    outcome: {
      pass: `Great instincts! Matching the output format to the use case is one of the most important decisions in BIP report design.`,
      fail: `Not quite. Think about what each user will do with the output — print it, analyse it, or feed it to another system.`
    }
  },

  {
    id: 'SC-005',
    moduleId: 'MOD-004',
    title: 'Configure a Bursting Query',
    description: 'HR wants to email each department manager their own department\'s headcount report automatically.',
    difficulty: 'Advanced',
    estimatedTime: '20 min',
    pointsOnPass: 200,
    persona: {
      name: 'Linda Fernandez',
      role: 'HR Director',
      avatar: 'LF',
      avatarColor: '#E65100',
      message: `Every month I want each department manager to automatically receive their own department's headcount report by email — not the full company report, just their slice. Can you set up the bursting configuration?`
    },
    tasks: [
      {
        id: 1,
        title: 'Write the bursting query',
        instruction: 'Write a SELECT query that returns the required BIP bursting columns: KEY, TEMPLATE, DELIVERY_CHANNEL, EMAIL_TO, EMAIL_FROM, EMAIL_SUBJECT, OUTPUT_FORMAT, LOCALE.',
        hint: 'KEY should be department_id. EMAIL_TO should come from a manager email column. Use \'EMAIL\' as DELIVERY_CHANNEL and \'PDF\' as OUTPUT_FORMAT.',
        validation: {
          type: 'sql',
          mustInclude: ['KEY', 'EMAIL_TO', 'DELIVERY_CHANNEL', 'OUTPUT_FORMAT'],
          mustIncludeTables: ['hr.departments'],
          minRows: 3
        },
        points: 100
      },
      {
        id: 2,
        title: 'Verify bursting output',
        instruction: 'Run the bursting query and confirm each row has a unique KEY and an EMAIL_TO value.',
        hint: 'Click Run — you should see one row per department.',
        validation: {
          type: 'execution',
          paramValues: {},
          minRows: 4
        },
        points: 100
      }
    ],
    outcome: {
      pass: `Excellent bursting configuration! Linda's team will now receive personalised department reports every month without any manual effort.`,
      fail: `Check that your query includes all required bursting columns (KEY, DELIVERY_CHANNEL, EMAIL_TO, OUTPUT_FORMAT) and is selecting from hr.departments.`
    }
  }
]
