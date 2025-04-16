import { isDev } from "./helpers";

export const pricingPlans = [
    {
        "name": "basic",
        "price": 9,
        "description": "Perfect for Occasional users",
        "items": [
            "5 PDF summaries per month",
            "Standard processing speed",
            "Email support",
        ],
        "id": "basic",
        "paymentLink": isDev ? "https://buy.stripe.com/test_6oE4h52KlaIq9qg4gg" : "",
        "priceId": isDev ? 'price_1RAmd9PLcPBMNPfrKva0BIP1' : ''
    },
    {
        "name": "pro",
        "price": 19,
        "description": "For professionals and teams",
        "items": [
            "Unlimited PDF summaries",
            "Priority processing",
            "24/7 priority support",
            "Markdown Export"
        ],
        "id": "pro",
        "paymentLink": isDev ? "https://buy.stripe.com/test_dR614T0Cd4k231ScMN" : "",
        "priceId": isDev ? 'price_1RAmgMPLcPBMNPfr3KSirTDN' : ''
    }

];


export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        transition: {
            type: 'spring',
            damping: 15,
            stiffness: 50,
            duration: 0.8,
        },
    },
};
