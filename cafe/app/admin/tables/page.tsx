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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Tables
      </h1>

      {/* ADD TABLE */}

      <div className="flex gap-3 mb-8">
        <input
          type="number"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) =>
            setTableNumber(e.target.value)
          }
          className="border px-3 py-2 rounded flex-1"
        />

        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Table
        </button>
      </div>

      {/* TABLE LIST */}

      {tables.length === 0 ? (
        <p>No tables found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className="border rounded p-4"
            >
              {editingId === table.id ? (
                <>
                  <input
                    type="number"
                    value={editingNumber}
                    onChange={(e) =>
                      setEditingNumber(
                        e.target.value
                      )
                    }
                    className="border px-2 py-1 rounded w-full mb-3"
                  />

                  <button
                    onClick={() =>
                      handleUpdate(table.id)
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold">
                    Table {table.table_number}
                  </h2>

                  <p>
                    Status: {table.status}
                  
                  </p>

                 <Image
  src={table.qr_code}
  alt="QR Code"
  width={160}
  height={160}
  className="mt-2"
/>
                  

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setEditingId(
                          table.id
                        );

                        setEditingNumber(
                          table.table_number.toString()
                        );
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(table.id)
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