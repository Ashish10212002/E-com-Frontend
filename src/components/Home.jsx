import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context"; // Make sure path is correct
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  // ✅ Destructure isLoading from Context
  const { data, isError, addToCart, refreshData, formatCurrency, isLoading } = useContext(AppContext);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  // FILTERING LOGIC
  const filteredProducts = selectedCategory
    ? data.filter((product) => product.category.toLowerCase() === selectedCategory.toLowerCase())
    : data;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img src={unplugged} alt="Error" style={{ width: "100px", height: "100px" }} />
      </h2>
    );
  }

  // ✅ NEW: Show Spinner while loading
  if (isLoading) {
    return (
        <div className="loader-container">
            <div className="loader"></div>
            <div className="loading-text">Loading Products...</div>
            <div style={{fontSize: "0.8rem", color: "#888", marginTop: "10px"}}>
                (Waking up free server, please wait 30s)
            </div>
        </div>
    );
  }

  return (
    <>
      <div
        className="grid"
        style={{
          marginTop: "64px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {filteredProducts.length === 0 ? (
          <h2
            className="text-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No Products Available
          </h2>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl } = product;

            return (
              <div
                className="card mb-3"
                style={{
                  width: "250px",
                  height: "360px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: productAvailable ? "#fff" : "#ccc",
                  display: "flex",
                  flexDirection: "column",
                }}
                key={id}
              >
                <Link
                  to={`/product/${id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      height: "150px",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* ✅ Uses S3 URL directly */}
                    <img
                      src={imageUrl} 
                      alt={name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: "5px",
                        borderRadius: "10px",
                      }}
                    />
                  </div>

                  <div
                    className="card-body"
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "10px",
                    }}
                  >
                    <div>
                      <h5
                        className="card-title"
                        style={{
                          margin: "0 0 10px 0",
                          fontSize: "1.2rem",
                          height: "2.8em",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: "1.4em",
                        }}
                      >
                        {name.toUpperCase()}
                      </h5>
                      <i
                        className="card-brand"
                        style={{ fontStyle: "italic", fontSize: "0.8rem" }}
                      >
                        {"~ " + brand}
                      </i>
                    </div>

                    <hr className="hr-line" style={{ margin: "10px 0" }} />

                    <div className="home-cart-price">
                      <h5
                        className="card-text"
                        style={{
                          fontWeight: "600",
                          fontSize: "1.1rem",
                          marginBottom: "5px",
                        }}
                      >
                        {formatCurrency(price)}
                      </h5>
                    </div>

                    <button
                      className="btn-hover color-9"
                      style={{ margin: "10px 25px 0px " }}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      disabled={!productAvailable}
                    >
                      {productAvailable ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Home;