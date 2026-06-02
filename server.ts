import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Product, Order, User, Coupon, Review } from './src/types.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database Collections. Rebuilt on start.
const initialReviews: Review[] = [
  { id: 'r1', userId: 'u2', userName: 'Alex Johnson', rating: 5, comment: 'Phenomenal laptop! The OLED screen is incredibly bright and colors are punchy. Highly recommend for developers and content creators.', date: '2026-05-15' },
  { id: 'r2', userId: 'u3', userName: 'Emily Watson', rating: 4, comment: 'Sleek design, runs extremely cool. Battery life is around 10-12 hours during mild office work. Graphics card handles modern titles with stable FPS.', date: '2026-05-18' },
  { id: 'r3', userId: 'u4', userName: 'David Smith', rating: 5, comment: 'Outstanding. The keyboard feels amazing, similar to the legacy tactile models. True workstation laptop. Perfect for compiling large projects.', date: '2026-05-20' },
  { id: 'r4', userId: 'u3', userName: 'Emily Watson', rating: 5, comment: 'Absolutely stellar value. Best student companion. Incredible weight and keyboard layout for studying and programming on-the-go.', date: '2026-05-24' }
];

let products: Product[] = [
  {
    id: 'p1',
    name: 'ZenBook Pro Duo 15',
    brand: 'ASUS',
    price: 2499,
    description: 'The ultimate professional dual-screen workstation laptop. Designed for programmers, designers, and video editors who need screen real-estate. Equipped with full width UHD ASUS ScreenPad Plus secondary touchscreen that tilts automatically for optimal viewing comfort.',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      processor: 'Intel Core i9-13900H (14-Core, up to 5.4GHz)',
      ram: '32GB LPDDR5 Dual Channel',
      storage: '2TB PCIe Gen4 NVMe M.2 SSD',
      graphics: 'NVIDIA GeForce RTX 4070 (8GB GDDR6)',
      display: '15.6" 4K (3840 x 2160) OLED HDR Touchscreen 120Hz',
      battery: '92WHr (Up to 7 hours)'
    },
    category: 'Premium',
    stock: 12,
    rating: 4.8,
    reviews: [initialReviews[0], initialReviews[1]],
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: 'p2',
    name: 'Blade 16 Extreme',
    brand: 'Razer',
    price: 3299,
    description: 'Elite, thin, high-performance gaming rig wrapped in CNC aluminum. Features dual-mode mini-LED display allowing instant toggle between ultra-high 4K resolution at 120Hz for designers and fast Full HD at 240Hz for competitive gaming.',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2fe536?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      processor: 'Intel Core i9-14900HX (24-Core, up to 5.8GHz)',
      ram: '32GB DDR5 5600MHz (Upgradable)',
      storage: '2TB PCIe 4.0 NVMe SSD',
      graphics: 'NVIDIA GeForce RTX 4080 (12GB GDDR6)',
      display: '16" QHD+ Mini-LED 240Hz Dual-Mode panel',
      battery: '95WHr (Up to 5 hours)'
    },
    category: 'Gaming',
    stock: 8,
    rating: 4.6,
    reviews: [initialReviews[1]],
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: 'p3',
    name: 'MacBook Pro 16" M3 Max',
    brand: 'Apple',
    price: 3499,
    description: 'The supreme workstation engineered for demanding workflows. Absolute performance without throttling, whether connected or running on battery. Phenomenal dynamic range Liquid Retina XDR screen with supreme acoustics and gorgeous space black anodized finish.',
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      processor: 'Apple M3 Max (16-Core CPU, 40-Core GPU)',
      ram: '48GB Unified Memory',
      storage: '1TB Superfast SSD (Up to 7.4GB/s)',
      graphics: 'Apple 40-Core Custom GPU (Hardware-accelerated ray tracing)',
      display: '16.2" Liquid Retina XDR display (3456 x 2234, 120Hz ProMotion)',
      battery: '100WHr (Up to 22 hours)'
    },
    category: 'Premium',
    stock: 15,
    rating: 4.9,
    reviews: [initialReviews[2]],
    isBestSeller: true,
    isNewArrival: true
  },
  {
    id: 'p4',
    name: 'ThinkPad X1 Carbon Gen 11',
    brand: 'Lenovo',
    price: 1899,
    description: 'The legendary pinnacle of business laptops. Built to military standards with incredibly lightweight carbon-fiber chassis. Iconic tactile keyboard, dual discrete Thunderbolt 4 ports, advanced biometric privacy guard, and superior thermal dissipation.',
    images: [
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504707142491-49788d038d1e?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      processor: 'Intel Core i7-1365U vPro (10-Core, up to 5.2GHz)',
      ram: '16GB LPDDR5 6400MHz',
      storage: '1TB PCIe Gen4 NVMe SSD Class 40',
      graphics: 'Intel Iris Xe Graphics (Integrated)',
      display: '14" WUXGA (1920 x 1200) IPS Anti-glare Touchscreen',
      battery: '57WHr (Up to 14 hours)'
    },
    category: 'Business',
    stock: 20,
    rating: 4.7,
    reviews: [initialReviews[2]],
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: 'p5',
    name: 'XPS 15 InfinityEdge',
    brand: 'Dell',
    price: 1999,
    description: 'Stunning bezels with fully immersive 16:10 InfinityEdge screen. Premium carbon-fiber palm rest and CNC aeronautical-grade platinum gray shell. Exceptional balanced platform for power-users, programmers, and students alike.',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      processor: 'Intel Core i7-13700H (14-Core, up to 5.0GHz)',
      ram: '32GB DDR5 Dual Channel',
      storage: '1TB PCIe NVMe SSD',
      graphics: 'NVIDIA GeForce RTX 4050 (6GB GDDR6)',
      display: '15.6" 3.5K OLED InfinityEdge Gold-Certified Touchscreen',
      battery: '86WHr (Up to 9 hours)'
    },
    category: 'Premium',
    stock: 10,
    rating: 4.5,
    reviews: [initialReviews[0]],
    isBestSeller: false,
    isNewArrival: false
  },
  {
    id: 'p6',
    name: 'Swift Go Pro 14',
    brand: 'Acer',
    price: 899,
    description: 'Unbelievable slim value offering high-speed performance. Incorporates a gorgeous high-density OLED monitor and modern lightweight composition. Equipped with state-of-the-art thermal technology to maintain operations silent for study sessions.',
    images: [
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      processor: 'AMD Ryzen 7 7840U (8-Core, up to 5.1GHz)',
      ram: '16GB LPDDR5 (Onboard)',
      storage: '512GB PCIe Gen4 NVMe SSD',
      graphics: 'AMD Radeon 780M (Modern discrete-class Integrated)',
      display: '14" 2.8K (2880 x 1800) OLED 120Hz IPS display',
      battery: '65WHr (Up to 11 hours)'
    },
    category: 'Student',
    stock: 25,
    rating: 4.6,
    reviews: [initialReviews[3]],
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: 'p7',
    name: 'Victus 16 Edition',
    brand: 'HP',
    price: 1199,
    description: 'Accessible gaming laptop delivering superb processing velocity and rich colors. Dual fan ventilation keeps the system running cool under heavy multi-tasking and gameplay loads. Excellent starter rig for gaming students.',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2fe536?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      processor: 'Intel Core i5-13500HX (14-Core, up to 4.7GHz)',
      ram: '16GB DDR5 Dual Channel',
      storage: '1TB PCIe SSD',
      graphics: 'NVIDIA GeForce RTX 4060 (8GB GDDR6)',
      display: '16.1" FHD (1920 x 1080) 144Hz IPS display',
      battery: '70WHr (Up to 6 hours)'
    },
    category: 'Gaming',
    stock: 14,
    rating: 4.4,
    reviews: [],
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: 'p8',
    name: 'Pavilion Aero Ultra',
    brand: 'HP',
    price: 749,
    description: 'Incredibly lightweight magnesium-aluminum body weighing less than 1 kilogram. Remarkable screen clarity and battery efficiency for students. Ideal travel and classroom partner that fits easily in any standard backpack.',
    images: [
      'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      processor: 'AMD Ryzen 5 7535U (6-Core, up to 4.5GHz)',
      ram: '16GB DDR5 5200MHz',
      storage: '512GB NVMe SSD Fast Class',
      graphics: 'AMD Radeon Graphics (Integrated)',
      display: '13.3" WUXGA (1920 x 1200) IPS 100% sRGB screen',
      battery: '43WHr (Up to 10 hours)'
    },
    category: 'Student',
    stock: 30,
    rating: 4.5,
    reviews: [],
    isBestSeller: false,
    isNewArrival: false
  }
];

// Users Store
let users: User[] = [
  { id: 'u1', email: 'admin@techlaptop.com', name: 'John Admin', isAdmin: true, phone: '+1 (555) 019-2831', address: '100 Silicon Blvd, San Jose, CA', joinedDate: '2026-01-10' },
  { id: 'u2', email: 'customer@test.com', name: 'Alex Johnson', isAdmin: false, phone: '+1 (555) 012-3456', address: '456 Pine Ave, Chicago, IL', joinedDate: '2026-03-15' },
  { id: 'u3', email: 'emily@test.com', name: 'Emily Watson', isAdmin: false, phone: '+1 (555) 044-8899', address: '789 Oak Way, Seattle, WA', joinedDate: '2026-04-12' }
];

// Password storage simulation (hashless simple secure dictionary)
const passwords: Record<string, string> = {
  'admin@techlaptop.com': 'admin123',
  'customer@test.com': 'user123',
  'emily@test.com': 'user123'
};

// Logged in tokens simulation
const activeTokens: Record<string, string> = {
  'admin-token-123456': 'u1',
  'user-token-123456': 'u2',
  'user-token-789012': 'u3'
};

// Order Store
let orders: Order[] = [
  {
    id: 'ord-1001',
    userId: 'u2',
    customerName: 'Alex Johnson',
    customerEmail: 'customer@test.com',
    items: [
      { productId: 'p3', name: 'MacBook Pro 16" M3 Max', price: 3499, quantity: 1, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=400&q=80' }
    ],
    subtotal: 3499,
    discount: 0,
    total: 3499,
    shippingAddress: {
      street: '456 Pine Ave',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    status: 'Shipped',
    date: '2026-05-20',
    trackingNumber: 'LH-49281-US'
  },
  {
    id: 'ord-1002',
    userId: 'u3',
    customerName: 'Emily Watson',
    customerEmail: 'emily@test.com',
    items: [
      { productId: 'p6', name: 'Swift Go Pro 14', price: 899, quantity: 1, image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=400&q=80' }
    ],
    subtotal: 899,
    discount: 50,
    total: 849,
    shippingAddress: {
      street: '789 Oak Way',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    status: 'Processing',
    date: '2026-05-24'
  }
];

// Coupons Store
let coupons: Coupon[] = [
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minSubtotal: 500, isActive: true, description: '10% OFF on purchases over $500' },
  { code: 'SUPERLAP50', discountType: 'fixed', discountValue: 50, minSubtotal: 800, isActive: true, description: '$50 flat discount for order size above $800' },
  { code: 'GAMER200', discountType: 'fixed', discountValue: 200, minSubtotal: 2000, isActive: true, description: 'Save $200 on premium pro rigs (Minimum spend $2000)' }
];

// Auth check middleware
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized. Authorization header is missing or malformed.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const userId = activeTokens[token];
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
    return;
  }
  (req as any).userId = userId;
  next();
};

// -------------------------------------------------------------
// API CONTROLLERS
// -------------------------------------------------------------

// 1. PRODUCTS ROUTER
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const target = products.find(p => p.id === req.params.id);
  if (!target) {
    res.status(404).json({ message: 'Product not found.' });
    return;
  }
  res.json(target);
});

// Admin ONLY post/edit/delete (simulated bypass via token check in front-end, double checked here)
app.post('/api/products', authenticate, (req, res) => {
  const user = users.find(u => u.id === (req as any).userId);
  if (!user || !user.isAdmin) {
    res.status(403).json({ message: 'Forbidden. Admin privileges required.' });
    return;
  }

  const { name, brand, price, description, images, specs, category, stock } = req.body;
  if (!name || !brand || !price || !specs) {
    res.status(400).json({ message: 'Missing required configuration fields' });
    return;
  }

  const newProduct: Product = {
    id: 'p_' + Date.now(),
    name,
    brand,
    price: Number(price),
    description: description || 'High-performance laptop.',
    images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      processor: specs.processor || 'Quad-Core Processor',
      ram: specs.ram || '8GB RAM',
      storage: specs.storage || '256GB SSD',
      graphics: specs.graphics || 'Intel UHD Graphics',
      display: specs.display || '15" Display',
      battery: specs.battery || 'Up to 8 hours'
    },
    category: category || 'Student',
    stock: Number(stock) || 10,
    rating: 5.0,
    reviews: []
  };

  products.push(newProduct);
  res.status(211).json(newProduct);
});

app.put('/api/products/:id', authenticate, (req, res) => {
  const user = users.find(u => u.id === (req as any).userId);
  if (!user || !user.isAdmin) {
    res.status(403).json({ message: 'Forbidden. Admin privileges required.' });
    return;
  }

  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ message: 'Product not found.' });
    return;
  }

  const updatedProduct = {
    ...products[index],
    ...req.body,
    price: req.body.price ? Number(req.body.price) : products[index].price,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : products[index].stock
  };

  products[index] = updatedProduct;
  res.json(updatedProduct);
});

app.delete('/api/products/:id', authenticate, (req, res) => {
  const user = users.find(u => u.id === (req as any).userId);
  if (!user || !user.isAdmin) {
    res.status(403).json({ message: 'Forbidden. Admin privileges required.' });
    return;
  }

  const initialLength = products.length;
  products = products.filter(p => p.id !== req.params.id);
  if (products.length === initialLength) {
    res.status(404).json({ message: 'Product not found.' });
    return;
  }
  res.json({ success: true, message: 'Product deleted successfully.' });
});

// Post reviews
app.post('/api/products/:id/reviews', authenticate, (req, res) => {
  const user = users.find(u => u.id === (req as any).userId);
  if (!user) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  const pIndex = products.findIndex(p => p.id === req.params.id);
  if (pIndex === -1) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const { rating, comment } = req.body;
  if (!rating) {
    res.status(400).json({ message: 'Please provide a rating.' });
    return;
  }

  const newReview: Review = {
    id: 'rev_' + Date.now(),
    userId: user.id,
    userName: user.name,
    rating: Number(rating),
    comment: comment || '',
    date: new Date().toISOString().split('T')[0]
  };

  products[pIndex].reviews.push(newReview);
  // Recalculate average rating
  const allRatings = products[pIndex].reviews.map(r => r.rating);
  const sum = allRatings.reduce((a, b) => a + b, 0);
  products[pIndex].rating = Number((sum / allRatings.length).toFixed(1));

  res.json({ success: true, product: products[pIndex] });
});

// 2. AUTHENTICATION ROUTER
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: 'Please provide name, email, and password.' });
    return;
  }

  const existing = users.find(u => u.email === email);
  if (existing) {
    res.status(400).json({ message: 'User with this email already registered.' });
    return;
  }

  const newUser: User = {
    id: 'u_' + Date.now(),
    email,
    name,
    isAdmin: false,
    joinedDate: new Date().toISOString().split('T')[0]
  };

  users.push(newUser);
  passwords[email] = password;

  const token = 'user-token-' + Date.now();
  activeTokens[token] = newUser.id;

  res.status(201).json({
    token,
    user: newUser
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'Please specify email and password.' });
    return;
  }

  const user = users.find(u => u.email === email);
  if (!user || passwords[email] !== password) {
    res.status(401).json({ message: 'Incorrect email or password combination.' });
    return;
  }

  const token = user.isAdmin ? 'admin-token-123456' : 'token_' + Math.random().toString(36).substr(2, 9);
  activeTokens[token] = user.id;

  res.json({
    token,
    user
  });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const user = users.find(u => u.id === (req as any).userId);
  if (!user) {
    res.status(404).json({ message: 'User profile not found.' });
    return;
  }
  res.json(user);
});

app.put('/api/auth/me', authenticate, (req, res) => {
  const index = users.findIndex(u => u.id === (req as any).userId);
  if (index === -1) {
    res.status(404).json({ message: 'Profile not found.' });
    return;
  }

  const { name, phone, address } = req.body;
  users[index] = {
    ...users[index],
    name: name || users[index].name,
    phone: phone || users[index].phone,
    address: address || users[index].address
  };

  res.json(users[index]);
});

// Admin-only view all customers
app.get('/api/customers', authenticate, (req, res) => {
  const currentAdmin = users.find(u => u.id === (req as any).userId);
  if (!currentAdmin || !currentAdmin.isAdmin) {
    res.status(403).json({ message: 'Admin permissions required' });
    return;
  }
  res.json(users.filter(u => !u.isAdmin));
});


// 3. ORDERS ROUTER
app.get('/api/orders', authenticate, (req, res) => {
  const user = users.find(u => u.id === (req as any).userId);
  if (!user) {
    res.status(401).json({ message: 'Invalid session' });
    return;
  }

  if (user.isAdmin) {
    // Admins see all orders
    res.json(orders);
  } else {
    // Regular users see their own orders
    res.json(orders.filter(o => o.userId === user.id));
  }
});

app.post('/api/orders', authenticate, (req, res) => {
  const user = users.find(u => u.id === (req as any).userId);
  if (!user) {
    res.status(401).json({ message: 'Invalid session' });
    return;
  }

  const { items, subtotal, discount, total, shippingAddress, paymentMethod } = req.body;
  if (!items || items.length === 0 || !shippingAddress) {
    res.status(400).json({ message: 'Missing purchase details.' });
    return;
  }

  // Stock availability check & decrement
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      res.status(400).json({ message: `System error. Product id ${item.productId} does not exist.` });
      return;
    }
    if (product.stock < item.quantity) {
      res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      return;
    }
  }

  // Deduct stock
  for (const item of items) {
    const product = products.find(p => p.id === item.productId)!;
    product.stock -= item.quantity;
  }

  const newOrder: Order = {
    id: 'ord-' + Math.floor(1000 + Math.random() * 9000),
    userId: user.id,
    customerName: user.name,
    customerEmail: user.email,
    items,
    subtotal: Number(subtotal),
    discount: Number(discount || 0),
    total: Number(total),
    shippingAddress,
    paymentMethod: paymentMethod || 'Credit Card',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Update order status (Admin or customer cancellation)
app.put('/api/orders/:id/status', authenticate, (req, res) => {
  const user = users.find(u => u.id === (req as any).userId);
  if (!user) {
    res.status(401).json({ message: 'Invalid Session' });
    return;
  }

  const orderIndex = orders.findIndex(o => o.id === req.params.id);
  if (orderIndex === -1) {
    res.status(404).json({ message: 'Order records not found.' });
    return;
  }

  const currentOrder = orders[orderIndex];

  // If a regular user, they can only Cancel their own pending orders.
  if (!user.isAdmin) {
    if (currentOrder.userId !== user.id) {
      res.status(403).json({ message: 'Forbidden. You do not own this order.' });
      return;
    }
    if (req.body.status !== 'Cancelled') {
      res.status(400).json({ message: 'Regular users can only cancel orders.' });
      return;
    }
    if (currentOrder.status !== 'Pending') {
      res.status(400).json({ message: 'Only active Pending orders can be cancelled.' });
      return;
    }
  }

  const { status, trackingNumber } = req.body;
  if (status) {
    orders[orderIndex].status = status;
  }
  if (trackingNumber) {
    orders[orderIndex].trackingNumber = trackingNumber;
  }

  res.json(orders[orderIndex]);
});


// 4. COUPONS ROUTER
app.get('/api/coupons', (req, res) => {
  res.json(coupons);
});

app.post('/api/coupons', authenticate, (req, res) => {
  const user = users.find(u => u.id === (req as any).userId);
  if (!user || !user.isAdmin) {
    res.status(403).json({ message: 'Forbidden. Admin credentials required.' });
    return;
  }

  const { code, discountType, discountValue, minSubtotal, description } = req.body;
  if (!code || !discountType || !discountValue) {
    res.status(400).json({ message: 'Please provide code, type, and discount value.' });
    return;
  }

  const newCoupon: Coupon = {
    code: code.toUpperCase().trim(),
    discountType,
    discountValue: Number(discountValue),
    minSubtotal: minSubtotal ? Number(minSubtotal) : undefined,
    isActive: true,
    description: description || `${discountValue} discount coupon`
  };

  coupons.push(newCoupon);
  res.status(201).json(newCoupon);
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code || !subtotal) {
    res.status(400).json({ message: 'Enter promo code and current subtotal.' });
    return;
  }

  const coupon = coupons.find(c => c.code === code.toUpperCase().trim() && c.isActive);
  if (!coupon) {
    res.status(404).json({ message: 'Invalid, deactivated, or expired coupon code.' });
    return;
  }

  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    res.status(400).json({ message: `Coupon is valid for orders over $${coupon.minSubtotal}.` });
    return;
  }

  res.json({ success: true, coupon });
});


// 5. ANALYTICS & DASHBOARD METRICS ROUTER
app.get('/api/analytics', authenticate, (req, res) => {
  const user = users.find(u => u.id === (req as any).userId);
  if (!user || !user.isAdmin) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  // Compute stats
  const totalSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = orders.length;
  const totalCustomers = users.filter(u => !u.isAdmin).length;
  const totalProductsCount = products.reduce((sum, p) => sum + p.stock, 0);

  // Sales by categories
  const categorySales: Record<string, number> = {};
  products.forEach(p => {
    categorySales[p.category] = 0;
  });

  orders.forEach(ord => {
    if (ord.status !== 'Cancelled') {
      ord.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          categorySales[product.category] = (categorySales[product.category] || 0) + (item.price * item.quantity);
        }
      });
    }
  });

  // Recent 5 sales
  const recentSales = orders.slice(-5).reverse();

  res.json({
    metrics: {
      totalSales,
      totalOrders,
      totalCustomers,
      totalProductsCount
    },
    categorySales,
    recentSales
  });
});

// -------------------------------------------------------------
// VITE DEV SERVER CONGRUENCE
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express] Laptop ECommerce site listening at http://localhost:${PORT}`);
  });
}

startServer();
