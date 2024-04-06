import { ITossCashReceipt } from "toss-payments-server-api/lib/structures/ITossCashReceipt";
export declare class FakeTossCashReceiptsController {
    /**
     * 현금 영수증 발행하기.
     *
     * @param input 입력 정보
     * @returns 현금 영수증 정보
     *
     * @security basic
     * @author Samchon
     */
    create(_0: void, input: ITossCashReceipt.ICreate): ITossCashReceipt;
    /**
     * 현금 영수증 취소하기.
     *
     * @param receiptKey 현금 영수증의 {@link ITossCashReceipt.receiptKey}
     * @param input 취소 입력 정보
     * @returns 취소된 현금 영수증 정보
     *
     * @security basic
     * @author Samchon
     */
    cancel(_0: void, receiptKey: string, input: ITossCashReceipt.ICancel): ITossCashReceipt;
}
