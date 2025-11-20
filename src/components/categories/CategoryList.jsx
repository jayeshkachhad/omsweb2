// components/categories/CategoryList.jsx
import { memo } from "react";
import CategoryItem from "./CategoryItem";

const CategoryList = memo(({ categories, onEdit, onDelete }) => {
  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});

CategoryList.displayName = "CategoryList";

export default CategoryList;
