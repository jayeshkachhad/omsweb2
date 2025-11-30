// components/menuItems/MenuItems.jsx
import { memo } from "react";
import MenuItem from "./MenuItem";

const MenuItemsList = memo(({ menus, onEdit, onDelete }) => {
  return (
    <div className="space-y-3 grid grid-cols-2 gap-5">
      {menus.map((menu) => (
        <MenuItem
          key={menu.id}
          menu={menu}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});

MenuItemsList.displayName = "MenuItemsList";

export default MenuItemsList;
