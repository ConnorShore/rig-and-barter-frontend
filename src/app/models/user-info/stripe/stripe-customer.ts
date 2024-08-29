import { IStripePaymentMethod } from "./stripe-payment-method";

export interface IStripeCustomer {
    userId: string;
    stripeId?: string;
    accountId?: string;
    verified: boolean;
    paymentMethods: IStripePaymentMethod[];
}