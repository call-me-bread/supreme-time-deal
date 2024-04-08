import Login from "./pages/login.tsx";
import {useMinHeight} from "./hooks/min-height.ts";

const App = () => {
    let mainRef = useMinHeight();

    return (
        <main ref={mainRef} style={{margin: "0 auto", maxWidth: "600px"}}>
            <Login/>
        </main>
    );
};

export default App;
