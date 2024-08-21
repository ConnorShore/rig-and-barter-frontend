import { TransactionState } from "./transaction-state";

export interface ITransaction {
    uniqueId: string;
    title: string;
    buyerId: string;
    sellerId: string;
    listingId: string;
    creationDate: Date;
    completionDate: Date;
    buyerAccepted: boolean;
    sellerAccepted: boolean;
    state: TransactionState;
}