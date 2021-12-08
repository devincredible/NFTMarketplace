import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    nftaddress, nftmarketaddress, ftkaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import FTK from '../artifacts/contracts/FTK.sol/FTK.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function OpenBox() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const router = useRouter()

    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }
    async function openBox() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const amount = ethers.utils.parseUnits('1000000', 'ether')

        /* next, create the item */
        let FTKContract = new ethers.Contract(ftkaddress, FTK.abi, signer)
        let approve = FTKContract.approve(nftaddress, amount)
        // let contract = new ethers.Contract(ftkaddress, NFT.abi, signer)
        // let transaction = await contract.createToken(url)
        // let tx = await transaction.wait()
        // let event = tx.events[0]
        // let value = event.args[2]
        // let tokenId = value.toNumber()

        // /* then list the item for sale on the marketplace */
        // contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        // let listingPrice = await contract.getListingPrice()
        // listingPrice = listingPrice.toString()

        // transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
        // await transaction.wait()
        // router.push('/')
    }

    return (
        <div className="flex justify-center pt-12">
            <div className="w-1/2 flex flex-col pb-12" style={{ alignItems: 'center' }}>
                <img src="https://marketplace.thetanarena.com/7daf5c4a366b2d0f8c649fdacb1b546e.svg" style={{ width: 200 }} />
                <p style={{ fontWeight: 'bold', fontSize: 18, marginTop: 20, fontStyle: 'italic' }}>COMMON BOX</p>
                <button onClick={openBox} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    1,000 FTK
                </button>
            </div>
            <div className="w-1/2 flex flex-col pb-12" style={{ alignItems: 'center' }}>
                <img src="https://marketplace.thetanarena.com/b2555a1ec7cd904b2fc2010c50ea679e.svg" style={{ width: 200 }} />
                <p style={{ fontWeight: 'bold', fontSize: 18, marginTop: 20, fontStyle: 'italic' }}>EPIC BOX</p>
                <button onClick={openBox} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    2,000 FTK
                </button>
            </div>
            <div className="w-1/2 flex flex-col pb-12" style={{ alignItems: 'center' }}>
                <img src="https://marketplace.thetanarena.com/1155c18b8b0d418023f0c752cf3b531e.svg" style={{ width: 200 }} />
                <p style={{ fontWeight: 'bold', fontSize: 18, marginTop: 20, fontStyle: 'italic' }}>LEGENDARY BOX</p>
                <button onClick={openBox} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    10,000 FTK
                </button>
            </div>
        </div>
    )
}