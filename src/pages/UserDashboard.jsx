import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import UpdateProfileModal from '../components/UpdateProfileModal';
import AddAddressModal from '../components/AddAddressModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import '../css/UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
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
                const userData = localStorage.getItem('user');

                if (!userData) {
                    toast.error('Please login to access dashboard');
                    navigate('/login');
                    return;
                }
                const parsedData = JSON.parse(userData);
                const token = parsedData.token;

                if (!token) {
                    toast.error('Please login to access dashboard');
                    navigate('/login');
                    return;
                }

                const response = await axios.get(
                    'https://api.shopco.site/Auth/getUserDetail',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setUserData(response.data.user);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error('Session expired. Please login again');
                    localStorage.removeItem('user');
                    navigate('/login');
                } else {
                    toast.error('Failed to load user data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    // Fetch addresses
    const fetchAddresses = async () => {
        setAddressesLoading(true);
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;

            const parsedData = JSON.parse(userData);
            const token = parsedData.token;

            const response = await axios.get(
                'https://api.shopco.site/Auth/getAddress',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setAddresses(response.data.address || []);
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                toast.error('Failed to load addresses');
            }
        } finally {
            setAddressesLoading(false);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchAddresses();
        }
    }, [userData]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/');
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdateSuccess = (updatedUser) => {
        setUserData(updatedUser);
        const userDataLocal = localStorage.getItem('user');
        if (userDataLocal) {
            const parsedData = JSON.parse(userDataLocal);
            parsedData.user = updatedUser;
            localStorage.setItem('user', JSON.stringify(parsedData));
        }
    };

    const handleOpenAddressModal = () => {
        if (addresses.length >= ADDRESS_LIMIT) {
            toast.error(`You can only save up to ${ADDRESS_LIMIT} addresses. Please delete an existing address first.`);
            return;
        }
        setEditMode(false);
        setSelectedAddress(null);
        setIsAddressModalOpen(true);
    };

    const handleCloseAddressModal = () => {
        setIsAddressModalOpen(false);
        setEditMode(false);
        setSelectedAddress(null);
    };

    const handleAddressAdded = () => {
        fetchAddresses();
    };

    // Edit address
    const handleEditAddress = (address) => {
        setEditMode(true);
        setSelectedAddress(address);
        setIsAddressModalOpen(true);
    };

    // Open delete confirmation modal
    const handleOpenDeleteModal = (address) => {
        setAddressToDelete(address);
        setIsDeleteModalOpen(true);
    };

    // Close delete confirmation modal
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setAddressToDelete(null);
    };

    // Confirm delete address
    const handleConfirmDelete = async () => {
        if (!addressToDelete) return;

        setIsDeleting(true);

        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;

            const parsedData = JSON.parse(userData);
            const token = parsedData.token;

            const response = await axios.delete(
                `https://api.shopco.site/Auth/deleteAddress/${addressToDelete.addressId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                toast.success('Address deleted successfully');
                fetchAddresses();
                handleCloseDeleteModal();
            }
        } catch (error) {
            toast.error('Failed to delete address');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="user-dashboard">
            {/* Mobile Menu Toggle Button */}
            <button
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                <i className={`bi ${isMobileMenuOpen ? 'bi-x' : 'bi-list'}`}></i>
            </button>

            {/* Sidebar Overlay (for mobile) */}
            {isMobileMenuOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-menu">
                    <div
                        className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveMenu('dashboard');
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        <i className="bi bi-grid-fill"></i>
                        <span>Dashboard</span>
                    </div>

                    <div
                        className={`menu-item ${activeMenu === 'wishlist' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveMenu('wishlist');
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        <i className="bi bi-heart-fill"></i>
                        <span>Wishlist</span>
                        <span className="count-badge">12</span>
                    </div>

                    <div
                        className={`menu-item ${activeMenu === 'loyalty' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveMenu('loyalty');
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        <i className="bi bi-star-fill"></i>
                        <span>Loyalty Points</span>
                    </div>

                    <div
                        className={`menu-item ${activeMenu === 'payment' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveMenu('payment');
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        <i className="bi bi-credit-card-fill"></i>
                        <span>Payment Methods</span>
                    </div>

                    <div
                        className={`menu-item ${activeMenu === 'addresses' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveMenu('addresses');
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        <i className="bi bi-geo-alt-fill"></i>
                        <span>Saved Addresses</span>
                        <span className="count-badge">{addresses.length}</span>
                    </div>

                    <div
                        className={`menu-item ${activeMenu === 'settings' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveMenu('settings');
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        <i className="bi bi-gear-fill"></i>
                        <span>Account Settings</span>
                    </div>

                    <div className="menu-item logout" onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                    }}>
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-content">
                {loading ? (
                    <div className="loading-state">
                        <p>Loading dashboard...</p>
                    </div>
                ) : (
                    <>
                        {/* Profile Header */}
                        <div className="profile-header">
                            <div className="profile-info">
                                <div className="profile-avatar">
                                    {userData?.profileUrl ? (
                                        <img src={userData.profileUrl} alt={userData.name} />
                                    ) : (
                                        <i className="bi bi-person-circle"></i>
                                    )}
                                </div>
                                <div className="profile-details">
                                    <h2>{userData?.name || 'User'}</h2>
                                    <p className="email">{userData?.email || ''}</p>
                                    <p className="join-date">
                                        Joined {new Date(userData?.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <button className="btn-update-profile" onClick={handleOpenModal}>Update Profile</button>
                        </div>

                        {/* Statistics Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-header">
                                    <h3>Total Orders</h3>
                                    <span className="trend-positive">+12%</span>
                                </div>
                                <p className="stat-value">42</p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <h3>Lifetime Spent</h3>
                                </div>
                                <p className="stat-value">$4,820.00</p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <h3>Loyalty Points</h3>
                                </div>
                                <p className="stat-value">2,450</p>
                            </div>
                        </div>

                        {/* Ongoing Orders */}
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h3>Ongoing Orders</h3>
                            </div>

                            <div className="order-tracking-card">
                                <div className="order-header">
                                    <div>
                                        <h4>Order #LX-982104</h4>
                                        <span className="status-badge in-transit">IN TRANSIT</span>
                                    </div>
                                    <div className="arrival-info">
                                        <p className="arrival-label">Estimated Arrival</p>
                                        <p className="arrival-date">May 24, 2024</p>
                                    </div>
                                </div>

                                <div className="progress-tracker">
                                    <div className="progress-step completed">
                                        <div className="progress-node"></div>
                                        <p>Confirmed</p>
                                    </div>
                                    <div className="progress-line completed"></div>
                                    <div className="progress-step completed">
                                        <div className="progress-node"></div>
                                        <p>Shipped</p>
                                    </div>
                                    <div className="progress-line active"></div>
                                    <div className="progress-step active">
                                        <div className="progress-node"></div>
                                        <p>Out for Delivery</p>
                                    </div>
                                    <div className="progress-line"></div>
                                    <div className="progress-step">
                                        <div className="progress-node"></div>
                                        <p>Delivered</p>
                                    </div>
                                </div>

                                <div className="order-products">
                                    <div className="product-thumbnail">
                                        <i className="bi bi-box-seam"></i>
                                    </div>
                                    <div className="product-thumbnail">
                                        <i className="bi bi-laptop"></i>
                                    </div>
                                    <div className="product-more">+2</div>
                                </div>
                            </div>
                        </section>

                        {/* Saved Addresses */}
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h3>Saved Addresses ({addresses.length}/{ADDRESS_LIMIT})</h3>
                                <button
                                    className="btn-add-address"
                                    onClick={handleOpenAddressModal}
                                    disabled={addresses.length >= ADDRESS_LIMIT}
                                >
                                    <i className="bi bi-plus-circle"></i> Add New Address
                                </button>
                            </div>

                            {addressesLoading ? (
                                <div className="loading-state">
                                    <p>Loading addresses...</p>
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="empty-state">
                                    <i className="bi bi-geo-alt" style={{ fontSize: '48px', color: '#999' }}></i>
                                    <p>No saved addresses yet</p>
                                    <button className="btn-add-address" onClick={handleOpenAddressModal}>
                                        Add Your First Address
                                    </button>
                                </div>
                            ) : (
                                <div className="address-grid">
                                    {addresses.map((address) => (
                                        <div className="address-card" key={address.addressId}>
                                            <div className="address-header">
                                                <h4>{address.addressType}</h4>
                                                {address.isDefault && <span className="default-badge">DEFAULT</span>}
                                            </div>
                                            <p className="address-name">{address.name}</p>
                                            <p className="address-text">
                                                {address.houseNo}, {address.street}
                                                {address.landmark && `, ${address.landmark}`}<br />
                                                {address.city}, {address.state} - {address.pincode}
                                            </p>
                                            <p className="address-phone">
                                                <i className="bi bi-telephone-fill"></i> {address.phone}
                                            </p>
                                            <div className="address-actions">
                                                <button className="link-btn" onClick={() => handleEditAddress(address)}>
                                                    Edit
                                                </button>
                                                <button className="link-btn danger" onClick={() => handleOpenDeleteModal(address)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Order History */}
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h3>Order History</h3>
                                <select className="filter-dropdown">
                                    <option>Last 6 Months</option>
                                    <option>Last Year</option>
                                    <option>All Time</option>
                                </select>
                            </div>

                            <div className="order-history-list">
                                <div className="order-history-item">
                                    <div className="order-info">
                                        <h4>Order #LX-982103</h4>
                                        <p>Delivered on May 15, 2024</p>
                                    </div>
                                    <div className="order-amount">$245.00</div>
                                    <button className="btn-view-details">View Details</button>
                                </div>

                                <div className="order-history-item">
                                    <div className="order-info">
                                        <h4>Order #LX-982102</h4>
                                        <p>Delivered on May 02, 2024</p>
                                    </div>
                                    <div className="order-amount">$89.99</div>
                                    <button className="btn-view-details">View Details</button>
                                </div>

                                <div className="order-history-item">
                                    <div className="order-info">
                                        <h4>Order #LX-982101</h4>
                                        <p>Delivered on April 28, 2024</p>
                                    </div>
                                    <div className="order-amount">$456.50</div>
                                    <button className="btn-view-details">View Details</button>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>

            {/* Update Profile Modal */}
            <UpdateProfileModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                userData={userData}
                onUpdateSuccess={handleUpdateSuccess}
            />

            {/* Add/Edit Address Modal */}
            <AddAddressModal
                isOpen={isAddressModalOpen}
                onClose={handleCloseAddressModal}
                onAddressAdded={handleAddressAdded}
                addressLimit={ADDRESS_LIMIT}
                currentAddressCount={addresses.length}
                editMode={editMode}
                addressData={selectedAddress}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                addressName={addressToDelete?.addressType}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default UserDashboard;
