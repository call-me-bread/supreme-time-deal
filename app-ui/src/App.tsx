const App = () => {
    return (
        <>
            <main className="container">
                <h1>LOGIN</h1>
                <form>
                    <fieldset>
                        <label>
                            First name
                            <input
                                name="first_name"
                                placeholder="First name"
                                autoComplete="given-name"
                            />
                        </label>
                        <label>
                            Email
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                autoComplete="email"
                            />
                        </label>
                    </fieldset>

                    <input
                        type="submit"
                        value="Subscribe"
                    />
                </form>
            </main>
        </>
    );
};
export default App;