import { UUID } from "crypto"

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          created_at: string
          player_id?: string | null
          id?: string
          name?: string
          object_id?: string
          post_by?: string
          event_id?: string
          team_id?: string
          post_type?: string
          title?: string
          description?: string
          featured_image?: boolean
          thumbnail?: string
          compressed_video?: string
          compressed_gif?: string
          compressed_thumbnail?: string
          mux_asset_id?: string | null;
          mux_playback_id?: string | null;

        }
        Insert: {
          created_at?: string
          player_id?: string | null
          id?: string
          name?: string
          object_id?: string
          post_by?: string
          event_id?: string
          team_id?: string
          post_type?: string
          title?: string
          description?: string
          featured_image?: boolean
          thumbnail?: string
          compressed_video?: string
          compressed_gif?: string
          compressed_thumbnail?: string
          mux_asset_id?: string | null;
          mux_playback_id?: string | null;

        }
        Update: {
          created_at?: string
          player_id?: string | null
          id?: string
          name?: string
          object_id?: string
          post_by?: string
          event_id?: string
          team_id?: string
          post_type?: string
          title?: string
          description?: string
          featured_image?: boolean
          thumbnail?: string
          compressed_video?: string
          compressed_gif?: string
          compressed_thumbnail?: string
          mux_asset_id?: string | null;
          mux_playback_id?: string | null;
          

        }
        Relationships: [
          {
            foreignKeyName: "posts_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_post_by_fkey"
            columns: ["post_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }

      articles: {
        Row: {
          id: number
          content: string | null
          description: string | null
          image: Buffer | null
          image_meta: string | null
          image_url: string | null
          keyword: string | null
          title: string | null
          creator_id: string | null
          modified_date: string | null
          created_date: string
          slug: string | null
          player_mentions: Json | null
        }
        Insert: {
          content?: string | null
          description?: string | null
          image?: Buffer | null
          image_meta?: string | null
          image_url?: string | null
          keyword?: string | null
          title?: string | null
          creator_id?: string | null
          modified_date?: string | null
          slug?: string | null
          player_mentions?: Json | null
        }
        Update: {
          id?: number
          content?: string | null
          description?: string | null
          image?: Buffer | null
          image_meta?: string | null
          image_url?: string | null
          keyword?: string | null
          title?: string | null
          creator_id?: string | null
          modified_date?: string | null
          slug?: string | null
          player_mentions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users" // assuming you have a 'users' table in the 'auth' schema
            referencedColumns: ["id"]
          }
        ]
      }


      playlists: {
        Row: {
          id: number;
          user_id: string; // Change to string instead of UUID
          name: string;
          playlist: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string; // Change to string instead of UUID
          name: string;
          playlist: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string; // Change to string instead of UUID
          name?: string;
          playlist?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "playlists_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users"; // Assuming this is a table in the 'auth' schema
            referencedColumns: ["id"];
          }
        ];
      };
    
      
      profile: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
          image_url: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id: string
          image_url?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
