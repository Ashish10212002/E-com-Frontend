import "./App.css";
import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import UpdateProduct from "./components/UpdateProduct";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// ✅ IMPORT FIX: Ensure this matches your folder name exactly.
// If your folder is named "context" (lowercase), keep it as "./context/Context"
// If your folder is named "Context" (uppercase), change it to "./Context/Context"
import { AppProvider } from "./Context/Context"; 

function App() {
  // We removed the local 'cart' state because Context handles it now.
  
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };

  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar onSelectCategory={handleCategorySelect} />
        <Routes>
          <Route
            path="/"
            element={
              // ✅ CLEANED: We don't pass 'addToCart' anymore. Home gets it from Context.
              <Home selectedCategory={selectedCategory} />
            }
          />
          <Route path="/add_product" element={<AddProduct />} />
          <Route path="/product" element={<Product />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/update/:id" element={<UpdateProduct />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;