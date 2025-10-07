const EInviteCard = () => {
  return (
    <div
      style={{
        overflow: "hidden",
        maxWidth: "100%",
      }}
    >
      {/* Image */}
      <div style={{ width: "100%", height: "350px", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1750836054429-4cfdf40b32f1?q=80&w=694&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="E-Invite"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Content */}
      <div className=" text-center p-4">
        <h6
          className="fw-bold mb-2"
          style={{
            color: "#C31162",
            letterSpacing: "1px",
          }}
        >
          E-INVITES
        </h6>
        <h5
          className="fw-bold mb-3"
          style={{
            color: "#C31162",
            fontSize: "1.1rem",
          }}
        >
          Create Stunning Digital Wedding Invitations That Wow
        </h5>
        <p
          className="text-muted mb-4 mt-4"
          style={{
            fontSize: "0.9rem",
            lineHeight: "1.5",
          }}
        >
          Discover curated options that fit your style, budget, and location.
          Search and compare instantly.
        </p>

        <button
          className="btn fw-bold mt-4"
          style={{
            backgroundColor: "#C31162",
            color: "#fff",
            borderRadius: "25px",
            padding: "10px 30px",
          }}
        >
          Get started
        </button>
      </div>
    </div>
  );
};

export default EInviteCard;
