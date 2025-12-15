import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import GridView from "./Main/GridView";
import useApiData from "../../hooks/useApiData";

const SimilarServices = ({ venueData, currentId }) => {
  const navigate = useNavigate();

  const type = venueData?.attributes?.vendor_type;
  const subCategory =
    venueData?.attributes?.sub_category ||
    venueData?.attributes?.subCategory ||
    venueData?.vendor?.sub_category ||
    venueData?.vendor?.subCategory;

  const currentCity = (
    venueData?.attributes?.city ||
    venueData?.attributes?.location?.city ||
    venueData?.vendor?.city ||
    ""
  ).toLowerCase();

  const { data: allServices, loading } = useApiData(
    type ? "services" : null, // section
    subCategory || null, // slug (used as subCategory in hook)
    null, // city (we filter manually to prioritize)
    subCategory ? null : type, // vendorType
    1, // page
    50 // limit
  );

  const [similarVendors, setSimilarVendors] = useState([]);

  useEffect(() => {
    if (!allServices || allServices.length === 0) {
      setSimilarVendors([]);
      return;
    }

    // Filter out current vendor
    let filtered = allServices.filter(
      (item) => String(item.id) !== String(currentId)
    );

    // Prioritize same city
    const sameCity = filtered.filter((item) => {
      const itemCity = (item.city || item.location || "").toLowerCase();
      return currentCity && itemCity.includes(currentCity);
    });

    // Take top 4
    let result = [];
    if (sameCity.length >= 4) {
      result = sameCity.slice(0, 4);
    } else {
      const others = filtered.filter((item) => !sameCity.includes(item));
      result = [...sameCity, ...others].slice(0, 4);
    }

    setSimilarVendors(result);
  }, [allServices, currentId, currentCity]);

  if (similarVendors.length === 0 && !loading) return null;

  return (
    <section className="similar-venues py-5 bg-light">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="details-section-title fw-bold m-0">
            Similar {subCategory || "Vendors"} You Might Like
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <GridView subVenuesData={similarVendors} />
        )}

        <div className="text-center mt-4">
          <Button
            variant="outline-primary"
            className="px-5 rounded-pill"
            onClick={() => {
              const type = venueData?.attributes?.vendor_type?.toLowerCase();
              let route = "/vendors";
              if (type && type.includes("venue")) {
                route = "/venues";
              }
              navigate(route);
              window.scrollTo(0, 0);
            }}
          >
            View All Similar {venueData?.attributes?.vendor_type || "Vendors"}
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default SimilarServices;
