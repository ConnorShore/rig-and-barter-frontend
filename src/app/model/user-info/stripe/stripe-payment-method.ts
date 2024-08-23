
export interface IStripePaymentMethod {
    stripePaymentId: string;
    cardToken: string;
    nameOnCard: string;
    last4Digits: string;
    expirationMonth: number;
    expirationYear: number;
}