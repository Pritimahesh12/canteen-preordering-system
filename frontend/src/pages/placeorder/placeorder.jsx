import React, { useContext, useState } from 'react'
import './placeorder.css'
import axios from "axios";

import { StoreContext } from '../../components/context/StoreContext'

const PlaceOrder = () => {

  const { cartItems, food_list, getTotalCartAmount, token, url } = useContext(StoreContext);
  const[data,setData]=useState({
    firstName:"",
    lastName:"",
    email:"",
    phone:""
  })

  const onChangeHandler=(event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const placeOrder = async (event) => {
    event.preventDefault();

    console.log("CART:", cartItems);
    console.log("FOOD:", food_list);

    let orderItems = [];

    Object.keys(cartItems).forEach((itemId) => {
        const item = food_list.find(f => f._id.toString() === itemId);

        if (item) {
        orderItems.push({
            name: item.name,
            price: item.price,
            quantity: cartItems[itemId]
        });
        }
    });

    console.log("FINAL ORDER:", orderItems);

    if (orderItems.length === 0) {
        alert("Cart is empty ");
        return;
    }

    let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount()
    };

    let response = await axios.post(
        url + "/api/order/place",
        orderData,
        { headers: { token } }
    );

    if (response.data.success) {
        window.location.replace(response.data.session_url);
    } else {
        alert(response.data.message);
    }
};

  return (
    <form onSubmit={placeOrder} className='place-order'>

      <div className="place-order-left">
        <p className="title">Student Details</p>

        <div className="multi-fields">
          <input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' required />
          <input name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' required />
        </div>

        <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' required />

        <input name='phone' onChange={onChangeHandler} value={data.phone} type="tel" placeholder='Phone Number' required />
        
        <div className="pickup-notice">
          <p>Self Pickup Only — Collect your order from the canteen counter</p>
        </div>

      </div>

      <div className="place-order-right">
        <div className="cart-total">

          <h2>Order Summary</h2>

          <div className="order-summary-items">
            {food_list.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={item._id} className="order-summary-item">
                    <p>{item.name} x{cartItems[item._id]}</p>
                    <p>₹{item.price * cartItems[item._id]}</p>
                  </div>
                )
              }
              return null;
            })}
          </div>

          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{getTotalCartAmount()}</b>
          </div>

          <hr />
          <div className="order-info">
            <p> You will receive an email when your food is ready.</p>
            <p> Estimated time: 15-20 minutes.</p>
          </div>

          <button type='submit' className='place-order-btn'>PLACE ORDER</button>

        </div>
      </div>

    </form>
  )
}

export default PlaceOrder