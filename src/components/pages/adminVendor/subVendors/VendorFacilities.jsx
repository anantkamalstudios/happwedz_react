import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import VenueMasterProfile from "./VenueMasterProfile";
import CatererMasterProfile from "./CatererMasterProfile";
import PhotographerMasterProfile from "./PhotographerMasterProfile";
import MakeupArtistMasterProfile from "./MakeupArtistMasterProfile";
import MehndiArtistMasterProfile from "./MehndiArtistMasterProfile";
import FloristMasterProfile from "./FloristMasterProfile";
import PanditMasterProfile from "./PanditMasterProfile";
import DjMasterProfile from "./DjMasterProfile";
import SangeetChoreographerMasterProfile from "./SangeetChoreographerMasterProfile";
import WeddingEntertainerMasterProfile from "./WeddingEntertainerMasterProfile";
import PreWeddingLocationMasterProfile from "./PreWeddingLocationMasterProfile";
import PreWeddingPhotographerMasterProfile from "./PreWeddingPhotographerMasterProfile";

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
  const [subcategories, setSubcategories] = useState([]);
  const [typeLoaded, setTypeLoaded] = useState(false);

  useEffect(() => {
    const fetchVendorType = async () => {
      if (vendor?.vendor_type_id) {
        try {
          const response = await axios.get(
            `https://happywedz.com/api/vendor-types/${vendor.vendor_type_id}`,
          );
          setFetchedVendorTypeName(response.data?.name || "");
          // Subcategories are embedded in the vendor type response
          setSubcategories(response.data?.subcategories || []);
        } catch (err) {
          console.error("Error fetching vendor type:", err);
        } finally {
          setTypeLoaded(true);
        }
      } else {
        setTypeLoaded(true);
      }
    };
    fetchVendorType();
  }, [vendor?.vendor_type_id]);

  const finalVendorTypeName = propVendorTypeName || fetchedVendorTypeName;
  const normalizedType = (finalVendorTypeName || "").toLowerCase();

  // Resolve subcategory name from the embedded subcategories list.
  // vendor.vendor_subcategory_id is the most reliable source — formData may not
  // have it populated until the user saves Basic Info.
  const activeSubcategoryId =
    formData.vendor_subcategory_id ||
    vendor?.vendor_subcategory_id;

  const resolvedSubcategoryName =
    subcategories.find(
      (s) => String(s.id) === String(activeSubcategoryId)
    )?.name || "";

  const normalizedSubcategory = resolvedSubcategoryName.toLowerCase();

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

  const isMehndi =
    normalizedType.includes("mehndi") ||
    normalizedType.includes("mehendi") ||
    normalizedType.includes("henna");

  const isFlorist =
    normalizedType.includes("florist") ||
    normalizedType.includes("florists") ||
    normalizedType.includes("flower");

  const isPandit =
    normalizedType.includes("pandit") ||
    normalizedType.includes("purohit") ||
    normalizedType.includes("priest");

  // Music & Dance subcategory detection — driven by subcategory name
  const isMusicAndDance =
    normalizedType.includes("music") ||
    normalizedType.includes("dance") ||
    normalizedType.includes("entertainment");

  const isDj =
    isMusicAndDance &&
    (normalizedSubcategory.includes("dj") ||
      normalizedSubcategory.includes("disc jockey"));

  const isSangeetChoreographer =
    isMusicAndDance &&
    (normalizedSubcategory.includes("choreograph") ||
      normalizedSubcategory.includes("sangeet choreograph") ||
      normalizedSubcategory.includes("dance choreograph"));

  const isWeddingEntertainer =
    isMusicAndDance &&
    (normalizedSubcategory.includes("entertainer") ||
      normalizedSubcategory.includes("entertainment") ||
      normalizedSubcategory.includes("performer"));

  // Pre-Wedding Shoot — subcategory-driven detection
  const isPreWeddingShoot =
    normalizedType.includes("pre-wedding") ||
    normalizedType.includes("pre wedding");

  const isPreWeddingLocation =
    isPreWeddingShoot &&
    (normalizedSubcategory.includes("location") ||
      normalizedSubcategory.includes("shoot location") ||
      normalizedSubcategory.includes("pre-wedding shoot location") ||
      normalizedSubcategory.includes("pre wedding shoot location"));

  const isPreWeddingPhotographer =
    isPreWeddingShoot &&
    (normalizedSubcategory.includes("photographer") ||
      normalizedSubcategory.includes("pre-wedding photographer") ||
      normalizedSubcategory.includes("pre wedding photographer"));

  const hasMasterProfile =
    isVenue ||
    isCaterer ||
    isPhotographer ||
    isMakeupArtist ||
    isMehndi ||
    isFlorist ||
    isPandit ||
    isDj ||
    isSangeetChoreographer ||
    isWeddingEntertainer ||
    isPreWeddingLocation ||
    isPreWeddingPhotographer;

  const handleSave = async () => {
    if (onSave) await onSave();
    if (onShowSuccess) onShowSuccess();
  };

  // Wait for vendor type + subcategories to load before deciding which profile to show.
  // This prevents the generic fallback from flashing before the correct profile renders.
  if (!typeLoaded) {
    return (
      <div className="my-5">
        <div className="p-3 border rounded bg-white text-center text-muted fs-14 py-5">
          Loading facilities...
        </div>
      </div>
    );
  }

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
            {isMehndi && (
              <MehndiArtistMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isFlorist && (
              <FloristMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isPandit && (
              <PanditMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isDj && (
              <DjMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isSangeetChoreographer && (
              <SangeetChoreographerMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isWeddingEntertainer && (
              <WeddingEntertainerMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isPreWeddingLocation && (
              <PreWeddingLocationMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isPreWeddingPhotographer && (
              <PreWeddingPhotographerMasterProfile
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
