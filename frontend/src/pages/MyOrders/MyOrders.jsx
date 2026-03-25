import React, { useContext, useState, useEffect } from 'react'
import './MyOrders.css'
import axios from "axios";
import { StoreContext } from '../../components/context/StoreContext'
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        const response = await axios.post(
            url + "/api/order/userorders",
            {},
            { headers: { token } }
        );
        if (response.data.success) {
            setData(response.data.orders);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();

            const interval = setInterval(() => {
                fetchOrders();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className='my-orders-order'>
                        <img src={assets.parcel_icon} alt="order" />

                        <p className='order-items'>
                            {order.items.map((item, i) => (
                                <span key={i}>
                                    {item.name} x {item.quantity}
                                    {i < order.items.length - 1 ? ", " : ""}
                                </span>
                            ))}
                        </p>

                        <p className='order-amount'>₹{order.amount}</p>

                        <p className='order-quantity'>Items: {order.items.length}</p>

                        <p className={`order-status ${
                            order.status === "Ready for Pickup" ? "ready" :
                            order.status === "Order Completed" ? "completed" :
                            "processing"
                        }`}>
                            &#x25cf; {order.status}
                        </p>

                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyOrders