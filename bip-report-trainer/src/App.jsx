import { useEffect, useMemo, useState } from 'react'
import { useTrainer } from './context/TrainerContext'
import { BIP_MODULES } from './data/modules'
import { SCENARIOS } from './data/scenarios'
import { DOMAIN_BLUEPRINTS } from './data/foundations'
import { getNextLevel, getProgressToNext } from './data/levels'
import { executeSQL, extractBindVariables } from './engine/sqlEngine'
import { validateScenarioTask } from './engine/taskValidator'

const DOMAIN_OPTIONS = ['All', 'AP', 'AR', 'GL']

const DOMAIN_SCHEMAS = {
  AP: {
    label: 'Accounts Payable',
    folders: ['Shared Folders', 'Financials', 'AP', 'Invoices', 'Supplier Statements'],
    objects: ['AP Invoice Register.xdo', 'Supplier Aging.xdm', 'Payment Batch Layout.rtf']
  },
  AR: {
    label: 'Accounts Receivable',
    folders: ['Shared Folders', 'Financials', 'AR', 'Collections', 'Customer Statements'],
    objects: ['AR Customer Balance.xdo', 'Receipts Analysis.xdm', 'Collections Summary.rtf']
  },
  GL: {
    label: 'General Ledger',
    folders: ['Shared Folders', 'Financials', 'GL', 'Journals', 'Trial Balance'],
    objects: ['GL Trial Balance.xdo', 'Journal Extract.xdm', 'Balance Sheet Layout.rtf']
  }
}

const PANEL_ROLES = [
  'Functional Expert',
  'SQL Expert',
  'BIP Developer',
  'Debug Specialist'
]

const DOMAIN_STARTERS = {
  AP: {
    reportName: 'AP Invoice Aging',
    filters: 'BU, Invoice Date, Supplier, Aging Bucket',
    output: 'Excel',
    knownTables: 'AP_INVOICES_ALL, AP_PAYMENT_SCHEDULES_ALL, AP_SUPPLIERS'
  },
  AR: {
    reportName: 'AR Customer Aging',
    filters: 'BU, Customer, As Of Date',
    output: 'Excel',
    knownTables: 'RA_CUSTOMER_TRX_ALL, AR_PAYMENT_SCHEDULES_ALL, HZ_CUST_ACCOUNTS'
  },
  GL: {
    reportName: 'GL Trial Balance',
    filters: 'Ledger, Period, Account Range',
    output: 'Excel / PDF',
    knownTables: 'GL_BALANCES, GL_CODE_COMBINATIONS, GL_LEDGERS'
  }
}

function getStarterSql(id) {
  const starters = {
    'SC-001': "SELECT\n  emp.employee_id,\n  emp.first_name || ' ' || emp.last_name AS full_name,\n  dept.department_name,\n  job.job_title,\n  emp.salary\nFROM hr.employees emp\nJOIN hr.departments dept ON emp.department_id = dept.department_id\nJOIN hr.jobs job ON emp.job_id = job.job_id",
    'SC-002': 'SELECT\n  dept.department_name,\n  COUNT(*) AS employee_count,\n  AVG(emp.salary) AS avg_salary\nFROM hr.employees emp\nJOIN hr.departments dept ON emp.department_id = dept.department_id\nGROUP BY dept.department_name',
    'SC-003': "SELECT\n  emp.employee_id,\n  emp.first_name || ' ' || emp.last_name AS full_name,\n  dept.department_name,\n  emp.salary,\n  mgr.first_name || ' ' || mgr.last_name AS manager_full_name\nFROM hr.employees emp\nLEFT JOIN hr.employees mgr ON emp.manager_id = mgr.employee_id\nJOIN hr.departments dept ON emp.department_id = dept.department_id",
    'SC-005': 'SELECT\n  department_id AS "KEY",\n  department_name AS "TEMPLATE",\n  \'EMAIL\' AS "DELIVERY_CHANNEL",\n  manager_email AS "EMAIL_TO",\n  \'payroll@corp.com\' AS "EMAIL_FROM",\n  \'Monthly Headcount Report\' AS "EMAIL_SUBJECT",\n  \'PDF\' AS "OUTPUT_FORMAT",\n  \'en-US\' AS "LOCALE"\nFROM hr.departments'
  }

  return starters[id] || ''
}

function inferParams(task, sqlDraft) {
  const fromTask = task?.validation?.mustIncludeBinds || []
  const fromSql = extractBindVariables(sqlDraft || '')
  return [...new Set([...fromTask, ...fromSql].map((item) => item.replace(':', '')))]
}

function getCoachNotes(scenario) {
  const module = BIP_MODULES.find((item) => item.id === scenario.moduleId)
  return (module?.steps || [])
    .filter((step) => step.type === 'lesson' || step.type === 'code')
    .slice(0, 3)
}

export default function App() {
  const { state, dispatch, level, isScenarioDone } = useTrainer()
  const [domainFilter, setDomainFilter] = useState('All')

  useEffect(() => {
    if (!state.notification) return
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 4000)
    return () => clearTimeout(timer)
  }, [state.notification, dispatch])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--oracle-silver)' }}>
      <Header level={level} />
      {state.notification && <Notice notification={state.notification} onClose={() => dispatch({ type: 'CLEAR_NOTIFICATION' })} />}
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px' }}>
        {state.currentScenario ? (
          <ScenarioWorkspace />
        ) : (
          <Dashboard
            domainFilter={domainFilter}
            setDomainFilter={setDomainFilter}
            isScenarioDone={isScenarioDone}
          />
        )}
      </main>
    </div>
  )
}

function Header({ level }) {
  const { state, dispatch } = useTrainer()
  const nextLevel = getNextLevel(state.user.points)
  const progress = getProgressToNext(state.user.points)

  return (
    <header style={{ background: 'linear-gradient(135deg, var(--oracle-navy), var(--oracle-navy-light))', color: 'white', padding: '18px 24px', borderBottom: '3px solid var(--oracle-red)' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.55 }}>Oracle simulation lab</div>
          <div style={{ fontSize: '30px', fontWeight: 700 }}>BIP Report Trainer</div>
          <div style={{ marginTop: '6px', opacity: 0.75 }}>A mock BIP workspace for building data models, checking output, and learning by doing.</div>
        </div>
        <div style={headerCard}>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>Operator</div>
          <input value={state.user.name} onChange={(e) => dispatch({ type: 'SET_USER_NAME', payload: e.target.value })} style={{ marginTop: '8px', width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(0,0,0,0.18)', color: 'white' }} />
          <div style={{ marginTop: '10px', fontWeight: 700, color: 'var(--oracle-red-light)' }}>{level.badge} {level.title}</div>
        </div>
        <div style={headerCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.7 }}>
            <span>Points</span>
            <span>{state.user.points}</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.14)', borderRadius: '999px', marginTop: '10px' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--oracle-red), var(--oracle-accent))', borderRadius: '999px' }} />
          </div>
          <div style={{ marginTop: '10px', fontSize: '13px', opacity: 0.8 }}>{nextLevel ? `Next level: ${nextLevel.title}` : 'Maximum level reached'}</div>
        </div>
      </div>
    </header>
  )
}

function Dashboard({ domainFilter, setDomainFilter, isScenarioDone }) {
  const { state, dispatch, level } = useTrainer()
  const filteredScenarios = domainFilter === 'All'
    ? SCENARIOS
    : SCENARIOS.filter((scenario) => scenario.domain === domainFilter)
  const highlightedDomain = domainFilter === 'All' ? 'GL' : domainFilter
  const blueprint = DOMAIN_BLUEPRINTS[highlightedDomain] || DOMAIN_BLUEPRINTS.GL
  const domainModules = DOMAIN_OPTIONS.filter((item) => item !== 'All')
  const featuredScenario = filteredScenarios[0] || null
  const starter = DOMAIN_STARTERS[highlightedDomain] || DOMAIN_STARTERS.GL

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <section style={{ background: 'linear-gradient(135deg, rgba(199,70,52,0.98), rgba(26,43,74,0.98))', color: 'white', borderRadius: '16px', padding: '28px', boxShadow: 'var(--shadow-hover)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>BIP Virtual Reporting COE</div>
            <div style={{ fontSize: '38px', fontWeight: 700, lineHeight: 1.05, marginTop: '10px' }}>Think in business, data, and layout.</div>
            <p style={{ marginTop: '12px', maxWidth: '640px', fontSize: '16px', lineHeight: 1.7, opacity: 0.85 }}>
              The trainer follows the PDF framework: choose a module, clarify the business requirement, map the Oracle tables and joins, then build the BIP output.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Stat label="Points" value={state.user.points} />
            <Stat label="Level" value={level.level} />
            <Stat label="Tracks complete" value={state.user.completedModules.length} />
            <Stat label="Missions passed" value={state.user.completedScenarios.length} />
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="Select Domain" subtitle="Pick the finance area you want to train in." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {domainModules.map((domain) => {
            const active = domainFilter === domain
            const domainInfo = DOMAIN_BLUEPRINTS[domain]
            return (
              <button
                key={domain}
                onClick={() => setDomainFilter(domain)}
                style={{
                  ...cardStyle,
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: active ? '2px solid var(--oracle-red)' : '1px solid var(--oracle-silver-mid)',
                  boxShadow: active ? 'var(--shadow-hover)' : 'var(--shadow-card)'
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--oracle-text-light)' }}>{domain}</div>
                <div style={{ marginTop: '6px', fontSize: '22px', fontWeight: 700, color: 'var(--oracle-navy)' }}>{domainInfo.label}</div>
                <div style={{ marginTop: '8px', color: 'var(--oracle-text-light)', lineHeight: 1.6 }}>{domainInfo.businessGoal}</div>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <div style={{ ...cardStyle, display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(280px, 0.9fr)', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--oracle-red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              3-Layer BIP Thinking Model
            </div>
            <div style={{ marginTop: '8px', fontSize: '28px', fontWeight: 700, color: 'var(--oracle-navy)' }}>
              {blueprint.label}
            </div>
            <div style={{ marginTop: '10px', color: 'var(--oracle-text-light)', lineHeight: 1.7 }}>
              {blueprint.businessGoal}
            </div>
            <div style={{ marginTop: '16px', display: 'grid', gap: '10px' }}>
              {[
                { step: '01', title: 'Business Layer', body: `What report is needed, who uses it, and what decision it supports. Example: ${starter.reportName}.` },
                { step: '02', title: 'Data Layer', body: `Start with ${blueprint.coreTables[0].name}, then map joins and filters. ${blueprint.joinPatterns[0]}.` },
                { step: '03', title: 'Presentation Layer', body: `Choose the BIP output, grouping, parameters, and delivery logic. Typical output: ${starter.output}.` }
              ].map((item) => (
                <div key={item.step} style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', gap: '12px', alignItems: 'start', background: 'var(--oracle-silver)', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--oracle-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {item.step}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--oracle-navy)' }}>{item.title}</div>
                    <div style={{ marginTop: '4px', color: 'var(--oracle-text-light)', lineHeight: 1.6 }}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--oracle-silver)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--oracle-text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Smart Panel Roles
            </div>
            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PANEL_ROLES.map((role) => (
                <span key={role} style={{ background: 'white', border: '1px solid var(--oracle-silver-mid)', borderRadius: '999px', padding: '7px 10px', fontSize: '12px', fontWeight: 700, color: 'var(--oracle-navy)' }}>
                  {role}
                </span>
              ))}
            </div>
            <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--oracle-text-light)', lineHeight: 1.6 }}>
              The app should act like this panel: clarify the requirement, suggest tables, build SQL, then shape the BIP report.
            </div>
          </div>
        </div>
      </section>

      <section>
        <div style={{ ...cardStyle, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 0.8fr)', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--oracle-red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Fixed Prompt Template
            </div>
            <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 700, color: 'var(--oracle-navy)' }}>
              Ask every report the same structured way
            </div>
            <div style={{ marginTop: '12px', display: 'grid', gap: '10px' }}>
              {[
                ['Module', highlightedDomain],
                ['Report Requirement', starter.reportName],
                ['Filters Needed', starter.filters],
                ['Output Format', starter.output],
                ['Known Tables', starter.knownTables],
                ['Issue', 'If debugging, describe where the SQL or BIP output is failing']
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '160px minmax(0, 1fr)', gap: '12px', background: 'var(--oracle-silver)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--oracle-navy)' }}>{label}</div>
                  <div style={{ color: 'var(--oracle-text-light)', lineHeight: 1.6 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--oracle-silver)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--oracle-text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              First guided exercise
            </div>
            {featuredScenario ? (
              <>
                <div style={{ marginTop: '8px', fontSize: '22px', fontWeight: 700, color: 'var(--oracle-navy)' }}>
                  {featuredScenario.title}
                </div>
                <div style={{ marginTop: '8px', color: 'var(--oracle-text-light)', lineHeight: 1.6 }}>
                  {featuredScenario.description}
                </div>
                <div style={{ marginTop: '12px', color: 'var(--oracle-text)', lineHeight: 1.6 }}>
                  "{featuredScenario.persona.message}"
                </div>
                <button
                  onClick={() => dispatch({ type: 'START_SCENARIO', payload: featuredScenario })}
                  style={{ ...primaryButton, marginTop: '16px', width: '100%' }}
                >
                  Start {highlightedDomain} exercise
                </button>
              </>
            ) : (
              <div style={{ marginTop: '8px', color: 'var(--oracle-text-light)' }}>
                No mission is configured for this domain yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function ScenarioWorkspace() {
  const { state, dispatch } = useTrainer()
  const scenario = state.currentScenario
  const task = scenario.tasks[state.currentTask]
  const workspace = state.scenarioWorkspace
  const [quizAnswers, setQuizAnswers] = useState([])
  const coachNotes = useMemo(() => getCoachNotes(scenario), [scenario])
  const schema = DOMAIN_SCHEMAS[scenario.domain] || DOMAIN_SCHEMAS.GL
  const blueprint = DOMAIN_BLUEPRINTS[scenario.domain] || DOMAIN_BLUEPRINTS.GL
  const params = inferParams(task, workspace.sqlDraft)
  const taskDone = workspace.completedTaskIds.includes(task.id)
  const result = workspace.lastRun?.result

  useEffect(() => {
    if (task.validation?.type === 'quiz') return
    if (!workspace.sqlDraft) dispatch({ type: 'SET_SCENARIO_SQL', payload: getStarterSql(scenario.id) })
  }, [task.validation, workspace.sqlDraft, dispatch, scenario.id])

  useEffect(() => setQuizAnswers([]), [task.id])

  const runQuery = () => {
    const execution = executeSQL(workspace.sqlDraft, workspace.params)
    dispatch({ type: 'SET_SCENARIO_RUN', payload: { sql: workspace.sqlDraft, params: workspace.params, result: execution, ranAt: new Date().toISOString() } })
    dispatch({ type: 'SET_SCENARIO_VALIDATION', payload: null })
  }

  const validateTask = () => {
    const validation = validateScenarioTask(task, workspace.sqlDraft, result, quizAnswers)
    dispatch({ type: 'SET_SCENARIO_VALIDATION', payload: validation })
    if (!validation.passed) {
      dispatch({ type: 'SET_NOTIFICATION', payload: { type: 'error', message: 'Task requirements are still incomplete.' } })
      return
    }
    dispatch({ type: 'COMPLETE_SCENARIO_TASK', payload: task.id })
    dispatch({ type: 'SET_NOTIFICATION', payload: { type: 'success', message: `Task ${state.currentTask + 1} passed.` } })
  }

  const goNext = () => {
    if (state.currentTask === scenario.tasks.length - 1) {
      dispatch({ type: 'COMPLETE_SCENARIO', payload: { scenarioId: scenario.id, points: scenario.pointsOnPass } })
    } else {
      dispatch({ type: 'NEXT_TASK' })
    }
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'var(--oracle-navy)', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Shared folders / Financials / {scenario.domain} / {scenario.moduleId}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>{scenario.title}</div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => dispatch({ type: 'EXIT_SCENARIO' })} style={ghostButton}>Return</button>
            <button onClick={goNext} disabled={!taskDone} style={{ ...primaryButton, opacity: taskDone ? 1 : 0.45, cursor: taskDone ? 'pointer' : 'not-allowed' }}>
              {state.currentTask === scenario.tasks.length - 1 ? 'Complete mission' : 'Next task'}
            </button>
          </div>
        </div>
        <div style={{ background: 'var(--oracle-silver)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', color: 'var(--oracle-text-light)' }}>
          <span>Stakeholder: <strong style={{ color: 'var(--oracle-navy)' }}>{scenario.persona.name}</strong> ({scenario.persona.role})</span>
          <span>Task {state.currentTask + 1} of {scenario.tasks.length}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 340px minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
        <OracleSidebar domainFilter={scenario.domain} />
        <div style={{ display: 'grid', gap: '16px' }}>
          <Panel title="Business Brief">
            <div style={{ color: 'var(--oracle-text)', lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, color: 'var(--oracle-navy)' }}>{scenario.persona.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--oracle-text-light)', marginBottom: '10px' }}>{scenario.persona.role}</div>
              <div style={{ background: 'var(--oracle-silver)', borderLeft: '4px solid var(--oracle-red)', borderRadius: '12px', padding: '12px' }}>
                "{scenario.persona.message}"
              </div>
            </div>
          </Panel>

          <Panel title="Task Checklist">
            <div style={{ display: 'grid', gap: '10px' }}>
              {scenario.tasks.map((item, index) => {
                const active = index === state.currentTask
                const done = workspace.completedTaskIds.includes(item.id)
                return (
                  <div key={item.id} style={{ border: `1px solid ${active ? 'var(--oracle-red)' : 'var(--oracle-silver-mid)'}`, background: done ? 'rgba(46,125,50,0.06)' : active ? 'rgba(199,70,52,0.05)' : 'white', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <strong style={{ color: 'var(--oracle-navy)' }}>Task {index + 1}</strong>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: done ? 'var(--oracle-success)' : 'var(--oracle-text-light)' }}>{done ? 'DONE' : `${item.points} pts`}</span>
                    </div>
                    <div style={{ marginTop: '6px', color: 'var(--oracle-text)' }}>{item.title}</div>
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel title="Coach Notes">
            <div style={{ display: 'grid', gap: '10px' }}>
              {coachNotes.map((step) => (
                <div key={step.id} style={{ background: 'var(--oracle-silver)', borderLeft: '4px solid var(--oracle-accent)', borderRadius: '12px', padding: '12px', color: 'var(--oracle-text)' }}>
                  <strong>{step.title}</strong>
                  <div style={{ marginTop: '6px', color: 'var(--oracle-text-light)', lineHeight: 1.5 }}>{step.content}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Join Strategy">
            <div style={{ display: 'grid', gap: '10px' }}>
              {blueprint.joinPatterns.map((pattern) => (
                <div key={pattern} style={{ background: 'var(--oracle-silver)', borderLeft: '4px solid var(--oracle-red)', borderRadius: '10px', padding: '10px 12px', color: 'var(--oracle-text)' }}>
                  {pattern}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--oracle-text-light)', lineHeight: 1.6 }}>
              Business goal: <strong style={{ color: 'var(--oracle-navy)' }}>{blueprint.businessGoal}</strong>
            </div>
          </Panel>

          <Panel title="Business Logic Cautions">
            <ul style={{ margin: '0 0 0 18px', color: 'var(--oracle-text-light)', lineHeight: 1.7 }}>
              {blueprint.cautions.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </Panel>

          <Panel title="Catalog Objects">
            <div style={{ display: 'grid', gap: '10px' }}>
              {schema.objects.map((item) => (
                <div key={item} style={{ borderRadius: '10px', background: 'var(--oracle-silver)', padding: '10px 12px', color: 'var(--oracle-text)' }}>
                  {item}
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <Panel title="Current Task">
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--oracle-navy)' }}>{task.title}</div>
            <div style={{ marginTop: '8px', color: 'var(--oracle-text)', lineHeight: 1.7 }}>{task.instruction}</div>
            {task.hint && <div style={{ marginTop: '12px', background: 'rgba(0,163,224,0.08)', border: '1px solid rgba(0,163,224,0.18)', borderRadius: '12px', padding: '12px', color: 'var(--oracle-text)' }}><strong>Hint:</strong> {task.hint}</div>}
            <div style={{ marginTop: '14px', display: 'grid', gap: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--oracle-navy)' }}>Core tables for this business area</div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {blueprint.coreTables.slice(0, 4).map((table) => (
                  <div key={table.name} style={{ background: 'var(--oracle-silver)', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--oracle-navy)' }}>{table.name}</div>
                    <div style={{ marginTop: '4px', color: 'var(--oracle-text-light)', lineHeight: 1.5 }}>{table.purpose}</div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {task.validation?.type === 'quiz' ? (
            <Panel title="Decision Workspace">
              <div style={{ display: 'grid', gap: '16px' }}>
                {task.validation.questions.map((question, qIndex) => (
                  <div key={question.q} style={{ border: '1px solid var(--oracle-silver-mid)', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--oracle-navy)', marginBottom: '10px' }}>{qIndex + 1}. {question.q}</div>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {question.options.map((option, oIndex) => {
                        const selected = quizAnswers[qIndex] === oIndex
                        return (
                          <label key={option} style={{ display: 'flex', gap: '10px', border: `1px solid ${selected ? 'var(--oracle-red)' : 'var(--oracle-silver-mid)'}`, background: selected ? 'rgba(199,70,52,0.05)' : 'white', borderRadius: '12px', padding: '12px' }}>
                            <input type="radio" checked={selected} onChange={() => {
                              const next = [...quizAnswers]
                              next[qIndex] = oIndex
                              setQuizAnswers(next)
                            }} />
                            <span style={{ color: 'var(--oracle-text)', lineHeight: 1.5 }}>{option}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button onClick={validateTask} style={secondaryButton}>Validate decision set</button>
                  {taskDone && <span style={{ color: 'var(--oracle-success)', fontWeight: 700 }}>Task completed.</span>}
                </div>
              </div>
            </Panel>
          ) : (
            <>
              <Panel title="Data Model Editor">
                <div style={{ display: 'grid', gap: '14px' }}>
                  <div style={{ background: 'var(--oracle-navy)', color: 'white', borderRadius: '12px', padding: '12px 14px', fontSize: '12px' }}>DataSet_1.sql | Oracle BI Publisher Mock Designer</div>
                  <textarea value={workspace.sqlDraft} onChange={(e) => dispatch({ type: 'SET_SCENARIO_SQL', payload: e.target.value })} spellCheck={false} style={{ minHeight: '280px', borderRadius: '12px', border: '1px solid var(--oracle-silver-mid)', padding: '16px', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, background: '#FAFBFD' }} />
                  {params.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                      {params.map((name) => (
                        <label key={name} style={{ display: 'grid', gap: '6px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--oracle-text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>{name}</span>
                          <input value={workspace.params[name] ?? ''} onChange={(e) => dispatch({ type: 'SET_SCENARIO_PARAM', payload: { name, value: e.target.value } })} style={{ borderRadius: '10px', border: '1px solid var(--oracle-silver-mid)', padding: '10px 12px' }} />
                        </label>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={runQuery} style={primaryButton}>Run sample data</button>
                    <button onClick={validateTask} style={secondaryButton}>Validate task</button>
                    {taskDone && <span style={{ alignSelf: 'center', color: 'var(--oracle-success)', fontWeight: 700 }}>Task completed.</span>}
                  </div>
                </div>
              </Panel>

              <Panel title="Execution Results">
                {!result ? (
                  <div style={emptyStyle}>Run the query to preview rows, warnings, and execution metadata.</div>
                ) : (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <Badge label="Rows" value={result.rowCount} />
                      <Badge label="Execution" value={`${result.executionTime} ms`} />
                      <Badge label="Tables" value={result.tablesScanned.join(', ') || 'None'} />
                    </div>
                    {result.errors.length > 0 && <MessageBlock title="Errors" items={result.errors} accent="var(--oracle-red)" background="rgba(199,70,52,0.08)" />}
                    {result.warnings.length > 0 && <MessageBlock title="Warnings" items={result.warnings} accent="var(--oracle-warning)" background="rgba(230,81,0,0.08)" />}
                    {result.success && result.rows.length > 0 && <ResultsTable columns={result.columns} rows={result.rows} />}
                  </div>
                )}
              </Panel>

              <Panel title="Trainer Validation">
                {!workspace.lastValidation ? (
                  <div style={emptyStyle}>Validate the task after running the query. The trainer checks both your SQL and your output.</div>
                ) : (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ borderRadius: '12px', padding: '12px 14px', background: workspace.lastValidation.passed ? 'rgba(46,125,50,0.08)' : 'rgba(199,70,52,0.08)', border: `1px solid ${workspace.lastValidation.passed ? 'rgba(46,125,50,0.2)' : 'rgba(199,70,52,0.2)'}` }}>
                      <strong style={{ color: workspace.lastValidation.passed ? 'var(--oracle-success)' : 'var(--oracle-red)' }}>{workspace.lastValidation.passed ? 'Pass' : 'Needs work'}</strong>
                      <div style={{ marginTop: '6px', color: 'var(--oracle-text)' }}>{workspace.lastValidation.summary}</div>
                    </div>
                    {workspace.lastValidation.checks.map((check) => (
                      <div key={`${check.label}-${check.detail}`} style={{ borderRadius: '12px', padding: '12px 14px', border: `1px solid ${check.passed ? 'rgba(46,125,50,0.18)' : 'rgba(199,70,52,0.18)'}`, background: check.passed ? 'rgba(46,125,50,0.05)' : 'rgba(199,70,52,0.05)' }}>
                        <div style={{ fontWeight: 700, color: check.passed ? 'var(--oracle-success)' : 'var(--oracle-red)' }}>{check.label}</div>
                        <div style={{ marginTop: '4px', color: 'var(--oracle-text-light)' }}>{check.detail}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <section style={cardStyle}>
      <div style={{ marginBottom: '14px', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--oracle-text-light)' }}>{title}</div>
      {children}
    </section>
  )
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--oracle-navy)' }}>{title}</div>
      <div style={{ marginTop: '6px', color: 'var(--oracle-text-light)', lineHeight: 1.6 }}>{subtitle}</div>
    </div>
  )
}

function Notice({ notification, onClose }) {
  const background = notification.type === 'success' ? 'var(--oracle-success)' : notification.type === 'error' ? 'var(--oracle-red)' : 'var(--oracle-accent)'
  return (
    <div style={{ background, color: 'white', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <strong>{notification.message}</strong>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '18px' }}>x</button>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px' }}>
      <div style={{ fontSize: '12px', opacity: 0.75 }}>{label}</div>
      <div style={{ marginTop: '8px', fontSize: '28px', fontWeight: 700 }}>{value}</div>
    </div>
  )
}

function Badge({ label, value }) {
  return <div style={{ background: 'var(--oracle-silver)', borderRadius: '999px', padding: '8px 12px', fontSize: '13px', color: 'var(--oracle-text)' }}><strong>{label}:</strong> {value}</div>
}

function MessageBlock({ title, items, accent, background }) {
  return (
    <div style={{ background, border: `1px solid ${accent}33`, borderRadius: '12px', padding: '12px 14px' }}>
      <div style={{ fontWeight: 700, color: accent }}>{title}</div>
      <ul style={{ margin: '8px 0 0 18px', color: 'var(--oracle-text-light)', lineHeight: 1.6 }}>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

function ResultsTable({ columns, rows }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--oracle-silver-mid)', borderRadius: '12px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
        <thead style={{ background: 'var(--oracle-navy)', color: 'white' }}>
          <tr>{columns.map((column) => <th key={column} style={{ textAlign: 'left', padding: '12px', fontSize: '12px' }}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.slice(0, 8).map((row, index) => (
            <tr key={index} style={{ background: index % 2 === 0 ? 'white' : 'var(--oracle-silver)' }}>
              {columns.map((column) => <td key={column} style={{ padding: '11px 12px', fontSize: '13px', color: 'var(--oracle-text)', borderTop: '1px solid var(--oracle-silver-mid)' }}>{String(row[column] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OracleSidebar({ domainFilter, setDomainFilter }) {
  const activeDomain = domainFilter === 'All' ? 'GL' : domainFilter
  const schema = DOMAIN_SCHEMAS[activeDomain] || DOMAIN_SCHEMAS.GL

  return (
    <aside style={{
      background: 'linear-gradient(180deg, var(--oracle-navy) 0%, var(--oracle-navy-mid) 100%)',
      color: 'white',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: 'var(--shadow-card)',
      border: '1px solid rgba(255,255,255,0.06)'
    }}>
      <div style={{ fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.55 }}>
        Navigator
      </div>
      <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: 700 }}>
        Oracle BI Publisher
      </div>

      <div style={{ marginTop: '18px', display: 'grid', gap: '8px' }}>
        {DOMAIN_OPTIONS.map((domain) => {
          const active = domainFilter === domain
          return (
            <button
              key={domain}
              onClick={() => setDomainFilter?.(domain)}
              disabled={!setDomainFilter}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: '10px',
                border: `1px solid ${active ? 'rgba(232,93,69,0.65)' : 'rgba(255,255,255,0.08)'}`,
                background: active ? 'rgba(199,70,52,0.18)' : 'rgba(255,255,255,0.04)',
                color: 'white',
                opacity: !setDomainFilter && !active ? 0.55 : 1,
                cursor: setDomainFilter ? 'pointer' : 'default',
                fontWeight: 700,
                fontSize: '13px'
              }}
            >
              {domain === 'All' ? 'All Financial Modules' : `${domain} - ${DOMAIN_SCHEMAS[domain].label}`}
            </button>
          )
        })}
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.5 }}>
          Catalog
        </div>
        <div style={{ marginTop: '10px', display: 'grid', gap: '8px' }}>
          {schema.folders.map((folder, index) => (
            <div
              key={folder}
              style={{
                paddingLeft: `${index * 10}px`,
                fontSize: '13px',
                color: index === schema.folders.length - 1 ? 'white' : 'rgba(255,255,255,0.68)',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}
            >
              <span style={{ color: 'var(--oracle-red-light)' }}>{index === schema.folders.length - 1 ? '>' : 'v'}</span>
              <span>{folder}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.5 }}>
          Recent Objects
        </div>
        <div style={{ marginTop: '10px', display: 'grid', gap: '8px' }}>
          {schema.objects.map((item) => (
            <div key={item} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '9px 10px', fontSize: '12px', color: 'rgba(255,255,255,0.78)' }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

const headerCard = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '14px 16px' }
const cardStyle = { background: 'var(--oracle-white)', borderRadius: '16px', padding: '18px', boxShadow: 'var(--shadow-card)', border: '1px solid var(--oracle-silver-mid)' }
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }
const emptyStyle = { border: '1px dashed var(--oracle-silver-dark)', borderRadius: '12px', padding: '18px', color: 'var(--oracle-text-light)', background: 'var(--oracle-silver)' }
const primaryButton = { background: 'var(--oracle-red)', border: 'none', color: 'white', borderRadius: '10px', padding: '11px 16px', fontSize: '14px', fontWeight: 700 }
const secondaryButton = { background: 'var(--oracle-navy)', border: 'none', color: 'white', borderRadius: '10px', padding: '11px 16px', fontSize: '14px', fontWeight: 700 }
const ghostButton = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', color: 'white', borderRadius: '10px', padding: '11px 16px', fontSize: '14px', fontWeight: 700 }
