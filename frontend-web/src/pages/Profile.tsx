import { useQuery } from "@apollo/client";
import { appErrorVar } from "../store/store";
import { ME_QUERY } from "../utils/queries";
import { MeQuery } from "../__generated__/MeQuery";

const Profile = () => {
  const { data, error, loading } = useQuery<MeQuery>(ME_QUERY);

  if (error) {
    appErrorVar(error?.message);
  }

  if (!data || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl font-medium tracking-wide">Loading...</span>
      </div>
    );
  }

  return <div>{data?.me.toString()}</div>;
};

export default Profile;
