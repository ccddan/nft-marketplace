import "../styles/globals.css";

import type { AppProps } from "next/app";
import { AppProvider } from "../src/AppContext";
import Container from "../components/Container";
import Navbar from "../components/Navbar";

export const App = (props: AppProps) => {
  return (
    <AppProvider>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Container {...props} />
      </div>
    </AppProvider>
  );
};

export default App;
