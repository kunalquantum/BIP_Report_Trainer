import { createContext, useContext, useReducer } from 'react';

const TrainerContext = createContext();

const initialState = {
  user: { name: "Trainee", points: 0, completedModules: [], completedScenarios: [] },
  currentModule: null,
  currentStep: 0,
  currentScenario: null,
  view: 'dashboard' // dashboard | module | scenario | leaderboard
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW': return { ...state, view: action.payload };
    case 'START_MODULE': return { ...state, currentModule: action.payload, currentStep: 0, view: 'module' };
    case 'NEXT_STEP': return { ...state, currentStep: state.currentStep + 1 };
    case 'PREV_STEP': return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case 'COMPLETE_MODULE':
      return {
        ...state,
        user: {
          ...state.user,
          points: state.user.points + action.payload.points,
          completedModules: [...state.user.completedModules, action.payload.moduleId]
        },
        view: 'dashboard'
      };
    case 'START_SCENARIO': return { ...state, currentScenario: action.payload, view: 'scenario' };
    case 'ADD_POINTS':
      return { ...state, user: { ...state.user, points: state.user.points + action.payload } };
    default: return state;
  }
}

export function TrainerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <TrainerContext.Provider value={{ state, dispatch }}>
      {children}
    </TrainerContext.Provider>
  );
}

export const useTrainer = () => useContext(TrainerContext);