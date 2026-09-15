import api from '../api/axios';

export const getDashboardStats = () => api.get('/dashboard/stats');
export const getApplications = () => api.get('/applications');
export const createApplication = (payload) => api.post('/applications', payload);
export const updateApplication = (id, payload) => api.put(`/applications/${id}`, payload);