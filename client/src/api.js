const API_BASE = "http://localhost:5000/api";

export const api = {
  async request(path, method = "GET", body, token, isMultipart = false) {
    const headers = {};

    if (!isMultipart) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body
        ? isMultipart
          ? body           
          : JSON.stringify(body)
        : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  },
};
