import api from "@/lib/axios";

export interface Table {
  id: string;
  table_number: number;
  status: string;
  qr_code: string;
}

export const getTables = async (): Promise<Table[]> => {
  const response = await api.get("/tables");
  return response.data.tables;
};

export const createTable = async (
  table_number: number
): Promise<Table> => {
  const response = await api.post("/tables", {
    table_number,
  });

  return response.data.table;
};

export const updateTable = async (
  id: string,
  table_number: number
): Promise<Table> => {
  const response = await api.put(
    `/tables/${id}`,
    { table_number }
  );

  return response.data.table;
};

export const deleteTable = async (
  id: string
): Promise<void> => {
  await api.delete(`/tables/${id}`);
};