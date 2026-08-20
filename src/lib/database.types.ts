// GEGENEREERD BESTAND — niet met de hand aanpassen.
// Opnieuw genereren na een migratie: `pnpm db:types` (met `pnpm db:start` actief).
// De CI controleert of dit bestand nog klopt bij het schema; zie scripts/check-types-in-sync.mjs.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      items: {
        Row: {
          created_at: string;
          id: string;
          owner_id: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner_id: string;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string;
          title?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
