// components/MenuItems/MenuItem.jsx
import { memo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuthStore } from "../../store/useAuthStore";
import Variants from "./Variants";

const MenuItem = memo(({ menu, onEdit, onDelete }) => {
  const [variants, setVariants] = useState([]);
  const [showVariants, setShowVariants] = useState(false);
  const { token } = useAuthStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: menu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const fetchMenuVariants = async () => {
    try {
      const res = await fetch(
        `https://oms.wilerhub.com/api/getitemvars?compid=${menu.compid}&catid=${menu.catid}&itemid=${menu.id}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setVariants(data);
      setShowVariants(true);
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  const handleCloseVariants = () => {
    setShowVariants(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between p-4 bg-white border-2 border-gray-900 rounded-lg"
      >
        <div className="flex items-center space-x- flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-700 p-1 touch-none"
            aria-label="Drag to reorder"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </button>

          <span className="text-lg font-medium text-gray-900">
            {menu.name} @ {menu.price}
          </span>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            className="p-1 hover:bg-gray-100 rounded-full transition m-0"
            onClick={fetchMenuVariants}
            title="Manage variants"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <button
            onClick={() => onEdit(menu)}
            className="p-1 hover:bg-gray-100 rounded-full transition m-0"
            aria-label="Edit menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={() => onDelete(menu)}
            className="p-1 hover:bg-red-50 rounded-full transition m-0"
            aria-label="Delete menu"
          >
            <svg
              className="w-6 h-6 text-gray-700 hover:text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {showVariants && (
        <Variants
          variantsData={variants}
          token={token}
          menu={menu}
          onClose={handleCloseVariants}
        />
      )}
    </>
  );
});

MenuItem.displayName = "MenuItem";

export default MenuItem;
