import { supabase } from "./supabaseClient";

export async function getAdminAccess() {
  const { data: authData, error: authError } =
    await supabase.auth.getUser();

  if (authError) {
    if (
      authError.name === "AuthSessionMissingError" ||
      authError.status === 401
    ) {
      return { status: "signedOut", userId: null };
    }

    throw authError;
  }

  const user = authData.user;

  if (!user) {
    return { status: "signedOut", userId: null };
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return {
    status: data?.user_id === user.id ? "allowed" : "denied",
    userId: user.id,
  };
}
