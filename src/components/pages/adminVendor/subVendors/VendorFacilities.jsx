import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import VenueMasterProfile from "./VenueMasterProfile";
import CatererMasterProfile from "./CatererMasterProfile";
import PhotographerMasterProfile from "./PhotographerMasterProfile";
import MakeupArtistMasterProfile from "./MakeupArtistMasterProfile";
import JewelleryMasterProfile from "./JewelleryMasterProfile";
import JewelleryRentalMasterProfile from "./JewelleryRentalMasterProfile";
import AccessoriesMasterProfile from "./AccessoriesMasterProfile";
import FlowerJewelleryMasterProfile from "./FlowerJewelleryMasterProfile";
import BridalOutfitMasterProfile from "./BridalOutfitMasterProfile";
import RentalOutfitMasterProfile from "./RentalOutfitMasterProfile";
import CocktailGownMasterProfile from "./CocktailGownMasterProfile";

const VendorFacilities = ({
  formData,
  setFormData,
  onSave,
  onShowSuccess,
  vendorTypeName: propVendorTypeName,
  isVenue: propIsVenue,
}) => {
  const { vendor } = useSelector((state) => state.vendorAuth || {});
  const [fetchedVendorTypeName, setFetchedVendorTypeName] = useState("");
  const [fetchedSubcategoryName, setFetchedSubcategoryName] = useState("");

  useEffect(() => {
    const fetchVendorTypeAndSubcat = async () => {
      try {
        if (vendor?.vendor_type_id) {
          const response = await axios.get(
            `https://happywedz.com/api/vendor-types/${vendor.vendor_type_id}`,
          );
          setFetchedVendorTypeName(response.data?.name || "");

          // Also fetch subcategories to map the current subcatId to a name
          const subcats = response.data?.subcategories || [];
          const curSubcatId = formData?.vendor_subcategory_id || vendor?.vendor_subcategory_id;

          if (curSubcatId && subcats.length > 0) {
            const matched = subcats.find(s => String(s.id) === String(curSubcatId));
            if (matched) {
              setFetchedSubcategoryName(matched.name || "");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching vendor profile references:", err);
      }
    };
    fetchVendorTypeAndSubcat();
  }, [vendor?.vendor_type_id, formData?.vendor_subcategory_id, vendor?.vendor_subcategory_id]);

  const finalVendorTypeName = `${propVendorTypeName || fetchedVendorTypeName} ${fetchedSubcategoryName}`;
  const normalizedType = finalVendorTypeName.toLowerCase();
  const isVenue =
    propIsVenue ||
    normalizedType.includes("venue") ||
    normalizedType.includes("marriage garden") ||
    normalizedType.includes("banquet") ||
    normalizedType.includes("resort") ||
    normalizedType.includes("hotel") ||
    normalizedType.includes("lawn") ||
    normalizedType.includes("palace") ||
    normalizedType.includes("fort");

  const isCaterer = normalizedType.includes("cater");
  const isPhotographer = normalizedType.includes("photograph");
  const isMakeupArtist =
    normalizedType.includes("makeup") ||
    (normalizedType.includes("bridal") && normalizedType.includes("artist")) ||
    normalizedType.includes("mua");

  const normalizedSubcat = (fetchedSubcategoryName || "").toLowerCase();

  const isCocktailGown =
    normalizedType.includes("cocktail") ||
    normalizedType.includes("gown");

  const isBridalOutfitRent =
    normalizedType.includes("bridal outfit on rent") ||
    normalizedType.includes("bridal lehenga on rent") ||
    normalizedType.includes("bridal rental") ||
    normalizedType.includes("rental outfit") ||
    normalizedType.includes("lehenga on rent") ||
    (!isCocktailGown && normalizedType.includes("wear") && normalizedType.includes("rent"));

  const isBridalOutfit =
    !isCocktailGown &&
    !isBridalOutfitRent &&
    (normalizedType.includes("bridal") ||
      normalizedType.includes("outfit") ||
      normalizedType.includes("lehenga") ||
      normalizedType.includes("clothing") ||
      normalizedType.includes("apparel") ||
      normalizedType.includes("boutique") ||
      normalizedType.includes("fashion") ||
      normalizedType.includes("designer") ||
      normalizedType.includes("wear") ||
      normalizedType.includes("trousseau") ||
      normalizedType.includes("kanjeevaram") ||
      normalizedType.includes("saree") ||
      normalizedType.includes("silk"));

  const isAnyBridalOutfit = isBridalOutfit || isBridalOutfitRent || isCocktailGown;

  // Jewellery Detection Logic
  const hasJewellKeyword = normalizedType.includes("jewell") || normalizedType.includes("jewelry");
  const hasFloralKeyword = normalizedType.includes("flower") || normalizedType.includes("floral");
  const hasAccessorKeyword = normalizedType.includes("accessor");
  const isRent = normalizedType.includes("rent");

  const isVendorJewelleryContext = (hasJewellKeyword || hasFloralKeyword || hasAccessorKeyword) && !isAnyBridalOutfit;

  const isJewelleryRental = isVendorJewelleryContext && isRent;
  const isFlowerJewellery = isVendorJewelleryContext && !isJewelleryRental && hasFloralKeyword;
  const isAccessories = isVendorJewelleryContext && !isJewelleryRental && !isFlowerJewellery && (normalizedSubcat.includes("accessor") && !normalizedSubcat.includes("jewell") && !normalizedSubcat.includes("jewelry"));
  const isJewellery = isVendorJewelleryContext && !isJewelleryRental && !isFlowerJewellery && !isAccessories;

  const hasMasterProfile =
    isVenue ||
    isCaterer ||
    isPhotographer ||
    isMakeupArtist ||
    isJewellery ||
    isAccessories ||
    isFlowerJewellery ||
    isJewelleryRental ||
    isBridalOutfit ||
    isBridalOutfitRent ||
    isCocktailGown;

  const handleSave = async () => {
    if (onSave) await onSave(formData);
  };

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        {hasMasterProfile ? (
          <>
            <h4 className="mb-3 fw-bold">Facilities &amp; Features</h4>
            {isVenue && (
              <VenueMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isCaterer && (
              <CatererMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isPhotographer && (
              <PhotographerMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isMakeupArtist && (
              <MakeupArtistMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isJewellery && (
              <JewelleryMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isAccessories && (
              <AccessoriesMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isFlowerJewellery && (
              <FlowerJewelleryMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isJewelleryRental && (
              <JewelleryRentalMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isBridalOutfit && !isBridalOutfitRent && !isCocktailGown && (
              <BridalOutfitMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isBridalOutfitRent && (
              <RentalOutfitMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isCocktailGown && (
              <CocktailGownMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
          </>
        ) : (
          <>
            <h4 className="mb-3 fw-bold">Vendor details</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Offerings (comma-separated)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.offerings || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      offerings: e.target.value,
                    }))
                  }
                  placeholder="e.g. Wedding, Pre-Wedding, Portrait"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Delivery Time</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.delivery_time || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      delivery_time: e.target.value,
                    }))
                  }
                  placeholder="e.g. 2-3 weeks"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Travel Info</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.travel_info || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      travel_info: e.target.value,
                    }))
                  }
                  placeholder="e.g. Travel within city, All over India"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fs-16 fw-semibold">
                  HappyWedz Since
                </label>
                <input
                  type="text"
                  className="form-control fs-14"
                  value={formData.happywedz_since || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      happywedz_since: e.target.value,
                    }))
                  }
                  placeholder="e.g. 2020"
                />
              </div>
            </div>
          </>
        )}

        <button className="btn btn-primary mt-4 fs-14" type="button" onClick={handleSave}>
          {hasMasterProfile ? "Save facilities & features" : "Save profile"}
        </button>
      </div>
    </div>
  );
};

export default VendorFacilities;
