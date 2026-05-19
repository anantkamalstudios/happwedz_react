import { useState, useEffect, useCallback, useRef } from 'react';
import { searchLocations } from '../services/api/flightApi';

/**
 * Debounced location (airport/city) typeahead hook for TripJack.
 *
 * Usage:
 *   const { query, setQuery, suggestions, loading, clearSuggestions } = useAirportSearch();
 *
 * @param {number} delay  Debounce delay in ms (default 350)
 */
const useAirportSearch = (delay = 350) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Holds the AbortController for the in-flight request so we can cancel it
  const abortRef = useRef(null);
  // Holds the debounce timer
  const timerRef = useRef(null);

  useEffect(() => {
    // Clear any pending debounce timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // Skip if query is too short
    if (query.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    timerRef.current = setTimeout(async () => {
      // Cancel previous in-flight request
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      try {
        const data = await searchLocations(query, abortRef.current.signal);

        // TripJack /tj/meta/locations response shape:
        // { payload: { suggestions: [{ id, code, name, city, country, countryCode, cityCode }] } }
        const raw = data?.payload?.suggestions || data?.data?.suggestions || data?.suggestions || data?.data || [];
        
        const normalised = Array.isArray(raw)
          ? raw.map((loc) => ({
              iata: loc.code || loc.iata || '',
              name: loc.name || '',
              city: loc.city || loc.cityName || '',
              country: loc.country || loc.countryName || '',
              countryCode: loc.countryCode || '',
              cityCode: loc.cityCode || '',
              id: loc.id || loc.code,
              priority: loc.priority || 0,
            }))
          : [];

        setSuggestions(normalised);
      } catch (err) {
        // Ignore abort errors — they're intentional
        if (err?.name !== 'AbortError' && err?.code !== 'ERR_CANCELED') {
          console.error('Location search error:', err);
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, delay]);

  const clearSuggestions = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  const hideSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return { query, setQuery, suggestions, loading, clearSuggestions, hideSuggestions, setSuggestions };
};

export default useAirportSearch;
