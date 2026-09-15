import api from "../api/axios";

export const getCvs = async () => {
  const response = await api.get("/cvs");
  return response.data;
};

export const createCv = async (payload) => {
  const response = await api.post("/cvs", payload);
  return response.data;
};

export const deleteCv = async (id) => {
  const response = await api.delete(`/cvs/${id}`);
  return response.data;
};
