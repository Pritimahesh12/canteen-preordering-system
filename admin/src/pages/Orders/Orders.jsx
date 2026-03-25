import React, { useState, useEffect } from "react";
import './Orders.css'
import axios from "axios"
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        const response = await axios.get(url + "/api/order/list");
        if (response.data.success) {
            setOrders(response.data.data);
        } else {
            toast.error("Error");
        }
    }

    const statusHandler = async (event, orderId) => {
      const newStatus = event.target.value;
      console.log("Sending:", { orderId, status: newStatus }); // add this

      setOrders(prev =>
          prev.map(order =>
              order._id === orderId ? { ...order, status: newStatus } : order
          )
      );

      const response = await axios.post(url + "/api/order/status", {
          orderId,
          status: newStatus
      });

      console.log("Response:", response.data); // add this

      if (response.data.success) {
          toast.success("Status Updated");
      } else {
          toast.error("Failed to update status");
          await fetchAllOrders();
      }
  
    }

    useEffect(() => {
        fetchAllOrders();
    }, [])

    return (
        <div className="order-add">
            <h3>Order Page</h3>
            <div className="order-list">
                {orders.map((order, index) => (
                    <div key={index} className="order-item">
                        <img src={assets.parcel_icon} alt="parcel" />
                        <div>
                            <p className="order-item-food">
                                {order.items.map((item, i) => (
                                    <span key={i}>
                                        {item.name} x {item.quantity}
                                        {i < order.items.length - 1 ? ", " : ""}
                                    </span>
                                ))}
                            </p>
                            <p className="order-item-name">
                                {order.address?.firstName} {order.address?.lastName}
                            </p>
                            <p className="order-item-phone">{order.address?.phone}</p>
                        </div>
                        <p>Items : {order.items.length}</p>
                        <p>₹{order.amount}</p>
                        <select
                            onChange={(e) => statusHandler(e, order._id)}
                            value={order.status}
                        >
                            <option value="Food Processing">Food Processing</option>
                            <option value="Ready for Pickup">Ready for Pickup</option>
                            <option value="Order Completed">Order Completed</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders