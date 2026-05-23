import { useState } from 'react';
import './App.css';

const PRODUCTS = [
  {
    id: 'noir-amber',
    name: 'Noir Amber 07',
    description: 'Amber resin, midnight iris, smoked vetiver.',
    price: 165,
  },
  {
    id: 'velvet-dusk',
    name: 'Velvet Dusk 12',
    description: 'Black tea, cashmere woods, fig leaf.',
    price: 175,
  },
  {
    id: 'citrine-smoke',
    name: 'Citrine Smoke 05',
    description: 'Citrus peel, saffron, warm cedar.',
    price: 155,
  },
];

const EMPTY_PROFILE = {
  name: '',
  contactNumber: '',
  province: '',
  city: '',
  address: '',
  email: '',
  age: '',
};

const EMPTY_ORDER = {
  product: PRODUCTS[0].name,
  quantity: '1',
  ...EMPTY_PROFILE,
};

const isEmail = (value) => /\S+@\S+\.\S+/.test(value);
const isPhone = (value) => /^[0-9+()\-\s]{7,}$/.test(value);

const validateProfile = (values) => {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required.';
  }

  if (!values.contactNumber.trim()) {
    errors.contactNumber = 'Contact number is required.';
  } else if (!isPhone(values.contactNumber.trim())) {
    errors.contactNumber = 'Enter a valid contact number.';
  }

  if (!values.province.trim()) {
    errors.province = 'Province is required.';
  }

  if (!values.city.trim()) {
    errors.city = 'City is required.';
  }

  if (!values.address.trim()) {
    errors.address = 'Address is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!isEmail(values.email.trim())) {
    errors.email = 'Enter a valid email.';
  }

  if (!values.age.toString().trim()) {
    errors.age = 'Age is required.';
  } else if (Number.isNaN(Number(values.age)) || Number(values.age) < 13) {
    errors.age = 'Enter a valid age (13+).';
  }

  return errors;
};

function App() {
  const [view, setView] = useState('public');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [orders, setOrders] = useState([]);
  const [orderForm, setOrderForm] = useState(EMPTY_ORDER);
  const [orderErrors, setOrderErrors] = useState({});
  const [authErrors, setAuthErrors] = useState({});
  const [profileErrors, setProfileErrors] = useState({});
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleNavHome = () => setView('public');

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('public');
  };

  const handleAuthChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const errors = {};

    if (!authForm.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!isEmail(authForm.email.trim())) {
      errors.email = 'Enter a valid email.';
    }

    if (!authForm.password.trim()) {
      errors.password = 'Password is required.';
    } else if (authForm.password.trim().length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setAuthErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsAuthenticated(true);
      setProfile((prev) => ({
        ...prev,
        email: prev.email || authForm.email.trim(),
      }));
      setView('profile');
    }
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const errors = {};

    if (!authForm.name.trim()) {
      errors.name = 'Name is required.';
    }

    if (!authForm.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!isEmail(authForm.email.trim())) {
      errors.email = 'Enter a valid email.';
    }

    if (!authForm.password.trim()) {
      errors.password = 'Password is required.';
    } else if (authForm.password.trim().length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (!authForm.confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm your password.';
    } else if (authForm.confirmPassword.trim() !== authForm.password.trim()) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setAuthErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsAuthenticated(true);
      setProfile((prev) => ({
        ...prev,
        name: authForm.name.trim(),
        email: authForm.email.trim(),
      }));
      setView('profile');
    }
  };

  const handleOrderChange = (event) => {
    const { name, value } = event.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = (event) => {
    event.preventDefault();
    const errors = validateProfile(orderForm);

    if (!orderForm.product.trim()) {
      errors.product = 'Select a product.';
    }

    if (!orderForm.quantity.trim()) {
      errors.quantity = 'Quantity is required.';
    } else if (Number.isNaN(Number(orderForm.quantity)) || Number(orderForm.quantity) < 1) {
      errors.quantity = 'Enter a valid quantity.';
    }

    setOrderErrors(errors);

    if (Object.keys(errors).length === 0) {
      const selected = PRODUCTS.find((item) => item.name === orderForm.product);
      const newOrder = {
        id: Date.now(),
        product: orderForm.product,
        quantity: Number(orderForm.quantity),
        price: selected ? selected.price : 0,
        date: new Date().toLocaleDateString(),
        status: 'Processing',
      };

      setOrders((prev) => [newOrder, ...prev]);
      setProfile({
        name: orderForm.name.trim(),
        contactNumber: orderForm.contactNumber.trim(),
        province: orderForm.province.trim(),
        city: orderForm.city.trim(),
        address: orderForm.address.trim(),
        email: orderForm.email.trim(),
        age: orderForm.age.toString().trim(),
      });
      setOrderForm((prev) => ({
        ...prev,
        quantity: '1',
      }));
    }
  };

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setProfileErrors({});
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = (event) => {
    event.preventDefault();
    const errors = validateProfile(profile);
    setProfileErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsEditingProfile(false);
    }
  };

  const startOrder = (productName) => {
    setView('public');
    setOrderForm((prev) => ({ ...prev, product: productName }));
    setTimeout(() => {
      const section = document.getElementById('order');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  const renderAuthForm = () => {
    const isLogin = view === 'login';

    return (
      <section className="auth">
        <div className="auth-card">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <p className="auth-subtitle">
            {isLogin
              ? 'Access your MF.CO account to view orders and profile details.'
              : 'Create an account to manage orders and personal details.'}
          </p>
          <form className="auth-form" onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <label>
                Full name
                <input
                  type="text"
                  name="name"
                  value={authForm.name}
                  onChange={handleAuthChange}
                  placeholder="Your name"
                />
                {authErrors.name && <span className="field-error">{authErrors.name}</span>}
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                name="email"
                value={authForm.email}
                onChange={handleAuthChange}
                placeholder="you@email.com"
              />
              {authErrors.email && <span className="field-error">{authErrors.email}</span>}
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={authForm.password}
                onChange={handleAuthChange}
                placeholder="Enter password"
              />
              {authErrors.password && (
                <span className="field-error">{authErrors.password}</span>
              )}
            </label>
            {!isLogin && (
              <label>
                Confirm password
                <input
                  type="password"
                  name="confirmPassword"
                  value={authForm.confirmPassword}
                  onChange={handleAuthChange}
                  placeholder="Repeat password"
                />
                {authErrors.confirmPassword && (
                  <span className="field-error">{authErrors.confirmPassword}</span>
                )}
              </label>
            )}
            <button className="btn btn-primary" type="submit">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={handleNavHome}
            >
              Back to Home
            </button>
          </form>
        </div>
      </section>
    );
  };

  const renderProfile = () => (
    <section className="profile-page">
      <div className="profile-header">
        <div>
          <h2>Profile</h2>
          <p className="lead">
            Manage your personal information and track order history.
          </p>
        </div>
        {!isEditingProfile && (
          <button className="btn btn-outline" type="button" onClick={handleProfileEdit}>
            Edit Details
          </button>
        )}
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>Personal Information</h3>
          {isEditingProfile ? (
            <form className="profile-form" onSubmit={handleProfileSave}>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                />
                {profileErrors.name && (
                  <span className="field-error">{profileErrors.name}</span>
                )}
              </label>
              <label>
                Contact number
                <input
                  type="text"
                  name="contactNumber"
                  value={profile.contactNumber}
                  onChange={handleProfileChange}
                />
                {profileErrors.contactNumber && (
                  <span className="field-error">{profileErrors.contactNumber}</span>
                )}
              </label>
              <label>
                Province
                <input
                  type="text"
                  name="province"
                  value={profile.province}
                  onChange={handleProfileChange}
                />
                {profileErrors.province && (
                  <span className="field-error">{profileErrors.province}</span>
                )}
              </label>
              <label>
                City
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleProfileChange}
                />
                {profileErrors.city && (
                  <span className="field-error">{profileErrors.city}</span>
                )}
              </label>
              <label>
                Address
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                />
                {profileErrors.address && (
                  <span className="field-error">{profileErrors.address}</span>
                )}
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
                {profileErrors.email && (
                  <span className="field-error">{profileErrors.email}</span>
                )}
              </label>
              <label>
                Age
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleProfileChange}
                />
                {profileErrors.age && (
                  <span className="field-error">{profileErrors.age}</span>
                )}
              </label>
              <div className="profile-actions">
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <p>
                <span>Name</span>
                <strong>{profile.name || 'Not provided'}</strong>
              </p>
              <p>
                <span>Contact Number</span>
                <strong>{profile.contactNumber || 'Not provided'}</strong>
              </p>
              <p>
                <span>Province</span>
                <strong>{profile.province || 'Not provided'}</strong>
              </p>
              <p>
                <span>City</span>
                <strong>{profile.city || 'Not provided'}</strong>
              </p>
              <p>
                <span>Address</span>
                <strong>{profile.address || 'Not provided'}</strong>
              </p>
              <p>
                <span>Email</span>
                <strong>{profile.email || 'Not provided'}</strong>
              </p>
              <p>
                <span>Age</span>
                <strong>{profile.age || 'Not provided'}</strong>
              </p>
            </div>
          )}
        </div>

        <div className="profile-card">
          <h3>Order History</h3>
          {orders.length === 0 ? (
            <p className="muted">No orders yet. Place an order to see it here.</p>
          ) : (
            <div className="order-history">
              {orders.map((order) => (
                <div className="history-item" key={order.id}>
                  <div>
                    <p className="history-title">{order.product}</p>
                    <p className="history-meta">
                      {order.date} • Qty {order.quantity}
                    </p>
                  </div>
                  <div className="history-status">
                    <span>{order.status}</span>
                    <strong>${order.price}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  return (
    <div className="app">
      <div className="glow glow-one" aria-hidden="true" />
      <div className="glow glow-two" aria-hidden="true" />
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">MF.CO</span>
          <span className="brand-subtitle">Modern Fragrance House</span>
        </div>
        <nav className="nav">
          {isAuthenticated ? (
            <>
              <button type="button" onClick={handleNavHome}>
                Home
              </button>
              <button type="button" onClick={() => setView('profile')}>
                Profile
              </button>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="#home">Home</a>
              <a href="#services">Services</a>
              <a href="#about">About Us</a>
              <a href="#products">Products</a>
              <a href="#contact">Contact Us</a>
              <a href="#order">Order</a>
              <button type="button" onClick={() => setView('login')}>
                Login
              </button>
              <button type="button" className="nav-highlight" onClick={() => setView('register')}>
                Register
              </button>
            </>
          )}
        </nav>
        {!isAuthenticated && (
          <a className="btn btn-primary" href="#order">
            Order Now
          </a>
        )}
        {isAuthenticated && (
          <button className="btn btn-primary" type="button" onClick={() => setView('profile')}>
            My Account
          </button>
        )}
      </header>

      {view === 'login' || view === 'register' ? (
        renderAuthForm()
      ) : view === 'profile' && isAuthenticated ? (
        renderProfile()
      ) : (
        <main>
          <section id="home" className="hero">
            <div className="hero-content">
              <p className="eyebrow">MF.CO Atelier</p>
              <h1>Design a signature scent with noir elegance.</h1>
              <p className="lead">
                MF.CO crafts tailored perfumes inspired by night air, velvet, and luminous spice.
                We translate your mood into a fragrance that stays memorable long after the last
                note fades.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#products">
                  Explore Products
                </a>
                <a className="btn btn-outline" href="#about">
                  Our Story
                </a>
                <a className="btn btn-outline" href="#order">
                  Order Perfume
                </a>
              </div>
              <div className="stats">
                <div>
                  <h3>45+</h3>
                  <p>Signature accords curated</p>
                </div>
                <div>
                  <h3>72H</h3>
                  <p>Longevity on skin and fabric</p>
                </div>
                <div>
                  <h3>1:1</h3>
                  <p>Private perfumer sessions</p>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="bottle">
                <div className="bottle-cap" />
                <div className="bottle-body">
                  <div className="bottle-label">MF.CO</div>
                  <p>Noir Amber 07</p>
                </div>
              </div>
              <div className="hero-card">
                <p className="card-title">Limited Atelier Drop</p>
                <p className="card-note">Midnight Iris • Smoked Vetiver • Myrrh</p>
                <span className="pill">Now blending</span>
              </div>
            </div>
          </section>

          <section id="services" className="section">
            <div className="section-head">
              <h2>Services</h2>
              <p>
                From discovery flights to private labeling, each service is tailored to your
                presence and pace.
              </p>
            </div>
            <div className="card-grid">
              <article className="card">
                <h3>Signature Studio</h3>
                <p>
                  A 90-minute session with our perfumer to blend your personal formula.
                </p>
                <span className="card-meta">Includes take-home 50ml</span>
              </article>
              <article className="card">
                <h3>Layering Consultation</h3>
                <p>
                  Build a wardrobe of complementary scents to match every season and mood.
                </p>
                <span className="card-meta">4 bespoke pairings</span>
              </article>
              <article className="card">
                <h3>Event Scenting</h3>
                <p>
                  Curated ambiance scents for launches, weddings, and private dinners.
                </p>
                <span className="card-meta">Diffusion + candle design</span>
              </article>
              <article className="card">
                <h3>Private Label</h3>
                <p>
                  Create a branded fragrance line with full creative direction and production.
                </p>
                <span className="card-meta">MOQ-friendly program</span>
              </article>
            </div>
          </section>

          <section id="about" className="section split">
            <div>
              <h2>About Us</h2>
              <p className="lead">
                MF.CO blends modern craft with a noir aesthetic. We source sustainable essences
                and compose scents that feel cinematic, minimal, and unforgettable.
              </p>
              <p>
                Every formula is built around a narrative: the city at midnight, the first
                rainfall, the glow of warm amber on skin. Our atelier is built for clients who
                see fragrance as an extension of identity.
              </p>
              <div className="tag-row">
                <span className="tag">Clean Formulation</span>
                <span className="tag">Hand-blended</span>
                <span className="tag">Cruelty-free</span>
              </div>
            </div>
            <div className="feature-panel">
              <p className="panel-title">The MF.CO Process</p>
              <ol className="panel-list">
                <li>Fragrance interview + mood mapping</li>
                <li>Accord design and trials</li>
                <li>Final blend and maturation</li>
                <li>Personalized bottling</li>
              </ol>
              <div className="panel-footer">
                <span className="pill">Average build: 3-5 days</span>
              </div>
            </div>
          </section>

          <section id="products" className="section products">
            <div className="section-head">
              <h2>Products</h2>
              <p>Signature perfumes ready for immediate order.</p>
            </div>
            <div className="product-grid">
              {PRODUCTS.map((product) => (
                <article className="product-card" key={product.id}>
                  <div>
                    <h3>{product.name}</h3>
                    <p className="muted">{product.description}</p>
                  </div>
                  <div className="product-footer">
                    <span>${product.price}</span>
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => startOrder(product.name)}
                    >
                      Order Now
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="order" className="section order">
            <div className="section-head">
              <h2>Order Perfume</h2>
              <p>
                Submit your order with delivery details. Your information will be saved to your
                profile after purchase.
              </p>
            </div>
            <div className="order-layout">
              <form className="order-form" onSubmit={handleOrderSubmit}>
                <label>
                  Product
                  <select name="product" value={orderForm.product} onChange={handleOrderChange}>
                    {PRODUCTS.map((product) => (
                      <option key={product.id} value={product.name}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {orderErrors.product && <span className="field-error">{orderErrors.product}</span>}
                </label>
                <label>
                  Quantity
                  <input
                    type="number"
                    name="quantity"
                    value={orderForm.quantity}
                    onChange={handleOrderChange}
                  />
                  {orderErrors.quantity && (
                    <span className="field-error">{orderErrors.quantity}</span>
                  )}
                </label>
                <label>
                  Name
                  <input
                    type="text"
                    name="name"
                    value={orderForm.name}
                    onChange={handleOrderChange}
                  />
                  {orderErrors.name && <span className="field-error">{orderErrors.name}</span>}
                </label>
                <label>
                  Contact Number
                  <input
                    type="text"
                    name="contactNumber"
                    value={orderForm.contactNumber}
                    onChange={handleOrderChange}
                  />
                  {orderErrors.contactNumber && (
                    <span className="field-error">{orderErrors.contactNumber}</span>
                  )}
                </label>
                <label>
                  Province
                  <input
                    type="text"
                    name="province"
                    value={orderForm.province}
                    onChange={handleOrderChange}
                  />
                  {orderErrors.province && (
                    <span className="field-error">{orderErrors.province}</span>
                  )}
                </label>
                <label>
                  City
                  <input
                    type="text"
                    name="city"
                    value={orderForm.city}
                    onChange={handleOrderChange}
                  />
                  {orderErrors.city && <span className="field-error">{orderErrors.city}</span>}
                </label>
                <label>
                  Address
                  <input
                    type="text"
                    name="address"
                    value={orderForm.address}
                    onChange={handleOrderChange}
                  />
                  {orderErrors.address && (
                    <span className="field-error">{orderErrors.address}</span>
                  )}
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={orderForm.email}
                    onChange={handleOrderChange}
                  />
                  {orderErrors.email && <span className="field-error">{orderErrors.email}</span>}
                </label>
                <label>
                  Age
                  <input
                    type="number"
                    name="age"
                    value={orderForm.age}
                    onChange={handleOrderChange}
                  />
                  {orderErrors.age && <span className="field-error">{orderErrors.age}</span>}
                </label>
                <button className="btn btn-primary" type="submit">
                  Place Order
                </button>
              </form>
              <div className="order-summary">
                <h3>Order Summary</h3>
                <p className="muted">
                  We will confirm your order and share delivery timelines within 24 hours.
                </p>
                <div className="summary-item">
                  <span>Selected Product</span>
                  <strong>{orderForm.product}</strong>
                </div>
                <div className="summary-item">
                  <span>Quantity</span>
                  <strong>{orderForm.quantity || 1}</strong>
                </div>
                <div className="summary-item">
                  <span>Concierge Support</span>
                  <strong>concierge@mfco.com</strong>
                </div>
                <p className="muted">
                  Want to track orders? Create an account and your order history will appear in
                  your profile.
                </p>
              </div>
            </div>
          </section>

          <section id="contact" className="section contact">
            <div>
              <h2>Contact Us</h2>
              <p className="lead">Visit the atelier or schedule a private consultation.</p>
              <div className="contact-card">
                <p>Studio hours: Mon - Sat, 10am - 7pm</p>
                <p>Address: 48 Noir Avenue, Suite 9, Los Angeles</p>
                <p>Email: concierge@mfco.com</p>
                <p>Phone: +1 (323) 555-0194</p>
              </div>
            </div>
            <form className="contact-form">
              <label>
                Full name
                <input type="text" name="name" placeholder="Your name" />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="you@email.com" />
              </label>
              <label>
                Message
                <textarea name="message" rows="4" placeholder="Tell us about the mood you want to capture." />
              </label>
              <button className="btn btn-primary" type="submit">
                Send Request
              </button>
            </form>
          </section>
        </main>
      )}

      <footer className="site-footer">
        <p>MF.CO © 2026. Crafted in black, designed for presence.</p>
      </footer>
    </div>
  );
}

export default App;
