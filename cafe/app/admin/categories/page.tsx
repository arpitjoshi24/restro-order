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
    const confirmed = confirm("Delete this category?");
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
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8F3EB]">
        <div className="text-orange-600 font-medium animate-pulse">
          Loading categories...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3EB] p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Categories
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your restaurant menu categories
        </p>
      </div>

      {/* CREATE BOX */}
      <div className="bg-white shadow-md rounded-2xl p-5 mb-8 flex gap-3 items-center border border-orange-100">
        <input
          type="text"
          placeholder="Enter new category (e.g. Pizza, Drinks...)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          onClick={handleCreate}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-medium transition"
        >
          + Add
        </button>
      </div>

      {/* LIST */}
      {categories.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No categories found. Start by adding one 🍕
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 hover:shadow-md transition"
            >
              {/* EDIT MODE */}
              {editingId === category.id ? (
                <div className="flex flex-col gap-3">
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border px-3 py-2 rounded-xl focus:ring-2 focus:ring-orange-400"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(category.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl flex-1"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-200 px-4 py-2 rounded-xl flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* CATEGORY NAME */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {category.name}
                    </h2>

                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(category.id);
                        setEditingName(category.name);
                      }}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-xl transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(category.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl transition"
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