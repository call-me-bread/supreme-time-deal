import { ITossBilling } from "toss-payments-server-api/lib/structures/ITossBilling";
import { ITossCashReceipt } from "toss-payments-server-api/lib/structures/ITossCashReceipt";
import { ITossPayment } from "toss-payments-server-api/lib/structures/ITossPayment";
import { ITossPaymentWebhook } from "toss-payments-server-api/lib/structures/ITossPaymentWebhook";
import { VolatileMap } from "../utils/VolatileMap";
export declare namespace FakeTossStorage {
    const payments: VolatileMap<string, ITossPayment>;
    const billings: VolatileMap<string, [
        ITossBilling,
        ITossBilling.ICreate
    ]>;
    const cash_receipts: VolatileMap<string, ITossCashReceipt>;
    const webhooks: VolatileMap<string, ITossPaymentWebhook>;
}
