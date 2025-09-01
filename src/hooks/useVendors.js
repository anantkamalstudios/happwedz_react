import { useState, useEffect, useCallback } from "react";
import { vendorsApi } from "../services/api/vendorsApi";
import {
  transformVendorsData,
  transformVendorData,
} from "../utils/vendorDataTransform";

export const useVendors = (options = {}) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const {
    categoryId = null,
    vendorType = null,
    location = null,
    search = null,
    status = "active",
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    autoFetch = true,
  } = options;

  const fetchVendors = useCallback(
    async (fetchOptions = {}) => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          category_id: categoryId,
          vendor_type: vendorType,
          location,
          search,
          status,
          page: fetchOptions.page || page,
          limit: fetchOptions.limit || limit,
          sort_by: sortBy,
          sort_order: sortOrder,
          ...fetchOptions,
        };

        Object.keys(params).forEach((key) => {
          if (params[key] === null || params[key] === undefined) {
            delete params[key];
          }
        });

        const response = await vendorsApi.getVendors(params);

        if (response.success) {
          const transformedData = transformVendorsData(response.data);
          setVendors(transformedData);
          setPagination({
            page: response.pagination?.page || page,
            limit: response.pagination?.limit || limit,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.totalPages || 0,
          });
        } else {
          setError(response.message || "Failed to fetch vendors");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching vendors");
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    },
    [
      categoryId,
      vendorType,
      location,
      search,
      status,
      page,
      limit,
      sortBy,
      sortOrder,
    ]
  );

  const fetchVendorById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await vendorsApi.getVendorById(id);

      if (response.success) {
        return transformVendorData(response.data);
      } else {
        setError(response.message || "Failed to fetch vendor");
        return null;
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching vendor");
      console.error("Error fetching vendor:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createVendor = useCallback(
    async (vendorData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await vendorsApi.createVendor(vendorData);

        if (response.success) {
          // Refresh the vendors list
          await fetchVendors();
          return response.data;
        } else {
          setError(response.message || "Failed to create vendor");
          return null;
        }
      } catch (err) {
        setError(err.message || "An error occurred while creating vendor");
        console.error("Error creating vendor:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchVendors]
  );

  const updateVendor = useCallback(
    async (id, vendorData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await vendorsApi.updateVendor(id, vendorData);

        if (response.success) {
          // Refresh the vendors list
          await fetchVendors();
          return response.data;
        } else {
          setError(response.message || "Failed to update vendor");
          return null;
        }
      } catch (err) {
        setError(err.message || "An error occurred while updating vendor");
        console.error("Error updating vendor:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchVendors]
  );

  const deleteVendor = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);

      try {
        const response = await vendorsApi.deleteVendor(id);

        if (response.success) {
          // Refresh the vendors list
          await fetchVendors();
          return true;
        } else {
          setError(response.message || "Failed to delete vendor");
          return false;
        }
      } catch (err) {
        setError(err.message || "An error occurred while deleting vendor");
        console.error("Error deleting vendor:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchVendors]
  );

  const refreshVendors = useCallback(() => {
    fetchVendors();
  }, [fetchVendors]);

  const loadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      fetchVendors({ page: pagination.page + 1 });
    }
  }, [fetchVendors, pagination]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchVendors();
    }
  }, [fetchVendors, autoFetch]);

  return {
    vendors,
    loading,
    error,
    pagination,
    fetchVendors,
    fetchVendorById,
    createVendor,
    updateVendor,
    deleteVendor,
    refreshVendors,
    loadMore,
    hasMore: pagination.page < pagination.totalPages,
  };
};

// Hook for fetching a single vendor
export const useVendor = (id) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVendor = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await vendorsApi.getVendorById(id);

      if (response.success) {
        setVendor(response.data);
      } else {
        setError(response.message || "Failed to fetch vendor");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching vendor");
      console.error("Error fetching vendor:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  return {
    vendor,
    loading,
    error,
    refetch: fetchVendor,
  };
};
