import { processChequePayment } from './cheque.js';
import { createStripeSession } from './stripecheckout.js';

const checkout = async (req, res) => {
    const { paymentMethod } = req.body;

    if (paymentMethod === 'cheque') {
        await processChequePayment(req, res);
    } else if (paymentMethod === 'stripe') {
        await createStripeSession(req, res);
    } else {
        res.status(400).json({ error: 'Méthode de paiement non prise en charge' });
    }
};

export default { checkout };
