import api from "@/lib/axios";

export interface KitchenItem {
  name: string;
  quantity: number;
  price: number;
}

export interface KitchenOrder {
  id: string;
  table_number: number;
  status: string;
  total: number;
  created_at: string;
  items: KitchenItem[];
}

export const getKitchenOrders = async (): Promise<
  KitchenOrder[]
> => {
  const response = await api.get("/orders");

  return response.data.orders || [];
};

export const updateKitchenOrderStatus = async (
  id: string,
  status: string
) => {
  const response = await api.patch(
    `/orders/${id}/status`,
    {
      status,
    }
  );

  return response.data.order;
};