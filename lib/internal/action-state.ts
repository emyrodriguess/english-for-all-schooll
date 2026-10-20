export type ActionState<T = undefined> = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
  data?: T;
};

export const INITIAL_ACTION_STATE: ActionState = { status: "idle" };

export function actionError(message: string): ActionState {
  return { status: "error", message };
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Não foi possível concluir a operação.";
}
