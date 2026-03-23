import { createContext, useContext, useReducer, useEffect } from 'react'
import { getLevelForPoints } from '../data/levels'

// ─────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────

const initialState = {
  user: {
    name: 'Trainee',
    points: 0,
    completedModules: [],
    completedScenarios: [],
    quizScores: {}
  },
  view: 'dashboard',        // dashboard | module | scenario
  currentModule: null,      // full module object
  currentStep: 0,           // step index within module
  currentScenario: null,    // full scenario object
  currentTask: 0,           // task index within scenario
  notification: null        // { type: 'success'|'error'|'info', message }
}

// ─────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {

    // ── Navigation ──────────────────────────
    case 'SET_VIEW':
      return {
        ...state,
        view: action.payload,
        notification: null
      }

    // ── Module ──────────────────────────────
    case 'START_MODULE':
      return {
        ...state,
        view: 'module',
        currentModule: action.payload,
        currentStep: 0,
        notification: null
      }

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(
          state.currentStep + 1,
          state.currentModule.steps.length - 1
        )
      }

    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1)
      }

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.payload
      }

    case 'COMPLETE_MODULE': {
      const alreadyDone = state.user.completedModules.includes(action.payload.moduleId)
      const pointsEarned = alreadyDone ? 0 : action.payload.points

      return {
        ...state,
        view: 'dashboard',
        currentModule: null,
        currentStep: 0,
        user: {
          ...state.user,
          points: state.user.points + pointsEarned,
          completedModules: alreadyDone
            ? state.user.completedModules
            : [...state.user.completedModules, action.payload.moduleId]
        },
        notification: {
          type: 'success',
          message: alreadyDone
            ? `Module reviewed. No additional points (already completed).`
            : `Module complete! +${pointsEarned} points earned.`
        }
      }
    }

    case 'SAVE_QUIZ_SCORE':
      return {
        ...state,
        user: {
          ...state.user,
          quizScores: {
            ...state.user.quizScores,
            [action.payload.key]: action.payload.score
          }
        }
      }

    // ── Scenario ────────────────────────────
    case 'START_SCENARIO':
      return {
        ...state,
        view: 'scenario',
        currentScenario: action.payload,
        currentTask: 0,
        notification: null
      }

    case 'NEXT_TASK':
      return {
        ...state,
        currentTask: Math.min(
          state.currentTask + 1,
          state.currentScenario.tasks.length - 1
        )
      }

    case 'COMPLETE_SCENARIO': {
      const alreadyDone = state.user.completedScenarios.includes(action.payload.scenarioId)
      const pointsEarned = alreadyDone ? 0 : action.payload.points

      return {
        ...state,
        view: 'dashboard',
        currentScenario: null,
        currentTask: 0,
        user: {
          ...state.user,
          points: state.user.points + pointsEarned,
          completedScenarios: alreadyDone
            ? state.user.completedScenarios
            : [...state.user.completedScenarios, action.payload.scenarioId]
        },
        notification: {
          type: 'success',
          message: alreadyDone
            ? `Scenario replayed. No additional points (already completed).`
            : `Scenario passed! +${pointsEarned} points earned.`
        }
      }
    }

    case 'FAIL_SCENARIO':
      return {
        ...state,
        notification: {
          type: 'error',
          message: action.payload.message
        }
      }

    // ── Points ──────────────────────────────
    case 'ADD_POINTS':
      return {
        ...state,
        user: {
          ...state.user,
          points: state.user.points + action.payload
        }
      }

    // ── Notification ────────────────────────
    case 'SET_NOTIFICATION':
      return {
        ...state,
        notification: action.payload
      }

    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notification: null
      }

    // ── User ────────────────────────────────
    case 'SET_USER_NAME':
      return {
        ...state,
        user: { ...state.user, name: action.payload }
      }

    default:
      return state
  }
}

// ─────────────────────────────────────────────
// Context + Provider
// ─────────────────────────────────────────────

const TrainerContext = createContext(null)

export function TrainerProvider({ children }) {
  // Rehydrate from localStorage if available
  const saved = (() => {
    try {
      const raw = localStorage.getItem('bip_trainer_state')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })()

  const [state, dispatch] = useReducer(
    reducer,
    saved
      ? { ...initialState, user: { ...initialState.user, ...saved } }
      : initialState
  )

  // Persist user progress to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('bip_trainer_state', JSON.stringify(state.user))
    } catch { }
  }, [state.user])

  // Derived values — computed once here, available everywhere
  const level = getLevelForPoints(state.user.points)
  const isModuleDone = (id) => state.user.completedModules.includes(id)
  const isScenarioDone = (id) => state.user.completedScenarios.includes(id)
  const isModuleLocked = (mod) => {
    if (mod.difficulty === 'Beginner') return false
    if (mod.difficulty === 'Intermediate') return state.user.points < 50
    if (mod.difficulty === 'Advanced') return state.user.points < 300
    return false
  }

  return (
    <TrainerContext.Provider value={{
      state,
      dispatch,
      level,
      isModuleDone,
      isScenarioDone,
      isModuleLocked
    }}>
      {children}
    </TrainerContext.Provider>
  )
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useTrainer() {
  const ctx = useContext(TrainerContext)
  if (!ctx) throw new Error('useTrainer must be used inside <TrainerProvider>')
  return ctx
}