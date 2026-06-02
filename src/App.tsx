import React, { useState, useEffect, useMemo } from 'react';
import { 
  Laptop, Search, ShoppingCart, User as UserIcon, Heart, Moon, Sun, 
  ChevronRight, Bookmark, Star, ArrowRight, Check, X, Mail, Phone, MapPin, 
  Send, HelpCircle, ShieldCheck, Languages, Handshake, ChevronDown, RefreshCw, 
  FileText, LogIn, UserPlus, Info, Compass, ClipboardList, AlertCircle, ShoppingBag, Truck
} from 'lucide-react';

import { Product, CartItem, Order, User, Coupon, Currency, Language } from './types';
import { formatCurrency, translations } from './localization';
import ProductCard from './components/ProductCard';
import CompareDrawer from './components/CompareDrawer';
import LiveChat from './components/LiveChat';
import ShopFilter from './components/ShopFilter';
import CheckoutForm from './components/CheckoutForm';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Localization and System Config
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  // Navigation Routing States
  // 'home' | 'shop' | 'about' | 'contact' | 'checkout' | 'auth' | 'dashboard' | 'admin'
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Product Database core State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Search & Filter state for Shop
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState(4000);
  const [selectedRam, setSelectedRam] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedProcessor, setSelectedProcessor] = useState('');
  const [selectedGraphics, setSelectedGraphics] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Interactive cart, wishlist, recently viewed, and comparisons
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isCompareVisible, setIsCompareVisible] = useState(false);

  // Authentication States
  const [authToken, setAuthToken] = useState<string>(localStorage.getItem('tech_laptop_token') || '');
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState('');

  // Contact Us state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Selected dynamic configuration parameters inside product detail page
  const [detailSelectedRam, setDetailSelectedRam] = useState<string>('');
  const [detailSelectedStorage, setDetailSelectedStorage] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSavingReview, setIsSavingReview] = useState(false);

  // Load products catalog
  const loadCatalog = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Connectivity issue fetching inventory catalog list", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch logged in profile details
  const fetchMyProfile = async (token: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const user = await res.json();
        setUserProfile(user);
      } else {
        // Clear expired token
        handleLogout();
      }
    } catch {
      console.error("Token verification offline.");
    }
  };

  useEffect(() => {
    loadCatalog();
    if (authToken) {
      fetchMyProfile(authToken);
    }
  }, [authToken]);

  // Sync dark/light class
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  // Local storage cart recovery
  useEffect(() => {
    const savedCart = localStorage.getItem('tech_laptop_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Cart retrieval fail", err);
      }
    }
  }, []);

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('tech_laptop_cart', JSON.stringify(updatedCart));
  };


  // -------------------------------------------------------------
  // E-COMMERCE CORE FUNCTIONS
  // -------------------------------------------------------------

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id &&
      (!detailSelectedRam || item.selectedSpecs?.ram === detailSelectedRam) &&
      (!detailSelectedStorage || item.selectedSpecs?.storage === detailSelectedStorage)
    );

    const specsToAttach = {
      ram: detailSelectedRam || product.specs.ram,
      storage: detailSelectedStorage || product.specs.storage
    };

    if (existingIndex > -1) {
      const copy = [...cart];
      copy[existingIndex].quantity += quantity;
      saveCartToStorage(copy);
    } else {
      const finalPriceAdjustment = getPriceAdjustment(product, specsToAttach.ram, specsToAttach.storage);
      const modifiedPriceProduct = { ...product, price: finalPriceAdjustment };
      saveCartToStorage([...cart, { product: modifiedPriceProduct, quantity, selectedSpecs: specsToAttach }]);
    }

    // Trigger visual sidebar notification
    setIsCartOpen(true);
  };

  const getPriceAdjustment = (product: Product, ram: string, storage: string) => {
    let basePrice = product.price;
    // Simple custom variations modifier
    if (ram.includes('32GB') || ram.includes('48GB')) basePrice += 150;
    if (storage.includes('1TB')) basePrice += 100;
    if (storage.includes('2TB')) basePrice += 250;
    return basePrice;
  };

  const handleUpdateCartQty = (idx: number, change: number) => {
    const copy = [...cart];
    copy[idx].quantity += change;
    if (copy[idx].quantity <= 0) {
      copy.splice(idx, 1);
    }
    saveCartToStorage(copy);
  };

  const handleRemoveCartItem = (idx: number) => {
    const copy = [...cart];
    copy.splice(idx, 1);
    saveCartToStorage(copy);
  };

  const handleBuyNow = (product: Product) => {
    // Adds to cart, then redirects to checkout page
    handleAddToCart(product, 1);
    if (!authToken) {
      // Force Login/Register before checkout
      setCurrentTab('auth');
    } else {
      setCurrentTab('checkout');
    }
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some(p => p.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(p => p.id !== product.id));
    } else {
      setWishlist(prev => [...prev, product]);
    }
  };

  // Click on a product details popup/view
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setDetailSelectedRam(product.specs.ram);
    setDetailSelectedStorage(product.specs.storage);
    setReviewComment('');
    setReviewRating(5);
    
    // Append to recently viewed list
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 5); // Max 5 items tracked
    });
  };

  // Comparisons drawer controllers
  const handleToggleCompare = (product: Product) => {
    const exists = comparedProducts.some(p => p.id === product.id);
    if (exists) {
      setComparedProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      if (comparedProducts.length >= 3) {
        alert('You can only compare a maximum of 3 laptops at once.');
        return;
      }
      setComparedProducts(prev => [...prev, product]);
      setIsCompareVisible(true);
    }
  };

  // Auth logins
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail || !authPassword) return;

    try {
      const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
      const bodyArgs = isRegisterMode ? { name: authName, email: authEmail, password: authPassword } : { email: authEmail, password: authPassword };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyArgs)
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.message || 'Authentication failed. Please verify conditions.');
      } else {
        localStorage.setItem('tech_laptop_token', data.token);
        setAuthToken(data.token);
        setUserProfile(data.user);
        
        // Return back to home or checkout depending on cart
        if (cart.length > 0) {
          setCurrentTab('checkout');
        } else {
          setCurrentTab('dashboard');
        }
        
        // Reset forms
        setAuthEmail('');
        setAuthPassword('');
        setAuthName('');
      }
    } catch (err) {
      setAuthError('Express API server offline.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tech_laptop_token');
    setAuthToken('');
    setUserProfile(null);
    setCurrentTab('home');
  };

  const handleProfileFieldChange = async (fieldsToUpdate: any) => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(fieldsToUpdate)
      });
      if (res.ok) {
        const updated = await res.json();
        setUserProfile(updated);
        alert('Billing credentials updated successfully!');
      }
    } catch (err) {
      alert('Failed syncing with backend profile parameters.');
    }
  };

  // Place actual order with server endpoint
  const handleExecutePayment = async (shippingAddress: any, paymentMethod: string, appliedCoupon: Coupon | null, discountAmount: number) => {
    if (!authToken) {
      alert('Please sign into your TechLatop account to proceed.');
      setCurrentTab('auth');
      return;
    }

    const orderPayload = {
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0]
      })),
      subtotal: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      discount: discountAmount,
      total: Math.max(0, cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) - discountAmount),
      shippingAddress,
      paymentMethod
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(orderPayload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Server rejected order transaction.');
    }

    // Success! Clear cart from memory and state
    saveCartToStorage([]);
    return data;
  };

  // Submit product reviews
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) {
      alert('Please log in online to post customer feedback.');
      setCurrentTab('auth');
      setSelectedProduct(null);
      return;
    }

    if (!selectedProduct) return;
    setIsSavingReview(true);

    try {
      const res = await fetch(`/api/products/${selectedProduct.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });

      if (res.ok) {
        const bodyObj = await res.json();
        // Update product in store locally on client
        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? bodyObj.product : p));
        // Update active selection
        setSelectedProduct(bodyObj.product);
        setReviewComment('');
        alert('Review published successfully!');
      } else {
        alert('Failed saving feedback.');
      }
    } catch {
      alert('Review server offline.');
    } finally {
      setIsSavingReview(false);
    }
  };

  // Main system filters computation
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search Box matcher
      const matchesSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.specs.processor.toLowerCase().includes(searchQuery.toLowerCase());

      // Brand filter matcher
      const matchesBrand = selectedBrand === '' || p.brand.toLowerCase() === selectedBrand.toLowerCase();

      // Max price filter (checks USD equivalent)
      const matchesPrice = p.price <= maxPrice;

      // RAM specs check
      const matchesRam = selectedRam === '' || p.specs.ram.toLowerCase().includes(selectedRam.toLowerCase());

      // Storage capacity check
      const matchesStorage = selectedStorage === '' || p.specs.storage.toLowerCase().includes(selectedStorage.toLowerCase());

      // Processor type check
      const matchesProcessor = selectedProcessor === '' || p.specs.processor.toLowerCase().includes(selectedProcessor.toLowerCase());

      // GPU graphics card checks
      const matchesGraphics = selectedGraphics === '' || p.specs.graphics.toLowerCase().includes(selectedGraphics.toLowerCase());

      return matchesSearch && matchesBrand && matchesPrice && matchesRam && matchesStorage && matchesProcessor && matchesGraphics;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'bestsellers') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return b.id.localeCompare(a.id); // Newest / Default
    });
  }, [products, searchQuery, selectedBrand, maxPrice, selectedRam, selectedStorage, selectedProcessor, selectedGraphics, sortBy]);

  // Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  const totalItemsInCart = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Frequently bought/Related items picker based on active selected product brand/category
  const relatedRecommendations = useMemo(() => {
    if (!selectedProduct) return [];
    return products
      .filter(p => p.id !== selectedProduct.id && (p.brand === selectedProduct.brand || p.category === selectedProduct.category))
      .slice(0, 4);
  }, [products, selectedProduct]);

  // Quick helper parameters for pre-filling simulation modes
  const handleQuickCredentialFill = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setAuthEmail('admin@techlaptop.com');
      setAuthPassword('admin123');
      setIsRegisterMode(false);
    } else {
      setAuthEmail('customer@test.com');
      setAuthPassword('user123');
      setIsRegisterMode(false);
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setMaxPrice(4000);
    setSelectedRam('');
    setSelectedStorage('');
    setSelectedProcessor('');
    setSelectedGraphics('');
    setSortBy('newest');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail && contactMsg) {
      setContactSuccess('Your message has been safely logged with support! An agent will respond back directly via your email.');
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }
  };

  const activeTranslation = translations[language];

  return (
    <div id="tech-laptop-app-root" className={`min-h-screen font-sans flex flex-col bg-neutral-50 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-50`}>
      
      {/* -------------------------------------------------------------
          HEADER & CONSOLE BAR 
          ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/90 backdrop-blur-md dark:border-neutral-900 dark:bg-neutral-950/95 transition-colors duration-200">
        
        {/* UPPER ANNOUNCEMENT BAR */}
        <div className="bg-orange-600 px-4 py-2 text-center text-[11px] font-bold tracking-widest text-white uppercase flex items-center justify-between">
          <div className="hidden sm:block">⚡ TechLaptop Summer Flash Sale - Save up to $300 on Premium Workstations today!</div>
          <div className="mx-auto sm:mx-0 flex items-center gap-4 text-orange-100">
            {/* Currency toggle */}
            <div className="flex gap-1.5 items-center">
              <RefreshCw className="h-3 w-3" />
              {['USD', 'EUR', 'VND'].map(cur => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur as any)}
                  className={`hover:text-white transition-colors cursor-pointer text-[10px] ${currency === cur ? 'text-white font-black underline underline-offset-2' : ''}`}
                >
                  {cur}
                </button>
              ))}
            </div>
            {/* Language toggle */}
            <div className="flex gap-1.5 items-center border-l border-white/20 pl-4">
              <Languages className="h-3 w-3" />
              {['en', 'es', 'vi'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as any)}
                  className={`hover:text-white transition-colors cursor-pointer text-[10px] uppercase ${language === lang ? 'text-white font-black underline underline-offset-2' : ''}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN NAVIGATION BAR */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          
          {/* STORE LOGO */}
          <div 
            onClick={() => { setCurrentTab('home'); resetAllFilters(); }}
            className="flex cursor-pointer items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-650 text-white shadow-md shadow-orange-500/10">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display text-base font-black tracking-tight text-neutral-900 dark:text-white block">TechLaptop</span>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block leading-none">Store HQ</span>
            </div>
          </div>

          {/* PERSISTENT TEXT NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {[
              { id: 'home', label: 'Home Page' },
              { id: 'shop', label: 'Shop Center' },
              { id: 'about', label: 'About Us' },
              { id: 'contact', label: 'Contact Us' }
            ].map(link => (
              <button
                key={link.id}
                onClick={() => { setCurrentTab(link.id); }}
                className={`hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer ${
                  currentTab === link.id ? 'text-orange-655 dark:text-orange-400 font-black' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* USER & CART ICONS & ACTIONS */}
          <div className="flex items-center gap-3">
            
            {/* Dark & light custom toggle */}
            <button
              onClick={() => setThemeMode(prev => prev === 'light' ? 'dark' : 'light')}
              className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-905 dark:hover:bg-neutral-900 dark:hover:text-white"
            >
              {themeMode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Compared counts indicator if any */}
            {comparedProducts.length > 0 && (
              <button
                onClick={() => setIsCompareVisible(true)}
                className="hidden sm:flex items-center gap-1 text-xs rounded-lg border border-orange-200 px-3 py-1.5 font-bold text-orange-655 bg-orange-50/30 text-[10px]"
              >
                <span>Compare ({comparedProducts.length})</span>
              </button>
            )}

            {/* Auth / Dash logic */}
            {authToken && userProfile ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentTab(userProfile.isAdmin ? 'admin' : 'dashboard')}
                  className="flex items-center gap-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 px-3.5 py-1.5 text-xs font-bold hover:text-orange-600 dark:hover:text-orange-400"
                >
                  <UserIcon className="h-3.5 w-3.5 text-orange-500" />
                  <span className="hidden sm:inline max-w-[90px] truncate">{userProfile.name}</span>
                </button>
                {userProfile.isAdmin && (
                  <span className="rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 text-[8.5px] px-1.5 py-0.5 font-black uppercase">ADMIN</span>
                )}
                <button
                  onClick={handleLogout}
                  className="text-[10px] font-semibold text-neutral-400 hover:text-neutral-900 dark:hover:text-white ml-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab('auth')}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 px-3.5 py-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Log In</span>
              </button>
            )}

            {/* SHOPPING CART TRIGGER */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-orange-650 hover:bg-orange-700 text-white shadow-md shadow-orange-500/10"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItemsInCart > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-[10px] font-black text-white dark:bg-white dark:text-neutral-950 animate-bounce">
                  {totalItemsInCart}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* QUICK COMPACT TAB WRAPPERS FOR MOBILE */}
        <div className="md:hidden flex items-center justify-around border-t py-2 bg-neutral-50/50 dark:bg-neutral-950/40 text-[11px] font-bold text-neutral-400 border-neutral-100 dark:border-neutral-900">
          {[
            { id: 'home', label: 'Home' },
            { id: 'shop', label: 'Shop Laptops' },
            { id: 'about', label: 'About Us' },
            { id: 'contact', label: 'Contact Us' }
          ].map(lnk => (
            <button
              key={lnk.id}
              onClick={() => setCurrentTab(lnk.id)}
              className={`${currentTab === lnk.id ? 'text-orange-500 font-extrabold' : 'hover:text-neutral-900'}`}
            >
              {lnk.label}
            </button>
          ))}
        </div>
      </header>

      {/* -------------------------------------------------------------
          MAIN ROUTED CONTENT ZONE
          ------------------------------------------------------------- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6">
        
        {/* =========================================================
            HOME PAGE ROUTE
            ========================================================= */}
        {currentTab === 'home' && (
          <div className="flex flex-col gap-12 sm:gap-16">
            
            {/* HERO BANNER promo */}
            <section id="hero-banner-promo" className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white shadow-2xl">
              <div className="absolute inset-0 bg-neutral-900/60 z-10"></div>
              {/* Image in backdrop */}
              <img
                src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1600&q=80"
                alt="Tech Workstations backdrop"
                className="absolute inset-0 h-full w-full object-cover opacity-35"
                referrerPolicy="no-referrer"
              />

              <div className="relative z-20 flex flex-col items-start gap-5 px-6 py-12 sm:px-12 sm:py-24 max-w-3xl">
                <span className="rounded-full bg-orange-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest animate-pulse">
                  2026 EDITION PRO LAPTOPS
                </span>
                
                <h1 className="font-display text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
                  {activeTranslation.heroTitle}
                </h1>
                
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                  {activeTranslation.heroSub}
                </p>

                <div className="flex flex-wrap gap-3.5 mt-2">
                  <button
                    onClick={() => setCurrentTab('shop')}
                    className="group rounded-xl bg-orange-650 hover:bg-orange-700 text-white font-extrabold text-xs py-3.5 px-6 transition-all shadow-lg hover:shadow-orange-500/20 flex items-center gap-2"
                  >
                    <span>{activeTranslation.shopNow || 'Shop Laptops'}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button
                    onClick={() => { setSelectedBrand('Apple'); setCurrentTab('shop'); }}
                    className="rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs py-3.5 px-5 transition-all"
                  >
                    Apple Silicon Workstations
                  </button>
                </div>
              </div>
            </section>

            {/* SEPARATE CORE LAPTOPS CATEGORIES ROW */}
            <section id="bento-laptop-categories" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { cat: 'Premium', desc: activeTranslation.categoryPremium, bg: 'bg-rose-50/40 border-rose-100 dark:bg-rose-950/10 dark:border-rose-950' },
                { cat: 'Gaming', desc: activeTranslation.categoryGaming, bg: 'bg-emerald-50/40 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-950' },
                { cat: 'Business', desc: activeTranslation.categoryBusiness, bg: 'bg-sky-50/40 border-sky-100 dark:bg-sky-950/10 dark:border-sky-950' },
                { cat: 'Student', desc: activeTranslation.categoryStudent, bg: 'bg-amber-50/40 border-amber-100 dark:bg-amber-950/10 dark:border-amber-950' }
              ].map(tag => (
                <div 
                  key={tag.cat}
                  onClick={() => { resetAllFilters(); setSortBy('newest'); // Find categories
                    const matchedCat = products.some(p => p.category === tag.cat);
                    if (matchedCat) {
                      // Adjust filters state
                      setSearchQuery(tag.cat);
                    }
                    setCurrentTab('shop');
                  }}
                  className={`rounded-2xl border p-5 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900 flex justify-between items-center ${tag.bg}`}
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-neutral-900 dark:text-white">{tag.cat} Range</h4>
                    <p className="text-xs text-neutral-400 mt-1">{tag.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
                </div>
              ))}
            </section>

            {/* EXPLORE RECENT ARRIVALS & FEATURED COLLECTIONS GRID */}
            <section id="homepage-featured-products" className="flex flex-col gap-6">
              <div className="flex items-baseline justify-between border-b pb-3 border-neutral-100 dark:border-neutral-900">
                <div className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-orange-600" />
                  <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    Superb Feature Rig Choices
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentTab('shop')}
                  className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  View full shop catalog <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {isLoadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-850 h-80"></div>
                  ))}
                </div>
              ) : (
                <div id="featured-products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.slice(0, 4).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      currency={currency}
                      language={language}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                      onSelect={handleSelectProduct}
                      onToggleCompare={handleToggleCompare}
                      isCompared={comparedProducts.some(p => p.id === prod.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* RECENT BESTSELLERS WITH EXTRA GRAPHICAL SHOWCASE */}
            <section id="homepage-bestseller-banners" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-92 bg-neutral-100 dark:bg-neutral-900/30 rounded-3xl p-6 sm:p-10 border dark:border-neutral-850">
              <div className="lg:col-span-7 flex flex-col gap-4">
                <span className="rounded-full bg-amber-500/10 text-amber-500 w-36 px-3 py-1 font-black text-[9px] tracking-widest text-center uppercase">★ GOLD MEDAL GRADE</span>
                <h3 className="font-display text-2xl sm:text-3.5xl font-black text-neutral-900 dark:text-white leading-tight">
                  Best Selling Pro: Dell XPS 15 InfinityEdge OLED
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-normal">
                  Highly acclaimed as the finest display laptop ever built. Features aeronautical grade CNC chassis, a spectacular 3.5K Infinite touchscreen with 100% sRGB color gamut, and RTX 4050 graphics speed. Optimized for engineers, programmers and professional writers alike.
                </p>
                <div className="flex gap-4 items-center mt-2.5">
                  <div className="text-2xl font-black text-neutral-900 dark:text-white">$1,999</div>
                  <button
                    onClick={() => {
                      const xpsObj = products.find(p => p.id === 'p5');
                      if (xpsObj) {
                        handleBuyNow(xpsObj);
                      } else {
                        setCurrentTab('shop');
                      }
                    }}
                    className="rounded-xl bg-neutral-950 text-white font-extrabold hover:bg-neutral-850 text-xs py-3 px-6 transition-all shrink-0"
                  >
                    Acquire Dell XPS Now
                  </button>
                </div>
              </div>
              <div className="lg:col-span-5">
                <img
                  src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=700&q=80"
                  alt="Dell XPS display"
                  className="rounded-2xl shadow-lg object-cover h-60 w-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </section>

            {/* FAQ ACCORDION COLLAPSIBLE ELEMENT */}
            <section id="homepage-faq-accordions" className="flex flex-col gap-6">
              <div className="text-center">
                <span className="text-[10px] uppercase font-black tracking-widest text-orange-600">COMMON CONCERNS</span>
                <h2 className="font-display text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">Frequently Asked Questions FAQ</h2>
              </div>

              <div className="max-w-3xl mx-auto flex flex-col gap-3.5 w-full">
                {[
                  { q: 'Is worldwide express shipping free?', a: 'Yes! We support completely free Express global shipping on all laptops cataloged in our shop. Deliveries typically arrive within 3-5 business days.' },
                  { q: 'Do all laptops include valid brand warranties?', a: 'Absolutely. Every single laptop model sold through our platform is backed by a authentic 2-year manufacturer warranty protecting hardware components.' },
                  { q: 'How does your laptop comparison drawer work?', a: 'Simply hover over any laptop card and press the comparative arrow icon in the corner! This will add up to 3 laptops to your side-by-side spec comparison drawer.' },
                  { q: 'Can I cancel or change my order status?', a: 'Yes, regular users can cancel any order that is currently in Pending state directly through their Client Dashboard in 1-click. Our administrators can update shipped and delivery logs.' }
                ].map((faq, i) => (
                  <details key={i} className="group rounded-2xl border bg-white dark:bg-neutral-900/20 p-4 dark:border-neutral-800 cursor-pointer">
                    <summary className="flex font-semibold text-xs leading-none justify-between items-center text-neutral-900 dark:text-neutral-100 select-none">
                      <span className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-orange-500 shrink-0" /> {faq.q}</span>
                      <ChevronDown className="h-4 w-4 text-neutral-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="mt-3.5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed border-t pt-3.5">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            {/* CUSTOMER TESTIMONIAL CARDS */}
            <section id="testimonials-carousel" className="flex flex-col gap-6 bg-neutral-900 text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden">
              <div className="text-center relative z-20">
                <span className="text-[9px] uppercase font-black tracking-widest text-orange-500">EXPERIENCED REVIEWS</span>
                <h3 className="font-display text-xl sm:text-2.5xl font-black mt-1">What Tech Buyers are Saying</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 relative z-20">
                {[
                  { name: 'Dr. Marcus Vance', role: 'Full-Stack Lead Architect', feedback: 'TechLaptop provided the seamless dual-screen ZenBook flawlessly. It compiled 40,000 lines of Node/TS in record speed without throttling. A brilliant merchant platform.', rating: 5 },
                  { name: 'Samantha Reyes', role: 'UX/UI Content Specialist', feedback: 'The Apple M3 Max arrived in gorgeous original packaging complete with full hardware logs. The Liquid Retina screen is breathtaking for design wireframes. 10/10.', rating: 5 },
                  { name: 'Kevin Nguyen', role: 'Competitive Game streamer', feedback: 'Managed to pick up the Blade 16 on a seasonal deal using promotional coupon CODES. Smooth RTX gameplay on QHD mini-LED. Outstanding customer support agent interaction.', rating: 5 }
                ].map((testi, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3.5">
                    <div className="flex text-amber-400">
                      {[...Array(testi.rating)].map((_, starId) => (
                        <Star key={starId} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-305 text-neutral-300 italic leading-relaxed">
                      "{testi.feedback}"
                    </p>
                    <div className="mt-auto border-t border-white/10 pt-3 flex flex-col">
                      <span className="font-bold text-xs text-white">{testi.name}</span>
                      <span className="text-[10px] text-neutral-400">{testi.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* NEWSLETTER SUBSCRIPTION COMPONENT */}
            <section id="newsletter-form-section" className="rounded-3xl border border-neutral-100 bg-white p-8 sm:p-12 text-center dark:border-neutral-850 dark:bg-neutral-900/40 relative">
              <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
                <div className="bg-orange-100 dark:bg-orange-950/40 h-10 w-10 flex items-center justify-center rounded-xl text-orange-650 mb-2">
                  <Mail className="h-5 w-5" />
                </div>
                
                <h3 className="font-display text-xl sm:text-2.5xl font-black text-neutral-900 dark:text-white leading-tight">
                  {activeTranslation.newsletterTitle}
                </h3>
                
                <p className="text-xs text-neutral-500 max-w-lg leading-relaxed">
                  {activeTranslation.newsletterSub}
                </p>

                {newsletterSubscribed ? (
                  <div className="rounded-xl bg-orange-50 px-6 py-3.5 text-xs font-semibold text-orange-655 border border-orange-100 flex items-center gap-1.5 dark:bg-orange-950/20 dark:border-orange-950">
                    <Check className="h-4 w-4" /> Recommended! You are now subscribed to seasonal launch updates. Check your inbox for custom promo codes!
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full max-w-md mt-2">
                    <input
                      type="email"
                      required
                      placeholder="address@email.com"
                      value={newsletterEmail}
                      onChange={e => setNewsletterEmail(e.target.value)}
                      className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-850 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-orange-600 text-white font-extrabold hover:bg-orange-700 text-xs px-5 py-2.5 transition-all"
                    >
                      {activeTranslation.subscribe || 'Subscribe'}
                    </button>
                  </form>
                )}
              </div>
            </section>

          </div>
        )}

        {/* =========================================================
            SHOP PRODUCTS GALLERY ROUTE
            ========================================================= */}
        {currentTab === 'shop' && (
          <div className="flex flex-col gap-6">
            
            {/* Upper Search Bar & Metrics counts */}
            <div id="shop-actions-header-row" className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b pb-4 border-neutral-105 dark:border-neutral-900">
              <div>
                <h2 className="font-display text-lg sm:text-2xl font-black text-neutral-905 dark:text-white">Laptop Explorer Shop</h2>
                <p className="text-xs text-neutral-400 mt-1">Available configurations: <span className="font-bold text-orange-600">{filteredProducts.length} models matched</span></p>
              </div>

              {/* SEARCH BOX ENTRIES */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder={activeTranslation.searchPlaceholder}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-xs text-neutral-800 focus:border-orange-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white shadow-xs"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-[10px] text-neutral-450 hover:text-neutral-900 font-bold">Clear</button>
                )}
              </div>
            </div>

            {/* MAIN TWO COLUMN FILTERS LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* FILTERS PANEL COLS */}
              <div className="lg:col-span-3">
                <ShopFilter
                  language={language}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  selectedRam={selectedRam}
                  setSelectedRam={setSelectedRam}
                  selectedStorage={selectedStorage}
                  setSelectedStorage={setSelectedStorage}
                  selectedProcessor={selectedProcessor}
                  setSelectedProcessor={setSelectedProcessor}
                  selectedGraphics={selectedGraphics}
                  setSelectedGraphics={setSelectedGraphics}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onReset={resetAllFilters}
                />
              </div>

              {/* PRODUCTS GALLERY COLS */}
              <div className="lg:col-span-9">
                {isLoadingProducts ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-850 h-80"></div>
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center rounded-2xl border-2 border-dashed p-16 text-neutral-400 dark:border-neutral-850">
                    <AlertCircle className="h-10 w-10 text-neutral-300 mx-auto mb-3 animate-bounce" />
                    <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">No matching laptops cataloged</h3>
                    <p className="text-xs mt-1 max-w-sm mx-auto">Try widening your price range parameters, removing secondary storage exclusions, or selecting different graphics chips.</p>
                    <button
                      onClick={resetAllFilters}
                      className="mt-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-5 py-2 transition-all shadow-sm"
                    >
                      Reset and see all laptops
                    </button>
                  </div>
                ) : (
                  <div id="shop-paginated-products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(prod => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        currency={currency}
                        language={language}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onSelect={handleSelectProduct}
                        onToggleCompare={handleToggleCompare}
                        isCompared={comparedProducts.some(p => p.id === prod.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* =========================================================
            ABOUT US PAGE ROUTE
            ========================================================= */}
        {currentTab === 'about' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-10 py-4">
            <div className="text-center">
              <span className="text-[10px] uppercase font-black tracking-widest text-orange-600">WHO WE ARE</span>
              <h2 className="font-display text-2xl sm:text-3.5xl font-black mt-1 text-neutral-900 dark:text-white">Our Heritage in Solid State Computings</h2>
            </div>

            <div className="relative rounded-3xl overflow-hidden h-72">
              <div className="absolute inset-0 bg-neutral-950/60 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80"
                alt="Silicon work lab"
                className="absolute inset-0 h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="relative z-20 flex h-full items-end p-8 text-white max-w-xl">
                <p className="text-sm font-semibold tracking-wide uppercase text-orange-200">A dynamic catalog built upon meticulous custom specs testing since 2018.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-neutral-600 dark:text-neutral-400 leading-relaxed text-xs">
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-base font-bold text-neutral-900 dark:text-white">The TechLaptop Standard</h3>
                <p>Welcome to TechLaptop Store, where computing efficiency is treated as a craft. We believe a laptop is not merely a tool, but an extension of your ideas. Whether you write compile-heavy code, edit multi-track 4K cinematography, or dominate competitive leaderboards, a single frame or second of lag is unacceptable.</p>
                <p>We source our products directly from top-tier silicon developers. Our testing laboratory evaluates each product for thermal dissipation thresholds, key travel tactility, and actual screen lumens, which are logged transparently in our database specs.</p>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="font-display text-base font-bold text-neutral-900 dark:text-white">Why Professionals Choose Us</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2.5 items-start">
                    <div className="rounded-full bg-green-150 p-1 text-green-700 mt-0.5"><Check className="h-3.5 w-3.5" /></div>
                    <div><span className="font-bold text-neutral-800 dark:text-neutral-250 block">Zero Thermal Bottlenecks</span> Laptop models cataloged are engineered to sustain operations without processor throttling.</div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <div className="rounded-full bg-green-150 p-1 text-green-700 mt-0.5"><Check className="h-3.5 w-3.5" /></div>
                    <div><span className="font-bold text-neutral-800 dark:text-neutral-250 block">Meticulous Specs Logging</span> Every SSD speed parameter is tested. Zero marketing hyperbole.</div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <div className="rounded-full bg-green-150 p-1 text-green-700 mt-0.5"><Check className="h-3.5 w-3.5" /></div>
                    <div><span className="font-bold text-neutral-800 dark:text-neutral-250 block">Safe Express Logistics</span> Direct secure transit from our climate-controlled facilities.</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================
            CONTACT US PAGE ROUTE
            ========================================================= */}
        {currentTab === 'contact' && (
          <div className="max-w-5xl mx-auto py-4 flex flex-col gap-8">
            <div className="text-center">
              <span className="text-[10px] uppercase font-black tracking-widest text-orange-600">GLOBAL OPERATIONS</span>
              <h2 className="font-display text-2xl sm:text-3.5xl font-black mt-1 text-neutral-900 dark:text-white">Interact With Support</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* CONTACT FORM */}
              <form onSubmit={handleContactSubmit} className="lg:col-span-7 rounded-2xl border bg-white p-6 shadow-xs dark:bg-neutral-900/40 dark:border-neutral-850 flex flex-col gap-4">
                <h3 className="font-display text-base font-bold text-neutral-900 dark:text-white">Transmit Message</h3>
                
                {contactSuccess && (
                  <div className="p-3.5 rounded-xl bg-green-50 border border-green-150 text-xs font-semibold text-green-700 dark:bg-green-950/20 dark:border-green-950">
                    {contactSuccess}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-405 text-neutral-550 uppercase mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      className="w-full rounded-xl border px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-orange-500 dark:bg-neutral-950 dark:border-neutral-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-405 text-neutral-550 uppercase mb-1">E-mail Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="address@domain.com"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      className="w-full rounded-xl border px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-orange-500 dark:bg-neutral-950 dark:border-neutral-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-405 text-neutral-550 uppercase mb-1">Detailed Inquiry *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter details regarding laptop order customization, business bulk procurement quotes..."
                    value={contactMsg}
                    onChange={e => setContactMsg(e.target.value)}
                    className="w-full rounded-xl border px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-orange-500 dark:bg-neutral-950 dark:border-neutral-800 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs py-2.5 px-6 transition-all self-end flex items-center gap-2"
                >
                  <Send className="h-4 w-4" /> Transmit Message
                </button>
              </form>

              {/* SIDE INFO */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                <div className="rounded-2xl border bg-white p-6 dark:bg-neutral-900/30 dark:border-neutral-80s">
                  <h4 className="font-display text-sm font-bold text-neutral-900 dark:text-white mb-4">Immediate Operational Contacts</h4>
                  <div className="flex flex-col gap-4 text-xs">
                    <div className="flex gap-3 items-center">
                      <Phone className="h-4 w-4 text-orange-550 text-orange-500 shrink-0" />
                      <div>
                        <span className="text-neutral-400 block font-semibold">Toll-Free Helpline</span>
                        <span className="font-bold text-neutral-900 dark:text-white">+1 (800) LAP-CORES</span>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center border-t pt-3">
                      <Mail className="h-4 w-4 text-orange-550 text-orange-500 shrink-0" />
                      <div>
                        <span className="text-neutral-400 block font-semibold">Sales Support Email</span>
                        <span className="font-bold text-neutral-900 dark:text-white">procurement@techlaptop.com</span>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center border-t pt-3">
                      <MapPin className="h-4 w-4 text-orange-550 text-orange-500 shrink-0" />
                      <div>
                        <span className="text-neutral-400 block font-semibold">Warehouse headquarters</span>
                        <span className="font-bold text-neutral-900 dark:text-white">100 Silicon Blvd, San Jose, California USA</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-6 bg-orange-50 border border-orange-100 flex items-start gap-3 text-xs text-orange-950 dark:bg-orange-950/20 dark:border-orange-950">
                  <Handshake className="h-5 w-5 text-orange-620 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Consolidated Business Fleet Quotes</span>
                    Are you procurement head for a technology startup or educational campus? We formulate custom pricing for consolidated laptop orders. Transmit details for immediate dispatch.
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* =========================================================
            CHECKOUT ROUTE (SECURE OR INTERMEDIATE)
            ========================================================= */}
        {currentTab === 'checkout' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">Secure E-Commerce Checkout</h2>
              <p className="text-xs text-neutral-400 mt-1">Review your parameters and confirm shipping address destination details.</p>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border-2 border-dashed border-neutral-100 dark:border-neutral-850">
                <ShoppingBag className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                <h3 className="font-bold text-neutral-800 dark:text-neutral-200">Checkout is currently locked</h3>
                <p className="text-xs text-neutral-400 mt-1">Please select laptop configurations in our shop and add then to your active cart first.</p>
                <button
                  onClick={() => setCurrentTab('shop')}
                  className="mt-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2 transition-all shadow-sm"
                >
                  Browse Shop Catalog
                </button>
              </div>
            ) : (
              <CheckoutForm
                cart={cart}
                currency={currency}
                language={language}
                onPlaceOrder={handleExecutePayment}
                userProfile={userProfile}
                onBackToCart={() => { setIsCartOpen(true); }}
              />
            )}
          </div>
        )}

        {/* =========================================================
            USER DASHBOARD & HISTORY STATE LOGS
            ========================================================= */}
        {currentTab === 'dashboard' && userProfile && (
          <div id="user-dashboard-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4">
            
            {/* PROFILE DETAILS CONTROL FORM (3 COLS) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              <div className="rounded-2xl border bg-white p-5 dark:bg-neutral-900/40 dark:border-neutral-850">
                <div className="text-center border-b pb-4 mb-4">
                  <div className="mx-auto mb-2.5 h-14 w-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xl uppercase tracking-wider dark:bg-orange-950/40">
                    {userProfile.name.charAt(0)}
                  </div>
                  <h3 className="font-display font-black text-neutral-900 dark:text-white leading-tight">{userProfile.name}</h3>
                  <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-widest font-semibold">{userProfile.email}</p>
                </div>

                <div className="flex flex-col gap-3 text-xs">
                  <div>
                    <span className="text-neutral-400 text-[10px] uppercase font-bold block mb-0.5">Telephone Connection</span>
                    <span className="font-bold text-neutral-800 dark:text-white block">{userProfile.phone || 'Not recorded'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-[10px] uppercase font-bold block mb-0.5">Default Shipping Destination</span>
                    <span className="font-bold text-neutral-800 dark:text-white block">{userProfile.address || 'Not recorded'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-[10px] uppercase font-bold block mb-0.5">Joined Portal Since</span>
                    <span className="font-semibold text-neutral-500 block">{userProfile.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* QUICK UPDATE FORM FIELDS */}
              <div className="rounded-2xl border bg-white p-5 dark:bg-neutral-900/40 dark:border-neutral-850 flex flex-col gap-4">
                <h4 className="text-[10px] uppercase font-black tracking-wider text-orange-600">Quick-Fill Address default</h4>
                <div>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase block mb-1">Shipping Street Address</span>
                  <input
                    type="text"
                    defaultValue={userProfile.address || ''}
                    onBlur={e => handleProfileFieldChange({ address: e.target.value })}
                    placeholder="456 Pine Ave"
                    className="w-full text-xs rounded border py-1.5 px-2 bg-neutral-50 focus:bg-white dark:bg-neutral-950 dark:border-neutral-850 text-white"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase block mb-1">Mobile Contact Phone Number</span>
                  <input
                    type="text"
                    defaultValue={userProfile.phone || ''}
                    onBlur={e => handleProfileFieldChange({ phone: e.target.value })}
                    placeholder="+1 (555) 012-3456"
                    className="w-full text-xs rounded border py-1.5 px-2 bg-neutral-50 focus:bg-white dark:bg-neutral-950 dark:border-neutral-850 text-white"
                  />
                </div>
              </div>

            </div>

            {/* WISHLIST & ORDER TRACKING HISTORIC (8 COLS) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* HISTORIC ORDERS CHECK LIST */}
              <div className="rounded-2xl border bg-white p-6 shadow-xs dark:bg-neutral-900/40 dark:border-neutral-850">
                <h3 className="font-display font-black text-sm text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-orange-500" /> Dynamic Order History & Tracking
                </h3>
                
                {/* Active fetch order trigger layout */}
                <ActiveUserOrdersAndTracking 
                  token={authToken} 
                  currency={currency} 
                  language={language} 
                />
              </div>

              {/* WISHLIST RAIL */}
              <div className="rounded-2xl border bg-white p-6 dark:bg-neutral-900/40 dark:border-neutral-850">
                <h3 className="font-display font-black text-sm text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" /> Your Wishlisted Favorites
                </h3>
                
                {wishlist.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-6">Your bookmark list is empty. Explore products in search and favorite laptops!</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map(favp => (
                      <div key={favp.id} className="flex gap-3 bg-neutral-50 dark:bg-neutral-900/20 p-2.5 rounded-xl border items-center">
                        <img
                          src={favp.images[0]}
                          alt={favp.name}
                          className="h-12 w-16 object-cover rounded"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-neutral-800 dark:text-white truncate">{favp.name}</h4>
                          <span className="text-[10px] font-black tracking-wide text-orange-600 block mt-0.5">{formatCurrency(favp.price, currency)}</span>
                        </div>
                        <button
                          onClick={() => {
                            handleAddToCart(favp, 1);
                            setWishlist(prev => prev.filter(p => p.id !== favp.id));
                          }}
                          className="rounded-lg bg-orange-600 text-white p-2 hover:bg-orange-700"
                          title="Transfer configuration to Cart"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* =========================================================
            ADMIN PANEL HEADQUARTERS
            ========================================================= */}
        {currentTab === 'admin' && authToken && userProfile?.isAdmin && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-neutral-905 dark:text-white">Administrative Head Quarters</h2>
              <p className="text-xs text-neutral-400 mt-1">Manage standard laptop inventories, view incoming sales analytics, and update tracking order status codes.</p>
            </div>

            <AdminPanel 
              token={authToken} 
              currency={currency} 
              onRefreshProducts={loadCatalog} 
              products={products}
            />
          </div>
        )}

        {/* =========================================================
            AUTHENTICATION ACCESS LOGIN / REGISTER VIEW
            ========================================================= */}
        {currentTab === 'auth' && (
          <div id="auth-full-screen-layout" className="max-w-md mx-auto my-12 flex flex-col gap-6">
            
            {/* Quick credentials helper badge overlay */}
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 font-semibold text-xs text-neutral-700 dark:text-amber-250 flex flex-col gap-2.5 shadow-sm">
              <span className="flex items-center gap-1"><Info className="h-4 w-4 text-amber-500 shrink-0" /> Fast Simulated Testing Badges:</span>
              <p className="text-[11px] leading-relaxed">We pre-configure standard simulated credentials on startup so you can investigate admin and buyers features in 1-click!</p>
              
              <div className="flex flex-wrap gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => handleQuickCredentialFill('customer')}
                  className="rounded-lg bg-white/70 hover:bg-white border text-[10px] px-3 py-1 text-neutral-800 font-bold dark:bg-neutral-900 dark:border-neutral-800 dark:text-amber-200"
                >
                  Test Customer Fill (Alex)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCredentialFill('admin')}
                  className="rounded-lg bg-white/70 hover:bg-white border text-[10px] px-3 py-1 text-neutral-800 font-bold dark:bg-neutral-900 dark:border-neutral-800 dark:text-amber-200"
                >
                  Test Administrator Fill (HQ)
                </button>
              </div>
            </div>

            {/* FORM CONTAINER CARD */}
            <div className="rounded-3xl border bg-white p-8 dark:bg-neutral-900/40 dark:border-neutral-800 shadow-xl">
              <div className="text-center mb-6">
                <Laptop className="h-8 w-8 text-orange-600 mx-auto mb-2 animate-bounce" />
                <h3 className="font-display text-lg font-black text-neutral-900 dark:text-white">
                  {isRegisterMode ? 'Establish TechLaptop Portal' : 'Log Into Customer Account'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {isRegisterMode ? 'Verify details to catalogue checkout credentials.' : 'Verify user password to enter system portal.'}
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-150 text-[11px] font-semibold text-red-650 dark:bg-neutral-900 dark:border-red-950 dark:text-red-400">
                  ⚠️ {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                {isRegisterMode && (
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Mercer"
                      value={authName}
                      onChange={e => setAuthName(e.target.value)}
                      className="w-full rounded-xl border px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-orange-500 dark:bg-neutral-950 dark:border-neutral-800 text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1">E-mail Address</label>
                  <input
                    type="email"
                    required
                    placeholder="address@email.com"
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    className="w-full rounded-xl border px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-orange-500 dark:bg-neutral-950 dark:border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    className="w-full rounded-xl border px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-orange-500 dark:bg-neutral-950 dark:border-neutral-800 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-neutral-950 text-white font-extrabold rounded-xl hover:bg-neutral-850 transition-all text-xs tracking-wider uppercase mt-2 shadow-md"
                >
                  {isRegisterMode ? 'Establish Portal Connection' : 'Verify Session Credentials'}
                </button>
              </form>

              <div className="mt-6 text-center text-xs">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(prev => !prev)}
                  className="text-orange-655 hover:underline font-bold"
                >
                  {isRegisterMode ? 'Already cataloged? Log in instead' : 'New to TechLaptop? Register user account here'}
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* -------------------------------------------------------------
          SLIDE-OUT SHOPPING CART DIRECTORY
          ------------------------------------------------------------- */}
      {isCartOpen && (
        <div id="slideout-cart-overlay" className="fixed inset-0 z-50 flex justify-end bg-neutral-900/60 backdrop-blur-xs">
          
          {/* Click shadow */}
          <div onClick={() => setIsCartOpen(false)} className="flex-1"></div>

          {/* Cart detailed sidebar container */}
          <div className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col p-6 dark:bg-neutral-950 border-l dark:border-neutral-900">
            
            {/* Upper row header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4 dark:border-neutral-900">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-500" />
                <h3 className="font-display font-black text-neutral-900 dark:text-white">
                  {activeTranslation.cartTitle || 'Your Cart'} ({totalItemsInCart})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart scroll items list */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400 gap-2">
                  <ShoppingBag className="h-8 w-8 text-neutral-300 animate-pulse" />
                  <p className="text-xs font-semibold">{activeTranslation.emptyCart || 'Your cart is currently empty'}</p>
                  <button
                    onClick={() => { setIsCartOpen(false); setCurrentTab('shop'); }}
                    className="mt-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 px-4 py-2 font-bold text-xs text-white"
                  >
                    Catalog Laptop Models
                  </button>
                </div>
              ) : (
                cart.map((item, idX) => (
                  <div key={idX} className="flex gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-900 last:border-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-14 w-20 object-cover rounded bg-neutral-50"
                      referrerPolicy="no-referrer"
                    />

                    {/* Meta stack */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedSpecs && (
                        <p className="text-[10px] text-orange-655 font-bold mt-0.5">
                          {item.selectedSpecs.ram} • {item.selectedSpecs.storage}
                        </p>
                      )}
                      
                      {/* QTY Controllers */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateCartQty(idX, -1)}
                          className="h-5 w-5 rounded bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs dark:bg-neutral-900 font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateCartQty(idX, 1)}
                          className="h-5 w-5 rounded bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs dark:bg-neutral-900 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price column */}
                    <div className="text-right flex flex-col justify-between items-end">
                      <button
                        onClick={() => handleRemoveCartItem(idX)}
                        className="text-[10px] font-semibold text-neutral-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                      <span className="text-xs font-black text-neutral-900 dark:text-white">
                        {formatCurrency(item.product.price * item.quantity, currency)}
                      </span>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Bottom summary and checkouts redirect trigger */}
            {cart.length > 0 && (
              <div className="border-t pt-4 mt-4 dark:border-neutral-900 flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-neutral-450 text-neutral-500 uppercase tracking-widest leading-none">Est Subtotal</span>
                  <span className="text-lg font-black text-neutral-909 text-orange-600 dark:text-orange-400 leading-none">
                    {formatCurrency(cartSubtotal, currency)}
                  </span>
                </div>
                
                <p className="text-[10px] text-neutral-400 leading-normal">Promo discount codes, and default shipping destination parameters are configured in checkout.</p>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    if (!authToken) {
                      setCurrentTab('auth');
                    } else {
                      setCurrentTab('checkout');
                    }
                  }}
                  className="w-full py-3 bg-neutral-950 text-white font-extrabold hover:bg-neutral-850 rounded-xl transition-all text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                >
                  <ShieldCheck className="h-4 w-4 text-green-500 animate-pulse" />
                  <span>{activeTranslation.checkoutButton || 'Proceed to Secure Checkout'}</span>
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* -------------------------------------------------------------
          PRODUCT QUICK VIEW POPUP/MODAL DETAILS
          ------------------------------------------------------------- */}
      {selectedProduct && (
        <div id="product-quick-view-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
          
          {/* Main Modal Card */}
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] dark:bg-neutral-950 border dark:border-neutral-900">
            
            {/* Close buttons */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-15 p-1 rounded-full bg-neutral-80 hover:bg-neutral-100 hover:text-black dark:bg-neutral-900 text-neutral-400 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Scroll content area */}
            <div className="overflow-y-auto flex-1 p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Images grid area (LEFT 6 COLS) */}
                <div className="md:col-span-6 flex flex-col gap-4">
                  <div className="rounded-2xl overflow-hidden bg-neutral-50 h-64 dark:bg-neutral-900/40">
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {selectedProduct.images[1] && (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProduct.images.map((imStr, id) => (
                        <div key={id} className="rounded-xl overflow-hidden h-24 bg-neutral-50 border dark:border-neutral-900">
                          <img
                            src={imStr}
                            alt="thumbnail"
                            className="h-full w-full object-cover cursor-pointer hover:opacity-80"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info and customizations choices (RIGHT 6 COLS) */}
                <div className="md:col-span-6 flex flex-col gap-5">
                  <div>
                    <span className="rounded bg-orange-100 dark:bg-orange-950/40 text-orange-600 px-2 py-0.5 text-xs font-black uppercase tracking-wider">{selectedProduct.brand}</span>
                    <h3 className="font-display text-xl sm:text-2xl font-black mt-1.5 leading-tight text-neutral-900 dark:text-white">{selectedProduct.name}</h3>
                  </div>

                  {/* PRICE DISPLAY */}
                  <div className="text-xl font-black text-neutral-900 dark:text-white">
                    {formatCurrency(getPriceAdjustment(selectedProduct, detailSelectedRam, detailSelectedStorage), currency)}
                  </div>

                  <p className="text-xs text-neutral-505 text-neutral-500 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* SPECIFICATION PICKER CUSTOMIZER (Price dynamic modifier) */}
                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-105 dark:border-neutral-900 flex flex-col gap-3 text-xs">
                    
                    {/* RAM Selector */}
                    <div>
                      <span className="text-[10px] font-black uppercase text-neutral-400 block mb-1.5">System Memory Config</span>
                      <div className="flex gap-2">
                        {['16GB LPDDR5', '32GB LPDDR5'].map(optR => (
                          <button
                            key={optR}
                            onClick={() => setDetailSelectedRam(optR)}
                            className={`px-3 py-1 text-xs rounded-lg border font-semibold ${
                              detailSelectedRam.toLowerCase().includes(optR.split(' ')[0].toLowerCase())
                                ? 'border-orange-500 bg-orange-50/40 text-orange-655'
                                : 'border-neutral-200 text-neutral-60s dark:border-neutral-800'
                            }`}
                          >
                            {optR} {optR.includes('32GB') ? '(+$150)' : ''}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SSD Selector */}
                    <div>
                      <span className="text-[10px] font-black uppercase text-neutral-400 block mb-1.5">Flash SSD Drive</span>
                      <div className="flex gap-2">
                        {['512GB PCIe', '1TB PCIe', '2TB PCIe'].map(optS => (
                          <button
                            key={optS}
                            onClick={() => setDetailSelectedStorage(optS)}
                            className={`px-3 py-1 text-xs rounded-lg border font-semibold ${
                              detailSelectedStorage.toLowerCase().includes(optS.split(' ')[0].toLowerCase())
                                ? 'border-orange-500 bg-orange-50/40 text-orange-655'
                                : 'border-neutral-200 text-neutral-60s dark:border-neutral-800'
                            }`}
                          >
                            {optS} {optS.includes('1TB') ? '(+$100)' : optS.includes('2TB') ? '(+$250)' : ''}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* SPEC SUMMARY PANEL */}
                  <div className="border-t pt-4">
                    <span className="text-[10px] font-black tracking-widest text-neutral-450 uppercase mb-2 block">Technical specifications</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-650 leading-relaxed dark:text-neutral-400">
                      <div><span className="font-bold">CPU:</span> {selectedProduct.specs.processor}</div>
                      <div><span className="font-bold">Display:</span> {selectedProduct.specs.display}</div>
                      <div><span className="font-bold">GPU:</span> {selectedProduct.specs.graphics}</div>
                      <div><span className="font-bold">Battery:</span> {selectedProduct.specs.battery}</div>
                    </div>
                  </div>

                  {/* BUY & CART TRIGGER ROW */}
                  <div className="flex gap-2.5 items-center border-t pt-4">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct, 1);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 py-3 text-xs font-bold text-neutral-900 border hover:bg-neutral-50 rounded-xl dark:text-white dark:border-neutral-800"
                    >
                      Add configuration to Cart
                    </button>
                    <button
                      onClick={() => {
                        handleBuyNow(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="buy-now-btn flex-1 py-3 text-xs font-black bg-orange-600 text-white rounded-xl hover:bg-orange-700 shadow"
                    >
                      {activeTranslation.buyNow || 'Buy Now'}
                    </button>
                  </div>

                </div>

              </div>

              {/* REVIEWS & RATINGS LIST IN DETAIL PAGE */}
              <div className="border-t mt-10 pt-6">
                <span className="text-xs font-black tracking-wider text-neutral-450 block uppercase mb-4">Customer Reviews & Ratings ({selectedProduct.reviews.length})</span>
                
                {/* Form to submit review */}
                <form onSubmit={handleSubmitReview} className="mb-6 rounded-2xl bg-neutral-50 border p-4 dark:bg-neutral-950 dark:border-neutral-900 flex flex-col gap-3">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white leading-none">Share Your Review Experience</span>
                  <div className="flex gap-4 items-center">
                    <span className="text-[11px] text-neutral-400 font-semibold leading-none">Rating Quality:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setReviewRating(st)}
                          className="hover:scale-110"
                        >
                          <Star className={`h-4.5 w-4.5 ${st <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-750'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Ex. Incredible compilations speed, great laptop!"
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-orange-500 dark:bg-neutral-900 dark:border-neutral-800 text-white"
                    />
                    <button
                      type="submit"
                      disabled={isSavingReview || !reviewComment.trim()}
                      className="rounded-xl bg-neutral-950 hover:bg-neutral-850 px-4 py-2 font-bold text-xs text-white"
                    >
                      {isSavingReview ? 'Saving...' : 'Post feedback'}
                    </button>
                  </div>
                </form>

                {/* Listings of reviews */}
                <div className="flex flex-col gap-4">
                  {selectedProduct.reviews.length === 0 ? (
                    <p className="text-xs text-neutral-400">No review ratings logged yet. Be the first to catalog your feedback!</p>
                  ) : (
                    selectedProduct.reviews.map(rev => (
                      <div key={rev.id} className="rounded-xl border p-4 bg-white/40 text-xs flex flex-col gap-1.5 dark:border-neutral-900">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-neutral-900 dark:text-neutral-105">{rev.userName}</span>
                          <span className="text-neutral-400 text-[10px]">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} />
                          ))}
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-normal font-medium">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RECOMMENDED / RELATED LAPTOPS SECTION */}
              {relatedRecommendations.length > 0 && (
                <div className="border-t mt-10 pt-6">
                  <span className="text-xs font-black tracking-wider text-neutral-450 block uppercase mb-4">Frequently Bought Together (Recommended for You)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {relatedRecommendations.map(relp => (
                      <div 
                        key={relp.id}
                        onClick={() => handleSelectProduct(relp)}
                        className="rounded-xl p-3 border cursor-pointer hover:border-orange-500 dark:border-neutral-900 bg-neutral-50/40 dark:bg-neutral-900/10 flex gap-2.5 items-center"
                      >
                        <img
                          src={relp.images[0]}
                          alt={relp.name}
                          className="h-10 w-14 object-cover rounded bg-neutral-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[11px] font-bold text-neutral-800 dark:text-white truncate">{relp.name}</h4>
                          <span className="text-[10px] text-orange-500 font-extrabold block mt-0.5">{formatCurrency(relp.price, currency)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* -------------------------------------------------------------
          SECURED PRODUCT COMPARE SPEC COMPONENT
          ------------------------------------------------------------- */}
      <CompareDrawer
        comparedProducts={comparedProducts}
        onRemove={prod => setComparedProducts(prev => prev.filter(p => p.id !== prod.id))}
        onClear={() => setComparedProducts([])}
        currency={currency}
        language={language}
        onSelect={handleSelectProduct}
        isVisible={isCompareVisible}
        onToggleVisible={() => setIsCompareVisible(prev => !prev)}
      />

      {/* -------------------------------------------------------------
          LIVE CHAT HELPDESK ENGINE
          ------------------------------------------------------------- */}
      <LiveChat />

      {/* -------------------------------------------------------------
          PROFESSIONAL FOOTER SECTION
          ------------------------------------------------------------- */}
      <footer className="mt-12 border-t border-neutral-100 bg-white/90 py-10 dark:border-neutral-900 dark:bg-neutral-950 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-neutral-500 dark:text-neutral-400">
            
            {/* BRAND DESCRIPTION COLS (4 COLS) */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold text-xs shadow">LT</div>
                <span className="font-display font-black text-xs text-neutral-900 dark:text-white">TechLaptop Store</span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm">Premium full-stack workstation supplier serving startup engineers, software architects, content specialists, and competitive esports players globally.</p>
              
              <div className="flex gap-1.5 items-center mt-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">All standard servers operation online</span>
              </div>
            </div>

            {/* LINKS COLS (2 COLS) */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <h4 className="font-display font-black text-xs text-neutral-900 dark:text-white uppercase tracking-wider">Catalog Directories</h4>
              <button onClick={() => { setSearchQuery('Gaming'); setCurrentTab('shop'); }} className="text-xs text-left hover:text-neutral-900 dark:hover:text-white">Esports Gaming</button>
              <button onClick={() => { setSearchQuery('Premium'); setCurrentTab('shop'); }} className="text-xs text-left hover:text-neutral-900 dark:hover:text-white">Creative work rigs</button>
              <button onClick={() => { setSearchQuery('Business'); setCurrentTab('shop'); }} className="text-xs text-left hover:text-neutral-900 dark:hover:text-white">ThinkPad Carbon</button>
              <button onClick={() => { setSearchQuery('Student'); setCurrentTab('shop'); }} className="text-xs text-left hover:text-neutral-900 dark:hover:text-white">Thin ultrabooks</button>
            </div>

            {/* QUICK LINK PORTS (2 COLS) */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <h4 className="font-display font-black text-xs text-neutral-900 dark:text-white uppercase tracking-wider">Company Core</h4>
              <button onClick={() => setCurrentTab('about')} className="text-xs text-left hover:text-neutral-900 dark:hover:text-white">Our Heritage</button>
              <button onClick={() => setCurrentTab('contact')} className="text-xs text-left hover:text-neutral-900 dark:hover:text-white">Operational Desk</button>
              <button onClick={() => { setCurrentTab('home'); }} className="text-xs text-left hover:text-neutral-900 dark:hover:text-white">Customer FAQ</button>
              {authToken && (
                <button onClick={() => { setCurrentTab('dashboard'); }} className="text-xs text-left hover:text-orange-600 dark:hover:text-orange-400 font-bold">Client Dashboard</button>
              )}
            </div>

            {/* SECURE SEALS (4 COLS) */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <h4 className="font-display font-black text-xs text-neutral-900 dark:text-white uppercase tracking-wider">Acquisition Guarantees</h4>
              <div className="flex gap-3 bg-neutral-50 dark:bg-neutral-900/20 rounded-2xl p-4 border dark:border-neutral-900">
                <ShieldCheck className="h-8 w-8 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-xs text-neutral-800 dark:text-neutral-200">Verified Secure Shipments</span>
                  <p className="text-[10px] leading-relaxed mt-0.5">Encrypted billing databases with dynamic server stock deduction prevents backorder lag delays.</p>
                </div>
              </div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black">© 2026 TechLaptop Inc. {activeTranslation.footerRights}</p>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}


// -------------------------------------------------------------
// SUB-DASHBOARD PORTLET FOR CLIENT ORDERS & TRACKING 
// -------------------------------------------------------------
interface ActiveUserOrdersProps {
  token: string;
  currency: Currency;
  language: Language;
}

function ActiveUserOrdersAndTracking({ token, currency, language }: ActiveUserOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(await res.json());
      }
    } catch {
      console.error("Order history logs offline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserOrders();
  }, [token]);

  // Command to request cancel a pending order
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you certain you want to request immediate cancellation of this pending order?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Cancelled' })
      });

      if (res.ok) {
        alert('Order status canceled successfully.');
        loadUserOrders();
      } else {
        const bodyErr = await res.json();
        alert(bodyErr.message || 'Failure canceling order parameters.');
      }
    } catch {
      alert('Network issue.');
    }
  };

  if (loading) {
    return <p className="text-xs text-neutral-400 py-3 block text-center">Loading client order logs...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-neutral-400">
        You have no historically recorded orders. Browse our premium laptop models and execute checkouts!
      </div>
    );
  }

  return (
    <div id="dynamic-user-orders-logs-rail" className="flex flex-col gap-4">
      {orders.map(ord => (
        <div key={ord.id} className="rounded-xl border p-4 bg-neutral-50/50 dark:bg-neutral-950/20 dark:border-neutral-900 flex flex-col gap-3 text-xs">
          
          <div className="flex justify-between items-baseline border-b pb-2">
            <div>
              <span className="font-extrabold text-neutral-900 dark:text-neutral-100 uppercase tracking-widest">{ord.id}</span>
              <span className="text-neutral-400 ml-2">{ord.date}</span>
            </div>
            <span className={`rounded px-2.5 py-0.5 text-[9px] font-black uppercase ${
              ord.status === 'Delivered' ? 'bg-green-100 text-green-700' :
              ord.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
              ord.status === 'Shipped' ? 'bg-blue-105 bg-blue-100 text-blue-700 font-bold' : 'bg-amber-100 text-amber-700'
            }`}>
              {ord.status}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 text-neutral-600 dark:text-neutral-400">
            {ord.items.map((it, idx) => (
              <div key={idx} className="flex justify-between font-semibold">
                <span>{it.quantity}x {it.name}</span>
                <span>{formatCurrency(it.price * it.quantity, currency)}</span>
              </div>
            ))}
            <div className="border-t pt-1.5 flex justify-between font-black text-neutral-900 dark:text-white text-xs">
              <span>Paid Total</span>
              <span className="text-orange-600">{formatCurrency(ord.total, currency)}</span>
            </div>
          </div>

          <div className="border-t pt-2 mt-1 flex flex-wrap gap-2 items-center justify-between">
            {ord.trackingNumber ? (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500">
                <Truck className="h-4 w-4 text-orange-650" />
                <span>Tracking Courier Code: <span className="font-bold text-neutral-900 dark:text-white select-all">{ord.trackingNumber}</span></span>
              </div>
            ) : ord.status === 'Cancelled' ? (
              <span className="text-[10px] text-neutral-400 italic">No shipment tracking - order cancelled.</span>
            ) : (
              <span className="text-[10px] text-neutral-400 italic">Tracking details will be logged upon dispatch.</span>
            )}

            {/* Cancel buttons for pending orders */}
            {ord.status === 'Pending' && (
              <button
                onClick={() => handleCancelOrder(ord.id)}
                className="rounded bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 text-[10px] px-3 py-1 font-extrabold shadow-sm transition-colors uppercase tracking-wider"
              >
                Request Cancel
              </button>
            )}
          </div>

        </div>
      ))}
    </div>
  );
}
