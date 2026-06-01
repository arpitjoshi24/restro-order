import api from "@/lib/axios";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  table_number: number;
  status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
}

export const getOrders = async (
  status?: string
): Promise<Order[]> => {
  const response = await api.get(
    status
      ? `/admin/orders?status=${status}`
      : "/admin/orders"
  );

  return response.data.orders;
};