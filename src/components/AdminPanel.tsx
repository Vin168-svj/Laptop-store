import React, { useState, useEffect } from 'react';
import { 
  BarChart4, Package, ShoppingBag, Users, Ticket, Plus, Trash2, Edit2, Check, X, Tag, Info, AlertTriangle, Truck, Layers 
} from 'lucide-react';
import { Product, Order, User, Coupon, Currency } from '../types';
import { formatCurrency } from '../localization';

interface AdminPanelProps {
  token: string;
  currency: Currency;
  onRefreshProducts: () => void;
  products: Product[];
}

export default function AdminPanel({ token, currency, onRefreshProducts, products }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'customers' | 'coupons'>('analytics');
  
  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);
  const [customers, setCustomers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Product CRUD states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('ASUS');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'Gaming' | 'Business' | 'Student' | 'Premium'>('Student');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCPU, setNewProdCPU] = useState('');
  const [newProdRAM, setNewProdRAM] = useState('16GB LPDDR5');
  const [newProdStorage, setNewProdStorage] = useState('1TB PCIe');
  const [newProdGPU, setNewProdGPU] = useState('');
  const [newProdDisplay, setNewProdDisplay] = useState('15.6" IPS Panel');
  const [newProdBattery, setNewProdBattery] = useState('Up to 8 hours');
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Coupon Creation state
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponVal, setCouponVal] = useState('');
  const [couponMinSpent, setCouponMinSpent] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [isSavingCoupon, setIsSavingCoupon] = useState(false);

  // Tracking details state for updating orders
  const [targetOrderTracking, setTargetOrderTracking] = useState<Record<string, string>>({});

  // Loading indicator states
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // 1. Fetch Analytics Metrics
      const metricRes = await fetch('/api/analytics', { headers });
      if (metricRes.ok) {
        const metricsData = await metricRes.json();
        setAnalytics(metricsData);
      }

      // 2. Fetch Customers
      const custRes = await fetch('/api/customers', { headers });
      if (custRes.ok) {
        setCustomers(await custRes.json());
      }

      // 3. Fetch Orders
      const ordRes = await fetch('/api/orders', { headers });
      if (ordRes.ok) {
        setOrders(await ordRes.json());
      }

      // 4. Fetch Coupons
      const coupRes = await fetch('/api/coupons', { headers });
      if (coupRes.ok) {
        setCoupons(await coupRes.json());
      }

    } catch (err) {
      console.error("Failed fetching admins dashboards statistics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token, products]);

  // CREATE / UPDATE PRODUCTS
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdStock) {
      alert('Please fill out essential fields (Name, Price, Stock).');
      return;
    }

    setIsSavingProduct(true);
    const bodyPayload = {
      name: newProdName,
      brand: newProdBrand,
      price: Number(newProdPrice),
      stock: Number(newProdStock),
      category: newProdCategory,
      description: newProdDesc,
      images: [
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=800&q=80'
      ],
      specs: {
        processor: newProdCPU || 'Intel Core i7 Gen13',
        ram: newProdRAM || '16GB DDR5',
        storage: newProdStorage || '512GB NVMe SSD',
        graphics: newProdGPU || 'Intel Integrated Iris Graphics',
        display: newProdDisplay || '15" Screen anti-glare',
        battery: newProdBattery || 'Up to 9 hours'
      }
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyPayload)
      });

      if (res.ok) {
        alert(editingProduct ? 'Product configuration overridden!' : 'New laptop model cataloged successfully!');
        setEditingProduct(null);
        clearProductForm();
        onRefreshProducts();
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (err) {
      alert('Network failure saving content.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const clearProductForm = () => {
    setNewProdName('');
    setNewProdBrand('ASUS');
    setNewProdPrice('');
    setNewProdStock('');
    setNewProdCategory('Student');
    setNewProdDesc('');
    setNewProdCPU('');
    setNewProdRAM('16GB LPDDR5');
    setNewProdStorage('1TB PCIe');
    setNewProdGPU('');
    setNewProdDisplay('15.6" IPS Panel');
    setNewProdBattery('Up to 8 hours');
    setEditingProduct(null);
  };

  const handleEditProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setNewProdName(prod.name);
    setNewProdBrand(prod.brand);
    setNewProdPrice(prod.price.toString());
    setNewProdStock(prod.stock.toString());
    setNewProdCategory(prod.category);
    setNewProdDesc(prod.description);
    setNewProdCPU(prod.specs.processor);
    setNewProdRAM(prod.specs.ram);
    setNewProdStorage(prod.specs.storage);
    setNewProdGPU(prod.specs.graphics);
    setNewProdDisplay(prod.specs.display);
    setNewProdBattery(prod.specs.battery);
  };

  // DELETE LAPTOP MODEL
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you absolutely certain you want to strike this laptop from standard inventory?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Deleted successfully.');
        onRefreshProducts();
      } else {
        alert('Error deleting laptop record.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  // UPDATE ORDER STATUS
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const tracking = targetOrderTracking[orderId] || '';
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, trackingNumber: tracking })
      });

      if (res.ok) {
        alert(`Order state shifted to index [${status}] successfully!`);
        fetchDashboardData();
      } else {
        alert('Failed shifting order state.');
      }
    } catch (err) {
      alert('Connectivity issue.');
    }
  };

  // SAVE COUPON
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode || !couponVal) {
      alert('Must define Coupon code and value.');
      return;
    }

    setIsSavingCoupon(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: couponCode,
          discountType: couponType,
          discountValue: Number(couponVal),
          minSubtotal: couponMinSpent ? Number(couponMinSpent) : undefined,
          description: couponDesc || `${couponVal}% Off Promo`
        })
      });

      if (res.ok) {
        alert('Promo Coupon Discount published!');
        setCouponCode('');
        setCouponVal('');
        setCouponMinSpent('');
        setCouponDesc('');
        fetchDashboardData();
      } else {
        const err = await res.json();
        alert(err.message || 'Error occurred publishing Coupon.');
      }
    } catch (err) {
      alert('Network issue publishing promo discount.');
    } finally {
      setIsSavingCoupon(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-sm text-neutral-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
        <span>Accessing Secure Headquarters Administration...</span>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-full-container" className="grid grid-cols-1 md:grid-cols-12 gap-8 py-4">
      
      {/* SIDEBAR TABS LAYOUT CONTROLLER */}
      <div className="md:col-span-3 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible border-b pb-2 md:border-b-0 md:pb-0">
        {[
          { tab: 'analytics', label: 'Dashboard Metrics', icon: BarChart4 },
          { tab: 'products', label: 'Inventory (Products)', icon: Package },
          { tab: 'orders', label: 'Purchase Orders', icon: ShoppingBag },
          { tab: 'customers', label: 'Customer Base', icon: Users },
          { tab: 'coupons', label: 'Coupons & Promos', icon: Ticket }
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-left font-semibold text-xs transition-colors shrink-0 ${
                activeTab === item.tab
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* DETAILED WORKING PANELS */}
      <div className="md:col-span-9 flex flex-col gap-6">

        {/* 1. ANALYTICS METRICS DASHBOARD */}
        {activeTab === 'analytics' && analytics && (
          <div className="flex flex-col gap-8">
            
            {/* STAT CARDS GRIDA */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border bg-white p-5 shadow-xs dark:bg-neutral-900/40 dark:border-neutral-850">
                <span className="text-[10px] uppercase font-black tracking-widest text-neutral-450 block mb-1">Gross Yield Sales</span>
                <span className="text-xl font-black text-neutral-900 dark:text-white block">
                  {formatCurrency(analytics.metrics.totalSales, currency)}
                </span>
                <span className="text-[9px] text-green-500 font-bold mt-1 block">▲ +14% check rate this week</span>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-xs dark:bg-neutral-900/40 dark:border-neutral-850">
                <span className="text-[10px] uppercase font-black tracking-widest text-neutral-450 block mb-1">Total Orders</span>
                <span className="text-xl font-black text-neutral-900 dark:text-white block">
                  {analytics.metrics.totalOrders}
                </span>
                <span className="text-[9px] text-neutral-400 font-semibold mt-1 block">Pending approval: {orders.filter(o => o.status === 'Pending').length}</span>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-xs dark:bg-neutral-900/40 dark:border-neutral-850">
                <span className="text-[10px] uppercase font-black tracking-widest text-neutral-450 block mb-1">Customers Joined</span>
                <span className="text-xl font-black text-neutral-900 dark:text-white block">
                  {analytics.metrics.totalCustomers}
                </span>
                <span className="text-[9px] text-green-500 font-bold mt-1 block">Active online today: 2</span>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-xs dark:bg-neutral-900/40 dark:border-neutral-850">
                <span className="text-[10px] uppercase font-black tracking-widest text-neutral-450 block mb-1">In-Stock Volume</span>
                <span className="text-xl font-black text-neutral-900 dark:text-white block">
                  {analytics.metrics.totalProductsCount}
                </span>
                <span className="text-[9px] text-rose-500 font-bold mt-1 block">Low Stock warnings: {products.filter(p => p.stock < 10).length} models</span>
              </div>
            </div>

            {/* BAR CHART GRAPH CATEGORIES */}
            <div className="rounded-2xl border bg-white p-6 dark:bg-neutral-900/30 dark:border-neutral-850">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                <Layers className="h-4 w-4 text-orange-500" /> Revenue Split by Laptop Category
              </h4>

              <div className="flex flex-col gap-4">
                {Object.entries(analytics.categorySales).map(([cat, val]: [string, any]) => {
                  const maxVal = Math.max(...Object.values(analytics.categorySales) as number[]) || 1;
                  const ratio = (val / maxVal) * 100;
                  return (
                    <div key={cat} className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-500 w-24 shrink-0">{cat}</span>
                      <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 h-6 rounded-lg overflow-hidden relative">
                        <div 
                          style={{ width: `${ratio}%` }}
                          className="bg-orange-600 h-full rounded-r-lg transition-all duration-500"
                        ></div>
                        <span className="absolute left-3 top-1 text-[10px] font-bold text-white uppercase drop-shadow-sm">
                          {formatCurrency(val, currency)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RECENT SALES LOGS */}
            <div className="rounded-2xl border bg-white p-6 dark:bg-neutral-900/30 dark:border-neutral-800">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">Chronicle of Recent Acquisitions</h4>
              <div className="flex flex-col gap-3">
                {analytics.recentSales.map((sal: any) => (
                  <div key={sal.id} className="flex items-center justify-between border-b pb-3 text-xs last:border-0 last:pb-0">
                    <div>
                      <span className="font-bold text-neutral-800 dark:text-neutral-200 block">{sal.customerName}</span>
                      <span className="text-neutral-400 text-[10px]">{sal.date} • {sal.paymentMethod}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-neutral-900 dark:text-white block">{formatCurrency(sal.total, currency)}</span>
                      <span className="rounded-full bg-orange-100 text-orange-700 text-[9px] px-2 py-0.5 font-bold uppercase">{sal.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. INVENTORY & PRODUCT CREATOR TAB */}
        {activeTab === 'products' && (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
            
            {/* ADD AND EDIT FORM COL */}
            <form onSubmit={handleSaveProduct} className="lg:col-span-5 rounded-2xl border bg-white p-5 dark:bg-neutral-900/40 dark:border-neutral-800 flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-orange-600">
                {editingProduct ? 'Modify Laptop Profile' : 'Catalog New Laptop Model'}
              </h4>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Laptop Model Name *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="ZenBook Pro 14"
                  className="w-full rounded-lg border px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 dark:bg-neutral-950 dark:border-neutral-850 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Brand Manufacturer *</label>
                  <select
                    value={newProdBrand}
                    onChange={e => setNewProdBrand(e.target.value)}
                    className="w-full rounded-lg border px-2.5 py-2 text-xs dark:bg-neutral-950 dark:border-neutral-800 text-white"
                  >
                    {['ASUS', 'Razer', 'Apple', 'Lenovo', 'Dell', 'Acer', 'HP'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Category Type *</label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value as any)}
                    className="w-full rounded-lg border px-2.5 py-2 text-xs dark:bg-neutral-950 dark:border-neutral-800 text-white"
                  >
                    {['Gaming', 'Business', 'Student', 'Premium'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Retail Price ($USD) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(e.target.value)}
                    placeholder="1499"
                    className="w-full rounded-lg border px-3 py-2 text-xs dark:bg-neutral-950 dark:border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={e => setNewProdStock(e.target.value)}
                    placeholder="12"
                    className="w-full rounded-lg border px-3 py-2 text-xs dark:bg-neutral-950 dark:border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Brief Description *</label>
                <textarea
                  required
                  value={newProdDesc}
                  onChange={e => setNewProdDesc(e.target.value)}
                  placeholder="Enter specifications highlights and features summary..."
                  className="w-full h-16 rounded-lg border px-3 py-2 text-xs dark:bg-neutral-950 dark:border-neutral-800 text-white"
                />
              </div>

              {/* SPECIFICATION COLLAPSIBLE FIELDS */}
              <div className="border-t pt-3 p-3 bg-neutral-50 dark:bg-neutral-950/40 rounded-xl flex flex-col gap-3">
                <span className="text-[10px] font-black tracking-widest text-neutral-500 uppercase flex items-center gap-1"><Info className="h-4 w-4" /> Hardwares</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 block uppercase">Processor (CPU)</span>
                    <input
                      type="text"
                      value={newProdCPU}
                      onChange={e => setNewProdCPU(e.target.value)}
                      placeholder="AMD Ryzen 7"
                      className="w-full py-1 px-2 text-xs border rounded bg-white dark:bg-neutral-900 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 block uppercase">Graphics Card</span>
                    <input
                      type="text"
                      value={newProdGPU}
                      onChange={e => setNewProdGPU(e.target.value)}
                      placeholder="RTX 4060 Dedicated"
                      className="w-full py-1 px-2 text-xs border rounded bg-white dark:bg-neutral-900 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 block uppercase">RAM RAM</span>
                    <input
                      type="text"
                      value={newProdRAM}
                      onChange={e => setNewProdRAM(e.target.value)}
                      placeholder="16GB DDR5"
                      className="w-full py-1 px-2 text-xs border rounded bg-white dark:bg-neutral-900 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 block uppercase">Disk Drive</span>
                    <input
                      type="text"
                      value={newProdStorage}
                      onChange={e => setNewProdStorage(e.target.value)}
                      placeholder="512GB NVMe"
                      className="w-full py-1 px-2 text-xs border rounded bg-white dark:bg-neutral-900 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                {editingProduct && (
                  <button 
                    type="button" 
                    onClick={clearProductForm}
                    className="rounded-lg bg-neutral-200 px-4 py-2 text-neutral-600 hover:bg-neutral-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-40 text-xs font-bold px-5 py-2 flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isSavingProduct ? 'Saving...' : editingProduct ? 'Overwrite Spec' : 'Catalog Laptop'}</span>
                </button>
              </div>
            </form>

            {/* INVENTORY LISTING COL */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">Standard Catalog ({products.length} models)</h4>
              <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto">
                {products.map(prod => (
                  <div key={prod.id} className="rounded-xl border bg-white p-3.5 flex justify-between items-center dark:bg-neutral-900/10 dark:border-neutral-850">
                    <div className="flex gap-2.5 items-center">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="h-10 w-14 shrink-0 object-cover rounded bg-neutral-50"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h5 className="text-xs font-black text-neutral-900 dark:text-neutral-250 leading-tight">
                          {prod.name}
                        </h5>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {prod.brand} • {prod.category} • <span className={prod.stock < 10 ? 'text-red-500 font-bold' : 'text-neutral-400'}>Stock: {prod.stock}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-xs text-neutral-900 dark:text-white">
                        {formatCurrency(prod.price, currency)}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditProductClick(prod)}
                          className="p-1 rounded bg-neutral-100 text-neutral-600 hover:bg-orange-50 hover:text-orange-600 dark:bg-neutral-800 dark:text-neutral-400"
                          title="Edit Specs"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1 rounded bg-neutral-150 text-neutral-500 hover:bg-red-500 hover:text-white dark:bg-neutral-800"
                          title="Expunge from list"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 3. MANAGE CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">Incoming Orders ({orders.length} events)</h4>
            <div className="flex flex-col gap-4">
              {orders.map(ord => (
                <div key={ord.id} className="rounded-xl border bg-white p-5 dark:bg-neutral-900/20 dark:border-neutral-850 flex flex-col gap-4">
                  
                  {/* HEADER META ROW */}
                  <div className="flex flex-wrap gap-2 justify-between items-center border-b pb-3 text-xs">
                    <div>
                      <span className="font-black text-neutral-900 dark:text-neutral-100">ORDER {ord.id}</span>
                      <span className="text-neutral-400 block sm:inline sm:ml-2">{ord.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400">Status:</span>
                      <span className={`rounded-xl text-[9px] px-2.5 py-0.5 font-black uppercase tracking-wider ${
                        ord.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        ord.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                        ord.status === 'Shipped' ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  {/* CUSTOMER PARTICULARS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                    <div>
                      <p className="font-semibold text-neutral-400 uppercase text-[9px] mb-0.5">Purchased by</p>
                      <p className="font-bold text-neutral-900 dark:text-white leading-tight">{ord.customerName}</p>
                      <p className="text-[10px] text-neutral-400">{ord.customerEmail}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-400 uppercase text-[9px] mb-0.5">Destination Address</p>
                      <p>{ord.shippingAddress.street}</p>
                      <p className="text-[10px] text-neutral-450">{ord.shippingAddress.city}, {ord.shippingAddress.state}, {ord.shippingAddress.zipCode}</p>
                    </div>
                  </div>

                  {/* CARDS LISTING FOR THIS ORDER */}
                  <div className="border bg-neutral-50/50 p-3 rounded-lg dark:bg-neutral-950/20 dark:border-neutral-850 flex flex-col gap-1.5 text-xs">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center font-medium leading-relaxed">
                        <span>{it.quantity}x {it.name}</span>
                        <span>{formatCurrency(it.price * it.quantity, currency)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-1.5 mt-1.5 flex justify-between font-black text-neutral-900 dark:text-white">
                      <span>Total Invoice</span>
                      <span className="text-orange-600 dark:text-orange-400">{formatCurrency(ord.total, currency)}</span>
                    </div>
                  </div>

                  {/* SHIPPING TRACE INPUT AND ACTION SHIFTS */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t pt-3.5">
                    
                    {/* Append tracking text box */}
                    <div className="flex gap-1.5 w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="LH-XXXX-US"
                        value={targetOrderTracking[ord.id] || ord.trackingNumber || ''}
                        onChange={e => setTargetOrderTracking(prev => ({ ...prev, [ord.id]: e.target.value }))}
                        className="rounded-lg border px-3 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 dark:bg-neutral-950 dark:border-neutral-850 text-white w-full sm:w-36"
                      />
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, ord.status)}
                        className="rounded-lg bg-neutral-900 text-white px-3.5 py-1.5 text-xs font-bold hover:bg-neutral-800 shrink-0"
                      >
                        Set tracking
                      </button>
                    </div>

                    {/* Status shifts */}
                    <div className="flex gap-1 w-full sm:w-auto justify-end">
                      {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                        <button
                          key={st}
                          onClick={() => handleUpdateOrderStatus(ord.id, st)}
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase transition-colors ${
                            ord.status === st
                              ? 'bg-neutral-850 text-white'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CUSTOMER LOGS TAB */}
        {activeTab === 'customers' && (
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">Active Customer Registry</h4>
            <div className="rounded-2xl border bg-white overflow-hidden dark:bg-neutral-900/10 dark:border-neutral-850">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-55 dark:bg-neutral-950/40 text-neutral-450 border-b font-semibold uppercase tracking-wider">
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">E-mail</th>
                    <th className="p-4">Mobile Number</th>
                    <th className="p-4">Default Address</th>
                    <th className="p-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 text-neutral-700 dark:text-neutral-400">
                  {customers.map(cust => (
                    <tr key={cust.id} className="hover:bg-neutral-50/50">
                      <td className="p-4 font-bold text-neutral-900 dark:text-white">{cust.name}</td>
                      <td className="p-4 text-mono">{cust.email}</td>
                      <td className="p-4">{cust.phone || 'N/A'}</td>
                      <td className="p-4 truncate max-w-[150px]">{cust.address || 'Not registered'}</td>
                      <td className="p-4 font-semibold text-[10px] tracking-wide">{cust.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. COUPON CREATION PORTAL */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Create form */}
            <form onSubmit={handleSaveCoupon} className="lg:col-span-5 rounded-2xl border bg-white p-5 dark:bg-neutral-900/40 dark:border-neutral-850 flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-orange-600">Issue Promo Coupon</h4>
              
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Coupon Promo Code *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex. DISKPRO50"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border px-3 py-2 text-xs uppercase dark:bg-neutral-950 dark:border-neutral-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Discount Type *</label>
                  <select
                    value={couponType}
                    onChange={e => setCouponType(e.target.value as any)}
                    className="w-full rounded-lg border px-2 py-2 text-xs dark:bg-neutral-950 dark:border-neutral-800 text-white"
                  >
                    <option value="percentage">Percentage %</option>
                    <option value="fixed">Fixed Cash $</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={couponVal}
                    onChange={e => setCouponVal(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-xs dark:bg-neutral-950 dark:border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Min Order Size required ($)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={couponMinSpent}
                  onChange={e => setCouponMinSpent(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-xs dark:bg-neutral-950 dark:border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Brief Description *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex. 10% cash savings"
                  value={couponDesc}
                  onChange={e => setCouponDesc(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-xs dark:bg-neutral-950 dark:border-neutral-800 text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingCoupon}
                className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-xs font-bold transition-colors"
              >
                {isSavingCoupon ? 'Publishing...' : 'Publish Discount Coupon'}
              </button>
            </form>

            {/* List active coupons */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">Published coupons</h4>
              <div className="flex flex-col gap-2">
                {coupons.map((c, i) => (
                  <div key={i} className="rounded-xl border bg-white p-4 flex items-center justify-between dark:bg-neutral-900/10 dark:border-neutral-850">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-4 w-4 text-orange-650" />
                        <span className="font-extrabold text-xs text-neutral-900 dark:text-white uppercase leading-none tracking-wider">{c.code}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1">{c.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-rose-600 block">
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                      </span>
                      {c.minSubtotal && (
                        <span className="text-[9px] text-neutral-400 font-medium">Over ${c.minSubtotal} spend</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
