import React, { useState } from 'react';
import { CreditCard, Ticket, MapPin, Truck, CheckCircle2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { CartItem, Coupon, Currency, Language } from '../types';
import { formatCurrency, translations } from '../localization';

interface CheckoutFormProps {
  cart: CartItem[];
  currency: Currency;
  language: Language;
  onPlaceOrder: (shippingAddress: any, paymentMethod: string, appliedCoupon: Coupon | null, discountAmount: number) => Promise<any>;
  userProfile: any;
  onBackToCart: () => void;
}

export default function CheckoutForm({
  cart,
  currency,
  language,
  onPlaceOrder,
  userProfile,
  onBackToCart
}: CheckoutFormProps) {
  const t = translations[language];

  // Address entries
  const [street, setStreet] = useState(userProfile?.address || '');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('USA');

  // Billing particulars
  const [cardName, setCardName] = useState(userProfile?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  // Coupon promo input code
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Status metrics
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<any>(null);

  // Math aggregates
  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getSubtotal();
    if (appliedCoupon.discountType === 'percentage') {
      return (subtotal * appliedCoupon.discountValue) / 100;
    }
    return appliedCoupon.discountValue;
  };

  const getFinalTotal = () => {
    return Math.max(0, getSubtotal() - getDiscountAmount());
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setPromoError('');
    setPromoSuccess('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal: getSubtotal() })
      });

      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.message || 'Failed to validate promo code.');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data.coupon);
        setPromoSuccess(`Succeeded! applied promo discount: ${
          data.coupon.discountType === 'percentage' 
            ? `${data.coupon.discountValue}% OFF` 
            : `$${data.coupon.discountValue} OFF`
        }`);
      }
    } catch (err) {
      setPromoError('Network connection issue verifying coupon.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode) {
      alert('Please fill out all mandatory shipping addresses.');
      return;
    }

    setIsSubmitting(true);
    try {
      const shipAddress = { street, city, state, zipCode, country };
      const receipt = await onPlaceOrder(shipAddress, paymentMethod, appliedCoupon, getDiscountAmount());
      setOrderReceipt(receipt);
    } catch (err: any) {
      alert(err.message || 'Error occurred while processing payment checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS PAYMENT SCREEN GREETINGS
  if (orderReceipt) {
    return (
      <div id="checkout-success-view" className="rounded-2xl border border-green-150 bg-green-50/50 p-8 text-center dark:border-green-950 dark:bg-green-950/20 max-w-2xl mx-auto my-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white shadow-md">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
          Order Completed! 🎉
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          A confirmation receipt message has been transmitted to <span className="font-bold text-orange-600 dark:text-orange-400">{orderReceipt.customerEmail}</span> with your package tracking code!
        </p>

        {/* ORDER RECEIPT SUMMARY */}
        <div className="my-6 rounded-xl border border-neutral-150 bg-white p-5 text-left dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b pb-3 text-xs mb-3 font-semibold text-neutral-400 uppercase">
            <span>RECEIPT ID: {orderReceipt.id}</span>
            <span>{orderReceipt.date}</span>
          </div>
          <p className="text-xs text-neutral-500 mb-1">Shipping To:</p>
          <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
            {orderReceipt.customerName}
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {orderReceipt.shippingAddress.street}, {orderReceipt.shippingAddress.city}, {orderReceipt.shippingAddress.state} - {orderReceipt.shippingAddress.zipCode}
          </p>

          <div className="mt-4 border-t pt-3 flex items-center justify-between font-bold text-neutral-900 dark:text-white">
            <span className="flex items-center gap-1.5 text-xs"><Truck className="h-4 w-4 text-orange-600" /> Tracking State:</span>
            <span className="rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[10px] px-2.5 py-1">
              {orderReceipt.status}
            </span>
          </div>
          
          <div className="mt-4 border-t border-dashed pt-3 flex items-center justify-between text-base font-black">
            <span>Total Paid (incl. promo)</span>
            <span className="text-orange-600 dark:text-orange-400">
              {formatCurrency(orderReceipt.total, currency)}
            </span>
          </div>
        </div>

        <button
          onClick={onBackToCart}
          className="rounded-xl bg-neutral-900 hover:bg-neutral-850 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  return (
    <form id="checkout-entry-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-4">
      
      {/* SHPPING & PAYMENT FORM (LEFT 7 COLS) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* SHIPPING FORM */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs dark:border-neutral-850 dark:bg-neutral-900/40">
          <div className="mb-4 flex items-center gap-2 border-b pb-3">
            <MapPin className="h-5 w-5 text-orange-600" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Shipping Address DETAILS</h3>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={street}
                onChange={e => setStreet(e.target.value)}
                placeholder="Ex. 123 Pine Stree, Apt 4"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Chicago"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1">State / Province *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="IL"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1">Postal ZIP Code *</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  placeholder="60601"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="USA"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs dark:border-neutral-850 dark:bg-neutral-900/40">
          <div className="mb-4 flex items-center gap-2 border-b pb-3">
            <CreditCard className="h-5 w-5 text-orange-600" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Secure Bank Payment</h3>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2">
            {['Credit Card', 'PayPal', 'Wire Transfer'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMethod(m)}
                className={`rounded-xl border py-2.5 text-xs font-semibold text-center transition-all ${
                  paymentMethod === m
                    ? 'border-orange-600 bg-orange-50/40 text-orange-600 dark:bg-orange-950/20'
                    : 'border-neutral-200 text-neutral-600 dark:border-neutral-800 dark:text-neutral-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {paymentMethod === 'Credit Card' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1">Cardholder Name *</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1">Card Number *</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  placeholder="4111 2222 3333 4444"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1">Expiration (MM/YY) *</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1">Security CVV *</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod !== 'Credit Card' && (
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-500 dark:bg-neutral-900 dark:border-neutral-800">
              You will be redirected safely to finish your {paymentMethod} transaction secure channel upon placing the order.
            </div>
          )}
        </div>

      </div>

      {/* SUMMARY REVIEW & COPUNS (RIGHT 5 COLS) */}
      <div className="lg:col-span-5 flex flex-col gap-6">

        {/* ORDERED RECAP CARDS */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs dark:border-neutral-850 dark:bg-neutral-900/40">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-4">Item review</h3>
          <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto mb-4">
            {cart.map(item => (
              <div key={item.product.id} className="flex gap-3 items-center">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-10 w-14 shrink-0 object-cover rounded bg-neutral-100"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-250 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[10px] text-neutral-400">
                    Qty: {item.quantity} • {item.product.brand}
                  </p>
                </div>
                <div className="text-xs font-black text-neutral-900 dark:text-white">
                  {formatCurrency(item.product.price * item.quantity, currency)}
                </div>
              </div>
            ))}
          </div>

          {/* COUPON INPUT BOX */}
          <div className="border-t pt-4">
            <label className="block text-[11.5px] font-bold text-neutral-500 uppercase mb-1.5 flex items-center gap-1.5">
              <Ticket className="h-3.5 w-3.5 text-orange-600 animate-bounce" /> Apply Promo Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex. WELCOME10, SUPERLAP50"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs uppercase focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={isApplying || !couponCode.trim()}
                className="rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white text-xs font-black px-4 py-2 transition-all"
              >
                {isApplying ? 'Applying...' : 'Apply'}
              </button>
            </div>
            {promoError && <p className="mt-1.5 text-[11px] font-semibold text-red-600">{promoError}</p>}
            {promoSuccess && <p className="mt-1.5 text-[11px] font-semibold text-green-600">{promoSuccess}</p>}
          </div>

          {/* TOTAL MATHEMATICAL BREAKDOWN */}
          <div className="border-t mt-4 pt-4 flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between text-neutral-500">
              <span>Items Total (Subtotal)</span>
              <span>{formatCurrency(getSubtotal(), currency)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span className="flex items-center gap-1">Discount ({appliedCoupon.code})</span>
                <span>-{formatCurrency(getDiscountAmount(), currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-500">
              <span>Shipping Fee</span>
              <span className="text-green-600 font-semibold tracking-wider">FREE DELIVER</span>
            </div>
            <div className="border-t border-dashed pt-3 flex justify-between text-base font-black text-neutral-950 dark:text-white">
              <span>Grand Total</span>
              <span className="text-orange-600 dark:text-orange-400">
                {formatCurrency(getFinalTotal(), currency)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className="w-full mt-6 rounded-xl bg-neutral-950 text-white font-extrabold hover:bg-neutral-850 disabled:opacity-50 py-3 text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? 'PROCESSING PAYMENT...' : (t.checkoutButton || 'Proceed to Secure Checkout')}
          </button>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-semibold">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span>Encrypted 256-bit bank security server.</span>
          </div>
        </div>

        {/* RETURN LINK */}
        <button
          type="button"
          onClick={onBackToCart}
          className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
        >
          ← Edit shopping cart details
        </button>

      </div>

    </form>
  );
}
