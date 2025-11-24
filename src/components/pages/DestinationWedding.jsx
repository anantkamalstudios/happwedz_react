import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DestinationHero from "./DestinationHero"
import ImageCarousel from "./ImageCarousel";
import DestinationWeddingLocation from "./DestinationWeddingLocation";
import DestinationWeddingRealStories from "./DestinationWeddingRealStories";
import DestinationWeddingPlanningIdeas from "./DestinationWeddingPlanningIdeas";

const DestinationWedding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      alt: "Mountain landscape",
    },
    {
      url: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&h=600&fit=crop",
      alt: "Ocean waves",
    },
    {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      alt: "Forest path",
    },
  ];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div>
      <section>
        <div className="container py-5">
          <div className="col-12 d-flex flex-column flex-lg-row gap-4">
           
             <div className="col-6 d-flex justify-content-center align-items-center">
              <ImageCarousel />
            </div>
            <div className="col-6 text-center mt-4">
              <h1 className="mb-4">Destination Weddings</h1>
              <div>
                <h3>Your Day. Your Way.</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Molestiae eveniet suscipit deserunt minus quod sint qui
                  possimus illum asperiores, laborum deleniti ducimus dolor
                  corrupti, obcaecati neque omnis. Quis quos nostrum tenetur ad
                  numquam. Itaque voluptatem consectetur earum explicabo iusto
                  accusamus reprehenderit eveniet sed eum. Autem dolore fuga hic
                  quibusdam possimus.
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Molestiae eveniet suscipit deserunt minus quod sint qui
                  possimus illum asperiores, laborum deleniti ducimus dolor
                  corrupti, obcaecati neque omnis. Quis quos nostrum tenetur ad
                  numquam. Itaque voluptatem consectetur earum explicabo iusto
                  accusamus reprehenderit eveniet sed eum. Autem dolore fuga hic
                  quibusdam possimus.
                </p>
              </div>
            </div>
           
          </div>
        </div>
      </section>

      <section>
        <DestinationWeddingLocation />
      </section>
      <section>
        <div className="container py-5">
          <div className="text-start mb-5">
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "20px",
                }}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
                ad id excepturi.
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: "#ddd",
                    maxWidth: "300px",
                  }}
                ></div>
                <div style={{ width: "50px", height: "50px" }}>
                  <svg
                    viewBox="0 0 100 100"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <polygon
                      points="50,10 60,40 90,40 67,57 75,87 50,70 25,87 33,57 10,40 40,40"
                      fill="#ffc0cb"
                      opacity="0.5"
                    />
                  </svg>
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: "#ddd",
                    maxWidth: "300px",
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-2">
              <div>
                <h5>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </h5>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Perferendis inventore in necessitatibus odit dolorum optio vel
                  maxime rem voluptatum expedita illo voluptas quae possimus
                  nihil nam placeat facilis eaque quo pariatur repellat
                  exercitationem, incidunt reprehenderit? Mollitia, non aliquid!
                  Velit, corrupti.
                </p>
              </div>
              <div>
                <h5>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </h5>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Perferendis inventore in necessitatibus odit dolorum optio vel
                  maxime rem voluptatum expedita illo voluptas quae possimus
                  nihil nam placeat facilis eaque quo pariatur repellat
                  exercitationem, incidunt reprehenderit? Mollitia, non aliquid!
                  Velit, corrupti.
                </p>
              </div>
              <div>
                <h5>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </h5>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Perferendis inventore in necessitatibus odit dolorum optio vel
                  maxime rem voluptatum expedita illo voluptas quae possimus
                  nihil nam placeat facilis eaque quo pariatur repellat
                  exercitationem, incidunt reprehenderit? Mollitia, non aliquid!
                  Velit, corrupti.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <DestinationWeddingRealStories />
        <DestinationWeddingPlanningIdeas />
      </section>
    </div>
  );
};

export default DestinationWedding;
