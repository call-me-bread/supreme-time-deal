/**
 * Fake 토스 페이먼츠 서버의 설정 정보.
 *
 * @author Samchon
 */
export declare namespace FakeTossConfiguration {
    /**
     * 임시 저장소의 레코드 만료 기한.
     */
    const EXPIRATION: IExpiration;
    /**
     * 서버가 사용할 포트 번호.
     */
    let API_PORT: number;
    /**
     * Webhook 이벤트를 수신할 URL 주소.
     */
    let WEBHOOK_URL: string;
    /**
     * 토큰 인증 함수.
     *
     * 클라이언트가 전송한 Basic 토큰값이 제대로 된 것인지 판별한다.
     *
     * @param token 토큰값
     */
    let authorize: (token: string) => boolean;
    /**
     * 임시 저장소의 레코드 만료 기한.
     */
    interface IExpiration {
        /**
         * 만료 시간.
         */
        time: number;
        /**
         * 최대 수용량.
         */
        capacity: number;
    }
}
