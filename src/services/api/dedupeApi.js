import axios from "axios";

const pendingRequests = new Map();

export const dedupeRequest = (url, method = "get", data = null) => {
  const cacheKey = JSON.stringify({ url, method, data });

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  const promise = (async () => {
    try {
      let res;
      if (method.toLowerCase() === "post") {
        res = await axios.post(url, data);
      } else {
        res = await axios.get(url);
      }
      return res;
    } catch (err) {
      pendingRequests.delete(cacheKey);
      throw err;
    }
  })();

  pendingRequests.set(cacheKey, promise);
  return promise;
};
