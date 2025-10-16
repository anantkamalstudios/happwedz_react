import React from 'react'
import { Link } from 'react-router-dom'

const AboutUs = () => {
    return (
        <div>
            <section className="py-3 py-md-5 py-xl-8">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold primary-text mb-3">About HappyWedz</h2>
                        <p className="lead text-black">
                            India’s favourite wedding planning website & app with over{" "}
                            <strong>1.5 million monthly dedicated users</strong>.{" "}
                            <strong>HappyWedz</strong> is a modern alternative to outdated
                            wedding planning methods — a one-stop destination for all things
                            weddings. Discover inspiration, ideas, and verified vendors within
                            your budget. Trusted by over <strong>2 million brides & grooms</strong>
                            across the world, HappyWedz helps you plan your big day with ease.
                        </p>
                        <p className="text-muted">
                            So sit back, log on to HappyWedz, and plan the wedding of your dreams!
                        </p>
                    </div>

                    <hr className="w-50 mx-auto border-dark-subtle mb-5" />

                    {/* Make Planning Decisions */}
                    <div className="mb-5">
                        <h3 className="fw-bold mb-3 primary-text text-center">Make Planning Decisions</h3>

                        <div className="row gy-4">
                            {/* Vendors */}
                            <div className="col-md-6">
                                <div className="p-4 border rounded shadow-sm bg-white h-100">
                                    <h4 className="fw-bold mb-2 text-dark">Vendors</h4>
                                    <p className="text-black">
                                        From photographers to wedding priests, HappyWedz has{" "}
                                        <strong>80,000+ active vendors</strong> for you to choose
                                        from. Browse their portfolios, check prices, read genuine
                                        reviews, and book the best vendors that match your vision.
                                    </p>
                                </div>
                            </div>

                            {/* Bridal Gallery / Shop */}
                            <div className="col-md-6">
                                <div className="p-4 border rounded shadow-sm bg-white h-100">
                                    <h4 className="fw-bold mb-2 text-dark">HappyWedz Bridal Gallery / Shop</h4>
                                    <p className="text-black">
                                        Your one-stop wedding shop — explore <strong>2000+ bridal outfits</strong>,
                                        chat directly with designers, and find your dream look from
                                        the comfort of your home. Begin your wedding shopping journey
                                        with us!
                                    </p>
                                </div>
                            </div>

                            {/* Genie */}
                            <div className="col-md-6">
                                <div className="p-4 border rounded shadow-sm bg-white h-100">
                                    <h4 className="fw-bold mb-2 text-dark">Genie</h4>
                                    <p className="text-black">
                                        Not sure where to start? Let our <strong>HappyWedz Genie</strong>{" "}
                                        help! Our expert Genie team finds the best vendors based on
                                        your budget, style, and preferences — saving you hours of
                                        research time.
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
                                        100+ premium brands in bridal wear, travel, jewellery, beauty,
                                        and more!
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
                                        With over <strong>4 million photos</strong>, you’ll find
                                        endless inspiration for your wedding vision — from trending
                                        lehenga designs to dreamy decor and pre-wedding photoshoots.
                                        Don’t blame us if you’re spoilt for choice!
                                    </p>
                                </div>
                            </div>

                            {/* Real Weddings */}
                            <div className="col-md-6">
                                <div className="p-4 border rounded shadow-sm bg-white h-100">
                                    <h4 className="fw-bold mb-2 text-dark">Real Weddings</h4>
                                    <p className="text-black">
                                        Every love story deserves to be told! Explore{" "}
                                        <strong>1,000+ real weddings</strong> filled with unique
                                        themes, magical moments, and inspiration for your own big day.
                                    </p>
                                </div>
                            </div>

                            {/* Blog */}
                            <div className="col-md-12">
                                <div className="p-4 border rounded shadow-sm bg-white h-100">
                                    <h4 className="fw-bold mb-2 text-dark">Blog</h4>
                                    <p className="text-black">
                                        Dive into our <strong>5,000+ blogs</strong> packed with the
                                        latest wedding trends, planning tips, and creative ideas.
                                        Whether it’s bridal fashion or decor trends — our blog is
                                        your ultimate guide to wedding “wows”!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Features */}
                    <div className="my-5">
                        <h3 className="fw-bold mb-3 primary-text text-center">Our Exclusive Features</h3>

                        <div className="row gy-4">
                            {/* Design Studio */}
                            <div className="col-md-6">
                                <div className="p-4 border rounded shadow-sm bg-white h-100">
                                    <h4 className="fw-bold mb-2 text-dark">AI Design Studio</h4>
                                    <p className="text-black">
                                        Personalize your wedding e-invites with our{" "}
                                        <strong>AI-powered Design Studio</strong>. Apply creative
                                        filters, edit designs, and visualize your invites in real time.
                                    </p>
                                </div>
                            </div>

                            {/* Mobile Apps */}
                            <div className="col-md-6">
                                <div className="p-4 border rounded shadow-sm bg-white h-100">
                                    <h4 className="fw-bold mb-2 text-dark">Available on Android & iOS</h4>
                                    <p className="text-black">
                                        Download the <strong>HappyWedz app</strong> from Google Play or
                                        the Apple App Store for a seamless planning experience. Plan,
                                        manage, and track your wedding anytime, anywhere!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Section */}
                    <div className="text-center mt-5">
                        <h3 className="fw-bold mb-3 primary-text">
                            HappyWedz — Your Personal Wedding Planner
                        </h3>
                        <p className="lead text-black mb-4 fs-18">
                            Plan your wedding effortlessly with <strong className='fw-bold'> HappyWedz </strong> — your ultimate wedding companion.
                            Discover top vendors, explore inspiring ideas, and manage every detail with ease.
                            From personalized checklists to AI-powered tools and curated galleries, we make wedding planning simpler, smarter, and truly joyful.
                        </p>
                    </div>
                </div>
                <div className="container">
                    <div className="row gy-4 gy-lg-0 align-items-lg-center">
                        <div className="col-12 col-lg-6">
                            <img className="img-fluid rounded border border-dark" loading="lazy" src="./images/categories/venues.jpg" alt="About Us" />
                        </div>
                        <div className="col-12 col-lg-6 col-xxl-6">
                            <div className="row justify-content-lg-end">
                                <div className="col-12 col-lg-11">
                                    <div className="about-wrapper">
                                        <p className="fs-18 mb-4 mb-md-5">At HappyWedz, we believe that celebrations should also create a positive impact.
                                            Beyond weddings, we are committed to supporting the communities we serve through meaningful initiatives in environmental sustainability, social welfare, and empowerment.
                                            From promoting eco-friendly wedding solutions to collaborating with local artisans and small vendors, our goal is to make every celebration beautiful — and responsible.</p>
                                        <div className="row gy-4 mb-4 mb-md-5">
                                            <div className="col-12 col-md-6">
                                                <div className="card border border-dark">
                                                    <div className="card-body p-4">
                                                        <h3 className="display-5 fw-bold primary-text text-center mb-2">370+</h3>
                                                        <p className="fw-bold text-center m-0">Qualified Experts</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <div className="card border border-dark">
                                                    <div className="card-body p-4">
                                                        <h3 className="display-5 fw-bold primary-text text-center mb-2">18k+</h3>
                                                        <p className="fw-bold text-center m-0">Satisfied Clients</p>
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
    )
}

export default AboutUs
