import {useNavigate} from "react-router-dom";

function SignIn() {
    const navigate = useNavigate();

    return (
        <div>
            <h1 style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5 rem' }}>슈프림 온라인 스토어</h1>
            <form>
                <input
                    color="transparent"
                    type="email"
                    name="email"
                    placeholder="이메일"
                    aria-label="email"
                    autoComplete="email"
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
                <button type="submit">로그인</button>
            </form>
            <button style={{ width: "100%" }}  onClick={() => navigate('/sign-up')}>회원가입</button>
        </div>
    );
}

export default SignIn;
