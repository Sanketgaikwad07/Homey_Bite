import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { buildAuthHeader } from '../../Service/http';
import { assets } from '../../assets/assets';
import './Myorder.css';

const Myorder = () => {
    const { token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/orders', {
                headers: buildAuthHeader(token)
            });
            // Expecting an array of orders
            setData(response.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

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
                                {data.map((order) => (
                                    <div className="order-row" key={order.id || order.razorpayOrderId}>
                                        <div className="order-left">
                                            <img src={assets.delivary} alt="Delivery" className="order-delivery-img" />
                                        </div>

                                        <div className="order-body">
                                            <div className="order-items" title={Array.isArray(order.orderItems) ? order.orderItems.map((it) => `${it.name} x${it.quantity}`).join(', ') : ''}>
                                                {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                                                    order.orderItems.map((it, idx) => (
                                                        <span className="order-item" key={idx}>
                                                            <strong className="item-name">{it.name}</strong>
                                                            <span className="item-qty"> x{it.quantity}</span>
                                                            {idx < order.orderItems.length - 1 ? <span className="item-sep">, </span> : null}
                                                        </span>
                                                    ))
                                                ) : '—'}
                                            </div>
                                        </div>

                                        <div className="order-right">
                                            <div className="order-amount">&#x20B9;{order.amount}</div>
                                            <div className="order-count">{Array.isArray(order.orderItems) ? order.orderItems.length : 0}</div>
                                            <div className={`order-status ${'status-' + ((order.orderStatus || '').toString().toLowerCase().replace(/\s+/g,'-'))}`}>{order.orderStatus || '—'}</div>
                                            <div className="order-action">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={fetchData}>Refresh</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Myorder;
