import axios from "axios";
import crypto from "crypto";
import momoConfig from "../config/momoConfig.js";
import { log } from "console";
require('dotenv').config();

let createMoMoPayment = async (amount) => {
    
    try {
        const orderId = Date.now().toString();
        const requestId = orderId;
        const orderInfo = "Payment for order";

        const rawData = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=&ipnUrl=${momoConfig.notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.returnUrl}&requestId=${requestId}&requestType=${momoConfig.requestType}`;
        const signature = crypto.createHmac("sha256", momoConfig.secretKey).update(rawData).digest("hex");

        const requestBody = {
            partnerCode: momoConfig.partnerCode,
            accessKey: momoConfig.accessKey,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl: momoConfig.returnUrl,
            ipnUrl: momoConfig.notifyUrl,
            extraData: "",
            requestType: momoConfig.requestType,
            signature
        };

        const response = await axios.post(momoConfig.endpoint, requestBody);
        console.log("🛠️ MoMo API Response:", response.data);

        return response.data.payUrl || null;
    } catch (error) {
        console.error("❌ Lỗi API MoMo:", error.message);
        throw new Error("Lỗi khi gọi API MoMo");
    }
};


const handleMoMoReturn = async (query) => {
    const { orderId, resultCode } = query;
    if (resultCode === "0") {
        return { success: true, message: "Giao dịch thành công!", redirectUrl: `${process.env.URL_REACT}/` };
    } else {
        return { success: false, message: "Giao dịch thất bại! Quay lại trang chính.", redirectUrl: `${process.env.URL_REACT}/home` };
    }
};
export default {
    createMoMoPayment,
    handleMoMoReturn,
};
