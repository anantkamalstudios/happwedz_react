import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useRegions from "../../hooks/useRegions";
import { MyContext } from "../../context/useContext";

const SiteMap = () => {
  const navigate = useNavigate();
  const { setSelectedCategory, setSelectedCategoryName, types } =
    useContext(MyContext);

  // const { data: regions, loading: regionsLoading, error } = useRegions();

  // const [citiesData, setCitiesData] = useState([]);
  // const [loading, setLoading] = useState(true);

  const findCategoryIdByName = (categoryName) => {
    if (!types || !Array.isArray(types)) return null;
    const category = types.find(
      (type) => type.name?.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.id : null;
  };

  const handleCategoryClick = (categoryName) => {
    const categoryId = findCategoryIdByName(categoryName);
    if (categoryId) {
      setSelectedCategory(categoryId);
      setSelectedCategoryName(categoryName);
      navigate("/photography");
    }
  };

  const siteLinks = [
    { name: "About Us", slug: "about-us" },
    { name: "Contact Us", slug: "contact-us" },
    { name: "Terms & Conditions", slug: "terms-and-conditions" },
    { name: "Privacy Policy", slug: "privacy-policy" },
    { name: "Cancellation Policy", slug: "cancellation-policy" },
    { name: "Submit Your Wedding", slug: "submit-your-wedding" },
    { name: "Careers", slug: "careers" },
    { name: "Register as a Vendor", slug: "register-as-vendor" },
    { name: "Sign Up", slug: "sign-up" },
    { name: "Login", slug: "login" },
  ];

  const mainLinks = [
    { name: "Home", slug: "/" },
    { name: "Vendors", slug: "/vendors" },
    { name: "Real Weddings", slug: "/real-weddings" },
    { name: "Gallery", slug: "/photography" },
    { name: "Blogs", slug: "/blogs" },
  ];

  // useEffect(() => {
  //   if (!regions || regionsLoading) return;

  //   const fetchCitiesAndData = async () => {
  //     try {
  //       const promises = Object.keys(regions).map(async (key) => {
  //         const cityName = regions[key].name;
  //         const res = await axios.get(
  //           `https://www.happywedz.com/api/vendor-services?city=${cityName}`
  //         );
  //         return { city: cityName, data: res.data };
  //       });

  //       const results = await Promise.all(promises);
  //       setCitiesData(results);
  //     } catch (err) {
  //       console.error("Error fetching city data:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCitiesAndData();
  // }, [regions, regionsLoading]);

  // if (loading || regionsLoading) {
  //   return <p style={{ textAlign: "center" }}>Loading site map...</p>;
  // }

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{ textAlign: "center", color: "#C31162", marginBottom: "20px" }}
      >
        Site Map
      </h1>

      <div style={{ lineHeight: "1.8" }}>
        <p>
          <strong>HappyWedz Links:</strong>{" "}
          {mainLinks.map((link) => (
            <Link
              key={link.slug}
              to={link.slug}
              style={{
                textDecoration: "none",
                color: "gray",
                marginRight: "8px",
              }}
            >
              {link.name}
              {", "}
            </Link>
          ))}
        </p>

        <p>
          <strong>Photos:</strong>{" "}
          {types?.map((type) => (
            <Link
              key={type.id}
              to="/photography"
              onClick={() => handleCategoryClick(type.name)}
              style={{
                textDecoration: "none",
                color: "gray",
                marginRight: "8px",
              }}
            >
              {type.description}
              {", "}
            </Link>
          ))}
        </p>

        <p>
          <strong>Other Links:</strong>{" "}
          {siteLinks.map((link) => (
            <Link
              key={link.slug}
              to={`/${link.slug}`}
              style={{
                textDecoration: "none",
                color: "gray",
                marginRight: "8px",
              }}
            >
              {link.name}
              {", "}
            </Link>
          ))}
        </p>

        {/* {citiesData.map(({ city, data }) => (
          <div key={city}>
            <p style={{ marginTop: "10px" }}>
              <strong>Wedding Vendors in {city}</strong>
            </p>
            <ul>
              {data.map((vendor, i) => (
                <li key={i}>{vendor.name}</li>
              ))}
            </ul>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default SiteMap;
