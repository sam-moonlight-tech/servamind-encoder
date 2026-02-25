import { createContext, useCallback, useContext, useReducer } from "react";
import type { WorkflowStage, ProcessType, FileResult } from "@/types/domain.types";

interface WorkflowState {
  stage: WorkflowStage;
  process: ProcessType;
  hasFile: boolean;
  fileResults: FileResult[];
}

type WorkflowAction =
  | { type: "SET_STAGE"; stage: WorkflowStage }
  | { type: "SET_PROCESS"; process: ProcessType }
  | { type: "SET_HAS_FILE"; hasFile: boolean }
  | { type: "ADD_FILE_RESULT"; result: FileResult }
  | { type: "RESET" };

const initialState: WorkflowState = {
  stage: "upload",
  process: "compress",
  hasFile: false,
  fileResults: [],
};

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
    case "ADD_FILE_RESULT":
      return { ...state, fileResults: [...state.fileResults, action.result] };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface WorkflowContextValue {
  stage: WorkflowStage;
  process: ProcessType;
  hasFile: boolean;
  fileResults: FileResult[];
  setStage: (stage: WorkflowStage) => void;
  setProcess: (process: ProcessType) => void;
  setHasFile: (hasFile: boolean) => void;
  addFileResult: (result: FileResult) => void;
  reset: () => void;
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  const setStage = useCallback((stage: WorkflowStage) => {
    dispatch({ type: "SET_STAGE", stage });
  }, []);

  const setProcess = useCallback((process: ProcessType) => {
    dispatch({ type: "SET_PROCESS", process });
  }, []);

  const setHasFile = useCallback((hasFile: boolean) => {
    dispatch({ type: "SET_HAS_FILE", hasFile });
  }, []);

  const addFileResult = useCallback((result: FileResult) => {
    dispatch({ type: "ADD_FILE_RESULT", result });
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
        fileResults: state.fileResults,
        setStage,
        setProcess,
        setHasFile,
        addFileResult,
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
