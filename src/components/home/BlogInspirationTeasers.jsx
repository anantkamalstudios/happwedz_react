// import React, { useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import blogs from "../../data/blogs";
// import { FiArrowUpRight } from "react-icons/fi";

// const BlogsCarousel = () => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   return (
//     <div className="blogs-carousel-wrapper py-5 px-3">
//       <div className="container position-relative">
//         <div className="text-center mb-1">
//           <img
//             src="/images/home/inspiredTeaser.png"
//             alt="inspiredTeaser"
//             srcset=""
//             className="w-20 h-20"
//           />
//           <h2 className="blogs-carousel-heading">Inspiration Teasers</h2>
//           <p className="blogs-carousel-subheading">
//             Discover the latest trends, tips, and real wedding stories
//           </p>
//         </div>

//         <Swiper
//           slidesPerView={1}
//           spaceBetween={24}
//           navigation={{
//             nextEl: ".blogs-carousel-next",
//             prevEl: ".blogs-carousel-prev",
//           }}
//           modules={[Navigation, Autoplay]}
//           autoplay={{ delay: 5000, disableOnInteraction: false }}
//           breakpoints={{
//             576: { slidesPerView: 2 },
//             992: { slidesPerView: 3 },
//           }}
//           onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
//           className="blogs-swiper"
//         >
//           {blogs.map((blog, i) => (
//             <SwiperSlide key={i}>
//               <div
//                 className="blogs-card p-2 m-2"
//                 style={{
//                   height: "500px",
//                   borderRadius: "0",
//                 }}
//               >
//                 {/* Image */}
//                 <div className="blogs-card-image p-2">
//                   <img src={blog.img} alt={blog.title} />
//                 </div>

//                 {/* Content */}
//                 <div className="blogs-card-content">
//                   <div className="d-flex align-items-center justify-content-between">
//                     <span className="blogs-category">{blog.category}</span>
//                     <FiArrowUpRight size={20} className="blogs-title-icon" />
//                   </div>
//                   <h5 className="blogs-title">{blog.title}</h5>
//                   <p className="blogs-desc">
//                     {blog.desc && blog.desc.length > 120
//                       ? blog.desc.slice(0, 120) + "..."
//                       : blog.desc}
//                   </p>

//                   {/* Footer */}
//                   <div className="blogs-footer">
//                     <div className="blogs-profile">
//                       <img
//                         src={blog.authorImg || "https://via.placeholder.com/50"}
//                         alt={blog.author || "Author"}
//                       />
//                       <div className="blogs-profile-info">
//                         <span className="blogs-author">
//                           {blog.author || "Admin"}
//                         </span>
//                         <small className="blogs-date">{blog.date}</small>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default BlogsCarousel;
// import React, { useState, useEffect } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import axios from "axios";
// import { FiArrowUpRight } from "react-icons/fi";

// const BlogsCarousel = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await axios.get("https://happywedz.com/api/home/InspirationTeasers");
//         // Map API fields to component fields
//         const mappedBlogs = response.data.map((blog) => ({
//           title: blog.postTitle,
//           desc: blog.postDescription,
//           category: blog.postCategory,
//           img: blog.images,
//           author: "Admin", // fallback since API has no author
//           authorImg: "https://via.placeholder.com/50",
//           date: new Date(blog.updatedAt).toLocaleDateString(),
//         }));
//         setBlogs(mappedBlogs);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching blogs:", error);
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   if (loading) {
//     return <div className="text-center py-5">Loading blogs...</div>;
//   }

//   return (
//     <div className="blogs-carousel-wrapper py-5 px-3">
//       <div className="container position-relative">
//         <div className="text-center mb-1">
//           <img
//             src="/images/home/inspiredTeaser.png"
//             alt="inspiredTeaser"
//             className="w-20 h-20"
//           />
//           <h2 className="blogs-carousel-heading">Inspiration Teasers</h2>
//           <p className="blogs-carousel-subheading">
//             Discover the latest trends, tips, and real wedding stories
//           </p>
//         </div>

//         <Swiper
//           slidesPerView={1}
//           spaceBetween={24}
//           navigation={{
//             nextEl: ".blogs-carousel-next",
//             prevEl: ".blogs-carousel-prev",
//           }}
//           modules={[Navigation, Autoplay]}
//           autoplay={{ delay: 5000, disableOnInteraction: false }}
//           breakpoints={{
//             576: { slidesPerView: 2 },
//             992: { slidesPerView: 3 },
//           }}
//           onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
//           className="blogs-swiper"
//         >
//           {blogs.map((blog, i) => (
//             <SwiperSlide key={i}>
//               <div
//                 className="blogs-card p-2 m-2"
//                 style={{ height: "500px", borderRadius: "0" }}
//               >
//                 {/* Image */}
//                 <div className="blogs-card-image p-2">
//                   <img src={blog.img} alt={blog.title} />
//                 </div>

//                 {/* Content */}
//                 <div className="blogs-card-content">
//                   <div className="d-flex align-items-center justify-content-between">
//                     <span className="blogs-category">{blog.category}</span>
//                     <FiArrowUpRight size={20} className="blogs-title-icon" />
//                   </div>
//                   <h5 className="blogs-title">{blog.title}</h5>
//                   <p className="blogs-desc">
//                     {blog.desc && blog.desc.length > 120
//                       ? blog.desc.slice(0, 120) + "..."
//                       : blog.desc}
//                   </p>

//                   {/* Footer */}
//                   <div className="blogs-footer">
//                     <div className="blogs-profile">
//                       <img
//                         src={blog.authorImg}
//                         alt={blog.author}
//                       />
//                       <div className="blogs-profile-info">
//                         <span className="blogs-author">{blog.author}</span>
//                         <small className="blogs-date">{blog.date}</small>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default BlogsCarousel;
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import { FiArrowUpRight } from "react-icons/fi";

const BlogsCarousel = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "https://happywedz.com/api/home/InspirationTeasers"
        );

        // Map API fields to component fields
        const mappedBlogs = response.data.map((blog) => ({
          title: blog.title,
          desc: blog.desc,
          category: blog.category,
          img: blog.image,
          author: "Admin", // fallback
          authorImg: "https://via.placeholder.com/50",
          date: new Date(blog.updatedAt).toLocaleDateString(),
          tags: blog.data?.tags || [],
        }));

        setBlogs(mappedBlogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inspiration teasers:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading inspiration teasers...</div>;
  }

  return (
    <div className="blogs-carousel-wrapper py-5 px-3">
      <div className="container position-relative">
        <div className="text-center mb-1">
          <img
            src="/images/home/inspiredTeaser.png"
            alt="inspiredTeaser"
            className="w-20 h-20"
          />
          <h2 className="blogs-carousel-heading">Inspiration Teasers</h2>
          <p className="blogs-carousel-subheading">
            Discover the latest trends, tips, and real wedding stories
          </p>
        </div>

        <Swiper
          slidesPerView={1}
          spaceBetween={24}
          navigation={{
            nextEl: ".blogs-carousel-next",
            prevEl: ".blogs-carousel-prev",
          }}
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="blogs-swiper"
        >
          {blogs.map((blog, i) => (
            <SwiperSlide key={i}>
              <div
                className="blogs-card p-2 m-2"
                style={{ height: "500px", borderRadius: "0" }}
              >
                {/* Image */}
                <div className="blogs-card-image p-2">
                  <img src={blog.img} alt={blog.title} />
                </div>

                {/* Content */}
                <div className="blogs-card-content">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="blogs-category">{blog.category}</span>
                    <FiArrowUpRight size={20} className="blogs-title-icon" />
                  </div>
                  <h5 className="blogs-title">{blog.title}</h5>
                  <p className="blogs-desc">
                    {blog.desc && blog.desc.length > 120
                      ? blog.desc.slice(0, 120) + "..."
                      : blog.desc}
                  </p>

                  {/* Footer */}
                  <div className="blogs-footer">
                    <div className="blogs-profile">
                      <img src={blog.authorImg} alt={blog.author} />
                      <div className="blogs-profile-info">
                        <span className="blogs-author">{blog.author}</span>
                        <small className="blogs-date">{blog.date}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BlogsCarousel;
