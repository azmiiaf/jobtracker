import api from "../api/axios";

const CACHE_KEY = "jt_cvs_cache";
const CACHE_TTL_MS = 120_000;

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
    /* localStorage penuh — lewati */
  }
};

export const clearCvsCache = () => {
  localStorage.removeItem(CACHE_KEY);
};

export const getCvs = async () => {
  const cached = readCache();
  if (cached) return cached;

  const response = await api.get("/cvs");
  const payload = response.data;
  const list = Array.isArray(payload)
    ? payload
    : payload.data || [];
  writeCache(list);
  return list;
};

export const createCv = async (payload) => {
  const response = await api.post("/cvs", payload);
  clearCvsCache();
  return response.data;
};

export const deleteCv = async (id) => {
  const response = await api.delete(`/cvs/${id}`);
  clearCvsCache();
  return response.data;
};
