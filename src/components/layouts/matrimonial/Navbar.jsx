// src/components/pages/matrimonial/home/MatrimonialHome.jsx
import React, { useState, useEffect } from "react";
import { FiUser, FiLock, FiChevronDown, FiChevronRight } from "react-icons/fi";
import "../../../Matrimonial.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  const handleDropdownHover = (menu) => {
    setActiveDropdown(menu);
    setActiveSubmenu(null);
  };
  const handleSubmenuHover = (submenu) => {
    setActiveSubmenu(submenu);
  };
  const closeMenus = () => {
    setActiveDropdown(null);
    setActiveSubmenu(null);
  };

  useEffect(() => {
    const scrollContainer = document.querySelector(
      ".success-stories-container"
    );
    let scrollAmount = 0;

    const autoScroll = setInterval(() => {
      if (scrollContainer) {
        scrollAmount += 1;
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0;
        }
        scrollContainer.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }, 50);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <div className="matrimonial-container">
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            {/* <FiHeart className="heart-icon" />
            <h1>ShaadiSathi</h1> */}
          </div>

          <div className="nav-menu">
            <div className="nav-item">
              <Link to="/">HappyWedz</Link>
            </div>

            <div className="nav-item">
              <Link to="/matrimonial">Home</Link>
            </div>

            <div
              className="nav-item"
              onMouseEnter={() => handleDropdownHover("matches")}
            >
              <span>
                <div classname="dropdown"></div>
              </span>
              <span>
                Matches <FiChevronDown />
              </span>
              {activeDropdown === "matches" && (
                <div className="dropdown">
                  <div className="dropdown-content">
                    <div className="submenu-column">
                      <h4>By Preference</h4>
                      <Link to="/ProfileMatrimonial/Brahmin">New Matches</Link>
                      <Link to="/ProfileMatrimonial/premium">
                        Premium Matches
                      </Link>
                      <Link to="/ProfileMatrimonial/near-me">
                        Matches Near You
                      </Link>
                    </div>
                    <div className="submenu-column">
                      <Link to="/ProfileMatrimonial/Hindu">Hindu Matches</Link>
                      <Link to="/ProfileMatrimonial/Muslim">
                        Muslim Matches
                      </Link>
                      <Link to="/ProfileMatrimonial/Christian">
                        Christian Matches
                      </Link>
                      <Link to="/ProfileMatrimonial/Sikh">Sikh Matches</Link>
                    </div>
                    <div className="submenu-column">
                      <h4>By Profession</h4>
                      <Link to="/ProfileMatrimonial/Doctor">
                        Doctor Matches
                      </Link>
                      <Link to="/ProfileMatrimonial/Engineer">
                        Engineer Matches
                      </Link>
                      <Link to="/ProfileMatrimonial/Engineer">
                        CA/CS Matches
                      </Link>
                      <Link to="/ProfileMatrimonial/Gov">Govt. Employee</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* <div
              className="nav-item"
              onMouseEnter={() => handleDropdownHover("search")}
            >
              <span>
                Search <FiChevronDown />
              </span>
              {activeDropdown === "search" && (
                <div className="dropdown">
                  <div className="dropdown-content">
                    <div className="submenu-column">
                      <h4>Basic Search</h4>
                      <a href="/">By ID</a>
                      <a href="/">By Name</a>
                      <a href="/">By Education</a>
                    </div>
                    <div className="submenu-column">
                      <h4>Advanced Search</h4>
                      <Link to="/matrimonial-search">Custom Search</Link>
                      <a href="/">Keyword Search</a>
                      <a href="/">Horoscope Match</a>
                    </div>
                    <div className="submenu-column">
                      <h4>Saved Searches</h4>
                      <a href="/">My Saved Searches</a>
                      <a href="/">Recommended Searches</a>
                    </div>
                  </div>
                </div>
              )}
            </div> */}

            <div className="nav-item">
              <a href="/">Search</a>
            </div>

            <div
              className="nav-item"
              onMouseEnter={() => handleDropdownHover("community")}
            >
              <span>
                Community <FiChevronDown />
              </span>
              {activeDropdown === "community" && (
                <div className="dropdown">
                  <div className="dropdown-content">
                    <div
                      className="submenu-column"
                      onMouseEnter={() => handleSubmenuHover("religion")}
                    >
                      <h4>Religion</h4>
                      <a href="/">
                        Hindu <FiChevronRight />
                      </a>
                      <a href="/">
                        Muslim <FiChevronRight />
                      </a>
                      <a href="/">
                        Christian <FiChevronRight />
                      </a>
                      <a href="/">
                        Sikh <FiChevronRight />
                      </a>

                      {activeSubmenu === "religion" && (
                        <div className="submenu-panel">
                          <div className="submenu-content">
                            <h5>Hindu</h5>
                            <a href="/">Brahmin</a>
                            <a href="/">Rajput</a>
                            <a href="/">Maratha</a>
                            <a href="/">Baniya</a>
                            <a href="/">Kayastha</a>
                            <a href="/">All Castes</a>
                          </div>
                          <div className="submenu-content">
                            <h5>Muslim</h5>
                            <a href="/">Sunni</a>
                            <a href="/">Shia</a>
                            <a href="/">Pathan</a>
                            <a href="/">Mughal</a>
                            <a href="/">All Sects</a>
                          </div>
                          <div className="submenu-content">
                            <h5>Christian</h5>
                            <a href="/">Catholic</a>
                            <a href="/">Protestant</a>
                            <a href="/">Orthodox</a>
                            <a href="/">All Denominations</a>
                          </div>
                          <div className="submenu-content">
                            <h5>Sikh</h5>
                            <a href="/">Jat</a>
                            <a href="/">Khatri</a>
                            <a href="/">Arora</a>
                            <a href="/">Ramgarhia</a>
                            <a href="/">All Castes</a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="submenu-column">
                      <h4>Regional</h4>
                      <a href="/">North Indian</a>
                      <a href="/">South Indian</a>
                      <a href="/">Bengali</a>
                      <a href="/">Marathi</a>
                    </div>

                    <div className="submenu-column">
                      <h4>NRI</h4>
                      <a href="/">USA Matches</a>
                      <a href="/">UK Matches</a>
                      <a href="/">Canada Matches</a>
                      <a href="/">Australia Matches</a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="nav-item">
              <a href="/">Horoscope</a>
            </div>

            <div className="nav-item">
              <a href="/">Blog</a>
            </div>

            <div className="nav-item">
              <a href="/">Success Stories</a>
            </div>
          </div>

          <div className="nav-actions">
            {/* <div className="search-box">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search profiles..." />
            </div> */}
            <button
              className="login-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleLogin();
              }}
            >
              Login / Register
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
