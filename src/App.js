import {lazy, Suspense, useEffect, useState} from "react"

import './App.css';
import {Switch, Route, BrowserRouter} from "react-router-dom";
import "normalize.css";
import Loading from "./Loading"
import Navigatie from "./Navigatie"

// import Statistieken from "./Statistieken"
import Speler from "./Speler"

const Opgave = lazy(() => import("./Opgave"));
const Inzendingen = lazy(() => import("./Inzendingen"));
const Klassement=lazy(()=>import("./Klassement"))
// const Over = lazy(() => import("./Over"));

const App = () => {
    const [deviceWidth, setDeviceWidth] = useState(null);

    useEffect(() => {
        setDeviceWidth(
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth
        );
    }, [])

    useEffect(() => {
        window.addEventListener("resize", () =>
            setDeviceWidth(
                window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth
            )
        );
        return window.removeEventListener("resize", null);
    }, []);

    return (
        <div className="App">
            <BrowserRouter>
                <Navigatie/>
                <Switch>
                    <Route path={'/speler'}>
                        <Suspense fallback={<Loading/>}>
                            <Speler deviceWidth={deviceWidth}/>
                        </Suspense>
                    </Route>
                    <Route>
                        <Suspense fallback={<Loading/>}>
                            <div className="gridContainer">
                                <Opgave/>
                                <Inzendingen deviceWidth={deviceWidth}/>
                                {deviceWidth > 1023 ?
                                    <><Klassement/></> :
                                    <>
                                        <Klassement/>
                                    </>
                                }
                            </div>
                        </Suspense>
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
