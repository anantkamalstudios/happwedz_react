import axiosInstance from "./axiosInstance";

const BASE = "/vendor/verification";

/**
 * Onboarding verification: submit documents, read status, open a stored document.
 *
 * Document URLs are short-lived and fetched on demand rather than stored — an Aadhaar
 * card must not sit in a React state tree behind a URL that keeps working.
 */
const vendorVerificationApi = {
  /**
   * @param {object}   payload
   * @param {object}   payload.fields          business detail fields to save
   * @param {File}     [payload.aadhaar]       PDF
   * @param {File}     [payload.pan]           PDF
   * @param {Array<{label: string, file: File}>} [payload.businessDocs]
   */
  submit: ({ fields = {}, aadhaar, pan, businessDocs = [] }) => {
    const form = new FormData();

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.append(key, value);
      }
    });

    if (aadhaar) form.append("aadhaar", aadhaar);
    if (pan) form.append("pan", pan);

    // Labels travel as a JSON array whose order matches the file order. Multer preserves
    // order within a field, so index i of businessDocs pairs with index i of the labels.
    const withFiles = businessDocs.filter((d) => d && d.file);
    if (withFiles.length) {
      withFiles.forEach((d) => form.append("businessDocs", d.file));
      form.append(
        "businessDocLabels",
        JSON.stringify(withFiles.map((d) => (d.label || "").trim()))
      );
    }

    return axiosInstance
      .post(`${BASE}/submit`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        // Documents on a slow connection outlive the 30s default.
        timeout: 120000,
      })
      .then((res) => res.data);
  },

  getStatus: () => axiosInstance.get(`${BASE}/status`).then((res) => res.data),

  getDocumentUrl: (documentId) =>
    axiosInstance.get(`${BASE}/documents/${documentId}/url`).then((res) => res.data),
};

export default vendorVerificationApi;
