import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Modal, Offcanvas } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BedDouble,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  Filter,
  Heart,
  Images,
  LayoutGrid,
  List,
  MapPin,
  MessageCircleMore,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  X,
} from "lucide-react";
import {
  bookHotel,
  getHotelDetail,
  getHotelBookingDetails,
  getHotelFilters,
  reviewHotelBooking,
  suggestHotels,
  searchHotels,
} from "../../../../services/api/hotelApi";
import TripJackBookingReview from "./TripJackBookingReview";
import TripJackBookingStatus from "./TripJackBookingStatus";

const styles = `
  .hotel-list-page {
    background:
      radial-gradient(circle at top left, rgba(237, 17, 115, 0.08), transparent 26%),
      linear-gradient(180deg, #fbfbfd 0%, #f4f5f8 100%);
    min-height: 100vh;
  }

  .hotel-shell {
    width: min(1420px, calc(100% - 32px));
    margin: 0 auto;
    padding: 28px 0 48px;
  }

  .hotel-search-topbar {
    background: #fff;
    border: 1px solid rgba(31, 41, 55, 0.08);
    border-radius: 28px;
    box-shadow: 0 18px 50px rgba(17, 24, 39, 0.08);
    padding: 14px;
    position: sticky;
    top: 12px;
    z-index: 30;
  }

  .hotel-search-grid {
    display: grid;
    grid-template-columns: 1.7fr 1fr 1fr 1fr auto;
    gap: 10px;
    align-items: stretch;
  }

  .hotel-search-cell {
    border: 1px solid #ececf2;
    border-radius: 18px;
    background: linear-gradient(180deg, #fff 0%, #fbfbfd 100%);
    min-height: 74px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .hotel-search-cell--grow {
    position: relative;
  }

  .hotel-search-icon {
    width: 40px;
    height: 40px;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(237, 17, 115, 0.09);
    color: #ed1173;
    flex-shrink: 0;
  }

  .hotel-search-meta {
    min-width: 0;
  }

  .hotel-search-meta--grow {
    flex: 1;
    position: relative;
  }

  .hotel-search-label {
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #8b90a0;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .hotel-search-value {
    font-size: 15px;
    line-height: 1.25;
    color: #1f2430;
    font-weight: 800;
    word-break: break-word;
  }

  .hotel-search-subvalue {
    font-size: 12px;
    color: #5f6678;
    margin-top: 4px;
    font-weight: 600;
  }

  .hotel-search-subvalue--controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  .hotel-search-field-input {
    width: 100%;
    border: none;
    background: transparent;
    outline: none;
    padding: 0;
    color: #1f2430;
    font-size: 15px;
    font-weight: 800;
  }

  .hotel-search-field-input[type="date"] {
    font-weight: 700;
    color: #293042;
  }

  .hotel-search-mini-select {
    border: 1px solid #ececf2;
    border-radius: 999px;
    background: #fff5fa;
    color: #ab0f56;
    padding: 6px 10px;
    font-size: 11px;
    font-weight: 800;
    outline: none;
  }

  .hotel-search-dropdown {
    position: absolute;
    top: calc(100% + 14px);
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #ececf2;
    border-radius: 18px;
    box-shadow: 0 16px 40px rgba(17, 24, 39, 0.12);
    overflow: hidden;
    z-index: 50;
  }

  .hotel-search-choice {
    width: 100%;
    border: none;
    background: #fff;
    padding: 12px 14px;
    text-align: left;
    display: grid;
    gap: 2px;
    color: #202634;
    font-size: 13px;
    font-weight: 700;
  }

  .hotel-search-choice span {
    color: #7a8193;
    font-size: 11px;
    font-weight: 700;
  }

  .hotel-search-choice:hover {
    background: rgba(237, 17, 115, 0.05);
  }

  .hotel-search-choice--muted {
    color: #7a8193;
    cursor: default;
  }

  .hotel-search-cta {
    min-width: 136px;
    border: none;
    border-radius: 18px;
    background: linear-gradient(135deg, #ed1173, #f65196);
    color: #fff;
    font-weight: 800;
    padding: 0 24px;
    box-shadow: 0 14px 24px rgba(237, 17, 115, 0.24);
  }

  .hotel-more-options {
    color: #ed1173;
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    margin-top: 10px;
    padding-left: 8px;
  }

  .hotel-toolbar {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    margin: 22px 0 18px;
  }

  .hotel-toolbar-left,
  .hotel-toolbar-right {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  .hotel-breadcrumb {
    font-size: 12px;
    color: #6d7483;
    font-weight: 700;
  }

  .hotel-sort-pill,
  .hotel-view-pill,
  .hotel-fav-pill,
  .hotel-mobile-filter-btn {
    border: 1px solid #e7e8ef;
    background: #fff;
    border-radius: 14px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 700;
    color: #202634;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 6px 18px rgba(17, 24, 39, 0.04);
  }

  .hotel-sort-pill select {
    border: none;
    outline: none;
    background: transparent;
    font-weight: 800;
    color: #202634;
  }

  .hotel-results-copy {
    font-size: 14px;
    color: #485064;
    font-weight: 700;
  }

  .hotel-results-copy strong {
    color: #161c2b;
  }

  .hotel-view-pill.active,
  .hotel-fav-pill.active,
  .hotel-mobile-filter-btn {
    border-color: rgba(237, 17, 115, 0.22);
    color: #ed1173;
    background: rgba(237, 17, 115, 0.05);
  }

  .hotel-filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 18px;
  }

  .hotel-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px;
    border-radius: 999px;
    border: 1px solid rgba(237, 17, 115, 0.14);
    background: rgba(237, 17, 115, 0.06);
    color: #ab0f56;
    font-size: 12px;
    font-weight: 800;
  }

  .hotel-chip button {
    border: none;
    background: transparent;
    color: inherit;
    padding: 0;
    display: inline-flex;
  }

  .hotel-popular-strip {
    background: #fff;
    border: 1px solid #ececf2;
    border-radius: 16px;
    padding: 14px 18px;
    margin-bottom: 18px;
    box-shadow: 0 10px 28px rgba(17, 24, 39, 0.04);
    font-size: 14px;
    font-weight: 800;
    color: #212737;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .hotel-results-layout {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    gap: 22px;
    align-items: start;
  }

  .hotel-sidebar {
    position: sticky;
    top: 132px;
    max-height: calc(100vh - 152px);
  }

  .hotel-sidebar-card {
    background: #fff;
    border: 1px solid #ececf2;
    border-radius: 24px;
    box-shadow: 0 16px 40px rgba(17, 24, 39, 0.06);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: inherit;
  }

  .hotel-sidebar-head {
    padding: 18px 18px 14px;
    border-bottom: 1px solid #f0f1f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .hotel-sidebar-title {
    font-size: 18px;
    font-weight: 800;
    color: #1c2432;
  }

  .hotel-clear-btn {
    border: none;
    background: transparent;
    color: #ed1173;
    font-size: 12px;
    font-weight: 800;
    padding: 0;
  }

  .hotel-filter-block {
    padding: 16px 18px;
    border-top: 1px solid #f4f5f8;
  }

  .hotel-sidebar-scroll {
    overflow-y: auto;
    padding-bottom: 8px;
  }

  .hotel-sidebar-scroll::-webkit-scrollbar,
  .hotel-filter-content::-webkit-scrollbar {
    width: 8px;
  }

  .hotel-sidebar-scroll::-webkit-scrollbar-thumb,
  .hotel-filter-content::-webkit-scrollbar-thumb {
    background: rgba(237, 17, 115, 0.24);
    border-radius: 999px;
  }

  .hotel-filter-toggle {
    width: 100%;
    border: none;
    background: transparent;
    padding: 0;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 14px;
    font-weight: 800;
    color: #1f2430;
  }

  .hotel-filter-content {
    margin-top: 14px;
    display: grid;
    gap: 10px;
    max-height: 220px;
    overflow: auto;
    padding-right: 4px;
  }

  .hotel-filter-search {
    width: 100%;
    border: 1px solid #ececf2;
    border-radius: 12px;
    padding: 10px 12px;
    font-size: 13px;
    font-weight: 600;
    color: #263041;
    background: #fafbfc;
  }

  .hotel-filter-option {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    font-size: 13px;
    color: #4f5668;
    font-weight: 700;
  }

  .hotel-filter-option label {
    display: inline-flex;
    align-items: flex-start;
    gap: 10px;
    cursor: pointer;
    flex: 1;
  }

  .hotel-filter-option input {
    margin-top: 2px;
    accent-color: #ed1173;
  }

  .hotel-filter-count {
    color: #9aa1b2;
    font-size: 12px;
    font-weight: 800;
  }

  .hotel-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  .hotel-list {
    display: grid;
    gap: 16px;
  }

  .hotel-card {
    background: #fff;
    border: 1px solid #ececf2;
    border-radius: 24px;
    box-shadow: 0 16px 40px rgba(17, 24, 39, 0.06);
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    height: 100%;
    cursor: pointer;
  }

  .hotel-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 26px 48px rgba(17, 24, 39, 0.1);
    border-color: rgba(237, 17, 115, 0.16);
  }

  .hotel-card-image-wrap {
    position: relative;
    aspect-ratio: 16 / 10;
    background: linear-gradient(135deg, #f3f4f6, #e8ebf2);
  }

  .hotel-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hotel-image-pill,
  .hotel-fav-badge,
  .hotel-arrow-badge {
    position: absolute;
    z-index: 2;
    border-radius: 999px;
    background: rgba(17, 24, 39, 0.72);
    color: #fff;
    font-size: 12px;
    font-weight: 800;
    padding: 6px 10px;
    backdrop-filter: blur(10px);
  }

  .hotel-image-pill {
    left: 12px;
    bottom: 12px;
  }

  .hotel-fav-badge {
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .hotel-fav-badge.active {
    background: rgba(237, 17, 115, 0.92);
  }

  .hotel-arrow-badge {
    right: 12px;
    bottom: 12px;
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .hotel-image-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
    width: 38px;
    height: 38px;
    border: 1px solid rgba(255, 255, 255, 0.72);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    color: #1f2937;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 22px rgba(17, 24, 39, 0.2);
  }

  .hotel-image-nav.left {
    left: 12px;
  }

  .hotel-image-nav.right {
    right: 12px;
  }

  .hotel-card-body {
    padding: 16px 18px 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    height: calc(100% - 0px);
  }

  .hotel-title-row {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    align-items: flex-start;
  }

  .hotel-title-block {
    min-width: 0;
    flex: 1;
  }

  .hotel-name {
    margin: 0;
    color: #1b2231;
    font-size: 24px;
    line-height: 1.2;
    font-weight: 800;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .hotel-location {
    color: #687082;
    font-size: 13px;
    font-weight: 700;
    margin-top: 6px;
    display: inline-flex;
    gap: 6px;
    align-items: flex-start;
  }

  .hotel-stars {
    color: #ffb11a;
    display: inline-flex;
    gap: 2px;
    margin-top: 8px;
  }

  .hotel-rating-box {
    min-width: 92px;
    text-align: right;
  }

  .hotel-rating-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 12px;
    background: #1f2937;
    color: #fff;
    padding: 8px 10px;
    font-size: 12px;
    font-weight: 800;
  }

  .hotel-rating-meta {
    margin-top: 6px;
    color: #6d7483;
    font-size: 11px;
    font-weight: 700;
  }

  .hotel-meal-line {
    font-size: 13px;
    color: #222936;
    font-weight: 700;
  }

  .hotel-amenities {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .hotel-amenity-chip {
    border-radius: 999px;
    background: #f6f7fb;
    border: 1px solid #ececf2;
    color: #4f5668;
    padding: 6px 10px;
    font-size: 11px;
    font-weight: 800;
  }

  .hotel-price-row {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: flex-end;
    padding-top: 14px;
    border-top: 1px solid #f1f2f6;
  }

  .hotel-price-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .hotel-nightly {
    color: #71788a;
    font-size: 12px;
    font-weight: 700;
  }

  .hotel-total-price {
    color: #1c2332;
    font-size: 31px;
    line-height: 1;
    font-weight: 900;
  }

  .hotel-total-inline {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    flex-wrap: wrap;
  }

  .hotel-total-caption {
    font-size: 12px;
    color: #71788a;
    font-weight: 700;
  }

  .hotel-tax-copy {
    font-size: 11px;
    color: #9aa1b2;
    font-weight: 700;
  }

  .hotel-card-cta {
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #ed1173, #f65196);
    color: #fff;
    padding: 12px 16px;
    min-width: 126px;
    font-size: 13px;
    font-weight: 800;
    box-shadow: 0 12px 20px rgba(237, 17, 115, 0.2);
  }

  .hotel-list-card {
    display: grid;
    grid-template-columns: 290px minmax(0, 1fr) 220px;
    gap: 18px;
    align-items: stretch;
    padding: 16px;
  }

  .hotel-list-image-wrap {
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    min-height: 220px;
    background: linear-gradient(135deg, #f3f4f6, #e8ebf2);
  }

  .hotel-list-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px 0;
    min-width: 0;
  }

  .hotel-list-side {
    border-left: 1px solid #f0f1f5;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
  }

  .hotel-skeleton-card,
  .hotel-filter-skeleton {
    background: linear-gradient(90deg, #f2f3f7 25%, #fafbfc 37%, #f2f3f7 63%);
    background-size: 400% 100%;
    animation: hotelShimmer 1.4s ease infinite;
    border-radius: 18px;
  }

  @keyframes hotelShimmer {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }

  .hotel-empty,
  .hotel-error {
    background: #fff;
    border: 1px solid #ececf2;
    border-radius: 24px;
    padding: 40px 28px;
    text-align: center;
    box-shadow: 0 16px 40px rgba(17, 24, 39, 0.05);
  }

  .hotel-empty-title,
  .hotel-error-title {
    color: #1d2433;
    font-size: 20px;
    font-weight: 800;
    margin-top: 14px;
  }

  .hotel-empty-copy,
  .hotel-error-copy {
    color: #697183;
    font-size: 14px;
    margin-top: 8px;
    font-weight: 600;
  }

  .hotel-detail-shell {
    display: grid;
    gap: 20px;
  }

  .hotel-detail-breadcrumb {
    color: #6d7483;
    font-size: 12px;
    font-weight: 800;
  }

  .hotel-detail-card {
    background: #fff;
    border: 1px solid #ececf2;
    border-radius: 28px;
    box-shadow: 0 16px 40px rgba(17, 24, 39, 0.06);
    padding: 22px;
  }

  .hotel-detail-overview {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 22px;
    align-items: start;
  }

  .hotel-detail-header-row {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .hotel-detail-title {
    margin: 0;
    color: #1a2130;
    font-size: 34px;
    line-height: 1.15;
    font-weight: 900;
  }

  .hotel-detail-address {
    color: #5b6478;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
  }

  .hotel-map-link,
  .hotel-inline-link {
    color: #ed1173;
    font-size: 13px;
    font-weight: 800;
    text-decoration: none;
    border: none;
    background: transparent;
    padding: 0;
  }

  .hotel-detail-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  .hotel-detail-ghost-btn {
    border: 1px solid #e4e7ef;
    background: #fff;
    border-radius: 14px;
    color: #202634;
    font-size: 13px;
    font-weight: 800;
    padding: 10px 14px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .hotel-detail-gallery {
    display: grid;
    grid-template-columns: 1.55fr 0.95fr;
    gap: 14px;
    margin-bottom: 18px;
  }

  .hotel-detail-main-image,
  .hotel-detail-side-image {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    background: linear-gradient(135deg, #f3f4f6, #e8ebf2);
    cursor: pointer;
  }

  .hotel-detail-main-image {
    min-height: 360px;
  }

  .hotel-detail-side-stack {
    display: grid;
    gap: 14px;
  }

  .hotel-detail-side-image {
    min-height: 173px;
  }

  .hotel-detail-main-image img,
  .hotel-detail-side-image img,
  .hotel-room-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hotel-photo-overlay {
    position: absolute;
    right: 16px;
    bottom: 16px;
    background: rgba(17, 24, 39, 0.82);
    color: #fff;
    border-radius: 999px;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .hotel-detail-section {
    padding-top: 18px;
    border-top: 1px solid #f0f1f5;
    margin-top: 18px;
  }

  .hotel-detail-section h2,
  .hotel-room-section-title {
    color: #1b2231;
    font-size: 24px;
    font-weight: 900;
    margin: 0 0 10px;
  }

  .hotel-detail-copy {
    color: #4f5668;
    font-size: 14px;
    line-height: 1.8;
    font-weight: 600;
  }

  .hotel-detail-amenities {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .hotel-detail-amenity {
    border-radius: 999px;
    border: 1px solid #ececf2;
    background: #fafbfe;
    color: #485064;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .hotel-detail-side {
    display: grid;
    gap: 14px;
    position: sticky;
    top: 118px;
  }

  .hotel-summary-card,
  .hotel-mini-info-card {
    background: linear-gradient(180deg, #fff 0%, #fef8fc 100%);
    border: 1px solid #ececf2;
    border-radius: 22px;
    padding: 18px;
    box-shadow: 0 14px 28px rgba(17, 24, 39, 0.05);
  }

  .hotel-summary-room {
    color: #1b2231;
    font-size: 24px;
    font-weight: 900;
    line-height: 1.2;
    margin-bottom: 6px;
  }

  .hotel-summary-price {
    color: #1b2231;
    font-size: 36px;
    font-weight: 900;
    line-height: 1;
  }

  .hotel-summary-subcopy {
    color: #6d7483;
    font-size: 12px;
    font-weight: 700;
  }

  .hotel-status-badges,
  .hotel-room-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .hotel-status-badge {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
    border: 1px solid #ececf2;
    background: #fafbfe;
    color: #4f5668;
  }

  .hotel-status-badge.refundable {
    background: rgba(24, 160, 88, 0.08);
    border-color: rgba(24, 160, 88, 0.18);
    color: #0c7a40;
  }

  .hotel-status-badge.warning {
    background: rgba(237, 17, 115, 0.08);
    border-color: rgba(237, 17, 115, 0.18);
    color: #c31262;
  }

  .hotel-room-section-card {
    background: #fff;
    border: 1px solid #ececf2;
    border-radius: 28px;
    box-shadow: 0 16px 40px rgba(17, 24, 39, 0.06);
    overflow: hidden;
  }

  .hotel-room-section-head {
    padding: 22px;
    display: grid;
    gap: 18px;
    border-bottom: 1px solid #f0f1f5;
  }

  .hotel-room-toolbar,
  .hotel-room-filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .hotel-room-search {
    min-width: 260px;
    border: 1px solid #ececf2;
    border-radius: 14px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 700;
    color: #243042;
    background: #fafbfe;
  }

  .hotel-room-filter-chip {
    border: 1px solid #e5e8f0;
    background: #fff;
    color: #273042;
    border-radius: 14px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .hotel-room-filter-chip.active {
    background: rgba(237, 17, 115, 0.06);
    border-color: rgba(237, 17, 115, 0.22);
    color: #ed1173;
  }

  .hotel-room-option {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr) 220px;
    gap: 20px;
    padding: 20px 22px;
    border-top: 1px solid #f0f1f5;
  }

  .hotel-room-option:first-of-type {
    border-top: none;
  }

  .hotel-room-thumb {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    min-height: 216px;
    background: linear-gradient(135deg, #f3f4f6, #e8ebf2);
  }

  .hotel-room-meta {
    display: grid;
    gap: 12px;
    min-width: 0;
  }

  .hotel-room-title {
    color: #1b2231;
    font-size: 26px;
    font-weight: 900;
    line-height: 1.15;
    margin: 0;
  }

  .hotel-room-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    gap: 14px;
  }

  .hotel-room-nightly {
    color: #71788a;
    font-size: 12px;
    font-weight: 700;
  }

  .hotel-room-total {
    color: #1b2231;
    font-size: 34px;
    font-weight: 900;
    line-height: 1;
  }

  .hotel-whatsapp-btn {
    border: 1px solid rgba(37, 211, 102, 0.22);
    background: #fff;
    color: #148e45;
    border-radius: 14px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }

  .hotel-share-group {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: #5f6678;
    font-size: 13px;
    font-weight: 700;
  }

  .hotel-gallery-modal-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .hotel-gallery-modal-grid img {
    width: 100%;
    height: 240px;
    object-fit: cover;
    border-radius: 16px;
  }

  .hotel-detail-mobile-cta {
    display: none;
  }

  .hotel-mobile-filter-btn {
    display: none;
  }

  .hotel-load-more {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 18px 0 6px;
    color: #697183;
    font-size: 13px;
    font-weight: 800;
  }

  .hotel-scroll-sentinel {
    height: 2px;
  }

  @media (max-width: 1200px) {
    .hotel-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .hotel-search-grid {
      grid-template-columns: 1.4fr 1fr 1fr 1fr;
    }

    .hotel-search-cta {
      grid-column: 1 / -1;
      min-height: 58px;
    }
  }

  @media (max-width: 992px) {
    .hotel-shell {
      width: min(100% - 24px, 1400px);
    }

    .hotel-results-layout {
      grid-template-columns: minmax(0, 1fr);
    }

    .hotel-sidebar {
      display: none;
    }

    .hotel-mobile-filter-btn {
      display: inline-flex;
    }

    .hotel-list-card {
      grid-template-columns: 1fr;
    }

    .hotel-list-side {
      border-left: none;
      border-top: 1px solid #f0f1f5;
      padding-left: 0;
      padding-top: 16px;
      align-items: flex-start;
    }

    .hotel-detail-overview {
      grid-template-columns: 1fr;
    }

    .hotel-detail-side {
      position: static;
    }

    .hotel-room-option {
      grid-template-columns: 1fr;
    }

    .hotel-room-side {
      align-items: flex-start;
    }
  }

  @media (max-width: 768px) {
    .hotel-search-grid {
      grid-template-columns: 1fr;
    }

    .hotel-grid {
      grid-template-columns: 1fr;
    }

    .hotel-toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .hotel-toolbar-right {
      justify-content: space-between;
    }

    .hotel-card-body {
      padding: 14px;
    }

    .hotel-name {
      font-size: 20px;
    }

    .hotel-total-price {
      font-size: 28px;
    }

    .hotel-price-row {
      flex-direction: column;
      align-items: flex-start;
    }

    .hotel-card-cta {
      width: 100%;
    }

    .hotel-detail-card,
    .hotel-room-section-card {
      padding: 16px;
    }

    .hotel-detail-header-row,
    .hotel-room-section-head {
      flex-direction: column;
      align-items: stretch;
    }

    .hotel-detail-gallery {
      grid-template-columns: 1fr;
    }

    .hotel-detail-main-image {
      min-height: 260px;
    }

    .hotel-detail-side-image {
      min-height: 180px;
    }

    .hotel-room-search {
      min-width: 100%;
    }

    .hotel-gallery-modal-grid {
      grid-template-columns: 1fr;
    }

    .hotel-detail-mobile-cta {
      position: sticky;
      bottom: 12px;
      z-index: 35;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      margin-top: 18px;
      padding: 12px 14px;
      border-radius: 18px;
      background: rgba(27, 34, 49, 0.94);
      color: #fff;
      box-shadow: 0 16px 32px rgba(17, 24, 39, 0.22);
    }
  }
`;

const readPath = (value, path) =>
  path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), value);

const findFirstArray = (value, paths) => {
  for (const path of paths) {
    const match = readPath(value, path);
    if (Array.isArray(match)) return match;
  }
  return [];
};

const createCorrelationId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `corr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string" && error.trim()) return error;
  if (typeof error?.message === "string" && error.message.trim()) return error.message;
  if (typeof error?.response?.data?.message === "string" && error.response.data.message.trim()) {
    return error.response.data.message;
  }
  if (typeof error?.response?.data?.error === "string" && error.response.data.error.trim()) {
    return error.response.data.error;
  }
  return fallback;
};

const formatMoney = (value, currency = "INR", compact = false) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Price not available";
  const localeCurrency = currency === "INR" ? "INR" : currency;
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: localeCurrency,
    maximumFractionDigits: 0,
  }).format(amount);
  return compact ? formatted.replace("₹", "₹") : formatted;
};

const formatDate = (value) => {
  if (!value) return "Select date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getHotelId = (hotel) =>
  String(
    hotel?.tjid ||
      hotel?.tjHotelId ||
      hotel?.hotelId ||
      hotel?.hid ||
      hotel?.id ||
      hotel?.hotelCode ||
      "",
  );

const getReviewPayloadFields = (hotelInfo, selectedHotel, detailMeta, searchPayload, searchResponse) => {
  const searchIdCandidates = [
    detailMeta?.searchId,
    searchResponse?.metaData?.searchId,
    searchResponse?.searchId,
    searchPayload?.searchId,
    selectedHotel?.raw?.searchId,
  ]
    .filter(Boolean)
    .map((value) => String(value));

  const detailRequestIdCandidates = [
    detailMeta?.requestId,
    searchResponse?.metaData?.requestId,
    searchResponse?.requestId,
    hotelInfo?.requestId,
    hotelInfo?.detailRequestId,
    selectedHotel?.raw?.requestId,
  ]
    .filter(Boolean)
    .map((value) => String(value));

  const tjHotelIdCandidates = [
    hotelInfo?.tjid,
    hotelInfo?.tjHotelId,
    selectedHotel?.raw?.tjid,
    selectedHotel?.raw?.tjHotelId,
    selectedHotel?.raw?.hotelId,
  ]
    .filter(Boolean)
    .map((value) => String(value));

  return {
    searchId: searchIdCandidates[0] || "",
    detailRequestId: detailRequestIdCandidates[0] || "",
    tjHotelId: tjHotelIdCandidates[0] || "",
    candidates: {
      searchIdCandidates,
      detailRequestIdCandidates,
      tjHotelIdCandidates,
    },
  };
};

const buildDefaultTraveller = (passengerType, bookingRequirements) => {
  const isAdult = passengerType === "ADULT";
  return {
    ti: isAdult ? "Mr" : "Master",
    pt: passengerType,
    fN: "",
    lN: "",
    ...(bookingRequirements?.panRequired && isAdult ? { pan: "" } : {}),
    ...(bookingRequirements?.passportRequired && isAdult ? { pNum: "" } : {}),
  };
};

const getReviewRoomInfos = (reviewResponse) => {
  const selectedOption = reviewResponse?.selectedOption || {};
  if (Array.isArray(selectedOption?.roomInfos) && selectedOption.roomInfos.length > 0) {
    return selectedOption.roomInfos;
  }
  if (Array.isArray(selectedOption?.ris) && selectedOption.ris.length > 0) {
    return selectedOption.ris;
  }

  const fallbackAdults = Number(reviewResponse?.roomSummary?.adults || 1);
  const fallbackChildren = Number(reviewResponse?.roomSummary?.children || 0);
  return [
    {
      adt: fallbackAdults,
      chd: fallbackChildren,
    },
  ];
};

const createInitialBookingForm = (reviewResponse) => {
  const bookingRequirements = reviewResponse?.bookingRequirements || {};
  const roomTravellerInfo = getReviewRoomInfos(reviewResponse).map((roomInfo) => {
    const adultCount = Math.max(Number(roomInfo?.adt || 0), 1);
    const childCount = Math.max(Number(roomInfo?.chd || 0), 0);
    const travellerInfo = [
      ...Array.from({ length: adultCount }, () => buildDefaultTraveller("ADULT", bookingRequirements)),
      ...Array.from({ length: childCount }, () => buildDefaultTraveller("CHILD", bookingRequirements)),
    ];

    return { travellerInfo };
  });

  return {
    roomTravellerInfo,
    deliveryInfo: {
      emails: [""],
      contacts: [""],
      code: ["+91"],
    },
    termsAccepted: false,
  };
};

const validateBookingForm = (bookingForm, reviewResponse) => {
  const errors = [];
  const bookingRequirements = reviewResponse?.bookingRequirements || {};
  const roomTravellerInfo = Array.isArray(bookingForm?.roomTravellerInfo) ? bookingForm.roomTravellerInfo : [];

  if (roomTravellerInfo.length === 0) {
    errors.push("At least one traveller is required.");
  }

  roomTravellerInfo.forEach((room, roomIndex) => {
    const travellerInfo = Array.isArray(room?.travellerInfo) ? room.travellerInfo : [];
    if (travellerInfo.length === 0) {
      errors.push(`Room ${roomIndex + 1} needs at least one traveller.`);
      return;
    }

    travellerInfo.forEach((traveller, travellerIndex) => {
      if (!traveller?.fN?.trim()) {
        errors.push(`Enter first name for room ${roomIndex + 1}, traveller ${travellerIndex + 1}.`);
      }
      if (!traveller?.lN?.trim()) {
        errors.push(`Enter last name for room ${roomIndex + 1}, traveller ${travellerIndex + 1}.`);
      }
      if (traveller?.pt === "ADULT" && bookingRequirements?.panRequired) {
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(String(traveller?.pan || "").trim().toUpperCase())) {
          errors.push(`Enter a valid PAN for room ${roomIndex + 1}, traveller ${travellerIndex + 1}.`);
        }
      }
      if (traveller?.pt === "ADULT" && bookingRequirements?.passportRequired) {
        if (!/^[A-Z0-9]{6,20}$/i.test(String(traveller?.pNum || "").trim())) {
          errors.push(`Enter a valid passport number for room ${roomIndex + 1}, traveller ${travellerIndex + 1}.`);
        }
      }
    });
  });

  const email = String(bookingForm?.deliveryInfo?.emails?.[0] || "").trim();
  const phone = String(bookingForm?.deliveryInfo?.contacts?.[0] || "").trim();
  const code = String(bookingForm?.deliveryInfo?.code?.[0] || "").trim();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("Enter a valid contact email address.");
  }
  if (!phone || !/^[0-9]{7,15}$/.test(phone)) {
    errors.push("Enter a valid contact phone number.");
  }
  if (!code || !/^\+?\d{1,4}$/.test(code)) {
    errors.push("Enter a valid phone country code.");
  }
  if (!bookingForm?.termsAccepted) {
    errors.push("Accept the booking terms before proceeding.");
  }

  return errors;
};

const delay = (ms) => new Promise((resolve) => {
  window.setTimeout(resolve, ms);
});

const normalizeAmount = (value) => {
  const num = Number(value || 0);
  if (!Number.isFinite(num) || num <= 0) return 0;
  return Number(num.toFixed(2));
};

const getHotelImages = (hotel) => {
  const images = Array.isArray(hotel?.images) ? hotel.images : [];
  return images
    .map((image) => image?.url || image?.imageUrl || image?.path || image)
    .filter(Boolean);
};

const getHotelAddress = (hotel, searchPayload) => {
  const address = hotel?.address || {};
  return [
    address?.ctn,
    address?.sn,
    hotel?.cityName,
    hotel?.location,
    searchPayload?.searchQuery?.searchCriteria?.searchRegionName,
  ]
    .filter(Boolean)
    .join(", ");
};

const getDisplayRating = (score) => {
  const numeric = Number(score);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  return (numeric / 20).toFixed(1);
};

const getRatingLabel = (hotel) => hotel?.userRating?.label || "No rating";

const getPriceInfo = (hotel) => {
  const rate = Array.isArray(hotel?.rate) ? hotel.rate[0] : hotel?.rate?.[0];
  const nightlyPrice = Number(rate?.nightlyPrice ?? rate?.pricePerNight ?? hotel?.nightlyPrice);
  const totalPrice = Number(
    hotel?.minPrice ?? rate?.totalPrice ?? rate?.price?.totalPrice ?? hotel?.price,
  );

  return {
    nightlyPrice: Number.isFinite(nightlyPrice) ? nightlyPrice : null,
    totalPrice: Number.isFinite(totalPrice) ? totalPrice : null,
    currency: rate?.currency || hotel?.currency || "INR",
    mealBasis: rate?.mealbasis || rate?.mealBasis || hotel?.mealBasis || "Room Only",
    optionId: rate?.optionId || hotel?.optionId || "",
    supplierName: rate?.supplierName || hotel?.supplierName || "",
    cancellation: rate?.cancellation || hotel?.cancellation || null,
    isRefundable:
      rate?.cancellation?.isRefundable ??
      hotel?.cancellation?.isRefundable ??
      false,
  };
};

const getAmenities = (hotel) => {
  const preferred = [];
  const seen = new Set();

  if (Array.isArray(hotel?.tja)) {
    hotel.tja.forEach((group) => {
      if (Array.isArray(group?.am)) {
        group.am.forEach((item) => {
          const name = String(item?.name || item || "").trim();
          if (name && !seen.has(name.toLowerCase())) {
            seen.add(name.toLowerCase());
            preferred.push(name);
          }
        });
      }
    });
  }

  if (preferred.length === 0 && Array.isArray(hotel?.facilities)) {
    hotel.facilities.forEach((item) => {
      const name = String(item?.name || item || "").trim();
      if (name && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        preferred.push(name);
      }
    });
  }

  return preferred.slice(0, 4);
};

const normalizeHotel = (hotel, searchPayload) => {
  const images = getHotelImages(hotel);
  const priceInfo = getPriceInfo(hotel);
  return {
    id: getHotelId(hotel),
    name: hotel?.name || hotel?.hotelName || "Hotel",
    location: getHotelAddress(hotel, searchPayload),
    image: images[0] || "",
    imageCount: images.length,
    images,
    starRating: Number(hotel?.starRating || 0),
    userRating: getDisplayRating(hotel?.userRating?.score),
    userRatingLabel: getRatingLabel(hotel),
    ratingCount: Number(hotel?.userRating?.rc || 0),
    userFavourite: Boolean(hotel?.userFavourite),
    propertyType: hotel?.propertyType || "",
    amenities: getAmenities(hotel),
    priceInfo,
    raw: hotel,
  };
};

const extractHotels = (payload, searchPayload) =>
  findFirstArray(payload, [
    ["hotels"],
    ["data", "hotels"],
    ["searchResult", "hotels"],
    ["hotelSearchResult", "hotels"],
    ["hotelSearchResult", "searchResult", "hotels"],
    ["result", "hotels"],
  ])
    .map((hotel) => normalizeHotel(hotel, searchPayload))
    .filter((hotel) => hotel.id);

const extractSearchId = (payload) =>
  payload?.searchId ||
  payload?.data?.searchId ||
  payload?.searchResult?.searchId ||
  payload?.hotelSearchResult?.searchId ||
  "";

const extractHotelCount = (payload, fallbackCount = 0) =>
  Number(
    payload?.hotelCount ??
      payload?.data?.hotelCount ??
      payload?.searchResult?.hotelCount ??
      payload?.hotelSearchResult?.hotelCount ??
      fallbackCount,
  ) || fallbackCount;

const extractLastHotelId = (payload, hotels = []) =>
  payload?.lastHotelId ||
  payload?.data?.lastHotelId ||
  payload?.pagination?.lastHotelId ||
  payload?.data?.pagination?.lastHotelId ||
  hotels[hotels.length - 1]?.id ||
  "";

const mergeHotels = (currentHotels, incomingHotels) => {
  const merged = [...currentHotels];
  const seen = new Set(currentHotels.map((hotel) => hotel.id));

  incomingHotels.forEach((hotel) => {
    if (!hotel?.id) return;

    if (seen.has(hotel.id)) {
      const index = merged.findIndex((item) => item.id === hotel.id);
      if (index >= 0) merged[index] = hotel;
      return;
    }

    seen.add(hotel.id);
    merged.push(hotel);
  });

  return merged;
};

const normalizeFilterOption = (item) => ({
  value: String(item?.value ?? item?.label ?? item ?? ""),
  label: String(item?.label ?? item?.value ?? item ?? ""),
  count: Number(item?.count ?? 0) || 0,
  state: item?.state || "ENABLED",
});

const normalizeFilterKey = (name) => {
  const key = String(name || "").toLowerCase();
  if (key === "property type") return "propertyType";
  if (key === "popular places") return "popularPlaces";
  if (key === "rating") return "ratings";
  if (key === "user rating") return "userRating";
  if (key === "amenities") return "amenities";
  if (key === "free cancellation") return "cancellationPolicy";
  if (key === "price range") return "priceRange";
  if (key === "search by hotel name") return "hotelName";
  return key.replace(/\s+/g, "");
};

const extractFilterGroups = (payload) => {
  const groups = Array.isArray(payload?.filters)
    ? payload.filters
    : Array.isArray(payload?.data?.filters)
      ? payload.data.filters
      : [];

  return groups.map((group) => ({
    key: normalizeFilterKey(group?.name),
    name: group?.name || "",
    filterType: group?.filterType || "STATIC",
    options: Array.isArray(group?.options)
      ? group.options
          .map(normalizeFilterOption)
          .filter((item) => item.value && item.label && item.state !== "DISABLED")
      : [],
  }));
};

const buildDetailPayload = (hotel, searchPayload, searchResponse) => {
  const searchQuery = searchPayload?.searchQuery || {};
  const criteria = searchQuery.searchCriteria || {};
  return {
    searchQuery: {
      checkInDate: searchQuery.checkinDate,
      checkoutDate: searchQuery.checkoutDate,
      roomInfo: searchQuery.roomInfo || [],
      hotelSearchCriteria: {
        nationality: criteria.nationality || "106",
        countryOfResidence: criteria.countryOfResidence || "106",
        currency: criteria.currency || "INR",
      },
      searchPreferences: {
        hids: [hotel.id],
      },
      searchRegionId: criteria.city || "",
      searchRegionName: criteria.searchRegionName || "",
      searchRegionType: criteria.searchRegionType || searchQuery.searchType || "CITY",
      gstApplied: false,
      isLimitOptionAllowed: true,
    },
    searchId: searchResponse?.searchId || searchPayload?.searchId || "",
    userIntent: {
      optionId: hotel?.priceInfo?.optionId || "",
      supplierName: hotel?.priceInfo?.supplierName || "",
      price: Number.isFinite(hotel?.priceInfo?.totalPrice)
        ? String(hotel.priceInfo.totalPrice)
        : "",
    },
  };
};

const buildFilterPayload = (searchPayload, appliedFilters, searchResponse, sortOrder) => ({
  ...searchPayload,
  appliedFilters: {
    ...(searchPayload?.appliedFilters || {}),
    ...appliedFilters,
  },
  searchId: searchResponse?.searchId || searchPayload?.searchId || "",
  correlationId: searchPayload?.correlationId || createCorrelationId(),
  sortOrder,
});

const buildSearchPayload = (
  searchPayload,
  appliedFilters,
  searchResponse,
  sortOrder,
  lastHotelId = "",
) => ({
  ...buildFilterPayload(searchPayload, appliedFilters, searchResponse, sortOrder),
  pagination: {
    ...(searchPayload?.pagination || {}),
    pageSize:
      searchPayload?.pagination?.pageSize ||
      searchResponse?.pagination?.pageSize ||
      searchResponse?.data?.pagination?.pageSize ||
      15,
    lastHotelId,
  },
  allOptions: searchPayload?.allOptions ?? true,
  filterType: searchPayload?.filterType || "BOTH",
  searchId: extractSearchId(searchResponse) || searchPayload?.searchId || "",
});

const defaultFilters = () => ({
  hotelName: "",
  ratings: [],
  userRating: [],
  propertyType: [],
  mealType: [],
  cancellationPolicy: [],
  suppliers: [],
  amenities: [],
  brand: [],
  distance: [],
  popularPlaces: [],
  roomViews: [],
  priceRange: [],
  ramadanMeal: [],
  gstApplicable: [],
  onlyFavorites: false,
});

const parseJsonSafely = (value) => {
  if (!value || typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const dedupeStrings = (values) => {
  const seen = new Set();
  return values.filter((value) => {
    const normalized = String(value || "").trim();
    if (!normalized) return false;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const dedupeImages = (values) => {
  const seen = new Set();
  return values.filter((item) => {
    const url = String(item?.url || item || "").trim();
    if (!url) return false;
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
};

const normalizeImageItems = (items) =>
  dedupeImages(
    (Array.isArray(items) ? items : [])
      .map((item) => item?.url || item?.imageUrl || item?.path || item?.links?.[0]?.url || item)
      .filter(Boolean)
      .map((url) => ({ url })),
  );

const buildAddressParts = (address = {}) =>
  [
    address?.adr,
    address?.adr2,
    address?.ctn || address?.city?.name,
    address?.sn || address?.state?.name,
    address?.postalCode,
    address?.cn || address?.country?.name,
  ].filter(Boolean);

const buildAddressLabel = (address = {}) => buildAddressParts(address).join(", ");

const getRoomMetadata = (hotelInfo, roomInfo) => {
  const roomId = String(roomInfo?.id || roomInfo?.rid || roomInfo?.roomId || "");
  const roomMetaMap = hotelInfo?.oprmd || hotelInfo?.roomMeta || {};
  return roomMetaMap?.[roomId] || roomInfo || {};
};

const getRoomBedSummary = (roomMeta) => {
  const beds = Array.isArray(roomMeta?.bds)
    ? roomMeta.bds
    : Array.isArray(roomMeta?.radi?.bds)
      ? roomMeta.radi.bds
      : [];

  if (beds.length === 0) return "";

  return beds
    .map((bed) => `${bed?.bc || 1} ${bed?.bt || "Bed"}`.trim())
    .filter(Boolean)
    .join(", ");
};

const getRoomGuestSummary = (roomMeta, roomInfo) => {
  const maxGuests = Number(roomMeta?.mga ?? roomMeta?.radi?.mga ?? roomInfo?.mga ?? 0);
  const maxAdults = Number(roomMeta?.maa ?? roomMeta?.radi?.maa ?? roomInfo?.adt ?? 0);
  const maxChildren = Number(roomMeta?.mca ?? roomMeta?.radi?.mca ?? roomInfo?.chd ?? 0);

  if (!maxGuests && !maxAdults && !maxChildren) return "";

  const parts = [];
  if (maxGuests) parts.push(`Fits max. ${maxGuests} guest${maxGuests > 1 ? "s" : ""}`);
  else if (maxAdults) parts.push(`${maxAdults} adult${maxAdults > 1 ? "s" : ""}`);
  if (maxChildren) parts.push(`${maxChildren} child${maxChildren > 1 ? "ren" : ""}`);
  return parts.join(" • ");
};

const getCancellationLabel = (cnp) => {
  if (cnp?.ifra === true) return "Refundable";
  if (cnp?.inra === true) return "Non-refundable";
  if (cnp?.isRefundable === true) return "Refundable";
  return "Cancellation policy";
};

const getCancellationPenalties = (cnp) =>
  Array.isArray(cnp?.pd)
    ? cnp.pd.map((penalty) => ({
        from: penalty?.fdt || penalty?.from || "",
        to: penalty?.tdt || penalty?.to || "",
        amount: penalty?.am ?? penalty?.amount ?? "",
      }))
    : Array.isArray(cnp?.penalties)
      ? cnp.penalties
      : [];

const getNightCount = (searchPayload) => {
  const checkin = new Date(searchPayload?.searchQuery?.checkinDate || searchPayload?.searchQuery?.checkInDate);
  const checkout = new Date(searchPayload?.searchQuery?.checkoutDate || searchPayload?.searchQuery?.checkOutDate);
  if (Number.isNaN(checkin.getTime()) || Number.isNaN(checkout.getTime())) return 1;
  const diff = Math.round((checkout.getTime() - checkin.getTime()) / 86400000);
  return diff > 0 ? diff : 1;
};

const getRoomImages = (roomMeta) =>
  normalizeImageItems([
    ...(Array.isArray(roomMeta?.img) ? roomMeta.img.flatMap((item) => item?.links || item) : []),
    ...(Array.isArray(roomMeta?.imgs) ? roomMeta.imgs : []),
  ]);

const getRoomAmenities = (roomMeta) =>
  dedupeStrings([
    ...(Array.isArray(roomMeta?.fcs) ? roomMeta.fcs : []),
    ...(Array.isArray(roomMeta?.am) ? roomMeta.am.map((item) => item?.name || item) : []),
    ...(Array.isArray(roomMeta?.rexb?.BENEFIT)
      ? roomMeta.rexb.BENEFIT.flatMap((item) => item?.values || [])
      : []),
  ]);

const getRoomMealBasis = (option, roomInfo) => option?.mb || roomInfo?.mb || "Room Only";

const getOptionPanRequired = (hotelInfo, option, optionIndex) => {
  if (hotelInfo?.panRequired === true) return true;
  if (Array.isArray(hotelInfo?.filters?.panRequired)) {
    return hotelInfo.filters.panRequired.includes(optionIndex) ||
      hotelInfo.filters.panRequired.includes(option?.id)
      ? true
      : false;
  }
  return false;
};

const getOptionPanOptional = (hotelInfo, option, optionIndex) => {
  if (Array.isArray(hotelInfo?.filters?.panNotRequired)) {
    return hotelInfo.filters.panNotRequired.includes(optionIndex) ||
      hotelInfo.filters.panNotRequired.includes(option?.id)
      ? true
      : false;
  }
  return !getOptionPanRequired(hotelInfo, option, optionIndex);
};

const getOptionTotalPrice = (option, roomInfo) =>
  Number(option?.totalPrice ?? option?.tp ?? roomInfo?.totalPrice ?? roomInfo?.tp ?? 0);

const getOptionNightlyPrice = (option, roomInfo, nights) => {
  const direct = Number(option?.nightlyPrice ?? roomInfo?.nightlyPrice ?? 0);
  if (Number.isFinite(direct) && direct > 0) return direct;
  const total = getOptionTotalPrice(option, roomInfo);
  return total > 0 ? total / Math.max(1, nights) : 0;
};

const normalizeRoomOption = (option, optionIndex, hotelInfo, nights) => {
  const roomInfo = option?.roomInfos?.[0] || option?.ris?.[0] || {};
  const roomMeta = getRoomMetadata(hotelInfo, roomInfo);
  const images = getRoomImages(roomMeta);
  const amenities = getRoomAmenities(roomMeta);
  const totalPrice = getOptionTotalPrice(option, roomInfo);
  const nightlyPrice = getOptionNightlyPrice(option, roomInfo, nights);
  const mealBasis = getRoomMealBasis(option, roomInfo);
  const cancellation = option?.cnp || roomInfo?.cnp || {};
  const roomName = roomInfo?.srn || roomInfo?.rt || roomInfo?.rc || "Room";
  const supplierRoomType = roomInfo?.rc || roomInfo?.rt || roomName;

  return {
    id: String(option?.id || option?.optionId || `${optionIndex}`),
    optionIndex,
    roomId: String(roomInfo?.id || roomInfo?.rid || roomMeta?.rid || `${optionIndex}`),
    roomName,
    supplierRoomType,
    mealBasis,
    totalPrice: Number.isFinite(totalPrice) && totalPrice > 0 ? totalPrice : null,
    nightlyPrice: Number.isFinite(nightlyPrice) && nightlyPrice > 0 ? nightlyPrice : null,
    currency: option?.currency || option?.sc || roomInfo?.currency || "INR",
    cancellation,
    cancellationLabel: getCancellationLabel(cancellation),
    cancellationPenalties: getCancellationPenalties(cancellation),
    refundable: cancellation?.ifra === true || cancellation?.isRefundable === true,
    nonRefundable: cancellation?.inra === true,
    panRequired: getOptionPanRequired(hotelInfo, option, optionIndex),
    panOptional: getOptionPanOptional(hotelInfo, option, optionIndex),
    passportRequired: Boolean(hotelInfo?.passportRequired),
    adults: Number(roomInfo?.adt || 0),
    children: Number(roomInfo?.chd || 0),
    bedSummary: getRoomBedSummary(roomMeta),
    guestSummary: getRoomGuestSummary(roomMeta, roomInfo),
    images,
    image: images[0]?.url || "",
    amenities,
    view: Array.isArray(roomMeta?.vw)
      ? roomMeta.vw.join(", ")
      : Array.isArray(roomMeta?.radi?.vi)
        ? roomMeta.radi.vi.join(", ")
        : "",
    raw: option,
    roomInfo,
    roomMeta,
  };
};

const extractDetailHotelRoot = (payload) =>
  payload?.searchResult?.hotelInfos?.[0] ||
  payload?.data?.searchResult?.hotelInfos?.[0] ||
  payload?.hotel ||
  payload?.data?.hotel ||
  payload?.searchResult?.hotel ||
  payload?.hotelInfos?.[0] ||
  null;

const extractDetailMeta = (payload) => ({
  searchId:
    payload?.metaData?.searchId ||
    payload?.data?.metaData?.searchId ||
    payload?.searchQuery?.searchId ||
    payload?.id ||
    "",
  requestId:
    payload?.metaData?.requestId ||
    payload?.data?.metaData?.requestId ||
    payload?.requestId ||
    payload?.id ||
    "",
});

const normalizeHotelDetails = ({
  detailResponse,
  selectedHotel,
  searchPayload,
  selectedSuggestion,
}) => {
  const hotelInfo = extractDetailHotelRoot(detailResponse) || {};
  const description = parseJsonSafely(hotelInfo?.des || hotelInfo?.description || "");
  const nights = getNightCount(searchPayload);
  const listImages = normalizeImageItems(selectedHotel?.images || []);
  const hotelImages = normalizeImageItems(hotelInfo?.img || hotelInfo?.images || []);
  const options = (Array.isArray(hotelInfo?.ops) ? hotelInfo.ops : [])
    .map((option, index) => normalizeRoomOption(option, index, hotelInfo, nights))
    .filter((option) => option.id);
  const sortedOptions = [...options].sort((a, b) => (a.totalPrice || Infinity) - (b.totalPrice || Infinity));
  const cheapestOption = sortedOptions[0] || null;
  const amenitySet = dedupeStrings([
    ...(Array.isArray(hotelInfo?.fl) ? hotelInfo.fl.map(item => typeof item === 'object' && item !== null ? (item.name || item.nm || String(item)) : String(item || '')) : []),
    ...options.flatMap((option) => option.amenities),
  ]);
  const images = listImages.length > 0 ? dedupeImages([...listImages, ...hotelImages]) : dedupeImages([...hotelImages, ...options.flatMap((option) => option.images)]);
  const address = hotelInfo?.ad || {};
  const cityName =
    address?.ctn ||
    address?.city?.name ||
    searchPayload?.searchQuery?.searchCriteria?.searchRegionName ||
    selectedSuggestion?.displayName ||
    selectedHotel?.location ||
    "";
  const fullAddress = buildAddressLabel(address);
  const mapSource = hotelInfo?.gl?.lt && hotelInfo?.gl?.ln
    ? `${hotelInfo.gl.lt},${hotelInfo.gl.ln}`
    : fullAddress || cityName || hotelInfo?.name || selectedHotel?.name || "Hotel";
  const filterData = hotelInfo?.filters || {};

  return {
    meta: extractDetailMeta(detailResponse),
    id: String(hotelInfo?.tjid || hotelInfo?.id || selectedHotel?.id || ""),
    name: hotelInfo?.name || selectedHotel?.name || "Hotel",
    starRating: Number(hotelInfo?.rt || selectedHotel?.starRating || 0),
    address,
    cityName,
    fullAddress,
    mapInfo: {
      displayLocation: fullAddress || cityName || hotelInfo?.name || "Hotel",
      mapSrc: `https://maps.google.com/maps?q=${encodeURIComponent(mapSource)}&t=&z=13&ie=UTF8&iwloc=&output=embed`,
      openMapsHref: `https://www.google.com/maps?q=${encodeURIComponent(mapSource)}`,
    },
    description,
    headline: description?.headline || "",
    aboutText: description?.location || description?.amenities || description?.rooms || "",
    amenities: amenitySet,
    images,
    hotelInfo,
    options,
    cheapestOption,
    filters: filterData,
    passportRequired: Boolean(hotelInfo?.passportRequired),
    panRequired: Boolean(hotelInfo?.panRequired),
    listHotel: selectedHotel,
    nights,
  };
};

const getMealPlanOptions = (roomOptions) =>
  dedupeStrings(roomOptions.map((option) => option.mealBasis)).map((value) => ({
    label: value,
    value,
  }));

const normalizeHotelSuggestionLite = (suggestion) => {
  if (!suggestion) return null;

  const searchType =
    suggestion?.searchType ||
    suggestion?.searchRegionType ||
    suggestion?.regionType ||
    suggestion?.type ||
    "CITY";

  const city =
    suggestion?.city ||
    suggestion?.cityId ||
    suggestion?.regionId ||
    suggestion?.searchRegionId ||
    suggestion?.id ||
    "";

  const displayName =
    suggestion?.name ||
    suggestion?.displayName ||
    suggestion?.label ||
    suggestion?.searchRegionName ||
    suggestion?.cityName ||
    suggestion?.keyword ||
    "";

  const rawTjids = suggestion?.tjids || suggestion?.hids || suggestion?.hotelIds || [];
  const tjids = Array.isArray(rawTjids)
    ? rawTjids.map((item) => String(item)).filter(Boolean)
    : [];

  return {
    id: String(city || displayName || ""),
    city: String(city || ""),
    searchType: String(searchType || "CITY").toUpperCase(),
    searchRegionType: String(searchType || "CITY").toUpperCase(),
    searchRegionName: String(displayName || "").trim(),
    displayName: String(displayName || "").trim(),
    tjids,
    raw: suggestion,
  };
};

const buildRoomInfoFromCounts = ({ rooms, adults, children }) => {
  const roomCount = Math.max(1, Number(rooms) || 1);
  let adultsRemaining = Math.max(roomCount, Number(adults) || 1);
  let childrenRemaining = Math.max(0, Number(children) || 0);

  return Array.from({ length: roomCount }, (_, index) => {
    const roomsLeft = roomCount - index;
    const adultsForRoom = Math.max(1, Math.floor(adultsRemaining / roomsLeft));
    adultsRemaining -= adultsForRoom;

    const childrenForRoom = Math.floor(childrenRemaining / roomsLeft);
    childrenRemaining -= childrenForRoom;

    return {
      numberOfAdults: adultsForRoom,
      numberOfChild: childrenForRoom,
      childAge: Array.from({ length: childrenForRoom }, () => 6),
    };
  });
};

function SearchBar({ payload, suggestion, onBackToSearch }) {
  const roomInfo = payload?.searchQuery?.roomInfo || [];
  const totalRooms = roomInfo.length || 1;
  const adults = roomInfo.reduce((sum, room) => sum + Number(room?.numberOfAdults || 0), 0);
  const children = roomInfo.reduce((sum, room) => sum + Number(room?.numberOfChild || 0), 0);

  return (
    <div className="hotel-search-topbar">
      <div className="hotel-search-grid">
        <div className="hotel-search-cell">
          <div className="hotel-search-icon">
            <MapPin size={18} />
          </div>
          <div className="hotel-search-meta">
            <div className="hotel-search-label">City, Area or Property</div>
            <div className="hotel-search-value">
              {suggestion?.displayName || payload?.searchQuery?.searchCriteria?.searchRegionName || "Destination"}
            </div>
          </div>
        </div>

        <div className="hotel-search-cell">
          <div className="hotel-search-icon">
            <Search size={18} />
          </div>
          <div className="hotel-search-meta">
            <div className="hotel-search-label">Check-in</div>
            <div className="hotel-search-value">{formatDate(payload?.searchQuery?.checkinDate)}</div>
          </div>
        </div>

        <div className="hotel-search-cell">
          <div className="hotel-search-icon">
            <Search size={18} />
          </div>
          <div className="hotel-search-meta">
            <div className="hotel-search-label">Check-out</div>
            <div className="hotel-search-value">{formatDate(payload?.searchQuery?.checkoutDate)}</div>
          </div>
        </div>

        <div className="hotel-search-cell">
          <div className="hotel-search-icon">
            <Sparkles size={18} />
          </div>
          <div className="hotel-search-meta">
            <div className="hotel-search-label">Rooms & Guests</div>
            <div className="hotel-search-value">{`${totalRooms} Room${totalRooms > 1 ? "s" : ""}`}</div>
            <div className="hotel-search-subvalue">
              {`${adults} Adult${adults !== 1 ? "s" : ""}${children ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}`}
            </div>
          </div>
        </div>

        <button type="button" className="hotel-search-cta" onClick={onBackToSearch}>
          Search
        </button>
      </div>
      <a href="#0" className="hotel-more-options" onClick={(e) => e.preventDefault()}>
        More options ›
      </a>
    </div>
  );
}

function ResultHeader({
  destination,
  hotelCount,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  favoritesOnly,
  setFavoritesOnly,
  onOpenMobileFilters,
}) {
  return (
    <div className="hotel-toolbar">
      <div className="hotel-toolbar-left">
        <div className="hotel-breadcrumb">{`Home Hotels > ${destination}`}</div>
        <div className="hotel-sort-pill">
          <SlidersHorizontal size={14} />
          <span>Sort By:</span>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="popularity">Most Popular</option>
            <option value="priceLowToHigh">Price Low to High</option>
            <option value="priceHighToLow">Price High to Low</option>
          </select>
        </div>
        <div className="hotel-results-copy">
          {`Showing `}
          <strong>{hotelCount}</strong>
          {` hotels for `}
          <strong>{destination}</strong>
        </div>
      </div>

      <div className="hotel-toolbar-right">
        <button
          type="button"
          className="hotel-mobile-filter-btn"
          onClick={onOpenMobileFilters}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
        <button
          type="button"
          className={`hotel-view-pill ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          <LayoutGrid size={15} />
          Grid View
        </button>
        <button
          type="button"
          className={`hotel-view-pill ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          <List size={15} />
          List View
        </button>
        <button
          type="button"
          className={`hotel-fav-pill ${favoritesOnly ? "active" : ""}`}
          onClick={() => setFavoritesOnly((prev) => !prev)}
        >
          <Heart size={15} fill={favoritesOnly ? "currentColor" : "none"} />
          View Favourites
        </button>
      </div>
    </div>
  );
}

function FilterChips({ chips, onRemove, onClearAll }) {
  if (chips.length === 0) return null;

  return (
    <div className="hotel-filter-chips">
      {chips.map((chip) => (
        <span key={`${chip.group}-${chip.value}`} className="hotel-chip">
          {chip.label}
          <button type="button" onClick={() => onRemove(chip.group, chip.value)}>
            <X size={13} />
          </button>
        </span>
      ))}
      <span className="hotel-chip">
        Clear all
        <button type="button" onClick={onClearAll}>
          <X size={13} />
        </button>
      </span>
    </div>
  );
}

function FilterSkeleton() {
  return (
    <div className="hotel-sidebar-card">
      <div className="hotel-sidebar-head">
        <div className="hotel-filter-skeleton" style={{ width: 90, height: 18 }} />
        <div className="hotel-filter-skeleton" style={{ width: 56, height: 14 }} />
      </div>
      <div style={{ padding: 18 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} style={{ marginBottom: 22 }}>
            <div className="hotel-filter-skeleton" style={{ width: "55%", height: 16, marginBottom: 12 }} />
            {Array.from({ length: 4 }).map((__, optionIndex) => (
              <div
                key={optionIndex}
                className="hotel-filter-skeleton"
                style={{ width: "100%", height: 14, marginBottom: 10 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function HotelFilterSidebar({
  filterGroups,
  appliedFilters,
  toggleFilter,
  clearAllFilters,
  favoritesOnly,
  setFavoritesOnly,
  hotelNameQuery,
  setHotelNameQuery,
}) {
  const [collapsed, setCollapsed] = useState({});

  return (
    <div className="hotel-sidebar-card">
      <div className="hotel-sidebar-head">
        <div className="hotel-sidebar-title">Filter by</div>
        <button type="button" className="hotel-clear-btn" onClick={clearAllFilters}>
          Clear all filters
        </button>
      </div>

      <div className="hotel-sidebar-scroll">

      <div className="hotel-filter-block">
        <button type="button" className="hotel-filter-toggle">
          <span>Search by hotel name</span>
        </button>
        <div className="hotel-filter-content" style={{ maxHeight: "none" }}>
          <input
            className="hotel-filter-search"
            placeholder="Select by Hotel Name"
            value={hotelNameQuery}
            onChange={(e) => setHotelNameQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="hotel-filter-block">
        <div className="hotel-filter-option">
          <label>
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={() => setFavoritesOnly((prev) => !prev)}
            />
            <span>View favourites only</span>
          </label>
        </div>
      </div>

      {filterGroups.map((group) => (
        <div className="hotel-filter-block" key={group.key}>
          <button
            type="button"
            className="hotel-filter-toggle"
            onClick={() =>
              setCollapsed((prev) => ({ ...prev, [group.key]: !prev[group.key] }))
            }
          >
            <span>{group.name}</span>
            <span>{collapsed[group.key] ? "+" : "−"}</span>
          </button>
          {!collapsed[group.key] ? (
            <div className="hotel-filter-content">
              {group.options.map((option) => (
                <div className="hotel-filter-option" key={`${group.key}-${option.value}`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={(appliedFilters[group.key] || []).includes(option.value)}
                      onChange={() => toggleFilter(group.key, option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                  <span className="hotel-filter-count">{option.count ? `(${option.count})` : ""}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
      </div>
    </div>
  );
}

function HotelSearchBarEditable({ payload, suggestion, onBackToSearch }) {
  const navigate = useNavigate();
  const roomInfo = Array.isArray(payload?.searchQuery?.roomInfo) ? payload.searchQuery.roomInfo : [];
  const initialRooms = roomInfo.length || 1;
  const initialAdults = roomInfo.reduce((sum, room) => sum + Number(room?.numberOfAdults || 0), 0) || 1;
  const initialChildren = roomInfo.reduce((sum, room) => sum + Number(room?.numberOfChild || 0), 0);
  const currentSuggestion =
    normalizeHotelSuggestionLite(suggestion) ||
    normalizeHotelSuggestionLite({
      city: payload?.searchQuery?.searchCriteria?.city,
      tjids: payload?.searchQuery?.searchCriteria?.tjids,
      searchRegionName: payload?.searchQuery?.searchCriteria?.searchRegionName,
      searchRegionType: payload?.searchQuery?.searchCriteria?.searchRegionType,
    });

  const [destinationQuery, setDestinationQuery] = useState(currentSuggestion?.displayName || "");
  const [selectedDestination, setSelectedDestination] = useState(currentSuggestion);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [searchingSuggestions, setSearchingSuggestions] = useState(false);
  const [searchingHotels, setSearchingHotels] = useState(false);
  const [checkInDate, setCheckInDate] = useState(payload?.searchQuery?.checkinDate || "");
  const [checkOutDate, setCheckOutDate] = useState(payload?.searchQuery?.checkoutDate || "");
  const [rooms, setRooms] = useState(initialRooms);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);

  useEffect(() => {
    setDestinationQuery(currentSuggestion?.displayName || "");
    setSelectedDestination(currentSuggestion);
    setCheckInDate(payload?.searchQuery?.checkinDate || "");
    setCheckOutDate(payload?.searchQuery?.checkoutDate || "");
    setRooms(initialRooms);
    setAdults(initialAdults);
    setChildren(initialChildren);
  }, [
    currentSuggestion?.displayName,
    currentSuggestion?.city,
    payload?.searchQuery?.checkinDate,
    payload?.searchQuery?.checkoutDate,
    initialRooms,
    initialAdults,
    initialChildren,
  ]);

  useEffect(() => {
    const query = destinationQuery.trim();
    if (!query || query.length < 3) {
      setDestinationSuggestions([]);
      return undefined;
    }

    if (selectedDestination?.displayName === query) {
      return undefined;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setSearchingSuggestions(true);
        const response = await suggestHotels({ keyword: query });
        const rawSuggestions = Array.isArray(response)
          ? response
          : response?.suggestions || response?.data?.suggestions || response?.data || [];
        const normalized = rawSuggestions
          .map((item) => normalizeHotelSuggestionLite(item))
          .filter((item) => item?.displayName);
        setDestinationSuggestions(normalized);
        setShowDestinationSuggestions(true);
      } catch (error) {
        console.error("Unable to fetch hotel suggestions", error);
        setDestinationSuggestions([]);
      } finally {
        setSearchingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [destinationQuery, selectedDestination?.displayName]);

  const totalGuests = adults + children;

  const handleSelectDestination = (item) => {
    setSelectedDestination(item);
    setDestinationQuery(item?.displayName || "");
    setDestinationSuggestions([]);
    setShowDestinationSuggestions(false);
  };

  const handleSearch = async () => {
    if (!selectedDestination?.city || !selectedDestination?.displayName) {
      toast.error("Please select a destination from the suggestions.");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    const nextPayload = {
      searchQuery: {
        checkinDate: checkInDate,
        checkoutDate: checkOutDate,
        roomInfo: buildRoomInfoFromCounts({ rooms, adults, children }),
        searchCriteria: {
          city: selectedDestination.city,
          tjids: selectedDestination.tjids,
          nationality: payload?.searchQuery?.searchCriteria?.nationality || "106",
          countryOfResidence: payload?.searchQuery?.searchCriteria?.countryOfResidence || "106",
          currency: payload?.searchQuery?.searchCriteria?.currency || "INR",
          searchRegionName: selectedDestination.searchRegionName,
          searchRegionType: selectedDestination.searchRegionType,
        },
        searchType: selectedDestination.searchType || "CITY",
        gstApplied: Boolean(payload?.searchQuery?.gstApplied),
      },
      allOptions: true,
      appliedFilters: {
        ...defaultFilters,
        onlyFavorites: false,
      },
      pagination: {
        pageSize: 15,
        lastHotelId: "",
      },
      searchId: "",
      correlationId: createCorrelationId(),
      filterType: "BOTH",
      sortOrder: "popularity",
    };

    try {
      setSearchingHotels(true);
      const response = await searchHotels(nextPayload);
      navigate("/hotels", {
        state: {
          hotelSearchPayload: nextPayload,
          hotelSearchResponse: response,
          selectedHotelSuggestion: selectedDestination,
        },
      });
    } catch (error) {
      console.error("Unable to refresh hotel search", error);
      toast.error("Unable to refresh hotels right now. Please try again.");
    } finally {
      setSearchingHotels(false);
    }
  };

  return (
    <div className="hotel-search-topbar">
      <div className="hotel-search-grid">
        <div className="hotel-search-cell hotel-search-cell--grow">
          <div className="hotel-search-icon">
            <MapPin size={18} />
          </div>
          <div className="hotel-search-meta hotel-search-meta--grow">
            <div className="hotel-search-label">City, Area or Property</div>
            <input
              className="hotel-search-field-input"
              value={destinationQuery}
              placeholder="Search destination"
              onChange={(event) => {
                setDestinationQuery(event.target.value);
                setSelectedDestination(null);
                setShowDestinationSuggestions(true);
              }}
              onFocus={() => setShowDestinationSuggestions(true)}
            />
            {showDestinationSuggestions && (destinationSuggestions.length > 0 || searchingSuggestions) ? (
              <div className="hotel-search-dropdown">
                {searchingSuggestions ? (
                  <div className="hotel-search-choice hotel-search-choice--muted">Searching destinations...</div>
                ) : (
                  destinationSuggestions.map((item) => (
                    <button
                      key={`${item.id}-${item.displayName}`}
                      type="button"
                      className="hotel-search-choice"
                      onClick={() => handleSelectDestination(item)}
                    >
                      <strong>{item.displayName}</strong>
                      <span>{item.searchRegionType}</span>
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="hotel-search-cell">
          <div className="hotel-search-icon">
            <Search size={18} />
          </div>
          <div className="hotel-search-meta">
            <div className="hotel-search-label">Check-in</div>
            <input
              className="hotel-search-field-input"
              type="date"
              value={checkInDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(event) => setCheckInDate(event.target.value)}
            />
          </div>
        </div>

        <div className="hotel-search-cell">
          <div className="hotel-search-icon">
            <Search size={18} />
          </div>
          <div className="hotel-search-meta">
            <div className="hotel-search-label">Check-out</div>
            <input
              className="hotel-search-field-input"
              type="date"
              value={checkOutDate}
              min={checkInDate || new Date().toISOString().split("T")[0]}
              onChange={(event) => setCheckOutDate(event.target.value)}
            />
          </div>
        </div>

        <div className="hotel-search-cell">
          <div className="hotel-search-icon">
            <Sparkles size={18} />
          </div>
          <div className="hotel-search-meta">
            <div className="hotel-search-label">Rooms & Guests</div>
            <div className="hotel-search-value">{`${rooms} Room${rooms > 1 ? "s" : ""} · ${totalGuests} Guest${totalGuests > 1 ? "s" : ""}`}</div>
            <div className="hotel-search-subvalue hotel-search-subvalue--controls">
              <select className="hotel-search-mini-select" value={rooms} onChange={(event) => setRooms(Number(event.target.value))}>
                {[1, 2, 3, 4].map((value) => <option key={`room-${value}`} value={value}>{value} Room</option>)}
              </select>
              <select className="hotel-search-mini-select" value={adults} onChange={(event) => setAdults(Number(event.target.value))}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => <option key={`adult-${value}`} value={value}>{value} Adult</option>)}
              </select>
              <select className="hotel-search-mini-select" value={children} onChange={(event) => setChildren(Number(event.target.value))}>
                {[0, 1, 2, 3, 4].map((value) => <option key={`child-${value}`} value={value}>{value} Child</option>)}
              </select>
            </div>
          </div>
        </div>

        <button type="button" className="hotel-search-cta" onClick={handleSearch} disabled={searchingHotels}>
          {searchingHotels ? "Searching..." : "Search"}
        </button>
      </div>
      <a href="#0" className="hotel-more-options" onClick={(event) => { event.preventDefault(); onBackToSearch?.(); }}>
        More options ›
      </a>
    </div>
  );
}

function HotelCardSkeleton() {
  return (
    <div className="hotel-card">
      <div className="hotel-skeleton-card" style={{ aspectRatio: "16 / 10" }} />
      <div className="hotel-card-body">
        <div className="hotel-skeleton-card" style={{ width: "72%", height: 22 }} />
        <div className="hotel-skeleton-card" style={{ width: "48%", height: 14 }} />
        <div className="hotel-skeleton-card" style={{ width: "100%", height: 14 }} />
        <div className="hotel-skeleton-card" style={{ width: "86%", height: 14 }} />
        <div className="hotel-skeleton-card" style={{ width: "54%", height: 34, marginTop: 12 }} />
      </div>
    </div>
  );
}

function renderStars(count) {
  return Array.from({ length: Math.max(0, Math.min(5, Number(count) || 0)) }).map((_, index) => (
    <Star key={index} size={14} fill="currentColor" />
  ));
}

function HotelCard({ hotel, onClick }) {
  const images = hotel.images?.length ? hotel.images : hotel.image ? [hotel.image] : [];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [hotel.id]);

  const activeImage = images[activeImageIndex] || "";

  const handlePrevImage = (event) => {
    event.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (event) => {
    event.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="hotel-card" onClick={onClick}>
      <div className="hotel-card-image-wrap">
        {hotel.image ? (
          <img className="hotel-card-image" src={hotel.image} alt={hotel.name} />
        ) : null}
        <span className="hotel-image-pill">{`${hotel.imageCount || 1}/${hotel.imageCount || 1}`}</span>
        <span className={`hotel-fav-badge ${hotel.userFavourite ? "active" : ""}`}>
          <Heart size={16} fill={hotel.userFavourite ? "currentColor" : "none"} />
        </span>
        <span className="hotel-arrow-badge">›</span>
      </div>

      <div className="hotel-card-body">
        <div className="hotel-title-row">
          <div className="hotel-title-block">
            <h3 className="hotel-name">{hotel.name}</h3>
            <div className="hotel-location">
              <MapPin size={14} />
              <span>{hotel.location || "Location unavailable"}</span>
            </div>
            <div className="hotel-stars">{renderStars(hotel.starRating)}</div>
          </div>

          <div className="hotel-rating-box">
            {hotel.userRating ? (
              <>
                <div className="hotel-rating-badge">
                  <Star size={12} fill="currentColor" />
                  <span>{hotel.userRating}</span>
                </div>
                <div className="hotel-rating-meta">
                  <div>{hotel.userRatingLabel}</div>
                  <div>{hotel.ratingCount ? `(${hotel.ratingCount} Ratings)` : ""}</div>
                </div>
              </>
            ) : (
              <div className="hotel-rating-meta">No rating</div>
            )}
          </div>
        </div>

        <div className="hotel-meal-line">{hotel.priceInfo.mealBasis}</div>

        <div className="hotel-amenities">
          {hotel.amenities.length > 0
            ? hotel.amenities.map((amenity, index) => {
                const amenityText = typeof amenity === 'object' && amenity !== null 
                  ? (amenity.name || amenity.nm || JSON.stringify(amenity))
                  : String(amenity || '');
                return (
                  <span key={`${amenityText}-${index}`} className="hotel-amenity-chip">
                    {amenityText}
                  </span>
                );
              })
            : <span className="hotel-amenity-chip">Amenities unavailable</span>}
        </div>

        <div className="hotel-price-row">
          <div className="hotel-price-meta">
            <div className="hotel-nightly">
              {hotel.priceInfo.nightlyPrice
                ? `${formatMoney(hotel.priceInfo.nightlyPrice, hotel.priceInfo.currency)} /night`
                : "Nightly price unavailable"}
            </div>
            <div className="hotel-total-inline">
              <div className="hotel-total-price">
              {hotel.priceInfo.totalPrice
                ? formatMoney(hotel.priceInfo.totalPrice, hotel.priceInfo.currency, true)
                : "—"}
            </div>
              <div className="hotel-total-caption">Total</div>
            </div>
            <div className="hotel-tax-copy">Incl. of all taxes</div>
          </div>

          <button type="button" className="hotel-card-cta">
            Choose Room
          </button>
        </div>
      </div>
    </div>
  );
}

function HotelListCard({ hotel, onClick }) {
  return (
    <div className="hotel-card" onClick={onClick}>
      <div className="hotel-list-card">
        <div className="hotel-list-image-wrap">
          {hotel.image ? (
            <img className="hotel-card-image" src={hotel.image} alt={hotel.name} />
          ) : null}
          <span className="hotel-image-pill">{`${hotel.imageCount || 1}/${hotel.imageCount || 1}`}</span>
          <span className={`hotel-fav-badge ${hotel.userFavourite ? "active" : ""}`}>
            <Heart size={16} fill={hotel.userFavourite ? "currentColor" : "none"} />
          </span>
          <span className="hotel-arrow-badge">›</span>
        </div>

        <div className="hotel-list-main">
          <div className="hotel-title-block">
            <h3 className="hotel-name">{hotel.name}</h3>
            <div className="hotel-location">
              <MapPin size={14} />
              <span>{hotel.location || "Location unavailable"}</span>
            </div>
            <div className="hotel-stars">{renderStars(hotel.starRating)}</div>
          </div>

          <div className="hotel-meal-line">{hotel.priceInfo.mealBasis}</div>

          <div className="hotel-amenities">
            {hotel.amenities.length > 0
              ? hotel.amenities.map((amenity, index) => {
                  const amenityText = typeof amenity === 'object' && amenity !== null 
                    ? (amenity.name || amenity.nm || JSON.stringify(amenity))
                    : String(amenity || '');
                  return (
                    <span key={`${amenityText}-${index}`} className="hotel-amenity-chip">
                      {amenityText}
                    </span>
                  );
                })
              : <span className="hotel-amenity-chip">Amenities unavailable</span>}
          </div>
        </div>

        <div className="hotel-list-side">
          <div className="hotel-rating-box">
            {hotel.userRating ? (
              <>
                <div className="hotel-rating-badge">
                  <Star size={12} fill="currentColor" />
                  <span>{hotel.userRating}</span>
                </div>
                <div className="hotel-rating-meta">
                  <div>{hotel.userRatingLabel}</div>
                  <div>{hotel.ratingCount ? `(${hotel.ratingCount} Ratings)` : ""}</div>
                </div>
              </>
            ) : (
              <div className="hotel-rating-meta">No rating</div>
            )}
          </div>

          <div className="hotel-price-meta" style={{ textAlign: "right" }}>
            <div className="hotel-nightly">
              {hotel.priceInfo.nightlyPrice
                ? `${formatMoney(hotel.priceInfo.nightlyPrice, hotel.priceInfo.currency)} /night`
                : "Nightly price unavailable"}
            </div>
            <div className="hotel-total-inline" style={{ justifyContent: "flex-end" }}>
              <div className="hotel-total-price">
              {hotel.priceInfo.totalPrice
                ? formatMoney(hotel.priceInfo.totalPrice, hotel.priceInfo.currency, true)
                : "—"}
            </div>
              <div className="hotel-total-caption">Total</div>
            </div>
            <div className="hotel-tax-copy">Incl. of all taxes</div>
          </div>

          <button type="button" className="hotel-card-cta">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onClearAll }) {
  return (
    <div className="hotel-empty">
      <SlidersHorizontal size={26} color="#ed1173" />
      <div className="hotel-empty-title">No hotels match these filters</div>
      <div className="hotel-empty-copy">
        Try clearing a few filters or broaden your destination and price range.
      </div>
      <Button
        className="hotel-card-cta mt-3"
        style={{ width: "auto" }}
        onClick={onClearAll}
      >
        Clear all filters
      </Button>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="hotel-error">
      <X size={26} color="#ed1173" />
      <div className="hotel-error-title">Unable to load hotels</div>
      <div className="hotel-error-copy">
        Something went wrong while refreshing these results.
      </div>
      <Button
        className="hotel-card-cta mt-3"
        style={{ width: "auto" }}
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
}

function HotelDetailsSkeleton() {
  return (
    <div className="hotel-detail-shell">
      <div className="hotel-detail-card">
        <div className="hotel-skeleton-card" style={{ width: "28%", height: 16, marginBottom: 16 }} />
        <div className="hotel-skeleton-card" style={{ width: "44%", height: 34, marginBottom: 12 }} />
        <div className="hotel-skeleton-card" style={{ width: "76%", height: 16, marginBottom: 20 }} />
        <div className="hotel-detail-gallery">
          <div className="hotel-skeleton-card" style={{ minHeight: 320 }} />
          <div className="hotel-detail-side-stack">
            <div className="hotel-skeleton-card" style={{ minHeight: 152 }} />
            <div className="hotel-skeleton-card" style={{ minHeight: 152 }} />
          </div>
        </div>
      </div>
      <div className="hotel-room-section-card">
        <div className="hotel-room-section-head">
          <div className="hotel-skeleton-card" style={{ width: 240, height: 26 }} />
          <div className="hotel-skeleton-card" style={{ width: 320, height: 42 }} />
        </div>
        <div style={{ padding: 22 }}>
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="hotel-room-option">
              <div className="hotel-skeleton-card" style={{ minHeight: 220 }} />
              <div className="hotel-skeleton-card" style={{ minHeight: 220 }} />
              <div className="hotel-skeleton-card" style={{ minHeight: 220 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoomOptionSkeleton() {
  return (
    <div className="hotel-room-option">
      <div className="hotel-skeleton-card" style={{ minHeight: 220 }} />
      <div className="hotel-skeleton-card" style={{ minHeight: 220 }} />
      <div className="hotel-skeleton-card" style={{ minHeight: 220 }} />
    </div>
  );
}

function HotelHeader({ detailModel, onShowMap, onBackToResults }) {
  return (
    <div className="hotel-detail-card">
      <div className="hotel-detail-breadcrumb">
        {`Home > ${detailModel.cityName || "Hotels"} > ${detailModel.name}`}
      </div>

      <div className="hotel-detail-header-row mt-3">
        <div>
          <button type="button" className="hotel-inline-link mb-2" onClick={onBackToResults}>
            {"< Back to results"}
          </button>
          <h1 className="hotel-detail-title">{detailModel.name}</h1>
          {detailModel.starRating ? (
            <div className="hotel-stars mt-2">{renderStars(detailModel.starRating)}</div>
          ) : null}
          <div className="hotel-detail-address">
            <MapPin size={14} />
            <span>{detailModel.fullAddress || "Address unavailable"}</span>
            <button type="button" className="hotel-map-link" onClick={onShowMap}>
              Show on map
            </button>
          </div>
        </div>

        <div className="hotel-detail-actions">
          <button type="button" className="hotel-detail-ghost-btn">
            <Heart size={15} />
            Favourite
          </button>
          <button type="button" className="hotel-detail-ghost-btn">
            <Images size={15} />
            View
            <ChevronDown size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HotelGallery({ images, hotelName, onOpenGallery }) {
  const primary = images[0]?.url || "";
  const sideOne = images[1]?.url || primary;
  const sideTwo = images[2]?.url || images[1]?.url || primary;
  const remaining = Math.max(0, images.length - 3);

  const renderImage = (url, alt, className, index) => (
    <button type="button" className={className} onClick={() => onOpenGallery(index)}>
      {url ? <img src={url} alt={alt} /> : <div className="hotel-card-image hotel-card-image--empty">Image not available</div>}
    </button>
  );

  return (
    <div className="hotel-detail-gallery">
      {renderImage(primary, hotelName, "hotel-detail-main-image", 0)}
      <div className="hotel-detail-side-stack">
        {renderImage(sideOne, hotelName, "hotel-detail-side-image", 1)}
        <div style={{ position: "relative" }}>
          {renderImage(sideTwo, hotelName, "hotel-detail-side-image", 2)}
          <button type="button" className="hotel-photo-overlay" onClick={() => onOpenGallery(0)}>
            <Images size={14} />
            {remaining > 0 ? `+${remaining} photos` : `${images.length || 0} photos`}
          </button>
        </div>
      </div>
    </div>
  );
}

function HotelBookingSummaryCard({
  option,
  roomSummary,
  onViewDetails,
  onBookNow,
  onViewAllRooms,
  hotelPanRequired,
  hotelPassportRequired,
  reviewLoadingOptionId,
}) {
  if (!option) return null;

  const isReviewing = reviewLoadingOptionId === option.id;

  return (
    <div className="hotel-detail-side">
      <div className="hotel-summary-card">
        <div className="d-flex justify-content-between gap-3 align-items-start">
          <div>
            <div className="hotel-summary-room">{option.roomName}</div>
            <div className="hotel-summary-subcopy">{roomSummary}</div>
          </div>
          <button type="button" className="hotel-inline-link" onClick={() => onViewDetails(option)}>
            View details
          </button>
        </div>

        <div className="hotel-status-badges my-3">
          <span className="hotel-status-badge">{option.mealBasis}</span>
          <span className={`hotel-status-badge ${option.refundable ? "refundable" : "warning"}`}>
            {option.cancellationLabel}
          </span>
          <span className="hotel-status-badge">
            {option.panRequired || hotelPanRequired ? "PAN Required" : "PAN Optional"}
          </span>
          {option.passportRequired || hotelPassportRequired ? (
            <span className="hotel-status-badge">Passport Required</span>
          ) : null}
        </div>

        <div className="hotel-nightly mb-1">
          {option.nightlyPrice ? `${formatMoney(option.nightlyPrice, option.currency)} /night` : "Nightly price unavailable"}
        </div>
        <div className="hotel-summary-price">
          {option.totalPrice ? formatMoney(option.totalPrice, option.currency) : "Price unavailable"}
        </div>
        <div className="hotel-summary-subcopy mt-2">Total price for selected room</div>

        <button
          type="button"
          className="hotel-card-cta w-100 mt-3"
          onClick={() => onBookNow(option)}
          disabled={Boolean(reviewLoadingOptionId)}
        >
          {isReviewing ? "Reviewing..." : "Book Now"}
        </button>
      </div>

      <div className="hotel-summary-card">
        <div className="d-flex justify-content-between gap-3 align-items-center">
          <div>
            <div className="fw-bold fs-14">More options available</div>
            <div className="hotel-summary-subcopy mt-1">Compare all room types and inclusions</div>
          </div>
          <button type="button" className="hotel-detail-ghost-btn" onClick={onViewAllRooms}>
            View all rooms
          </button>
        </div>
      </div>

      <div className="hotel-mini-info-card">
        <div className="d-flex justify-content-between gap-3 flex-wrap">
          <div className="hotel-summary-subcopy">Check-in policy available in room details</div>
          <div className="hotel-summary-subcopy">Cancellation policy shown per room</div>
        </div>
      </div>
    </div>
  );
}

function HotelAboutSection({ aboutText, headline }) {
  const [expanded, setExpanded] = useState(false);
  if (!aboutText && !headline) return null;

  const copy = aboutText || headline;
  const shouldClamp = copy.length > 240;
  const visible = shouldClamp && !expanded ? `${copy.slice(0, 240).trim()}...` : copy;

  return (
    <section className="hotel-detail-section">
      <h2>About this property</h2>
      <div className="hotel-detail-copy">
        {visible}
        {shouldClamp ? (
          <button type="button" className="hotel-inline-link ms-1" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? "Read less" : "Read more"}
          </button>
        ) : null}
      </div>
    </section>
  );
}

function HotelAmenities({ amenities, onViewMore }) {
  if (!amenities.length) return null;

  return (
    <section className="hotel-detail-section">
      <div className="d-flex justify-content-between gap-3 align-items-center mb-3">
        <h2 className="mb-0">Amenities</h2>
        {amenities.length > 6 ? (
          <button type="button" className="hotel-inline-link" onClick={onViewMore}>
            View more
          </button>
        ) : null}
      </div>

      <div className="hotel-detail-amenities">
        {amenities.slice(0, 6).map((amenity, index) => {
          const amenityText = typeof amenity === 'object' && amenity !== null 
            ? (amenity.name || amenity.nm || JSON.stringify(amenity))
            : String(amenity || '');
          return (
            <span key={`${amenityText}-${index}`} className="hotel-detail-amenity">
              <Check size={14} color="#ed1173" />
              {amenityText}
            </span>
          );
        })}
      </div>
    </section>
  );
}

function RoomFilters({
  roomSearch,
  setRoomSearch,
  filterState,
  setFilterState,
  mealPlans,
  onOpenMobileFilters,
}) {
  return (
    <>
      <input
        className="hotel-room-search"
        placeholder="Search by Room Type/Room Category"
        value={roomSearch}
        onChange={(event) => setRoomSearch(event.target.value)}
      />
      <div className="hotel-room-filter-row">
        <button
          type="button"
          className={`hotel-room-filter-chip ${filterState.refundable ? "active" : ""}`}
          onClick={() => setFilterState((prev) => ({ ...prev, refundable: !prev.refundable }))}
        >
          Refundable
        </button>
        <button
          type="button"
          className={`hotel-room-filter-chip ${filterState.breakfastIncluded ? "active" : ""}`}
          onClick={() => setFilterState((prev) => ({ ...prev, breakfastIncluded: !prev.breakfastIncluded }))}
        >
          Breakfast Included
        </button>
        <button
          type="button"
          className={`hotel-room-filter-chip ${filterState.panOptional ? "active" : ""}`}
          onClick={() => setFilterState((prev) => ({ ...prev, panOptional: !prev.panOptional }))}
        >
          PAN Optional
        </button>
        <label className="hotel-room-filter-chip mb-0">
          Meal Plans
          <select
            value={filterState.mealPlan}
            onChange={(event) => setFilterState((prev) => ({ ...prev, mealPlan: event.target.value }))}
            style={{ border: "none", background: "transparent", fontWeight: 800, color: "#273042" }}
          >
            <option value="">All</option>
            {mealPlans.map((plan) => (
              <option key={plan.value} value={plan.value}>
                {plan.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="hotel-room-filter-chip hotel-mobile-filter-btn active" onClick={onOpenMobileFilters}>
          <Filter size={15} />
          Filter
        </button>
      </div>
    </>
  );
}

function RoomOptionCard({
  option,
  isSelected,
  onSelectRoom,
  onViewDetails,
  reviewLoadingOptionId,
}) {
  const isReviewing = reviewLoadingOptionId === option.id;

  return (
    <div className="hotel-room-option">
      <div className="hotel-room-thumb">
        {option.image ? <img src={option.image} alt={option.roomName} /> : <div className="hotel-card-image hotel-card-image--empty">Image not available</div>}
        <div className="hotel-photo-overlay">
          <Images size={14} />
          {option.images.length > 1 ? `+${option.images.length - 1} photos` : "Room photo"}
        </div>
      </div>

      <div className="hotel-room-meta">
        <div>
          <h3 className="hotel-room-title">{option.roomName}</h3>
          <div className="hotel-room-badges mt-2">
            <span className="hotel-detail-amenity"><BedDouble size={14} color="#ed1173" />{option.bedSummary || "Bed details unavailable"}</span>
            {option.guestSummary ? (
              <span className="hotel-detail-amenity"><UserRound size={14} color="#ed1173" />{option.guestSummary}</span>
            ) : null}
            {option.view ? (
              <span className="hotel-detail-amenity"><ExternalLink size={14} color="#ed1173" />{option.view} view</span>
            ) : null}
          </div>
        </div>

        <div className="hotel-status-badges">
          <span className="hotel-status-badge">{option.mealBasis}</span>
          <span className={`hotel-status-badge ${option.refundable ? "refundable" : "warning"}`}>{option.cancellationLabel}</span>
          <span className="hotel-status-badge">{option.panRequired ? "PAN Required" : "PAN Optional"}</span>
        </div>

        <div className="hotel-detail-amenities">
          {option.amenities.slice(0, 4).map((amenity, index) => {
            const amenityText = typeof amenity === 'object' && amenity !== null 
              ? (amenity.name || amenity.nm || JSON.stringify(amenity))
              : String(amenity || '');
            return (
              <span key={`${amenityText}-${index}`} className="hotel-detail-amenity">
                <Check size={14} color="#ed1173" />
                {amenityText}
              </span>
            );
          })}
        </div>

        <div className="d-flex justify-content-between gap-3 flex-wrap align-items-center">
          <button type="button" className="hotel-inline-link" onClick={() => onViewDetails(option)}>
            View more
          </button>
          <div className="hotel-summary-subcopy">
            {option.cancellationPenalties.length > 0 ? "Cancellation details available" : "No extra cancellation details"}
          </div>
        </div>
      </div>

      <div className="hotel-room-side">
        <div className="text-end">
          <div className="hotel-room-nightly">
            {option.nightlyPrice ? `${formatMoney(option.nightlyPrice, option.currency)} /night` : "Nightly price unavailable"}
          </div>
          <div className="hotel-room-total mt-2">
            {option.totalPrice ? formatMoney(option.totalPrice, option.currency) : "Price unavailable"}
          </div>
          <div className="hotel-summary-subcopy mt-2 d-inline-flex align-items-center gap-1">
            Total price for 1 room
            <CircleHelp size={13} />
          </div>
        </div>

        <button
          type="button"
          className="hotel-card-cta"
          style={isSelected ? { boxShadow: "0 0 0 3px rgba(237, 17, 115, 0.18)" } : undefined}
          onClick={() => onSelectRoom(option)}
          disabled={Boolean(reviewLoadingOptionId)}
        >
          {isReviewing ? "Reviewing..." : isSelected ? "Selected" : "Select Room"}
        </button>
      </div>
    </div>
  );
}

function RoomTypesSection({
  options,
  filteredOptions,
  roomSearch,
  setRoomSearch,
  filterState,
  setFilterState,
  mealPlans,
  selectedOptionId,
  onSelectRoom,
  onViewDetails,
  shareHref,
  onOpenMobileFilters,
  roomSectionRef,
  detailLoading,
  reviewLoadingOptionId,
}) {
  return (
    <div className="hotel-room-section-card" ref={roomSectionRef}>
      <div className="hotel-room-section-head">
        <div>
          <div className="hotel-room-section-title">Room types</div>
          <div className="hotel-summary-subcopy">
            {`Showing results ${filteredOptions.length} of ${options.length} room options`}
          </div>
        </div>

        <div className="hotel-room-toolbar">
          <div className="hotel-share-group">
            <span>Share by:</span>
            <a className="hotel-whatsapp-btn" href={shareHref} target="_blank" rel="noreferrer">
              <MessageCircleMore size={15} />
              WhatsApp
            </a>
          </div>
          <RoomFilters
            roomSearch={roomSearch}
            setRoomSearch={setRoomSearch}
            filterState={filterState}
            setFilterState={setFilterState}
            mealPlans={mealPlans}
            onOpenMobileFilters={onOpenMobileFilters}
          />
        </div>
      </div>

      {detailLoading && options.length === 0 ? (
        <div style={{ padding: 22 }}>
          <RoomOptionSkeleton />
          <RoomOptionSkeleton />
        </div>
      ) : filteredOptions.length === 0 ? (
        <div className="hotel-empty m-4">
          <div className="hotel-empty-title">No room options match these filters</div>
          <div className="hotel-empty-copy">Try a different meal plan or clear the room search.</div>
        </div>
      ) : (
        filteredOptions.map((option) => (
          <RoomOptionCard
            key={option.id}
            option={option}
            isSelected={selectedOptionId === option.id}
            onSelectRoom={onSelectRoom}
            onViewDetails={onViewDetails}
            reviewLoadingOptionId={reviewLoadingOptionId}
          />
        ))
      )}
    </div>
  );
}

function buildRoomModalOption(option) {
  return {
    key: option.id,
    roomName: option.roomName,
    mealBasis: option.mealBasis,
    bookingNotes: option.view || option.supplierRoomType || "",
    inclusions: option.amenities,
    pricing: {
      totalPrice: option.totalPrice,
      currency: option.currency,
    },
    cancellation: {
      penalties: option.cancellationPenalties,
    },
    raw: option.raw,
  };
}

function HotelDetailsPage({
  selectedHotel,
  detailResponse,
  detailLoading,
  initialPayload,
  initialSuggestion,
  onBackToResults,
  activeOption,
  roomModalOpen,
  setActiveOption,
  setRoomModalOpen,
}) {
  const roomSectionRef = useRef(null);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [roomSearch, setRoomSearch] = useState("");
  const [filterState, setFilterState] = useState({
    refundable: false,
    breakfastIncluded: false,
    panOptional: false,
    mealPlan: "",
  });
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showRoomFilters, setShowRoomFilters] = useState(false);
  const [reviewLoadingOptionId, setReviewLoadingOptionId] = useState("");
  const [reviewResponse, setReviewResponse] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [bookingForm, setBookingForm] = useState(null);
  const [showBookingFormModal, setShowBookingFormModal] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [showBookingStatusModal, setShowBookingStatusModal] = useState(false);
  const [bookingStatusState, setBookingStatusState] = useState({
    phase: "idle",
    bookingId: "",
    orderStatus: "",
    attempts: 0,
    message: "",
    details: null,
    errorCode: "",
  });

  const detailModel = useMemo(
    () =>
      normalizeHotelDetails({
        detailResponse,
        selectedHotel,
        searchPayload: initialPayload,
        selectedSuggestion: initialSuggestion,
      }),
    [detailResponse, initialPayload, initialSuggestion, selectedHotel],
  );
  const reviewPayloadFields = useMemo(
    () =>
      getReviewPayloadFields(
        detailModel.hotelInfo,
        selectedHotel,
        detailModel.meta,
        initialPayload,
        detailResponse || null,
      ),
    [detailModel.hotelInfo, detailModel.meta, selectedHotel, initialPayload, detailResponse],
  );

  useEffect(() => {
    if (detailModel.cheapestOption) {
      setSelectedOptionId((prev) => prev || detailModel.cheapestOption.id);
    }
  }, [detailModel.cheapestOption]);

  const selectedOption = useMemo(
    () =>
      detailModel.options.find((option) => option.id === selectedOptionId) ||
      detailModel.cheapestOption ||
      null,
    [detailModel.cheapestOption, detailModel.options, selectedOptionId],
  );

  const roomSummary = useMemo(() => {
    const roomInfo = initialPayload?.searchQuery?.roomInfo || [];
    const totalRooms = roomInfo.length || 1;
    const adults = roomInfo.reduce((sum, room) => sum + Number(room?.numberOfAdults || 0), 0);
    return `${totalRooms} Room${totalRooms > 1 ? "s" : ""} for ${adults || 1} Adult${adults === 1 ? "" : "s"}`;
  }, [initialPayload]);

  const mealPlans = useMemo(() => getMealPlanOptions(detailModel.options), [detailModel.options]);

  const filteredOptions = useMemo(() => {
    const query = roomSearch.trim().toLowerCase();
    return detailModel.options.filter((option) => {
      if (query) {
        const haystack = [option.roomName, option.supplierRoomType, option.view]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      if (filterState.refundable && !option.refundable) return false;
      if (filterState.breakfastIncluded && !option.mealBasis.toLowerCase().includes("breakfast")) return false;
      if (filterState.panOptional && option.panRequired) return false;
      if (filterState.mealPlan && option.mealBasis !== filterState.mealPlan) return false;

      return true;
    });
  }, [detailModel.options, filterState, roomSearch]);

  const shareHref = useMemo(() => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    return `https://wa.me/?text=${encodeURIComponent(`Check out ${detailModel.name} on HappyWedz ${currentUrl}`)}`;
  }, [detailModel.name]);

  const handleShowMap = () => {
    const section = document.getElementById("hotel-map");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelectRoom = (option, openModal = false) => {
    setSelectedOptionId(option.id);
    if (openModal) {
      setActiveOption(buildRoomModalOption(option));
      setRoomModalOpen(true);
    }
  };

  const handleReviewRoomOption = async (option, { openRoomModal = false } = {}) => {
    handleSelectRoom(option, openRoomModal);

    const payload = {
      searchId: reviewPayloadFields.searchId,
      detailRequestId: reviewPayloadFields.detailRequestId,
      optionId: option?.id || "",
      tjHotelId: reviewPayloadFields.tjHotelId,
    };

    if (!payload.searchId || !payload.detailRequestId || !payload.optionId || !payload.tjHotelId) {
      console.warn("TripJack HMS review payload missing", {
        payload,
        candidates: reviewPayloadFields.candidates,
      });
      toast.error("Missing review payload data. Please refresh hotel details and try again.");
      return;
    }

    console.log("TripJack HMS review payload", {
      searchId: payload.searchId,
      detailRequestId: payload.detailRequestId,
      optionId: payload.optionId,
      tjHotelId: payload.tjHotelId,
    });

    setReviewLoadingOptionId(option.id);

    try {
      const response = await reviewHotelBooking(payload);
      const enrichedReviewResponse = {
        ...response,
        displayHotelName:
          response?.hotelSummary?.name || response?.hotelInfo?.name || detailModel.name || "Selected hotel",
        displayRoomName:
          response?.roomSummary?.roomName ||
          response?.selectedOption?.roomInfos?.[0]?.rt ||
          response?.selectedOption?.roomInfos?.[0]?.srn ||
          response?.selectedOption?.ris?.[0]?.srn ||
          response?.selectedOption?.ris?.[0]?.rt ||
          option.roomName,
      };

      setBookingStatusState({
        phase: "idle",
        bookingId: "",
        orderStatus: "",
        attempts: 0,
        message: "",
        details: null,
        errorCode: "",
      });
      setReviewResponse(enrichedReviewResponse);
      setBookingForm(createInitialBookingForm(enrichedReviewResponse));
      setShowReviewModal(false);
      setShowBookingFormModal(true);
      setRoomModalOpen(false);
    } catch (error) {
      console.error("Unable to review hotel room option", error);
      toast.error("Unable to review this room option. Please try another room or search again.");
    } finally {
      setReviewLoadingOptionId("");
    }
  };

  const handleOpenBookingForm = () => {
    if (!reviewResponse?.bookingId) {
      toast.error("Review data is missing. Please review the room again.");
      return;
    }

    setBookingForm((current) => current || createInitialBookingForm(reviewResponse));
    setShowReviewModal(false);
    setShowBookingFormModal(true);
  };

  const handleTravellerFieldChange = (roomIndex, travellerIndex, field, value) => {
    setBookingForm((current) => {
      if (!current) return current;
      const roomTravellerInfo = current.roomTravellerInfo.map((room, currentRoomIndex) => {
        if (currentRoomIndex !== roomIndex) return room;
        return {
          ...room,
          travellerInfo: room.travellerInfo.map((traveller, currentTravellerIndex) =>
            currentTravellerIndex === travellerIndex
              ? { ...traveller, [field]: value }
              : traveller,
          ),
        };
      });

      return {
        ...current,
        roomTravellerInfo,
      };
    });
  };

  const handleContactFieldChange = (field, value) => {
    setBookingForm((current) => {
      if (!current) return current;
      return {
        ...current,
        deliveryInfo: {
          ...current.deliveryInfo,
          [field]: [value],
        },
      };
    });
  };

  const handleTermsChange = (checked) => {
    setBookingForm((current) => (current ? { ...current, termsAccepted: checked } : current));
  };

  const pollTripjackBookingStatus = async (bookingId) => {
    const maxAttempts = 36;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      if (attempt > 1) {
        await delay(5000);
      }

      try {
        const detailsResponse = await getHotelBookingDetails({ bookingId });
        const orderStatus = detailsResponse?.orderStatus || detailsResponse?.bookingStatusMeta?.rawStatus || "";
        const statusMeta = detailsResponse?.bookingStatusMeta || {};

        if (statusMeta.isSuccessTerminal) {
          setBookingStatusState({
            phase: "success",
            bookingId,
            orderStatus,
            attempts: attempt,
            message: "Booking confirmed successfully.",
            details: detailsResponse,
            errorCode: "",
          });
          return;
        }

        if (statusMeta.isFailureTerminal) {
          setBookingStatusState({
            phase: "failed",
            bookingId,
            orderStatus,
            attempts: attempt,
            message: "Booking failed in TripJack. Please review the details and try again.",
            details: detailsResponse,
            errorCode: "",
          });
          return;
        }

        setBookingStatusState({
          phase: "polling",
          bookingId,
          orderStatus,
          attempts: attempt,
          message: `Booking is still processing in TripJack. Checked ${attempt} of ${maxAttempts} times.`,
          details: detailsResponse,
          errorCode: "",
        });
      } catch (error) {
        console.error("Unable to fetch TripJack booking status", error);
        const tripjackDenied =
          error?.response?.data?.source === "TRIPJACK" &&
          error?.response?.data?.status?.success === false;

        if (tripjackDenied) {
          setBookingStatusState({
            phase: "denied",
            bookingId,
            orderStatus: "",
            attempts: 0,
            message: `TripJack denied the booking request: ${
              error?.response?.data?.error || "Access Denied"
            }`,
            details: error?.response?.data || null,
            errorCode: error?.response?.data?.errors?.[0]?.errCode || "",
          });
          return;
        }

        setBookingStatusState({
          phase: "polling",
          bookingId,
          orderStatus: "",
          attempts: attempt,
          message: "Waiting for the next booking status update from TripJack.",
          details: null,
          errorCode: "",
        });
      }
    }

    setBookingStatusState((current) => ({
      ...current,
      phase: "timeout",
      bookingId,
      message: "Booking is still processing, please check status later.",
      errorCode: "",
    }));
  };

  const handleProceedToBook = async () => {
    if (!reviewResponse?.bookingId || !bookingForm) {
      toast.error("Booking review data is missing. Please review the room again.");
      return;
    }

    const validationErrors = validateBookingForm(bookingForm, reviewResponse);
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    const payableAmount = normalizeAmount(reviewResponse?.priceSummary?.amount);
    if (!Number.isFinite(payableAmount) || payableAmount <= 0) {
      toast.error("Booking amount is unavailable. Please review the room again.");
      return;
    }

    const payload = {
      bookingId: reviewResponse.bookingId,
      roomTravellerInfo: bookingForm.roomTravellerInfo.map((room) => ({
        travellerInfo: room.travellerInfo.map((traveller) => ({
          ...traveller,
          fN: String(traveller.fN || "").trim(),
          lN: String(traveller.lN || "").trim(),
          ...(traveller.pan ? { pan: String(traveller.pan).trim().toUpperCase() } : {}),
          ...(traveller.pNum ? { pNum: String(traveller.pNum).trim().toUpperCase() } : {}),
        })),
      })),
      deliveryInfo: {
        emails: [String(bookingForm.deliveryInfo.emails[0] || "").trim()],
        contacts: [String(bookingForm.deliveryInfo.contacts[0] || "").trim()],
        code: [String(bookingForm.deliveryInfo.code[0] || "").trim()],
      },
      paymentInfos: [{ amount: payableAmount }],
      type: "HOTEL",
      ipr: Boolean(reviewResponse?.bookingRequirements?.panRequired),
      ipm: Boolean(reviewResponse?.bookingRequirements?.passportRequired),
      expectedAmount: payableAmount || undefined,
      hotelId: String(reviewResponse?.hotelInfo?.tjid || reviewResponse?.hotelSummary?.tjid || ""),
      optionId: String(reviewResponse?.selectedOption?.id || ""),
      reviewData: reviewResponse?.raw || reviewResponse,
    };

    setBookingSubmitting(true);
    setShowBookingStatusModal(true);
    setBookingStatusState({
      phase: "submitting",
      bookingId: payload.bookingId,
      orderStatus: "",
      attempts: 0,
      message: "Submitting booking request to TripJack.",
      details: null,
      errorCode: "",
    });

    try {
      const bookingResponse = await bookHotel(payload);

      const requestDenied =
        bookingResponse?.success === false ||
        bookingResponse?.tripjackRequestAccepted === false ||
        bookingResponse?.status?.success === false;

      if (requestDenied) {
        setShowBookingFormModal(false);
        setBookingStatusState({
          phase: "denied",
          bookingId: bookingResponse?.bookingId || payload.bookingId,
          orderStatus: "",
          attempts: 0,
          message: `TripJack denied the booking request: ${
            bookingResponse?.error || bookingResponse?.errors?.[0]?.message || "Access Denied"
          }`,
          details: bookingResponse,
          errorCode: bookingResponse?.errors?.[0]?.errCode || "",
        });
        return;
      }

      setShowBookingFormModal(false);
      setBookingStatusState({
        phase: "polling",
        bookingId: bookingResponse?.bookingId || payload.bookingId,
        orderStatus: "",
        attempts: 0,
        message: "Booking request accepted. Waiting for final TripJack status.",
        details: bookingResponse,
        errorCode: "",
      });

      await pollTripjackBookingStatus(bookingResponse?.bookingId || payload.bookingId);
    } catch (error) {
      console.error("Unable to create TripJack booking", error);
      const validationFailure = error?.response?.status === 400 || error?.response?.data?.source === "VALIDATION";
      const tripjackDenied =
        error?.response?.data?.source === "TRIPJACK" &&
        error?.response?.data?.status?.success === false;
      setBookingStatusState({
        phase: validationFailure ? "validation_failed" : tripjackDenied ? "denied" : "failed",
        bookingId: payload.bookingId,
        orderStatus: "",
        attempts: 0,
        message: validationFailure
          ? "Booking request validation failed. Please check traveller details and try again."
          : tripjackDenied
            ? `TripJack denied the booking request: ${error?.response?.data?.error || "Access Denied"}`
            : "Unable to submit this booking. Please review traveller details and try again.",
        details: error?.response?.data || null,
        errorCode: error?.response?.data?.errors?.[0]?.errCode || "",
      });
      toast.error(
        validationFailure
          ? "Booking request validation failed. Please check traveller details and try again."
          : tripjackDenied
            ? `TripJack denied the booking request: ${error?.response?.data?.error || "Access Denied"}`
          : "Unable to submit this booking. Please review traveller details and try again.",
      );
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleOpenGallery = (index) => {
    setGalleryIndex(index);
    setShowGalleryModal(true);
  };

  return (
    <div className="hotel-list-page">
      <style>{styles}</style>
      <div className="hotel-shell">
        <HotelSearchBarEditable
          payload={initialPayload}
          suggestion={initialSuggestion}
          onBackToSearch={onBackToResults}
        />

        {showBookingFormModal && reviewResponse && bookingForm ? (
          <TripJackBookingReview
            show={showBookingFormModal}
            onClose={() => setShowBookingFormModal(false)}
            reviewResponse={reviewResponse}
            bookingForm={bookingForm}
            onTravellerFieldChange={handleTravellerFieldChange}
            onContactFieldChange={handleContactFieldChange}
            onTermsChange={handleTermsChange}
            onSubmit={handleProceedToBook}
            bookingSubmitting={bookingSubmitting}
            formatMoney={formatMoney}
            formatDate={formatDate}
          />
        ) : detailLoading && !detailModel.name ? (
          <HotelDetailsSkeleton />
        ) : (
          <div className="hotel-detail-shell">
            <HotelHeader
              detailModel={detailModel}
              onShowMap={handleShowMap}
              onBackToResults={onBackToResults}
            />

            <div className="hotel-detail-overview">
              <div className="hotel-detail-card">
                <HotelGallery images={detailModel.images} hotelName={detailModel.name} onOpenGallery={handleOpenGallery} />
                <HotelAboutSection aboutText={detailModel.aboutText} headline={detailModel.headline} />
                <HotelAmenities amenities={detailModel.amenities} onViewMore={() => setShowAmenitiesModal(true)} />
              </div>

              <HotelBookingSummaryCard
                option={selectedOption}
                roomSummary={roomSummary}
                onViewDetails={(option) => handleSelectRoom(option, true)}
                onBookNow={(option) => handleReviewRoomOption(option)}
                onViewAllRooms={() => roomSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                hotelPanRequired={detailModel.panRequired}
                hotelPassportRequired={detailModel.passportRequired}
                reviewLoadingOptionId={reviewLoadingOptionId}
              />
            </div>

            <div className="hotel-detail-card" id="hotel-map">
              <div className="d-flex justify-content-between gap-3 align-items-center mb-3">
                <h2 className="mb-0">Location</h2>
                <a className="hotel-inline-link" href={detailModel.mapInfo.openMapsHref} target="_blank" rel="noreferrer">
                  Open in Google Maps
                </a>
              </div>
              <iframe
                src={detailModel.mapInfo.mapSrc}
                width="100%"
                height={360}
                style={{ border: 0, borderRadius: 16 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel map"
              />
            </div>

            <RoomTypesSection
              options={detailModel.options}
              filteredOptions={filteredOptions}
              roomSearch={roomSearch}
              setRoomSearch={setRoomSearch}
              filterState={filterState}
              setFilterState={setFilterState}
              mealPlans={mealPlans}
              selectedOptionId={selectedOptionId}
              onSelectRoom={(option) => handleReviewRoomOption(option)}
              onViewDetails={(option) => handleSelectRoom(option, true)}
              shareHref={shareHref}
              onOpenMobileFilters={() => setShowRoomFilters(true)}
              roomSectionRef={roomSectionRef}
              detailLoading={detailLoading}
              reviewLoadingOptionId={reviewLoadingOptionId}
            />

            {selectedOption ? (
              <div className="hotel-detail-mobile-cta">
                <div>
                  <div className="fw-bold">{selectedOption.roomName}</div>
                  <div className="hotel-summary-subcopy text-white-50">
                    {selectedOption.totalPrice ? formatMoney(selectedOption.totalPrice, selectedOption.currency) : "Price unavailable"}
                  </div>
                </div>
                <button
                  type="button"
                  className="hotel-card-cta"
                  onClick={() => handleReviewRoomOption(selectedOption)}
                  disabled={Boolean(reviewLoadingOptionId)}
                >
                  {reviewLoadingOptionId === selectedOption.id ? "Reviewing..." : "Book Now"}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <Modal show={showAmenitiesModal} onHide={() => setShowAmenitiesModal(false)} centered size="lg">
        <div className="modal-content rounded-4">
          <div className="modal-header border-0">
            <h5 className="modal-title">All amenities</h5>
            <button type="button" className="btn-close" onClick={() => setShowAmenitiesModal(false)} />
          </div>
          <div className="modal-body">
            <div className="hotel-detail-amenities">
              {detailModel.amenities.map((amenity, index) => {
                const amenityText = typeof amenity === 'object' && amenity !== null 
                  ? (amenity.name || amenity.nm || JSON.stringify(amenity))
                  : String(amenity || '');
                return (
                  <span key={`${amenityText}-${index}`} className="hotel-detail-amenity">
                    <Check size={14} color="#ed1173" />
                    {amenityText}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>

      <Modal show={showGalleryModal} onHide={() => setShowGalleryModal(false)} centered size="xl">
        <div className="modal-content rounded-4">
          <div className="modal-header border-0">
            <h5 className="modal-title">{detailModel.name} photos</h5>
            <button type="button" className="btn-close" onClick={() => setShowGalleryModal(false)} />
          </div>
          <div className="modal-body">
            {detailModel.images[galleryIndex]?.url ? (
              <img
                src={detailModel.images[galleryIndex].url}
                alt={detailModel.name}
                style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 18 }}
              />
            ) : null}
            <div className="hotel-gallery-modal-grid mt-3">
              {detailModel.images.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  style={{ border: "none", background: "transparent", padding: 0 }}
                  onClick={() => setGalleryIndex(index)}
                >
                  <img src={image.url} alt={`${detailModel.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Offcanvas show={showRoomFilters} onHide={() => setShowRoomFilters(false)} placement="bottom">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Room filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-grid gap-3">
            <input
              className="hotel-room-search"
              placeholder="Search by Room Type/Room Category"
              value={roomSearch}
              onChange={(event) => setRoomSearch(event.target.value)}
            />
            <button
              type="button"
              className={`hotel-room-filter-chip ${filterState.refundable ? "active" : ""}`}
              onClick={() => setFilterState((prev) => ({ ...prev, refundable: !prev.refundable }))}
            >
              Refundable
            </button>
            <button
              type="button"
              className={`hotel-room-filter-chip ${filterState.breakfastIncluded ? "active" : ""}`}
              onClick={() => setFilterState((prev) => ({ ...prev, breakfastIncluded: !prev.breakfastIncluded }))}
            >
              Breakfast Included
            </button>
            <button
              type="button"
              className={`hotel-room-filter-chip ${filterState.panOptional ? "active" : ""}`}
              onClick={() => setFilterState((prev) => ({ ...prev, panOptional: !prev.panOptional }))}
            >
              PAN Optional
            </button>
            <label className="hotel-room-filter-chip">
              Meal Plan
              <select
                value={filterState.mealPlan}
                onChange={(event) => setFilterState((prev) => ({ ...prev, mealPlan: event.target.value }))}
                style={{ border: "none", background: "transparent", fontWeight: 800 }}
              >
                <option value="">All</option>
                {mealPlans.map((plan) => (
                  <option key={plan.value} value={plan.value}>
                    {plan.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered size="lg">
        <div className="modal-content rounded-4">
          <div className="modal-header border-0">
            <div>
              <h5 className="modal-title">Booking Review</h5>
              <div className="fs-12 text-muted">TripJack review response received</div>
            </div>
            <button type="button" className="btn-close" onClick={() => setShowReviewModal(false)} />
          </div>
          <div className="modal-body">
            {reviewResponse ? (
              <div className="d-grid gap-3">
                <div className="border rounded-4 p-3 bg-light-subtle">
                  <div className="fw-bold mb-1">{reviewResponse.displayRoomName || "Selected room"}</div>
                  <div className="fs-14 text-muted">
                    {reviewResponse.displayHotelName || detailModel.name}
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <div className="text-muted fs-12 mb-1">Booking ID</div>
                      <div className="fw-bold">{reviewResponse.bookingId || "Unavailable"}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <div className="text-muted fs-12 mb-1">Total Amount</div>
                      <div className="fw-bold">
                        {reviewResponse?.priceSummary?.amount
                          ? formatMoney(
                              reviewResponse.priceSummary.amount,
                              reviewResponse.priceSummary.currency || "INR",
                            )
                          : "Price unavailable"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <div className="text-muted fs-12 mb-1">Base Fare</div>
                      <div className="fw-bold">
                        {reviewResponse?.priceSummary?.baseFare
                          ? formatMoney(
                              reviewResponse.priceSummary.baseFare,
                              reviewResponse.priceSummary.currency || "INR",
                            )
                          : "Not provided"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <div className="text-muted fs-12 mb-1">Taxes & Fees</div>
                      <div className="fw-bold">
                        {reviewResponse?.priceSummary?.taxesAndFees
                          ? formatMoney(
                              reviewResponse.priceSummary.taxesAndFees,
                              reviewResponse.priceSummary.currency || "INR",
                            )
                          : "Not provided"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <div className="text-muted fs-12 mb-1">Meal Basis</div>
                      <div className="fw-bold">{reviewResponse?.roomSummary?.mealBasis || "Not provided"}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <div className="text-muted fs-12 mb-1">PAN Requirement</div>
                      <div className="fw-bold">
                        {reviewResponse?.bookingRequirements?.panRequired ? "Required" : "Not required"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <div className="text-muted fs-12 mb-1">Passport Requirement</div>
                      <div className="fw-bold">
                        {reviewResponse?.bookingRequirements?.passportRequired ? "Required" : "Not required"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <div className="text-muted fs-12 mb-1">Refundability</div>
                      <div className="fw-bold">
                        {reviewResponse?.bookingRequirements?.isRefundable
                          ? "Refundable"
                          : reviewResponse?.bookingRequirements?.isNonRefundable
                            ? "Non-refundable"
                            : "Policy available"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <div className="text-muted fs-12 mb-1">Check-in Time</div>
                      <div className="fw-bold">
                        {reviewResponse?.hotelSummary?.checkInTime?.time ||
                          reviewResponse?.hotelSummary?.checkInTime?.from ||
                          reviewResponse?.hotelSummary?.checkInTime?.value ||
                          "Not provided"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <div className="text-muted fs-12 mb-1">Check-out Time</div>
                      <div className="fw-bold">
                        {reviewResponse?.hotelSummary?.checkOutTime?.time ||
                          reviewResponse?.hotelSummary?.checkOutTime?.to ||
                          reviewResponse?.hotelSummary?.checkOutTime?.value ||
                          "Not provided"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <div className="text-muted fs-12 mb-1">Hold Deadline</div>
                      <div className="fw-bold">
                        {reviewResponse?.bookingRequirements?.deadlineDatetime
                          ? formatDate(reviewResponse.bookingRequirements.deadlineDatetime)
                          : "Not provided"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-4 p-3">
                  <div className="fw-semibold mb-2">Cancellation Policy</div>
                  <div className="fs-14 text-muted">
                    {reviewResponse?.bookingRequirements?.isNonRefundable
                      ? "This room is non-refundable. Any cancellation may incur the full booking amount."
                      : reviewResponse?.bookingRequirements?.isRefundable
                        ? "Cancellation charges apply according to the hotel policy shown on the next step."
                        : "Hotel cancellation policy will be shown in the traveller details step."}
                  </div>
                </div>

                <div className="border rounded-4 p-3">
                  <div className="fw-semibold mb-2">Current Status</div>
                  <div className="fs-14 text-muted">
                    Review succeeded. Traveller details and final booking actions will be added in the next phase.
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="modal-footer border-0">
            <Button variant="outline-secondary" onClick={() => setShowReviewModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleOpenBookingForm} disabled={!reviewResponse?.bookingId}>
              Continue to Traveller Details
            </Button>
          </div>
        </div>
      </Modal>

      <TripJackBookingStatus
        show={showBookingStatusModal}
        statusState={bookingStatusState}
        reviewResponse={reviewResponse}
        onClose={() => setShowBookingStatusModal(false)}
        formatMoney={formatMoney}
      />

      {activeOption ? (
        <Modal show={roomModalOpen} onHide={() => setRoomModalOpen(false)} centered size="lg">
          <div className="modal-content rounded-4">
            <div className="modal-header border-0 pb-0">
              <div>
                <h5 className="modal-title fs-16">{activeOption.roomName}</h5>
                <div className="fs-12 text-muted">{activeOption.mealBasis}</div>
              </div>
              <button type="button" className="btn-close" onClick={() => setRoomModalOpen(false)} />
            </div>

            <div className="modal-body pt-2">
              <div className="fw-bold fs-14 mb-2">
                {formatMoney(activeOption.pricing.totalPrice, activeOption.pricing.currency)}
              </div>
              {activeOption.bookingNotes ? (
                <div className="fs-12 text-muted mb-2">{activeOption.bookingNotes}</div>
              ) : null}
              {activeOption.inclusions.length > 0 ? (
                <div className="fs-12 text-muted mb-2">
                  Inclusions: {activeOption.inclusions.join(", ")}
                </div>
              ) : null}
              {Array.isArray(activeOption.cancellation?.penalties) &&
              activeOption.cancellation.penalties.length > 0 ? (
                <div className="fs-12 text-muted">
                  {activeOption.cancellation.penalties
                    .map(
                      (penalty) =>
                        `${penalty.from || "—"} to ${penalty.to || "—"} (${penalty.amount ?? "—"})`,
                    )
                    .join(" • ")}
                </div>
              ) : (
                <div className="fs-12 text-muted">Cancellation policy not available.</div>
              )}
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

export default function HotelbedsHotelsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotelId } = useParams();

  const initialPayload = location.state?.hotelSearchPayload || null;
  const initialResponse = location.state?.hotelSearchResponse || null;
  const initialSuggestion = location.state?.selectedHotelSuggestion || null;

  const [searchResponse, setSearchResponse] = useState(initialResponse);
  const [loadedHotels, setLoadedHotels] = useState(() =>
    extractHotels(initialResponse, initialPayload),
  );
  const [filterGroups, setFilterGroups] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [resultsError, setResultsError] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailResponse, setDetailResponse] = useState(null);
  const [activeOption, setActiveOption] = useState(null);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [lastHotelId, setLastHotelId] = useState(() =>
    extractLastHotelId(initialResponse, extractHotels(initialResponse, initialPayload)),
  );
  const loadMoreRef = useRef(null);
  const appendRequestRef = useRef(false);

  const hotels = loadedHotels;

  const selectedHotel = useMemo(
    () => hotels.find((hotel) => hotel.id === hotelId) || null,
    [hotelId, hotels],
  );

  const hotelNameQuery = appliedFilters.hotelName || "";

  useEffect(() => {
    if (!initialPayload) return undefined;

    let active = true;
    setFiltersLoading(true);
    getHotelFilters(buildFilterPayload(initialPayload, appliedFilters, initialResponse, sortOrder))
      .then((response) => {
        if (!active) return;
        setFilterGroups(extractFilterGroups(response));
      })
      .catch((error) => {
        console.error(getErrorMessage(error, "Unable to load hotel filters"));
        if (active) setFilterGroups([]);
      })
      .finally(() => {
        if (active) setFiltersLoading(false);
      });

    return () => {
      active = false;
    };
  }, [initialPayload, initialResponse, sortOrder]);

  useEffect(() => {
    if (!initialPayload || hotelId) return undefined;

    let active = true;
    appendRequestRef.current = false;
    setResultsLoading(true);
    setResultsError("");

    searchHotels(buildSearchPayload(initialPayload, appliedFilters, searchResponse, sortOrder, ""))
      .then((response) => {
        if (!active) return;
        const nextHotels = extractHotels(response, initialPayload);
        const nextLastHotelId = extractLastHotelId(response, nextHotels);
        const nextHotelCount = extractHotelCount(response, nextHotels.length);
        setSearchResponse(response);
        setLoadedHotels(nextHotels);
        setLastHotelId(nextLastHotelId);
        setHasMoreResults(Boolean(nextLastHotelId) && nextHotels.length < nextHotelCount);
      })
      .catch((error) => {
        console.error(getErrorMessage(error, "Unable to refresh hotel results"));
        if (active) setResultsError("Unable to refresh hotel results");
      })
      .finally(() => {
        if (active) setResultsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [appliedFilters, hotelId, initialPayload, sortOrder]);

  useEffect(() => {
    if (!initialPayload || hotelId || !hasMoreResults || !lastHotelId) return undefined;

    const node = loadMoreRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        if (resultsLoading || loadingMore || appendRequestRef.current) return;

        let active = true;
        appendRequestRef.current = true;
        setLoadingMore(true);

        searchHotels(
          buildSearchPayload(initialPayload, appliedFilters, searchResponse, sortOrder, lastHotelId),
        )
          .then((response) => {
            if (!active) return;
            const incomingHotels = extractHotels(response, initialPayload);
            setSearchResponse(response);
            setLoadedHotels((prev) => {
              const mergedHotels = mergeHotels(prev, incomingHotels);
              const nextLastHotelId = extractLastHotelId(response, incomingHotels);
              const totalCount = extractHotelCount(response, mergedHotels.length);
              setLastHotelId(nextLastHotelId);
              setHasMoreResults(
                Boolean(nextLastHotelId) &&
                  incomingHotels.length > 0 &&
                  mergedHotels.length < totalCount,
              );
              return mergedHotels;
            });
          })
          .catch((error) => {
            console.error(getErrorMessage(error, "Unable to load more hotel results"));
          })
          .finally(() => {
            if (active) setLoadingMore(false);
            appendRequestRef.current = false;
          });
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [
    appliedFilters,
    hasMoreResults,
    hotelId,
    initialPayload,
    lastHotelId,
    loadingMore,
    resultsLoading,
    searchResponse,
    sortOrder,
  ]);
  useEffect(() => {
    if (!hotelId || !selectedHotel || !initialPayload) return undefined;

    let active = true;
    setDetailLoading(true);
    getHotelDetail(buildDetailPayload(selectedHotel, initialPayload, searchResponse))
      .then((response) => {
        if (!active) return;
        setDetailResponse(response);
      })
      .catch((error) => {
        console.error(getErrorMessage(error, "Unable to load hotel detail"));
        if (active) setDetailResponse(null);
      })
      .finally(() => {
        if (active) setDetailLoading(false);
      });

    return () => {
      active = false;
    };
  }, [hotelId, initialPayload, searchResponse, selectedHotel]);

  const clearAllFilters = () => {
    setAppliedFilters(defaultFilters());
    setFavoritesOnly(false);
  };

  const toggleFilter = (group, value) => {
    setAppliedFilters((prev) => {
      const currentValues = Array.isArray(prev[group]) ? prev[group] : [];
      const exists = currentValues.includes(value);
      return {
        ...prev,
        [group]: exists
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

  const removeFilterChip = (group, value) => {
    if (group === "onlyFavorites") {
      setFavoritesOnly(false);
      return;
    }
    if (group === "hotelName") {
      setAppliedFilters((prev) => ({ ...prev, hotelName: "" }));
      return;
    }
    toggleFilter(group, value);
  };

  const selectedFilterChips = useMemo(() => {
    const chips = [];

    Object.entries(appliedFilters).forEach(([group, value]) => {
      if (group === "hotelName" && String(value || "").trim()) {
        chips.push({ group, value, label: `Hotel: ${value}` });
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          const label =
            filterGroups
              .find((filterGroup) => filterGroup.key === group)
              ?.options.find((option) => option.value === item)?.label || item;
          chips.push({ group, value: item, label });
        });
      }
    });

    if (favoritesOnly) {
      chips.push({ group: "onlyFavorites", value: "1", label: "Favourites only" });
    }

    return chips;
  }, [appliedFilters, favoritesOnly, filterGroups]);

  const visibleHotels = useMemo(() => {
    let nextHotels = [...hotels];

    if (hotelNameQuery.trim()) {
      const query = hotelNameQuery.trim().toLowerCase();
      nextHotels = nextHotels.filter((hotel) => hotel.name.toLowerCase().includes(query));
    }

    if (favoritesOnly) {
      nextHotels = nextHotels.filter((hotel) => hotel.userFavourite);
    }

    return nextHotels;
  }, [favoritesOnly, hotelNameQuery, hotels]);

  const destinationName =
    initialSuggestion?.displayName ||
    initialPayload?.searchQuery?.searchCriteria?.searchRegionName ||
    "Hotels";

  const hotelCount =
    Number(
      searchResponse?.hotelCount ??
      searchResponse?.data?.hotelCount ??
      hotels.length,
    ) || hotels.length;

  if (selectedHotel) {
    return (
      <HotelDetailsPage
        selectedHotel={selectedHotel}
        detailResponse={detailResponse}
        detailLoading={detailLoading}
        initialPayload={initialPayload}
        initialSuggestion={initialSuggestion}
        onBackToResults={() => navigate("/hotels", { state: location.state })}
        activeOption={activeOption}
        roomModalOpen={roomModalOpen}
        setActiveOption={setActiveOption}
        setRoomModalOpen={setRoomModalOpen}
      />
    );
  }

  return (
    <div className="hotel-list-page">
      <style>{styles}</style>
      <div className="hotel-shell">
        <HotelSearchBarEditable
          payload={initialPayload}
          suggestion={initialSuggestion}
          onBackToSearch={() => navigate("/honeymoon")}
        />

        <ResultHeader
          destination={destinationName}
          hotelCount={hotelCount}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewMode={viewMode}
          setViewMode={setViewMode}
          favoritesOnly={favoritesOnly}
          setFavoritesOnly={setFavoritesOnly}
          onOpenMobileFilters={() => setShowMobileFilters(true)}
        />

        <FilterChips
          chips={selectedFilterChips}
          onRemove={removeFilterChip}
          onClearAll={clearAllFilters}
        />

        <div className="hotel-popular-strip">
          <Sparkles size={16} color="#ed1173" />
          <span>{`Popular in ${destinationName}`}</span>
        </div>

        {!initialPayload ? (
          <div className="hotel-empty">
            <div className="hotel-empty-title">No hotel search loaded</div>
            <div className="hotel-empty-copy">
              Start from the honeymoon hotel search to view results here.
            </div>
          </div>
        ) : (
          <div className="hotel-results-layout">
            <aside className="hotel-sidebar">
              {filtersLoading ? (
                <FilterSkeleton />
              ) : (
                <HotelFilterSidebar
                  filterGroups={filterGroups}
                  appliedFilters={appliedFilters}
                  toggleFilter={toggleFilter}
                  clearAllFilters={clearAllFilters}
                  favoritesOnly={favoritesOnly}
                  setFavoritesOnly={setFavoritesOnly}
                  hotelNameQuery={hotelNameQuery}
                  setHotelNameQuery={(value) =>
                    setAppliedFilters((prev) => ({ ...prev, hotelName: value }))
                  }
                />
              )}
            </aside>

            <section>
              {resultsError ? (
                <ErrorState
                  onRetry={() =>
                    searchHotels(
                      buildSearchPayload(initialPayload, appliedFilters, searchResponse, sortOrder, ""),
                    ).then(setSearchResponse)
                  }
                />
              ) : resultsLoading && hotels.length === 0 ? (
                <div className={viewMode === "grid" ? "hotel-grid" : "hotel-list"}>
                  {Array.from({ length: viewMode === "grid" ? 6 : 4 }).map((_, index) => (
                    <HotelCardSkeleton key={index} />
                  ))}
                </div>
              ) : visibleHotels.length === 0 ? (
                <EmptyState onClearAll={clearAllFilters} />
              ) : viewMode === "grid" ? (
                <div className="hotel-grid">
                  {visibleHotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onClick={() =>
                        navigate(`/hotels/${hotel.id}`, {
                          state: {
                            ...location.state,
                            hotelSearchResponse: searchResponse,
                          },
                        })
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="hotel-list">
                  {visibleHotels.map((hotel) => (
                    <HotelListCard
                      key={hotel.id}
                      hotel={hotel}
                      onClick={() =>
                        navigate(`/hotels/${hotel.id}`, {
                          state: {
                            ...location.state,
                            hotelSearchResponse: searchResponse,
                          },
                        })
                      }
                    />
                  ))}
                </div>
              )}
              {!resultsError && visibleHotels.length > 0 ? (
                <>
                  {loadingMore ? <div className="hotel-load-more">Loading more hotels...</div> : null}
                  {hasMoreResults ? <div ref={loadMoreRef} className="hotel-scroll-sentinel" /> : null}
                </>
              ) : null}
            </section>
          </div>
        )}
      </div>

      <Offcanvas
        show={showMobileFilters}
        onHide={() => setShowMobileFilters(false)}
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ padding: 0 }}>
          {filtersLoading ? (
            <div className="p-3">
              <FilterSkeleton />
            </div>
          ) : (
            <div className="p-3">
              <HotelFilterSidebar
                filterGroups={filterGroups}
                appliedFilters={appliedFilters}
                toggleFilter={toggleFilter}
                clearAllFilters={clearAllFilters}
                favoritesOnly={favoritesOnly}
                setFavoritesOnly={setFavoritesOnly}
                hotelNameQuery={hotelNameQuery}
                setHotelNameQuery={(value) =>
                  setAppliedFilters((prev) => ({ ...prev, hotelName: value }))
                }
              />
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
