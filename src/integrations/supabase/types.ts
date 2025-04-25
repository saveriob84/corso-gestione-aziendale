export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          cap: string | null
          codiceateco: string | null
          comune: string | null
          email: string | null
          id: string
          indirizzo: string | null
          macrosettore: string | null
          partitaiva: string
          provincia: string | null
          ragionesociale: string
          referente: string | null
          telefono: string | null
          user_id: string | null
        }
        Insert: {
          cap?: string | null
          codiceateco?: string | null
          comune?: string | null
          email?: string | null
          id?: string
          indirizzo?: string | null
          macrosettore?: string | null
          partitaiva: string
          provincia?: string | null
          ragionesociale: string
          referente?: string | null
          telefono?: string | null
          user_id?: string | null
        }
        Update: {
          cap?: string | null
          codiceateco?: string | null
          comune?: string | null
          email?: string | null
          id?: string
          indirizzo?: string | null
          macrosettore?: string | null
          partitaiva?: string
          provincia?: string | null
          ragionesociale?: string
          referente?: string | null
          telefono?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      course_participants: {
        Row: {
          course_id: string
          created_at: string
          id: string
          participant_id: string
          user_id: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          participant_id: string
          user_id?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          participant_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_participants_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_participants_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          aziende: number
          codice: string
          datacreazione: string | null
          datafine: string | null
          datainizio: string | null
          docenti: number
          edizioni: number
          id: string
          moduloformativo: string | null
          partecipanti: number
          sede: string | null
          stato: string
          titolo: string
          tutor: number
          user_id: string | null
        }
        Insert: {
          aziende?: number
          codice: string
          datacreazione?: string | null
          datafine?: string | null
          datainizio?: string | null
          docenti?: number
          edizioni?: number
          id?: string
          moduloformativo?: string | null
          partecipanti?: number
          sede?: string | null
          stato?: string
          titolo: string
          tutor?: number
          user_id?: string | null
        }
        Update: {
          aziende?: number
          codice?: string
          datacreazione?: string | null
          datafine?: string | null
          datainizio?: string | null
          docenti?: number
          edizioni?: number
          id?: string
          moduloformativo?: string | null
          partecipanti?: number
          sede?: string | null
          stato?: string
          titolo?: string
          tutor?: number
          user_id?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          course_id: string | null
          data: string | null
          id: string
          orario: string | null
          sede: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          data?: string | null
          id?: string
          orario?: string | null
          sede?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          data?: string | null
          id?: string
          orario?: string | null
          sede?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          annoassunzione: string | null
          azienda: string | null
          aziendaid: string | null
          ccnl: string | null
          codicefiscale: string | null
          cognome: string
          contratto: string | null
          course_id: string | null
          datanascita: string | null
          id: string
          luogonascita: string | null
          nome: string
          numerocellulare: string | null
          password: string | null
          qualifica: string | null
          ruolo: string | null
          titolostudio: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          annoassunzione?: string | null
          azienda?: string | null
          aziendaid?: string | null
          ccnl?: string | null
          codicefiscale?: string | null
          cognome: string
          contratto?: string | null
          course_id?: string | null
          datanascita?: string | null
          id?: string
          luogonascita?: string | null
          nome: string
          numerocellulare?: string | null
          password?: string | null
          qualifica?: string | null
          ruolo?: string | null
          titolostudio?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          annoassunzione?: string | null
          azienda?: string | null
          aziendaid?: string | null
          ccnl?: string | null
          codicefiscale?: string | null
          cognome?: string
          contratto?: string | null
          course_id?: string | null
          datanascita?: string | null
          id?: string
          luogonascita?: string | null
          nome?: string
          numerocellulare?: string | null
          password?: string | null
          qualifica?: string | null
          ruolo?: string | null
          titolostudio?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participants_aziendaid_fkey"
            columns: ["aziendaid"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participants_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cognome: string | null
          created_at: string
          id: string
          nome: string | null
          ruolo: string | null
        }
        Insert: {
          cognome?: string | null
          created_at?: string
          id: string
          nome?: string | null
          ruolo?: string | null
        }
        Update: {
          cognome?: string | null
          created_at?: string
          id?: string
          nome?: string | null
          ruolo?: string | null
        }
        Relationships: []
      }
      teachers_tutors: {
        Row: {
          cognome: string
          corso_id: string | null
          id: string
          nome: string
          ruolo: string | null
          specializzazione: string | null
          tipo: string
          user_id: string | null
        }
        Insert: {
          cognome: string
          corso_id?: string | null
          id?: string
          nome: string
          ruolo?: string | null
          specializzazione?: string | null
          tipo: string
          user_id?: string | null
        }
        Update: {
          cognome?: string
          corso_id?: string | null
          id?: string
          nome?: string
          ruolo?: string | null
          specializzazione?: string | null
          tipo?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_tutors_corso_id_fkey"
            columns: ["corso_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
