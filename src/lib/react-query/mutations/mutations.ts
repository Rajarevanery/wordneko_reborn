import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ICategory,
  TCredential,
  TEditedCredential,
  TLogin,
  TPostScore,
} from "../../../ts/types";
import {
  deleteCategory,
  deleteVocabulary,
  editUser,
  getAllScore,
  getDictionary,
  getGameLeaderboard,
  getGlobalRanking,
  getUserProfile,
  getUsersCategory,
  loginUser,
  logoutUser,
  postCategory,
  postScore,
  postUser,
  postVocabulary,
} from "../../../api/api";

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: TCredential) => postUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_user"],
      });
    },
  });
};

export const useLogoutUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_user"],
      });
    },
  });
};

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: TLogin) => loginUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_user"],
      });
    },
  });
};

export const useEditUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: TEditedCredential) => editUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_user"],
      });
    },
  });
};

export const useGetDictionary = () => {
  return useMutation({
    mutationFn: (word: string) => getDictionary(word),
  });
};

export const usePostScore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TPostScore) => postScore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_all_score"],
      });
    },
  });
};

export const usePostCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICategory) => postCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_category_information"],
      });
    },
  });
};

export const usePostVocabulary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => postVocabulary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_category_information"],
      });
    },
  });
};

export const useGetUserCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => getUsersCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_category"],
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category_id: string) => deleteCategory(category_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_category_information"],
      });
    },
  });
};

export const useDeleteVocabulary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: any) => deleteVocabulary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_category_information"],
      });
    },
  });
};

export const useGetAllScores = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => getAllScore(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_all_score"],
      });
    },
  });
};

export const useGetSpecificGameScore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (games_id: number) => getGameLeaderboard(games_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_all_score"],
      });
    },
  });
};

export const useGetGlobalRanking = () => {
  return useMutation({
    mutationFn: () => getGlobalRanking(),
  });
};

export const useGetUserProfile = () => {
  return useMutation({
    mutationFn: (user_id: string) => getUserProfile(user_id),
  });
};
