import axios from "axios";
import { supabase } from "../lib/supabase/supabase";
import {
  ICategory,
  TCredential,
  TEditedCredential,
  TLogin,
  TPostScore,
} from "../ts/types";

export async function postUser(user: TCredential) {
  const { email, password, firstName, lastName, captchaToken } = user;

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        captchaToken,
      },
    });

    if (error) {
      console.error("Signup Error: ", error.message);
      throw new Error(error.message);
    }

    const { error: insertError } = await supabase.from("users").insert({
      id: data?.user?.id,
      first_name: firstName,
      last_name: lastName,
      email: email,
    });

    if (insertError) {
      console.error("Database Insert Error:", insertError.message);
      throw new Error(insertError.message);
    }

    return data;
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error("Something went wrong during signup. Please try again.");
  }
}

export async function getUser() {
  try {
    const response = await supabase.auth.getUser();
    return response.data.user;
  } catch (error) {
    console.error(error);
  }
}

export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error({ msg: "Error", error });
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error("Something went wrong during logout. Please try again.");
  }
}

export async function loginUser(user: TLogin) {
  const { email, password, captchaToken } = user;

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
      options: {
        captchaToken,
      },
    });

    if (error) {
      console.error({ msg: "Error", error });
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error("Something went wrong during login. Please try again.");
  }
}

export async function editUser(user: TEditedCredential) {
  const { first_name, last_name, email, auth_user_id, param_user_id } = user;

  if (auth_user_id !== param_user_id) {
    console.log("What are you doing bruh 😅");
    throw new Error("Unauthorized");
  }

  try {
    const [authResult, dbResult] = await Promise.all([
      supabase.auth.updateUser({
        email: email,
        data: {
          first_name: first_name,
          last_name: last_name,
        },
      }),
      supabase
        .from("users")
        .update({
          email: email,
          first_name: first_name,
          last_name: last_name,
        })
        .eq("id", auth_user_id),
    ]);

    if (authResult.error || dbResult.error) {
      console.error("Error updating user:", {
        authError: authResult.error,
        dbError: dbResult.error,
      });
      throw new Error(authResult.error?.message || dbResult.error?.message);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error(
      "Something went wrong while editing credentials. Please try again."
    );
  }
}

export async function getDictionary(word: string) {
  console.log(word);

  try {
    const { data } = await axios.get(
      ` https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    return data[0];
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error(
      "Something went wrong during edited credentials. Please try again."
    );
  }
}

export async function postScore(data: TPostScore) {
  const { games_id, user_id, score } = data;

  if (!games_id || !user_id || !score) {
    throw Error("Error, the data isn't available");
  }

  try {
    const { error } = await supabase.from("leaderboard_user_score").insert({
      games_id: games_id,
      user_id: user_id,
      score: score,
    });

    if (error) {
      console.error({ msg: "Error", error });
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error(
      "Something went wrong during posting score. Please try again."
    );
  }
}

export async function postCategory(data: ICategory) {
  const { user_id, category_name } = data;

  if (!user_id || !category_name) {
    throw Error("Error, the data isn't available");
  }

  try {
    const { error } = await supabase.from("category").insert({
      user_id: user_id,
      category_name: category_name,
    });
    if (error) {
      console.error({ msg: "Error", error });
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error(
      "Something went wrong during posting score. Please try again."
    );
  }
}

export async function postVocabulary(data: any) {
  const { category_id, vocab, def } = data;

  try {
    const { error } = await supabase.from("vocabulary").insert({
      category_id: category_id,
      vocab: vocab,
      def: def,
    });
    if (error) {
      console.error({ msg: "Error", error });
    }

    return data;
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error(
      "Something went wrong during posting vocabulary. Please try again."
    );
  }
}

export async function getAllScore() {
  try {
    const { data, error } = await supabase
      .from("leaderboard_user_score")
      .select("*, users(first_name, last_name)")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error({ msg: "Error", error });
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error(
      "Something went wrong during posting score. Please try again."
    );
  }
}

export async function getUsersCount() {
  try {
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact" });

    if (error) {
      console.error({ msg: "Error", error });
      throw new Error(error.message);
    }

    return count;
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error(
      "Something went wrong during posting score. Please try again."
    );
  }
}

export async function getGameLeaderboard(games_id: number) {
  try {
    const { data, error } = await supabase
      .from("unique_leaderboard")
      .select("*, users(first_name, last_name)")
      .eq("games_id", games_id)
      .order("score", { ascending: false });

    if (error) {
      console.error({ msg: "Error", error });
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error(
      "Something went wrong during posting score. Please try again."
    );
  }
}

export async function getUsersCategory({ user_id }: { user_id: any }) {
  try {
    const { data, error } = await supabase
      .from("category")
      .select("*, vocabulary(*)")
      .eq("user_id", user_id);

    if (error) {
      console.error({ msg: "Error", error });
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error(
      "Something went wrong during getting category. Please try again."
    );
  }
}

export async function getGameModeRanking(games_id: number) {
  try {
    const { data, error } = await supabase
      .from("game_mode_ranking")
      .select(
        "games_id, user_id, total_score, rank, users(first_name, last_name)"
      )
      .eq("games_id", games_id)
      .order("rank", { ascending: true });

    if (error) {
      console.error({ msg: "Error", error });
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error("Something went wrong while fetching game mode ranking.");
  }
}

export async function getGlobalRanking() {
  try {
    const { data, error } = await supabase
      .from("global_ranking")
      .select("user_id, total_score, global_rank, ...users(first_name, last_name)")
      .order("global_rank", { ascending: true })
      .limit(50);

    if (error) {
      console.error({ msg: "Error", error });
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error("Something went wrong while fetching global ranking.");
  }
}

export async function getUserProfile(user_id: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `*, 
        leaderboard_user_score(*), 
        global_ranking(global_rank, total_score)`
      )
      .eq("id", user_id)
      .order("timestamp", {
        referencedTable: "leaderboard_user_score",
        ascending: false,
      })
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      throw new Error(error.message);
    }

    return {
      user: data ?? null,
      scores: data?.leaderboard_user_score ?? [],
      ranking: data?.global_ranking ?? {
        global_rank: "Unranked",
        total_score: 0,
      },
    };
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error("Something went wrong while fetching user profile.");
  }
}

export async function deleteCategory(category_id: string) {
  try {
    const { error } = await supabase
      .from("category")
      .delete()
      .eq("category_id", category_id);

    if (error) {
      console.error("Error deleting category:", error);
      throw new Error(error.message);
    }

    return;
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error("Something went wrong while deleting this category.");
  }
}

export async function deleteVocabulary(id: any) {
  try {
    const { error } = await supabase.from("vocabulary").delete().eq("id", id);

    if (error) {
      console.error("Error deleting vocabulary:", error);
      throw new Error(error.message);
    }

    return;
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw new Error("Something went wrong while deleting this vocabulary.");
  }
}
