import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter, withRouter } from 'next/router'
import Web3Modal from 'web3modal'
import axios from 'axios'


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

const SellItem = (props) => {
  const tokenId = props.router.query.tokenId

  const [nft, setNft] = useState({})
  const [sellPrice, setSellPrice] = useState(0)

  useEffect(() => {
    loadNft()
  }, [])

  const loadNft = async () => {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)

    const tokenUri = await tokenContract.tokenURI(tokenId)
    const meta = await axios.get(tokenUri)
    let item = {
      tokenId,
      name: meta.data.name,
      description: meta.data.description,
      image: meta.data.image,
    }
    setNft(item)
  }

  const router = useRouter()

  const sellNFT = async () => {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const price = ethers.utils.parseUnits(sellPrice, 'ether')

    let transaction = await contract.createMarketItem(nftaddress, tokenId, price)
    await transaction.wait()
    router.push('/on-sale')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <div className="border shadow rounded-xl overflow-hidden">
          <div style={{ alignItems: 'center', flexDirection: 'column', display: 'flex' }}>
            <img src={nft.image} className="rounded" />
          </div>
          <div className="p-4 bg-black">
            <p className="text-2xl font-bold text-white">{nft.name}</p>
            <p className="text-2xl font-bold text-white">{nft.description}</p>
          </div>
        </div>
        <input
          placeholder="Asset Price in FTK"
          className="mt-2 border rounded p-4"
          onChange={e => setSellPrice(e.target.value)}
        />
        <button onClick={sellNFT} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create Digital Asset
        </button>
      </div>
    </div>
  )
}

export default withRouter(SellItem)