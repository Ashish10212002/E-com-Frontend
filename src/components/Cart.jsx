import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "../axios"; // ✅ UPDATED: Smart Axios
import CheckoutPopup from "./CheckoutPopup";
import { Button } from "react-bootstrap";

const Cart = () => {
  const { cart, removeFromCart, clearCart, formatCurrency } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // ✅ PERFORMANCE FIX: Fetch generic product data once.
    // We map your Cart IDs to the fresh Backend Data (Price, Stock, ImageURL)
    const fetchCartDetails = async () => {
      if (cart.length === 0) {
        setCartItems([]);
        return;
      }

      try {
        const response = await axios.get("/products");
        const allProducts = response.data;

        // Merge Cart Quantity with Backend Product Details
        const updatedCartItems = cart.map((cartItem) => {
          const backendProduct = allProducts.find((p) => p.id === cartItem.id);
          if (backendProduct) {
            return {
              ...backendProduct,
              quantity: cartItem.quantity, // Keep local quantity
              imageUrl: backendProduct.imageUrl // ✅ Use S3 URL directly
            };
          }
          return cartItem;
        }).filter(item => item !== undefined);

        setCartItems(updatedCartItems);
      } catch (error) {
        console.error("Error syncing cart:", error);
      }
    };

    fetchCartDetails();
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        // Prepare updated stock
        const updatedStockQuantity = item.stockQuantity - item.quantity;
        
        // Create a clean object for the update (excluding image logic)
        const productUpdate = {
            id: item.id,
            name: item.name,
            brand: item.brand,
            description: item.description,
            price: item.price,
            category: item.category,
            releaseDate: item.releaseDate,
            productAvailable: item.productAvailable,
            stockQuantity: updatedStockQuantity,
            imageName: item.imageName,
            imageType: item.imageType,
            imageUrl: item.imageUrl // Keep the URL
        };

        const formData = new FormData();
        // We do NOT append 'imageFile' here, so the backend preserves the old S3 URL.
        formData.append(
          "product",
          new Blob([JSON.stringify(productUpdate)], { type: "application/json" })
        );

        await axios.put(`/product/${item.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
      }
      
      alert("Purchase Successful!");
      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="cart-container">
      <div className="shopping-cart">
        <div className="title">Shopping Bag</div>
        {cartItems.length === 0 ? (
          <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
            <h4>Your cart is empty</h4>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div
                  className="item"
                  style={{ display: "flex", alignContent: "center" }}
                >
                  <div>
                    {/* ✅ S3 URL USED HERE */}
                    <img
                      src={item.imageUrl} 
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </div>
                  <div className="description">
                    <span>{item.brand}</span>
                    <span>{item.name}</span>
                  </div>

                  <div className="quantity">
                    <button
                      className="plus-btn"
                      type="button"
                      onClick={() => handleIncreaseQuantity(item.id)}
                    >
                      <i className="bi bi-plus-square-fill"></i>
                    </button>
                    <input type="button" value={item.quantity} readOnly />
                    <button
                      className="minus-btn"
                      type="button"
                      onClick={() => handleDecreaseQuantity(item.id)}
                    >
                      <i className="bi bi-dash-square-fill"></i>
                    </button>
                  </div>

                  <div className="total-price" style={{ textAlign: "center" }}>
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </li>
            ))}
            <div className="total">Total: {formatCurrency(totalPrice)}</div>
            <Button
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={() => setShowModal(true)}
            >
              Checkout
            </Button>
          </>
        )}
      </div>
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;