import { Language, Currency } from './types';

export const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  VND: 25400
};

export const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  VND: '₫'
};

export function formatCurrency(amount: number, currency: Currency): string {
  const rate = exchangeRates[currency];
  const converted = amount * rate;
  if (currency === 'VND') {
    return Math.round(converted).toLocaleString('vi-VN') + currencySymbols[currency];
  }
  return currencySymbols[currency] + converted.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    heroTitle: 'Innovate Your Workflow',
    heroSub: 'Explore our handpicked collection of state-of-the-art laptops. From portable student notebooks to heavy-duty workstation systems.',
    shopNow: 'Shop Laptops',
    quickView: 'Quick View',
    features: 'Features',
    specifications: 'Specifications',
    categoryGaming: 'Gaming Powerhouses',
    categoryPremium: 'Premium Workstations',
    categoryBusiness: 'Business Professionals',
    categoryStudent: 'Student Companions',
    newsletterTitle: 'Join the Revolution',
    newsletterSub: 'Receive announcements, product launches, flash sales, and tailored discount coupons directly in your inbox.',
    subscribe: 'Subscribe',
    footerRights: 'All Rights Reserved.',
    brand: 'Brand',
    price: 'Price',
    ram: 'RAM',
    storage: 'Storage',
    processor: 'Processor',
    graphics: 'Graphics Card',
    buyNow: 'Buy Now',
    addToCart: 'Add to Cart',
    reviews: 'Reviews',
    compare: 'Compare',
    compareTitle: 'Product Comparison',
    emptyCompare: 'Select laptops to compare specs.',
    filterTitle: 'Filter Products',
    sortBy: 'Sort By',
    searchPlaceholder: 'Search laptops by brand, core, RAM...',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    cartTitle: 'Your Cart',
    checkoutButton: 'Proceed to Secure Checkout',
    emptyCart: 'Your cart is currently empty'
  },
  es: {
    heroTitle: 'Innova tu Flujo de Trabajo',
    heroSub: 'Explora nuestra colección selecta de portátiles de vanguardia. Desde cuadernos portátiles para estudiantes hasta estaciones de trabajo pesadas.',
    shopNow: 'Comprar Portátiles',
    quickView: 'Vista Rápida',
    features: 'Características',
    specifications: 'Especificaciones',
    categoryGaming: 'Gaming de Alto Rendimiento',
    categoryPremium: 'Estaciones de Trabajo Premium',
    categoryBusiness: 'Profesionales de Negocios',
    categoryStudent: 'Compañeros de Estudiantes',
    newsletterTitle: 'Únete a la Revolución',
    newsletterSub: 'Recibe anuncios, lanzamientos de productos, ventas flash y cupones de descuento personalizados directamente en tu bandeja de entrada.',
    subscribe: 'Suscribirse',
    footerRights: 'Todos los derechos reservados.',
    brand: 'Marca',
    price: 'Precio',
    ram: 'RAM',
    storage: 'Almacenamiento',
    processor: 'Procesador',
    graphics: 'Tarjeta Gráfica',
    buyNow: 'Comprar Ahora',
    addToCart: 'Añadir al Carrito',
    reviews: 'Reseñas',
    compare: 'Comparar',
    compareTitle: 'Comparación de Productos',
    emptyCompare: 'Selecciona portátiles a comparar.',
    filterTitle: 'Filtrar Productos',
    sortBy: 'Ordenar Por',
    searchPlaceholder: 'Buscar portátiles por marca, núcleo, RAM...',
    aboutUs: 'Sobre Nosotros',
    contactUs: 'Contáctanos',
    cartTitle: 'Tu Carrito',
    checkoutButton: 'Proceder al Pago Seguro',
    emptyCart: 'Tu carrito está actualmente vacío'
  },
  vi: {
    heroTitle: 'Đột Phá Hiệu Suất Làm Việc',
    heroSub: 'Khám phá bộ sưu tập máy tính xách tay cao cấp nhất. Từ các dòng máy mỏng nhẹ cho sinh viên đến các trạm làm việc hiệu năng cực khủng.',
    shopNow: 'Mua Ngay',
    quickView: 'Xem Nhanh',
    features: 'Tính Năng',
    specifications: 'Thông Số Kỹ Thuật',
    categoryGaming: 'Hiệu Năng Chơi Game',
    categoryPremium: 'Dòng Máy Cao Cấp',
    categoryBusiness: 'Doanh Nhân & Văn Phòng',
    categoryStudent: 'Học Tập & Sinh Viên',
    newsletterTitle: 'Đăng Ký Nhận Bản Tin',
    newsletterSub: 'Nhận các thông tin khuyến mãi, ra mắt sản phẩm mới và mã giảm giá độc quyền trực tiếp qua email của bạn.',
    subscribe: 'Đăng ký',
    footerRights: 'Bảo lưu mọi quyền.',
    brand: 'Thương hiệu',
    price: 'Giá cả',
    ram: 'RAM',
    storage: 'Lưu trữ',
    processor: 'Bộ vi xử lý',
    graphics: 'Card đồ họa',
    buyNow: 'Mua Ngay',
    addToCart: 'Thêm vào giỏ',
    reviews: 'Đánh giá',
    compare: 'So sánh',
    compareTitle: 'So Sánh Sản Phẩm',
    emptyCompare: 'Hãy chọn laptop để bắt đầu so sánh cấu hình.',
    filterTitle: 'Bộ Lọc Sản Phẩm',
    sortBy: 'Sắp xếp theo',
    searchPlaceholder: 'Tìm kiếm laptop theo hãng, chip, RAM...',
    aboutUs: 'Về Chúng Tôi',
    contactUs: 'Liên Hệ',
    cartTitle: 'Giỏ Hàng',
    checkoutButton: 'Tiến Hành Thanh Toán',
    emptyCart: 'Giỏ hàng của bạn đang trống'
  }
};
