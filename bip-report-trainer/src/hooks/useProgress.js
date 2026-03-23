import { useTrainer } from '../context/TrainerContext.jsx';
import { MODULES } from '../data/modules.js';
import { getLevelByXP, getNextLevel, getXPProgress } from '../data/levels.js';

export function useProgress() {
  const { state, dispatch, level } = useTrainer();

  const nextLevel = getNextLevel(state.totalXP);
  const xpProgress = getXPProgress(state.totalXP);

  function startModule(moduleId) {
    dispatch({ type: 'START_MODULE', moduleId });
  }

  function advanceStep(moduleId, stepIndex) {
    dispatch({ type: 'ADVANCE_STEP', moduleId, stepIndex });
  }

  function completeQuiz(moduleId, results) {
    dispatch({ type: 'COMPLETE_QUIZ', moduleId, results });
  }

  function completeModule(moduleId) {
    dispatch({ type: 'COMPLETE_MODULE', moduleId });
  }

  function getModuleStatus(moduleId) {
    if (state.completedModules.includes(moduleId)) return 'completed';
    if (state.moduleProgress[moduleId]) return 'in-progress';
    return 'not-started';
  }

  function getModuleStepProgress(moduleId) {
    const prog = state.moduleProgress[moduleId];
    const module = MODULES.find(m => m.id === moduleId);
    if (!prog || !module) return 0;
    return Math.round((prog.completedSteps.length / module.totalSteps) * 100);
  }

  function getCurrentStep(moduleId) {
    return state.moduleProgress[moduleId]?.currentStep ?? 0;
  }

  function getQuizScore(moduleId) {
    return state.moduleProgress[moduleId]?.score ?? null;
  }

  const stats = {
    totalModules: MODULES.length,
    completedModules: state.completedModules.length,
    inProgressModules: Object.keys(state.moduleProgress).length - state.completedModules.length,
    completionPct: Math.round((state.completedModules.length / MODULES.length) * 100),
  };

  return {
    totalXP: state.totalXP,
    level,
    nextLevel,
    xpProgress,
    completedModules: state.completedModules,
    moduleProgress: state.moduleProgress,
    quizHistory: state.quizHistory,
    stats,
    startModule,
    advanceStep,
    completeQuiz,
    completeModule,
    getModuleStatus,
    getModuleStepProgress,
    getCurrentStep,
    getQuizScore,
  };
}
