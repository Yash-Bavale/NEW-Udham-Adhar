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
      analytics_events: {
        Row: {
          application_id: string | null
          created_at: string
          event_name: string
          id: string
          lead_id: string | null
          metadata: Json
          page_url: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          event_name: string
          id?: string
          lead_id?: string | null
          metadata?: Json
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string
          event_name?: string
          id?: string
          lead_id?: string | null
          metadata?: Json
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      application_links: {
        Row: {
          application_id: string | null
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          lead_id: string
          purpose: string
          token: string
          used_at: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          created_by?: string | null
          expires_at: string
          id?: string
          lead_id: string
          purpose: string
          token: string
          used_at?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          lead_id?: string
          purpose?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      application_status_history: {
        Row: {
          actor_id: string | null
          application_id: string
          created_at: string
          from_status: string | null
          id: string
          metadata: Json
          reason: string | null
          to_status: string
        }
        Insert: {
          actor_id?: string | null
          application_id: string
          created_at?: string
          from_status?: string | null
          id?: string
          metadata?: Json
          reason?: string | null
          to_status: string
        }
        Update: {
          actor_id?: string | null
          application_id?: string
          created_at?: string
          from_status?: string | null
          id?: string
          metadata?: Json
          reason?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          application_code: string | null
          application_status: Database["public"]["Enums"]["application_status"]
          assigned_to: string | null
          cancellation_requested_at: string | null
          closure_next_at: string | null
          closure_stage: Database["public"]["Enums"]["closure_stage"]
          created_at: string
          customer_id: string | null
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
          cancellation_requested_at?: string | null
          closure_next_at?: string | null
          closure_stage?: Database["public"]["Enums"]["closure_stage"]
          created_at?: string
          customer_id?: string | null
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
          cancellation_requested_at?: string | null
          closure_next_at?: string | null
          closure_stage?: Database["public"]["Enums"]["closure_stage"]
          created_at?: string
          customer_id?: string | null
          document_status?: string
          form_status?: string
          id?: string
          lead_id?: string
          service_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
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
      certificates: {
        Row: {
          application_id: string
          certificate_number: string | null
          created_at: string
          customer_id: string | null
          delivered_at: string | null
          file_name: string | null
          file_path: string | null
          id: string
          issued_at: string | null
          lead_id: string
          mime_type: string | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          application_id: string
          certificate_number?: string | null
          created_at?: string
          customer_id?: string | null
          delivered_at?: string | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          issued_at?: string | null
          lead_id: string
          mime_type?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          application_id?: string
          certificate_number?: string | null
          created_at?: string
          customer_id?: string | null
          delivered_at?: string | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          issued_at?: string | null
          lead_id?: string
          mime_type?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          application_id: string | null
          assigned_to: string | null
          breached_at: string | null
          category: string | null
          complaint_number: string | null
          created_at: string
          customer_id: string | null
          id: string
          last_reminded_at: string | null
          lead_id: string
          notes: string | null
          reminder_count: number
          resolved_at: string | null
          severity: string
          sla_due_at: string | null
          status: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          assigned_to?: string | null
          breached_at?: string | null
          category?: string | null
          complaint_number?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          last_reminded_at?: string | null
          lead_id: string
          notes?: string | null
          reminder_count?: number
          resolved_at?: string | null
          severity?: string
          sla_due_at?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          assigned_to?: string | null
          breached_at?: string | null
          category?: string | null
          complaint_number?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          last_reminded_at?: string | null
          lead_id?: string
          notes?: string | null
          reminder_count?: number
          resolved_at?: string | null
          severity?: string
          sla_due_at?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_notes: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          note: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          note: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          note?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          completed_applications: number
          created_at: string
          customer_code: string | null
          first_seen_at: string
          id: string
          language: string | null
          last_seen_at: string
          last_service_id: string | null
          lifetime_value: number
          metadata: Json
          name: string
          notes: string | null
          pending_applications: number
          primary_email: string | null
          primary_mobile: string | null
          state: string | null
          status: string
          total_applications: number
          updated_at: string
        }
        Insert: {
          completed_applications?: number
          created_at?: string
          customer_code?: string | null
          first_seen_at?: string
          id?: string
          language?: string | null
          last_seen_at?: string
          last_service_id?: string | null
          lifetime_value?: number
          metadata?: Json
          name: string
          notes?: string | null
          pending_applications?: number
          primary_email?: string | null
          primary_mobile?: string | null
          state?: string | null
          status?: string
          total_applications?: number
          updated_at?: string
        }
        Update: {
          completed_applications?: number
          created_at?: string
          customer_code?: string | null
          first_seen_at?: string
          id?: string
          language?: string | null
          last_seen_at?: string
          last_service_id?: string | null
          lifetime_value?: number
          metadata?: Json
          name?: string
          notes?: string | null
          pending_applications?: number
          primary_email?: string | null
          primary_mobile?: string | null
          state?: string | null
          status?: string
          total_applications?: number
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          application_id: string | null
          created_at: string
          doc_type: string
          file_name: string
          file_path: string
          id: string
          lead_id: string
          mime_type: string
          parent_document_id: string | null
          remarks: string | null
          size_bytes: number
          status: string
          updated_at: string
          uploaded_at: string
          verification_comment: string | null
          verified_at: string | null
          verified_by: string | null
          version: number
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          doc_type: string
          file_name: string
          file_path: string
          id?: string
          lead_id: string
          mime_type: string
          parent_document_id?: string | null
          remarks?: string | null
          size_bytes: number
          status?: string
          updated_at?: string
          uploaded_at?: string
          verification_comment?: string | null
          verified_at?: string | null
          verified_by?: string | null
          version?: number
        }
        Update: {
          application_id?: string | null
          created_at?: string
          doc_type?: string
          file_name?: string
          file_path?: string
          id?: string
          lead_id?: string
          mime_type?: string
          parent_document_id?: string | null
          remarks?: string | null
          size_bytes?: number
          status?: string
          updated_at?: string
          uploaded_at?: string
          verification_comment?: string | null
          verified_at?: string | null
          verified_by?: string | null
          version?: number
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          application_id: string | null
          attempt: number
          created_at: string
          error_message: string | null
          id: string
          lead_id: string | null
          queue_id: string | null
          sent_at: string
          smtp_response: string | null
          status: Database["public"]["Enums"]["email_log_status"]
          subject: string
          template_code: string | null
          to_email: string
        }
        Insert: {
          application_id?: string | null
          attempt?: number
          created_at?: string
          error_message?: string | null
          id?: string
          lead_id?: string | null
          queue_id?: string | null
          sent_at?: string
          smtp_response?: string | null
          status: Database["public"]["Enums"]["email_log_status"]
          subject: string
          template_code?: string | null
          to_email: string
        }
        Update: {
          application_id?: string | null
          attempt?: number
          created_at?: string
          error_message?: string | null
          id?: string
          lead_id?: string | null
          queue_id?: string | null
          sent_at?: string
          smtp_response?: string | null
          status?: Database["public"]["Enums"]["email_log_status"]
          subject?: string
          template_code?: string | null
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "email_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      email_queue: {
        Row: {
          application_id: string | null
          attempts: number
          body_html: string
          body_text: string | null
          created_at: string
          created_by: string | null
          id: string
          last_error: string | null
          lead_id: string | null
          max_attempts: number
          next_attempt_at: string
          scheduled_at: string
          sent_at: string | null
          status: Database["public"]["Enums"]["email_queue_status"]
          subject: string
          template_code: string | null
          to_email: string
          to_name: string | null
          updated_at: string
          variables: Json
        }
        Insert: {
          application_id?: string | null
          attempts?: number
          body_html: string
          body_text?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          last_error?: string | null
          lead_id?: string | null
          max_attempts?: number
          next_attempt_at?: string
          scheduled_at?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_queue_status"]
          subject: string
          template_code?: string | null
          to_email: string
          to_name?: string | null
          updated_at?: string
          variables?: Json
        }
        Update: {
          application_id?: string | null
          attempts?: number
          body_html?: string
          body_text?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          last_error?: string | null
          lead_id?: string | null
          max_attempts?: number
          next_attempt_at?: string
          scheduled_at?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_queue_status"]
          subject?: string
          template_code?: string | null
          to_email?: string
          to_name?: string | null
          updated_at?: string
          variables?: Json
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string | null
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_enabled: boolean
          is_system: boolean
          name: string
          subject: string
          updated_at: string
          variables: string[]
        }
        Insert: {
          body_html: string
          body_text?: string | null
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean
          is_system?: boolean
          name: string
          subject: string
          updated_at?: string
          variables?: string[]
        }
        Update: {
          body_html?: string
          body_text?: string | null
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean
          is_system?: boolean
          name?: string
          subject?: string
          updated_at?: string
          variables?: string[]
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      gateway_settlements: {
        Row: {
          created_at: string
          currency: string
          fees: number
          gateway: string
          gross: number
          id: string
          net: number
          raw: Json | null
          settled_at: string
          settlement_id: string
          tax_on_fees: number
        }
        Insert: {
          created_at?: string
          currency?: string
          fees?: number
          gateway: string
          gross?: number
          id?: string
          net?: number
          raw?: Json | null
          settled_at: string
          settlement_id: string
          tax_on_fees?: number
        }
        Update: {
          created_at?: string
          currency?: string
          fees?: number
          gateway?: string
          gross?: number
          id?: string
          net?: number
          raw?: Json | null
          settled_at?: string
          settlement_id?: string
          tax_on_fees?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          application_id: string | null
          base_amount: number
          cgst_amount: number
          created_at: string
          customer_id: string | null
          gst_amount: number
          id: string
          igst_amount: number
          invoice_number: string | null
          issued_at: string
          lead_id: string
          payment_id: string
          pdf_generated_at: string | null
          pdf_path: string | null
          place_of_supply: string | null
          sac_code: string
          sgst_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          base_amount: number
          cgst_amount?: number
          created_at?: string
          customer_id?: string | null
          gst_amount: number
          id?: string
          igst_amount?: number
          invoice_number?: string | null
          issued_at?: string
          lead_id: string
          payment_id: string
          pdf_generated_at?: string | null
          pdf_path?: string | null
          place_of_supply?: string | null
          sac_code?: string
          sgst_amount?: number
          total_amount: number
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          base_amount?: number
          cgst_amount?: number
          created_at?: string
          customer_id?: string | null
          gst_amount?: number
          id?: string
          igst_amount?: number
          invoice_number?: string | null
          issued_at?: string
          lead_id?: string
          payment_id?: string
          pdf_generated_at?: string | null
          pdf_path?: string | null
          place_of_supply?: string | null
          sac_code?: string
          sgst_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
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
          customer_id: string | null
          duplicate_count: number
          duplicate_of: string | null
          email: string
          gst_amount: number
          id: string
          is_duplicate: boolean
          language: string
          lead_code: string | null
          lead_source: string
          mobile: string
          name: string
          notes: string | null
          onboarding_reminded_at: string | null
          onboarding_reminder_count: number
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
          customer_id?: string | null
          duplicate_count?: number
          duplicate_of?: string | null
          email: string
          gst_amount?: number
          id?: string
          is_duplicate?: boolean
          language: string
          lead_code?: string | null
          lead_source?: string
          mobile: string
          name: string
          notes?: string | null
          onboarding_reminded_at?: string | null
          onboarding_reminder_count?: number
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
          customer_id?: string | null
          duplicate_count?: number
          duplicate_of?: string | null
          email?: string
          gst_amount?: number
          id?: string
          is_duplicate?: boolean
          language?: string
          lead_code?: string | null
          lead_source?: string
          mobile?: string
          name?: string
          notes?: string | null
          onboarding_reminded_at?: string | null
          onboarding_reminder_count?: number
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
            foreignKeyName: "leads_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      nic_codes: {
        Row: {
          activity_type: string | null
          class_code: string | null
          code: string
          created_at: string
          description: string
          division: string | null
          group_code: string | null
          id: string
          keywords: string[]
          section: string | null
        }
        Insert: {
          activity_type?: string | null
          class_code?: string | null
          code: string
          created_at?: string
          description: string
          division?: string | null
          group_code?: string | null
          id?: string
          keywords?: string[]
          section?: string | null
        }
        Update: {
          activity_type?: string | null
          class_code?: string | null
          code?: string
          created_at?: string
          description?: string
          division?: string | null
          group_code?: string | null
          id?: string
          keywords?: string[]
          section?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          entity_id: string | null
          entity_kind: string | null
          href: string | null
          id: string
          kind: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_kind?: string | null
          href?: string | null
          id?: string
          kind: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_kind?: string | null
          href?: string | null
          id?: string
          kind?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_submissions: {
        Row: {
          application_id: string | null
          created_at: string
          form_data: Json
          id: string
          lead_id: string
          service_code: string
          status: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          form_data?: Json
          id?: string
          lead_id: string
          service_code: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          created_at?: string
          form_data?: Json
          id?: string
          lead_id?: string
          service_code?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: []
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
      payment_settlements: {
        Row: {
          created_at: string
          fee: number
          id: string
          net: number
          payment_id: string
          settled_amount: number
          settlement_id: string
        }
        Insert: {
          created_at?: string
          fee?: number
          id?: string
          net?: number
          payment_id: string
          settled_amount?: number
          settlement_id: string
        }
        Update: {
          created_at?: string
          fee?: number
          id?: string
          net?: number
          payment_id?: string
          settled_amount?: number
          settlement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_settlements_settlement_id_fkey"
            columns: ["settlement_id"]
            isOneToOne: false
            referencedRelation: "gateway_settlements"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          application_id: string | null
          base_amount: number
          created_at: string
          currency: string
          customer_id: string | null
          gateway_name: string
          gst_amount: number
          id: string
          idempotency_key: string | null
          lead_id: string
          parent_payment_id: string | null
          payment_date: string | null
          raw_response: Json | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          refund_reason: string | null
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
          customer_id?: string | null
          gateway_name?: string
          gst_amount?: number
          id?: string
          idempotency_key?: string | null
          lead_id: string
          parent_payment_id?: string | null
          payment_date?: string | null
          raw_response?: Json | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          refund_reason?: string | null
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
          customer_id?: string | null
          gateway_name?: string
          gst_amount?: number
          id?: string
          idempotency_key?: string | null
          lead_id?: string
          parent_payment_id?: string | null
          payment_date?: string | null
          raw_response?: Json | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          refund_reason?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
          webhook_response?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_parent_payment_id_fkey"
            columns: ["parent_payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_parent_payment_id_fkey"
            columns: ["parent_payment_id"]
            isOneToOne: false
            referencedRelation: "payments_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_templates: {
        Row: {
          code: string
          created_at: string
          html_template: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          variables: string[]
          version: number
        }
        Insert: {
          code: string
          created_at?: string
          html_template: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          variables?: string[]
          version?: number
        }
        Update: {
          code?: string
          created_at?: string
          html_template?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          variables?: string[]
          version?: number
        }
        Relationships: []
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
      saved_lead_filters: {
        Row: {
          created_at: string
          filter_json: Json
          id: string
          is_default: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filter_json?: Json
          id?: string
          is_default?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          filter_json?: Json
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          cover_image_url: string | null
          created_at: string
          enabled: boolean
          faq: Json | null
          h1: string | null
          id: string
          intro: string | null
          label: string
          meta_description: string | null
          meta_title: string | null
          page_type: string
          published_at: string
          related_slugs: string[] | null
          sections: Json | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          enabled?: boolean
          faq?: Json | null
          h1?: string | null
          id?: string
          intro?: string | null
          label: string
          meta_description?: string | null
          meta_title?: string | null
          page_type?: string
          published_at?: string
          related_slugs?: string[] | null
          sections?: Json | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          enabled?: boolean
          faq?: Json | null
          h1?: string | null
          id?: string
          intro?: string | null
          label?: string
          meta_description?: string | null
          meta_title?: string | null
          page_type?: string
          published_at?: string
          related_slugs?: string[] | null
          sections?: Json | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      service_form_schemas: {
        Row: {
          created_at: string
          description: string | null
          documents: Json
          id: string
          is_active: boolean
          schema: Json
          service_code: string
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          documents?: Json
          id?: string
          is_active?: boolean
          schema?: Json
          service_code: string
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          documents?: Json
          id?: string
          is_active?: boolean
          schema?: Json
          service_code?: string
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      service_workflows: {
        Row: {
          application_statuses: Json
          created_at: string
          default_assignee_role: string | null
          display_name: string
          id: string
          is_active: boolean
          service_code: string
          updated_at: string
        }
        Insert: {
          application_statuses?: Json
          created_at?: string
          default_assignee_role?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          service_code: string
          updated_at?: string
        }
        Update: {
          application_statuses?: Json
          created_at?: string
          default_assignee_role?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          service_code?: string
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
      smtp_settings: {
        Row: {
          created_at: string
          daily_quota: number
          from_email: string
          from_name: string
          id: string
          is_enabled: boolean
          notes: string | null
          reply_to: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          daily_quota?: number
          from_email: string
          from_name?: string
          id?: string
          is_enabled?: boolean
          notes?: string | null
          reply_to?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          daily_quota?: number
          from_email?: string
          from_name?: string
          id?: string
          is_enabled?: boolean
          notes?: string | null
          reply_to?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
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
      workflow_settings: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          step1_template_code: string
          step2_days: number
          step2_template_code: string
          step3_days: number
          step3_template_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          step1_template_code?: string
          step2_days?: number
          step2_template_code?: string
          step3_days?: number
          step3_template_code?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          step1_template_code?: string
          step2_days?: number
          step2_template_code?: string
          step3_days?: number
          step3_template_code?: string
          updated_at?: string
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
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      find_or_create_customer: {
        Args: {
          p_email: string
          p_language?: string
          p_mobile: string
          p_name: string
          p_state?: string
        }
        Returns: string
      }
      get_dashboard_metrics: { Args: never; Returns: Json }
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
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      search_nic_codes: {
        Args: { activity?: string; limit_n?: number; q?: string }
        Returns: {
          activity_type: string
          class_code: string
          code: string
          description: string
          division: string
          group_code: string
          rank: number
          section: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
        | "form_submitted"
        | "documents_submitted"
        | "certificate_uploaded"
        | "certificate_ready"
        | "on_hold"
        | "cancelled"
        | "refund_pending"
        | "refunded"
        | "consultation_pending"
        | "consultation_scheduled"
        | "rejected"
      closure_stage:
        | "none"
        | "request_received"
        | "closure_pending"
        | "notice_sent"
        | "closed"
      email_log_status: "sent" | "failed" | "bounced"
      email_queue_status: "queued" | "sending" | "sent" | "failed" | "dlq"
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
        "form_submitted",
        "documents_submitted",
        "certificate_uploaded",
        "certificate_ready",
        "on_hold",
        "cancelled",
        "refund_pending",
        "refunded",
        "consultation_pending",
        "consultation_scheduled",
        "rejected",
      ],
      closure_stage: [
        "none",
        "request_received",
        "closure_pending",
        "notice_sent",
        "closed",
      ],
      email_log_status: ["sent", "failed", "bounced"],
      email_queue_status: ["queued", "sending", "sent", "failed", "dlq"],
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
