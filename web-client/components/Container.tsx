import type { AppProps } from "next/app";
import { useAppContext } from "../src/AppContext";

export const Container = ({ Component, pageProps }: AppProps) => {
  const { account } = useAppContext();

  if (account.length) {
    return <Component {...pageProps} />;
  }

  return (
    <p>
      <b>Connect with your wallet</b>
    </p>
  );
};

export default Container;
