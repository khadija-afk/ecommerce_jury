import React, { useContext, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { PanierContext } from "../../utils/PanierContext";
import { fetchFromApi } from "../../utils/helpers/Stripe";

const StripeCheckout = () => {
    const [email, setEmail] = useState('');
    const stripe = useStripe();
    const { panier } = useContext(PanierContext);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        const line_items = panier.map(article => {
            const imgUrl = article.picture && article.picture.length > 0 ? article.picture[0].img : '';
            return {
                quantity: article.quantite, // Make sure this is correct
                price_data: {
                    currency: 'eur',
                    unit_amount: Math.round(article.price * 100), // Convert to cents
                    product_data: {
                        name: article.name,
                        description: article.content,
                        images: imgUrl ? [imgUrl] : []
                    }
                }
            };
        });

        console.log("Line items:", line_items); // Debug log

        try {
            const response = await fetchFromApi('api/stripe/create-checkout-session', {
                body: { line_items, customer_email: email }
            });

            if (!response) {
                throw new Error("API response is undefined");
            }

            const { sessionId, error } = response;

            if (error) {
                console.error("API Error:", error);
                return;
            }

            console.log("Session ID:", sessionId); // Debug log

            // Redirect to Stripe Checkout
            const result = await stripe?.redirectToCheckout({ sessionId });

            if (result?.error) {
                console.error("Stripe redirect error:", result.error.message);
            } else {
                console.log("Redirect to Stripe Checkout initiated"); // Debug log
            }
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    return (
        <>
            <form onSubmit={handleCheckout}>
                <input
                    type="email"
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    value={email}
                />
                <button type="submit">
                    CHECKOUT
                </button>
            </form>
        </>
    );
};

export default StripeCheckout;






/*import { useContext, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { PanierContext } from "../../utils/PanierContext";
import { fetchFromApi } from "../../utils/helpers/Stripe";



const StripeCheckot = () => {
    const [email, setEmail] = useState('');
    const stripe= useStripe()
    const {panier} = useContext(PanierContext)

    const handleCheckout = async (e) =>{
       e.preventDefault()
       // line items

       const line_items = panier.map(article =>{
        return{
            quantity: article.quantity,
            price_data: {
                currency: 'eur',
                unit_amount: article.price,
                product_data: {
                    name: article.name,
                    description: article.content,
                    image: [article.picture[0].img]
                }
            }
        }
       })

       // CALL API CHECKOUT SESSION

       const { sessionId} = await fetchFromApi('create-checkout-session', {
        body: {line_items, customer_email: email}
      
       })
       const {error} = await stripe?.redirectToCheckout({sessionId})

       if(error) console.log(error)
    }
    return (

        <>
        <form onSubmit={handleCheckout}>
            <input 
            type="email"
            onChange={e=>setEmail(e.target.value)}
            placeholder="Email"
            value={email}
            />

            <button type='submit'>
                CHECKOUT
            </button>
            


        </form>
        </>
    )

}

export default StripeCheckot*/