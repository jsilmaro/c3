
import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Django backend URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token expiration
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  register: (userData: any) => api.post("/auth/register/", userData),
  login: (credentials: any) => api.post("/auth/login/", credentials),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    return Promise.resolve();
  },
  refreshToken:(refresh_token: string) => api.post("auth/token/refresh/", {refresh: refresh_token}),
  getUser: () => api.get("/auth/user/"),
  updateUser: (userData: any) => api.put("/auth/user/", userData),
  getActiveAccounts: () => api.get("/auth/active-accounts/"),
  switchAccount: (accountId: string) => api.post("/auth/switch-account/", { account_id: accountId }),
};


// Transactions API calls
export const transactionsApi = {
  getAll: (params?: any) => api.get("/transactions/", { params }),
  getById: (id: string) => api.get(`/transactions/${id}/`),
  create: (transaction: any) => api.post("/transactions/", transaction),
  update: (id: string, transaction: any) => api.put(`/transactions/${id}/`, transaction),
  delete: (id: string) => api.delete(`/transactions/${id}/`),
};

// Budget API calls
export const budgetApi = {
  getAll: () => api.get("/budgets/"),
  getById: (id: string) => api.get(`/budgets/${id}/`),
  create: (budget: any) => api.post("/budgets/", budget),
  update: (id: string, budget: any) => api.put(`/budgets/${id}/`, budget),
  delete: (id: string) => api.delete(`/budgets/${id}/`),
};

// Dashboard API calls
export const dashboardApi = {
  getSummary: () => api.get("/dashboard/summary/"),
  getRecentTransactions: () => api.get("/dashboard/recent-transactions/"),
};

// Report API calls
export const reportsApi = {
  getSpendingByCategory: (params?: any) => api.get("/reports/spending-by-category/", { params }),
  getIncomeByCategory: (params?: any) => api.get("/reports/income-by-category/", { params }),
  getSpendingOverTime: (params?: any) => api.get("/reports/spending-over-time/", { params }),
  exportReport: (reportType: string, params?: any) => 
    api.get(`/reports/export/${reportType}/`, { 
      params,
      responseType: "blob" 
    }),
};

export default api;