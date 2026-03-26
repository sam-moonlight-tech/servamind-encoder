import { createContext, useCallback, useContext, useReducer } from "react";
import type { WorkflowStage, ProcessType, FileResult } from "@/types/domain.types";

interface PerProcessState {
  stage: WorkflowStage;
  hasFile: boolean;
  fileResults: FileResult[];
}

interface WorkflowState {
  activeProcess: ProcessType;
  isUploading: boolean;
  isScrolled: boolean;
  processes: Record<ProcessType, PerProcessState>;
}

type WorkflowAction =
  | { type: "SET_STAGE"; stage: WorkflowStage }
  | { type: "SET_PROCESS"; process: ProcessType }
  | { type: "SET_HAS_FILE"; hasFile: boolean }
  | { type: "ADD_FILE_RESULT"; result: FileResult }
  | { type: "SET_IS_UPLOADING"; isUploading: boolean }
  | { type: "SET_IS_SCROLLED"; isScrolled: boolean }
  | { type: "RESET" };

const perProcessInitial: PerProcessState = {
  stage: "upload",
  hasFile: false,
  fileResults: [],
};

const initialState: WorkflowState = {
  activeProcess: "compress",
  isUploading: false,
  isScrolled: false,
  processes: {
    compress: { ...perProcessInitial },
    decompress: { ...perProcessInitial },
  },
};

function workflowReducer(
  state: WorkflowState,
  action: WorkflowAction
): WorkflowState {
  const active = state.activeProcess;
  switch (action.type) {
    case "SET_STAGE":
      return {
        ...state,
        processes: {
          ...state.processes,
          [active]: { ...state.processes[active], stage: action.stage },
        },
      };
    case "SET_PROCESS":
      return { ...state, activeProcess: action.process };
    case "SET_HAS_FILE":
      return {
        ...state,
        processes: {
          ...state.processes,
          [active]: { ...state.processes[active], hasFile: action.hasFile },
        },
      };
    case "ADD_FILE_RESULT":
      return {
        ...state,
        processes: {
          ...state.processes,
          [active]: {
            ...state.processes[active],
            fileResults: [...state.processes[active].fileResults, action.result],
          },
        },
      };
    case "SET_IS_UPLOADING":
      return { ...state, isUploading: action.isUploading };
    case "SET_IS_SCROLLED":
      return { ...state, isScrolled: action.isScrolled };
    case "RESET":
      return {
        ...state,
        processes: {
          ...state.processes,
          [active]: { ...perProcessInitial },
        },
      };
    default:
      return state;
  }
}

interface WorkflowContextValue {
  stage: WorkflowStage;
  process: ProcessType;
  hasFile: boolean;
  fileResults: FileResult[];
  isUploading: boolean;
  isScrolled: boolean;
  setStage: (stage: WorkflowStage) => void;
  setProcess: (process: ProcessType) => void;
  setHasFile: (hasFile: boolean) => void;
  addFileResult: (result: FileResult) => void;
  setIsUploading: (isUploading: boolean) => void;
  setIsScrolled: (isScrolled: boolean) => void;
  reset: () => void;
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  const active = state.processes[state.activeProcess];

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

  const setIsUploading = useCallback((isUploading: boolean) => {
    dispatch({ type: "SET_IS_UPLOADING", isUploading });
  }, []);

  const setIsScrolled = useCallback((isScrolled: boolean) => {
    dispatch({ type: "SET_IS_SCROLLED", isScrolled });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return (
    <WorkflowContext.Provider
      value={{
        stage: active.stage,
        process: state.activeProcess,
        hasFile: active.hasFile,
        fileResults: active.fileResults,
        isUploading: state.isUploading,
        isScrolled: state.isScrolled,
        setStage,
        setProcess,
        setHasFile,
        addFileResult,
        setIsUploading,
        setIsScrolled,
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
