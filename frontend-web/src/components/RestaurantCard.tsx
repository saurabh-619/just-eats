import React from "react";
import { Link } from "react-router-dom";

interface IRestaurantCardProps {
  id?: string;
  coverImg?: string;
  name?: string;
  categoryName?: string;
}

const RestaurantCard: React.FC<IRestaurantCardProps> = ({
  id,
  coverImg,
  name,
  categoryName,
}) => {
  return (
    <Link to={`/restaurants/${id}`}>
      <div className="flex flex-col">
        <div
          className="bg-red-500 bg-center bg-cover py-28"
          style={{ backgroundImage: `url(${coverImg})` }}
        ></div>
        <h3 className="mt-2 text-xl">{name}</h3>
        <span className="py-2 mt-2 text-sm border-t border-gray-400 border-opacity-20">
          {categoryName}
        </span>
      </div>
    </Link>
  );
};

export default RestaurantCard;
