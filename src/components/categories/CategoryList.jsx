// components/categories/CategoryList.jsx
import CategoryItem from "./CategoryItem";

export default function CategoryList({ categories, onEdit, onDelete }) {
  return (
    <div className="space-y-2">
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
}
