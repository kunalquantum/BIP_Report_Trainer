function includesText(haystack, needle) {
  return haystack.toUpperCase().includes(needle.toUpperCase())
}

function check(condition, label, successDetail, failureDetail) {
  return {
    passed: condition,
    label,
    detail: condition ? successDetail : failureDetail
  }
}

export function validateScenarioTask(task, sql, execution, answers = []) {
  const validation = task.validation || {}
  const checks = []
  const sqlText = sql || ''
  const rows = execution?.rows || []

  if (validation.type === 'quiz') {
    const questions = validation.questions || []
    questions.forEach((question, index) => {
      checks.push(check(
        answers[index] === question.answer,
        `Question ${index + 1}`,
        'Correct answer selected.',
        'Review the stakeholder need and try a different output choice.'
      ))
    })

    return buildResult(checks)
  }

  if (!sqlText.trim()) {
    return {
      passed: false,
      checks: [check(false, 'SQL draft', '', 'Enter a SQL statement before validating this task.')],
      summary: 'A SQL draft is required before this task can be validated.'
    }
  }

  if (!execution) {
    return {
      passed: false,
      checks: [check(false, 'Execution', '', 'Run the query at least once so the trainer can inspect the result set.')],
      summary: 'Run the query before validating the task.'
    }
  }

  if (!execution.success) {
    return {
      passed: false,
      checks: [check(false, 'Execution', '', 'The query did not execute successfully. Fix the SQL errors first.')],
      summary: 'The query must execute successfully before the task can pass.'
    }
  }

  ;(validation.mustInclude || []).forEach((item) => {
    checks.push(check(
      includesText(sqlText, item),
      `Contains ${item}`,
      `Found ${item}.`,
      `Add ${item} to the statement.`
    ))
  })

  ;(validation.mustIncludeTables || []).forEach((table) => {
    checks.push(check(
      includesText(sqlText, table),
      `Uses ${table}`,
      `Found ${table}.`,
      `Reference ${table} in the FROM or JOIN clause.`
    ))
  })

  ;(validation.mustIncludeColumns || []).forEach((column) => {
    checks.push(check(
      includesText(sqlText, column),
      `Selects ${column}`,
      `Found ${column}.`,
      `Include ${column} in the SELECT list or result logic.`
    ))
  })

  ;(validation.mustIncludeBinds || []).forEach((bind) => {
    checks.push(check(
      includesText(sqlText, bind),
      `Uses bind ${bind}`,
      `Found ${bind}.`,
      `Add the runtime bind variable ${bind}.`
    ))
  })

  if (validation.mustHaveJoin) {
    checks.push(check(
      includesText(sqlText, 'JOIN'),
      'Join logic',
      'JOIN clause detected.',
      'Add the required JOIN clause.'
    ))
  }

  if (validation.mustHaveWhere) {
    checks.push(check(
      includesText(sqlText, 'WHERE'),
      'Filter logic',
      'WHERE clause detected.',
      'Add the required WHERE clause.'
    ))
  }

  if (validation.minRows) {
    checks.push(check(
      execution.rowCount >= validation.minRows,
      'Returned rows',
      `Returned ${execution.rowCount} rows.`,
      `Expected at least ${validation.minRows} rows but got ${execution.rowCount}.`
    ))
  }

  if (validation.expectedDepartment) {
    const departments = [...new Set(rows.map((row) => row.DEPARTMENT_NAME).filter(Boolean))]
    checks.push(check(
      departments.length > 0 && departments.every((name) => name === validation.expectedDepartment),
      'Department filter',
      `Rows are scoped to ${validation.expectedDepartment}.`,
      `Expected only ${validation.expectedDepartment} rows but found: ${departments.join(', ') || 'none'}.`
    ))
  }

  if (validation.allRowsMustMatch) {
    const { field, operator, value } = validation.allRowsMustMatch
    const passed = rows.length > 0 && rows.every((row) => {
      if (operator === '>=') return Number(row[field]) >= Number(value)
      if (operator === '>') return Number(row[field]) > Number(value)
      if (operator === '=') return String(row[field]) === String(value)
      return false
    })

    checks.push(check(
      passed,
      `${field} ${operator} ${value}`,
      `All returned rows satisfy ${field} ${operator} ${value}.`,
      `At least one row does not satisfy ${field} ${operator} ${value}.`
    ))
  }

  ;(validation.rowRules || []).forEach((rule) => {
    const passed = rows.length > 0 && rows.every((row) => {
      if (rule.operator === '>=') return Number(row[rule.field]) >= Number(rule.value)
      if (rule.operator === '>') return Number(row[rule.field]) > Number(rule.value)
      if (rule.operator === '=') return String(row[rule.field]) === String(rule.value)
      return false
    })

    checks.push(check(
      passed,
      `${rule.field} ${rule.operator} ${rule.value}`,
      `All returned rows satisfy ${rule.field} ${rule.operator} ${rule.value}.`,
      `At least one row does not satisfy ${rule.field} ${rule.operator} ${rule.value}.`
    ))
  })

  if (includesText(sqlText, 'KEY') && includesText(sqlText, 'EMAIL_TO')) {
    const uniqueKeys = new Set(rows.map((row) => row.KEY))
    checks.push(check(
      rows.length > 0 && uniqueKeys.size === rows.length,
      'Burst key uniqueness',
      'Each bursting row has a unique KEY.',
      'Each bursting row should have a unique KEY.'
    ))

    checks.push(check(
      rows.length > 0 && rows.every((row) => row.EMAIL_TO),
      'Recipient routing',
      'Each bursting row has an EMAIL_TO recipient.',
      'Each bursting row should include an EMAIL_TO value.'
    ))
  }

  return buildResult(checks)
}

function buildResult(checks) {
  const passed = checks.length > 0 && checks.every((item) => item.passed)
  return {
    passed,
    checks,
    summary: passed
      ? 'Task requirements satisfied. Move to the next step in the mission.'
      : 'Some task requirements are still missing. Review the checklist and refine the work.'
  }
}
