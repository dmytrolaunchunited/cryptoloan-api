import { memo } from "react";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default memo(() => {
  return (
    <>Bitloan API {publicRuntimeConfig.version}</>
  );
});
