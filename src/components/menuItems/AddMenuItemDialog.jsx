// components/categories/AddMenuItemDialog.jsx

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useForm } from "react-hook-form";

export default function AddMenuItemDialog({
  open,
  onClose,
  compId,
  token,
  refresh,
  categoryId,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await fetch("https://oms.wilerhub.com/api/menuitems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          catid: categoryId,
          compid: compId,
          name: data.itemName,
          info: data.itemDescription,
          price: data.itemPrice,
          type: data.foodType,
        }),
      });

      refresh();
      reset();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={onClose}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-full max-w-md">
          <AlertDialog.Title className="text-lg font-bold mb-4">
            Add Menu Item
          </AlertDialog.Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Item Name */}
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <input
              type="text"
              {...register("itemName", { required: "Name required" })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.itemName && (
              <p className="text-red-500 text-xs">{errors.itemName.message}</p>
            )}

            {/* Item Price */}
            <label className="block text-sm font-medium mb-1 mt-4">
              Item Price
            </label>
            <input
              type="number"
              {...register("itemPrice", { required: "Price required" })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.itemPrice && (
              <p className="text-red-500 text-xs">{errors.itemPrice.message}</p>
            )}

            {/* Food Type Dropdown */}
            <label className="block text-sm font-medium mb-1 mt-4">
              Food Type
            </label>
            <select
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
            <label className="block text-sm font-medium mb-1 mt-4">
              Description
            </label>
            <input
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
                Add
              </button>
            </div>
          </form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
