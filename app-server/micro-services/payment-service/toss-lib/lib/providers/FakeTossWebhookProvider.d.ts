import { ITossPaymentWebhook } from "toss-payments-server-api/lib/structures/ITossPaymentWebhook";
export declare namespace FakeTossWebhookProvider {
    function webhook(input: ITossPaymentWebhook): Promise<void>;
}
