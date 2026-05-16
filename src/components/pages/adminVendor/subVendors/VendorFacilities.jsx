import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import VenueMasterProfile from "./VenueMasterProfile";
import CatererMasterProfile from "./CatererMasterProfile";
import PhotographerMasterProfile from "./PhotographerMasterProfile";
import MakeupArtistMasterProfile from "./MakeupArtistMasterProfile";
import WeddingPlannerMasterProfile from "./WeddingPlannerMasterProfile";
import DecoratorMasterProfile from "./DecoratorMasterProfile";
import TrousseauPackerMasterProfile from "./TrousseauPackerMasterProfile";
import GiftMasterProfile from "./GiftMasterProfile";
import FavorMasterProfile from "./FavorMasterProfile";
import InvitationMasterProfile from "./InvitationMasterProfile";
import WeddingSuitMasterProfile from "./WeddingSuitMasterProfile";
import SherwaniMasterProfile from "./SherwaniMasterProfile";

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

  useEffect(() => {
    const fetchVendorType = async () => {
      if (vendor?.vendor_type_id) {
        try {
          const response = await axios.get(
            `https://happywedz.com/api/vendor-types/${vendor.vendor_type_id}`,
          );
          const typeData = response.data || {};
          const subcategoryId = formData.vendor_subcategory_id || vendor?.vendor_subcategory_id;
          const subcats = typeData.subcategories || [];
          const subcat = subcats.find(s => s.id == subcategoryId);
          
          if (subcat && subcat.name) {
            setFetchedVendorTypeName(subcat.name);
          } else {
            setFetchedVendorTypeName(typeData.name || "");
          }
        } catch (err) {
          console.error("Error fetching vendor type:", err);
        }
      }
    };
    fetchVendorType();
  }, [vendor?.vendor_type_id, formData.vendor_subcategory_id, vendor?.vendor_subcategory_id]);

  const finalVendorTypeName = propVendorTypeName || fetchedVendorTypeName;
  const normalizedType = (finalVendorTypeName || "").toLowerCase();
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

  const isWeddingPlanner =
    normalizedType.includes("planner") ||
    normalizedType.includes("event management") ||
    normalizedType.includes("wedding planning") ||
    normalizedType.includes("planning");

  const isDecorator =
    normalizedType.includes("decorator") ||
    normalizedType.includes("decor") ||
    normalizedType.includes("event styling");

  const isTrousseauPacker = normalizedType.includes("trousseau packer") || normalizedType.includes("trousseau pack");
  const isGift = normalizedType === "gifts" || normalizedType === "gift" || normalizedType.includes("gifting") || normalizedType === "invitation gifts";
  const isFavor = normalizedType.includes("favor") || normalizedType.includes("favour");
  const isInvitation = (normalizedType.includes("invitation") || normalizedType.includes("invite")) && !isGift;
  
  const isWeddingSuit = normalizedType.includes("wedding suit") || normalizedType.includes("suit");
  const isSherwani = normalizedType.includes("sherwani");

  const hasMasterProfile =
    isVenue || isCaterer || isPhotographer || isMakeupArtist || isWeddingPlanner || isDecorator || isTrousseauPacker || isGift || isFavor || isInvitation || isWeddingSuit || isSherwani;

  const handleSave = async () => {
    if (onSave) await onSave();
    if (onShowSuccess) onShowSuccess();
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
            {isWeddingPlanner && (
              <WeddingPlannerMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isDecorator && (
              <DecoratorMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isTrousseauPacker && (
              <TrousseauPackerMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isGift && (
              <GiftMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isFavor && (
              <FavorMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isInvitation && (
              <InvitationMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isWeddingSuit && (
              <WeddingSuitMasterProfile
                formData={formData}
                setFormData={setFormData}
                onSave={onSave}
                onShowSuccess={onShowSuccess}
                embedded
              />
            )}
            {isSherwani && (
              <SherwaniMasterProfile
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
