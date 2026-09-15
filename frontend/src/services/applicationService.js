import api from "../api/axios";

// Ambil semua daftar lamaran
export const getApplications = async () => {
  const response = await api.get("/applications");
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

// Tambah lamaran baru
export const createApplication = async (data) => {
  const response = await api.post("/applications", data);
  return response.data;
};

// Update status/data lamaran
export const updateApplication = async (id, data) => {
  const response = await api.put(`/applications/${id}`, data);
  return response.data;
};

export const updateApplicationStatus = async (id, data) => {
  const response = await api.patch(`/applications/${id}/status`, data);
  return response.data;
};

export const updateApplicationInterview = async (id, data) => {
  const response = await api.put(`/applications/${id}/interview`, data);
  return response.data;
};

// Hapus lamaran
export const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};

export const getCvs = async () => {
  const response = await api.get("/cvs");
  return response.data;
};
