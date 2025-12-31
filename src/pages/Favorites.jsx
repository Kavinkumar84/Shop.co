import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import EmptyWishlistVideo from '../assets/EmptyWishlist.mp4';
import NoUser from '../assets/NoUser.png';

const Favorites = () => {
    const [loggeduser, setLoggeduser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const userData = localStorage.getItem("LoggedUser");
        if(userData){
            setLoggeduser(JSON.parse(userData));
        }
    }, []);

    if (!loggeduser) {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="text-center py-4 py-md-5">
                            <div className="mb-3 mb-md-4">
                                <img 
                                    src={NoUser} 
                                    alt="Please login" 
                                    className="img-fluid"
                                    style={{ maxWidth: "280px", width: "90%", height: "auto" }}
                                />
                            </div>

                            <h3 className="fw-bold mb-3 fs-5 fs-md-4 fs-lg-3">Welcome to SHOP.CO</h3>
                            
                            <p className="text-muted mb-4 px-3 px-md-4 fs-6">
                                Sign in to unlock your personalized shopping experience, save your favorites, and track your orders.
                            </p>

                            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center px-3 px-sm-4">
                                <Link 
                                    to="/Login" 
                                    state={{ from: location.pathname }}
                                    className="btn btn-primary px-4 py-2"
                                    style={{ fontSize: "0.95rem" }}
                                >
                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                    Login
                                </Link>
                                <Link 
                                    to="/SignUp" 
                                    state={{ from: location.pathname }}
                                    className="btn btn-outline-primary px-4 py-2"
                                    style={{ fontSize: "0.95rem" }}
                                >
                                    <i className="bi bi-person-plus me-2"></i>
                                    Create Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } 

    return (
        <div className="container mt-3 mt-md-4 px-3 px-md-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    {loggeduser && loggeduser.favorite.length === 0 ? (
                        // Empty wishlist state with video
                        <div className="text-center py-4 py-md-5">
                            <div className="mb-3 mb-md-4 d-flex justify-content-center">
                                {/* Video Animation */}
                                <video 
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline
                                    style={{ 
                                        width: "350px", 
                                        maxWidth: "85%", 
                                        height: "auto",
                                        objectFit: "contain"
                                    }}
                                >
                                    <source src={EmptyWishlistVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            
                            <h4 className="mb-3 fw-bold fs-6 fs-md-5 fs-lg-4">Your Wishlist is Empty</h4>
                            
                            <p className="text-muted mb-2 px-3 px-md-0" style={{ fontSize: "0.95rem" }}>
                                You haven't added any products to your favorites yet.
                            </p>
                            <p className="text-muted mb-4 px-3 px-md-0" style={{ fontSize: "0.95rem" }}>
                                Click the <i className="bi bi-heart text-danger"></i> icon to save products you love!
                            </p>
                            
                            <Link 
                                to="/shop" 
                                className="btn btn-primary px-4 py-2"
                                style={{ fontSize: "0.95rem" }}
                            >
                                <i className="bi bi-shop me-2"></i>
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        // Has favorite products
                        <div className="text-center text-md-start">
                            <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
                                <h2 className="mb-0 fw-bold fs-5 fs-md-4 fs-lg-3">Your Favorite Products</h2>
                                <span className="badge bg-danger" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
                                    <i className="bi bi-heart-fill me-1"></i>
                                    {loggeduser.favorite.length} {loggeduser.favorite.length === 1 ? 'Item' : 'Items'}
                                </span>
                            </div>
                            
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4">
                                {loggeduser.favorite.map((product, index) => (
                                    <div key={index} className="col">
                                        <div className="card h-100 shadow-sm">
                                            {/* Your product card content */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Favorites;