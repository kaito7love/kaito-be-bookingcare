const moment = require("moment");
const crypto = require("crypto");
import momoService from "../services/momoService";


let createMoMoPayment = async (req, res) => {
    try {
        const { amount } = req.body;
        
        const payUrl = await momoService.createMoMoPayment(amount);
        
        if (payUrl) {
            console.log("🔗 Chuyển hướng tới MoMo:", payUrl);
            return res.status(200).json(payUrl);
        } else {
            return res.status(400).json({ error: "Không nhận được payUrl từ MoMo" });
        }
    } catch (error) {
        console.error("❌ Lỗi khi tạo thanh toán:", error.message);
        return res.status(500).json({ error: "Lỗi server khi tạo thanh toán" });
    }
};

let momoReturn = async (req, res) => {
    try {
        const result = await momoService.handleMoMoReturn(req.query);

        if (result.success) {
            console.log(`✅ ${result.message}`);
            res.redirect(result.redirectUrl);
        } else {
            console.log("🔴 Giao dịch thất bại, chuyển hướng về trang chính...");
            res.redirect(result.redirectUrl);
        }
    } catch (error) {
        console.error("❌ Lỗi xử lý kết quả MoMo:", error.message);
        res.redirect("/");
    }
};

export default {
    createMoMoPayment,
    momoReturn,
};
