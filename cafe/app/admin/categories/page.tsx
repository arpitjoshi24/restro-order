"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
} from "@/services/category.service";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadCategories();
      setLoading(false);
    };

    init();
  }, []);

  const handleCreate = async () => {
    if (!newCategory.trim()) return;

    try {
      await createCategory(newCategory);

      setNewCategory("");
      loadCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to create category");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateCategory(id, editingName);

      setEditingId(null);
      setEditingName("");

      loadCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to update category");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      "Delete this category?"
    );

    if (!confirmed) return;

    try {
      await deleteCategory(id);

      loadCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to delete category");
    }
  };

  if (loading) {
    return <p>Loading categories...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Categories
      </h1>

      {/* CREATE CATEGORY */}

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Category name"
          value={newCategory}
          onChange={(e) =>
            setNewCategory(e.target.value)
          }
          className="border px-3 py-2 rounded flex-1"
        />

        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      {/* CATEGORY LIST */}

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              {editingId === category.id ? (
                <div className="flex gap-2 flex-1">
                  <input
                    value={editingName}
                    onChange={(e) =>
                      setEditingName(e.target.value)
                    }
                    className="border px-2 py-1 rounded flex-1"
                  />

                  <button
                    onClick={() =>
                      handleUpdate(category.id)
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <span>{category.name}</span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(category.id);
                        setEditingName(
                          category.name
                        );
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(category.id)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}