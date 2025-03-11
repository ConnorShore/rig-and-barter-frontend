export interface ICompleteTransactionRequest {
    transactionId: string;
    manualTransaction: boolean;
    paymentMethodId?: string;
}