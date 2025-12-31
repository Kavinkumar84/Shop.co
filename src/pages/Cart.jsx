import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Lottie from "lottie-react";
import emptyCart from "../assets/empty-cart.json";
import NoUser from '../assets/NoUser.png';

const Cart = () => {
  const [loggeduser, setLoggeduser] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const location = useLocation();

  // ✅ Fetch logged user
  useEffect(() => {
    const userData = localStorage.getItem("LoggedUser");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setLoggeduser(parsedUser);
      if (parsedUser.cart_id && parsedUser.cart_id.length > 0) {
        fetchCartItems(parsedUser.cart_id);
      }
    }
  }, []);

  // ✅ Fetch product details from your API
  const fetchCartItems = async (cartIds) => {
    try {
      const res = await fetch("https://my-json-server.typicode.com/Kavinkumar84/my-json-api/products");
      const data = await res.json();
      const userCart = data.filter(item => cartIds.includes(item.id));
      setCartProducts(userCart);
    } catch (error) {
      console.error("Error loading cart items:", error);
    }
  };

  // ✅ Remove item from cart
  const removeFromCart = (id) => {
    const updatedCart = loggeduser.cart_id.filter(itemId => itemId !== id);
    const updatedUser = { ...loggeduser, cart_id: updatedCart };
    localStorage.setItem("LoggedUser", JSON.stringify(updatedUser));
    setLoggeduser(updatedUser);
    setCartProducts(cartProducts.filter(item => item.id !== id));
  };

  // ✅ Calculate total
  const totalPrice = cartProducts.reduce((total, item) => total + Number(item.price || 0), 0);

  // ✅ No user login UI
  if (!loggeduser) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 text-center py-5">
            <img 
              src={NoUser} 
              alt="Please login" 
              className="img-fluid mb-3"
              style={{ maxWidth: "260px" }}
            />
            <h3 className="fw-bold mb-3">Welcome to SHOP.CO</h3>
            <p className="text-muted mb-4">
              Sign in to view your cart and continue shopping.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/Login" state={{ from: location.pathname }} className="btn btn-primary">
                Login
              </Link>
              <Link to="/SignUp" state={{ from: location.pathname }} className="btn btn-outline-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Empty cart UI
  if (loggeduser.cart_id.length === 0 || cartProducts.length === 0) {
    return (
      <div className="container text-center py-5">
        <Lottie animationData={emptyCart} loop style={{ width: "300px", margin: "auto" }} />
        <h4 className="fw-bold mt-3">Your Cart is Empty</h4>
        <p className="text-muted mb-4">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/shop" className="btn btn-primary px-4">
          <i className="bi bi-shop me-2"></i> Start Shopping
        </Link>
      </div>
    );
  }

  // ✅ Main cart content
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Your Cart Items</h2>
        <span className="badge bg-primary">
          {cartProducts.length} {cartProducts.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="row g-3">
        {cartProducts.map((product) => (
          <div className="col-12 col-md-6 col-lg-4" key={product.id}>
            <div className="card h-100 shadow-sm border-0">
              <img
                src={product.image}
                alt={product.product_name}
                className="card-img-top"
                style={{ height: "220px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold">{product.product_name}</h6>
                  <p className="text-muted small mb-2">{product.description}</p>
                  <p className="fw-semibold mb-2">₹{product.price}</p>
                </div>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="btn btn-outline-danger mt-auto"
                >
                  <i className="bi bi-trash me-1"></i> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Cart Summary */}
      <div className="text-end mt-4 border-top pt-3">
        <h5>Total: ₹{totalPrice}</h5>
        <button className="btn btn-success mt-2 px-4">
          <i className="bi bi-bag-check-fill me-2"></i> Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
