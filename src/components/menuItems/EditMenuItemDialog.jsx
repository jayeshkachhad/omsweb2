// components/categories/EditCategoryDialog.jsx
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";

export default function EditMenuItemDialog({
  open,
  onClose,
  menu,

  token,
  refresh,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const baseId = useId();
  const itemNameId = `${baseId}-itemName`;
  const itemPriceId = `${baseId}-itemPrice`;
  const foodTypeId = `${baseId}-foodType`;
  const descriptionId = `${baseId}-description`;

  useEffect(() => {
    if (menu) {
      reset({
        itemName: menu.name || "",
        itemPrice: menu.price || "",
        foodType: menu.type || "1",
        itemDescription: menu.itemDescription || "",
      });
    }
  }, [menu, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = [
        {
          catid: menu.catid,
          compid: menu.compid,
          id: menu.id,
          name: data.itemName,
          info: data.itemDescription,
          price: data.itemPrice,
          type: data.foodType,
          pos: menu.pos,
        },
      ];

      console.log("Edit payload ->", payload);

      const response = await fetch("https://oms.wilerhub.com/api/menuitems/1", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Edit response ->", response.status, result);

      if (!response.ok) {
        alert("Update failed: " + (result?.message || JSON.stringify(result)));
        return;
      }

      refresh();
      onClose();
    } catch (err) {
      console.log(err);
      alert("Network error: " + err.message);
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={onClose}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />

        <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-full max-w-md">
          <AlertDialog.Title className="text-lg font-bold mb-4">
            Edit Menu Item
          </AlertDialog.Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Item Name */}
            <label
              htmlFor={itemNameId}
              className="block text-sm font-medium mb-1"
            >
              Item Name
            </label>
            <input
              id={itemNameId}
              type="text"
              {...register("itemName", { required: "Name required" })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.itemName && (
              <p className="text-red-500 text-xs">{errors.itemName.message}</p>
            )}

            {/* Item Price */}
            <label
              htmlFor={itemPriceId}
              className="block text-sm font-medium mb-1 mt-4"
            >
              Item Price
            </label>
            <input
              id={itemPriceId}
              type="number"
              {...register("itemPrice", { required: "Price required" })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.itemPrice && (
              <p className="text-red-500 text-xs">{errors.itemPrice.message}</p>
            )}

            {/* Food Type Dropdown */}
            <label
              htmlFor={foodTypeId}
              className="block text-sm font-medium mb-1 mt-4"
            >
              Food Type
            </label>
            <select
              id={foodTypeId}
              {...register("foodType", { required: "Type required" })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="1">Veg</option>
              <option value="2">Non-Veg</option>
              <option value="3">Egg Only</option>
            </select>
            {errors.foodType && (
              <p className="text-red-500 text-xs">{errors.foodType.message}</p>
            )}

            {/* Description */}
            <label
              htmlFor={descriptionId}
              className="block text-sm font-medium mb-1 mt-4"
            >
              Description
            </label>
            <input
              id={descriptionId}
              type="text"
              {...register("itemDescription")}
              className="w-full border px-3 py-2 rounded"
            />

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 border rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
