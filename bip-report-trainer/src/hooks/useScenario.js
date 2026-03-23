import { useState, useCallback } from 'react';
import { useTrainer } from '../context/TrainerContext.jsx';
import { SCENARIOS } from '../data/scenarios.js';

export function useScenario(scenarioId) {
  const { state, dispatch } = useTrainer();
  const scenario = SCENARIOS.find(s => s.id === scenarioId);
  const progress = state.scenarioProgress[scenarioId] || { currentStep: 0, completed: false };

  const [stepValidated, setStepValidated] = useState(false);

  const currentStepData = scenario?.steps[progress.currentStep] ?? null;
  const isLastStep = scenario ? progress.currentStep >= scenario.steps.length - 1 : false;
  const isCompleted = progress.completed;

  const validateStep = useCallback(() => {
    setStepValidated(true);
  }, []);

  const nextStep = useCallback(() => {
    if (!scenario) return;
    if (isLastStep) {
      dispatch({ type: 'COMPLETE_SCENARIO', scenarioId, xpEarned: scenario.xpReward });
    } else {
      dispatch({ type: 'ADVANCE_SCENARIO', scenarioId, stepIndex: progress.currentStep });
    }
    setStepValidated(false);
  }, [scenario, isLastStep, progress.currentStep, scenarioId, dispatch]);

  return {
    scenario,
    currentStep: progress.currentStep,
    currentStepData,
    totalSteps: scenario?.steps.length ?? 0,
    isLastStep,
    isCompleted,
    stepValidated,
    validateStep,
    nextStep,
  };
}
