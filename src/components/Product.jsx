import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData, formatCurrency } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  // Your Render backend URL
  // const BASE_URL = "https://e-com-webapp.onrender.com/api";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`);
        setProduct(response.data);
        // NO MORE SEPARATE IMAGE FETCHING!
        // The image URL is now inside response.data.imageUrl
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`/product/${id}`);
      removeFromCart(id);
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  return (
    <>
      <div className="containers" style={{ display: "flex" }}>
        {/* IMAGE LOADING IS NOW DIRECT AND FAST */}
        <img
          className="left-column-img"
          src={product.imageUrl} 
          alt={product.imageName}
          style={{ width: "50%", height: "auto", objectFit: "contain" }}
        />

        <div className="right-column" style={{ width: "50%" }}>
           {/* ... The rest of your JSX remains exactly the same ... */}
           {/* Just copy the rest of your right-column div here */}
           <div className="product-description">
             {/* ... content ... */}
             <h1>{product.name}</h1>
             {/* ... etc ... */}
           </div>
        </div>
      </div>
    </>
  );
};

export default Product;