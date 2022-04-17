import NFTMarketplaceInfo from "../../smart-contracts/artifacts/contracts/NFTMarket.sol/NFTMarket.info.json";
import NFTMarketplaceSpec from "../../smart-contracts/artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import config from "../config";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useAppContext } from "../src/AppContext";
import { useRouter } from "next/router";
import { useState } from "react";

const SUPPORTED_IMAGE_TYPES = "image/x-png,image/gif,image/jpeg";
const client = ipfsHttpClient({ url: config.ipfs.url.api });

console.info("ipfs url:", config.ipfs.url.ipfs);
console.info("ipfs api url:", config.ipfs.url.api);

export default function CreateItem() {
  const { signer } = useAppContext();

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChange(e: any) {
    /* upload image to IPFS */
    if (!e.target.files.length) {
      console.log("No image selected");
      return;
    }

    const file = e.target.files[0];
    console.log("File:", file);

    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(
        `Image type not supported, supported types are: ${SUPPORTED_IMAGE_TYPES}`
      );
    }

    const size = +(file.size / 1024 / 1024).toFixed(4); // MB
    console.log("Image size (MB):", size);
    if (size > 10) {
      throw new Error("Image size must be lower or equal to 10 MB");
    }
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });

      const url = `${config.ipfs.url.ipfs}/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !price || !fileUrl) return;
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `${config.ipfs.url.ipfs}/${added.path}`;
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS();

    /* create the NFT */
    console.log("Create contract instance");
    let contract = new ethers.Contract(
      NFTMarketplaceInfo.addr,
      NFTMarketplaceSpec.abi,
      signer
    );
    console.log("Fetch listing price");
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    console.log("\tlisting price:", listingPrice);

    const price = ethers.utils.parseUnits(formInput.price, "ether");
    console.log("NFT price:", price);
    console.log("Create token");
    let tx = await contract.createToken(url, price, {
      value: listingPrice,
    });

    console.log("Wait for tx to complete");
    await tx.wait();

    console.log("Redirect to home page");
    router.push("/");
  }

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto px-4 py-2 sm:py-0 sm:px-4 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Create new NFT
        </h2>
        <div className="mt-5 mx-auto md:mt-0 max-w-screen-md">
          <div>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div>
                  <label
                    htmlFor="assetName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Asset Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="assetName"
                      name="assetName"
                      required
                      className="shadow-sm focus:ring-pink-500 focus:border-pink-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="The name for the NFT"
                      onChange={(e) =>
                        updateFormInput({ ...formInput, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="shadow-sm focus:ring-pink-500 focus:border-pink-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Describe what this NFT is about"
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price (ETH)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="price"
                      name="price"
                      step=".5"
                      min="0"
                      required
                      className="shadow-sm focus:ring-pink-500 focus:border-pink-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      onChange={(e) =>
                        updateFormInput({ ...formInput, price: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Asset Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {fileUrl ? (
                        <img
                          className="rounded mt-4"
                          width="350"
                          src={fileUrl}
                        />
                      ) : (
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      <div className="flex text-md text-gray-600 pt-5">
                        <label
                          htmlFor="file-upload"
                          className="relative mx-auto cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept={SUPPORTED_IMAGE_TYPES}
                            onChange={onChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  onClick={listNFTForSale}
                  className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg hover:bg-pink-700 w-full disabled:hover:bg-pink-500 disabled:opacity-75"
                  disabled={!(formInput.name && formInput.price && fileUrl)}
                >
                  Create NFT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
