import "./assets/css/tailwind.css";
import {createRoot} from "react-dom/client";
import {FluentProvider, webLightTheme} from "@fluentui/react-components";
import {BrowserRouter} from "react-router";
import {Provider} from 'react-redux';
import store from "./stores/store.ts";
import {App} from "./app.tsx";

createRoot(document.getElementById('root')!).render(
    <FluentProvider theme={webLightTheme}>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </FluentProvider>,
)
