import NFTMarketplaceInfo from "../../smart-contracts/artifacts/contracts/NFTMarket.sol/NFTMarket.info.json";
import NFTMarketplaceSpec from "../../smart-contracts/artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import config from "../config";
import { ethers } from "ethers";
import { getProvider } from "../src/provider";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import { useState } from "react";

const client = ipfsHttpClient({ url: config.ipfs.url.api });

console.info("ipfs url:", config.ipfs.url.ipfs);
console.info("ipfs api url:", config.ipfs.url.api);

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChange(e: any) {
    /* upload image to IPFS */
    const file = e.target.files[0];
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
    if (!name || !description || !price || !fileUrl) return;
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
    const provider = await getProvider();
    const signer = provider.getSigner();

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
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create NFT
        </button>
      </div>
    </div>
  );
}
