import { useQuery } from "@tanstack/react-query";
import {
  getAllScore,
  getUser,
  getUsersCategory,
  getUsersCount,
} from "../../../api/api";

export const useGetLoginUser = () => {
  return useQuery({
    queryKey: ["get_user"],
    queryFn: async () => await getUser(),
  });
};

export const useInitiateGetAllScore = () => {
  return useQuery({
    queryKey: ["get_all_score"],
    queryFn: async () => await getAllScore(),
  });
};

export const useGetUsersCount = () => {
  return useQuery({
    queryKey: ["get_user_count"],
    queryFn: async () => await getUsersCount(),
  });
};


// ! simplified
// export const useGetCategoryInformation = ({ user_id }: { user_id: any }) => {
//   return useQuery({
//     queryKey: ["get_category_information"],
//     queryFn: async () => await getUsersCategory({user_id}),
//   });
// };


// ! this will only run IF the user_id is passed in

export const useGetCategoryInformation = ({ user_id }: { user_id: any }) => {
  return useQuery({
    queryKey: ["get_category_information", user_id], 
    queryFn: async () => {
      if (!user_id) {
        throw new Error("Error bruh, no user_id being passed"); 
      }
      return await getUsersCategory({ user_id });
    },
    enabled: !!user_id, 
  });
};