import React, { useEffect, useState, useContext } from "react"; // ✅ Added useContext
import axios from "../axios";
import { Link } from "react-router-dom"; 
import AppContext from "../Context/Context"; // ✅ Import Context for Cart Count

const Navbar = ({ onSelectCategory, onSearch }) => {
  
  // ✅ 1. Get Cart from Context to show real number
  const { cart } = useContext(AppContext);

  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Removed Theme Logic (Dark Mode Deleted)

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(`/product/search?keyword=${value}`);
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  // ✅ Function to close search when clicking a result
  const handleSearchResultClick = () => {
    setShowSearchResults(false);
    setInput(""); // Optional: Clear search bar
  };

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            
            <Link className="navbar-brand brand-logo" to="/">
                <i className="bi bi-lightning-charge-fill brand-icon"></i>
                AP <span className="brand-text-highlight">Gadgets</span>
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add_product">Add Product</Link>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Categories
                  </a>
                  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li key={category}>
                        <button className="dropdown-item" onClick={() => onSelectCategory(category)}>
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>

              {/* Removed Dark Mode Button Here */}

              <div className="d-flex align-items-center cart-search-container" style={{gap: '20px'}}>
                
                {/* SEARCH BAR AREA */}
                <div className="search-container" style={{position: 'relative'}}>
                    <input
                    className="form-control"
                    type="search"
                    placeholder="Search Products..."
                    aria-label="Search"
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                    style={{width: '250px', borderRadius: '50px'}}
                    />
                    
                    {/* SEARCH RESULTS DROPDOWN */}
                    {showSearchResults && (
                    <ul className="list-group search-dropdown">
                        {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <li key={result.id} className="list-group-item">
                            <Link
                                to={`/product/${result.id}`}
                                className="search-result-link"
                                onClick={handleSearchResultClick} // ✅ Closes search on click
                            >
                                <span>{result.name}</span>
                            </Link>
                            </li>
                        ))
                        ) : (
                        noResults && (
                            <p className="no-results-message" style={{padding: '10px'}}>
                            No Product Found
                            </p>
                        )
                        )}
                    </ul>
                    )}
                </div>

                {/* CART BUTTON WITH DYNAMIC COUNT */}
                <Link to="/cart" className="nav-link text-dark cart-link">
                  <i className="bi bi-cart-fill me-1" style={{fontSize: '1.2rem'}}></i>
                  Cart 
                  {/* ✅ Shows badge only if items exist */}
                  {cart.length > 0 && (
                      <span className="badge bg-danger ms-2 rounded-pill">{cart.length}</span>
                  )}
                </Link>

              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;