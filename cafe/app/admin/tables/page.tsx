"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  Table,
} from "@/services/table.service";

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  const [tableNumber, setTableNumber] = useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editingNumber, setEditingNumber] =
    useState("");

  const loadTables = async () => {
    try {
      const data = await getTables();
      setTables(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadTables();
      setLoading(false);
    };

    init();
  }, []);

  const handleCreate = async () => {
    if (!tableNumber) return;

    try {
      await createTable(Number(tableNumber));

      setTableNumber("");
      loadTables();
    } catch (error) {
      console.error(error);
      alert("Failed to create table");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateTable(
        id,
        Number(editingNumber)
      );

      setEditingId(null);
      setEditingNumber("");

      loadTables();
    } catch (error) {
      console.error(error);
      alert("Failed to update table");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      "Delete this table?"
    );

    if (!confirmed) return;

    try {
      await deleteTable(id);

      loadTables();
    } catch (error) {
      console.error(error);
      alert("Failed to delete table");
    }
  };

  if (loading) {
    return <p>Loading tables...</p>;
  }

   return (
    <div className="min-h-screen bg-[#F8F3EB] p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#2C1810]">
            Table Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage restaurant tables and QR codes
        </p>
      </div>

      {/* Add Table */}
      <div className="bg-white rounded-3xl shadow-lg border border-[#EFE3D1] p-8 mb-10">
        <h2 className="text-2xl font-bold text-[#2C1810] mb-6">
          Add New Table
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="number"
            placeholder="Table Number"
            value={tableNumber}
            onChange={(e) =>
              setTableNumber(e.target.value)
            }
            className="flex-1 px-4 py-3 rounded-2xl border border-[#E8D7C1] focus:outline-none focus:ring-2 focus:ring-[#C46A2D]"
          />

          <button
            onClick={handleCreate}
            className="bg-[#C46A2D] hover:bg-[#AA5B24] text-white px-8 py-3 rounded-2xl font-semibold transition"
          >
            + Add Table
          </button>
        </div>
      </div>

      {/* Tables */}
      {tables.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-lg">
          <p className="text-gray-500">
            No tables found.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {tables.map((table) => (
            <div
              key={table.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#EFE3D1] hover:-translate-y-2 transition-all duration-300"
            >
              {editingId === table.id ? (
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#2C1810] mb-4">
                    Edit Table
                  </h3>

                  <input
                    type="number"
                    value={editingNumber}
                    onChange={(e) =>
                      setEditingNumber(
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-[#E8D7C1] rounded-2xl mb-4"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleUpdate(table.id)
                      }
                      className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-semibold"
                    >
                      Save
                    </button>

                    <button
                      onClick={() =>
                        setEditingId(null)
                      }
                      className="flex-1 bg-gray-200 py-3 rounded-2xl font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-[#C46A2D] to-[#AA5B24] p-6 text-white">
                    <h2 className="text-2xl font-bold">
                      Table {table.table_number}
                    </h2>
                  </div>

                  <div className="p-6">
                    {/* Status */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-gray-500">
                        Status
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          table.status ===
                          "available"
                            ? "bg-green-100 text-green-700"
                            : table.status ===
                              "occupied"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {table.status}
                      </span>
                    </div>

                    {/* QR */}
                    <div className="bg-[#F8F3EB] rounded-2xl p-5 flex justify-center mb-6">
                      <Image
                        src={table.qr_code}
                        alt={`QR Table ${table.table_number}`}
                        width={180}
                        height={180}
                        className="rounded-lg"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingId(
                            table.id
                          );

                          setEditingNumber(
                            table.table_number.toString()
                          );
                        }}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-2xl font-semibold transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            table.id
                          )
                        }
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold transition"
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
      )}
    </div>
  );
}