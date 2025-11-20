import { useState, useEffect, useCallback } from "react";
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
  TouchSensor,
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
  const [applying, setApplying] = useState(false);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // ================================
  // Sensors for dnd-kit (Mobile + Desktop)
  // ================================
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  // ================================
  // Fetch Categories
  // ================================
  const fetchCategories = useCallback(async () => {
    if (!compId || !token) return;

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
  }, [compId, token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ================================
  // Drag End Handler
  // ================================
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setCategories((items) => {
      const oldIndex = items.findIndex((c) => c.id === active.id);
      const newIndex = items.findIndex((c) => c.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  }, []);

  // ================================
  // Apply Position API
  // ================================
  const handleApplyPosition = async () => {
    try {
      setApplying(true);

      const payload = categories.map((cat, index) => ({
        compid: compId,
        id: cat.id,
        pos: index + 1,
        name: cat.name,
        info: cat.info || "",
      }));

      const res = await fetch(`https://oms.wilerhub.com/api/menucat/1`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchCategories();
        // alert("Positions updated successfully!");
      }
    } catch (err) {
      console.error("Position update failed:", err);
      // alert("Position update failed. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  // ================================
  // Dialog Handlers
  // ================================
  const handleEdit = useCallback((cat) => {
    setCategoryToEdit(cat);
    setShowEditDialog(true);
  }, []);

  const handleDelete = useCallback((cat) => {
    setCategoryToDelete(cat);
    setShowDeleteDialog(true);
  }, []);

  const closeEditDialog = useCallback(() => {
    setShowEditDialog(false);
    setCategoryToEdit(null);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
    setCategoryToDelete(null);
  }, []);

  return (
    <Layout title="Menu Categories" showBackButton={true}>
      {loading ? (
        <div className="flex justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
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
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </SortableContext>
          </DndContext>

          {/* ================================ */}
          {/* Action Buttons */}
          {/* ================================ */}
          <div className="space-y-3 mt-6">
            <button
              onClick={() => setShowAddDialog(true)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-md font-medium transition-colors"
            >
              Add Menu Category
            </button>

            <button
              onClick={handleApplyPosition}
              disabled={applying}
              className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-md font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {applying ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Applying...
                </>
              ) : (
                "Apply Position"
              )}
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
        onClose={closeEditDialog}
        category={categoryToEdit}
        compId={compId}
        token={token}
        refresh={fetchCategories}
      />

      <DeleteCategoryDialog
        open={showDeleteDialog}
        onClose={closeDeleteDialog}
        category={categoryToDelete}
        token={token}
        refresh={fetchCategories}
      />
    </Layout>
  );
}
