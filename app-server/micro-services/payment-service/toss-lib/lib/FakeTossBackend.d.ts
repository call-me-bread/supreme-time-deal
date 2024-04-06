/**
 * Fake 토스 페이먼츠 서버의 백엔드 프로그램.
 *
 * @author Samchon
 */
export declare class FakeTossBackend {
    private application_?;
    /**
     * 서버 개설.
     */
    open(): Promise<void>;
    /**
     * 서버 폐쇄.
     */
    close(): Promise<void>;
}
