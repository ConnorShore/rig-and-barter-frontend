import { IStripeCustomer } from "./stripe/stripe-customer";
import { IUserBasicInfoResponse } from "./user-basic-info-response";

export interface IUserResponse {
    id: string;
    basicInfo: IUserBasicInfoResponse;
    stripeInfo?: IStripeCustomer;
}