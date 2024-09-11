import express from 'express'
import { env } from './config.js'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './swagger.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import Stripe from 'stripe'

// Connexion MySQL
import './models/index.js'

// // ROUTES
import routerUser from './routes/user.js'
import routerArticle from './routes/article.js'
import routerCategorie from './routes/categorie.js'
import routerOrder from './routes/orderDetails.js'
import routerReview from './routes/review.js'
import routerCart from './routes/cart.js'
import routerCartItem from './routes/cartItem.js'
import routerOrderItem from './routes/orderItem.js'
import routerPaymentDetails from './routes/paymentDetail.js'
import routerStripe from './routes/stripe.js'
import routes from './routes/reset.js'
import routLogout from './routes/logout.js'




const app = express()

// PORT
const PORT = env.port


// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// MIDDLEWARE
app.use(express.json())
app.use(cookieParser())
// Configurer CORS pour autoriser toutes les requêtes
app.use(cors({
  origin: 'http://localhost:3000', // Votre frontend
  credentials: true
}));

// MIDDLEWARE TO ROUTE
app.use("/api/user", routerUser)
app.use("/api/article", routerArticle)
app.use("/api/categorie", routerCategorie)
app.use("/api/order", routerOrder)
app.use("/api/review", routerReview)
app.use("/api/cart", routerCart)
app.use("/api/cartItem", routerCartItem)
app.use("/api/orderItem", routerOrderItem)
app.use("/api/payment", routerPaymentDetails)
app.use("/api/stripe", routerStripe)
app.use("/api", routes);
app.use("/api/Log", routLogout)




// Exporter l'application pour les tests
export { app }


// LISTEN
app.listen(PORT,  () => {
  console.log(`Listening at http://localhost:${PORT}`);
})