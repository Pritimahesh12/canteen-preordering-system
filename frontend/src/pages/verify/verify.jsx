import { useEffect, useContext, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './verify.css';
import { StoreContext } from "../../components/context/StoreContext";

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const navigate = useNavigate();
    const { url, token } = useContext(StoreContext);
    const hasVerified = useRef(false); 

    useEffect(() => {
        const savedToken = token || localStorage.getItem("token");

        if (!savedToken) {
            navigate("/");
            return;
        }

        if (hasVerified.current) return; 
        hasVerified.current = true;

        const verifyPayment = async () => {
            try {
                const response = await axios.post(
                    url + "/api/order/verify",
                    { success, orderId },
                    { headers: { token: savedToken } }
                );
                if (response.data.success) {
                    navigate("/myorders");
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.log(error);
                navigate("/");
            }
        };

        verifyPayment();
    }, [token]); 

    return (
        <div className="verify">
            <div className="spinner"></div>
        </div>
    );
};

export default Verify;