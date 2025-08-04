// import './App.css'
// import Footer from './components/layouts/Footer'



// import Header from './components/layouts/Header'

// function App() {
//   return (
//     <>
//       <Header />

//       <Footer />
//     </>
//   )
// }

// export default App
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/pages/Home";


function App() {
  return (
    <>
      <Header />

      <main style={{ minHeight: "70vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />




        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;

