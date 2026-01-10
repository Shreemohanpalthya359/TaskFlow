const API_BASE_URL = "http://localhost:5000";

/* ================================
   Token helpers
================================ */
const getToken = () => localStorage.getItem("token");

/* ================================
   Common headers
================================ */
const getHeaders = (includeAuth = true, contentType = true) => {
  const headers = {};
  if (contentType) headers["Content-Type"] = "application/json";

  if (includeAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

/* ================================
   AUTH APIs
================================ */
export const authAPI = {
  register: async (username, email, password, avatar = null) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ username, email, password, avatar }),
    });

    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();

    // ✅ FIX: store correct token key
    localStorage.setItem("token", data.access_token);

    return data;
  },

  updateProfile: async (avatar) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ avatar }),
    });

    if (!response.ok) throw new Error("Profile update failed");
    return response.json();
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

/* ================================
   CUSTOMER APIs
================================ */
export const customerAPI = {
  create: async (name) => {
    const response = await fetch(`${API_BASE_URL}/customers/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) throw new Error("Failed to create customer");
    return response.json();
  },

  list: async () => {
    const response = await fetch(`${API_BASE_URL}/customers/`, {
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch customers");
    return response.json();
  },

  get: async (id) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch customer");
    return response.json();
  },

  update: async (id, name) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) throw new Error("Failed to update customer");
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to delete customer");
    return response.json();
  },

  reports: async () => {
    const response = await fetch(`${API_BASE_URL}/customers/reports`, {
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch reports");
    return response.json();
  },
};

/* ================================
   TODO APIs
================================ */
export const todoAPI = {
  createTask: async (title, description = "", customerId) => {
    const response = await fetch(`${API_BASE_URL}/todos/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        title,
        description,
        customer_id: customerId,
      }),
    });

    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  },

  getTasksByCustomer: async (customerId) => {
    const response = await fetch(
      `${API_BASE_URL}/todos/customer/${customerId}`,
      { headers: getHeaders() }
    );

    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },

  getAllTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/todos/all`, {
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },

  updateTask: async (todoId, completed) => {
    const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  },

  deleteTask: async (todoId) => {
    const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to delete task");
    return response.json();
  },

  exportPDF: async (taskIds = []) => {
    const response = await fetch(`${API_BASE_URL}/todos/export`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ task_ids: taskIds }),
    });

    if (!response.ok) throw new Error("Failed to export PDF");
    return response.blob();
  },
};

/* ================================
   Base API
================================ */
export const api = {
  baseUrl: API_BASE_URL,
};
