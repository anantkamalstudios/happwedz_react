import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div>
      <section className="py-3 py-md-5 py-xl-8">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold primary-text mb-3">
              About HappyWedz
            </h2>
            <p className="lead text-black">
              {/* India’s favourite wedding planning website & app with over{" "}
                            <strong>1.5 million monthly dedicated users</strong>.{" "}
                            <strong>HappyWedz</strong> is a modern alternative to outdated
                            wedding planning methods — a one-stop destination for all things
                            weddings. Discover inspiration, ideas, and verified vendors within
                            your budget. Trusted by over <strong>2 million brides & grooms</strong>
                            across the world, HappyWedz helps you plan your big day with ease. */}
              Your Complete Online Wedding Planning Destination HappyWedz is a
              modern, easy-to-use wedding planning platform in India that helps
              couples plan their special day effortlessly. From discovering
              wedding themes, décor ideas, bridal fashion, groom styling, venue
              inspiration, to finding trusted wedding vendors in your city —
              everything you need is right here. Search and compare
              photographers, makeup artists, decorators, caterers, wedding
              venues, mehandi artists, and more based on your budget, style, and
              location. Every vendor listed on HappyWedz is verified to ensure
              reliable and professional service. Whether you’re planning a
              traditional ceremony or a modern destination wedding, HappyWedz
              helps you create a celebration filled with joy, beauty, and
              personal meaning — without stress. Start planning the wedding of
              your dreams with HappyWedz — simple, smart, and beautifully
              organized.
            </p>
          </div>

          <hr className="w-50 mx-auto border-dark-subtle mb-5" />

          {/* Make Planning Decisions */}
          <div className="mb-5">
            <h3 className="fw-bold mb-3 primary-text text-center">
              Make Planning Decisions
            </h3>

            <div className="row gy-4">
              {/* Vendors */}
              <div className="col-md-6">
                <div className="p-4 border rounded shadow-sm bg-white h-100">
                  <h4 className="fw-bold mb-2 text-dark">Vendors</h4>
                  <p className="text-black">
                    Discover thousands of trusted wedding vendors all in one
                    place at HappyWedz! From expert wedding photographers and
                    creative decorators to experienced makeup artists, caterers,
                    and wedding priests, we’ve got every service you need to
                    make your big day perfect.
                  </p>
                </div>
              </div>

              {/* Bridal Gallery / Shop */}
              <div className="col-md-6">
                <div className="p-4 border rounded shadow-sm bg-white h-100">
                  <h4 className="fw-bold mb-2 text-dark">
                    HappyWedz Bridal Gallery – Find Your Dream Bridal Look
                  </h4>
                  <p className="text-black">
                    Discover your perfect wedding outfit at HappyWedz Bridal
                    Gallery. Browse a wide range of designer bridal wear, from
                    classic lehengas and sarees to modern gowns and fusion
                    styles. Connect directly with bridal designers to customize
                    your look and enjoy a seamless online shopping experience
                    from home. Start your bridal fashion journey with HappyWedz,
                    where elegance meets style, and every bride finds the
                    outfit of her dreams.
                  </p>
                </div>
              </div>

              {/* Genie */}
              <div className="col-md-6">
                <div className="p-4 border rounded shadow-sm bg-white h-100">
                  <h4 className="fw-bold mb-2 text-dark">Genie</h4>
                  <p className="text-black">
                    Not sure where to begin your wedding planning journey? Let
                    HappyWedz Genie, your AI-powered wedding planner, do the
                    magic for you! Powered by smart technology, the HappyWedz
                    Genie instantly understands your budget, style, and
                    preferences, and recommends the best wedding vendors — from
                    photographers and makeup artists to decorators and planners.
                    Save hours of scrolling and comparing — just tell Genie what
                    you’re looking for, and it will find your perfect wedding
                    matches in seconds. Simple, smart, and stress-free! Let
                    HappyWedz Genie turn your dream wedding vision into reality
                    with the power of AI.
                  </p>
                </div>
              </div>

              {/* Mynt */}
              <div className="col-md-6">
                <div className="p-4 border rounded shadow-sm bg-white h-100">
                  <h4 className="fw-bold mb-2 text-dark">HappyWedz Mynt</h4>
                  <p className="text-black">
                    An exclusive loyalty program for brides and grooms-to-be,
                    offering <strong>special offers and rewards</strong> from
                    100+ premium brands in bridal wear, travel, jewellery,
                    beauty, and more!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inspiration Section */}
          <div className="my-5">
            <h3 className="fw-bold mb-3 primary-text text-center">
              Still early in your journey? Get inspired with HappyWedz
            </h3>

            <div className="row gy-4">
              {/* Photos */}
              <div className="col-md-6">
                <div className="p-4 border rounded shadow-sm bg-white h-100">
                  <h4 className="fw-bold mb-2 text-dark">Photos</h4>
                  <p className="text-black">
                    Dive into a world of stunning wedding inspiration with the
                    HappyWedz Photo Gallery. Discover beautiful ideas for bridal
                    lehengas, groom outfits, wedding décor, pre-wedding shoots,
                    and more — all curated to spark your creativity and help you
                    shape your dream celebration. From timeless traditions to
                    trending styles, explore thousands of real wedding photos
                    shared by couples and professionals across India. Get
                    inspired, save your favorite looks, and bring your wedding
                    vision to life with HappyWedz.
                  </p>
                </div>
              </div>

              {/* Real Weddings */}
              <div className="col-md-6">
                <div className="p-4 border rounded shadow-sm bg-white h-100">
                  <h4 className="fw-bold mb-2 text-dark">
                    Real Weddings – Where Love Stories Come to Life 💍
                  </h4>
                  <p className="text-black">
                    Every love story is special, and at HappyWedz, we celebrate
                    them all. Explore real weddings shared by couples from
                    across India — each filled with heartfelt moments, creative
                    themes, stunning décor, and unforgettable celebrations. Get
                    inspired by true wedding stories, browse beautiful photos,
                    and discover fresh ideas for your own big day. From intimate
                    ceremonies to grand destination weddings, find endless
                    inspiration and real experiences only on HappyWedz.
                  </p>
                </div>
              </div>

              {/* Blog */}
              <div className="col-md-12">
                <div className="p-4 border rounded shadow-sm bg-white h-100">
                  <h4 className="fw-bold mb-2 text-dark">
                    HappyWedz Blog – Your Ultimate Wedding Inspiration Hub ✨
                  </h4>
                  <p className="text-black">
                    Step into the HappyWedz Blog, your go-to space for
                    everything wedding! Discover the latest bridal fashion
                    trends, decor inspirations, planning tips, and creative
                    ideas to make your celebration truly one of a kind. Whether
                    you’re exploring timeless traditions or modern wedding
                    styles, our blog brings you expert advice, trend updates,
                    and real stories to help you plan with confidence. Stay
                    inspired and plan smarter with the HappyWedz Blog — your
                    trusted guide to all things wedding!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="my-5">
            <h3 className="fw-bold mb-3 primary-text text-center">
              Our Exclusive Features
            </h3>

            <div className="row gy-4">
              {/* Design Studio */}
              <div className="col-md-6">
                <div className="p-4 border rounded shadow-sm bg-white h-100">
                  <h4 className="fw-bold mb-2 text-dark">AI Design Studio</h4>
                  <p className="text-black">
                    Personalize your wedding e-invites with our{" "}
                    <strong>AI-powered Design Studio</strong>. Apply creative
                    filters, edit designs, and visualize your invites in real
                    time.
                  </p>
                </div>
              </div>

              {/* Mobile Apps */}
              <div className="col-md-6">
                <div className="p-4 border rounded shadow-sm bg-white h-100">
                  <h4 className="fw-bold mb-2 text-dark">
                    Available on Android & iOS
                  </h4>
                  <p className="text-black">
                    Download the <strong>HappyWedz app</strong> from Google Play
                    or the Apple App Store for a seamless planning experience.
                    Plan, manage, and track your wedding anytime, anywhere!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final Section */}
          <div className="text-center mt-5">
            <h3 className="fw-bold mb-3 primary-text">
              Celebrating Responsibly with HappyWedz 🌿
            </h3>
            <p className="lead text-black mb-4 fs-18">
              At HappyWedz, we believe every celebration can make a positive
              impact. Beyond creating unforgettable weddings, we are committed
              to environmental sustainability, social welfare, and community
              empowerment. From promoting eco-friendly wedding solutions to
              supporting local artisans and small vendors, our initiatives
              ensure that your special day is not only beautiful but also
              responsible. Celebrate love while making a meaningful
              difference with HappyWedz.
            </p>
          </div>
        </div>
        <div className="container">
          <div className="row gy-4 gy-lg-0 align-items-lg-center">
            <div className="col-12 col-lg-6">
              <img
                className="img-fluid rounded border border-dark"
                loading="lazy"
                src="./images/categories/venues.jpg"
                alt="About Us"
              />
            </div>
            <div className="col-12 col-lg-6 col-xxl-6">
              <div className="row justify-content-lg-end">
                <div className="col-12 col-lg-11">
                  <div className="about-wrapper">
                    <p className="fs-18 mb-4 mb-md-5">
                      At HappyWedz, we believe that celebrations should also
                      create a positive impact. Beyond weddings, we are
                      committed to supporting the communities we serve through
                      meaningful initiatives in environmental sustainability,
                      social welfare, and empowerment. From promoting
                      eco-friendly wedding solutions to collaborating with local
                      artisans and small vendors, our goal is to make every
                      celebration beautiful — and responsible.
                    </p>
                    <div className="row gy-4 mb-4 mb-md-5">
                      <div className="col-12 col-md-6">
                        <div className="card border border-dark">
                          <div className="card-body p-4">
                            <h3 className="display-5 fw-bold primary-text text-center mb-2">
                              370+
                            </h3>
                            <p className="fw-bold text-center m-0">
                              Qualified Experts
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="card border border-dark">
                          <div className="card-body p-4">
                            <h3 className="display-5 fw-bold primary-text text-center mb-2">
                              18k+
                            </h3>
                            <p className="fw-bold text-center m-0">
                              Satisfied Clients
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <Link to="/" className="btn btn-primary bsb-btn-2xl">
                                            Explore
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-short" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8" />
                                            </svg>
                                        </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
