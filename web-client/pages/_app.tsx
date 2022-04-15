import "../styles/globals.css";

import type { AppProps } from "next/app";
import { AppProvider } from "../src/AppContext";
import Container from "../src/components/Container";
import Navbar from "../src/components/Navbar";

export const App = (props: AppProps) => {
  return (
    <AppProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Navbar />
        <Container {...props} />
      </div>
    </AppProvider>
  );
};

export default App;
