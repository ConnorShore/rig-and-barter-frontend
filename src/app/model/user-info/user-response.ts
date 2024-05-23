import { IUserBasicInfoResponse } from "./user-basic-info-response";
import { IUserBillingInfoResponse } from "./user-billing-info-response";

export interface IUserResponse {
    id: string;
    basicInfo: IUserBasicInfoResponse;
    billingInfo: IUserBillingInfoResponse;
}