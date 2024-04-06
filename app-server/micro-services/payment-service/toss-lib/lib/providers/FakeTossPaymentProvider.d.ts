import { ITossPayment } from "toss-payments-server-api/lib/structures/ITossPayment";
export declare namespace FakeTossPaymentProvider {
    function get_common_props(input: ITossPayment.ICreate): {
        mId: string;
        version: string;
        paymentKey: string;
        transactionKey: string;
        orderId: string;
        orderName: string;
        currency: "KRW";
        totalAmount: number;
        balanceAmount: number;
        suppliedAmount: number;
        taxFreeAmount: number;
        vat: number;
        useEscrow: boolean;
        cultureExpense: boolean;
        requestedAt: string;
        cancels: null;
        cashReceipt: null;
    };
}
