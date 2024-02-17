import { TransactionState } from "./transaction-state";

export interface ITransaction {
    id: number;
    uniqueId: string;
    title: string;
    buyerId: string;
    sellerId: string;
    listingId: string;
    creationDate: Date;
    completionDate: Date;
    state: TransactionState;
}