// components/categories/EditCategoryDialog.jsx
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function EditCategoryDialog({
  open,
  onClose,
  category,
  compId,
  token,
  refresh,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      info: "",
    },
  });

  // Load category data when dialog opens
  useEffect(() => {
    if (category) {
      reset({
        name: category.name || "",
        info: category.info || "",
      });
    }
  }, [category, reset]);

  const onSubmit = async (data) => {
    try {
      await fetch(`https://oms.wilerhub.com/api/menucat/${category.id}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          compId: compId,
          id: category.id,
          pos: category.pos,
          ...data,
        }),
      });

      refresh();
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
            Edit Category
          </AlertDialog.Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* CATEGORY NAME */}
            <label className="block text-sm font-medium mb-1">
              Category Name
            </label>
            <input
              className="w-full border px-3 py-2 rounded"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mb-2">Name is required</p>
            )}

            {/* DESCRIPTION */}
            <label className="block text-sm font-medium mt-3 mb-1">
              Description
            </label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              rows={3}
              {...register("info")}
            ></textarea>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end mt-6 space-x-3">
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
