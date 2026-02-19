import { createContext, useCallback, useContext, useReducer } from "react";
import type { WorkflowStage, ProcessType } from "@/types/domain.types";

interface WorkflowState {
  stage: WorkflowStage;
  process: ProcessType;
  hasFile: boolean;
}

type WorkflowAction =
  | { type: "SET_STAGE"; stage: WorkflowStage }
  | { type: "SET_PROCESS"; process: ProcessType }
  | { type: "SET_HAS_FILE"; hasFile: boolean }
  | { type: "RESET" };

function workflowReducer(
  state: WorkflowState,
  action: WorkflowAction
): WorkflowState {
  switch (action.type) {
    case "SET_STAGE":
      return { ...state, stage: action.stage };
    case "SET_PROCESS":
      return { ...state, process: action.process };
    case "SET_HAS_FILE":
      return { ...state, hasFile: action.hasFile };
    case "RESET":
      return { stage: "upload", process: "compress", hasFile: false };
    default:
      return state;
  }
}

interface WorkflowContextValue {
  stage: WorkflowStage;
  process: ProcessType;
  hasFile: boolean;
  setStage: (stage: WorkflowStage) => void;
  setProcess: (process: ProcessType) => void;
  setHasFile: (hasFile: boolean) => void;
  reset: () => void;
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, {
    stage: "upload",
    process: "compress",
    hasFile: false,
  });

  const setStage = useCallback((stage: WorkflowStage) => {
    dispatch({ type: "SET_STAGE", stage });
  }, []);

  const setProcess = useCallback((process: ProcessType) => {
    dispatch({ type: "SET_PROCESS", process });
  }, []);

  const setHasFile = useCallback((hasFile: boolean) => {
    dispatch({ type: "SET_HAS_FILE", hasFile });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return (
    <WorkflowContext.Provider
      value={{
        stage: state.stage,
        process: state.process,
        hasFile: state.hasFile,
        setStage,
        setProcess,
        setHasFile,
        reset,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

function useWorkflow(): WorkflowContextValue {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
}

export { WorkflowProvider, useWorkflow };
