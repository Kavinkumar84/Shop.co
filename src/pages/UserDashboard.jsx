import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import toast from "react-hot-toast";
import UpdateProfileModal from "../components/UpdateProfileModal";
import AddAddressModal from "../components/AddAddressModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import "../css/UserDashboard.css";
import { FiHome, FiHeart, FiStar, FiCreditCard, FiMapPin, FiSettings, FiLogOut, FiMenu, FiX, FiPlus, FiUser, FiPackage, FiClock, FiFilter, FiShoppingBag, FiDollarSign } from "react-icons/fi";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]); // State for orders
    const [loading, setLoading] = useState(true);
    const [addressesLoading, setAddressesLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const ADDRESS_LIMIT = 5;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    toast.error("Please login to access dashboard");
                    navigate("/login");
                    return;
                }
                const response = await apiClient.get("/Auth/getUserDetail");
                if (response.data.success) {
                    setUserData(response.data.user);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error("Session expired. Please login again");
                    localStorage.removeItem("user");
                    navigate("/login");
                } else {
                    toast.error("Failed to load user data");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    const fetchAddresses = async () => {
        setAddressesLoading(true);
        try {
            const response = await apiClient.get("/Auth/getAddress");
            if (response.data.success) {
                setAddresses(response.data.address || []);
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                toast.error("Failed to load addresses");
            }
        } finally {
            setAddressesLoading(false);
        }
    };

    useEffect(() => {
        if (userData && (activeMenu === "addresses" || activeMenu === "dashboard")) {
            fetchAddresses();
        }
    }, [userData, activeMenu]);

    const handleLogout = async () => {
        try {
            await apiClient.post("/Auth/logout");
            localStorage.removeItem("user");
            toast.success("Logged out successfully");
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
            localStorage.removeItem("user");
            navigate("/");
        }
    };

    const handleUpdateSuccess = (updatedUser) => {
        setUserData(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Update local storage
    };

    const handleOpenAddressModal = () => {
        if (addresses.length >= ADDRESS_LIMIT) {
            toast.error(`You can only save up to ${ADDRESS_LIMIT} addresses.`);
            return;
        }
        setEditMode(false);
        setSelectedAddress(null);
        setIsAddressModalOpen(true);
    };

    const handleEditAddress = (address) => {
        setEditMode(true);
        setSelectedAddress(address);
        setIsAddressModalOpen(true);
    };

    const handleOpenDeleteModal = (address) => {
        setAddressToDelete(address);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!addressToDelete) return;
        setIsDeleting(true);
        try {
            const response = await apiClient.delete(`/Auth/deleteAddress/${addressToDelete.addressId}`);
            if (response.data.success) {
                toast.success("Address deleted successfully");
                fetchAddresses();
                setIsDeleteModalOpen(false);
                setAddressToDelete(null);
            }
        } catch (error) {
            toast.error("Failed to delete address");
        } finally {
            setIsDeleting(false);
        }
    };

    const renderContent = () => {
        switch (activeMenu) {
            case "dashboard":
                return (
                    <div className="dashboard-content-wrapper fadeIn">
                        {/* Stats Overview */}
                        <div className="dashboard-stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon-wrapper orders">
                                    <FiShoppingBag />
                                </div>
                                <div className="stat-content">
                                    <h3>Total Orders</h3>
                                    <p className="stat-value">{orders.length || 0}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon-wrapper spent">
                                    <FiDollarSign />
                                </div>
                                <div className="stat-content">
                                    <h3>Lifetime Spent</h3>
                                    <p className="stat-value">₹{0}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon-wrapper points">
                                    <FiStar />
                                </div>
                                <div className="stat-content">
                                    <h3>Loyalty Points</h3>
                                    <p className="stat-value">{0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 1: Ongoing Orders */}
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h3>Ongoing Orders</h3>
                            </div>
                            {orders.some(o => o.status === 'ongoing') ? (
                                <div className="orders-list">
                                    {/* Map ongoing orders here */}
                                </div>
                            ) : (
                                <div className="empty-placeholder">
                                    <FiPackage />
                                    <h4>No Ongoing Orders</h4>
                                    <p>You don't have any orders in progress currently.</p>
                                </div>
                            )}
                        </div>

                        {/* Section 2: Saved Addresses */}
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h3>Saved Addresses ({addresses.length}/{ADDRESS_LIMIT})</h3>
                                <button
                                    className="btn-add-address"
                                    onClick={handleOpenAddressModal}
                                    disabled={addresses.length >= ADDRESS_LIMIT}
                                    style={{
                                        opacity: addresses.length >= ADDRESS_LIMIT ? 0.5 : 1,
                                        cursor: addresses.length >= ADDRESS_LIMIT ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        backgroundColor: '#4f46e5', color: 'white', border: 'none',
                                        padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: '600', fontSize: '0.9rem'
                                    }}
                                >
                                    <FiPlus /> Add New
                                </button>
                            </div>

                            {addressesLoading ? (
                                <div className="loading-state">Loading addresses...</div>
                            ) : addresses.length === 0 ? (
                                <div className="empty-placeholder">
                                    <FiMapPin />
                                    <h4>No Saved Addresses</h4>
                                    <p>Add an address to make checkout faster.</p>
                                </div>
                            ) : (
                                <div className="address-grid">
                                    {addresses.map((address) => (
                                        <div className="address-card" key={address.addressId}>
                                            <h4>
                                                {address.addressType}
                                                {address.isDefault && <span className="default-badge">Default</span>}
                                            </h4>
                                            <p className="address-name">{address.name}</p>
                                            <p className="address-text">
                                                {address.houseNo}, {address.street}
                                                {address.landmark && <><br />{address.landmark}</>}
                                                <br />
                                                {address.city}, {address.state} - {address.pincode}
                                            </p>
                                            <p className="address-phone">Phone: {address.phone}</p>
                                            <div className="address-actions">
                                                <button className="link-btn edit" onClick={() => handleEditAddress(address)}>Edit</button>
                                                <button className="link-btn delete" onClick={() => handleOpenDeleteModal(address)}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Section 3: Order History */}
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h3>Order History</h3>
                                <div className="filter-wrapper" style={{ position: 'relative' }}>
                                    <FiFilter style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <select
                                        className="filter-dropdown"
                                        style={{
                                            padding: '0.5rem 1rem 0.5rem 2.2rem',
                                            borderRadius: '8px',
                                            border: '1px solid #e5e7eb',
                                            backgroundColor: 'white',
                                            color: '#374151',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="1">Last Month</option>
                                        <option value="6">Last 6 Months</option>
                                        <option value="12">Last Year</option>
                                    </select>
                                </div>
                            </div>
                            {orders.length === 0 ? (
                                <div className="empty-placeholder">
                                    <FiClock />
                                    <h4>No Order History</h4>
                                    <p>Your past orders will appear here.</p>
                                </div>
                            ) : (
                                <div className="orders-list">
                                    {/* Map history orders here */}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case "wishlist":
                return (
                    <div className="dashboard-section fadeIn">
                        <div className="section-header">
                            <h3>My Wishlist</h3>
                        </div>
                        <div className="empty-placeholder">
                            <FiHeart />
                            <h4>Your Wishlist is Empty</h4>
                            <p>Save items you love here to buy them later.</p>
                        </div>
                    </div>
                );
            case "loyalty":
                return (
                    <div className="dashboard-section fadeIn">
                        <div className="section-header">
                            <h3>Loyalty Points</h3>
                        </div>
                        <div className="empty-placeholder">
                            <FiStar />
                            <h4>No Points Yet</h4>
                            <p>Earn points with every purchase and redeem them for exclusive rewards.</p>
                        </div>
                    </div>
                );
            case "payment":
                return (
                    <div className="dashboard-section fadeIn">
                        <div className="section-header">
                            <h3>Payment Methods</h3>
                        </div>
                        <div className="empty-placeholder">
                            <FiCreditCard />
                            <h4>No Saved Cards</h4>
                            <p>Save your payment methods for faster checkout.</p>
                        </div>
                    </div>
                );
            case "addresses":
                return (
                    <div className="dashboard-section fadeIn">
                        <div className="section-header">
                            <h3>Saved Addresses</h3>
                            <button
                                className="btn-add-address"
                                onClick={handleOpenAddressModal}
                                disabled={addresses.length >= ADDRESS_LIMIT}
                                style={{
                                    opacity: addresses.length >= ADDRESS_LIMIT ? 0.5 : 1,
                                    cursor: addresses.length >= ADDRESS_LIMIT ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    backgroundColor: '#4f46e5', color: 'white', border: 'none',
                                    padding: '10px 20px', borderRadius: '50px', fontWeight: '600'
                                }}
                            >
                                <FiPlus /> Add New
                            </button>
                        </div>

                        {addressesLoading ? (
                            <div className="loading-state">Loading addresses...</div>
                        ) : addresses.length === 0 ? (
                            <div className="empty-placeholder">
                                <FiMapPin />
                                <h4>No Addresses Saved</h4>
                                <p>Add an address to make checkout faster.</p>
                            </div>
                        ) : (
                            <div className="address-grid">
                                {addresses.map((address) => (
                                    <div className="address-card" key={address.addressId}>
                                        <h4>
                                            {address.addressType}
                                            {address.isDefault && <span className="default-badge">Default</span>}
                                        </h4>
                                        <p className="address-name">{address.name}</p>
                                        <p className="address-text">
                                            {address.houseNo}, {address.street}
                                            {address.landmark && <><br />{address.landmark}</>}
                                            <br />
                                            {address.city}, {address.state} - {address.pincode}
                                        </p>
                                        <p className="address-phone">Phone: {address.phone}</p>
                                        <div className="address-actions">
                                            <button className="link-btn edit" onClick={() => handleEditAddress(address)}>Edit</button>
                                            <button className="link-btn delete" onClick={() => handleOpenDeleteModal(address)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case "settings":
                return (
                    <div className="dashboard-section fadeIn">
                        <div className="section-header">
                            <h3>Account Settings</h3>
                        </div>
                        <div className="empty-placeholder">
                            <FiSettings />
                            <h4>Settings</h4>
                            <p>Manage your account preferences and security settings here.</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="user-dashboard">
            <button
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>

            <div
                className={`sidebar-overlay ${isMobileMenuOpen ? 'show' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-menu">
                    <div className={`menu-item ${activeMenu === "dashboard" ? "active" : ""}`} onClick={() => setActiveMenu("dashboard")}>
                        <FiHome /> <span>Dashboard</span>
                    </div>
                    <div className={`menu-item ${activeMenu === "wishlist" ? "active" : ""}`} onClick={() => setActiveMenu("wishlist")}>
                        <FiHeart /> <span>Wishlist</span>
                    </div>
                    <div className={`menu-item ${activeMenu === "loyalty" ? "active" : ""}`} onClick={() => setActiveMenu("loyalty")}>
                        <FiStar /> <span>Loyalty Points</span>
                    </div>
                    <div className={`menu-item ${activeMenu === "payment" ? "active" : ""}`} onClick={() => setActiveMenu("payment")}>
                        <FiCreditCard /> <span>Payment Methods</span>
                    </div>
                    <div className={`menu-item ${activeMenu === "addresses" ? "active" : ""}`} onClick={() => setActiveMenu("addresses")}>
                        <FiMapPin /> <span>Addresses</span>
                    </div>
                    <div className={`menu-item ${activeMenu === "settings" ? "active" : ""}`} onClick={() => setActiveMenu("settings")}>
                        <FiSettings /> <span>Settings</span>
                    </div>
                    <div className="menu-item logout" onClick={handleLogout}>
                        <FiLogOut /> <span>Logout</span>
                    </div>
                </div>
            </aside>

            <main className="dashboard-content">
                {loading ? (
                    <div className="loading-state">Loading...</div>
                ) : (
                    <>
                        <div className="profile-header">
                            <div className="profile-info">
                                <div className="profile-avatar">
                                    {userData?.profileUrl ? (
                                        <img
                                            src={userData.profileUrl.startsWith("http") ? userData.profileUrl : `${import.meta.env.VITE_API_KEY}/${userData.profileUrl}`}
                                            alt="Profile"
                                        />
                                    ) : (
                                        <FiUser />
                                    )}
                                </div>
                                <div className="profile-details">
                                    <h2>{userData?.name || "User"}</h2>
                                    <p className="email">{userData?.email}</p>
                                </div>
                            </div>
                            <button className="btn-update-profile" onClick={() => setIsModalOpen(true)}>
                                Edit Profile
                            </button>
                        </div>

                        {renderContent()}
                    </>
                )}
            </main>

            {/* Modals */}
            <UpdateProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userData={userData}
                onUpdateSuccess={handleUpdateSuccess}
            />

            <AddAddressModal
                isOpen={isAddressModalOpen}
                onClose={() => { setIsAddressModalOpen(false); setEditMode(false); setSelectedAddress(null); }}
                onAddressAdded={fetchAddresses}
                addressLimit={ADDRESS_LIMIT}
                currentAddressCount={addresses.length}
                editMode={editMode}
                addressData={selectedAddress}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setAddressToDelete(null); }}
                onConfirm={handleConfirmDelete}
                addressName={addressToDelete?.addressType}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default UserDashboard;
