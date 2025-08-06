import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';


const regions = [
    {
        id: 1,
        name: 'Hyderabad',
        venueCount: 446,
        image: 'https://cdn1.weddingwire.in/assets/img/listing-city/in-hyderabad-10011133.webp',
    },
    {
        id: 2,
        name: 'Bangalore',
        venueCount: 758,
        image: 'https://cdn1.weddingwire.in/assets/img/listing-city/in-bangalore-10010527.webp',
    },
    {
        id: 3,
        name: 'Mumbai',
        venueCount: 933,
        image: 'https://cdn1.weddingwire.in/assets/img/listing-city/in-mumbai-10010749.webp',
    },
    {
        id: 4,
        name: 'Chennai',
        venueCount: 342,
        image: 'https://cdn1.weddingwire.in/assets/img/listing-city/in-chennai-10011065.webp',
    },
    {
        id: 5,
        name: 'Delhi NCR',
        venueCount: 1949,
        image: 'https://cdn1.weddingwire.in/assets/img/listing-city/in-delhi-ncr-9635.webp',
    },
    {
        id: 6,
        name: 'Lucknow',
        venueCount: 491,
        image: 'https://cdn1.weddingwire.in/assets/img/listing-city/in-lucknow-10011289.webp',
    },
    {
        id: 7,
        name: 'Kolkata',
        venueCount: 285,
        image: 'https://cdn1.weddingwire.in/assets/img/listing-city/in-lucknow-10011289.webp',
    },

];

const VenuesByRegionSlider = () => {
    return (
        <div className="venue-region-section px-4 my-5">
            <h3 className="fw-bold mb-4">Venues by region</h3>


            <Swiper
                modules={[Navigation]}
                spaceBetween={8}
                slidesPerView={6.2}
                navigation
                breakpoints={{
                    320: { slidesPerView: 2.5, spaceBetween: 6 },
                    576: { slidesPerView: 3.5, spaceBetween: 6 },
                    768: { slidesPerView: 4.5, spaceBetween: 6 },
                    992: { slidesPerView: 5.5, spaceBetween: 8 },
                    1200: { slidesPerView: 6.2, spaceBetween: 8 },
                }}
            >
                {regions.map((region) => (
                    <SwiperSlide key={region.id}>
                        <div className="text-center region-slide-card">
                            <div className="region-img-wrapper mb-2">
                                <img
                                    src={region.image}
                                    alt={region.name}
                                    className="region-img"
                                />
                            </div>
                            <div className="region-title fw-medium">{region.name}</div>
                            <div className="text-muted small">{region.venueCount} venues</div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default VenuesByRegionSlider;
