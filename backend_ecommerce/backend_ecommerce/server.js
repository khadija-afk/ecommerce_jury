import express from 'express'
import { env } from './config.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import Stripe from 'stripe'

// Connexion MySQL
import './models/index.js'

// // ROUTES
import routerUser from './routes/user.js'
import routerArticle from './routes/article.js'
import routerCategorie from './routes/categorie.js'
import routerOrder from './routes/order.js'
import routerOrderItem from './routes/orderItem.js'
import routerReview from './routes/review.js'
import routerCart from './routes/cart.js'
import routerCartItem from './routes/cartItem.js'
import routerStripe from './routes/stripe.js'





const app = express()

// PORT
const PORT = env.port



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
app.use("/api/orderItem", routerOrderItem)
app.use("/api/review", routerReview)
app.use("/api/cart", routerCart)
app.use("/api/cartItem", routerCartItem)
app.use("/api/stripe", routerStripe)




// Exporter l'application pour les tests
export { app }


// LISTEN
app.listen(PORT,  () => {
  console.log(`Listening at http://localhost:${PORT}`);
})