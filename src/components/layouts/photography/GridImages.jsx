import React from "react";

const GridImages = ({ category, searchQuery }) => {
  const images = [
    {
      url: "https://image.wedmegood.com/resized/450X/uploads/images/a22617d6e787421c9425f35ae295b44arealwedding/1TSK3955Large.jpeg",
      name: "Beautiful Mehendi Ceremony",
      type: "Mehendi",
    },
    {
      url: "https://image.wedmegood.com/resized/450X/uploads/images/420fc2b648204a759eba42429efd9fbcrealwedding/SHUBHANGI_MAYANK_SANGEET-2215.jpg",
      name: "Grand Wedding Reception",
      type: "Reception",
    },
    {
      url: "https://image.wedmegood.com/resized/450X/uploads/images/dda6757add9b4c468bfdbe216fdd797brealwedding/Anu&Sam_ParthGarg-01.JPG",
      name: "Grand Wedding Reception",
      type: "Reception",
    },
    {
      url: "https://image.wedmegood.com/resized/450X/uploads/member/144653/1731575191_367705890_598783169086383_6132481523517661652_n.jpg",
      name: "Bridal Portrait",
      type: "Makeup",
    },
    {
      url: "https://image.wedmegood.com/resized/450X/uploads/images/9f99eaed032c4bf895e4c3d328928c6drealwedding/SID_9538.jpeg",
      name: "Candid Photography",
      type: "Real Wedding",
    },
    {
      url: "https://image.wedmegood.com/resized/450X/uploads/images/d38cbc9e4ffe42c4b7fc773723426e4brealwedding/IMG_5255.JPG",
      name: "Wedding Decor",
      type: "Decor",
    },
    {
      url: "https://image.wedmegood.com/resized/450X/uploads/images/ded5d91b0ace44d794305ffffdecde0crealwedding/2H5A0455LargeLarge.jpeg",
      name: "Haldi Function",
      type: "Haldi",
    },
    {
      url: "https://image.wedmegood.com/resized/450X/uploads/project/298704/1727174375_DSC06904_min.jpg",
      name: "Haldi Function",
      type: "Haldi",
    },
    {
      url: "https://image.wedmegood.com/resized/450X/uploads/images/43268b83d9b84dee90d76df69fdbf0a8realwedding/VDT04043Large.jpeg",
      name: "Haldi Function",
      type: "Haldi",
    },
  ];

  //   const filteredImages =
  //     category === "all" ? images : images.filter((img) => img.type === category);

  const filteredImages = images.filter((img) => {
    const matchesCategory = category === "all" || img.type === category;
    const matchesSearch = img.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container-fluid py-5">
      <div className="masonry">
        {filteredImages.map((img, index) => (
          <div key={index} className="masonry-item">
            <div className="card border-0 shadow-sm">
              <img
                src={img.url}
                alt={img.name}
                className="card-img-top"
                loading="lazy"
              />
              <div className="card-body p-2">
                <h6 className="mb-1">{img.name}</h6>
                <small className="text-muted">{img.type}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridImages;
