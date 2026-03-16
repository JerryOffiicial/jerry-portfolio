export interface Database {
  public: {
    Tables: {
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          category: string;
          overview: string;
          stack: string[];
          live_url: string;
          github_url: string;
          images: string[];
          year: string;
          accent_color: string;
          bg_classes: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          overview: string;
          stack?: string[];
          live_url?: string;
          github_url?: string;
          images?: string[];
          year?: string;
          accent_color?: string;
          bg_classes?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          overview?: string;
          stack?: string[];
          live_url?: string;
          github_url?: string;
          images?: string[];
          year?: string;
          accent_color?: string;
          bg_classes?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      blogs: {
        Row: {
          id: string;
          title: string;
          excerpt: string;
          content: string;
          category: string;
          date: string;
          creator: string;
          image_url: string;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          excerpt: string;
          content: string;
          category?: string;
          date?: string;
          creator?: string;
          image_url?: string;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          category?: string;
          date?: string;
          creator?: string;
          image_url?: string;
          tags?: string[];
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          name: string;
          role: string;
          avatar_url: string;
          rating: number;
          message: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role?: string;
          avatar_url?: string;
          rating: number;
          message: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          avatar_url?: string;
          rating?: number;
          message?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
      };
    };
  };
}

// Convenience type aliases
export type FAQ = Database['public']['Tables']['faqs']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Blog = Database['public']['Tables']['blogs']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
