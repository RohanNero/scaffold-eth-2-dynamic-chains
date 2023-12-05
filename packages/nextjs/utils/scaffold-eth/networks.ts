import * as chains from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";

export type ChainAttributes = {
  // color | [lightThemeColor, darkThemeColor]
  color: string | [string, string];
  // Used to fetch price by providing mainnet token address
  // for networks having native currency other than ETH
  priceFeed: string;
  url?: string;
};

// To allow your dapp to live on another chain, simply add its chainId to this array.
// Entire list of chains: https://github.com/wevm/viem/blob/main/src/chains/index.ts
export const includedChains = [1, 11155111, 137, 80001, 100, 43114, 43113, 5];

// If adding a chain not listed below, provide a hex string color and a pricefeed address
// from: https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1
export const chainData: Record<string, ChainAttributes> = {
  [chains.hardhat.id]: {
    color: "#b8af0c",
    priceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH (On Ethereum)
  },
  [chains.mainnet.id]: {
    color: "#ff8b9e",
    priceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH (On Ethereum)
  },
  [chains.sepolia.id]: {
    color: "#5f4bb6",
    priceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH (On Ethereum)
  },
  [chains.goerli.id]: {
    color: "#0975F6",
    priceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH (On Ethereum)
  },
  [chains.gnosis.id]: {
    color: "#48a9a6",
    priceFeed: "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9", // XDAI (On Ethereum)
  },
  [chains.polygon.id]: {
    color: "#2bbdf7",
    priceFeed: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676", // MATIC (On Ethereum)
  },
  [chains.polygonMumbai.id]: {
    color: "#92D9FA",
    priceFeed: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676", // MATIC (On Ethereum)
  },
  [chains.optimismGoerli.id]: {
    color: "#f01a37",
    priceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH (On Ethereum)
  },
  [chains.optimism.id]: {
    color: "#f01a37",
    priceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH (On Ethereum)
  },
  [chains.arbitrumGoerli.id]: {
    color: "#28a0f0",
    priceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH (On Ethereum)
  },
  [chains.arbitrum.id]: {
    color: "#28a0f0",
    priceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH (On Ethereum)
  },
  [chains.fantom.id]: {
    color: "#1969ff",
    priceFeed: "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc", // FTM (On Fantom)
    url: "https://fantom.blockpi.network/v1/rpc/public", // FTM/USD pricefeed on Ethereum doesn't currently exist
  },
  [chains.fantomTestnet.id]: {
    color: "#1969ff",
    priceFeed: "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc", // FTM (On Fantom)
  },
  [chains.scrollSepolia.id]: {
    color: "#fbebd4",
    priceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH (On Ethereum)
  },
  [chains.avalanche.id]: {
    color: "#D87308",
    priceFeed: "0xFF3EEb22B5E3dE6e705b44749C2559d704923FD7", // AVAX (On Ethereum)
  },
  [chains.avalancheFuji.id]: {
    color: "#FFC033",
    priceFeed: "0xFF3EEb22B5E3dE6e705b44749C2559d704923FD7", // AVAX (On Ethereum)
  },
};

/**
 * Gives the block explorer transaction URL.
 * @param network
 * @param txnHash
 * @dev returns empty string if the network is localChain
 */
export function getBlockExplorerTxLink(chainId: number, txnHash: string) {
  const chainNames = Object.keys(chains);

  const targetChainArr = chainNames.filter(chainName => {
    const wagmiChain = chains[chainName as keyof typeof chains];
    return wagmiChain.id === chainId;
  });

  if (targetChainArr.length === 0) {
    return "";
  }

  const targetChain = targetChainArr[0] as keyof typeof chains;
  // @ts-expect-error : ignoring error since `blockExplorers` key may or may not be present on some chains
  const blockExplorerTxURL = chains[targetChain]?.blockExplorers?.default?.url;

  if (!blockExplorerTxURL) {
    return "";
  }

  return `${blockExplorerTxURL}/tx/${txnHash}`;
}

/**
 * Gives the block explorer Address URL.
 * @param network - wagmi chain object
 * @param address
 * @returns block explorer address URL and etherscan URL if block explorer URL is not present for wagmi network
 */
export function getBlockExplorerAddressLink(network: chains.Chain, address: string) {
  const blockExplorerBaseURL = network.blockExplorers?.default?.url;
  if (network.id === chains.hardhat.id) {
    return `/blockexplorer/address/${address}`;
  }

  if (!blockExplorerBaseURL) {
    return `https://etherscan.io/address/${address}`;
  }

  return `${blockExplorerBaseURL}/address/${address}`;
}

/**
 * @returns targetNetwork object consisting targetNetwork from scaffold.config and extra network metadata
 */

export function getTargetNetwork(): chains.Chain & Partial<ChainAttributes> {
  const configuredNetwork = scaffoldConfig.targetNetwork;

  return {
    ...configuredNetwork,
    ...chainData[configuredNetwork.id],
  };
}
