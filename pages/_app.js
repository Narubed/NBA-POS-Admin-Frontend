import store from "@/lib/store/store";
import { Provider } from "react-redux";
import ThemeProvider from "../theme";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  );
}

export default MyApp;
