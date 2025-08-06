// import React from 'react'
// import VenuesHeroSection from "../layouts/venus/VenuesHeroSection";

// const Venus = () => {
//     return (
//         <>
//             <VenuesHeroSection />
//         </>
//     )
// }

// export default Venus;
import React from "react";
import VenueSearch from "../../components/layouts/venus/VenuesSearch";
import VenuesHeroSection from "../../components/layouts/venus/VenuesHeroSection";

function Venus() {
  return (
    <>
      <VenueSearch />
      <VenuesHeroSection loc={"Mumbai"} />
      <VenuesHeroSection loc={"Nashik"} />
      <VenuesHeroSection loc={"Pune"} />
    </>
  );
}

export default Venus;
