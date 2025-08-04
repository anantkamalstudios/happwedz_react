
// import React from "react";

// const Footer = () => {
//     return (
//         <footer className="footer bg-dark text-light pt-5 mt-8">
//             <div className="container">
//                 <div className="row gy-4">
//                     {/* Start Planning */}
//                     <div className="col-6 col-md-3">
//                         <h6 className="footer-title">Plan Your Wedding</h6>
//                         <ul className="footer-list">
//                             <li><a href="#start-planning">Start Planning</a></li>
//                             <li><a href="#vendor-search">Search By Vendor</a></li>
//                             <li><a href="#city-search">Search By City</a></li>
//                             <li><a href="#top-rated">Top Rated Vendors</a></li>
//                             <li><a href="#destination">Destination Wedding</a></li>
//                             <li><a href="#ideas">Wedding Ideas</a></li>
//                         </ul>
//                     </div>

//                     {/* Blog & Real Weddings */}
//                     <div className="col-6 col-md-3">
//                         <h6 className="footer-title">Inspiration & Ideas</h6>
//                         <ul className="footer-list">
//                             <li><a href="#wedding-blog">Wedding Blog</a></li>
//                             <li><a href="#inspo-gallery">Wedding Inspiration Gallery</a></li>
//                             <li><a href="#real-wedding">Real Wedding</a></li>
//                             <li><a href="#submit-wedding">Submit Your  Wedding</a></li>
//                             <li><a href="#photo-gallery">Photo Gallery</a></li>
//                         </ul>
//                     </div>

//                     {/* Services */}
//                     <div className="col-6 col-md-3">
//                         <h6 className="footer-title">Bridal & Groom Fashion</h6>
//                         <ul className="footer-list">
//                             <li><a href="#bridal-wear">Bridal Wear</a></li>
//                             <li><a href="#jewellery">Wedding Jewellery</a></li>
//                             <li><a href="#makeup-hair">Bridal Makeup &amp; Hair</a></li>
//                             <li><a href="#groom-wear">Groom Wear</a></li>
//                             <li><a href="#accessories">Wedding Accessories</a></li>
//                             <li><a href="#mehendi">Mehendi Designs</a></li>

//                         </ul>
//                     </div>

//                     {/* Company & Tools */}
//                     <div className="col-6 col-md-3">
//                         <h6 className="footer-title">Company</h6>
//                         <ul className="footer-list">
//                             <li><a href="#about">About WedMeGood</a></li>
//                             <li><a href="#careers">Careers</a></li>
//                             <li><a href="#contact">Contact Us</a></li>
//                             <li><a href="#sitemap">Site Map</a></li>
//                             <li><a href="#terms">Terms &amp; Conditions</a></li>
//                             <li><a href="#privacy">Privacy Policy</a></li>
//                             <li><a href="#cancellation">Cancellation Policy</a></li>
//                             <li><a href="#invitation-maker">Wedding Invitation Maker</a></li>
//                             <li><a href="#card-designs">Wedding Card Designs</a></li>
//                             <li><a href="#save-the-date">Save the Date Templates</a></li>
//                             <li><a href="#invitation-video">Invitation Vid</a></li>
//                         </ul>
//                     </div>
//                 </div>

//                 <hr className="my-4 opacity-50" />

//                 <div className="row gy-4">
//                     {/* Newsletter / App CTA */}
//                     <div className="col-12 col-md-4">
//                         <h6 className="footer-title">Get Updates</h6>
//                         <p className="small mb-2">
//                             Subscribe to get the latest wedding inspiration, vendor deals, and tools.
//                         </p>
//                         <form className="d-flex flex-column flex-sm-row gap-2" onSubmit={(e) => e.preventDefault()}>
//                             <input
//                                 type="email"
//                                 placeholder="Email address"
//                                 aria-label="Email address"
//                                 required
//                                 className="form-control"
//                             />
//                             <button type="submit" className="btn btn-primary">
//                                 Subscribe
//                             </button>
//                         </form>
//                     </div>

//                     {/* Social Media */}
//                     <div className="col-12 col-md-4">
//                         <h6 className="footer-title">Follow Us</h6>
//                         <div className="d-flex gap-3 align-items-center">
//                             {/* Facebook */}
//                             <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="social-btn">
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z" />
//                                 </svg>
//                             </a>
//                             {/* Instagram */}
//                             <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="social-instagram">
//                                 <svg width="20" height="20" viewBox="0 0 512 512" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
//                                     <defs>
//                                         <radialGradient id="igGradientFooter" cx="0.5" cy="0.5" r="0.7" fx="0.3" fy="0.3">
//                                             <stop offset="0%" stopColor="#f09433" />
//                                             <stop offset="25%" stopColor="#e6683c" />
//                                             <stop offset="50%" stopColor="#dc2743" />
//                                             <stop offset="75%" stopColor="#cc2366" />
//                                             <stop offset="100%" stopColor="#bc1888" />
//                                         </radialGradient>
//                                     </defs>
//                                     <path
//                                         d="M349.33 69.33H162.67C105.17 69.33 64 110.5 64 168v183.99c0 57.5 41.17 98.67 98.67 98.67h186.67c57.5 0 98.67-41.17 98.67-98.67V168c0-57.5-41.17-98.67-98.67-98.67zm66.67 282.67c0 36.67-29.83 66.67-66.67 66.67H162.67c-36.83 0-66.67-30-66.67-66.67V168c0-36.67 29.83-66.67 66.67-66.67h186.67c36.83 0 66.67 30 66.67 66.67v183.99z"
//                                         fill="url(#igGradientFooter)"
//                                     />
//                                     <circle cx="256" cy="256" r="84" fill="white" opacity="0.8" />
//                                     <circle cx="256" cy="256" r="60" fill="#222" />
//                                     <circle cx="393.6" cy="118.4" r="17.07" fill="url(#igGradientFooter)" />
//                                 </svg>
//                             </a>
//                             {/* Twitter */}
//                             <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="social-btn">
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M23.954 4.569a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723 9.9 9.9 0 0 1-3.127 1.195 4.92 4.92 0 0 0-8.384 4.482A13.97 13.97 0 0 1 1.671 3.149 4.822 4.822 0 0 0 1.05 5.624a4.92 4.92 0 0 0 2.188 4.1 4.902 4.902 0 0 1-2.229-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.224.084 4.937 4.937 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.396 0-.788-.023-1.175-.068a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.01-7.496 14.01-13.986 0-.21-.005-.423-.015-.634a9.936 9.936 0 0 0 2.457-2.548z" />
//                                 </svg>
//                             </a>
//                             {/* YouTube */}
//                             <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="social-btn">
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M23.498 6.186a2.995 2.995 0 0 0-2.111-2.115C19.37 3.5 12 3.5 12 3.5s-7.37 0-9.387.571a2.995 2.995 0 0 0-2.111 2.115C.5 8.203.5 12 .5 12s0 3.797.002 5.814a2.995 2.995 0 0 0 2.111 2.115c2.016.57 9.387.57 9.387.57s7.37 0 9.387-.571a2.995 2.995 0 0 0 2.111-2.115C23.5 15.797 23.5 12 23.5 12s0-3.797-.002-5.814zM9.75 15.02V8.98l6.5 3.02-6.5 3.02z" />
//                                 </svg>
//                             </a>
//                         </div>
//                     </div>

//                     {/* Spacer or additional links area if needed */}
//                     <div className="col-12 col-md-4">
//                         {/* could put app download badges or secondary info */}
//                     </div>
//                 </div>

//                 <hr className="my-4 opacity-50" />

//                 <div className="text-center small">
//                     <p className="mb-0">
//                         &copy; {new Date().getFullYear()} HappWedz Studios. All rights reserved.
//                     </p>
//                 </div>
//             </div>


//             <style>{`
//         .footer-title { /* legacy if used elsewhere */ }
//         .footer {
//           font-family: system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
//         }
//         .footer-title,
//         .section-title {
//           text-transform: uppercase;
//           font-weight: 600;
//           margin-bottom: 0.75rem;
//           font-size: 0.9rem;
//           letter-spacing: 0.05em;
//         }
//         .footer-list {
//           list-style: none;
//           padding: 0;
//           margin: 0;
//         }
//         .footer-list li {
//           margin: 0.35rem 0;
//         }
//         .footer-list a {
//           color: #f1f5fe;
//           text-decoration: none;
//           transition: color .2s;
//           font-size: 0.9rem;
//         }
//         .footer-list a:hover {
//           color: #e83581;
//         }
//         .social-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
//         .social-btn, .social-instagram {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           width: 38px;
//           height: 38px;
//           border-radius: 50%;
//           background: rgba(255,255,255,0.05);
//           color: #f1f5fe;
//           text-decoration: none;
//           transition: transform .2s, background .2s;
//         }
//         .social-btn:hover {
//           background: rgba(255,255,255,0.15);
//           transform: scale(1.1);
//         }
//         .social-instagram:hover {
//           transform: scale(1.1);
//         }
//         @media (max-width: 767px) {
//           .footer-list a { font-size: 0.85rem; }
//         }
//       `}</style>
//         </footer>
//     );
// };

// export default Footer;
import React from "react";

const Footer = () => {
    return (
        <footer className="footer bg-[#54595f] text-dark pt-5">
            <div className="container">
                <div className="row gy-4">
                    {/* Plan Your Wedding */}
                    <div className="col-6 col-md-2">
                        <h6 className="footer-heading">Plan Your Wedding</h6>
                        <ul className="footer-list">
                            <li><a href="#start-planning">Start Planning</a></li>
                            <li><a href="#search-vendor">Search By Vendor</a></li>
                            <li><a href="#search-city">Search By City</a></li>
                            <li><a href="#top-rated">Top Rated Vendors</a></li>
                            <li><a href="#destination">Destination Wedding</a></li>
                            <li><a href="#ideas">Wedding Ideas</a></li>
                        </ul>
                    </div>

                    {/* Inspiration & Ideas */}
                    <div className="col-6 col-md-2">
                        <h6 className="footer-heading">Inspiration &amp; Ideas</h6>
                        <ul className="footer-list">
                            <li><a href="#wedding-blog">Wedding Blog</a></li>
                            <li><a href="#inspo-gallery">Wedding Inspiration Gallery</a></li>
                            <li><a href="#real-weddings">Real Weddings</a></li>
                            <li><a href="#submit-wedding">Submit Your Wedding</a></li>
                            <li><a href="#photo-gallery">Photo Gallery</a></li>
                        </ul>
                    </div>

                    {/* Bridal & Groom Fashion */}
                    <div className="col-6 col-md-2">
                        <h6 className="footer-heading">Bridal &amp; Groom Fashion</h6>
                        <ul className="footer-list">
                            <li><a href="#bridal-wear">Bridal Wear</a></li>
                            <li><a href="#jewellery">Wedding Jewellery</a></li>
                            <li><a href="#makeup-hair">Bridal Makeup &amp; Hair</a></li>
                            <li><a href="#groom-wear">Groom Wear</a></li>
                            <li><a href="#accessories">Wedding Accessories</a></li>
                            <li><a href="#mehendi">Mehendi Designs</a></li>
                        </ul>
                    </div>

                    {/* Wedding Services */}
                    <div className="col-6 col-md-2">
                        <h6 className="footer-heading">Wedding Services</h6>
                        <ul className="footer-list">
                            <li><a href="#photography">Wedding Photography</a></li>
                            <li><a href="#decor">Wedding Decor</a></li>
                            <li><a href="#invitations">Invitations &amp; Favors</a></li>
                            <li><a href="#invitation-maker">Wedding Invitation Maker</a></li>
                            <li><a href="#card-designs">Wedding Card Designs</a></li>
                            <li><a href="#save-the-date">Save the Date Templates</a></li>
                            <li><a href="#video-templates">Invitation Video Templates</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="col-6 col-md-2">
                        <h6 className="footer-heading">Company</h6>
                        <ul className="footer-list">
                            <li><a href="#about">About WedMeGood</a></li>
                            <li><a href="#careers">Careers</a></li>
                            <li><a href="#contact">Contact Us</a></li>
                            <li><a href="#sitemap">Site Map</a></li>
                        </ul>
                    </div>

                    {/* Legal + Mobile App + Social */}
                    <div className="col-12 col-md-2">
                        <div className="row">
                            <div className="col-6 col-sm-6 mb-3">
                                <h6 className="footer-heading">Legal</h6>
                                <ul className="footer-list">
                                    <li><a href="#terms">Terms &amp; Conditions</a></li>
                                    <li><a href="#privacy">Privacy Policy</a></li>
                                    <li><a href="#cancellation">Cancellation Policy</a></li>
                                </ul>
                            </div>
                            <div className="col-6 col-sm-6 mb-3">
                                <h6 className="footer-heading">Mobile App</h6>
                                <div className="d-flex flex-column gap-2">
                                    <a href="#download-app" className="app-badge">

                                        <div className="badge-flex">

                                            <div style={{ marginLeft: "5px" }}>
                                                <div style={{ fontSize: "10px", lineHeight: 1 }}>Download on the</div>
                                                <div style={{ fontWeight: 700 }}>App Store</div>
                                            </div>
                                        </div>
                                    </a>

                                </div>
                            </div>
                            <div className="col-12">
                                <h6 className="footer-heading">Follow Us</h6>
                                <div className="d-flex gap-1 align-items-center social-row">

                                    <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="social-btn">
                                        <i class="fa-brands fa-facebook-f"></i>
                                    </a>

                                    <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="social-instagram">
                                        <i class="fa-brands fa-instagram"></i>
                                    </a>

                                    <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="social-btn">
                                        <i class="fa-brands fa-twitter"></i>
                                    </a>

                                    <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="social-btn">
                                        <i class="fa-brands fa-youtube"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-4 opacity-50" />

                <div className="text-center small">
                    <p className="mb-0">
                        &copy; {new Date().getFullYear()} HappWedz Studios. All rights reserved.
                    </p>
                </div>
            </div>

            <style>{`
        .footer {
          font-family: Poppins", sans-serif;
        }
        .footer-heading,
        .footer-title {
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }
        .footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-list li {
          margin: 0.35rem 0;
        }
        .footer-list a {
          color: #212529;
          text-decoration: none;
          font-size: 0.85rem;
          transition: color .2s;
        }
        .footer-list a:hover {
          color: #e83581;
        }
        .social-row {
          gap: 0.75rem;
          display: flex;
          flex-wrap: wrap;
        }
        .social-btn, .social-instagram {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          color: #212529;
          text-decoration: none;
          transition: transform .2s, background .2s;
        }
        .social-btn:hover, .social-instagram:hover {
          transform: scale(1.1);
          background: rgba(255,255,255,0.15);
        }
        .app-badge {
          display: inline-block;
          text-decoration: none;
          color: #212529;
          background: rgba(255,255,255,0.05);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.7rem;
          width: fit-content;
          transition: background .2s;
        }
        .app-badge:hover {
           background: rgba(255,255,255,0.15);
        }
        .badge-flex {
          display: flex;
          align-items: center;
        }
        @media (max-width: 767px) {
          .footer-list a {
            font-size: 0.78rem;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
