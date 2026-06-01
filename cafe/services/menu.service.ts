import api from "@/lib/axios";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
  category_id?: string;
  category_name?: string;
}

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const response = await api.get("/menu");
  return response.data.items || [];
};

export const createMenuItem = async (data: {
  name: string;
  price: number;
  category_id: string;
}) => {
  const response = await api.post("/menu", data);
  return response.data.item;
};

export const updateMenuItem = async (
  id: string,
  data: {
    name: string;
    price: number;
    category_id: string;
    available: boolean;
  }
) => {
  const response = await api.put(`/menu/${id}`, data);
  return response.data.item;
};

export const deleteMenuItem = async (id: string) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data.item;
};