import { forwardRef, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FightIcon from "../../../../assets/trevel_icon/airplane.png";
import HotelIcon from "../../../../assets/trevel_icon/hotel.png";
import CarIcon from "../../../../assets/trevel_icon/sedan.png";
import ActivityIcon from "../../../../assets/trevel_icon/checklist.png";
import CruiseIcon from "../../../../assets/trevel_icon/cruise-ship.png";
import { Plane, MapPin, Users, CalendarSearch, Loader2, X } from "lucide-react";
import {
  searchAirports,
  searchFlights,
} from "../../../../services/api/flightApi";
import {
  suggestHotels,
  searchHotels,
} from "../../../../services/api/hotelApi";
import airportsData from "../../../../config/airports.json";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .flight-hero {
    min-height: 100vh;
    background-image: url('https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .flight-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    pointer-events: none;
  }

  .navbar-custom {
    background: rgba(0,0,0,0.15);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding: 12px 0;
  }

  .navbar-recommended {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .navbar-recommended-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: rgba(255,255,255,0.7);
    font-weight: 500;
  }

  .navbar-recommended-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    backdrop-filter: blur(8px);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .navbar-recommended-pill:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-1px);
  }

  .nav-tab {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-tab span {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-tab img {
    width: 18px;
    height: 18px;
    object-fit: contain;
    filter: brightness(1) invert(1);
  }

  .nav-tab.active {
    background: rgba(255,255,255,0.25);
    border-color: rgba(255,255,255,0.4);
    transform: scale(1.05);
  }

  .nav-tab:hover {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.3);
    transform: translateY(-1px);
  }

  .nav-tab.active {
    color: #ed1173;
    background: #fff;
    font-weight: 600;
  }

  .nav-tab.active img {
    filter: none;
  }

  .hero-title {
    font-size: clamp(2rem, 5vw, 3.6rem);
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -1px;
    margin-bottom: 10px;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    color: rgba(255,255,255,0.75);
    font-weight: 400;
  }

  .search-card {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.3);
    position: relative;
    z-index: 100;
  }

  .trip-radio label {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }

  .trip-radio input[type=radio] { accent-color: #ed1173; width: 16px; height: 16px; }
  .trip-radio input[type=checkbox] { accent-color: #ed1173; width: 16px; height: 16px; }

  .class-select {
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    background: transparent;
  }

  .search-fields {
    display: grid;
    grid-template-columns: 1fr auto 1fr 1fr 1fr 1fr auto;
    gap: 0;
    border: 2px solid #ed1173;
    border-radius: 14px;
    overflow: visible;
    align-items: stretch;
    position: relative;
    z-index: 200;
  }

  @media (max-width: 1199px) {
    .search-fields {
      grid-template-columns: 1fr auto 1fr 1fr 1fr auto;
    }
  }

  @media (max-width: 991px) {
    .search-fields {
      grid-template-columns: 1fr 1fr;
      border-radius: 14px;
    }
    .swap-btn-wrap { grid-column: 1 / -1; display: flex; justify-content: center; padding: 6px; border-right: none !important; }
    .explore-btn { grid-column: 1 / -1; border-radius: 0 0 12px 12px !important; }
  }

  @media (max-width: 575px) {
    .search-fields { grid-template-columns: 1fr; }
    .swap-btn-wrap { grid-column: 1; }
    .explore-btn { grid-column: 1; }
  }

  .field-box {
    padding: 14px 18px;
    border-right: 1px solid #f0e0e8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  .field-box:last-of-type { border-right: none; }

  .field-label {
    font-size: 11px;
    color: #999;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
  }

  .field-value {
    font-size: 15px;
    font-weight: 700;
    color: #1a1a2e;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .field-sub {
    font-size: 12px;
    color: #aaa;
    margin-top: 1px;
  }

  .field-input {
    border: none;
    outline: none;
    font-size: 15px;
    font-weight: 700;
    color: #1a1a2e;
    width: 100%;
    background: transparent;
    font-family: 'Poppins', sans-serif;
  }

  .field-input::placeholder { color: #bbb; font-weight: 500; }

  .swap-btn-wrap {
    display: flex;
    align-items: center;
    padding: 8px 6px;
    border-right: 1px solid #f0e0e8;
    background: #fff9fb;
  }

  .swap-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 2px solid #ed1173;
    background: #fff;
    color: #ed1173;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
  }

  .swap-btn:hover { background: #ed1173; color: #fff; }

  .explore-btn {
    background: linear-gradient(135deg, #ed1173, #c0006a);
    color: #fff;
    border: none;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.5px;
    font-family: 'Poppins', sans-serif;
    transition: all 0.2s;
    white-space: nowrap;
    border-radius: 0 12px 12px 0;
  }

  .explore-btn:hover { background: linear-gradient(135deg, #ff2a8a, #ed1173); transform: scale(1.02); }

  .explore-btn.loading {
    opacity: 0.9;
    cursor: wait;
  }

  .stats-row {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
    margin-top: 48px;
  }

  .stat-item { color: rgba(255,255,255,0.9); }
  .stat-num { font-size: 1.8rem; font-weight: 800; }
  .stat-label { font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 500; }

  .explore-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 30px;
    padding: 6px 16px;
    color: rgba(255,255,255,0.85);
    font-size: 13px;
    margin-bottom: 20px;
    backdrop-filter: blur(6px);
  }

  .dot { width: 8px; height: 8px; border-radius: 50%; background: #ed1173; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }

  .plane-icon {
    font-size: 6rem;
    opacity: 0.08;
    position: absolute;
    top: 60px; right: -20px;
    transform: rotate(-20deg);
    pointer-events: none;
  }

  @media (min-width: 992px) { .plane-icon { font-size: 10rem; right: 40px; opacity: 0.1; } }

  .recommended-section {
    margin-top: 40px;
  }

  .recommended-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 16px;
  }

  .recommended-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }

  .recommended-card {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 16px 18px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
    color: #fff;
  }

  .recommended-tag {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 6px;
  }

  .recommended-name {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .recommended-meta {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
  }

  .airport-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #ffffff;
    border: 1px solid rgba(237, 17, 115, 0.28);
    border-radius: 14px;
    box-shadow: 0 16px 35px rgba(18, 22, 33, 0.18);
    max-height: 280px;
    overflow-y: auto;
    z-index: 9999;
    margin-top: 8px;
    backdrop-filter: blur(12px);
    animation: slideDown 0.2s ease-out;
    min-width: 380px;
    width: auto;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .suggestion-item {
    padding: 13px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f3f4f8;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .suggestion-item:hover {
    background: linear-gradient(135deg, rgba(237, 17, 115, 0.09), rgba(255, 107, 157, 0.08));
    border-left: 3px solid #ed1173;
    padding-left: 13px;
  }

  .suggestion-item:last-child {
    border-bottom: none;
  }

  .suggestion-main {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .suggestion-airport-icon {
    width: 20px;
    height: 20px;
    color: #ed1173;
    flex-shrink: 0;
  }

  .suggestion-iata {
    font-weight: 800;
    color: #ed1173;
    font-size: 14px;
    background: rgba(237, 17, 115, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    min-width: 35px;
    text-align: center;
  }

  .suggestion-name {
    font-weight: 700;
    color: #1a1a2e;
    font-size: 14px;
    line-height: 1.2;
  }

  .suggestion-city {
    font-size: 12px;
    color: #5f6472;
    margin-left: 65px;
    font-weight: 500;
  }

  .hotel-suggestion-box {
    position: relative;
  }

  .hotel-clear-btn {
    position: absolute;
    top: 2px;
    right: 0;
    width: 30px;
    height: 30px;
    border: none;
    background: transparent;
    color: #8d95a1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .hotel-clear-btn:hover {
    color: #ff7a1a;
    background: rgba(255, 122, 26, 0.08);
  }

  .hotel-suggestions {
    min-width: 100%;
    width: 100%;
    border-radius: 6px;
    border: 1px solid #dcdfe6;
    box-shadow: 0 20px 40px rgba(18, 22, 33, 0.18);
    margin-top: 10px;
    overflow: hidden;
  }

  .hotel-suggestion-item {
    padding: 12px 16px;
    gap: 2px;
  }

  .hotel-suggestion-item:hover {
    background: #fff7f0;
    border-left: 3px solid #ff7a1a;
    padding-left: 13px;
  }

  .hotel-suggestion-main {
    align-items: flex-start;
    gap: 8px;
  }

  .hotel-suggestion-icon {
    width: 16px;
    height: 16px;
    color: #ff7a1a;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .hotel-suggestion-name {
    font-weight: 800;
    color: #303540;
    font-size: 14px;
    line-height: 1.15;
    text-transform: uppercase;
  }

  .hotel-suggestion-sub {
    font-size: 11px;
    color: #6f7480;
    margin-left: 24px;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 1.25;
  }

  .hotel-date-trigger {
    width: 100%;
    border: none;
    background: transparent;
    padding: 0;
    text-align: left;
    font-family: 'Poppins', sans-serif;
  }

  .hotel-date-trigger:focus {
    outline: none;
  }

  .hotel-date-value {
    font-size: 15px;
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.15;
  }

  .hotel-date-value.empty {
    color: #b4bac3;
  }

  .hotel-date-strip {
    display: inline-flex;
    align-items: center;
    margin-top: 8px;
    padding: 5px 11px;
    border-radius: 999px;
    background: linear-gradient(135deg, #ff952f, #ff6d00);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2px;
    box-shadow: 0 8px 18px rgba(255, 109, 0, 0.18);
  }

  .hotel-date-strip.muted {
    background: #f4f0ea;
    color: #8a909a;
    box-shadow: none;
  }

  .hotel-calendar {
    border: 1px solid #ece5dc !important;
    border-radius: 16px !important;
    font-family: 'Poppins', sans-serif !important;
    box-shadow: 0 18px 36px rgba(18, 22, 33, 0.18);
    overflow: hidden;
  }

  .hotel-calendar .react-datepicker__header {
    background: #fff !important;
    border-bottom: 1px solid #f1ebe3 !important;
    padding-top: 14px !important;
  }

  .hotel-calendar .react-datepicker__current-month {
    font-size: 14px;
    font-weight: 800;
    color: #525866;
  }

  .hotel-calendar .react-datepicker__day-name {
    color: #8e95a3;
    font-size: 11px;
    font-weight: 700;
    width: 2rem;
    line-height: 2rem;
  }

  .hotel-calendar .react-datepicker__day {
    width: 2rem;
    line-height: 2rem;
    margin: 0.18rem;
    border-radius: 10px;
    color: #29303a;
    font-weight: 700;
  }

  .hotel-calendar .react-datepicker__day:hover {
    background: #fff0e2;
  }

  .hotel-calendar .react-datepicker__day--keyboard-selected {
    background: #fff0e2 !important;
    color: #29303a !important;
  }

  .hotel-calendar .react-datepicker__day--outside-month {
    color: #c7ccd5;
  }

  .hotel-calendar .hotel-range-day {
    background: #ff8d2c;
    color: #fff;
    border-radius: 0;
  }

  .hotel-calendar .hotel-range-start {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .hotel-calendar .hotel-range-end {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .hotel-calendar .hotel-range-single {
    border-radius: 10px;
  }

  .date-input-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    width: 100%;
  }

  .date-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .date-chip {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: rgba(237, 17, 115, 0.1);
    color: #ed1173;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .flight-date-input {
    border: 1px solid #efe6ec;
    border-radius: 10px;
    background: #fff;
    padding: 6px 10px;
    font-size: 14px;
    font-weight: 600;
    color: #1a1a2e;
    width: 100%;
    min-height: 40px;
    font-family: 'Poppins', sans-serif;
    outline: none;
    transition: all 0.2s ease;
  }

  .flight-date-input:focus {
    border-color: #ed1173;
    box-shadow: 0 0 0 3px rgba(237, 17, 115, 0.12);
  }

  .flight-date-input::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.85;
  }

  .selected-date-pill {
    font-size: 11px;
    font-weight: 700;
    color: #b00061;
    background: rgba(237, 17, 115, 0.12);
    border: 1px solid rgba(237, 17, 115, 0.2);
    border-radius: 999px;
    padding: 4px 10px;
    white-space: nowrap;
    align-self: flex-start;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .field-wrapper {
    position: relative;
    z-index: 1;
  }

  .travelers-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 2px solid #ed1173;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    z-index: 9999;
    margin-top: 8px;
    padding: 20px;
    min-width: 300px;
    animation: slideDown 0.2s ease-out;
  }

  .traveler-type {
    margin-bottom: 16px;
  }

  .traveler-type:last-child {
    margin-bottom: 0;
  }

  .traveler-label {
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .traveler-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .traveler-button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #ed1173;
    background: white;
    color: #ed1173;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: 700;
    transition: all 0.2s ease;
  }

  .traveler-button:hover {
    background: #ed1173;
    color: white;
  }

  .traveler-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .traveler-count {
    min-width: 40px;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    color: #1a1a2e;
  }

  .flight-results {
    margin-top: 24px;
    background: white;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    border: 1px solid rgba(237, 17, 115, 0.1);
  }

  .flight-item {
    border: 2px solid #f8f9fa;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%);
    position: relative;
    overflow: hidden;
  }

  .flight-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ed1173, #ff6b9d);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .flight-item:hover {
    border-color: #ed1173;
    box-shadow: 0 15px 40px rgba(237, 17, 115, 0.15);
    transform: translateY(-2px);
  }

  .flight-item:hover::before {
    opacity: 1;
  }

  .flight-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f8f9fa;
  }

  .flight-airline {
    font-weight: 800;
    color: #1a1a2e;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .airline-logo {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #ed1173, #ff6b9d);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 14px;
  }

  .flight-price {
    font-size: 24px;
    font-weight: 900;
    color: #ed1173;
    text-shadow: 0 2px 4px rgba(237, 17, 115, 0.1);
  }

  .flight-details {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 30px;
    align-items: center;
    margin-bottom: 20px;
  }

  .flight-time {
    text-align: center;
    position: relative;
  }

  .flight-time::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -15px;
    width: 30px;
    height: 2px;
    background: repeating-linear-gradient(90deg, #ddd, #ddd 3px, transparent 3px, transparent 6px);
    transform: translateY(-50%);
  }

  .flight-time:last-child::after {
    display: none;
  }

  .flight-time-value {
    font-size: 22px;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 4px;
  }

  .flight-time-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 2px;
    font-weight: 600;
  }

  .flight-time-date {
    font-size: 12px;
    color: #999;
    font-weight: 500;
  }

  .flight-duration {
    text-align: center;
    color: #666;
    font-size: 15px;
    font-weight: 600;
    padding: 12px 16px;
    background: rgba(237, 17, 115, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(237, 17, 115, 0.1);
  }

  .flight-stops {
    font-size: 12px;
    color: #ed1173;
    margin-top: 6px;
    font-weight: 700;
  }

  .flight-amenities {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .amenity-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #f8f9fa;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    border: 1px solid #e9ecef;
  }

  .amenity-badge.direct {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
    border-color: rgba(76, 175, 80, 0.2);
  }

  .amenity-badge.stops {
    background: rgba(255, 152, 0, 0.1);
    color: #ff9800;
    border-color: rgba(255, 152, 0, 0.2);
  }

  .seats-badge {
    background: rgba(233, 30, 99, 0.1);
    color: #e91e63;
    border-color: rgba(233, 30, 99, 0.2);
  }

  .select-button {
    background: linear-gradient(135deg, #ed1173, #ff6b9d);
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(237, 17, 115, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .select-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(237, 17, 115, 0.4);
  }

  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f8f9fa;
  }

  .results-title {
    font-size: 28px;
    font-weight: 800;
    color: #1a1a2e;
    margin: 0;
  }

  .results-count {
    background: linear-gradient(135deg, #ed1173, #ff6b9d);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 14px;
  }

  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  .spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #ed1173;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .spin {
    animation: spin 1s linear infinite;
  }
`;

const readArray = (payload, primaryKey) => {
  if (Array.isArray(payload?.[primaryKey])) return payload[primaryKey];
  if (Array.isArray(payload?.data?.[primaryKey])) return payload.data[primaryKey];
  // Some APIs nest lists under an object (e.g. { hotels: { hotels: [] } })
  const nested = payload?.[primaryKey];
  if (nested && typeof nested === "object") {
    if (Array.isArray(nested?.[primaryKey])) return nested[primaryKey];
    if (Array.isArray(nested?.items)) return nested.items;
    if (Array.isArray(nested?.results)) return nested.results;
    if (Array.isArray(nested?.data)) return nested.data;
    // Common hotelbeds-ish keys
    if (Array.isArray(nested?.hotels)) return nested.hotels;
    if (Array.isArray(nested?.images)) return nested.images;
  }
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const getPriceValue = (hotel) => {
  const candidateValues = [
    hotel?.minRate,
    hotel?.price?.amount,
    hotel?.amount,
    hotel?.totalRate,
    hotel?.rate,
  ];
  const parsed = candidateValues
    .map((value) => parseFloat(String(value)))
    .find((value) => Number.isFinite(value));
  return parsed ?? null;
};

const readFirst = (...values) => values.find((v) => v !== undefined && v !== null);

const mapCancellationPolicies = (rate) => {
  const policies = readArray(rate, "cancellationPolicies");
  return policies.map((p) => ({
    from: p?.from || p?.dateFrom || null,
    amount: readFirst(p?.amount, p?.price?.amount, p?.value, null),
    currency: p?.currency || p?.price?.currency || null,
    type: p?.type || null,
  }));
};

const mapTaxes = (rate) => {
  const taxes = readArray(rate, "taxes");
  return taxes.map((t) => ({
    included: t?.included ?? null,
    percent: readFirst(t?.percent, t?.percentage, null),
    amount: readFirst(t?.amount, t?.value, null),
    currency: t?.currency || null,
    type: t?.type || t?.code || null,
    description: t?.description?.content || t?.description || null,
  }));
};

const mapPromotions = (rate) => {
  const promotions = readArray(rate, "promotions");
  return promotions.map((promo) => ({
    code: promo?.code || null,
    name: promo?.name || promo?.description?.content || promo?.description || null,
  }));
};

const mapRoomRates = (room) => {
  const rates = readArray(room, "rates");
  return rates.map((rate) => ({
    rateKey: rate?.rateKey || rate?.key || null,
    boardCode: rate?.boardCode || null,
    boardName: rate?.boardName || null,
    rateClass: rate?.rateClass || null,
    rateType: rate?.rateType || null,
    rooms: rate?.rooms ?? null,
    adults: rate?.adults ?? null,
    children: rate?.children ?? null,
    net: readFirst(rate?.net, rate?.price?.net, rate?.amount, null),
    sellingRate: readFirst(rate?.sellingRate, rate?.price?.sellingRate, null),
    currency: rate?.currency || rate?.price?.currency || null,
    allotment: rate?.allotment ?? null,
    paymentType: rate?.paymentType || null,
    packaging: rate?.packaging ?? null,
    hotelMandatory: rate?.hotelMandatory ?? null,
    offers: readArray(rate, "offers"),
    taxes: mapTaxes(rate),
    promotions: mapPromotions(rate),
    cancellationPolicies: mapCancellationPolicies(rate),
  }));
};

const mapRooms = (hotel) => {
  const rooms = readArray(hotel, "rooms");
  return rooms.map((room, idx) => ({
    id: String(room?.code || room?.roomCode || room?.id || idx),
    code: room?.code || room?.roomCode || null,
    name: room?.name || room?.description?.content || room?.type || "Room",
    rates: mapRoomRates(room),
  }));
};

const normalizeImageUrl = (url) => {
  if (!url) return null;
  const text = String(url).trim();
  if (!text) return null;
  // Prevent mixed-content issues on HTTPS pages.
  if (text.startsWith("http://")) return `https://${text.slice(7)}`;
  return text;
};

const mapHotelSearchResult = (hotel, imagePayload) => {
  const hotelCode = hotel?.hotelCode || hotel?.code || hotel?.id || hotel?.hotel_id;
  const imageHotelCode = String(imagePayload?.hotelCode || "");
  const currentHotelCode = String(hotelCode || "");
  // If API includes hotelCode in payload, only map when it matches current hotel.
  const shouldUseImagePayload =
    !imageHotelCode || !currentHotelCode || imageHotelCode === currentHotelCode;

  const rawImages = shouldUseImagePayload ? readArray(imagePayload, "images") : [];
  const sortedImages = [...rawImages].sort((a, b) => {
    const aType = a?.type === "GEN" ? 0 : 1;
    const bType = b?.type === "GEN" ? 0 : 1;
    if (aType !== bType) return aType - bType;
    const aVisual = Number(a?.visualOrder ?? Number.MAX_SAFE_INTEGER);
    const bVisual = Number(b?.visualOrder ?? Number.MAX_SAFE_INTEGER);
    if (aVisual !== bVisual) return aVisual - bVisual;
    const aOrder = Number(a?.order ?? Number.MAX_SAFE_INTEGER);
    const bOrder = Number(b?.order ?? Number.MAX_SAFE_INTEGER);
    return aOrder - bOrder;
  });

  const imageUrls = sortedImages
    .map((image) =>
      normalizeImageUrl(
        image?.url || image?.path || image?.image || image?.imageUrl || null,
      ),
    )
    .filter(Boolean);
  const mainImage =
    imageUrls[0] ||
    hotel?.image ||
    hotel?.thumbnail ||
    "";

  const price = getPriceValue(hotel);
  const rawRating =
    parseFloat(
      String(hotel?.rating ?? hotel?.reviewScore ?? hotel?.stars ?? "0"),
    ) || 0;
  const rating =
    rawRating > 5 && rawRating <= 100 ? Number((rawRating / 20).toFixed(1)) : rawRating;

  let ratingLabel = "No reviews";
  if (rating >= 4.5) ratingLabel = "Excellent";
  else if (rating >= 4.0) ratingLabel = "Very good";
  else if (rating >= 3.5) ratingLabel = "Good";
  else if (rating > 0) ratingLabel = "Pleasant";

  const locationParts = [
    hotel?.address,
    hotel?.city,
    hotel?.destinationName,
    hotel?.countryName,
  ].filter(Boolean);

  const rooms = mapRooms(hotel);
  const firstRateNet = rooms?.[0]?.rates?.[0]?.net;
  const derivedPrice = readFirst(price, firstRateNet, null);

  return {
    id: String(hotelCode || hotel?.name || "hotel"),
    name: hotel?.name || hotel?.hotelName || "Hotel",
    location: locationParts.join(", "),
    rating,
    ratingLabel,
    reviews: hotel?.reviews ?? 0,
    locationScore: undefined,
    priceFrom:
      derivedPrice !== null
        ? `₹ ${Number(derivedPrice).toLocaleString("en-IN")}`
        : "Price not available",
    image: mainImage,
    gallery: imageUrls.length ? imageUrls : mainImage ? [mainImage] : [],
    tags: [hotel?.categoryName, hotel?.boardName].filter(Boolean),
    shortDescription: hotel?.description || hotel?.zoneName || "",
    overview: [hotel?.address, hotel?.zoneName].filter(Boolean),
    breakfastInfo: hotel?.boardName || null,
    facilities: [],
    propertyHighlights: [hotel?.destinationName, hotel?.categoryName].filter(Boolean),
    rooms: rooms.length ? rooms : undefined,
    meta: {
      hotelCode: hotelCode ? String(hotelCode) : null,
      categoryCode: hotel?.categoryCode || null,
      categoryName: hotel?.categoryName || null,
      destinationCode: hotel?.destinationCode || null,
      destinationName: hotel?.destinationName || null,
      zoneCode: hotel?.zoneCode || null,
      zoneName: hotel?.zoneName || null,
      latitude: hotel?.latitude ?? hotel?.location?.latitude ?? null,
      longitude: hotel?.longitude ?? hotel?.location?.longitude ?? null,
    },
    raw: hotel,
  };
};

const searchLocalAirports = (keyword) => {
  const query = String(keyword || "").trim().toLowerCase();
  if (query.length < 2) return [];
  return airportsData
    .filter((airport) => {
      const iata = String(airport.iata || "").toLowerCase();
      const city = String(airport.city || "").toLowerCase();
      const name = String(airport.name || "").toLowerCase();
      const country = String(airport.country || "").toLowerCase();
      return (
        iata.includes(query) ||
        city.includes(query) ||
        name.includes(query) ||
        country.includes(query)
      );
    })
    .slice(0, 12);
};

const formatSelectedDate = (dateValue) => {
  if (!dateValue) return "Select date";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "Select date";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const parseIsoDate = (value) => {
  if (!value) return null;
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const formatIsoDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isSameDay = (left, right) =>
  left instanceof Date &&
  right instanceof Date &&
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const isDayBetween = (day, start, end) => {
  if (!(day instanceof Date) || !(start instanceof Date) || !(end instanceof Date)) {
    return false;
  }

  const dayValue = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  const startValue = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endValue = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();

  return dayValue > startValue && dayValue < endValue;
};

const HotelDateInput = forwardRef(function HotelDateInput(
  { value, label, selected, onClick },
  ref,
) {
  return (
    <button
      type="button"
      className="hotel-date-trigger"
      ref={ref}
      onClick={onClick}
    >
      <div className={`hotel-date-value ${selected ? "" : "empty"}`}>
        {value || label}
      </div>
      <div className={`hotel-date-strip ${selected ? "" : "muted"}`}>
        {selected ? formatSelectedDate(selected) : label}
      </div>
    </button>
  );
});

const createCorrelationId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `corr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const readSuggestionItems = (payload) => {
  const candidates = [
    payload,
    payload?.suggestions,
    payload?.data?.suggestions,
    payload?.data,
    payload?.items,
    payload?.results,
  ];
  const match = candidates.find((value) => Array.isArray(value));
  return Array.isArray(match) ? match : [];
};

const normalizeHotelSuggestion = (suggestion) => {
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
    countryName:
      suggestion?.countryName ||
      suggestion?.country ||
      (suggestion?.subtitle ? String(suggestion.subtitle).split(",").slice(-1)[0]?.trim() : ""),
    stateName:
      suggestion?.stateName ||
      suggestion?.state ||
      (suggestion?.subtitle ? String(suggestion.subtitle).split(",")[0]?.trim() : ""),
    tjids,
    raw: suggestion,
  };
};

export default function FlightHero() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Flights");
  const [tripType, setTripType] = useState("round");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [direct, setDirect] = useState(false);
  const [cabinClass, setCabinClass] = useState("Economy");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hotelLocation, setHotelLocation] = useState("");
  const [hotelSuggestions, setHotelSuggestions] = useState([]);
  const [showHotelSuggestions, setShowHotelSuggestions] = useState(false);
  const [selectedHotelSuggestion, setSelectedHotelSuggestion] = useState(null);
  const [hotelDestinationCode, setHotelDestinationCode] = useState("");
  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [hotelCheckOut, setHotelCheckOut] = useState("");
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelChildren, setHotelChildren] = useState(0);
  const [hotelSearchLoading, setHotelSearchLoading] = useState(false);
  const [hotelSuggestLoading, setHotelSuggestLoading] = useState(false);
  const hotelCountryCode = "";
  const hotelDestinations = [];
  const hotelMetaLoading = false;
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const travelersRef = useRef(null);
  const hotelInputRef = useRef(null);
  const hotelCheckInDate = parseIsoDate(hotelCheckIn);
  const hotelCheckOutDate = parseIsoDate(hotelCheckOut);

  const swapCities = () => {
    setFrom(to || "");
    setTo(from);
  };

  // Airport search API
  const handleAirportSearch = async (keyword, type) => {
    if (keyword.length < 2) {
      if (type === "from") {
        setFromSuggestions([]);
        setShowFromSuggestions(false);
      } else {
        setToSuggestions([]);
        setShowToSuggestions(false);
      }
      return;
    }

    // Instant local dropdown suggestions (city/name/IATA) from static config.
    const localMatches = searchLocalAirports(keyword);
    if (type === "from") {
      setFromSuggestions(localMatches);
      setShowFromSuggestions(localMatches.length > 0);
    } else {
      setToSuggestions(localMatches);
      setShowToSuggestions(localMatches.length > 0);
    }

    try {
      const data = await searchAirports(keyword);

      if (data.status && data.data) {
        const merged = [...localMatches, ...data.data].reduce((acc, curr) => {
          const key = `${curr.iata}-${curr.city}-${curr.country}`;
          if (!acc.map.has(key)) {
            acc.map.add(key);
            acc.items.push(curr);
          }
          return acc;
        }, { map: new Set(), items: [] }).items.slice(0, 12);

        if (type === "from") {
          setFromSuggestions(merged);
          setShowFromSuggestions(merged.length > 0);
        } else {
          setToSuggestions(merged);
          setShowToSuggestions(merged.length > 0);
        }
      }
    } catch (error) {
      // Keep local dropdown suggestions even if API fails.
      console.error("Error searching airports, using local airport list:", error);
    }
  };

  // Handle search click - call API then navigate to results page with params + data
  const handleSearchFlights = async () => {
    if (!from || !to || !departureDate) {
      alert("Please fill in all required fields");
      return;
    }

    if (tripType === "round" && !returnDate) {
      alert("Please select return date for round trip");
      return;
    }

    setLoading(true);
    try {
      const searchParams = {
        from: from,
        to: to,
        date: departureDate,
        adults: adults,
      };

      // Add return date for round trip
      if (tripType === "round") {
        searchParams.return_date = returnDate;
      }

      // Add children if any
      if (children > 0) {
        searchParams.children = children;
      }

      // Add cabin class if specified
      if (cabinClass !== "Economy") {
        searchParams.cabin_class = cabinClass.toLowerCase();
      }

      // Add direct flight preference
      if (direct) {
        searchParams.direct = true;
      }

      // Call backend flight search API
      const response = await searchFlights(searchParams);

      // Navigate to results page with search parameters and initial API response
      navigate("/honeymoon/flights", {
        state: { searchParams, initialResults: response },
      });
    } catch (error) {
      console.error("Error searching flights:", error);
      alert("Error searching flights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "Hotels") return undefined;

    const keyword = hotelLocation.trim();
    if (keyword.length < 2) {
      setHotelSuggestions([]);
      setShowHotelSuggestions(false);
      setHotelSuggestLoading(false);
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setHotelSuggestLoading(true);
      try {
        const response = await suggestHotels({ keyword });
        if (!active) return;

        const suggestions = readSuggestionItems(response)
          .map(normalizeHotelSuggestion)
          .filter((item) => item.id && item.displayName);

        setHotelSuggestions(suggestions);
        setShowHotelSuggestions(suggestions.length > 0);
      } catch (error) {
        if (active) {
          setHotelSuggestions([]);
          setShowHotelSuggestions(false);
        }
        console.error("Unable to load hotel suggestions", error);
      } finally {
        if (active) {
          setHotelSuggestLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [activeTab, hotelLocation]);

  const handleSearchHotels = async () => {
    if (!selectedHotelSuggestion || !hotelCheckIn || !hotelCheckOut) {
      alert("Please select a destination and travel dates");
      return;
    }

    setHotelSearchLoading(true);
    try {
      const payload = {
        searchQuery: {
          checkinDate: hotelCheckIn,
          checkoutDate: hotelCheckOut,
          roomInfo: Array.from({ length: hotelRooms }, () => ({
            numberOfAdults: hotelAdults,
            numberOfChild: hotelChildren,
          })),
          searchCriteria: {
            city: selectedHotelSuggestion.city,
            tjids: selectedHotelSuggestion.tjids,
            nationality: "106",
            countryOfResidence: "106",
            currency: "INR",
            searchRegionName: selectedHotelSuggestion.searchRegionName,
            searchRegionType: selectedHotelSuggestion.searchRegionType,
          },
          searchType: selectedHotelSuggestion.searchType,
          gstApplied: false,
        },
        allOptions: true,
        appliedFilters: {
          ratings: [],
          propertyType: [],
          mealType: [],
          priceRange: [],
          cancellationPolicy: [],
          ramadanMeal: [],
          suppliers: [],
          amenities: [],
          brand: [],
          distance: [],
          popularPlaces: [],
          roomViews: [],
          gstApplicable: [],
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

      const response = await searchHotels(payload);

      navigate("/hotels", {
        state: {
          hotelSearchPayload: payload,
          hotelSearchResponse: response,
          selectedHotelSuggestion,
        },
      });
    } catch (error) {
      console.error("Error searching hotels:", error);
      alert("Error searching hotels");
    } finally {
      setHotelSearchLoading(false);
    }
  };

  const selectHotelSuggestion = (suggestion) => {
    setSelectedHotelSuggestion(suggestion);
    setHotelLocation(suggestion.displayName);
    setHotelSuggestions([]);
    setShowHotelSuggestions(false);
  };

  // Handle airport selection
  const selectAirport = (airport, type) => {
    if (type === "from") {
      setFrom(airport.iata);
      setShowFromSuggestions(false);
      setFromSuggestions([]);
    } else {
      setTo(airport.iata);
      setShowToSuggestions(false);
      setToSuggestions([]);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        fromInputRef.current &&
        !fromInputRef.current.contains(event.target)
      ) {
        setShowFromSuggestions(false);
      }
      if (toInputRef.current && !toInputRef.current.contains(event.target)) {
        setShowToSuggestions(false);
      }
      if (
        travelersRef.current &&
        !travelersRef.current.contains(event.target)
      ) {
        setShowTravelersDropdown(false);
      }
      if (
        hotelInputRef.current &&
        !hotelInputRef.current.contains(event.target)
      ) {
        setShowHotelSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="flight-hero">
        <nav className="navbar-custom">
        <div className="container">
          <div className="navbar-content">
            <div className="nav-tabs">
              {[
                {
                  icon: { src: HotelIcon, alt: "Hotels" },
                  label: "Hotels",
                  onClick: () => setActiveTab("Hotels"),
                },
                {
                  icon: { src: FightIcon, alt: "Flights" },
                  label: "Flights",
                  onClick: () => setActiveTab("Flights"),
                },
                { icon: { src: CruiseIcon, alt: "cruise" }, label: "cruise" },
                {
                  icon: { src: CarIcon, alt: "Car rental" },
                  label: "Car rental",
                },
                {
                  icon: { src: ActivityIcon, alt: "Activities" },
                  label: "Activities",
                  onClick: () => navigate("/travels"),
                },
              ].map((tab) => (
                <button
                  key={tab.label}
                  className={`nav-tab ${activeTab === tab.label ? "active" : ""}`}
                  onClick={tab.onClick}
                >
                  <span>
                    {typeof tab.icon === "object" ? (
                      <img src={tab.icon.src} alt={tab.icon.alt} />
                    ) : (
                      tab.icon
                    )}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

              <div className="navbar-recommended d-none d-md-flex">
                <span className="navbar-recommended-label">Recommended</span>
                <div
                  className="navbar-recommended-pill"
                  onClick={() => navigate("/hotels")}
                >
                  <span>🏨</span>
                  <span>Recommended hotel</span>
                </div>
                <div className="navbar-recommended-pill">
                  <span>✨</span>
                  <span>Recommended activity</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

      <div className="container hero-container">
        <span className="plane-icon">✈️</span>

          <div className="row align-items-start">
            <div className="col-12 mb-5">
              <h1 className="hero-title">
                {activeTab === "Flights"
                  ? "Book Cheap Flight Tickets With Ease"
                  : "Find Romantic Honeymoon Hotels"}
                <br />
              </h1>
              <p className="hero-subtitle">
                {activeTab === "Flights"
                  ? "Discover your next dream destination"
                  : "Search stays with live destination suggestions"}
              </p>

            <div className="stats-row">
              {[
                ["100+", "Airlines"],
                ["20k+", "Travelers"],
                ["10+", "Countries"],
              ].map(([n, l]) => (
                <div key={l} className="stat-item">
                  <div className="stat-num">{n}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>

            <div className="col-12">
              <div className="search-card">
                {activeTab === "Flights" ? (
                  <>
                    <div className="d-flex align-items-center flex-wrap gap-3 mb-3 trip-radio">
                      {[
                        ["round", "Round-trip"],
                        ["oneway", "One-way"],
                      ].map(([val, label]) => (
                        <label key={val}>
                          <input
                            type="radio"
                            name="trip"
                            value={val}
                            checked={tripType === val}
                            onChange={() => setTripType(val)}
                          />
                          {label}
                        </label>
                      ))}
                    </div>

                    <div className="search-fields">
                      <div className="field-box" ref={fromInputRef}>
                        <div className="field-label">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <Plane size={14} /> Departure
                          </span>
                        </div>
                        <div className="field-wrapper">
                          <input
                            className="field-input"
                            placeholder="Enter departure city or airport"
                            value={from}
                            onChange={(e) => {
                              setFrom(e.target.value);
                              handleAirportSearch(e.target.value, "from");
                            }}
                            onFocus={() =>
                              from.length >= 2 && setShowFromSuggestions(true)
                            }
                          />
                          {showFromSuggestions && fromSuggestions.length > 0 && (
                            <div className="airport-suggestions">
                              {fromSuggestions.map((airport, index) => (
                                <div
                                  key={index}
                                  className="suggestion-item"
                                  onClick={() => selectAirport(airport, "from")}
                                >
                                  <div className="suggestion-main">
                                    <Plane className="suggestion-airport-icon" size={18} />
                                    <span className="suggestion-iata">
                                      {airport.iata}
                                    </span>
                                    <span className="suggestion-name">
                                      {airport.name}
                                    </span>
                                  </div>
                                  <div className="suggestion-city">
                                    {airport.city}, {airport.country}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="field-sub">All airports</div>
                      </div>

                      <div className="swap-btn-wrap">
                        <button
                          className="swap-btn"
                          onClick={swapCities}
                          title="Swap cities"
                        >
                          ⇄
                        </button>
                      </div>

                      <div className="field-box" ref={toInputRef}>
                        <div className="field-label">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <MapPin size={14} /> Destination
                          </span>
                        </div>
                        <div className="field-wrapper">
                          <input
                            className="field-input"
                            placeholder="Enter destination city or airport"
                            value={to}
                            onChange={(e) => {
                              setTo(e.target.value);
                              handleAirportSearch(e.target.value, "to");
                            }}
                            onFocus={() =>
                              to.length >= 2 && setShowToSuggestions(true)
                            }
                          />
                          {showToSuggestions && toSuggestions.length > 0 && (
                            <div className="airport-suggestions">
                              {toSuggestions.map((airport, index) => (
                                <div
                                  key={index}
                                  className="suggestion-item"
                                  onClick={() => selectAirport(airport, "to")}
                                >
                                  <div className="suggestion-main">
                                    <Plane className="suggestion-airport-icon" size={18} />
                                    <span className="suggestion-iata">
                                      {airport.iata}
                                    </span>
                                    <span className="suggestion-name">
                                      {airport.name}
                                    </span>
                                  </div>
                                  <div className="suggestion-city">
                                    {airport.city}, {airport.country}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="field-sub">&nbsp;</div>
                      </div>

                      <div className="field-box">
                        <div className="field-label">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <CalendarSearch size={14} /> Departure
                          </span>
                        </div>
                        <div className="date-input-wrap">
                          <div className="date-input-row">
                            <span className="date-chip">
                              <CalendarSearch size={14} />
                            </span>
                            <input
                              className="flight-date-input"
                              type="date"
                              value={departureDate}
                              onChange={(e) => setDepartureDate(e.target.value)}
                            />
                          </div>
                          <span className="selected-date-pill">
                            {formatSelectedDate(departureDate)}
                          </span>
                        </div>
                      </div>

                      {tripType === "round" && (
                        <div className="field-box">
                          <div className="field-label">
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <CalendarSearch size={14} /> Return
                            </span>
                          </div>
                          <div className="date-input-wrap">
                            <div className="date-input-row">
                              <span className="date-chip">
                                <CalendarSearch size={14} />
                              </span>
                              <input
                                className="flight-date-input"
                                type="date"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                min={departureDate}
                              />
                            </div>
                            <span className="selected-date-pill">
                              {formatSelectedDate(returnDate)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="field-box" ref={travelersRef}>
                        <div className="field-label">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <Users size={14} /> Travelers
                          </span>
                        </div>
                        <div className="field-wrapper">
                          <div
                            className="field-value"
                            style={{ cursor: "pointer", padding: "8px 0" }}
                            onClick={() =>
                              setShowTravelersDropdown(!showTravelersDropdown)
                            }
                          >
                            {adults + children}{" "}
                            {adults + children === 1 ? "traveler" : "travelers"}
                            {adults > 0 &&
                              `, ${adults} ${adults === 1 ? "adult" : "adults"}`}
                            {children > 0 &&
                              `, ${children} ${children === 1 ? "child" : "children"}`}
                          </div>
                          {showTravelersDropdown && (
                            <div className="travelers-dropdown">
                              <div className="traveler-type">
                                <div className="traveler-label">Adults</div>
                                <div className="traveler-controls">
                                  <button
                                    className="traveler-button"
                                    onClick={() =>
                                      setAdults(Math.max(1, adults - 1))
                                    }
                                    disabled={adults <= 1}
                                  >
                                    -
                                  </button>
                                  <div className="traveler-count">{adults}</div>
                                  <button
                                    className="traveler-button"
                                    onClick={() => setAdults(adults + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div className="traveler-type">
                                <div className="traveler-label">Children</div>
                                <div className="traveler-controls">
                                  <button
                                    className="traveler-button"
                                    onClick={() =>
                                      setChildren(Math.max(0, children - 1))
                                    }
                                    disabled={children <= 0}
                                  >
                                    -
                                  </button>
                                  <div className="traveler-count">{children}</div>
                                  <button
                                    className="traveler-button"
                                    onClick={() => setChildren(children + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="field-sub">{cabinClass}</div>
                      </div>

                      <button
                        className={`explore-btn ${loading ? "loading" : ""}`}
                        onClick={handleSearchFlights}
                        disabled={loading}
                      >
                        {loading ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Loader2 size={18} className="spin" />
                            Searching flights...
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Plane size={18} />
                            Search flights
                          </span>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="search-fields">
                    <div className="field-box" ref={hotelInputRef}>
                      <div className="field-label">Destination</div>
                      <div className="field-wrapper hotel-suggestion-box">
                        <input
                          className="field-input"
                          type="text"
                          placeholder="Type city, neighborhood or place"
                          autoComplete="off"
                          value={hotelLocation}
                          onChange={(e) => {
                            const value = e.target.value;
                            setHotelLocation(value);
                            setSelectedHotelSuggestion(null);
                            setShowHotelSuggestions(value.trim().length >= 2);
                          }}
                          onFocus={() =>
                            hotelLocation.trim().length >= 2 &&
                            setShowHotelSuggestions(true)
                          }
                        />
                        {hotelLocation ? (
                          <button
                            type="button"
                            className="hotel-clear-btn"
                            onClick={() => {
                              setHotelLocation("");
                              setSelectedHotelSuggestion(null);
                              setHotelSuggestions([]);
                              setShowHotelSuggestions(false);
                            }}
                            aria-label="Clear destination"
                          >
                            <X size={16} />
                          </button>
                        ) : null}
                        <div className="field-sub">
                          {selectedHotelSuggestion
                            ? `${selectedHotelSuggestion.searchRegionType} · ${selectedHotelSuggestion.city}`
                            : "Choose a TripJack suggestion before searching"}
                        </div>
                        {showHotelSuggestions && (
                          <div className="airport-suggestions hotel-suggestions">
                            {hotelSuggestLoading && hotelSuggestions.length === 0 ? (
                              <div className="suggestion-item hotel-suggestion-item">
                                <div className="suggestion-name hotel-suggestion-name">Loading destinations...</div>
                              </div>
                            ) : hotelSuggestions.length > 0 ? (
                              hotelSuggestions.map((suggestion, index) => (
                                <div
                                  key={`${suggestion.id}-${index}`}
                                  className="suggestion-item hotel-suggestion-item"
                                  onClick={() => selectHotelSuggestion(suggestion)}
                                >
                                  <div className="suggestion-main hotel-suggestion-main">
                                    <MapPin className="hotel-suggestion-icon" size={16} />
                                    <span className="suggestion-name hotel-suggestion-name">
                                      {suggestion.displayName}
                                    </span>
                                  </div>
                                  <div className="hotel-suggestion-sub">
                                    {[suggestion.stateName, suggestion.countryName]
                                      .filter(Boolean)
                                      .join(", ") || "India"}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="suggestion-item hotel-suggestion-item">
                                <div className="suggestion-name hotel-suggestion-name">No destinations found</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="field-box d-none">
                      <div className="field-label">Destination code</div>
                      <input
                        className="field-input"
                        type="text"
                        placeholder="e.g. PMI"
                        autoComplete="off"
                        value={hotelDestinationCode}
                        onChange={(e) => setHotelDestinationCode(e.target.value)}
                      />
                      <div className="field-sub">IATA-style code sent to the API</div>
                    </div>

                    {false && hotelCountryCode && hotelDestinations.length > 0 && (
                      <div className="field-box">
                        <div className="field-label">Or pick destination</div>
                        <select
                          className="field-input"
                          value=""
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v) setHotelDestinationCode(v);
                          }}
                          disabled={hotelMetaLoading}
                        >
                          <option value="">
                            Choose to fill destination code…
                          </option>
                          {hotelDestinations.map((destination) => (
                            <option key={destination.code} value={destination.code}>
                              {(destination?.name?.content ||
                                destination?.description?.content ||
                                destination?.name ||
                                destination.code) + ` (${destination.code})`}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="field-box">
                      <div className="field-label">Check-in</div>
                      <DatePicker
                        selected={hotelCheckInDate}
                        onChange={(date) => {
                          const nextValue = formatIsoDate(date);
                          setHotelCheckIn(nextValue);
                          if (
                            hotelCheckOutDate &&
                            date &&
                            hotelCheckOutDate.getTime() <= date.getTime()
                          ) {
                            setHotelCheckOut("");
                          }
                        }}
                        minDate={new Date()}
                        selectsStart
                        startDate={hotelCheckInDate}
                        endDate={hotelCheckOutDate}
                        calendarClassName="hotel-calendar"
                        dayClassName={(date) => {
                          const classes = [];
                          if (hotelCheckInDate && isSameDay(date, hotelCheckInDate)) {
                            classes.push("hotel-range-day", "hotel-range-start");
                          }
                          if (hotelCheckOutDate && isSameDay(date, hotelCheckOutDate)) {
                            classes.push("hotel-range-day", "hotel-range-end");
                          }
                          if (
                            hotelCheckInDate &&
                            hotelCheckOutDate &&
                            isSameDay(hotelCheckInDate, hotelCheckOutDate)
                          ) {
                            if (isSameDay(date, hotelCheckInDate)) {
                              classes.push("hotel-range-single");
                            }
                          } else if (isDayBetween(date, hotelCheckInDate, hotelCheckOutDate)) {
                            classes.push("hotel-range-day");
                          }
                          return classes.join(" ");
                        }}
                        customInput={
                          <HotelDateInput
                            label="Select check-in"
                            selected={hotelCheckInDate}
                          />
                        }
                      />
                    </div>

                    <div className="field-box">
                      <div className="field-label">Check-out</div>
                      <DatePicker
                        selected={hotelCheckOutDate}
                        onChange={(date) => setHotelCheckOut(formatIsoDate(date))}
                        minDate={hotelCheckInDate || new Date()}
                        selectsEnd
                        startDate={hotelCheckInDate}
                        endDate={hotelCheckOutDate}
                        calendarClassName="hotel-calendar"
                        dayClassName={(date) => {
                          const classes = [];
                          if (hotelCheckInDate && isSameDay(date, hotelCheckInDate)) {
                            classes.push("hotel-range-day", "hotel-range-start");
                          }
                          if (hotelCheckOutDate && isSameDay(date, hotelCheckOutDate)) {
                            classes.push("hotel-range-day", "hotel-range-end");
                          }
                          if (
                            hotelCheckInDate &&
                            hotelCheckOutDate &&
                            isSameDay(hotelCheckInDate, hotelCheckOutDate)
                          ) {
                            if (isSameDay(date, hotelCheckInDate)) {
                              classes.push("hotel-range-single");
                            }
                          } else if (isDayBetween(date, hotelCheckInDate, hotelCheckOutDate)) {
                            classes.push("hotel-range-day");
                          }
                          return classes.join(" ");
                        }}
                        customInput={
                          <HotelDateInput
                            label="Select check-out"
                            selected={hotelCheckOutDate}
                          />
                        }
                      />
                    </div>

                    <div className="field-box">
                      <div className="field-label">Rooms</div>
                      <input
                        className="field-input"
                        type="number"
                        min={1}
                        value={hotelRooms}
                        onChange={(e) => setHotelRooms(Math.max(1, Number(e.target.value) || 1))}
                      />
                    </div>

                    <div className="field-box">
                      <div className="field-label">Adults</div>
                      <input
                        className="field-input"
                        type="number"
                        min={1}
                        value={hotelAdults}
                        onChange={(e) => setHotelAdults(Math.max(1, Number(e.target.value) || 1))}
                      />
                    </div>

                    <div className="field-box">
                      <div className="field-label">Children</div>
                      <input
                        className="field-input"
                        type="number"
                        min={0}
                        value={hotelChildren}
                        onChange={(e) => setHotelChildren(Math.max(0, Number(e.target.value) || 0))}
                      />
                    </div>

                    <button
                      className={`explore-btn ${hotelSearchLoading ? "loading" : ""}`}
                      onClick={handleSearchHotels}
                      disabled={hotelSearchLoading}
                    >
                      {hotelSearchLoading ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <Loader2 size={18} className="spin" />
                          Searching hotels...
                        </span>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <MapPin size={18} />
                          Search hotels
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
