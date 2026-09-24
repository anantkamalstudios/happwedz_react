import axiosInstance from "../../../../services/api/axiosInstance";

// Vendor CRM API. Money goes over the wire in paise.

const BASE = "/vendor/crm";

const data = (promise) => promise.then((res) => res.data);

// The server's message when it sent one, otherwise a generic line.
export const errorMessage = (error, fallback = "Something went wrong. Please try again.") =>
  error?.response?.data?.message || fallback;

export const crmApi = {
  profile: () => data(axiosInstance.get(`${BASE}/profile`)),
  saveProfile: (body) => data(axiosInstance.put(`${BASE}/profile`, body)),
  uploadLogo: (file) => {
    const form = new FormData();
    form.append("logo", file);
    return data(axiosInstance.post(`${BASE}/profile/logo`, form, { headers: { "Content-Type": "multipart/form-data" } }));
  },

  summary: () => data(axiosInstance.get(`${BASE}/summary`)),
  board: (params) => data(axiosInstance.get(`${BASE}/board`, { params })),
  clients: (params) => data(axiosInstance.get(`${BASE}/clients`, { params })),
  client: (id) => data(axiosInstance.get(`${BASE}/clients/${id}`)),
  createClient: (body) => data(axiosInstance.post(`${BASE}/clients`, body)),
  updateClient: (id, body) => data(axiosInstance.put(`${BASE}/clients/${id}`, body)),
  deleteClient: (id) => data(axiosInstance.delete(`${BASE}/clients/${id}`)),
  // Moving a client between stages. Lost and cancelled need a reason.
  setClientStatus: (id, body) => data(axiosInstance.post(`${BASE}/clients/${id}/status`, body)),

  uploadFiles: (clientId, files) => {
    const form = new FormData();
    for (const file of files) form.append("files", file);
    return data(
      axiosInstance.post(`${BASE}/clients/${clientId}/files`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      }),
    );
  },
  deleteFile: (fileId) => data(axiosInstance.delete(`${BASE}/files/${fileId}`)),

  enquiryLinks: () => data(axiosInstance.get(`${BASE}/enquiries/links`)),
  addEnquiry: (enquiryId) => data(axiosInstance.post(`${BASE}/enquiries/${enquiryId}/client`)),

  createQuotation: (clientId, body) => data(axiosInstance.post(`${BASE}/clients/${clientId}/quotations`, body)),
  updateQuotation: (id, body) => data(axiosInstance.put(`${BASE}/quotations/${id}`, body)),
  deleteQuotation: (id) => data(axiosInstance.delete(`${BASE}/quotations/${id}`)),
  sendQuotation: (id, body) => data(axiosInstance.post(`${BASE}/quotations/${id}/send`, body)),
  setQuotationStatus: (id, status) => data(axiosInstance.post(`${BASE}/quotations/${id}/status`, { status })),

  createInvoice: (clientId, body) => data(axiosInstance.post(`${BASE}/clients/${clientId}/invoices`, body)),
  sendInvoice: (id, body) => data(axiosInstance.post(`${BASE}/invoices/${id}/send`, body)),
  cancelInvoice: (id, reason) => data(axiosInstance.post(`${BASE}/invoices/${id}/cancel`, { reason })),

  createPayment: (clientId, body) => data(axiosInstance.post(`${BASE}/clients/${clientId}/payments`, body)),
  deletePayment: (id) => data(axiosInstance.delete(`${BASE}/payments/${id}`)),

  addNote: (clientId, body) => data(axiosInstance.post(`${BASE}/clients/${clientId}/notes`, { body })),
  deleteNote: (noteId) => data(axiosInstance.delete(`${BASE}/notes/${noteId}`)),
  sendReminder: (clientId) => data(axiosInstance.post(`${BASE}/clients/${clientId}/reminders`)),
  calendar: (from, to) => data(axiosInstance.get(`${BASE}/calendar`, { params: { from, to } })),

  // Public quotation page (no login).
  publicQuotation: (token) => data(axiosInstance.get(`/crm/public/quotations/${token}`)),
  respondToQuotation: (token, decision) => data(axiosInstance.post(`/crm/public/quotations/${token}/respond`, { decision })),
};

export const pdfPaths = {
  quotation: (id) => `${BASE}/quotations/${id}/pdf`,
  invoice: (id) => `${BASE}/invoices/${id}/pdf`,
  receipt: (id) => `${BASE}/payments/${id}/receipt`,
  export: () => `${BASE}/clients/export`,
};

/**
 * Fetch a file that needs the vendor's token and hand it to the browser.
 * PDFs open in a new tab (the tab is opened first, synchronously, so popup
 * blockers allow it); other files download.
 */
export const openFile = async (path, { filename, params, download = false } = {}) => {
  const tab = download ? null : window.open("", "_blank");
  try {
    const res = await axiosInstance.get(path, { params, responseType: "blob", timeout: 60000 });
    const url = URL.createObjectURL(res.data);
    if (tab) {
      tab.location.href = url;
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (error) {
    if (tab) tab.close();
    // A blob error body hides the JSON message; read it back out.
    const blob = error?.response?.data;
    if (blob instanceof Blob) {
      try {
        const parsed = JSON.parse(await blob.text());
        throw new Error(parsed.message || "Could not open the file.");
      } catch (inner) {
        throw inner instanceof SyntaxError ? new Error("Could not open the file.") : inner;
      }
    }
    throw new Error(errorMessage(error, "Could not open the file."));
  }
};
