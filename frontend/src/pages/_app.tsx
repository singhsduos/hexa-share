import "../../styles/globals.css";
import axios from "axios";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Head from "next/head";

axios.defaults.baseURL = "https://hexashare.onrender.com/";
// Alert Message CSS
const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
  
}

function MyApp({ Component, pageProps }) {
  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Head>
        <title>HexaShare</title>
      </Head>
      <div className="grid h-screen font-serif text-white bg-gray-900 place-items-center">
        <div>
          <Component {...pageProps} />
        </div>
      </div>
    </AlertProvider>
  );
}

export default MyApp;
