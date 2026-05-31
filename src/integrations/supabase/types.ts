export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_description: string
          activity_type: string
          application_id: string | null
          created_at: string
          id: string
          lead_id: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          activity_description: string
          activity_type: string
          application_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_description?: string
          activity_type?: string
          application_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          application_code: string | null
          application_status: Database["public"]["Enums"]["application_status"]
          assigned_to: string | null
          created_at: string
          document_status: string
          form_status: string
          id: string
          lead_id: string
          service_id: string | null
          updated_at: string
        }
        Insert: {
          application_code?: string | null
          application_status?: Database["public"]["Enums"]["application_status"]
          assigned_to?: string | null
          created_at?: string
          document_status?: string
          form_status?: string
          id?: string
          lead_id: string
          service_id?: string | null
          updated_at?: string
        }
        Update: {
          application_code?: string | null
          application_status?: Database["public"]["Enums"]["application_status"]
          assigned_to?: string | null
          created_at?: string
          document_status?: string
          form_status?: string
          id?: string
          lead_id?: string
          service_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip: string | null
          new_value: Json | null
          old_value: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip?: string | null
          new_value?: Json | null
          old_value?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip?: string | null
          new_value?: Json | null
          old_value?: Json | null
          user_agent?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          application_id: string | null
          base_amount: number
          created_at: string
          gst_amount: number
          id: string
          invoice_number: string | null
          issued_at: string
          lead_id: string
          payment_id: string
          pdf_path: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          base_amount: number
          created_at?: string
          gst_amount: number
          id?: string
          invoice_number?: string | null
          issued_at?: string
          lead_id: string
          payment_id: string
          pdf_path?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          base_amount?: number
          created_at?: string
          gst_amount?: number
          id?: string
          invoice_number?: string | null
          issued_at?: string
          lead_id?: string
          payment_id?: string
          pdf_path?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      lead_notes: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          note: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          note: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          note?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          base_amount: number
          created_at: string
          email: string
          gst_amount: number
          id: string
          language: string
          lead_code: string | null
          lead_source: string
          mobile: string
          name: string
          notes: string | null
          remarks: string | null
          service: string
          service_id: string | null
          state: string
          status: Database["public"]["Enums"]["lead_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          base_amount?: number
          created_at?: string
          email: string
          gst_amount?: number
          id?: string
          language: string
          lead_code?: string | null
          lead_source?: string
          mobile: string
          name: string
          notes?: string | null
          remarks?: string | null
          service: string
          service_id?: string | null
          state: string
          status?: Database["public"]["Enums"]["lead_status"]
          total_amount?: number
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          base_amount?: number
          created_at?: string
          email?: string
          gst_amount?: number
          id?: string
          language?: string
          lead_code?: string | null
          lead_source?: string
          mobile?: string
          name?: string
          notes?: string | null
          remarks?: string | null
          service?: string
          service_id?: string | null
          state?: string
          status?: Database["public"]["Enums"]["lead_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateways: {
        Row: {
          config: Json
          created_at: string
          display_name: string
          id: string
          is_enabled: boolean
          name: string
          priority: number
          updated_at: string
          webhook_secret_name: string | null
        }
        Insert: {
          config?: Json
          created_at?: string
          display_name: string
          id?: string
          is_enabled?: boolean
          name: string
          priority?: number
          updated_at?: string
          webhook_secret_name?: string | null
        }
        Update: {
          config?: Json
          created_at?: string
          display_name?: string
          id?: string
          is_enabled?: boolean
          name?: string
          priority?: number
          updated_at?: string
          webhook_secret_name?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          application_id: string | null
          base_amount: number
          created_at: string
          currency: string
          gateway_name: string
          gst_amount: number
          id: string
          idempotency_key: string | null
          lead_id: string
          payment_date: string | null
          raw_response: Json | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          updated_at: string
          webhook_response: Json | null
        }
        Insert: {
          amount: number
          application_id?: string | null
          base_amount?: number
          created_at?: string
          currency?: string
          gateway_name?: string
          gst_amount?: number
          id?: string
          idempotency_key?: string | null
          lead_id: string
          payment_date?: string | null
          raw_response?: Json | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
          webhook_response?: Json | null
        }
        Update: {
          amount?: number
          application_id?: string | null
          base_amount?: number
          created_at?: string
          currency?: string
          gateway_name?: string
          gst_amount?: number
          id?: string
          idempotency_key?: string | null
          lead_id?: string
          payment_date?: string | null
          raw_response?: Json | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
          webhook_response?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          label: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          label: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          label?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          base_amount: number
          created_at: string
          description: string | null
          gst_amount: number
          id: string
          is_active: boolean
          service_code: string
          service_name: string
          sort_order: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          base_amount: number
          created_at?: string
          description?: string | null
          gst_amount?: number
          id?: string
          is_active?: boolean
          service_code: string
          service_name: string
          sort_order?: number
          total_amount: number
          updated_at?: string
        }
        Update: {
          base_amount?: number
          created_at?: string
          description?: string | null
          gst_amount?: number
          id?: string
          is_active?: boolean
          service_code?: string
          service_name?: string
          sort_order?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      payments_safe: {
        Row: {
          application_id: string | null
          created_at: string | null
          gateway_name: string | null
          id: string | null
          lead_id: string | null
          payment_date: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          gateway_name?: string | null
          id?: string | null
          lead_id?: string | null
          payment_date?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          gateway_name?: string | null
          id?: string | null
          lead_id?: string | null
          payment_date?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      current_user_is_admin: { Args: never; Returns: boolean }
      has_any_staff_role: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_finance_viewer: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "super_admin"
        | "operations"
        | "support"
        | "accounts"
        | "finance"
      application_status:
        | "awaiting_payment"
        | "payment_received"
        | "details_pending"
        | "documents_pending"
        | "under_review"
        | "under_process"
        | "completed"
      lead_status:
        | "lead_created"
        | "payment_pending"
        | "payment_successful"
        | "details_pending"
        | "documents_pending"
        | "under_review"
        | "under_process"
        | "completed"
        | "closed"
        | "new_lead"
        | "contacted"
        | "refund_requested"
      payment_status: "created" | "attempted" | "paid" | "failed" | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "super_admin",
        "operations",
        "support",
        "accounts",
        "finance",
      ],
      application_status: [
        "awaiting_payment",
        "payment_received",
        "details_pending",
        "documents_pending",
        "under_review",
        "under_process",
        "completed",
      ],
      lead_status: [
        "lead_created",
        "payment_pending",
        "payment_successful",
        "details_pending",
        "documents_pending",
        "under_review",
        "under_process",
        "completed",
        "closed",
        "new_lead",
        "contacted",
        "refund_requested",
      ],
      payment_status: ["created", "attempted", "paid", "failed", "refunded"],
    },
  },
} as const
