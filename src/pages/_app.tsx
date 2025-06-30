import { memo } from "react";
import type { AppProps } from "next/app";
import './_app.css';

export default memo(({ Component, pageProps }: AppProps) => {
  return (
    <Component {...pageProps} />
  );
});
