import api from "@/lib/axios";

export interface Category {
  id: string;
  name: string;
}

// GET ALL
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data.categories;
};

// CREATE
export const createCategory = async (
  name: string
): Promise<Category> => {
  const response = await api.post("/categories", {
    name,
  });

  return response.data.category;
};

// UPDATE
export const updateCategory = async (
  id: string,
  name: string
): Promise<Category> => {
  const response = await api.put(
    `/categories/${id}`,
    { name }
  );

  return response.data.category;
};

// DELETE
export const deleteCategory = async (
  id: string
): Promise<void> => {
  await api.delete(`/categories/${id}`);
};