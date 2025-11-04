// import React, { useState, useEffect } from "react";
// import { Modal, Button, Form, Row, Col } from "react-bootstrap";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { setLocation, clearLocation } from "../../redux/locationSlice";
// import { useNavigate } from "react-router-dom";
// import { RxCrossCircled } from "react-icons/rx";
// import { IoMdArrowDropdown } from "react-icons/io";

// const LocationModalWithAPI = () => {
//   const [show, setShow] = useState(false);
//   const dispatch = useDispatch();
//   const selectedLocation = useSelector(
//     (state) => state.location.selectedLocation
//   );
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [countries, setCountries] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("India");

//   const staticCityData = {
//     topCities: [
//       "All Cities",
//       "Delhi NCR",
//       "Mumbai",
//       "Bangalore",
//       "Chennai",
//       "Pune",
//       "Lucknow",
//       "Jaipur",
//       "Kolkata",
//       "Hyderabad",
//     ],
//     popularCities: [
//       "Gurgaon",
//       "Goa",
//       "Udaipur",
//       "Jim Corbett",
//       "Indore",
//       "Agra",
//       "Kanpur",
//       "Ahmedabad",
//       "Navi Mumbai",
//       "Kochi",
//     ],
//     otherCities: [
//       "Nagpur",
//       "Dehradun",
//       "Thane",
//       "Surat",
//       "Vadodara",
//       "Raipur",
//       "Mysore",
//       "Hubli",
//       "Dhitara",
//       "Toranagallu",
//     ],
//     states: ["Kerala", "Rajasthan", "Himachal Pradesh", "Maharashtra"],
//     internationalCities: ["Dubai", "Thailand", "Bali", "Abu Dhabi"],
//   };

//   useEffect(() => {
//     axios.get("https://restcountries.com/v3.1/all?fields=name").then((res) => {
//       const sorted = res.data
//         .map((c) => c.name.common)
//         .sort((a, b) => a.localeCompare(b));

//       setCountries(sorted);
//     });
//   }, []);

//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setCities([]);
//       return;
//     }

//     if (!selectedCountry) return;

//     axios
//       .post("https://countriesnow.space/api/v0.1/countries/cities", {
//         country: selectedCountry,
//       })
//       .then((res) => {
//         if (res.data && res.data.data) {
//           setCities(res.data.data);
//         } else {
//           setCities([]);
//         }
//       })
//       .catch(() => setCities([]));
//   }, [selectedCountry, searchTerm]);

//   const filterCities = searchTerm.trim()
//     ? cities.filter((city) =>
//         city.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : [];

//   const handleCityClick = (city) => {
//     if (city === "All Cities") {
//       dispatch(clearLocation());
//     } else {
//       dispatch(setLocation(city));
//     }
//     setShow(false);
//     setSearchTerm("");

//     setTimeout(() => {
//       navigate(
//         `/vendors/all${
//           city !== "All Cities" ? `?city=${encodeURIComponent(city)}` : ""
//         }`
//       );
//     }, 300);
//   };

//   const handleClearLocation = (e) => {
//     e.stopPropagation();
//     dispatch(clearLocation());
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleModalClose = () => {
//     setShow(false);
//     setSearchTerm("");
//   };

//   return (
//     <>
//       <div style={{ position: "relative", display: "inline-block" }}>
//         <Button
//           variant="outline-light"
//           className="border-danger rounded-0 text-dark d-flex align-items-center justify-content-between px-3"
//           onClick={() => setShow(true)}
//           style={{
//             minWidth: 180,
//             height: 40,
//             backgroundColor: "#fff",
//           }}
//         >
//           <span className="d-flex align-items-center gap-2">
//             {selectedLocation ? (
//               <span className="fw-medium">{selectedLocation}</span>
//             ) : (
//               <span className="text-dark">Select Location</span>
//             )}
//           </span>

//           {selectedLocation ? (
//             <RxCrossCircled
//               size={20}
//               color="#d00"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleClearLocation(e);
//               }}
//               style={{ cursor: "pointer" }}
//             />
//           ) : (
//             <IoMdArrowDropdown size={25} color="#000" />
//           )}
//         </Button>
//       </div>

//       <Modal
//         show={show}
//         onHide={handleModalClose}
//         size="xl"
//         className="location-model-modal-dialog-centered"
//         backdrop={true}
//         keyboard={true}
//         style={{ top: "2rem" }}
//       >
//         <Modal.Body>
//           <Form.Select
//             className="mb-3 d-none"
//             value={selectedCountry}
//             onChange={(e) => setSelectedCountry(e.target.value)}
//           >
//             <option value="">Select Country</option>
//             {countries.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </Form.Select>

//           <Form.Control
//             type="text"
//             placeholder="Search City, State..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="mb-4 p-3"
//           />

//           <div
//             style={{
//               padding: "1rem",
//               maxHeight: "400px",
//               overflowY: "hidden",
//               overflowX: "hidden",
//             }}
//           >
//             {/* Show API results when searching */}
//             {searchTerm.trim() ? (
//               filterCities.length === 0 ? (
//                 <div className="text-center text-muted py-3">
//                   No cities found.
//                 </div>
//               ) : (
//                 <div className="d-flex flex-wrap justify-content-center">
//                   {filterCities.map((city) => (
//                     <div
//                       key={city}
//                       className="p-2 text-start"
//                       style={{ minWidth: "150px" }}
//                     >
//                       <a
//                         href="#"
//                         className="text-dark d-block text-decoration-none small"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           handleCityClick(city);
//                         }}
//                       >
//                         {city}
//                       </a>
//                     </div>
//                   ))}
//                 </div>
//               )
//             ) : (
//               /* Show static data when not searching */
//               <Row>
//                 {/* Top Cities */}
//                 <Col md={3} className="mb-4">
//                   <h6 className="primary-text fw-bold mb-3">Top Cities</h6>
//                   {staticCityData.topCities.map((city) => (
//                     <div key={city} className="mb-2">
//                       <a
//                         href="#"
//                         className="text-dark text-decoration-none d-block"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           handleCityClick(city);
//                         }}
//                       >
//                         {city}
//                       </a>
//                     </div>
//                   ))}
//                 </Col>

//                 {/* Popular Cities */}
//                 <Col
//                   md={3}
//                   className="mb-4"
//                   style={{ backgroundColor: "#f0f0f0" }}
//                 >
//                   <h6 className="primary-text fw-bold mb-3">Popular Cities</h6>
//                   {staticCityData.popularCities.map((city) => (
//                     <div key={city} className="mb-2">
//                       <a
//                         href="#"
//                         className="text-dark text-decoration-none d-block"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           handleCityClick(city);
//                         }}
//                       >
//                         {city}
//                       </a>
//                     </div>
//                   ))}
//                 </Col>

//                 {/* Other Cities */}
//                 <Col md={3} className="mb-4">
//                   <h6 className="primary-text fw-bold mb-3">Other Cities</h6>
//                   {staticCityData.otherCities.map((city) => (
//                     <div key={city} className="mb-2">
//                       <a
//                         href="#"
//                         className="text-dark text-decoration-none d-block"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           handleCityClick(city);
//                         }}
//                       >
//                         {city}
//                       </a>
//                     </div>
//                   ))}
//                 </Col>

//                 {/* States & International */}
//                 <Col md={3} className="mb-4" style={{ background: "#f0f0f0" }}>
//                   <h6 className="primary-text fw-bold mb-3">States</h6>
//                   {staticCityData.states.map((state) => (
//                     <div key={state} className="mb-2">
//                       <a
//                         href="#"
//                         className="text-dark text-decoration-none d-block"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           handleCityClick(state);
//                         }}
//                       >
//                         {state}
//                       </a>
//                     </div>
//                   ))}

//                   <h6 className="primary-text fw-bold mb-3 mt-4">
//                     International Cities
//                   </h6>
//                   {staticCityData.internationalCities.map((city) => (
//                     <div key={city} className="mb-2">
//                       <a
//                         href="#"
//                         className="text-dark text-decoration-none d-block"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           handleCityClick(city);
//                         }}
//                       >
//                         {city}
//                       </a>
//                     </div>
//                   ))}
//                 </Col>
//               </Row>
//             )}
//           </div>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default LocationModalWithAPI;
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLocation, clearLocation } from "../../redux/locationSlice";
import { useNavigate } from "react-router-dom";
import { RxCrossCircled } from "react-icons/rx";
import { IoMdArrowDropdown } from "react-icons/io";

const LocationModalWithAPI = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation
  );
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");

  const staticCityData = {
    topCities: [
      "All Cities",
      "Delhi NCR",
      "Mumbai",
      "Bangalore",
      "Chennai",
      "Pune",
      "Lucknow",
      "Jaipur",
      "Kolkata",
      "Hyderabad",
    ],
    popularCities: [
      "Gurgaon",
      "Goa",
      "Udaipur",
      "Jim Corbett",
      "Indore",
      "Agra",
      "Kanpur",
      "Ahmedabad",
      "Navi Mumbai",
      "Kochi",
    ],
    otherCities: [
      "Nagpur",
      "Dehradun",
      "Thane",
      "Surat",
      "Vadodara",
      "Raipur",
      "Mysore",
      "Hubli",
      "Dhitara",
      "Toranagallu",
    ],
    states: ["Kerala", "Rajasthan", "Himachal Pradesh", "Maharashtra"],
    internationalCities: ["Dubai", "Thailand", "Bali", "Abu Dhabi"],
  };

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all?fields=name").then((res) => {
      const sorted = res.data
        .map((c) => c.name.common)
        .sort((a, b) => a.localeCompare(b));
      setCountries(sorted);
    });
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setCities([]);
      return;
    }

    if (!selectedCountry) return;

    axios
      .post("https://countriesnow.space/api/v0.1/countries/cities", {
        country: selectedCountry,
      })
      .then((res) => {
        if (res.data && res.data.data) {
          setCities(res.data.data);
        } else {
          setCities([]);
        }
      })
      .catch(() => setCities([]));
  }, [selectedCountry, searchTerm]);

  const filterCities = searchTerm.trim()
    ? cities.filter((city) =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleCityClick = (city) => {
    if (city === "All Cities") {
      dispatch(clearLocation());
    } else {
      dispatch(setLocation(city));
    }
    setShow(false);
    setSearchTerm("");

    setTimeout(() => {
      navigate(
        `/vendors/all${
          city !== "All Cities" ? `?city=${encodeURIComponent(city)}` : ""
        }`
      );
    }, 300);
  };

  const handleClearLocation = (e) => {
    e.stopPropagation();
    dispatch(clearLocation());
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleModalClose = () => {
    setShow(false);
    setSearchTerm("");
  };

  return (
    <>
      <div style={{ position: "relative", display: "inline-block" }}>
        <Button
          variant="outline-light"
          className="border-danger rounded-0 text-dark d-flex align-items-center justify-content-between px-3"
          onClick={() => setShow(true)}
          style={{
            minWidth: 180,
            height: 40,
            backgroundColor: "#fff",
          }}
        >
          <span className="d-flex align-items-center gap-2">
            {selectedLocation ? (
              <span className="fw-medium">{selectedLocation}</span>
            ) : (
              <span className="text-dark">Select Location</span>
            )}
          </span>

          {selectedLocation ? (
            <RxCrossCircled
              size={20}
              color="#d00"
              onClick={(e) => {
                e.stopPropagation();
                handleClearLocation(e);
              }}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <IoMdArrowDropdown size={25} color="#000" />
          )}
        </Button>
      </div>

      <Modal
        show={show}
        onHide={handleModalClose}
        size="xl"
        className="location-model-modal-dialog-centered"
        backdrop={true}
        keyboard={true}
        style={{ top: "2rem" }}
      >
        <Modal.Body style={{ padding: 0 }}>
          <div style={{ padding: "1rem 1rem 0rem 1rem" }}>
            <Form.Select
              className=" d-none"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Form.Select>

            <Form.Control
              type="text"
              placeholder="Search City, State..."
              value={searchTerm}
              onChange={handleSearchChange}
              className=" p-3"
            />
          </div>

          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {/* Show API results when searching */}
            {searchTerm.trim() ? (
              filterCities.length === 0 ? (
                <div className="text-center text-muted py-3">
                  No cities found.
                </div>
              ) : (
                <div className="d-flex flex-wrap justify-content-center p-3">
                  {filterCities.map((city) => (
                    <div
                      key={city}
                      className="p-2 text-start"
                      style={{ minWidth: "150px" }}
                    >
                      <a
                        href="#"
                        className="text-dark d-block text-decoration-none small"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCityClick(city);
                        }}
                      >
                        {city}
                      </a>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Show static data with full-height backgrounds */
              <div style={{ display: "flex", minHeight: "400px" }}>
                {/* Top Cities - Column 1 */}
                <div style={{ flex: "0 0 25%", padding: "1rem" }}>
                  <h6 className="primary-text fw-bold mb-3 mt-2">Top Cities</h6>
                  {staticCityData.topCities.map((city) => (
                    <div key={city} className="mb-2">
                      <a
                        href="#"
                        className="text-dark text-decoration-none d-block"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCityClick(city);
                        }}
                      >
                        {city}
                      </a>
                    </div>
                  ))}
                </div>

                {/* Popular Cities - Column 2 (Gray Background) */}
                <div
                  style={{
                    flex: "0 0 25%",
                    padding: "1rem",
                    backgroundColor: "#fbfbfb",
                  }}
                >
                  <h6 className="primary-text fw-bold mb-3 mt-2">
                    Popular Cities
                  </h6>
                  {staticCityData.popularCities.map((city) => (
                    <div key={city} className="mb-2">
                      <a
                        href="#"
                        className="text-dark text-decoration-none d-block"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCityClick(city);
                        }}
                      >
                        {city}
                      </a>
                    </div>
                  ))}
                </div>

                {/* Other Cities - Column 3 */}
                <div style={{ flex: "0 0 25%", padding: "1rem" }}>
                  <h6 className="primary-text fw-bold mb-3 mt-2">
                    Other Cities
                  </h6>
                  {staticCityData.otherCities.map((city) => (
                    <div key={city} className="mb-2">
                      <a
                        href="#"
                        className="text-dark text-decoration-none d-block"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCityClick(city);
                        }}
                      >
                        {city}
                      </a>
                    </div>
                  ))}
                </div>

                {/* States & International - Column 4 (Gray Background) */}
                <div
                  style={{
                    flex: "0 0 25%",
                    padding: "1rem",
                    backgroundColor: "#fbfbfb",
                    borderBottomRightRadius: "11px",
                  }}
                >
                  <h6 className="primary-text fw-bold mb-3 mt-2">States</h6>
                  {staticCityData.states.map((state) => (
                    <div key={state} className="mb-2">
                      <a
                        href="#"
                        className="text-dark text-decoration-none d-block"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCityClick(state);
                        }}
                      >
                        {state}
                      </a>
                    </div>
                  ))}

                  <h6 className="primary-text fw-bold mb-3 mt-3">
                    International Cities
                  </h6>
                  {staticCityData.internationalCities.map((city) => (
                    <div key={city} className="mb-2">
                      <a
                        href="#"
                        className="text-dark text-decoration-none d-block"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCityClick(city);
                        }}
                      >
                        {city}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LocationModalWithAPI;
