import express from 'express'
import { env } from './src/config.js'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './swagger.js'
import cookieParser from 'cookie-parser'

import cors from 'cors'
import Stripe from 'stripe'


import './src/models/index.js';

// // ROUTES
import routerUser from './src/routes/user.js'
import routerArticle from './src/routes/article.js'
import routerCategorie from './src/routes/categorie.js'
import routerOrder from './src/routes/orderDetails.js'
import routerReview from './src/routes/review.js'
import routerCart from './src/routes/cart.js'
import routerCartItem from './src/routes/cartItem.js'
import routerOrderItem from './src/routes/orderItem.js'
import routerPaymentDetails from './src/routes/paymentDetail.js'
import routerFavorie from './src/routes/favorie.js'
import routerStripe from './src/routes/stripe.js'
import routes from './src/routes/reset.js'
import routLogout from './src/routes/logout.js'
import stripeWebhookRoute from './src/routes/stripewebhook.js'
import initializeAdminJS from './src/routes/admin.js'
import serachroute from './src/routes/searche.js'




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
  origin: process.env.CORS_URL, // Votre frontend
  credentials: true
}));

// Utiliser le routeur AdminJS
if (process.env.NODE_ENV != 'test') {
  const admin = await initializeAdminJS()
  app.use('/admin', admin)
}

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
app.use("/api/favorie", routerFavorie)
app.use("/api/stripe", routerStripe)
app.use("/api", routes);
app.use("/api/Log", routLogout)
app.use("/api/search", serachroute);

//stripe
app.use('/api/webhook', stripeWebhookRoute);




// Exporter l'application pour les tests
export { app }


// LISTEN
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
      console.log(`Listening at http://localhost:${PORT}`);
      console.log(`Server started on http://localhost:${PORT}/admin`);
  });
}