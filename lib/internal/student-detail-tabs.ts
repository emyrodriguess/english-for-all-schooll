export const STUDENT_DETAIL_TABS = [
  "overview",
  "contracts",
  "finance",
  "planner",
  "classes",
] as const;

export type StudentDetailTab = (typeof STUDENT_DETAIL_TABS)[number];

export function isStudentDetailTab(
  value: string | undefined,
): value is StudentDetailTab {
  return STUDENT_DETAIL_TABS.some((tab) => tab === value);
}
