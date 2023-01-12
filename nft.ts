import { config as loadEnv } from "dotenv";
import { SDK, Auth, Metadata, TEMPLATES } from "@infura/sdk";

// load environment variables from .env file
loadEnv();

// Create an instance of the Auth class
const auth = new Auth({
  // set the projectId taken from the INFURA_PROJECT_ID environment variable
  projectId: process.env.INFURA_PROJECT_ID,
  // set the secretId taken from the INFURA_PROJECT_SECRET environment variable
  secretId: process.env.INFURA_PROJECT_SECRET,
  // set the private key taken from the WALLET_PRIVATE_KEY environment variable
  privateKey: process.env.WALLET_PRIVATE_KEY,
  // set the rpcUrl taken from the EVM_RPC_URL environment variable
  rpcUrl: process.env.EVM_RPC_URL,
  // set the chainId for the Goerli testnet
  chainId: 5, // Goerli
  // set the options for IPFS
  ipfs: {
    // set the project Id taken from the INFURA_IPFS_PROJECT_ID environment variable
    projectId: process.env.INFURA_IPFS_PROJECT_ID,
    // set the API key secret taken from the INFURA_IPFS_PROJECT_SECRET environment variable
    apiKeySecret: process.env.INFURA_IPFS_PROJECT_SECRET,
  },
});

// Instantiate the SDK
const sdk = new SDK(auth);

// Define the properties of the token, including its description, external URL, image, name, and attributes
const tokenMetadata = Metadata.openSeaTokenLevelStandard({
  description: "Fantastic creature of different emojis",
  external_url: "https://google.com/",
  image: await sdk.storeFile({
    // Store the image from the given URL
    metadata:
      "https://res.cloudinary.com/olanetsoft/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1672327921/demo.jpg",
  }),
  name: "Kandy Jane",
  attributes: [],
});

// Log the token metadata object to the console
console.log("Token Metadata: ", tokenMetadata);

// Store the token metadata and log the result
const storeTokenMetadata = await sdk.storeMetadata({ metadata: tokenMetadata });
console.log("Store Token Metadata: ", storeTokenMetadata);

// Define the properties of the collection, including its description, external URL, image, name, and attributes
const collectionMetadata = Metadata.openSeaCollectionLevelStandard({
  name: "Emojis collection", // Sets the name of the collection to "Emojis collection"
  description:
    "A small digital image or icon used to express an idea or emotion in electronic communication. Emoji's come in many forms, such as smiley faces, animals, food, and activities. ", // Sets the description of the collection
  image: await sdk.storeFile({
    // Sets the image property of the collection using the storeFile method
    metadata:
      "https://res.cloudinary.com/olanetsoft/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1672327921/demo.jpg", // The URL of the image file
  }),
  external_link: "https://google.com/", // Sets the external link property of the collection
});

console.log("Collection Metadata:- ", collectionMetadata); // Logs the collection metadata to the console

const storeMetadata = await sdk.storeMetadata({ metadata: collectionMetadata }); // stores the metadata using the storeMetadata method
console.log("Store Metadata: ", storeMetadata); // Logs the store metadata to the console

// Create a new contract
const newContract = await sdk.deploy({
  // deploys a new contract using the sdk.deploy method
  template: TEMPLATES.ERC721Mintable, // sets the template for the contract to ERC721Mintable
  params: {
    name: "1507Contract", // sets the name of the contract as "1507Contract"
    symbol: "EM", // sets the symbol of the contract as "EMOJI"
    contractURI: storeMetadata, // sets the contract URI with the storeMetadata
  },

});
console.log("Contract Address: \n", newContract.contractAddress); // logs the contract address to the console

// mint a NFT
const mint = await newContract.mint({
  // mints a new NFT using the mint method from the new contract
  publicAddress:
    process.env.WALLET_PUBLIC_ADDRESS ??
    "0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C", // sets the public address of the wallet, if not set it will use the given address
  tokenURI: storeTokenMetadata, // sets the token URI with the storeTokenMetadata
});

const minted = await mint.wait(); // waits for the minting process to complete
console.log("Minted: ", minted); // logs the minted NFT to the console