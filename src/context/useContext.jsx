import { createContext, useState, useEffect } from "react";
import usePhotography from "../hooks/usePhotography";

export const MyContext = createContext(null);

export const MyProvider = ({ children }) => {
  const {
    fetchAllPhotos,
    fetchPhotosByType,
    allPhotos,
    photosByType,
    types,
    fetchTypes,
    loading,
  } = usePhotography();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCategoryName, setSelectedCategoryName] = useState("All");
  const [displayPhotos, setDisplayPhotos] = useState([]);

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    const loadPhotos = async () => {
      if (selectedCategory === "all") {
        await fetchAllPhotos();
      } else {
        await fetchPhotosByType(selectedCategory);
      }
    };
    loadPhotos();
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setDisplayPhotos(allPhotos || []);
    } else {
      setDisplayPhotos(photosByType || []);
    }
  }, [allPhotos, photosByType, selectedCategory]);

  return (
    <MyContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        selectedCategoryName,
        setSelectedCategoryName,
        displayPhotos,
        types,
        loading,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
