import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../services/api/axiosInstance";

/**
 * Holds the vendor's onboarding and subscription state for the whole dashboard.
 *
 * Fetched fresh from the server on every mount and never derived from the `vendor`
 * object in localStorage: that copy can be days old, and a stale copy must never be what
 * decides whether a tab is editable. The server enforces the same rules independently —
 * this only decides what the UI shows.
 */

const VendorAccessContext = createContext(null);

const EMPTY_ACCESS = {
  stage: null,
  verificationStatus: null,
  canEditBusinessDetails: true,
  canSubmitVerification: false,
  canPurchase: false,
  editableTabs: [],
  lockedTabs: [],
  allTabs: [],
  tabLabels: {},
  subscription: null,
  headline: null,
  message: null,
  nextAction: null,
};

export const VendorAccessProvider = ({ children }) => {
  const { vendor, token } = useSelector((state) => state.vendorAuth || {});
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!vendor?.id || !token) {
      setAccess(null);
      setLoading(false);
      return null;
    }

    try {
      const { data } = await axiosInstance.get("/vendor/me/access");
      setAccess(data.access || null);
      setError("");
      return data.access;
    } catch (err) {
      // Failing open would be worse than useless: the server rejects the write anyway,
      // so the vendor would fill in a whole form and then lose it. Failing closed with a
      // visible error is the honest outcome.
      setError(
        err.response?.data?.message || "Could not load your account status."
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, [vendor?.id, token]);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  const value = useMemo(() => {
    const resolved = access || EMPTY_ACCESS;

    return {
      ...resolved,
      loading,
      error,
      refresh,
      /** Is this storefront tab editable right now? */
      canEditTab: (tabId) => {
        if (!access) return false;
        if (tabId === "business") return access.canEditBusinessDetails;
        return access.editableTabs.includes(tabId);
      },
      isLocked: Boolean(access) && access.stage !== "active" && access.stage !== "legacy_grace",
    };
  }, [access, loading, error, refresh]);

  return (
    <VendorAccessContext.Provider value={value}>
      {children}
    </VendorAccessContext.Provider>
  );
};

/**
 * Access state for the current vendor.
 * Safe to call outside the provider — returns the closed-by-default shape.
 */
export const useVendorAccess = () => {
  const ctx = useContext(VendorAccessContext);
  if (!ctx) {
    return {
      ...EMPTY_ACCESS,
      loading: false,
      error: "",
      refresh: async () => null,
      canEditTab: () => true,
      isLocked: false,
    };
  }
  return ctx;
};

export default VendorAccessContext;
