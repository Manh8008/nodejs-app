const siteRouter = require('./siteRouter')
const productRouter = require('./productRouter')
const categoryRouter = require('./categoryRouter')
const userRouter = require('./usersRouter')
const orderRouter = require('./orderRouter')
const paymentRoute = require('./paymentRouter')

function route(app) {
    app.use("/", siteRouter)
    app.use("/products", productRouter)
    app.use("/categories", categoryRouter)
    app.use("/users", userRouter)
    app.use("/orders", orderRouter)
    app.use("/payments", paymentRoute)

}

module.exports = route
