import "./assets/css/tailwind.css";
import {createRoot} from "react-dom/client";
import {
    BrandVariants,
    createDarkTheme,
    createLightTheme,
    FluentProvider,
    Theme,
    webLightTheme
} from "@fluentui/react-components";
import {BrowserRouter} from "react-router";
import {Provider} from 'react-redux';
import store from "./stores/store.ts";
import {App} from "./app.tsx";

const defaultTheme: BrandVariants = {
    10: "#020401",
    20: "#101C0B",
    30: "#162F10",
    40: "#193D12",
    50: "#1B4B13",
    60: "#1C5A14",
    70: "#1D6914",
    80: "#1D7914",
    90: "#1C8912",
    100: "#199910",
    110: "#14A90B",
    120: "#0ABA04",
    130: "#3FC92F",
    140: "#71D45D",
    150: "#97DF84",
    160: "#B9EAAA"
};

const lightTheme: Theme = {
    ...createLightTheme(defaultTheme),
};

const darkTheme: Theme = {
    ...createDarkTheme(defaultTheme),
};


darkTheme.colorBrandForeground1 = defaultTheme[110];
darkTheme.colorBrandForeground2 = defaultTheme[120];

createRoot(document.getElementById('root')!).render(
    <FluentProvider theme={webLightTheme}>
        <Provider store={store}>
            <BrowserRouter>
                <FluentProvider theme={lightTheme}>
                    <App/>
                </FluentProvider>
            </BrowserRouter>
        </Provider>
    </FluentProvider>,
)
