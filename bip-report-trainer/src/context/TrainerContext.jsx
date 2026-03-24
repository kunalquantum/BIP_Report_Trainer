import { createContext, useContext, useEffect, useReducer } from 'react'
import { getLevelForPoints } from '../data/levels'

function createScenarioWorkspace() {
  return {
    sqlDraft: '',
    params: {},
    lastRun: null,
    lastValidation: null,
    completedTaskIds: []
  }
}

const initialState = {
  user: {
    name: 'Trainee',
    points: 0,
    completedModules: [],
    completedScenarios: [],
    quizScores: {}
  },
  view: 'dashboard',
  currentModule: null,
  currentStep: 0,
  currentScenario: null,
  currentTask: 0,
  scenarioWorkspace: createScenarioWorkspace(),
  notification: null
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return {
        ...state,
        view: action.payload,
        notification: null
      }

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
        currentStep: Math.min(state.currentStep + 1, state.currentModule.steps.length - 1)
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
            ? 'Module reviewed. No additional points were awarded.'
            : `Knowledge track completed. +${pointsEarned} points awarded.`
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

    case 'START_SCENARIO':
      return {
        ...state,
        view: 'scenario',
        currentScenario: action.payload,
        currentTask: 0,
        scenarioWorkspace: createScenarioWorkspace(),
        notification: null
      }

    case 'EXIT_SCENARIO':
      return {
        ...state,
        view: 'dashboard',
        currentScenario: null,
        currentTask: 0,
        scenarioWorkspace: createScenarioWorkspace(),
        notification: null
      }

    case 'SET_SCENARIO_SQL':
      return {
        ...state,
        scenarioWorkspace: {
          ...state.scenarioWorkspace,
          sqlDraft: action.payload
        }
      }

    case 'SET_SCENARIO_PARAM':
      return {
        ...state,
        scenarioWorkspace: {
          ...state.scenarioWorkspace,
          params: {
            ...state.scenarioWorkspace.params,
            [action.payload.name]: action.payload.value
          }
        }
      }

    case 'SET_SCENARIO_RUN':
      return {
        ...state,
        scenarioWorkspace: {
          ...state.scenarioWorkspace,
          lastRun: action.payload
        }
      }

    case 'SET_SCENARIO_VALIDATION':
      return {
        ...state,
        scenarioWorkspace: {
          ...state.scenarioWorkspace,
          lastValidation: action.payload
        }
      }

    case 'COMPLETE_SCENARIO_TASK': {
      const taskId = action.payload
      const completedTaskIds = state.scenarioWorkspace.completedTaskIds.includes(taskId)
        ? state.scenarioWorkspace.completedTaskIds
        : [...state.scenarioWorkspace.completedTaskIds, taskId]

      return {
        ...state,
        scenarioWorkspace: {
          ...state.scenarioWorkspace,
          completedTaskIds
        }
      }
    }

    case 'NEXT_TASK':
      return {
        ...state,
        currentTask: Math.min(state.currentTask + 1, state.currentScenario.tasks.length - 1),
        scenarioWorkspace: {
          ...state.scenarioWorkspace,
          lastRun: null,
          lastValidation: null
        }
      }

    case 'PREV_TASK':
      return {
        ...state,
        currentTask: Math.max(0, state.currentTask - 1),
        scenarioWorkspace: {
          ...state.scenarioWorkspace,
          lastRun: null,
          lastValidation: null
        }
      }

    case 'COMPLETE_SCENARIO': {
      const alreadyDone = state.user.completedScenarios.includes(action.payload.scenarioId)
      const pointsEarned = alreadyDone ? 0 : action.payload.points

      return {
        ...state,
        view: 'dashboard',
        currentScenario: null,
        currentTask: 0,
        scenarioWorkspace: createScenarioWorkspace(),
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
            ? 'Mission replayed. No additional points were awarded.'
            : `Mission complete. +${pointsEarned} points awarded.`
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

    case 'ADD_POINTS':
      return {
        ...state,
        user: {
          ...state.user,
          points: state.user.points + action.payload
        }
      }

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

    case 'SET_USER_NAME':
      return {
        ...state,
        user: { ...state.user, name: action.payload }
      }

    default:
      return state
  }
}

const TrainerContext = createContext(null)

export function TrainerProvider({ children }) {
  const saved = (() => {
    try {
      const raw = localStorage.getItem('bip_trainer_state')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })()

  const [state, dispatch] = useReducer(
    reducer,
    saved
      ? { ...initialState, user: { ...initialState.user, ...saved } }
      : initialState
  )

  useEffect(() => {
    try {
      localStorage.setItem('bip_trainer_state', JSON.stringify(state.user))
    } catch {
      // Ignore storage failures in restricted browsers.
    }
  }, [state.user])

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

export function useTrainer() {
  const ctx = useContext(TrainerContext)
  if (!ctx) throw new Error('useTrainer must be used inside <TrainerProvider>')
  return ctx
}
