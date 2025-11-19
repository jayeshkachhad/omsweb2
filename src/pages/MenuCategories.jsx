// pages/MenuCategories.jsx

import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import Layout from "../layout/Layout";

import CategoryList from "../components/categories/CategoryList";
import AddCategoryDialog from "../components/categories/AddCategoryDialog";
import EditCategoryDialog from "../components/categories/EditCategoryDialog";
import DeleteCategoryDialog from "../components/categories/DeleteCategoryDialog";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

export default function MenuCategories() {
  const { user, token } = useAuthStore();
  const compId = user?.CompanyData?.id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // ================================
  // Sensors for dnd-kit
  // ================================
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // ================================
  // Fetch Categories
  // ================================
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://oms.wilerhub.com/api/menucat?compid=${compId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (compId && token) fetchCategories();
  }, [compId, token]);

  // ================================
  // Drag End Handler
  // ================================
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);

    setCategories(arrayMove(categories, oldIndex, newIndex));
  };

  // ================================
  // Apply Position API
  // ================================
  const handleApplyPosition = async () => {
    try {
      const payload = categories.map((cat, index) => ({
        id: cat.id,
        position: index + 1,
      }));

      const res = await fetch(
        "https://oms.wilerhub.com/api/menucat/position-update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (data.status === 1) {
        await fetchCategories();
        alert("Position updated successfully!");
      } else {
        alert(data?.message || "Failed to update positions.");
      }
    } catch (err) {
      console.error("Position update failed:", err);
      alert("Position update failed. See console.");
    }
  };

  return (
    <Layout title="Menu Categories" showBackButton={true}>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-gray-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* ================================ */}
          {/* DnD Context for Drag & Drop */}
          {/* ================================ */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={categories.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <CategoryList
                categories={categories}
                onEdit={(cat) => {
                  setCategoryToEdit(cat);
                  setShowEditDialog(true);
                }}
                onDelete={(cat) => {
                  setCategoryToDelete(cat);
                  setShowDeleteDialog(true);
                }}
              />
            </SortableContext>
          </DndContext>

          {/* ================================ */}
          {/* Action Buttons */}
          {/* ================================ */}
          <div className="space-y-3 mt-6">
            <button
              onClick={() => setShowAddDialog(true)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-md"
            >
              Add Menu Category
            </button>

            <button
              onClick={handleApplyPosition}
              className="w-full bg-black text-white py-3 rounded-md"
            >
              Apply Position
            </button>
          </div>
        </>
      )}

      {/* ================================ */}
      {/* Dialog Components */}
      {/* ================================ */}
      <AddCategoryDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        compId={compId}
        token={token}
        refresh={fetchCategories}
      />

      <EditCategoryDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        category={categoryToEdit}
        compId={compId}
        token={token}
        refresh={fetchCategories}
      />

      <DeleteCategoryDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        category={categoryToDelete}
        token={token}
        refresh={fetchCategories}
      />
    </Layout>
  );
}
