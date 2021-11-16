import { useSelector } from "react-redux";
import { UserState } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";

interface IUserProps {
  token: null | undefined;
  user: UserState | undefined;
}

export const useAppUser = (): IUserProps => {
  const { token, user } = useSelector<RootState>(
    (state) => state
  ) as Partial<RootState>;
  return { token: token?.value, user };
};
