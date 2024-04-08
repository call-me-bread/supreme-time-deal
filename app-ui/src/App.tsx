import {useMinHeight} from "./hooks/min-height.ts";
import SignIn from "./pages/sign-in.tsx";

const App = () => {
    let mainRef = useMinHeight();

    return (
        <main ref={mainRef} style={{margin: "0 auto", maxWidth: "600px"}}>
            <SignIn/>
        </main>
    );
};

export default App;
