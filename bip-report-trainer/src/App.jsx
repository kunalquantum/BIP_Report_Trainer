import { useEffect, useMemo, useState } from 'react'
import { useTrainer } from './context/TrainerContext'
import { BIP_MODULES } from './data/modules'
import { DOMAIN_LABS } from './data/domainLabs'
import { SCENARIOS } from './data/scenarios'
import { DOMAIN_BLUEPRINTS } from './data/foundations'
import { getNextLevel, getProgressToNext } from './data/levels'
import { executeSQL, extractBindVariables } from './engine/sqlEngine'
import { validateScenarioTask } from './engine/taskValidator'

const DOMAIN_OPTIONS = ['All', 'AP', 'AR', 'GL']

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
    'SC-AP-001': "SELECT\n  ai.invoice_num,\n  ai.invoice_date,\n  sup.vendor_name,\n  aps.due_date,\n  aps.amount_due_remaining,\n  bu.name AS bu_name\nFROM ap_invoices_all ai\nJOIN ap_suppliers sup ON ai.vendor_id = sup.vendor_id\nJOIN ap_payment_schedules_all aps ON ai.invoice_id = aps.invoice_id\nJOIN hr_operating_units bu ON ai.org_id = bu.organization_id",
    'SC-AR-001': "SELECT\n  rct.trx_number,\n  rct.trx_date,\n  hca.customer_name,\n  aps.due_date,\n  aps.amount_due_remaining,\n  bu.name AS bu_name\nFROM ra_customer_trx_all rct\nJOIN hz_cust_accounts hca ON rct.bill_to_customer_id = hca.cust_account_id\nJOIN ar_payment_schedules_all aps ON rct.customer_trx_id = aps.customer_trx_id\nJOIN hr_operating_units bu ON rct.org_id = bu.organization_id",
    'SC-GL-001': "SELECT\n  gb.period_name,\n  gl.name AS ledger_name,\n  gcc.segment1,\n  gcc.segment2,\n  gb.entered_dr,\n  gb.entered_cr,\n  gb.ending_balance\nFROM gl_balances gb\nJOIN gl_code_combinations gcc ON gb.code_combination_id = gcc.code_combination_id\nJOIN gl_ledgers gl ON gb.ledger_id = gl.ledger_id"
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
  const [activeDomainLab, setActiveDomainLab] = useState(null)

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
        ) : activeDomainLab ? (
          <DomainLab
            domain={activeDomainLab}
            onBack={() => setActiveDomainLab(null)}
            onStartExercise={(scenario) => {
              setActiveDomainLab(null)
              dispatch({ type: 'START_SCENARIO', payload: scenario })
            }}
          />
        ) : (
          <Dashboard
            domainFilter={domainFilter}
            setDomainFilter={setDomainFilter}
            isScenarioDone={isScenarioDone}
            onStartDomainLab={setActiveDomainLab}
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

function Dashboard({ domainFilter, setDomainFilter, isScenarioDone, onStartDomainLab }) {
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
            const practiceCount = SCENARIOS.filter((scenario) => scenario.domain === domain).length
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
                <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: 'var(--oracle-red)' }}>
                  {practiceCount} Oracle SQL practice scenarios
                </div>
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
                  onClick={() => onStartDomainLab(highlightedDomain)}
                  style={{ ...primaryButton, marginTop: '16px', width: '100%' }}
                >
                  Start {highlightedDomain} learning path
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

function DomainLab({ domain, onBack, onStartExercise }) {
  const lab = DOMAIN_LABS[domain]
  const blueprint = DOMAIN_BLUEPRINTS[domain] || DOMAIN_BLUEPRINTS.GL
  const domainScenarios = SCENARIOS.filter((scenario) => scenario.domain === domain)
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [feedback, setFeedback] = useState(null)
  const stage = lab.stages[stepIndex]
  const isLast = stepIndex === lab.stages.length - 1
  const progress = Math.round(((stepIndex + 1) / lab.stages.length) * 100)

  const goNext = () => {
    setFeedback(null)
    setStepIndex((current) => Math.min(current + 1, lab.stages.length - 1))
  }

  const goPrev = () => {
    setFeedback(null)
    setStepIndex((current) => Math.max(current - 1, 0))
  }

  const submitAnswer = () => {
    if (stage.type !== 'quiz') return
    const selected = answers[stage.id]
    const passed = selected === stage.answer
    setFeedback({
      passed,
      text: passed ? stage.feedback.correct : stage.feedback.incorrect
    })
  }

  const submitTypedAnswer = () => {
    if (stage.type !== 'typing') return
    const typed = String(answers[stage.id] || '').trim().replace(/\s+/g, ' ').toLowerCase()
    const expected = String(stage.expectedAnswer || '').trim().replace(/\s+/g, ' ').toLowerCase()
    const passed = typed === expected

    setFeedback({
      passed,
      text: passed ? stage.feedback.correct : stage.feedback.incorrect
    })
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
      <aside style={{
        ...cardStyle,
        background: 'linear-gradient(180deg, var(--oracle-navy) 0%, var(--oracle-navy-mid) 100%)',
        color: 'white',
        border: 'none'
      }}>
        <div style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.55 }}>
          Domain Lab
        </div>
        <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 700 }}>
          {lab.title}
        </div>
        <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.74)', lineHeight: 1.6 }}>
          {blueprint.businessGoal}
        </div>

        <div style={{ marginTop: '18px', height: '8px', background: 'rgba(255,255,255,0.12)', borderRadius: '999px' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--oracle-red)', borderRadius: '999px' }} />
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.72)' }}>
          Step {stepIndex + 1} of {lab.stages.length}
        </div>

        <div style={{ marginTop: '18px', display: 'grid', gap: '8px' }}>
          {lab.stages.map((item, index) => (
            <div
              key={item.id}
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                background: index === stepIndex ? 'rgba(199,70,52,0.18)' : 'rgba(255,255,255,0.05)',
                border: index === stepIndex ? '1px solid rgba(232,93,69,0.45)' : '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div style={{ fontSize: '12px', opacity: 0.65 }}>{index + 1}</div>
              <div style={{ marginTop: '4px', fontWeight: 700 }}>{item.title}</div>
            </div>
          ))}
        </div>

        <button onClick={onBack} style={{ ...ghostButton, marginTop: '20px', width: '100%' }}>
          Back to home
        </button>
      </aside>

      <section style={{ display: 'grid', gap: '16px' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '12px', color: 'var(--oracle-red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {stage.type === 'lesson' ? 'Micro Lesson' : 'Knowledge Check'}
          </div>
          <div style={{ marginTop: '8px', fontSize: '28px', fontWeight: 700, color: 'var(--oracle-navy)' }}>
            {stage.title}
          </div>

            {stage.type === 'lesson' ? (
              <>
                <div style={{ marginTop: '14px', color: 'var(--oracle-text)', lineHeight: 1.8 }}>
                  {stage.body}
              </div>
              <div style={{ marginTop: '18px', display: 'grid', gap: '10px' }}>
                {stage.takeaways.map((item) => (
                  <div key={item} style={{ background: 'var(--oracle-silver)', borderLeft: '4px solid var(--oracle-accent)', borderRadius: '12px', padding: '12px', color: 'var(--oracle-text)' }}>
                    {item}
                  </div>
                ))}
              </div>
            </>
            ) : stage.type === 'quiz' ? (
              <>
                <div style={{ marginTop: '14px', color: 'var(--oracle-text)', lineHeight: 1.8 }}>
                  {stage.prompt}
              </div>
              <div style={{ marginTop: '16px', display: 'grid', gap: '10px' }}>
                {stage.options.map((option, optionIndex) => {
                  const selected = answers[stage.id] === optionIndex
                  return (
                    <label
                      key={option}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start',
                        padding: '12px',
                        borderRadius: '12px',
                        border: `1px solid ${selected ? 'var(--oracle-red)' : 'var(--oracle-silver-mid)'}`,
                        background: selected ? 'rgba(199,70,52,0.05)' : 'white'
                      }}
                    >
                      <input
                        type="radio"
                        checked={selected}
                        onChange={() => setAnswers((current) => ({ ...current, [stage.id]: optionIndex }))}
                      />
                      <span style={{ color: 'var(--oracle-text)', lineHeight: 1.6 }}>{option}</span>
                    </label>
                  )
                })}
                </div>
              </>
            ) : (
              <>
                <div style={{ marginTop: '14px', color: 'var(--oracle-text)', lineHeight: 1.8 }}>
                  {stage.prompt}
                </div>
                <div style={{ marginTop: '14px', background: 'rgba(199,70,52,0.06)', border: '1px solid rgba(199,70,52,0.18)', borderRadius: '12px', padding: '10px 12px', color: 'var(--oracle-text-light)', fontSize: '13px' }}>
                  Curated practice zone: paste, cut, and drop are blocked here. Type the answer yourself.
                </div>
                <textarea
                  value={answers[stage.id] || ''}
                  onChange={(event) => setAnswers((current) => ({ ...current, [stage.id]: event.target.value }))}
                  onPaste={(event) => event.preventDefault()}
                  onCut={(event) => event.preventDefault()}
                  onDrop={(event) => event.preventDefault()}
                  onContextMenu={(event) => event.preventDefault()}
                  placeholder={stage.placeholder}
                  spellCheck={false}
                  style={{
                    width: '100%',
                    minHeight: '130px',
                    marginTop: '14px',
                    borderRadius: '12px',
                    border: '1px solid var(--oracle-silver-mid)',
                    padding: '14px',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    fontFamily: 'var(--font-mono)',
                    resize: 'vertical',
                    background: '#FAFBFD',
                    color: 'var(--oracle-text)'
                  }}
                />
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--oracle-text-light)' }}>
                  Typed characters: {(answers[stage.id] || '').length}
                </div>
              </>
            )}

          {feedback && (
            <div style={{
              marginTop: '16px',
              borderRadius: '12px',
              padding: '12px 14px',
              background: feedback.passed ? 'rgba(46,125,50,0.08)' : 'rgba(199,70,52,0.08)',
              border: `1px solid ${feedback.passed ? 'rgba(46,125,50,0.22)' : 'rgba(199,70,52,0.22)'}`,
              color: 'var(--oracle-text)'
            }}>
              <strong style={{ color: feedback.passed ? 'var(--oracle-success)' : 'var(--oracle-red)' }}>
                {feedback.passed ? 'Good answer' : 'Try again'}
              </strong>
              <div style={{ marginTop: '6px' }}>{feedback.text}</div>
            </div>
          )}

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={goPrev} disabled={stepIndex === 0} style={{ ...secondaryButton, opacity: stepIndex === 0 ? 0.45 : 1 }}>
              Previous
            </button>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {stage.type === 'quiz' && (
                <button
                  onClick={submitAnswer}
                  disabled={answers[stage.id] === undefined}
                  style={{ ...ghostLightButton, opacity: answers[stage.id] === undefined ? 0.45 : 1 }}
                >
                  Check answer
                </button>
              )}
              {stage.type === 'typing' && (
                <button
                  onClick={submitTypedAnswer}
                  disabled={!String(answers[stage.id] || '').trim()}
                  style={{ ...ghostLightButton, opacity: String(answers[stage.id] || '').trim() ? 1 : 0.45 }}
                >
                  Validate typed answer
                </button>
              )}

              {isLast ? (
                <button
                  onClick={() => domainScenarios[0] && onStartExercise(domainScenarios[0])}
                  disabled={!domainScenarios[0]}
                  style={{ ...primaryButton, opacity: domainScenarios[0] ? 1 : 0.45 }}
                >
                  Start BIP exercise
                </button>
              ) : (
                <button
                  onClick={goNext}
                  disabled={stage.type !== 'lesson' && !feedback?.passed}
                  style={{ ...primaryButton, opacity: stage.type !== 'lesson' && !feedback?.passed ? 0.45 : 1 }}
                >
                  Next step
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--oracle-text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Core tables
            </div>
            <div style={{ marginTop: '10px', display: 'grid', gap: '8px' }}>
              {blueprint.coreTables.slice(0, 3).map((table) => (
                <div key={table.name} style={{ background: 'var(--oracle-silver)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--oracle-navy)' }}>{table.name}</div>
                  <div style={{ marginTop: '4px', color: 'var(--oracle-text-light)', lineHeight: 1.5 }}>{table.purpose}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: 'var(--oracle-text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Join pattern
            </div>
            <div style={{ marginTop: '10px', background: 'var(--oracle-silver)', borderLeft: '4px solid var(--oracle-red)', borderRadius: '10px', padding: '12px', color: 'var(--oracle-text)', lineHeight: 1.6 }}>
              {blueprint.joinPatterns[0]}
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--oracle-text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Key caution
            </div>
            <div style={{ marginTop: '8px', background: 'var(--oracle-silver)', borderRadius: '10px', padding: '12px', color: 'var(--oracle-text-light)', lineHeight: 1.6 }}>
              {blueprint.cautions[0]}
            </div>
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

      <div style={{ display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <Panel title="Mission Brief">
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

          <Panel title="Oracle Guidance">
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ background: 'var(--oracle-silver)', borderLeft: '4px solid var(--oracle-red)', borderRadius: '12px', padding: '12px', color: 'var(--oracle-text)' }}>
                <strong>Join path</strong>
                <div style={{ marginTop: '6px', color: 'var(--oracle-text-light)', lineHeight: 1.5 }}>{blueprint.joinPatterns[0]}</div>
              </div>
              <div style={{ background: 'var(--oracle-silver)', borderLeft: '4px solid var(--oracle-accent)', borderRadius: '12px', padding: '12px', color: 'var(--oracle-text)' }}>
                <strong>Business caution</strong>
                <div style={{ marginTop: '6px', color: 'var(--oracle-text-light)', lineHeight: 1.5 }}>{blueprint.cautions[0]}</div>
              </div>
              {coachNotes.slice(0, 1).map((step) => (
                <div key={step.id} style={{ background: 'var(--oracle-silver)', borderLeft: '4px solid var(--oracle-accent)', borderRadius: '12px', padding: '12px', color: 'var(--oracle-text)' }}>
                  <strong>{step.title}</strong>
                  <div style={{ marginTop: '6px', color: 'var(--oracle-text-light)', lineHeight: 1.5 }}>{step.content}</div>
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

const headerCard = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '14px 16px' }
const cardStyle = { background: 'var(--oracle-white)', borderRadius: '16px', padding: '18px', boxShadow: 'var(--shadow-card)', border: '1px solid var(--oracle-silver-mid)' }
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }
const emptyStyle = { border: '1px dashed var(--oracle-silver-dark)', borderRadius: '12px', padding: '18px', color: 'var(--oracle-text-light)', background: 'var(--oracle-silver)' }
const primaryButton = { background: 'var(--oracle-red)', border: 'none', color: 'white', borderRadius: '10px', padding: '11px 16px', fontSize: '14px', fontWeight: 700 }
const secondaryButton = { background: 'var(--oracle-navy)', border: 'none', color: 'white', borderRadius: '10px', padding: '11px 16px', fontSize: '14px', fontWeight: 700 }
const ghostButton = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', color: 'white', borderRadius: '10px', padding: '11px 16px', fontSize: '14px', fontWeight: 700 }
const ghostLightButton = { background: 'white', border: '1px solid var(--oracle-silver-mid)', color: 'var(--oracle-navy)', borderRadius: '10px', padding: '11px 16px', fontSize: '14px', fontWeight: 700 }
