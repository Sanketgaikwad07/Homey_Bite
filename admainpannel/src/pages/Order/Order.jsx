import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import { buildAuthHeader } from '../../Service/http';
import './Order.css';

const API_URL = '/api/orders';

const getOrderId = (order) => (
  order?.id ||
  order?.orderId ||
  order?.orderID ||
  order?._id ||
  order?.razorpayOrderId
);

const normalizeOrders = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
};

const getOrderItems = (order) => (
  Array.isArray(order?.orderItems) ? order.orderItems : []
);

const getRequestConfig = () => {
  const token = (localStorage.getItem('token') || localStorage.getItem('adminToken') || '').trim();

  return {
    headers: buildAuthHeader(token),
    withCredentials: true,
  };
};

const Order = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/all`, getRequestConfig());
      setData(normalizeOrders(response.data));
    } catch (err) {
      console.error('Failed to load orders', err);
      const message = err?.response?.status === 403
        ? 'Orders API is protected. Login as admin or save admin token first.'
        : err?.response?.data?.message || 'Failed to load orders';
      toast.error(message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (order, status) => {
    const id = getOrderId(order);

    if (!id) {
      toast.error('Order id missing');
      return;
    }

    const payload = { orderStatus: status };
    const config = getRequestConfig();
    const requests = [
      () => axios.patch(`${API_URL}/status/${id}`, payload, config),
      () => axios.patch(`${API_URL}/${id}/status`, payload, config),
      () => axios.patch(`${API_URL}/${id}`, payload, config),
      () => axios.put(`${API_URL}/status/${id}`, payload, config),
    ];

    try {
      let response;
      let lastError;

      for (const request of requests) {
        try {
          response = await request();
          break;
        } catch (err) {
          lastError = err;
          const statusCode = err?.response?.status;
          if (statusCode && statusCode !== 404 && statusCode !== 405) {
            throw err;
          }
        }
      }

      if (!response) throw lastError;

      toast.success('Order status updated');
      await fetchData();
    } catch (err) {
      console.error('Failed to update order status', err);
      const message = err?.response?.status === 403
        ? 'Orders API is protected. Login as admin or save admin token first.'
        : err?.response?.data?.message || 'Failed to update order status';
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <div className="card-body">
            {loading ? (
              <p>Loading...</p>
            ) : data.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="orders-list">
                {data.map((order, index) => {
                  const orderItems = getOrderItems(order);
                  const itemsTitle = orderItems.map((item) => `${item.name} x${item.quantity}`).join(', ');

                  return (
                    <div className="order-row" key={getOrderId(order) || index}>
                      <div className="order-left">
                        <img src={assets.parcel} alt="Delivery" />
                      </div>

                      <div className="order-body">
                        <div className="order-items" title={itemsTitle}>
                          {orderItems.length > 0 ? (
                            orderItems.map((item, itemIndex) => (
                              <span className="order-item" key={`${item.foodId || item.id || item.name}-${itemIndex}`}>
                                <strong className="item-name">{item.name}</strong>
                                <span className="item-qty"> x{item.quantity}</span>
                                {itemIndex < orderItems.length - 1 ? <span className="item-sep">, </span> : null}
                              </span>
                            ))
                          ) : '-'}
                        </div>
                        <div className="order-address">
                          {order.userAddress || order.userAdderess || 'Address not available'}
                        </div>
                      </div>

                      <div className="order-right">
                        <div className="order-amount">&#x20B9;{order.amount ?? 0}</div>
                        <div className="order-count">{orderItems.length} items</div>
                        <div className="order-action">
                          <select
                            className="form-control"
                            value={order.orderStatus || 'Food preparing'}
                            onChange={(event) => updateStatus(order, event.target.value)}
                          >
                            <option value="Food preparing">Food preparing</option>
                            <option value="Food ready">Food ready</option>
                            <option value="On the way">On the way</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
