import { useCallback, useEffect, useMemo, useState } from "react";
import vendorSubscriptionApi from "../services/api/vendorSubscriptionApi";

/**
 * Loads the plans a vendor can buy and works out which billing cycle to show.
 *
 * Shared by the Upgrade page and the picker modal so the two can never disagree about
 * which cycles exist or which tab should open first.
 *
 * @param {boolean} enabled  skip the request until the modal is actually opened
 */
export default function useSubscriptionPlans(enabled = true) {
  const [plans, setPlans] = useState([]);
  const [access, setAccess] = useState({});
  const [cycle, setCycle] = useState("monthly");
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await vendorSubscriptionApi.getPlans();
      const list = data.plans || [];
      setPlans(list);
      setAccess(data.access || {});

      // Open on a cycle that actually has plans, so the first paint is never an empty
      // tab just because monthly happens to be the default.
      setCycle(list.some((p) => p.billing_cycle === "monthly") ? "monthly" : "yearly");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load plans. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  const { showCycleTabs, visiblePlans } = useMemo(() => {
    const hasMonthly = plans.some((p) => p.billing_cycle === "monthly");
    const hasYearly = plans.some((p) => p.billing_cycle === "yearly");
    // A switcher with only one side is a label, not a control.
    const both = hasMonthly && hasYearly;

    return {
      showCycleTabs: both,
      visiblePlans: both ? plans.filter((p) => p.billing_cycle === cycle) : plans,
    };
  }, [plans, cycle]);

  return {
    plans,
    visiblePlans,
    access,
    cycle,
    setCycle,
    showCycleTabs,
    loading,
    error,
    reload: load,
  };
}
