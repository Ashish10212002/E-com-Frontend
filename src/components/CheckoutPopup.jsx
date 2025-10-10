import React, { useContext } from 'react'; // <<< UPDATED: Added useContext
import { Modal, Button } from 'react-bootstrap';
import AppContext from "../Context/Context"; // <<< UPDATED: Import AppContext

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  // <<< FIX 1: Extract the formatCurrency function
  const { formatCurrency } = useContext(AppContext);

  return (
    <div className="checkoutPopup">
    
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="checkout-items">
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item" style={{ display: 'flex', marginBottom: '10px' }}>
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" style={{ width: '150px', marginRight: '10px' }} />
              <div>
                <b><p>{item.name}</p></b>
                <p>Quantity: {item.quantity}</p>
                {/* <<< FIX 2A: Item price display */}
                <p>Price: {formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
          <div >
            {/* <<< FIX 2B: Total price display */}
            <h5 style={{color:'black' , display:'flex',justifyContent:'center',fontSize:'1.3rem', fontWeight:'bold'}} >Total: {formatCurrency(totalPrice)}</h5>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCheckout}>
          Confirm Purchase
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  );
};

export default CheckoutPopup;