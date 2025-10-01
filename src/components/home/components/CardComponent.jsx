import { Link } from "react-router-dom";

const CardComponent = () => {
  return (
    <div
      className="card border-0 shadow-sm rounded-4 overflow-hidden p-2"
      style={{ maxWidth: "400px" }}
    >
      <div style={{ position: "relative" }}>
        <div>
          <span>
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADQElEQVR4nO2YW4hOURTHf+M6mcKMSxj3QWoKo5QHGWLcy2VcXqZoXijlYZBymZgXIo9ueSIp8sALDyiXEnI3xGhoSG4zJiMxYj7tWqdWu32+b853znzzjc6/9ss+/70uZ6+99toLYsSIESNGjBjZjYHAHqAOaANagVvAqhTregKVwA3gJ9AATPDhrhSZrUp+eRTGzwA+AgmfUe2zbgxw38Hf7OAeTCL/QFgH3iYRbsYfoMhaMwR44+A+BUZb3OUp5JuxLIwDj0TIB2AFkAsUADeVgo3WmvPq2y9glzjlwnXFNesGAYOBC2r+WhgHjMAKEapxTCmoUvPTHH8wWUx/V7xhar5QzbcQESYCNcAZCR1PwRzF2ZciHOyYTqhBgG9p4bXDoCdAjuLcDRjTiUw68NLnEC9QnPcBYzqRSQdGAVuAw1Zqva04rQFjOtHRDpi0t0mMt/O8J9xcUh5a1PxIS443/y0EPzDqRMhXYAMwQtJolVJgUqyHK2r+MjAOGO+YT5cfycG1hwkpDwvbwZ8fgh8YJUB9EuHPgAHWmmofbptcaoTkB0aehI+5fb9ITD4Adso3F8qAS8BnGReBuUl0lAXk/9/IkdxuwidbMFVs0pemE2uAxyoOTS2/Fsgn88gH1lmFoykuV7vI/YFzPofJlNRH5DLKFApFp185fxbo55ELJJtoQqMUXsV0PorFlkbLxlr58Ry16vftUvdnG3KBHWKjZ+8h5Jb1JkrJfsxW9jbZDujKMgyKpPAzpUHUWKTsbUZKAR1C24A+EZXeTZICo0AesBv4rew9iRyEWuuAfJLX1aQ0lb2wtjmME5OB/VIFaBvfAUM9Ul9JTa6U9Qo4Lm9jExrd2qG0RAwP6kSO6KiQ5OJXh5lmwHCXAPPwfpiiOvwB3JPtq5GuxFJgurybx0pqLrVSn58TvWW371iPfNeol2ZZ91R/wZS5p+SQJCIcTY4+UmWKNcap08ASoAcB0QuYB+yVh4XOWOkO3YYxmAX8Vd8b5A1tDuxMaVFGCvMHFwPrJYROAFclrJ7LNjdK2d2eHfBu29JOqrl8McU6A83S+OoSKEkzC2UN6rqy8boZ0CWNR1ojW6V/FCNGDDoO/wC6BtvvL7Su+gAAAABJRU5ErkJggg=="
              alt="360-view"
            />
          </span>
          <span>
            <i className="fa-regular fa-heart" style={{ color: "#00040a" }}></i>
          </span>
        </div>
        <img
          src="https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=800"
          className="card-img-top w-100"
          alt="Banquet Hall"
          style={{ height: "220px", objectFit: "cover", borderRadius: "5%" }}
        />
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">Royal Banquet Hall</h5>
          <p className="rating text-warning small mb-0 mt-1">
            ★<span className="text-muted">5.0 (2 Reviews)</span>
          </p>
        </div>
        <p
          className=" mb-3"
          style={{
            color: "black",
            fontSize: "12px",
          }}
        >
          Hyderabad, Banjara Hills
        </p>

        <div className="d-flex gap-4 mb-3">
          <div>
            <small className="text-muted" style={{ fontSize: "10px" }}>
              Veg
            </small>
            <div className="price">
              ₹ 899 <small className="text-muted">per plate</small>
            </div>
          </div>
          <div>
            <small className="text-muted" style={{ fontSize: "10px" }}>
              Non Veg
            </small>
            <div className="price">
              ₹ 899 <small className="text-muted">per plate</small>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between gap-2">
          <div className="d-flex justify-content-center align-items-center gap-2">
            <p
              style={{
                backgroundColor: "#fdc2daff",
                fontSize: "12px",
                padding: "0.25rem 1.25rem",
                color: "#C31162",
              }}
            >
              600 - 1500 pax
            </p>
            <p
              style={{
                backgroundColor: "#fdc2daff",
                fontSize: "12px",
                padding: "0.25rem 1.25rem",
                color: "#C31162",
              }}
            >
              112 Rooms
            </p>
            <p>
              <Link
                style={{
                  color: "#C31162",
                  fontSize: "12px",
                  borderOffSet: "1px",
                }}
              >
                + 5 more
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
