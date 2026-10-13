import api from "../api/axios";

const CACHE_KEY = "jt_applications_cache";
const CACHE_TTL_MS = 120_000; // jatuh tempo 2 menit

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  } catch {
    /* localStorage penuh / tidak tersedia — lewati saja */
  }
};

export const clearApplicationsCache = () => {
  localStorage.removeItem(CACHE_KEY);
};

export const getApplications = async () => {
  const cached = readCache();
  if (cached) return cached;

  const response = await api.get("/applications");
  const payload = response.data;
  const list = Array.isArray(payload)
    ? payload
    : payload.applications || payload.data || [];
  writeCache(list);
  return list;
};

export const getApplicationById = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

export const createApplication = async (data) => {
  const response = await api.post("/applications", data);
  clearApplicationsCache();
  return response.data;
};

export const updateApplication = async (id, data) => {
  const response = await api.put(`/applications/${id}`, data);
  clearApplicationsCache();
  return response.data;
};

export const updateApplicationStatus = async (id, data) => {
  const response = await api.patch(`/applications/${id}/status`, data);
  clearApplicationsCache();
  return response.data;
};

export const updateApplicationInterview = async (id, data) => {
  const response = await api.put(`/applications/${id}/interview`, data);
  clearApplicationsCache();
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  clearApplicationsCache();
  return response.data;
};
