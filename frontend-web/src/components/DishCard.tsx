import { RestaurantQuery_restaurant_restaurant_menu_options } from "../__generated__/RestaurantQuery";

interface IDishCardProps {
  id?: number;
  desc: string;
  name: string;
  price: number;
  photo?: string;
  isCustomer?: boolean;
  orderStarted?: boolean;
  isSelected?: boolean;
  options?: RestaurantQuery_restaurant_restaurant_menu_options[] | null;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
}

const DishCard: React.FC<IDishCardProps> = ({
  id = 0,
  desc,
  name,
  price,
  photo,
  isCustomer = false,
  orderStarted = false,
  options,
  isSelected,
  addItemToOrder,
  removeFromOrder,
  children: dishOptions,
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };

  return (
    <div
      className={`px-5 py-4 border-2 cursor-pointer transition-all select-none ${
        isSelected ? "ring-2 ring-lime-400 shadow-md" : " hover:border-gray-400"
      }`}
    >
      <div className="flex items-center">
        <div
          className="w-24 h-24 mr-3 bg-center bg-cover rounded-md"
          style={{ backgroundImage: `url(${photo})` }}
        ></div>
        <div className="ml-4 right">
          <h3 className="flex items-center text-lg font-medium">
            {name}
            {orderStarted && (
              <button
                className={`ml-3 py-1 px-3 focus:outline-none text-sm  text-white w-20 ${
                  isSelected ? "bg-red-500" : " bg-lime-600"
                }`}
                onClick={onClick}
              >
                {isSelected ? "Remove" : "Add"}
              </button>
            )}
          </h3>
          <h4 className="mb-3 font-normal text-gray-600">
            {desc.length > 35 ? `${desc.substring(0, 35)}...` : desc}
          </h4>
          <span className="font-bold">${price}</span>
          {isCustomer && options && options?.length !== 0 && (
            <div>
              <h5 className="mt-4 mb-3 font-medium">Dish Options:</h5>
              <div className="grid justify-start gap-2">{dishOptions}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishCard;
