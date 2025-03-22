module.exports = {
    endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
    partnerCode: "MOMO",
    accessKey: "F8BBA842ECF85",
    secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
    returnUrl: `${process.env.URL_NODE}/api/payments/momo_return`,
    notifyUrl: `${process.env.URL_NODE}/api/payments/momo_notify`,
    requestType: "captureWallet"
};
