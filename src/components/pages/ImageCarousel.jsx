// export default function ImageSection() {
//   return (
//     <div
//       style={{
//         minHeight: "80vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "20px",
//       }}
//     >
//       <div
//         style={{
//           width: "100%",
//           maxWidth: "1100px",
//           display: "flex",
//           gap: "30px",
//           flexWrap: "wrap",
//         }}
//       >
//         {/* LEFT SIDE - SINGLE IMAGE */}
//         <div style={{ flex: "1 1 50%", minWidth: "300px" }}>
//           <div
//             style={{
//               width: "100%",
//               height: "450px",
//               borderRadius: "10px",
//               overflow: "hidden",
//               boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
//             }}
//           >
//             <img
//               src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
//               alt="Wedding"
//               style={{ width: "100%", height: "100%", objectFit: "cover" }}
//             />
//           </div>
//         </div>

//         {/* RIGHT SIDE - DESCRIPTION */}
//         {/* <div
//           style={{
//             flex: "1 1 50%",
//             minWidth: "300px",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//           }}
//         >
//           <h1 style={{ color: "#e91e63", marginBottom: "20px" }}>
//             Real People: Real Stories
//           </h1>

//           <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#444" }}>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
//             eveniet suscipit deserunt minus quod sint qui possimus illum
//             asperiores, laborum deleniti ducimus dolor corrupti. Accusamus
//             reprehenderit eveniet sed eum.
//           </p>

//           <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#444" }}>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis quos
//             nostrum tenetur ad numquam. Autem dolore fuga hic quibusdam
//             possimus. Itaque voluptatem consectetur earum iusto accusamus.
//           </p>
//         </div> */}
//       </div>
//     </div>
//   );
// }


import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DestinationWeddingHero = () => {
  return (
    <section style={styles.section}>
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Side - Image */}
          <div className="col-lg-6 col-12" data-aos="fade-right">
            <div style={styles.imageWrapper}>
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=900&fit=crop"
                alt="Mountain Destination Wedding"
                style={styles.image}
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="col-lg-6 col-12" data-aos="fade-left">
            <div style={styles.contentWrapper}>
              <h1 style={styles.mainTitle}>Destination Weddings</h1>
              <h2 style={styles.subtitle}>Your Day. Your Way. With HappyWedz</h2>
              
              <p style={styles.paragraph}>
            Planning a destination wedding should feel magical — not stressful. At HappyWedz, we bring your dream celebration to life by connecting you with the best venues, vendors, planners, and experiences across India and abroad.

Whether you're dreaming of a royal palace wedding in Rajasthan, a serene beachside celebration in Goa, or an intimate mountain ceremony in Himachal — we help you discover verified venues, compare packages, explore real photos, and book trusted professionals effortlessly.
              </p>

              
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @media (max-width: 991px) {
          .row {
            flex-direction: column-reverse;
          }
        }
      `}</style>
    </section>
  );
};

const styles = {
  section: {
    padding: '70px 0',
    backgroundColor: '#FFFFFF',
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    aspectRatio: '4/4',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  contentWrapper: {
    padding: '0 20px',
  },
  mainTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '16px',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    fontWeight: '400',
    color: '#374151',
    marginBottom: '32px',
    lineHeight: '1.3',
  },
  paragraph: {
    fontSize: '1rem',
    lineHeight: '1.8',
    color: '#6B7280',
    marginBottom: '24px',
    textAlign: 'justify',
  },
};

export default DestinationWeddingHero;