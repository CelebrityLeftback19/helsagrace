import { createClient } from "@supabase/supabase-js";

import { CONTACT_MESSAGES_TABLE } from "@/lib/cms";
import { isSupabaseConfigured, supabasePublicKey, supabaseUrl } from "@/lib/supabase/env";

export type ContactMessageInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  emailed?: boolean;
};

/**
 * Stores a contact submission using the public key. RLS allows anonymous
 * inserts on this table only; reading is restricted to owners.
 */
export async function saveContactMessage(input: ContactMessageInput): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createClient(supabaseUrl()!, supabasePublicKey()!, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from(CONTACT_MESSAGES_TABLE).insert({
      name: input.name,
      email: input.email,
      subject: input.subject || null,
      message: input.message,
      emailed: input.emailed ?? false,
    });

    if (error) {
      console.error("saveContactMessage failed:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("saveContactMessage threw:", error);
    return false;
  }
}
