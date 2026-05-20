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
      document_signatures: {
        Row: {
          user_id: string
          document_key: string
          signed_at: string
        }
        Insert: {
          user_id: string
          document_key: string
          signed_at?: string
        }
        Update: {
          user_id?: string
          document_key?: string
          signed_at?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          code_of_conduct: boolean
          confirmed: boolean
          created_at: string
          dietary: string
          email: string
          emergency_contact: string
          exp_level: string
          first_name: string
          github: string | null
          grad_year: string
          id: string
          idea: string | null
          last_name: string
          linkedin: string | null
          parent_email: string
          parent_name: string
          parent_phone: string
          parent_signature: boolean
          phone: string
          photo_release: boolean
          school: string
          status: Database["public"]["Enums"]["registration_status"]
          team_name: string | null
          teammate_emails: string[]
          tshirt: string
        }
        Insert: {
          code_of_conduct?: boolean
          confirmed?: boolean
          created_at?: string
          dietary: string
          email: string
          emergency_contact: string
          exp_level: string
          first_name: string
          github?: string | null
          grad_year: string
          id?: string
          idea?: string | null
          last_name: string
          linkedin?: string | null
          parent_email: string
          parent_name: string
          parent_phone: string
          parent_signature?: boolean
          phone: string
          photo_release?: boolean
          school: string
          status?: Database["public"]["Enums"]["registration_status"]
          team_name?: string | null
          teammate_emails?: string[]
          tshirt: string
        }
        Update: {
          code_of_conduct?: boolean
          confirmed?: boolean
          created_at?: string
          dietary?: string
          email?: string
          emergency_contact?: string
          exp_level?: string
          first_name?: string
          github?: string | null
          grad_year?: string
          id?: string
          idea?: string | null
          last_name?: string
          linkedin?: string | null
          parent_email?: string
          parent_name?: string
          parent_phone?: string
          parent_signature?: boolean
          phone?: string
          photo_release?: boolean
          school?: string
          status?: Database["public"]["Enums"]["registration_status"]
          team_name?: string | null
          teammate_emails?: string[]
          tshirt?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          code_of_conduct: boolean
          confirmed: boolean
          created_at: string
          dietary: string
          email: string
          emergency_contact: string
          exp_level: string
          first_name: string
          github: string | null
          grad_year: string
          id: string
          idea: string | null
          last_name: string
          linkedin: string | null
          parent_email: string
          parent_name: string
          parent_phone: string
          parent_signature: boolean
          phone: string
          photo_release: boolean
          position: number
          school: string
          team_name: string | null
          teammate_emails: string[]
          tshirt: string
        }
        Insert: {
          code_of_conduct?: boolean
          confirmed?: boolean
          created_at?: string
          dietary: string
          email: string
          emergency_contact: string
          exp_level: string
          first_name: string
          github?: string | null
          grad_year: string
          id?: string
          idea?: string | null
          last_name: string
          linkedin?: string | null
          parent_email: string
          parent_name: string
          parent_phone: string
          parent_signature?: boolean
          phone: string
          photo_release?: boolean
          position?: number
          school: string
          team_name?: string | null
          teammate_emails?: string[]
          tshirt: string
        }
        Update: {
          code_of_conduct?: boolean
          confirmed?: boolean
          created_at?: string
          dietary?: string
          email?: string
          emergency_contact?: string
          exp_level?: string
          first_name?: string
          github?: string | null
          grad_year?: string
          id?: string
          idea?: string | null
          last_name?: string
          linkedin?: string | null
          parent_email?: string
          parent_name?: string
          parent_phone?: string
          parent_signature?: boolean
          phone?: string
          photo_release?: boolean
          position?: number
          school?: string
          team_name?: string | null
          teammate_emails?: string[]
          tshirt?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_registration_count: { Args: never; Returns: number }
    }
    Enums: {
      registration_status: "accepted" | "waitlisted"
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
      registration_status: ["accepted", "waitlisted"],
    },
  },
} as const
