// components/categories/AddCategoryDialog.jsx

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useForm } from "react-hook-form";

export default function AddCategoryDialog({
  open,
  onClose,
  compId,
  token,
  refresh,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await fetch("https://oms.wilerhub.com/api/menucat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          compid: compId,
          name: data.categoryName,
          info: data.categoryDescription,
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
            Add Menu Category
          </AlertDialog.Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-sm font-medium mb-1">
              Category Name
            </label>
            <input
              type="text"
              {...register("categoryName", { required: "Name required" })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.categoryName && (
              <p className="text-red-500 text-xs">
                {errors.categoryName.message}
              </p>
            )}

            <label className="block text-sm font-medium mb-1 mt-4">
              Description
            </label>
            <input
              type="text"
              {...register("categoryDescription")}
              className="w-full border px-3 py-2 rounded"
            />

            <div className="flex justify-end space-x-3 mt-6">
              <button className="px-4 py-2 border rounded" onClick={onClose}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-black text-white rounded">
                Add
              </button>
            </div>
          </form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
