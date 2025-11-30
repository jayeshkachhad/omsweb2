import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useState } from "react";

export default function Variants({ variantsData, token, menu, onClose }) {
  const [open, setOpen] = useState(true);
  const [variants, setVariants] = useState(
    variantsData?.map((v) => ({
      id: v.id,
      varname: v.varname,
      varprice: v.varprice,
      catid: v.catid,
      compid: v.compid,
      itemid: v.itemid,
    })) || []
  );

  const handleCloseDialog = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen && onClose) {
      onClose();
    }
  };

  const addNewVariant = () => {
    const newVariant = {
      varname: "",
      varprice: "",
      varinfo: "Manually Variant Created",
      catid: menu?.catid,
      compid: menu?.compid,
      itemid: menu?.id,
    };
    setVariants([...variants, newVariant]);
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const deleteVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const invalidVariants = variants.filter(
      (v) => !v.varname.trim() || !v.varprice
    );
    if (invalidVariants.length > 0) {
      return;
    }

    try {
      const payload = variants.map((v) => ({
        catid: v.catid,
        compid: v.compid,
        itemid: v.itemid,
        varinfo: "Manually Variant Created",
        varname: v.varname,
        varprice: v.varprice,
      }));

      console.log("Submitting variants:", payload);

      const response = await fetch(
        "https://oms.wilerhub.com/api/variants/bulk",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.log(
          "Update failed: " + (result?.message || JSON.stringify(result))
        );
        return;
      }

      if (onClose) onClose();
      setOpen(false);
    } catch (err) {
      console.error("Error saving variants:", err);
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={handleCloseDialog}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => handleCloseDialog(false)}
        />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg w-full max-w-2xl max-h-[85vh] overflow-hidden z-50 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <AlertDialog.Title className="text-2xl font-bold text-gray-900">
              Variants
            </AlertDialog.Title>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div
                  key={variant.id || index}
                  className="flex items-center gap-4"
                >
                  <input
                    type="text"
                    value={variant.varname}
                    onChange={(e) =>
                      updateVariant(index, "varname", e.target.value)
                    }
                    placeholder="Name"
                    className="flex-1 px-4 py-3 border-b-2 border-gray-300 focus:border-teal-600 focus:outline-none text-lg"
                  />
                  <input
                    type="number"
                    value={variant.varprice}
                    onChange={(e) =>
                      updateVariant(index, "varprice", e.target.value)
                    }
                    placeholder="Price"
                    className="flex-1 px-4 py-3 border-b-2 border-gray-300 focus:border-teal-600 focus:outline-none text-lg"
                  />
                  <button
                    onClick={() => deleteVariant(index)}
                    className="p-3 hover:bg-gray-100 rounded-lg transition"
                    aria-label="Delete variant"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600"
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
              ))}

              {variants.length === 0 && (
                <p className="text-gray-500 text-center py-8 italic">
                  No variants yet. Click the + button to add one.
                </p>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-center gap-4">
            <button
              onClick={addNewVariant}
              className="px-8 py-4 bg-teal-700 text-white rounded-full hover:bg-teal-800 transition flex items-center justify-center text-xl font-bold"
              aria-label="Add variant"
            >
              Add +
            </button>
            <button
              onClick={handleSubmit}
              className="px-12 py-4 bg-teal-700 text-white rounded-full hover:bg-teal-800 transition text-lg font-semibold"
            >
              Submit
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
