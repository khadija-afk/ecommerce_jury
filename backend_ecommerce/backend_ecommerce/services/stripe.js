import Stripe from "stripe";
import { env } from "../config.js";

const stripe = new Stripe(env.secret_key)

export default stripe