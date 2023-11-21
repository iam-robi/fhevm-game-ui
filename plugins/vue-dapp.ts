import { VueDapp } from "vue-dapp";
import { ethers } from "ethers";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDapp, {
    8009: {
      chainId: ethers.toBeHex(8009),
      name: "Zama",
      rpcUrl: "https://devnet.zama.ai",
    },
  });
});
