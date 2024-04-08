import {useMinHeight} from "../hooks/min-height.ts";
import {useNavigate} from 'react-router-dom';

export const SignUp = () => {
    const mainRef = useMinHeight();
    const navigate = useNavigate();

    return (
        <main ref={mainRef} style={{margin: "0 auto", maxWidth: "600px"}}>
            <div>
                <h1 style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>슈프림 스토어 회원 가입</h1>
                <form>
                    <input
                        type="text"
                        name="email"
                        placeholder="이메일"
                        aria-label="email"
                        autoComplete="username"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        aria-label="Password"
                        autoComplete="current-password"
                        required
                    />
                    <input
                        type="check password"
                        name="password"
                        placeholder="비밀번호 확인"
                        aria-label="Password"
                        autoComplete="current-password"
                        required
                    />
                    <button style={{width: "100%"}} onClick={() => navigate('/', {replace:true})}>회원가입</button>
                </form>
            </div>
        </main>

    );
};