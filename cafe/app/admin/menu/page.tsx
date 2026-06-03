"use client";

import { useEffect, useState } from "react";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  MenuItem,
} from "@/services/menu.service";

import {
  getCategories,
  Category,
} from "@/services/category.service";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editingName, setEditingName] =
    useState("");

  const [editingPrice, setEditingPrice] =
    useState("");

  const [
    editingCategoryId,
    setEditingCategoryId,
  ] = useState("");

  const [
    editingAvailable,
    setEditingAvailable,
  ] = useState(true);

  const loadData = async () => {
    try {
      const [menuData, categoryData] =
        await Promise.all([
          getMenuItems(),
          getCategories(),
        ]);

      setMenuItems(menuData || []);
      setCategories(categoryData || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadData();
      setLoading(false);
    };

    init();
  }, []);

  const handleCreate = async () => {
    if (!name || !price || !categoryId)
      return;

    try {
      await createMenuItem({
        name,
        price: Number(price),
        category_id: categoryId,
      });

      setName("");
      setPrice("");
      setCategoryId("");

      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to create menu item");
    }
  };

  const handleUpdate = async (
    id: string
  ) => {
    try {
      await updateMenuItem(id, {
        name: editingName,
        price: Number(editingPrice),
        category_id: editingCategoryId,
        available: editingAvailable,
      });

      setEditingId(null);

      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to update menu item");
    }
  };

  const handleDelete = async (
    id: string
  ) => {
    const confirmed = confirm(
      "Delete this menu item?"
    );

    if (!confirmed) return;

    try {
      await deleteMenuItem(id);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EB] flex items-center justify-center">
        <div className="bg-white px-8 py-5 rounded-3xl shadow-lg">
          Loading menu...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3EB] p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#2C1810]">
          Menu Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage dishes, pricing and
          availability
        </p>
      </div>

      {/* Add Item */}
      <div className="bg-white rounded-3xl shadow-lg border border-[#EFE3D1] p-8 mb-10">
        <h2 className="text-2xl font-bold text-[#2C1810] mb-6">
          Add New Menu Item
        </h2>

        <div className="grid lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="px-4 py-3 rounded-2xl border border-[#E8D7C1]"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="px-4 py-3 rounded-2xl border border-[#E8D7C1]"
          />

          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value)
            }
            className="px-4 py-3 rounded-2xl border border-[#E8D7C1]"
          >
            <option value="">
              Select Category
            </option>

            {categories.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
              >
                {cat.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreate}
            className="bg-[#C46A2D] hover:bg-[#AA5B24] text-white rounded-2xl font-semibold"
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#EFE3D1] hover:-translate-y-2 transition-all duration-300"
          >
            {editingId === item.id ? (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  Edit Item
                </h3>

                <input
                  value={editingName}
                  onChange={(e) =>
                    setEditingName(
                      e.target.value
                    )
                  }
                  className="w-full mb-3 px-4 py-3 border rounded-2xl"
                />

                <input
                  type="number"
                  value={editingPrice}
                  onChange={(e) =>
                    setEditingPrice(
                      e.target.value
                    )
                  }
                  className="w-full mb-3 px-4 py-3 border rounded-2xl"
                />

                <select
                  value={
                    editingCategoryId
                  }
                  onChange={(e) =>
                    setEditingCategoryId(
                      e.target.value
                    )
                  }
                  className="w-full mb-3 px-4 py-3 border rounded-2xl"
                >
                  {categories.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.id}
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={
                      editingAvailable
                    }
                    onChange={(e) =>
                      setEditingAvailable(
                        e.target.checked
                      )
                    }
                  />

                  Available
                </label>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      handleUpdate(item.id)
                    }
                    className="flex-1 bg-green-600 text-white py-3 rounded-2xl"
                  >
                    Save
                  </button>

                  <button
                    onClick={() =>
                      setEditingId(null)
                    }
                    className="flex-1 bg-gray-200 py-3 rounded-2xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative h-56 bg-[#F8F3EB]">
                  <img
                    src="/cheese-burger.png"
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow">
                    <span className="font-bold text-[#C46A2D]">
                      ₹{item.price}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-2xl font-bold text-[#2C1810]">
                      {item.name}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.available
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>

                  <p className="text-gray-500 mb-5">
                    {item.category_name}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingId(
                          item.id
                        );

                        setEditingName(
                          item.name
                        );

                        setEditingPrice(
                          item.price.toString()
                        );

                        setEditingCategoryId(
                          item.category_id ||
                            ""
                        );

                        setEditingAvailable(
                          item.available
                        );
                      }}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-2xl font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          item.id
                        )
                      }
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}