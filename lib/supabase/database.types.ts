export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      class_memberships: {
        Row: {
          active_period: unknown;
          class_id: string;
          created_at: string;
          created_by: string | null;
          id: string;
          joined_at: string;
          left_at: string | null;
          status: Database["public"]["Enums"]["membership_status"];
          student_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          active_period?: unknown;
          class_id: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          joined_at: string;
          left_at?: string | null;
          status?: Database["public"]["Enums"]["membership_status"];
          student_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          active_period?: unknown;
          class_id?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          joined_at?: string;
          left_at?: string | null;
          status?: Database["public"]["Enums"]["membership_status"];
          student_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "class_memberships_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "class_memberships_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "class_memberships_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "class_memberships_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      classes: {
        Row: {
          archived_at: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          name: string;
          notes: string | null;
          status: Database["public"]["Enums"]["class_status"];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["class_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["class_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "classes_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "classes_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      contracts: {
        Row: {
          archived_at: string | null;
          billing_start_date: string;
          cancellation_effective_date: string | null;
          cancelled_at: string | null;
          contract_type: string;
          created_at: string;
          created_by: string | null;
          document_storage_key: string | null;
          due_day: number;
          end_date: string | null;
          first_invoice_amount: number | null;
          id: string;
          modality: string;
          monthly_amount: number;
          notes: string | null;
          origin: Database["public"]["Enums"]["record_origin"];
          start_date: string;
          status: Database["public"]["Enums"]["contract_status"];
          student_id: string;
          updated_at: string;
          updated_by: string | null;
          weekly_frequency: number;
        };
        Insert: {
          archived_at?: string | null;
          billing_start_date: string;
          cancellation_effective_date?: string | null;
          cancelled_at?: string | null;
          contract_type: string;
          created_at?: string;
          created_by?: string | null;
          document_storage_key?: string | null;
          due_day: number;
          end_date?: string | null;
          first_invoice_amount?: number | null;
          id?: string;
          modality: string;
          monthly_amount: number;
          notes?: string | null;
          origin?: Database["public"]["Enums"]["record_origin"];
          start_date: string;
          status?: Database["public"]["Enums"]["contract_status"];
          student_id: string;
          updated_at?: string;
          updated_by?: string | null;
          weekly_frequency: number;
        };
        Update: {
          archived_at?: string | null;
          billing_start_date?: string;
          cancellation_effective_date?: string | null;
          cancelled_at?: string | null;
          contract_type?: string;
          created_at?: string;
          created_by?: string | null;
          document_storage_key?: string | null;
          due_day?: number;
          end_date?: string | null;
          first_invoice_amount?: number | null;
          id?: string;
          modality?: string;
          monthly_amount?: number;
          notes?: string | null;
          origin?: Database["public"]["Enums"]["record_origin"];
          start_date?: string;
          status?: Database["public"]["Enums"]["contract_status"];
          student_id?: string;
          updated_at?: string;
          updated_by?: string | null;
          weekly_frequency?: number;
        };
        Relationships: [
          {
            foreignKeyName: "contracts_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contracts_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contracts_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      guardians: {
        Row: {
          active: boolean;
          archived_at: string | null;
          created_at: string;
          created_by: string | null;
          email: string | null;
          full_name: string;
          id: string;
          relationship: string | null;
          student_id: string;
          updated_at: string;
          updated_by: string | null;
          whatsapp: string;
        };
        Insert: {
          active?: boolean;
          archived_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          email?: string | null;
          full_name: string;
          id?: string;
          relationship?: string | null;
          student_id: string;
          updated_at?: string;
          updated_by?: string | null;
          whatsapp: string;
        };
        Update: {
          active?: boolean;
          archived_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          email?: string | null;
          full_name?: string;
          id?: string;
          relationship?: string | null;
          student_id?: string;
          updated_at?: string;
          updated_by?: string | null;
          whatsapp?: string;
        };
        Relationships: [
          {
            foreignKeyName: "guardians_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "guardians_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "guardians_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      import_job_rows: {
        Row: {
          created_at: string;
          created_by: string | null;
          duplicate_candidates: Json;
          id: string;
          import_job_id: string;
          imported_entity_id: string | null;
          normalized_data: Json | null;
          raw_data: Json;
          row_number: number;
          status: Database["public"]["Enums"]["import_row_status"];
          updated_at: string;
          updated_by: string | null;
          validation_errors: Json;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          duplicate_candidates?: Json;
          id?: string;
          import_job_id: string;
          imported_entity_id?: string | null;
          normalized_data?: Json | null;
          raw_data?: Json;
          row_number: number;
          status: Database["public"]["Enums"]["import_row_status"];
          updated_at?: string;
          updated_by?: string | null;
          validation_errors?: Json;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          duplicate_candidates?: Json;
          id?: string;
          import_job_id?: string;
          imported_entity_id?: string | null;
          normalized_data?: Json | null;
          raw_data?: Json;
          row_number?: number;
          status?: Database["public"]["Enums"]["import_row_status"];
          updated_at?: string;
          updated_by?: string | null;
          validation_errors?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "import_job_rows_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "import_job_rows_import_job_id_fkey";
            columns: ["import_job_id"];
            isOneToOne: false;
            referencedRelation: "import_jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "import_job_rows_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      import_jobs: {
        Row: {
          completed_at: string | null;
          created_at: string;
          created_by: string | null;
          file_name: string;
          id: string;
          imported_rows: number;
          invalid_rows: number;
          module: Database["public"]["Enums"]["import_module"];
          status: Database["public"]["Enums"]["import_status"];
          storage_key: string | null;
          total_rows: number;
          updated_at: string;
          updated_by: string | null;
          valid_rows: number;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          file_name: string;
          id?: string;
          imported_rows?: number;
          invalid_rows?: number;
          module: Database["public"]["Enums"]["import_module"];
          status?: Database["public"]["Enums"]["import_status"];
          storage_key?: string | null;
          total_rows?: number;
          updated_at?: string;
          updated_by?: string | null;
          valid_rows?: number;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          file_name?: string;
          id?: string;
          imported_rows?: number;
          invalid_rows?: number;
          module?: Database["public"]["Enums"]["import_module"];
          status?: Database["public"]["Enums"]["import_status"];
          storage_key?: string | null;
          total_rows?: number;
          updated_at?: string;
          updated_by?: string | null;
          valid_rows?: number;
        };
        Relationships: [
          {
            foreignKeyName: "import_jobs_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "import_jobs_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      invoices: {
        Row: {
          amount: number;
          archived_at: string | null;
          contract_id: string;
          created_at: string;
          created_by: string | null;
          due_date: string;
          id: string;
          origin: Database["public"]["Enums"]["record_origin"];
          reference_month: string;
          status: Database["public"]["Enums"]["invoice_status"];
          student_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          amount: number;
          archived_at?: string | null;
          contract_id: string;
          created_at?: string;
          created_by?: string | null;
          due_date: string;
          id?: string;
          origin?: Database["public"]["Enums"]["record_origin"];
          reference_month: string;
          status?: Database["public"]["Enums"]["invoice_status"];
          student_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          amount?: number;
          archived_at?: string | null;
          contract_id?: string;
          created_at?: string;
          created_by?: string | null;
          due_date?: string;
          id?: string;
          origin?: Database["public"]["Enums"]["record_origin"];
          reference_month?: string;
          status?: Database["public"]["Enums"]["invoice_status"];
          student_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_contract_id_fkey";
            columns: ["contract_id"];
            isOneToOne: false;
            referencedRelation: "contracts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_records: {
        Row: {
          archived_at: string | null;
          class_id: string | null;
          content: string | null;
          created_at: string;
          created_by: string | null;
          homework: string | null;
          id: string;
          lesson_date: string;
          lesson_name: string | null;
          lesson_report: string | null;
          observations: string | null;
          origin: Database["public"]["Enums"]["record_origin"];
          student_id: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          archived_at?: string | null;
          class_id?: string | null;
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          homework?: string | null;
          id?: string;
          lesson_date: string;
          lesson_name?: string | null;
          lesson_report?: string | null;
          observations?: string | null;
          origin?: Database["public"]["Enums"]["record_origin"];
          student_id?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          archived_at?: string | null;
          class_id?: string | null;
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          homework?: string | null;
          id?: string;
          lesson_date?: string;
          lesson_name?: string | null;
          lesson_report?: string | null;
          observations?: string | null;
          origin?: Database["public"]["Enums"]["record_origin"];
          student_id?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_records_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_records_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_records_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_records_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_student_notes: {
        Row: {
          archived_at: string | null;
          created_at: string;
          created_by: string | null;
          homework: string | null;
          id: string;
          individual_report: string | null;
          lesson_record_id: string;
          observations: string | null;
          student_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          homework?: string | null;
          id?: string;
          individual_report?: string | null;
          lesson_record_id: string;
          observations?: string | null;
          student_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          homework?: string | null;
          id?: string;
          individual_report?: string | null;
          lesson_record_id?: string;
          observations?: string | null;
          student_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_student_notes_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_student_notes_lesson_record_id_fkey";
            columns: ["lesson_record_id"];
            isOneToOne: false;
            referencedRelation: "lesson_records";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_student_notes_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_student_notes_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          created_at: string;
          created_by: string | null;
          id: string;
          invoice_id: string;
          notes: string | null;
          origin: Database["public"]["Enums"]["record_origin"];
          payment_date: string;
          receipt_storage_key: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          invoice_id: string;
          notes?: string | null;
          origin?: Database["public"]["Enums"]["record_origin"];
          payment_date: string;
          receipt_storage_key?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          invoice_id?: string;
          notes?: string | null;
          origin?: Database["public"]["Enums"]["record_origin"];
          payment_date?: string;
          receipt_storage_key?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: true;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          active: boolean;
          created_at: string;
          id: string;
          must_change_password: boolean;
          name: string;
          role: Database["public"]["Enums"]["internal_role"];
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          id: string;
          must_change_password?: boolean;
          name: string;
          role?: Database["public"]["Enums"]["internal_role"];
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: string;
          must_change_password?: boolean;
          name?: string;
          role?: Database["public"]["Enums"]["internal_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      schedule_assignments: {
        Row: {
          active: boolean;
          active_period: unknown;
          assignment_type: Database["public"]["Enums"]["assignment_type"];
          class_id: string | null;
          created_at: string;
          created_by: string | null;
          end_date: string | null;
          id: string;
          start_date: string;
          student_id: string | null;
          updated_at: string;
          updated_by: string | null;
          weekly_slot_id: string;
        };
        Insert: {
          active?: boolean;
          active_period?: unknown;
          assignment_type: Database["public"]["Enums"]["assignment_type"];
          class_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          end_date?: string | null;
          id?: string;
          start_date: string;
          student_id?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          weekly_slot_id: string;
        };
        Update: {
          active?: boolean;
          active_period?: unknown;
          assignment_type?: Database["public"]["Enums"]["assignment_type"];
          class_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          end_date?: string | null;
          id?: string;
          start_date?: string;
          student_id?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          weekly_slot_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "schedule_assignments_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedule_assignments_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedule_assignments_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedule_assignments_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedule_assignments_weekly_slot_id_fkey";
            columns: ["weekly_slot_id"];
            isOneToOne: false;
            referencedRelation: "weekly_slots";
            referencedColumns: ["id"];
          },
        ];
      };
      students: {
        Row: {
          administrative_notes: string | null;
          archived_at: string | null;
          birth_date: string | null;
          cancellation_effective_date: string | null;
          cancelled_at: string | null;
          created_at: string;
          created_by: string | null;
          email: string | null;
          financial_contact_type: Database["public"]["Enums"]["financial_contact_type"];
          financial_guardian_id: string | null;
          full_name: string;
          id: string;
          origin: Database["public"]["Enums"]["record_origin"];
          status: Database["public"]["Enums"]["student_status"];
          updated_at: string;
          updated_by: string | null;
          whatsapp: string;
        };
        Insert: {
          administrative_notes?: string | null;
          archived_at?: string | null;
          birth_date?: string | null;
          cancellation_effective_date?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          email?: string | null;
          financial_contact_type?: Database["public"]["Enums"]["financial_contact_type"];
          financial_guardian_id?: string | null;
          full_name: string;
          id?: string;
          origin?: Database["public"]["Enums"]["record_origin"];
          status?: Database["public"]["Enums"]["student_status"];
          updated_at?: string;
          updated_by?: string | null;
          whatsapp: string;
        };
        Update: {
          administrative_notes?: string | null;
          archived_at?: string | null;
          birth_date?: string | null;
          cancellation_effective_date?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          email?: string | null;
          financial_contact_type?: Database["public"]["Enums"]["financial_contact_type"];
          financial_guardian_id?: string | null;
          full_name?: string;
          id?: string;
          origin?: Database["public"]["Enums"]["record_origin"];
          status?: Database["public"]["Enums"]["student_status"];
          updated_at?: string;
          updated_by?: string | null;
          whatsapp?: string;
        };
        Relationships: [
          {
            foreignKeyName: "students_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "students_financial_guardian_owner_fk";
            columns: ["financial_guardian_id", "id"];
            isOneToOne: false;
            referencedRelation: "guardians";
            referencedColumns: ["id", "student_id"];
          },
          {
            foreignKeyName: "students_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      weekly_slots: {
        Row: {
          active: boolean;
          archived_at: string | null;
          created_at: string;
          created_by: string | null;
          end_minute: number | null;
          end_time: string;
          id: string;
          start_minute: number | null;
          start_time: string;
          updated_at: string;
          updated_by: string | null;
          weekday: number;
        };
        Insert: {
          active?: boolean;
          archived_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          end_minute?: number | null;
          end_time: string;
          id?: string;
          start_minute?: number | null;
          start_time: string;
          updated_at?: string;
          updated_by?: string | null;
          weekday: number;
        };
        Update: {
          active?: boolean;
          archived_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          end_minute?: number | null;
          end_time?: string;
          id?: string;
          start_minute?: number | null;
          start_time?: string;
          updated_at?: string;
          updated_by?: string | null;
          weekday?: number;
        };
        Relationships: [
          {
            foreignKeyName: "weekly_slots_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "weekly_slots_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      whatsapp_collection_messages: {
        Row: {
          attempt_count: number;
          available_at: string;
          created_at: string;
          error_message: string | null;
          id: string;
          idempotency_key: string;
          invoice_id: string;
          last_attempt_at: string | null;
          message_snapshot: string;
          provider_message_id: string | null;
          recipient_phone: string;
          recipient_type: Database["public"]["Enums"]["financial_contact_type"];
          sent_at: string | null;
          status: Database["public"]["Enums"]["message_status"];
          updated_at: string;
        };
        Insert: {
          attempt_count?: number;
          available_at?: string;
          created_at?: string;
          error_message?: string | null;
          id?: string;
          idempotency_key: string;
          invoice_id: string;
          last_attempt_at?: string | null;
          message_snapshot: string;
          provider_message_id?: string | null;
          recipient_phone: string;
          recipient_type: Database["public"]["Enums"]["financial_contact_type"];
          sent_at?: string | null;
          status?: Database["public"]["Enums"]["message_status"];
          updated_at?: string;
        };
        Update: {
          attempt_count?: number;
          available_at?: string;
          created_at?: string;
          error_message?: string | null;
          id?: string;
          idempotency_key?: string;
          invoice_id?: string;
          last_attempt_at?: string | null;
          message_snapshot?: string;
          provider_message_id?: string | null;
          recipient_phone?: string;
          recipient_type?: Database["public"]["Enums"]["financial_contact_type"];
          sent_at?: string | null;
          status?: Database["public"]["Enums"]["message_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "whatsapp_collection_messages_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: true;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      assign_schedule: {
        Args: {
          effective_from: string;
          effective_until?: string | null;
          target_class_id: string | null;
          target_slot_id: string;
          target_student_id: string | null;
          target_type: Database["public"]["Enums"]["assignment_type"];
        };
        Returns: string;
      };
      cancel_contract: {
        Args: { effective_date: string; target_contract_id: string };
        Returns: undefined;
      };
      cancel_student: {
        Args: { effective_date: string; target_student_id: string };
        Returns: undefined;
      };
      complete_password_change: { Args: never; Returns: undefined };
      create_contract_with_invoices: {
        Args: { contract_data: Json };
        Returns: string;
      };
      create_student_with_guardian: {
        Args: { guardian_data?: Json; student_data: Json };
        Returns: string;
      };
      deactivate_weekly_slot: {
        Args: { effective_on: string; target_slot_id: string };
        Returns: undefined;
      };
      end_class: {
        Args: { effective_date: string; target_class_id: string };
        Returns: undefined;
      };
      end_class_membership: {
        Args: { left_on: string; target_membership_id: string };
        Returns: undefined;
      };
      import_schedule_row: {
        Args: { row_data: Json };
        Returns: string;
      };
      join_class: {
        Args: {
          joined_on: string;
          target_class_id: string;
          target_student_id: string;
        };
        Returns: string;
      };
      record_class_lesson: {
        Args: { lesson_data: Json; student_notes?: Json };
        Returns: string;
      };
      record_individual_lesson: {
        Args: { lesson_data: Json };
        Returns: string;
      };
      release_schedule_assignment: {
        Args: { effective_on: string; target_assignment_id: string };
        Returns: undefined;
      };
      register_payment: {
        Args: {
          paid_on: string;
          payment_amount: number;
          payment_notes?: string;
          payment_origin?: Database["public"]["Enums"]["record_origin"];
          receipt_key?: string;
          target_invoice_id: string;
        };
        Returns: string;
      };
      renew_contract: {
        Args: { contract_data: Json; current_contract_id: string };
        Returns: string;
      };
      run_finance_automation: { Args: never; Returns: Json };
      update_lesson_record: {
        Args: { lesson_data: Json; student_notes?: Json };
        Returns: undefined;
      };
    };
    Enums: {
      assignment_type: "student" | "class";
      class_status: "active" | "inactive";
      contract_status: "active" | "completed" | "cancelled";
      financial_contact_type: "student" | "guardian";
      import_module:
        | "students"
        | "contracts"
        | "schedule"
        | "finance"
        | "planner"
        | "classes";
      import_row_status: "valid" | "invalid" | "imported" | "skipped";
      import_status:
        | "processing"
        | "awaiting_confirmation"
        | "completed"
        | "failed";
      internal_role: "admin";
      invoice_status: "pending" | "overdue" | "paid" | "cancelled";
      membership_status: "active" | "ended";
      message_status: "pending" | "processing" | "sent" | "failed";
      record_origin: "manual" | "import";
      student_status: "active" | "inactive" | "cancelled";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      assignment_type: ["student", "class"],
      class_status: ["active", "inactive"],
      contract_status: ["active", "completed", "cancelled"],
      financial_contact_type: ["student", "guardian"],
      import_module: [
        "students",
        "contracts",
        "schedule",
        "finance",
        "planner",
        "classes",
      ],
      import_row_status: ["valid", "invalid", "imported", "skipped"],
      import_status: [
        "processing",
        "awaiting_confirmation",
        "completed",
        "failed",
      ],
      internal_role: ["admin"],
      invoice_status: ["pending", "overdue", "paid", "cancelled"],
      membership_status: ["active", "ended"],
      message_status: ["pending", "processing", "sent", "failed"],
      record_origin: ["manual", "import"],
      student_status: ["active", "inactive", "cancelled"],
    },
  },
} as const;
