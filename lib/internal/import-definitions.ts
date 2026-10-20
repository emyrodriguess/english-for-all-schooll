export const importModules = [
  "students",
  "contracts",
  "schedule",
  "finance",
  "planner",
  "classes",
] as const;
export type ImportModule = (typeof importModules)[number];

export const importModuleLabels: Record<ImportModule, string> = {
  students: "Alunos",
  contracts: "Contratos",
  schedule: "Agenda",
  finance: "Financeiro",
  planner: "Planner",
  classes: "Turmas",
};

export const importTemplates: Record<ImportModule, string> = {
  students:
    "full_name,birth_date,email,whatsapp,status,administrative_notes\nAna Souza,2010-05-20,ana@email.com,(11) 99999-0000,active,Observação opcional\n",
  contracts:
    "student_email,student_whatsapp,modality,weekly_frequency,contract_type,start_date,billing_start_date,end_date,monthly_amount,first_invoice_amount,due_day,notes\nana@email.com,,individual,2,anual,2026-09-01,2026-09-01,2027-08-31,424.00,,10,\n",
  schedule:
    "weekday,start_time,end_time,assignment_type,student_email,class_name,start_date,end_date\n1,09:00,10:00,student,ana@email.com,,2026-09-01,\n",
  finance:
    "student_email,student_whatsapp,reference_month,due_date,amount,status,payment_date,notes\nana@email.com,,2026-09-01,2026-09-10,424.00,paid,2026-09-10,Importação histórica\n",
  planner:
    "lesson_date,student_email,class_name,lesson_name,content,observations,lesson_report,homework\n2026-09-10,ana@email.com,,Conversation,Simple past,,Bom desempenho,Workbook p. 10\n",
  classes: "name,status,notes\nKids A,active,Turma de crianças\n",
};

export type ImportPreview = {
  jobId: string;
  fileName: string;
  module: ImportModule;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  detectedColumns: string[];
  rows: Array<{
    rowNumber: number;
    status: "valid" | "invalid";
    values: Record<string, string>;
    errors: string[];
    duplicates: string[];
  }>;
};
