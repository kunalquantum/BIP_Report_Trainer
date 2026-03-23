export const SCENARIOS = [
  {
    id: "SC-DM-001",
    moduleId: "MOD-002",
    title: "Build an Employee Payroll Report",
    description: "A Finance manager needs a monthly payroll report with department totals.",
    difficulty: "Intermediate",
    timeLimit: 600, // seconds
    persona: {
      name: "Sarah Mitchell",
      role: "Finance Manager",
      avatar: "👩‍💼",
      request: "I need a payroll report showing all employees, their departments, salaries, and department totals. It should be filterable by date range and exportable to Excel."
    },
    tasks: [
      {
        id: 1,
        instruction: "Navigate to the Data Model editor and create a new SQL Dataset",
        hint: "Go to New → Data Model from the BIP Catalog",
        validation: "data_model_created",
        points: 20
      },
      {
        id: 2,
        instruction: "Write a SQL query joining EMPLOYEES and DEPARTMENTS tables",
        hint: "Use HR.EMPLOYEES and HR.DEPARTMENTS. Join on department_id",
        validation: "sql_written",
        points: 30
      },
      {
        id: 3,
        instruction: "Add parameters: P_START_DATE and P_END_DATE as Date type",
        hint: "In the Parameters section, click Add Parameter",
        validation: "params_added",
        points: 20
      },
      {
        id: 4,
        instruction: "Preview the Data Model output and verify results",
        hint: "Click 'View Data' and enter test date values",
        validation: "preview_done",
        points: 30
      }
    ],
    outcome: {
      pass: "Excellent! Sarah's payroll data model is ready. The Finance team can now design the layout template.",
      fail: "The data model is incomplete. Review the SQL join conditions and parameter bindings."
    }
  },
  {
    id: "SC-RPT-001",
    moduleId: "MOD-003",
    title: "Design Executive Dashboard Layout",
    description: "The CEO wants a one-page executive summary with charts and KPIs.",
    difficulty: "Advanced",
    persona: {
      name: "James Okonkwo",
      role: "CEO",
      avatar: "👨‍💻",
      request: "I need a clean, professional one-pager: total headcount, salary costs by department as a bar chart, and top 10 earners in a table."
    },
    tasks: [],
    outcome: { pass: "", fail: "" }
  }
];