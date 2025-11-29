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

  // ✅ SHOW SPINNER WHILE LOADING
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
      {/* 1. HERO SECTION */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Next Gen <br /> <span className="hero-highlight">Technology</span></h1>
          <p style={{color: "#64748b", marginBottom: "20px", fontSize: "1.1rem"}}>
            Premium Gadgets. Unbeatable Prices. Lightning Fast.
          </p>
          <button className="hero-btn" onClick={() => window.scrollTo({top: 600, behavior: 'smooth'})}>
            Explore Collection
          </button>
        </div>
      </div>

      {/* 2. PRODUCT GRID */}
      <div className="grid">
        {filteredProducts.length === 0 ? (
          <h2 className="text-center" style={{ width: "100%", gridColumn: "1/-1", marginTop: "50px" }}>
            No Products Found
          </h2>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl } = product;

            return (
              <div className="product-card" key={id}>
                {/* Click Card to go to Details */}
                <Link to={`/product/${id}`} style={{textDecoration: "none", color: "inherit", display:"contents"}}>
                  
                  {/* Image Area */}
                  <div className="product-image-container">
                     <img src={imageUrl} alt={name} className="product-image" />
                  </div>

                  {/* Content Area */}
                  <div className="product-info">
                    <span className="product-brand">{brand}</span>
                    <h3 className="product-title">{name}</h3>
                    
                    <div className="product-footer">
                      <span className="product-price">{formatCurrency(price)}</span>
                      
                      {/* ✅ UPDATED ADD TO CART BUTTON */}
                      <button
                        className="add-btn-round"
                        onClick={(e) => {
                          e.preventDefault(); // Stop navigation
                          if (productAvailable) {
                            addToCart(product);
                            alert("✅ Added to Cart!");
                          } else {
                            alert("❌ Sorry, this product is currently Out of Stock.");
                          }
                        }}
                        title={productAvailable ? "Add to Cart" : "Out of Stock"}
                        style={{
                            opacity: productAvailable ? 1 : 0.5,
                            cursor: productAvailable ? "pointer" : "not-allowed",
                            backgroundColor: productAvailable ? "var(--text-primary)" : "#cbd5e1"
                        }}
                      >
                        <i className={`bi ${productAvailable ? "bi-plus-lg" : "bi-slash-circle"}`}></i>
                      </button>
                    </div>
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