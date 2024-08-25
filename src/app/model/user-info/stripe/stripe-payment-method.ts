
export interface IStripePaymentMethod {
    stripePaymentId: string;
    cardToken: string;
    nickname: string;
    last4Digits: string;
    expirationMonth: number;
    expirationYear: number;
}