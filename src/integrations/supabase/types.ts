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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      award_categories: {
        Row: {
          active: boolean
          created_at: string
          description: string
          group_name: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          group_name?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          group_name?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      award_timeline: {
        Row: {
          body: string
          created_at: string
          date_text: string
          id: string
          label: string
          published: boolean
          sort_order: number
        }
        Insert: {
          body?: string
          created_at?: string
          date_text: string
          id?: string
          label: string
          published?: boolean
          sort_order?: number
        }
        Update: {
          body?: string
          created_at?: string
          date_text?: string
          id?: string
          label?: string
          published?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          company: string
          created_at: string
          email: string
          full_name: string
          id: string
          kind: string
          message: string
          phone: string
          status: string
          user_id: string | null
        }
        Insert: {
          company?: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          kind?: string
          message?: string
          phone?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          kind?: string
          message?: string
          phone?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          published: boolean
          question: string
          section: string
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          published?: boolean
          question: string
          section?: string
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          published?: boolean
          question?: string
          section?: string
          sort_order?: number
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          active: boolean
          alt_label: string
          alt_link: string
          body: string
          created_at: string
          cta_label: string
          cta_link: string
          eyebrow: string
          highlight: string
          id: string
          image_url: string | null
          panel: string
          sort_order: number
          title: string
        }
        Insert: {
          active?: boolean
          alt_label?: string
          alt_link?: string
          body?: string
          created_at?: string
          cta_label?: string
          cta_link?: string
          eyebrow?: string
          highlight?: string
          id?: string
          image_url?: string | null
          panel?: string
          sort_order?: number
          title: string
        }
        Update: {
          active?: boolean
          alt_label?: string
          alt_link?: string
          body?: string
          created_at?: string
          cta_label?: string
          cta_link?: string
          eyebrow?: string
          highlight?: string
          id?: string
          image_url?: string | null
          panel?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      home_cards: {
        Row: {
          body: string
          created_at: string
          cta_label: string
          highlighted: boolean
          id: string
          image_url: string | null
          link: string
          published: boolean
          sort_order: number
          tag: string
          title: string
        }
        Insert: {
          body?: string
          created_at?: string
          cta_label?: string
          highlighted?: boolean
          id?: string
          image_url?: string | null
          link?: string
          published?: boolean
          sort_order?: number
          tag?: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          cta_label?: string
          highlighted?: boolean
          id?: string
          image_url?: string | null
          link?: string
          published?: boolean
          sort_order?: number
          tag?: string
          title?: string
        }
        Relationships: []
      }
      judges: {
        Row: {
          bio: string
          created_at: string
          id: string
          image_url: string | null
          name: string
          organisation: string
          published: boolean
          sort_order: number
          title: string
        }
        Insert: {
          bio?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          organisation?: string
          published?: boolean
          sort_order?: number
          title?: string
        }
        Update: {
          bio?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          organisation?: string
          published?: boolean
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      magazine_issues: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string
          digital_url: string | null
          id: string
          is_current: boolean
          issue_label: string
          published: boolean
          sort_order: number
          title: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string
          digital_url?: string | null
          id?: string
          is_current?: boolean
          issue_label: string
          published?: boolean
          sort_order?: number
          title: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string
          digital_url?: string | null
          id?: string
          is_current?: boolean
          issue_label?: string
          published?: boolean
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      magazine_stories: {
        Row: {
          body: string
          created_at: string
          excerpt: string
          id: string
          image_url: string | null
          is_lead: boolean
          issue_id: string | null
          published: boolean
          slug: string
          sort_order: number
          tag: string
          title: string
        }
        Insert: {
          body?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          is_lead?: boolean
          issue_id?: string | null
          published?: boolean
          slug: string
          sort_order?: number
          tag?: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          is_lead?: boolean
          issue_id?: string | null
          published?: boolean
          slug?: string
          sort_order?: number
          tag?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "magazine_stories_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "magazine_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_applications: {
        Row: {
          admin_note: string
          country: string
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          organisation: string
          phone: string
          status: string
          tier: string
          user_id: string | null
        }
        Insert: {
          admin_note?: string
          country?: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string
          organisation?: string
          phone?: string
          status?: string
          tier: string
          user_id?: string | null
        }
        Update: {
          admin_note?: string
          country?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          organisation?: string
          phone?: string
          status?: string
          tier?: string
          user_id?: string | null
        }
        Relationships: []
      }
      membership_tiers: {
        Row: {
          audience: string
          created_at: string
          currency: string
          featured: boolean
          id: string
          name: string
          perks: string[]
          price: number
          published: boolean
          sort_order: number
        }
        Insert: {
          audience?: string
          created_at?: string
          currency?: string
          featured?: boolean
          id?: string
          name: string
          perks?: string[]
          price?: number
          published?: boolean
          sort_order?: number
        }
        Update: {
          audience?: string
          created_at?: string
          currency?: string
          featured?: boolean
          id?: string
          name?: string
          perks?: string[]
          price?: number
          published?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      nav_links: {
        Row: {
          active: boolean
          created_at: string
          id: string
          label: string
          sort_order: number
          url: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          label: string
          sort_order?: number
          url: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          label?: string
          sort_order?: number
          url?: string
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          author: string
          body: string
          created_at: string
          excerpt: string
          featured: boolean
          id: string
          image_url: string | null
          published: boolean
          published_at: string
          read_time: string
          slug: string
          tag: string
          title: string
        }
        Insert: {
          author?: string
          body?: string
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          read_time?: string
          slug: string
          tag?: string
          title: string
        }
        Update: {
          author?: string
          body?: string
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          read_time?: string
          slug?: string
          tag?: string
          title?: string
        }
        Relationships: []
      }
      nomination_details: {
        Row: {
          created_at: string
          id: string
          nominator_email: string
          nominator_name: string
          nominator_phone: string
          nominee_id: string
          reason: string
          submitted_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          nominator_email: string
          nominator_name?: string
          nominator_phone?: string
          nominee_id: string
          reason?: string
          submitted_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nominator_email?: string
          nominator_name?: string
          nominator_phone?: string
          nominee_id?: string
          reason?: string
          submitted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nomination_details_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      nominees: {
        Row: {
          category_id: string
          citation: string
          company: string
          created_at: string
          id: string
          image_url: string | null
          name: string
          status: string
          submitted_by: string | null
          vote_count: number
        }
        Insert: {
          category_id: string
          citation?: string
          company?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          status?: string
          submitted_by?: string | null
          vote_count?: number
        }
        Update: {
          category_id?: string
          citation?: string
          company?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          status?: string
          submitted_by?: string | null
          vote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "nominees_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "award_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          accent: string
          created_at: string
          id: string
          logo_url: string | null
          mark: string
          name: string
          published: boolean
          sort_order: number
          website: string | null
        }
        Insert: {
          accent?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          mark?: string
          name: string
          published?: boolean
          sort_order?: number
          website?: string | null
        }
        Update: {
          accent?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          mark?: string
          name?: string
          published?: boolean
          sort_order?: number
          website?: string | null
        }
        Relationships: []
      }
      people_profiles: {
        Row: {
          bio: string
          body: string
          city: string
          created_at: string
          id: string
          image_url: string | null
          name: string
          published: boolean
          quote: string
          role: string
          slug: string
          sort_order: number
        }
        Insert: {
          bio?: string
          body?: string
          city?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          published?: boolean
          quote?: string
          role?: string
          slug: string
          sort_order?: number
        }
        Update: {
          bio?: string
          body?: string
          city?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          published?: boolean
          quote?: string
          role?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          organisation: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          organisation?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          organisation?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      programme_registrations: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          programme_id: string | null
          programme_title: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string
          programme_id?: string | null
          programme_title?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          programme_id?: string | null
          programme_title?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programme_registrations_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
        ]
      }
      programmes: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          description: string
          duration: string
          id: string
          mode: string
          price: number
          sort_order: number
          starts_on: string | null
          title: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          description?: string
          duration?: string
          id?: string
          mode?: string
          price?: number
          sort_order?: number
          starts_on?: string | null
          title: string
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          description?: string
          duration?: string
          id?: string
          mode?: string
          price?: number
          sort_order?: number
          starts_on?: string | null
          title?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          email: string
          format: string
          full_name: string
          id: string
          source: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          format?: string
          full_name?: string
          id?: string
          source?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          format?: string
          full_name?: string
          id?: string
          source?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ticket_orders: {
        Row: {
          company: string
          created_at: string
          email: string
          full_name: string
          id: string
          package_id: string | null
          package_name: string
          phone: string
          quantity: number
          status: string
          user_id: string | null
        }
        Insert: {
          company?: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          package_id?: string | null
          package_name?: string
          phone?: string
          quantity?: number
          status?: string
          user_id?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          package_id?: string | null
          package_name?: string
          phone?: string
          quantity?: number
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_orders_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "ticket_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_packages: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          description: string
          featured: boolean
          id: string
          name: string
          perks: string[]
          price: number
          seats: number
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          description?: string
          featured?: boolean
          id?: string
          name: string
          perks?: string[]
          price?: number
          seats?: number
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          description?: string
          featured?: boolean
          id?: string
          name?: string
          perks?: string[]
          price?: number
          seats?: number
          sort_order?: number
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
      votes: {
        Row: {
          category_id: string
          created_at: string
          id: string
          nominee_id: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          nominee_id: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          nominee_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "award_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cast_vote: { Args: { _nominee_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      submit_nomination: {
        Args: {
          _category_id: string
          _company: string
          _email: string
          _name: string
          _nominator_name: string
          _phone: string
          _reason: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "member"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "member"],
    },
  },
} as const
