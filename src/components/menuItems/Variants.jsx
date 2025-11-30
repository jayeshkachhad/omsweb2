import * as Dialog from "@radix-ui/react-dialog";

import { useState, useMemo } from "react";

export default function Variants({ variantsData = [], token, menu, onClose }) {
  const [open, setOpen] = useState(true);

  const initialVariants = useMemo(
    () =>
      variantsData.map((v) => ({
        catid: v.catid,
        compid: v.compid,
        itemid: v.itemid,
        varname: v.varname,
        varprice: v.varprice,
        varinfo: v.varinfo,
      })),
    [variantsData, menu]
  );

  const [variants, setVariants] = useState(initialVariants);

  const closeDialog = () => {
    setOpen(false);
    onClose?.();
  };

  const updateVariant = (idx, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const addNewVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        catid: menu?.catid,
        compid: menu?.compid,
        itemid: menu?.id,
        varinfo: "Manually Variant Created",
      },
    ]);
  };

  const deleteVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const hasErrors = variants.some(
      (v) => !v.varname.trim() || v.varprice === "" || Number(v.varprice) <= 0
    );

    if (hasErrors) {
      alert("Please fill variant name and price correctly");
      return;
    }

    const payload = variants.map((v) => ({
      catid: v.catid,
      compid: v.compid,
      itemid: v.itemid,
      varinfo: v.varinfo,
      varname: v.varname,
      varprice: v.varprice,
    }));

    try {
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
        console.error("Variant update failed:", result);
        return;
      }

      closeDialog();
    } catch (error) {
      console.error("Saving variants error:", error);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && closeDialog()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />

        <Dialog.Content
          onInteractOutside={closeDialog}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg w-full max-w-2xl max-h-[85vh] overflow-hidden z-50 flex flex-col shadow-xl"
        >
          <div className="p-6 border-b border-gray-200">
            <Dialog.Title className="text-2xl font-bold text-gray-900">
              Variants{" "}
              <span className="text-lg font-medium">({menu?.name})</span>
            </Dialog.Title>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {variants.length > 0 ? (
              variants.map((variant, index) => (
                <div key={index} className="flex items-center gap-3">
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
                    className="p-2 hover:bg-gray-100 rounded-lg"
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
              ))
            ) : (
              <p className="text-gray-500 text-center py-8 italic">
                No variants added yet.
              </p>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-center gap-4">
            <button
              onClick={addNewVariant}
              className="px-8 py-3 bg-teal-700 text-white rounded-full hover:bg-teal-800 font-bold text-lg"
            >
              Add +
            </button>

            <button
              onClick={handleSubmit}
              className="px-12 py-3 bg-teal-700 text-white rounded-full hover:bg-teal-800 font-semibold text-lg"
            >
              Submit
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
