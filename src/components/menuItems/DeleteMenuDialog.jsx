// components/categories/DeleteMenuDialog.jsx

import * as AlertDialog from "@radix-ui/react-alert-dialog";

export default function DeleteMenuDialog({
  open,
  onClose,
  menu,
  token,
  refresh,
}) {
  if (!menu) return null;

  const handleDelete = async () => {
    try {
      await fetch(`https://oms.wilerhub.com/api/menuitems/${menu.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          <AlertDialog.Title className="text-lg font-bold mb-2">
            Delete menu
          </AlertDialog.Title>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>{menu.name}</strong>?
          </p>

          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 border rounded" onClick={onClose}>
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
