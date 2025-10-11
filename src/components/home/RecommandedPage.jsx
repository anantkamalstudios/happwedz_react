import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Spinner, Card, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const RecommandedPage = () => {
  const [recommandData, setRecommandData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((store) => store?.auth?.token);

  const API_ENDPOINTS = [
    `https://www.happywedz.com/ai/user/1/preferences`,
    `https://www.happywedz.com/ai/recommendations/1`,
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const requests = API_ENDPOINTS.map((url) =>
          axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );
        const response = await Promise.all(requests);
        setRecommandData(response);
        setLoading(false);
      } catch (error) {
        console.log("Something went wrong:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const [preference, recommand] = recommandData;
  console.log(recommand);

  // const recommand = {
  //   method: "hybrid_weighted",
  //   recommendation_stats: {
  //     sources: {
  //       unknown: 50,
  //     },
  //     total_vendors: 17,
  //     total_venues: 20,
  //   },
  //   user_profile: {
  //     days_since_registration: 13,
  //     is_new_user: false,
  //     total_interactions: 31,
  //   },
  //   vendor_categories: {
  //     band: {
  //       description: "Live music",
  //       display_name: "Live Band",
  //       icon: "🎸",
  //       items: [],
  //       priority: 8,
  //     },
  //     caterer: {
  //       description: "Delicious food",
  //       display_name: "Catering",
  //       icon: "🍽",
  //       items: [],
  //       priority: 2,
  //     },
  //     choreographer: {
  //       description: "Dance prep",
  //       display_name: "Choreographers",
  //       icon: "💃",
  //       items: [],
  //       priority: 13,
  //     },
  //     decorator: {
  //       description: "Beautiful setups",
  //       display_name: "Decorators",
  //       icon: "🎨",
  //       items: [],
  //       priority: 3,
  //     },
  //     dj: {
  //       description: "Keep the party going",
  //       display_name: "DJ & Music",
  //       icon: "🎵",
  //       items: [
  //         {
  //           category: "dj",
  //           category_display: "DJ & Music",
  //           city: "Hyderabad",
  //           id: 3,
  //           item_type: "vendor",
  //           name: "Elite DJ 3",
  //           original_type: "DJ",
  //           rating: 3.9,
  //           type: "dj",
  //         },
  //         {
  //           category: "dj",
  //           category_display: "DJ & Music",
  //           city: "Mumbai",
  //           id: 11,
  //           item_type: "vendor",
  //           name: "Classic Wedding Planner 11",
  //           original_type: "DJ",
  //           rating: 4.6,
  //           type: "dj",
  //         },
  //         {
  //           category: "dj",
  //           category_display: "DJ & Music",
  //           city: "Hyderabad",
  //           id: 17,
  //           item_type: "vendor",
  //           name: "Grand Florist 17",
  //           original_type: "DJ",
  //           rating: 4.7,
  //           type: "dj",
  //         },
  //         {
  //           category: "dj",
  //           category_display: "DJ & Music",
  //           city: "Delhi",
  //           id: 18,
  //           item_type: "vendor",
  //           name: "Royal Decorator 18",
  //           original_type: "DJ",
  //           rating: 3.3,
  //           type: "dj",
  //         },
  //         {
  //           category: "dj",
  //           category_display: "DJ & Music",
  //           city: "Bangalore",
  //           id: 24,
  //           item_type: "vendor",
  //           name: "Royal Photographer 24",
  //           original_type: "DJ",
  //           rating: 4.7,
  //           type: "dj",
  //         },
  //       ],
  //       priority: 4,
  //     },
  //     invitation_designer: {
  //       description: "Wedding invites",
  //       display_name: "Invitations",
  //       icon: "💌",
  //       items: [],
  //       priority: 11,
  //     },
  //     jewellery: {
  //       description: "Wedding jewellery",
  //       display_name: "Jewellery",
  //       icon: "💎",
  //       items: [],
  //       priority: 12,
  //     },
  //     makeup_artist: {
  //       description: "Look your best",
  //       display_name: "Makeup",
  //       icon: "💄",
  //       items: [],
  //       priority: 6,
  //     },
  //     mehendi_artist: {
  //       description: "Henna designs",
  //       display_name: "Mehendi",
  //       icon: "🤚",
  //       items: [],
  //       priority: 7,
  //     },
  //     other: {
  //       description: "Misc services",
  //       display_name: "Other",
  //       icon: "⭐",
  //       items: [
  //         {
  //           category: "caterer",
  //           category_display: "Catering",
  //           city: "Hyderabad",
  //           id: 1,
  //           item_type: "vendor",
  //           name: "Classic Photographer 1",
  //           original_type: "Caterer",
  //           rating: 4.1,
  //           type: "caterer",
  //         },
  //         {
  //           category: "other",
  //           category_display: "Other",
  //           city: "Hyderabad",
  //           id: 2,
  //           item_type: "vendor",
  //           name: "Elite Makeup Artist 2",
  //           original_type: "Wedding Planner",
  //           rating: 4.1,
  //           type: "other",
  //         },
  //         {
  //           category: "caterer",
  //           category_display: "Catering",
  //           city: "Hyderabad",
  //           id: 6,
  //           item_type: "vendor",
  //           name: "Classic Decorator 6",
  //           original_type: "Caterer",
  //           rating: 3.5,
  //           type: "caterer",
  //         },
  //         {
  //           category: "other",
  //           category_display: "Other",
  //           city: "Delhi",
  //           id: 7,
  //           item_type: "vendor",
  //           name: "Classic Florist 7",
  //           original_type: "Wedding Planner",
  //           rating: 3.4,
  //           type: "other",
  //         },
  //         {
  //           category: "photographer",
  //           category_display: "Photography",
  //           city: "Delhi",
  //           id: 13,
  //           item_type: "vendor",
  //           name: "Grand Photographer 13",
  //           original_type: "Photographer",
  //           rating: 3.2,
  //           type: "photographer",
  //         },
  //         {
  //           category: "other",
  //           category_display: "Other",
  //           city: "Bangalore",
  //           id: 14,
  //           item_type: "vendor",
  //           name: "Elite Caterer 14",
  //           original_type: "Florist",
  //           rating: 3.1,
  //           type: "other",
  //         },

  //         {
  //           category: "other",
  //           category_display: "Other",
  //           city: "Bangalore",
  //           id: 16,
  //           item_type: "vendor",
  //           name: "Elite Wedding Planner 16",
  //           original_type: "Wedding Planner",
  //           rating: 4.1,
  //           type: "other",
  //         },
  //       ],
  //       priority: 99,
  //     },
  //     pandit: {
  //       description: "Sacred guidance",
  //       display_name: "Pandits",
  //       icon: "🙏",
  //       items: [],
  //       priority: 10,
  //     },
  //     photographer: {
  //       description: "Capture memories",
  //       display_name: "Photography",
  //       icon: "📸",
  //       items: [],
  //       priority: 1,
  //     },
  //     transport: {
  //       description: "Arrive in style",
  //       display_name: "Transport",
  //       icon: "🚗",
  //       items: [],
  //       priority: 9,
  //     },
  //     videographer: {
  //       description: "Wedding films",
  //       display_name: "Videography",
  //       icon: "🎥",
  //       items: [],
  //       priority: 5,
  //     },
  //   },
  //   vendors: [
  //     {
  //       category: "caterer",
  //       category_display: "Catering",
  //       city: "Hyderabad",
  //       id: 1,
  //       item_type: "vendor",
  //       name: "Classic Photographer 1",
  //       original_type: "Caterer",
  //       rating: 4.1,
  //       type: "caterer",
  //     },
  //     {
  //       category: "other",
  //       category_display: "Other",
  //       city: "Hyderabad",
  //       id: 2,
  //       item_type: "vendor",
  //       name: "Elite Makeup Artist 2",
  //       original_type: "Wedding Planner",
  //       rating: 4.1,
  //       type: "other",
  //     },
  //     {
  //       category: "dj",
  //       category_display: "DJ & Music",
  //       city: "Hyderabad",
  //       id: 3,
  //       item_type: "vendor",
  //       name: "Elite DJ 3",
  //       original_type: "DJ",
  //       rating: 3.9,
  //       type: "dj",
  //     },

  //     {
  //       category: "caterer",
  //       category_display: "Catering",
  //       city: "Hyderabad",
  //       id: 6,
  //       item_type: "vendor",
  //       name: "Classic Decorator 6",
  //       original_type: "Caterer",
  //       rating: 3.5,
  //       type: "caterer",
  //     },
  //     {
  //       category: "other",
  //       category_display: "Other",
  //       city: "Delhi",
  //       id: 7,
  //       item_type: "vendor",
  //       name: "Classic Florist 7",
  //       original_type: "Wedding Planner",
  //       rating: 3.4,
  //       type: "other",
  //     },

  //     {
  //       category: "dj",
  //       category_display: "DJ & Music",
  //       city: "Mumbai",
  //       id: 11,
  //       item_type: "vendor",
  //       name: "Classic Wedding Planner 11",
  //       original_type: "DJ",
  //       rating: 4.6,
  //       type: "dj",
  //     },
  //     {
  //       category: "photographer",
  //       category_display: "Photography",
  //       city: "Delhi",
  //       id: 13,
  //       item_type: "vendor",
  //       name: "Grand Photographer 13",
  //       original_type: "Photographer",
  //       rating: 3.2,
  //       type: "photographer",
  //     },
  //     {
  //       category: "other",
  //       category_display: "Other",
  //       city: "Bangalore",
  //       id: 14,
  //       item_type: "vendor",
  //       name: "Elite Caterer 14",
  //       original_type: "Florist",
  //       rating: 3.1,
  //       type: "other",
  //     },

  //     {
  //       category: "other",
  //       category_display: "Other",
  //       city: "Bangalore",
  //       id: 16,
  //       item_type: "vendor",
  //       name: "Elite Wedding Planner 16",
  //       original_type: "Wedding Planner",
  //       rating: 4.1,
  //       type: "other",
  //     },
  //     {
  //       category: "dj",
  //       category_display: "DJ & Music",
  //       city: "Hyderabad",
  //       id: 17,
  //       item_type: "vendor",
  //       name: "Grand Florist 17",
  //       original_type: "DJ",
  //       rating: 4.7,
  //       type: "dj",
  //     },
  //     {
  //       category: "dj",
  //       category_display: "DJ & Music",
  //       city: "Delhi",
  //       id: 18,
  //       item_type: "vendor",
  //       name: "Royal Decorator 18",
  //       original_type: "DJ",
  //       rating: 3.3,
  //       type: "dj",
  //     },
  //     {
  //       category: "other",
  //       category_display: "Other",
  //       city: "Hyderabad",
  //       id: 20,
  //       item_type: "vendor",
  //       name: "Grand Wedding Planner 20",
  //       original_type: "Wedding Planner",
  //       rating: 3.2,
  //       type: "other",
  //     },

  //     {
  //       category: "dj",
  //       category_display: "DJ & Music",
  //       city: "Bangalore",
  //       id: 24,
  //       item_type: "vendor",
  //       name: "Royal Photographer 24",
  //       original_type: "DJ",
  //       rating: 4.7,
  //       type: "dj",
  //     },
  //   ],
  //   venues: [
  //     {
  //       capacity: 1057,
  //       city: "Hyderabad",
  //       id: 1,
  //       name: "Heaven Palace 1",
  //       price: 243105.0,
  //       rating: 4.9,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 841,
  //       city: "Chennai",
  //       id: 2,
  //       name: "Heaven Palace 2",
  //       price: 89272.0,
  //       rating: 4.3,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 677,
  //       city: "Mumbai",
  //       id: 3,
  //       name: "Grand Palace 3",
  //       price: 121232.0,
  //       rating: 3.6,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 1460,
  //       city: "Bangalore",
  //       id: 4,
  //       name: "Ocean View 4",
  //       price: 320423.0,
  //       rating: 4.4,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 1031,
  //       city: "Delhi",
  //       id: 5,
  //       name: "Golden Courtyard 5",
  //       price: 178047.0,
  //       rating: 4.7,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 966,
  //       city: "Delhi",
  //       id: 6,
  //       name: "Golden Courtyard 6",
  //       price: 458807.0,
  //       rating: 3.9,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 1128,
  //       city: "Chennai",
  //       id: 7,
  //       name: "Sunset Lawns 7",
  //       price: 494617.0,
  //       rating: 4.3,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 1781,
  //       city: "Delhi",
  //       id: 8,
  //       name: "Grand Palace 8",
  //       price: 284448.0,
  //       rating: 4.3,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 799,
  //       city: "Mumbai",
  //       id: 9,
  //       name: "Golden Courtyard 9",
  //       price: 375521.0,
  //       rating: 4.4,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 1552,
  //       city: "Hyderabad",
  //       id: 10,
  //       name: "Ocean View 10",
  //       price: 58562.0,
  //       rating: 3.1,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 1409,
  //       city: "Chennai",
  //       id: 11,
  //       name: "Heritage Hall 11",
  //       price: 217731.0,
  //       rating: 3.6,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 1042,
  //       city: "Hyderabad",
  //       id: 12,
  //       name: "Emerald Banquet 12",
  //       price: 83048.0,
  //       rating: 3.3,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 1400,
  //       city: "Chennai",
  //       id: 13,
  //       name: "Paradise Garden 13",
  //       price: 142045.0,
  //       rating: 3.9,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 694,
  //       city: "Chennai",
  //       id: 14,
  //       name: "Golden Courtyard 14",
  //       price: 389504.0,
  //       rating: 3.0,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 1025,
  //       city: "Mumbai",
  //       id: 15,
  //       name: "Sunset Lawns 15",
  //       price: 114659.0,
  //       rating: 3.7,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 1596,
  //       city: "Bangalore",
  //       id: 16,
  //       name: "Sunset Lawns 16",
  //       price: 495356.0,
  //       rating: 3.8,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 1663,
  //       city: "Hyderabad",
  //       id: 17,
  //       name: "Royal Banquet 17",
  //       price: 334379.0,
  //       rating: 4.8,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 1750,
  //       city: "Delhi",
  //       id: 18,
  //       name: "Sunset Lawns 18",
  //       price: 430685.0,
  //       rating: 4.5,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 679,
  //       city: "Bangalore",
  //       id: 19,
  //       name: "Heritage Hall 19",
  //       price: 154835.0,
  //       rating: 4.1,
  //       type: "venue",
  //     },
  //     {
  //       capacity: 1070,
  //       city: "Mumbai",
  //       id: 20,
  //       name: "Paradise Garden 20",
  //       price: 388721.0,
  //       rating: 4.9,
  //       type: "venue",
  //     },
  //   ],
  // };

  // const vendorCategories = recommand?.data?.vendor_categories || {};
  // const vendors = recommand?.data?.vendors || [];
  // const venues = recommand?.data?.venues || [];
  const vendorCategories = recommand?.vendor_categories || {};
  const vendors = recommand?.vendors || [];
  const venues = recommand?.venues || [];

  const fallbackImages = {
    dj: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=800&q=80",
    decorator:
      "https://images.unsplash.com/photo-1560185008-b033106af12e?auto=format&fit=crop&w=800&q=80",
    caterer:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    photographer:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80",
    makeup_artist:
      "https://images.unsplash.com/photo-1611162617213-7d7a66debb1d?auto=format&fit=crop&w=800&q=80",
    other:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    venue:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    default: "https://via.placeholder.com/400x250.png?text=No+Image",
  };

  const handleImageError = (e) => {
    e.target.src = fallbackImages.default;
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "3rem 5rem",
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
      }}
    >
      <div>
        <h1 style={{ color: "#C31162", fontWeight: 700 }}>
          Best Recommendations for Your <br /> Celebration
        </h1>
        <p style={{ color: "#555" }}>
          We’ve personalized your top wedding vendors and venues based on your
          preferences and activity.
        </p>
      </div>

      <div>
        <h2
          style={{
            color: "#C31162",
            fontWeight: 600,
            marginBottom: "1rem",
          }}
        >
          Recommended Vendors for You
        </h2>

        {Object.keys(vendorCategories).map((key) => {
          const category = vendorCategories[key];
          const items = category.items || [];
          console.log(category);

          // if (items.length === 0) return null;

          return (
            <div key={key} style={{ marginBottom: "3rem" }}>
              <div
                className="d-flex align-items-center justify-content-between mb-3"
                style={{
                  borderBottom: "2px solid #f1f1f1",
                  paddingBottom: "0.5rem",
                }}
              >
                <h4 style={{ color: "#C31162", fontWeight: "600" }}>
                  {category.icon} {category.display_name}
                </h4>
                <p style={{ color: "#777", margin: 0 }}>
                  {category.description}
                </p>
              </div>

              <div
                className="d-flex flex-wrap"
                style={{ gap: "2rem", justifyContent: "flex-start" }}
              >
                {items.map((vendor) => (
                  <Card
                    key={vendor.id}
                    style={{
                      width: "18rem",
                      border: "none",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      borderRadius: "15px",
                      overflow: "hidden",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={
                        fallbackImages[vendor.category] ||
                        fallbackImages.default
                      }
                      alt={vendor.name}
                      onError={handleImageError}
                      style={{
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <Card.Body>
                      <Card.Title
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "600",
                          color: "#333",
                        }}
                      >
                        {vendor.name}
                      </Card.Title>
                      <Card.Text>
                        <strong>City:</strong> {vendor.city}
                        <br />
                        <strong>Rating:</strong>{" "}
                        <i
                          className="fa-solid fa-star"
                          style={{ color: "#f50565" }}
                        ></i>{" "}
                        {vendor.rating}
                        <br />
                        <strong>Type:</strong> {vendor.original_type}
                      </Card.Text>
                      <Button
                        variant="outline-dark"
                        style={{
                          borderRadius: "25px",
                          fontSize: "0.9rem",
                        }}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {vendors?.length > 0 && (
        <div>
          <h2
            style={{ color: "#C31162", fontWeight: 600, marginBottom: "1rem" }}
          >
            All Vendors
          </h2>
          <div
            className="d-flex flex-wrap"
            style={{ gap: "2rem", justifyContent: "flex-start" }}
          >
            {vendors.map((v) => (
              <Card
                key={v.id}
                style={{
                  width: "18rem",
                  border: "none",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  borderRadius: "15px",
                  overflow: "hidden",
                }}
              >
                <Card.Img
                  variant="top"
                  src={fallbackImages[v.category] || fallbackImages.default}
                  alt={v.name}
                  onError={handleImageError}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {v.name}
                  </Card.Title>
                  <Card.Text>
                    <strong>City:</strong> {v.city}
                    <br />
                    <strong>Rating:</strong>{" "}
                    <i
                      className="fa-solid fa-star"
                      style={{ color: "#f50565" }}
                    ></i>
                    {v.rating}
                    <br />
                    <strong>Category:</strong> {v.category_display}
                  </Card.Text>
                  <Button
                    variant="outline-dark"
                    style={{
                      borderRadius: "25px",
                      fontSize: "0.9rem",
                    }}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      {venues?.length > 0 && (
        <div>
          <h2
            style={{ color: "#C31162", fontWeight: 600, marginBottom: "1rem" }}
          >
            Recommended Venues
          </h2>
          <div
            className="d-flex flex-wrap"
            style={{ gap: "2rem", justifyContent: "flex-start" }}
          >
            {venues.map((venue) => (
              <Card
                key={venue.id}
                style={{
                  width: "18rem",
                  border: "none",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  borderRadius: "15px",
                  overflow: "hidden",
                }}
              >
                <Card.Img
                  variant="top"
                  src={fallbackImages.venue}
                  alt={venue.name}
                  onError={handleImageError}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <Card.Body>
                  <Card.Title style={{ fontWeight: "600" }}>
                    {venue.name}
                  </Card.Title>
                  <Card.Text>
                    <strong>City:</strong> {venue.city}
                    <br />
                    <strong>Capacity:</strong> {venue.capacity}
                    <br />
                    <strong>Price:</strong> ₹{venue.price.toLocaleString()}
                    <br />
                    <strong>Rating:</strong> ⭐ {venue.rating}
                  </Card.Text>
                  <Button
                    variant="outline-dark"
                    style={{
                      borderRadius: "25px",
                      fontSize: "0.9rem",
                    }}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommandedPage;
