export const config = {
  blockchain: {
    mode: "development",
    network: {
      "polygon-testnet": {
        host: process.env.POLYGON_MUMBAI_URL,
        chainId: 80001,
        networkId: 80001,
      },
      local: {
        host: process.env.LOCAL_RPC_URL,
        chainId: +process.env.LOCAL_RPC_CHAIN_ID!,
        networkId: +process.env.LOCAL_RPC_CHAIN_ID!,
      },
    },
  },
  ipfs: {
    url: {
      ipfs: process.env.NEXT_PUBLIC_IPFS_URL,
      api: process.env.NEXT_PUBLIC_IPFS_API_URL,
    },
  },
};

console.debug("global config:", JSON.stringify(config, null, 2));

export default config;
