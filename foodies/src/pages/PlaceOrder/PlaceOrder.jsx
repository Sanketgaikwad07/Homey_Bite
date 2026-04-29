import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { calculateCartTotal } from '../../util/cartUtil';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RAZORPAY_KEY } from '../../util/contents';
import { useNavigate } from 'react-router-dom';
import { buildAuthHeader } from '../../Service/http';



const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const getAuthToken = () => (token || localStorage.getItem('token') || '').trim();
  const authToken = getAuthToken();

  const PENDING_PAYMENT_KEY = 'pending_payment_verification';

  const savePendingPayment = (paymentData) => {
    try {
      localStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(paymentData));
    } catch (e) {
      // ignore
    }
  };
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    location: '',
    pinCode: ''
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const cartItem = foodList.filter((food) => quantities[food.id] > 0);
  const { subTotal, tax, shipping, total } = calculateCartTotal(cartItem, quantities);

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8080/api/orders/${orderId}`, {
        headers: buildAuthHeader(getAuthToken())
      });
    } catch (error) {
      toast.error('Error deleting order. Please contact support.');
    }
  };

  const clearCart = async () => {
    // Immediately clear local cart UI
    setQuantities({});
    try { localStorage.removeItem('cart_quantities'); } catch {}

    // Attempt to clear server-side cart; retry once on token refresh
    const attemptServerClear = async (tokenToUse) => {
      if (!tokenToUse) return false;
      try {
        await axios.delete('http://localhost:8080/api/cart', {
          headers: buildAuthHeader(tokenToUse)
        });
        return true;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.debug('clearCart server attempt error:', err?.response?.status, err?.response?.data || err?.message);
        return false;
      }
    };

    try {
      const tokenNow = getAuthToken();
      let ok = await attemptServerClear(tokenNow);
      if (!ok) {
        // re-load token from storage in case it was refreshed during checkout/login
        const reloaded = (localStorage.getItem('token') || '').trim();
        if (reloaded && reloaded !== tokenNow) {
          ok = await attemptServerClear(reloaded);
        }
      }
      if (!ok) {
        // mark pending server clear to retry later (e.g., after login)
        try { localStorage.setItem('pending_server_cart_clear', '1'); } catch {}
      } else {
        try { localStorage.removeItem('pending_server_cart_clear'); } catch {}
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.debug('clearCart unexpected error:', e?.message || e);
      try { localStorage.setItem('pending_server_cart_clear', '1'); } catch {}
    }
  };

 

  const verifyPayment = async (razorpayResponse) => {
    const paymentData = {
      razorpayPaymentId: razorpayResponse.razorpay_payment_id,
      razorpayOrderId: razorpayResponse.razorpay_order_id,
      razorpaySignature: razorpayResponse.razorpay_signature
    };

    const currentToken = getAuthToken();
    if (!currentToken) {
      savePendingPayment(paymentData);
      toast.error('Session expired. Please log in again to complete verification.');
      navigate('/login', { state: { pendingPayment: true } });
      return false;
    }

    try {
      // eslint-disable-next-line no-console
      console.debug('verifyPayment token=', currentToken, 'headers=', buildAuthHeader(currentToken));

      const response = await axios.post('http://localhost:8080/api/orders/verify', paymentData, {
        headers: buildAuthHeader(currentToken)
      });
      // eslint-disable-next-line no-console
      console.debug('verifyPayment response:', response);
      const verified = response?.data?.success === true || (response?.status >= 200 && response?.status < 300);
      return verified;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.debug('verifyPayment error:', error?.response?.status, error?.response?.data || error.message);
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        savePendingPayment(paymentData);
        toast.error('Session expired. Please log in again to complete verification.');
        navigate('/login', { state: { pendingPayment: true } });
        return false;
      }
      toast.error('Error verifying payment. Please contact support.');
      return false;
    }
  };

  const initializeRazorpayPayment = (order) => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK not loaded. Please refresh and try again.');
      return;
    }

    
    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round(Number(order.amount) * 100),
      currency: 'INR',
      name: 'Foodies',
      description: 'Order Payment',
      // Omit `image` to avoid Razorpay trying to fetch a loopback (localhost) URL
      // which the browser will block when requested from api.razorpay.com.
      // If you need a logo inside the checkout, use a remote HTTPS URL or a data-URL.
      order_id: order.razorpayOrderId,
      handler: async function (razorpayResponse) {
        toast.success('Payment received. Verifying...');
        // Clear local cart UI so user sees completed purchase
        try {
          setQuantities({});
          localStorage.removeItem('cart_quantities');
          try { localStorage.setItem('lastPaymentCleared', '1'); } catch {}
        } catch (e) {
          // ignore
        }

        // Verify payment with backend and only navigate on success
        try {
          const verified = await verifyPayment(razorpayResponse);
          if (verified) {
            toast.success('Payment successful! Your order has been placed.');
            // clear server cart and update UI
            try { await clearCart(); } catch (e) { /* ignore server clear errors */ }
            navigate('/myorder');
          } else {
            toast.error('Payment verification failed. Please contact support.');
            navigate('/');
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.debug('handler verify error:', err);
          toast.error('Error verifying payment. Please contact support.');
          navigate('/');
        }
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phone
      },
      theme: { color: '#F37254' },
      modal: {
        ondismiss: async function () {
          toast.info('Payment cancelled. Please try again.');
          if (order.id) {
            await deleteOrder(order.id);
          }
        }
      }
    };

    // Create instance in a variable that the handler can close to avoid overlay race
    let razorpay = null;
    razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!authToken) {
      toast.error('Please log in to place an order.');
      navigate('/login');
      return;
    }

    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.location}, ${data.state} - ${data.pinCode}`,
      email: data.email,
      phone: data.phone,
      orderItems: cartItem.map((item) => ({
        foodId: item.id,
        categories: item.categories,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name,
        quantity: quantities[item.id],
        price: item.price * quantities[item.id]
      })),
      amount: Number(total.toFixed(2)),
      orderStatus: 'Done'
    };

    try {
      // eslint-disable-next-line no-console
      console.debug('createOrder payload:', orderData);
      const response = await axios.post(
        "http://localhost:8080/api/orders/create",
        orderData,
        { headers: buildAuthHeader(getAuthToken()) }
      );
      // Log response for debugging
      // eslint-disable-next-line no-console
      console.debug('createOrder response:', response);

      const respData = response?.data || {};
      // normalize possible backend shapes
      const normalized = {
        ...respData,
        razorpayOrderId: respData.razorpayOrderId || respData.razorpay_order_id,
        amount: respData.amount || orderData.amount,
        id: respData.id || respData.orderId || respData.orderID
      };

      if (response.status >= 200 && response.status < 300 && normalized.razorpayOrderId) {
        initializeRazorpayPayment(normalized);
      } else {
        toast.error('Failed to create order. Please try again.');
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
        return;
      }
      // eslint-disable-next-line no-console
      console.debug('createOrder error:', error?.response?.status, error?.response?.data || error.message);
      toast.error('Error placing order, please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <main>
        <div className="py-5 text-center">
          <img className="d-block mx-auto " src={assets.logo} alt="" width="90" height="90" />
        </div>

        <div className="row g-4 place-order-row">
          <div className="col-lg-8 order-1 order-lg-1">
            <h4 className="mb-3">Billing address</h4>

            <form className="needs-validation" onSubmit={onSubmitHandler}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="firstName">First name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder="Ram"
                    required
                    name="firstName"
                    value={data.firstName}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder="Gaikwad"
                    value={data.lastName}
                    onChange={onChangeHandler}
                    name="lastName"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="Email">Email</label>
                <div className="input-group">
                  <span className="input-group-text">@</span>
                  <input
                    type="email"
                    className="form-control"
                    id="Email"
                    placeholder="Email"
                    required
                    value={data.email}
                    onChange={onChangeHandler}
                    name="email"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="address">Phone Number</label>
                <input
                  type="number"
                  className="form-control"
                  id="phone"
                  placeholder="9404561920"
                  required
                  value={data.phone}
                  onChange={onChangeHandler}
                  name="phone"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="123 main road, near bus stop"
                  required
                  value={data.address}
                  onChange={onChangeHandler}
                  name="address"
                />
              </div>

              <div className="row">
                <div className="col-md-5 mb-3">
                  <label htmlFor="state">State</label>
                  <select
                    className="custom-select d-block w-100"
                    id="state"
                    required
                    name="state"
                    value={data.state}
                    onChange={onChangeHandler}
                  >
                    <option value="">Choose...</option>
                    <option>Maharashtra</option>
                    <option>Gujarat</option>
                    <option>Rajasthan</option>
                    <option>Kerala</option>
                    <option>Punjab</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="location">Location</label>
                  <select
                    className="custom-select d-block w-100"
                    id="location"
                    required
                    name="location"
                    value={data.location}
                    onChange={onChangeHandler}
                  >
                    <option value="">Choose...</option>
                    <option>Pune</option>
                    <option>Shirdi</option>
                    <option>ahilyanagar</option>
                    <option>Loni</option>
                    <option>Sppu</option>
                    <option>Baramati</option>
                    <option>Satara</option>
                  </select>
                </div>

                <div className="col-md-3 mb-3">
                  <label htmlFor="pinCode">Pin Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="pinCode"
                    required
                    value={data.pinCode}
                    onChange={onChangeHandler}
                    name="pinCode"
                  />
                </div>
              </div>

              <hr className="mb-4" />
              <hr className="mb-4" />

              <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={cartItem.length === 0}>
                Continue to checkout
              </button>
            </form>
          </div>

          <div className="col-lg-4 mb-4 order-2 order-lg-2">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Your cart</span>
              <span className="badge badge-secondary badge-pill">{cartItem.length}</span>
            </h4>

            <ul className="list-group mb-3">
              {cartItem.map((item) => (
                <li className="list-group-item d-flex justify-content-between lh-condensed" key={item.id}>
                  <div>
                    <h6 className="my-0">{item.name}</h6>
                    <small className="text-muted">qty:{quantities[item.id]}</small>
                  </div>
                  <span className="text-muted"> &#8377;{item.price * quantities[item.id]}</span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <div>
                  <span>Shipping </span>
                </div>
                <span className="text-muted">&#8377;{subTotal === 0 ? 0.0 : shipping.toFixed(2)}</span>
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <div>
                  <span>Tax (10%)</span>
                </div>
                <span className="text-muted">&#8377;{tax.toFixed(2)}</span>
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <span>Total (INR)</span>
                <strong>&#8377; {total.toFixed(2)}</strong>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceOrder;
