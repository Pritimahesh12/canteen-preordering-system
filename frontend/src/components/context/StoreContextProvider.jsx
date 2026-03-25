import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { StoreContext } from "./StoreContext";

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000"
    const [token, setToken] = useState("");
    const [showLogin, setShowLogin] = useState(false);
    const [food_list, setFoodList] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const prevOrdersRef = useRef({}); //  track previous order statuses

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item of food_list) {
            if (cartItems[item._id] > 0) {
                totalAmount += item.price * cartItems[item._id];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    }

    const loadCartData = async (savedToken) => {
        const response = await axios.post(
            url + "/api/cart/get",
            {},
            { headers: { token: savedToken } }
        );
        if (response.data.success) {
            setCartItems(response.data.cartData);
        }
    }

    //  check order status changes every 15 seconds
    const checkOrderStatus = async (savedToken) => {
        try {
            const response = await axios.get(
                url + "/api/order/userorders",
                { headers: { token: savedToken } }
            );

            if (response.data.success) {
                const orders = response.data.orders;

                if (!prevOrdersRef.current || Object.keys(prevOrdersRef.current).length === 0) {
                    const initial = {};
                    orders.forEach(order => {
                        initial[order._id] = order.status;
                    });
                    prevOrdersRef.current = initial;
                    return;
                }

                const prev = prevOrdersRef.current;
                const updated = { ...prev };

                orders.forEach(order => {
                    const prevStatus = prev[order._id];
                    const newStatus = order.status;

                    if (prevStatus === undefined) {
                        updated[order._id] = newStatus;
                    } else if (prevStatus !== newStatus) {
                        const msg = getStatusMessage(newStatus, order.items);
                        setNotifications(n => [...n, {
                            id: Date.now() + Math.random(),
                            msg,
                            status: newStatus
                        }]);
                        updated[order._id] = newStatus;
                    }
                });

                prevOrdersRef.current = updated;
            }
        } catch (error) {
            console.log("Status check error:", error);
        }
    };

    const getStatusMessage = (status, items) => {
        const itemNames = items.slice(0, 2).map(i => i.name).join(", ");
        switch (status) {
            case "Food Processing": return ` Your order (${itemNames}...) is being prepared!`;
            case "Ready for Pickup": return ` Your order (${itemNames}...) is READY! Please collect from counter.`;
            case "Completed": return ` Order completed! Enjoy your meal.`;
            default: return ` Order status: ${status}`;
        }
    }

    const removeNotification = (id) => {
        setNotifications(n => n.filter(notif => notif.id !== id));
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
                await loadCartData(savedToken);
            } 
        }
        loadData();
    }, [])

    
    useEffect(() => {
        if (!token) return;
        const interval = setInterval(() => {
            checkOrderStatus(token);
        }, 15000); 
        checkOrderStatus(token); 
        return () => clearInterval(interval);
    }, [token])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        showLogin,
        setShowLogin,
        notifications,        
        removeNotification    
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;