import axios from "../axios";
import { useState, useEffect, createContext } from "react";

// --- START: Currency Configuration ---
const CURRENCY_CODE = 'INR';
const CURRENCY_LOCALE = 'en-IN'; 

const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount); 
    if (isNaN(numericAmount)) {
        return 'Price Unavailable';
    }
    return new Intl.NumberFormat(CURRENCY_LOCALE, {
        style: 'currency',
        currency: CURRENCY_CODE,
        minimumFractionDigits: 2,
    }).format(numericAmount);
};
// --- END: Currency Configuration ---

const AppContext = createContext({
    data: [],
    isError: "",
    cart: [],
    addToCart: (product) => {},
    removeFromCart: (productId) => {},
    refreshData:() =>{},
    clearCart: () => {},
    formatCurrency: (amount) => {},
    isLoading: true, // Added default
});

export const AppProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [isError, setIsError] = useState("");
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    
    // ✅ NEW: Loading State
    const [isLoading, setIsLoading] = useState(true);

    const addToCart = (product) => {
        const existingProductIndex = cart.findIndex((item) => item.id === product.id);
        if (existingProductIndex !== -1) {
            const updatedCart = cart.map((item, index) =>
                index === existingProductIndex
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        } else {
            const updatedCart = [...cart, { ...product, quantity: 1 }];
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const removeFromCart = (productId) => {
        console.log("productID", productId)
        const updatedCart = cart.filter((item) => item.id !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        console.log("CART", cart)
    };

    const refreshData = async () => {
        setIsLoading(true); // ✅ Start Loading
        try {
            const response = await axios.get("/products");
            setData(response.data);
        } catch (error) {
            setIsError(error.message);
        } finally {
            setIsLoading(false); // ✅ Stop Loading (Success or Fail)
        }
    };

    const clearCart = () => {
        setCart([]);
    }
    
    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);
    
    return (
        <AppContext.Provider 
            value={{ 
                data, 
                isError, 
                cart, 
                addToCart, 
                removeFromCart,
                refreshData, 
                clearCart,
                formatCurrency,
                isLoading // ✅ Exposed to app
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;