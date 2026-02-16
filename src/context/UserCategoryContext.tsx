import {
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useAuthContext } from "./AuthContext";
import { useGetCategoryInformation } from "../lib/react-query/queries/queries";

export const UserCategoryContext = createContext<any>(null);

export const useUserCategory = () => {
  const { user_id } = useAuthContext();
  // const [data, setData] = useState<any[]>([]);

  const { data } = useGetCategoryInformation({ user_id: user_id });


  // console.log(isSuccess)

  // useEffect(() => {
  //   const GetCategory = async () => {
  //     if (!user_id) return;

  //     try {
  //       console.log("runned");
  //       const response = await getUsersCategory({
  //         user_id: user_id,
  //       });
  //       setData(response);
  //     } catch (error) {
  //       console.error("Error fetching user category:", error);
  //     }
  //   };

  //   GetCategory();
  // }, [user_id]);

  return { data };
};

export const UserCategoryProvider = ({ children }: { children: ReactNode }) => {
  const category = useUserCategory();

  return (
    <UserCategoryContext.Provider value={category}>
      {children}
    </UserCategoryContext.Provider>
  );
};

export const useUserCategoryContext = () => {
  const context = useContext(UserCategoryContext);
  if (!context) {
    throw new Error("Error bruh");
  }
  return context;
};
