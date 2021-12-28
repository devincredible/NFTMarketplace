import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { useRouter } from 'next/router'

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {

  const router = useRouter()

  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const owner = signer.getAddress()
    const data = await tokenContract.getOwnerNFT()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i[0])
      const meta = await axios.get(tokenUri)
      let item = {
        tokenId: i[0],
        name: meta.data.name,
        description: meta.data.description,
        image: meta.data.image,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded')
  }

  const sellNFT = (nft) => {
    router.push(`/sell-item?tokenId=${nft.tokenId}`)
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden" onClick={() => sellNFT(nft)}>
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">{nft.name}</p>
                  <p className="text-2xl font-bold text-white">{nft.description}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}