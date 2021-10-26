import React from "react";

interface IAppButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

const AppButton: React.FC<IAppButtonProps> = ({
  actionText,
  loading,
  canClick,
}) => {
  return (
    <button
      className={`mt-3 p-3 text-lg font-normal text-white transition duration-200 ease-in-out ${
        canClick
          ? "bg-lime-600 hover:bg-lime-700"
          : "bg-gray-300 pointer-events-none"
      } `}
      type="submit"
    >
      {loading ? "loading..." : actionText}
    </button>
  );
};

export default AppButton;
