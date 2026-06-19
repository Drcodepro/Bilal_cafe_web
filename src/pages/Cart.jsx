import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoArrowBack,
  IoQrCodeOutline,
  IoCheckmarkCircleSharp,
  IoWalletOutline,
  IoCheckmarkCircle
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, useCartDispatch, useCartSummary } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { sanitizeNote } from '../utils/sanitize';

/**
 * Cart page — shows current cart items with stepper controls,
 * location banner, ETA, note field, bill summary,
 * payment methods, simulated processing state, and invoice receipt generation.
 */
export default function Cart() {
  const navigate = useNavigate();
  const { items } = useCart();
  const dispatch = useCartDispatch();
  const { total, subtotal, taxes } = useCartSummary();
  const [note, setNote] = useState('');

  // Payment states
  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi', 'netbanking', 'card'
  const [selectedUpi, setSelectedUpi] = useState('gpay'); // 'gpay', 'phonepe', 'paytm', 'bhim'
  const [selectedBank, setSelectedBank] = useState('hdfc'); // bank code
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const [checkoutStage, setCheckoutStage] = useState('cart'); // 'cart', 'processing', 'receipt'
  const [processingStatus, setProcessingStatus] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleNoteChange = useCallback((e) => {
    setNote(sanitizeNote(e.target.value));
  }, []);

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardDetails(prev => ({ ...prev, number: formatted }));
  };

  const handleCardExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardDetails(prev => ({ ...prev, expiry: formatted }));
  };

  const handleCardCvvChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardDetails(prev => ({ ...prev, cvv: raw }));
  };

  const handleCardNameChange = (e) => {
    const sanitized = sanitizeNote(e.target.value).slice(0, 50);
    setCardDetails(prev => ({ ...prev, name: sanitized }));
  };

  // Validate if payment form details are complete
  const canPay = useMemo(() => {
    if (items.length === 0) return false;
    if (paymentTab === 'upi') return !!selectedUpi;
    if (paymentTab === 'netbanking') return !!selectedBank;
    if (paymentTab === 'card') {
      const cleanNum = cardDetails.number.replace(/\s/g, '');
      return cleanNum.length === 16 &&
        cardDetails.expiry.length === 5 &&
        cardDetails.cvv.length === 3 &&
        cardDetails.name.trim().length > 2;
    }
    return false;
  }, [items, paymentTab, selectedUpi, selectedBank, cardDetails]);

  // Simulate payment processing flow
  const handlePay = () => {
    if (!canPay) return;

    setCheckoutStage('processing');
    setProcessingStatus('Securing payment gateway...');

    setTimeout(() => {
      setProcessingStatus('Authorizing transaction with bank...');

      setTimeout(() => {
        setProcessingStatus('Finalizing secure order...');

        setTimeout(() => {
          setProcessingStatus('Payment successful!');

          const orderId = `ord-${Math.floor(100000 + Math.random() * 900000)}`;
          const orderNum = `#BKB-${Math.floor(1000 + Math.random() * 9000)}`;

          let payLabel = '';
          if (paymentTab === 'upi') {
            const upiNames = { gpay: 'Google Pay', phonepe: 'PhonePe', paytm: 'Paytm', bhim: 'BHIM UPI' };
            payLabel = `UPI (${upiNames[selectedUpi] || selectedUpi.toUpperCase()})`;
          } else if (paymentTab === 'netbanking') {
            const bankNames = { sbi: 'State Bank of India', hdfc: 'HDFC Bank', icici: 'ICICI Bank', axis: 'Axis Bank' };
            payLabel = `Net Banking (${bankNames[selectedBank] || selectedBank.toUpperCase()})`;
          } else {
            payLabel = 'Credit/Debit Card';
          }

          const newOrder = {
            id: orderId,
            restaurantName: 'Bilal',
            items: items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            totalAmount: total,
            status: 'Delivered',
            date: new Date().toISOString(),
            orderNumber: orderNum,
            paymentMethod: payLabel,
            note: note.trim() || undefined
          };

          try {
            const stored = localStorage.getItem('bilal_orders');
            const parsedStored = stored ? JSON.parse(stored) : [];
            localStorage.setItem('bilal_orders', JSON.stringify([newOrder, ...parsedStored]));
          } catch (err) {
            console.error('Failed to save order to local storage', err);
          }

          setPlacedOrder(newOrder);

          setTimeout(() => {
            setCheckoutStage('receipt');
          }, 800);

        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleReceiptDone = () => {
    dispatch({ type: 'CLEAR_CART' });
    navigate('/');
  };

  // Group items by category for display
  const categorizedItems = items.reduce((acc, item) => {
    const cat = item.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categoryLabels = {
    biryani: '🍚 Bilal Specialties',
    kebabs: '🍢 Kebabs & Tikka',
    starters: '🥘 Starters',
    breads: '🫓 Breads',
    beverages: '🥤 Beverages',
    desserts: '🍮 Desserts',
    other: '📦 Other',
  };

  // Render printed invoice bill screen
  if (checkoutStage === 'receipt' && placedOrder) {
    const formattedDate = new Date(placedOrder.date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = new Date(placedOrder.date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return (
      <>
        <div className="page-header">
          <h1 className="page-header__title" style={{ marginLeft: '16px' }}>Invoice Receipt</h1>
        </div>

        <div className="page-content receipt-container">
          <div className="receipt-bill">
            <div className="receipt-header">
              <img src="/logo.png" alt="Bilal Cafe Logo" className="receipt-header__logo" />
              <div className="receipt-header__title">Bilal Kebabs & Biryani</div>
              <div className="receipt-header__subtitle">
                Mount Road, Chennai - 600002<br />
                Ph: +91 98765 43210
              </div>
            </div>

            <div className="receipt-meta">
              <div className="receipt-meta__row">
                <span>ORDER ID:</span>
                <span>{placedOrder.id}</span>
              </div>
              <div className="receipt-meta__row">
                <span>RECEIPT:</span>
                <span>{placedOrder.orderNumber}</span>
              </div>
              <div className="receipt-meta__row">
                <span>DATE/TIME:</span>
                <span>{formattedDate} {formattedTime}</span>
              </div>
              <div className="receipt-meta__row">
                <span>PAY METHOD:</span>
                <span>{placedOrder.paymentMethod}</span>
              </div>
            </div>

            <div className="receipt-items">
              <table className="receipt-items__table">
                <thead>
                  <tr>
                    <th className="receipt-items__th">Item Description</th>
                    <th className="receipt-items__th receipt-items__th--right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {placedOrder.items.map((item, idx) => (
                    <tr key={idx} className="receipt-item-row">
                      <td>
                        <div className="receipt-item-row__name">{item.name}</div>
                        <div className="receipt-item-row__qty-price">
                          {item.quantity} x ₹{item.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="receipt-item-row__total">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="receipt-summary">
              <div className="receipt-summary__row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="receipt-summary__row">
                <span>GST (5%)</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              <div className="receipt-summary__row receipt-summary__row--grand">
                <span>GRAND TOTAL</span>
                <span>₹{placedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="receipt-footer">
              <div className="paid-stamp">PAID</div>
              <div>Thank you for dining with us!</div>
              <div>Visit again to satisfy your Biryani cravings!</div>
            </div>
          </div>

          <button className="receipt-done-btn animate-btn" onClick={handleReceiptDone}>
            Done & Return to Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <button
          className="page-header__back"
          onClick={() => navigate(-1)}
          type="button"
          aria-label="Go back"
        >
          <IoArrowBack />
        </button>
        <h1 className="page-header__title">Cart</h1>
      </div>

      <div className="page-content cart-page">
        {items.length > 0 ? (
          <div className="cart-grid">
            <div className="cart-grid__left">

              {/* Cart Items by Category */}
              {Object.keys(categorizedItems).map((cat) => (
                <div key={cat}>
                  <div className="cart-section-title">
                    {categoryLabels[cat] || cat}
                  </div>
                  <AnimatePresence mode="popLayout">
                    {categorizedItems[cat].map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
              ))}

              {/* Note
              <div className="cart-note">
                <label className="cart-note__label" htmlFor="order-note">
                  Note
                </label>
                <textarea
                  id="order-note"
                  className="cart-note__input"
                  placeholder="Any special instructions for your order..."
                  value={note}
                  onChange={handleNoteChange}
                  maxLength={500}
                  rows={3}
                />
              </div>*/}

            </div>

            <div className="cart-grid__right">
              {/* Bill Summary */}
              <CartSummary />

              {/* Payment Section */}
              <div className="payment-section" style={{ margin: '16px 0 0 0' }}>
                <div className="payment-section__title">
                  <IoWalletOutline /> Choose Payment Method
                </div>

                <div className="payment-tabs">
                  <button
                    type="button"
                    className={`payment-tab-btn ${paymentTab === 'upi' ? 'payment-tab-btn--active' : ''}`}
                    onClick={() => setPaymentTab('upi')}
                  >
                    UPI
                  </button>
                  <button
                    type="button"
                    className={`payment-tab-btn ${paymentTab === 'netbanking' ? 'payment-tab-btn--active' : ''}`}
                    onClick={() => setPaymentTab('netbanking')}
                  >
                    Net Banking
                  </button>
                  <button
                    type="button"
                    className={`payment-tab-btn ${paymentTab === 'card' ? 'payment-tab-btn--active' : ''}`}
                    onClick={() => setPaymentTab('card')}
                  >
                    Card
                  </button>
                </div>

                {/* UPI Tab */}
                {paymentTab === 'upi' && (
                  <div className="payment-grid">
                    {[
                      { id: 'gpay', name: 'Google Pay' },
                      { id: 'phonepe', name: 'PhonePe' },
                      { id: 'paytm', name: 'Paytm' },
                      { id: 'bhim', name: 'BHIM UPI' }
                    ].map(app => (
                      <div
                        key={app.id}
                        className={`payment-option-card ${selectedUpi === app.id ? 'payment-option-card--selected' : ''}`}
                        onClick={() => setSelectedUpi(app.id)}
                      >
                        <div className="payment-option-card__logo">
                          <IoQrCodeOutline />
                        </div>
                        <span className="payment-option-card__name">{app.name}</span>
                        {selectedUpi === app.id && (
                          <IoCheckmarkCircleSharp className="payment-option-card__checked" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Net Banking Tab */}
                {paymentTab === 'netbanking' && (
                  <div className="bank-select-container">
                    <select
                      className="bank-select"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                      <option value="pnb">Punjab National Bank</option>
                    </select>
                  </div>
                )}

                {/* Card Tab */}
                {paymentTab === 'card' && (
                  <div className="card-form">
                    <div className="card-form__field">
                      <label className="card-form__label">Card Number</label>
                      <input
                        type="text"
                        className="card-form__input"
                        placeholder="0000 0000 0000 0000"
                        value={cardDetails.number}
                        onChange={handleCardNumberChange}
                      />
                    </div>
                    <div className="card-form__row">
                      <div className="card-form__field">
                        <label className="card-form__label">Expiry Date</label>
                        <input
                          type="text"
                          className="card-form__input"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={handleCardExpiryChange}
                        />
                      </div>
                      <div className="card-form__field">
                        <label className="card-form__label">CVV</label>
                        <input
                          type="password"
                          className="card-form__input"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={handleCardCvvChange}
                        />
                      </div>
                    </div>
                    <div className="card-form__field">
                      <label className="card-form__label">Cardholder Name</label>
                      <input
                        type="text"
                        className="card-form__input"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={handleCardNameChange}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Pay Button */}
              <div className="pay-btn-container" style={{ margin: '16px 0 0 0' }}>
                <button
                  type="button"
                  className="pay-btn animate-btn"
                  onClick={handlePay}
                  disabled={!canPay}
                >
                  Pay ₹{total.toFixed(2)} & Get Bill
                </button>
              </div>
            </div>
          </div>

        ) : (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="empty-state__icon">🛒</span>
            <h2 className="empty-state__title">Your cart is empty</h2>
            <p className="empty-state__desc">
              Explore our menu and add your favourite dishes to get started.
            </p>
          </motion.div>
        )}
      </div>

      {/* Processing Loader Overlay */}
      {checkoutStage === 'processing' && (
        <div className="payment-processing-overlay">
          <div className="payment-processing-card">
            {processingStatus === 'Payment successful!' ? (
              <IoCheckmarkCircle className="payment-success-icon" />
            ) : (
              <div className="payment-spinner"></div>
            )}
            <div className="payment-processing-title">
              {processingStatus === 'Payment successful!' ? 'Payment Success!' : 'Processing Payment'}
            </div>
            <div className="payment-processing-status">{processingStatus}</div>
          </div>
        </div>
      )}
    </>
  );
}

