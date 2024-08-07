const crypto = require('crypto')
const axios = require('axios')
const Order = require('../models/Order')

const accessKey = 'F8BBA842ECF85'
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
const partnerCode = 'MOMO'
const redirectUrl = 'http://localhost:3000'
const ipnUrl = 'http://localhost:3000'

class PaymentController {
    createPayment = async (req, res) => {
        try {
            const { amount, orderInfo, orderId: clientOrderId } = req.body
            const requestType = "payWithMethod"
            const orderId = partnerCode + new Date().getTime()
            const requestId = orderId
            const extraData = ''
            const autoCapture = true
            const lang = 'vi'
            const orderGroupId = ''

            // Tạo chữ ký cho yêu cầu
            const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`
            const signature = crypto.createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex')

            // Tạo dữ liệu yêu cầu
            const requestBody = {
                partnerCode: partnerCode,
                partnerName: "Test",
                storeId: "MomoTestStore",
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: redirectUrl,
                ipnUrl: ipnUrl,
                lang: lang,
                requestType: requestType,
                autoCapture: autoCapture,
                extraData: extraData,
                orderGroupId: orderGroupId,
                signature: signature
            }

            const options = {
                method: 'POST',
                url: 'https://test-payment.momo.vn/v2/gateway/api/create',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: requestBody
            }

            try {
                const result = await axios(options)

                if (result.data && result.data.resultCode === 0) {
                    await Order.findOneAndUpdate({ _id: clientOrderId }, { status: 'Paid' })
                }

                return res.status(result.status).json(result.data)
            } catch (err) {
                return res.status(500).json({ message: "Server error", error: err.message })
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new PaymentController()
