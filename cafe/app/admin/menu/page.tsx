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

  const [editingCategoryId, setEditingCategoryId] =
    useState("");

  const [editingAvailable, setEditingAvailable] =
    useState(true);

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
    if (!name || !price || !categoryId) return;

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

  const handleUpdate = async (id: string) => {
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

  const handleDelete = async (id: string) => {
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
    return <p>Loading menu...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Menu Management
      </h1>

      {/* ADD MENU ITEM */}

      <div className="border rounded p-4 mb-8">
        <h2 className="font-bold mb-4">
          Add Menu Item
        </h2>

        <div className="grid md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="border px-3 py-2 rounded"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="border px-3 py-2 rounded"
          />

          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value)
            }
            className="border px-3 py-2 rounded"
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
            className="bg-green-600 text-white rounded px-4 py-2"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* MENU LIST */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="border rounded p-4"
          >
            {editingId === item.id ? (
              <>
                <input
                  value={editingName}
                  onChange={(e) =>
                    setEditingName(
                      e.target.value
                    )
                  }
                  className="border px-2 py-1 rounded w-full mb-2"
                />

                <input
                  type="number"
                  value={editingPrice}
                  onChange={(e) =>
                    setEditingPrice(
                      e.target.value
                    )
                  }
                  className="border px-2 py-1 rounded w-full mb-2"
                />

                <select
                  value={editingCategoryId}
                  onChange={(e) =>
                    setEditingCategoryId(
                      e.target.value
                    )
                  }
                  className="border px-2 py-1 rounded w-full mb-2"
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

                <label className="flex gap-2 mb-3">
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

                <button
                  onClick={() =>
                    handleUpdate(item.id)
                  }
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <h2 className="font-bold text-lg">
                  {item.name}
                </h2>

                <p>₹{item.price}</p>

                <p>
                  Category:{" "}
                  {item.category_name}
                </p>

                <p>
                  Status:{" "}
                  {item.available
                    ? "Available"
                    : "Unavailable"}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingId(item.id);

                      setEditingName(
                        item.name
                      );

                      setEditingPrice(
                        item.price.toString()
                      );

                      setCategoryId(item.category_id || "");

                      setEditingAvailable(
                        item.available
                      );
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(item.id)
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
    </div>
  );
}