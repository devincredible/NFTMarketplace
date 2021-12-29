import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { ToastProvider, useToasts } from 'react-toast-notifications';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const COMMOM_HERO = [
    {
        name: 'Raidon',
        description: `Earth's Hero`,
        image: 'https://assets.thetanarena.com/skin/full/21000.png'
    },
    {
        name: 'Veinka',
        description: `Titan`,
        image: 'https://assets.thetanarena.com/skin/full/2002.png'
    },
    {
        name: 'Raidon',
        description: `Anonymous`,
        image: 'https://assets.thetanarena.com/skin/full/2.png'
    },
    {
        name: 'Cluster',
        description: `Calvary General`,
        image: 'https://assets.thetanarena.com/skin/full/4002.png'
    },
    {
        name: 'Big Papa',
        description: `The Boss`,
        image: 'https://assets.thetanarena.com/skin/full/15000.png'
    },
    {
        name: 'Serp',
        description: `Rogue Soldier`,
        image: 'https://assets.thetanarena.com/skin/full/1000.png'
    },
    {
        name: 'Steel Shot',
        description: `Spaceman`,
        image: 'https://assets.thetanarena.com/skin/full/5001.png'
    },
    {
        name: 'Culien',
        description: `The Baby`,
        image: 'https://assets.thetanarena.com/skin/full/24000.png'
    },
    {
        name: 'Errant Ghost',
        description: `Prison Breaker`,
        image: 'https://assets.thetanarena.com/skin/full/6001.png'
    },
    {
        name: 'Destroid',
        description: `The Bomber`,
        image: 'https://assets.thetanarena.com/skin/full/8000.png'
    },
]

const EPIC_HERO = [
    {
        name: 'Morrod',
        description: `The Huntsman`,
        image: 'https://assets.thetanarena.com/skin/full/3000.png'
    },
    {
        name: 'Bathos',
        description: `The General`,
        image: 'https://assets.thetanarena.com/skin/full/18000.png'
    },
    {
        name: 'Meiko',
        description: `Protective Robot`,
        image: 'https://assets.thetanarena.com/skin/full/14000.png'
    },
    {
        name: 'Bathos',
        description: `Bounty Hunter`,
        image: 'https://assets.thetanarena.com/skin/full/18001.png'
    },
    {
        name: 'Benjamin',
        description: `Ammunition Man`,
        image: 'https://assets.thetanarena.com/skin/full/20000.png'
    },
    {
        name: 'Lucy Muffy',
        description: `Wolffun Guitarist`,
        image: 'https://assets.thetanarena.com/skin/full/11000.png'
    },
    {
        name: 'Lucy Muffy',
        description: `Academy Lead Singer`,
        image: 'https://assets.thetanarena.com/skin/full/11001.png'
    },
    {
        name: 'Rei',
        description: `Star Batter`,
        image: 'https://assets.thetanarena.com/skin/full/7001.png'
    },
    {
        name: 'Morrod',
        description: `Lunar New Year`,
        image: 'https://assets.thetanarena.com/skin/full/3001.png'
    },
    {
        name: 'El Dragon',
        description: `Outlaw Fighter`,
        image: 'https://assets.thetanarena.com/skin/full/16000.png'
    },
]

const LEGENDARY_HERO = [
    {
        name: 'Phoenix',
        description: `Rising Spirit`,
        image: 'https://assets.thetanarena.com/skin/full/13000.png'
    },
    {
        name: 'Shanna',
        description: `Dynasty's Ranger`,
        image: 'https://assets.thetanarena.com/skin/full/12000.png'
    },
    {
        name: 'TaeKwon',
        description: `Fire Kick`,
        image: 'https://assets.thetanarena.com/skin/full/21001.png'
    },
    {
        name: 'Kong Key',
        description: `Raging Gorilla`,
        image: 'https://assets.thetanarena.com/skin/full/22000.png'
    }
]

import {
    nftaddress, nftmarketaddress, ftkaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import FTK from '../artifacts/contracts/FTK.sol/FTK.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function OpenBox() {

    const { addToast } = useToasts();

    const router = useRouter()

    async function openBox(type, price) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const ownerAddress = signer.getAddress()
        const amount = ethers.utils.parseUnits('10000000000', 'ether')

        // /* next, create the item */
        let FTKContract = new ethers.Contract(ftkaddress, FTK.abi, signer)
        let allowance = await FTKContract.allowance(ownerAddress, nftaddress)
        let numberAllowance = ethers.utils.formatEther(allowance)
        if (numberAllowance == 0.0) {
            let approve = await FTKContract.approve(nftaddress, amount)
            if (approve)
                addToast('Aprove Successfully', { appearance: 'success' });
        } else {
            let data = {}
            if (type == 'COMMOM_HERO') {
                data = COMMOM_HERO[Math.floor(Math.random() * COMMOM_HERO.length)]
            } else
                if (type == 'EPIC_HERO') {
                    data = EPIC_HERO[Math.floor(Math.random() * EPIC_HERO.length)]
                } else
                    if (type == 'LEGENDARY_HERO') {
                        data = LEGENDARY_HERO[Math.floor(Math.random() * LEGENDARY_HERO.length)]
                    }
            const added = await client.add(JSON.stringify(data))
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            createToken(url, price, signer)
        }
    }

    const createToken = async (url, price, signer) => {
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        let amount = ethers.utils.parseUnits(price, 18)
        let transaction = await contract.createToken(url, amount)
        let tx = await transaction.wait()
        let event = tx.events[2]
        console.log(tx)
        console.log('========================')
        console.log(event)
        let value = event.args[2]
        let tokenId = value.toNumber()

        addToast('Open box Successfully', { appearance: 'success' });

        /* then list the item for sale on the marketplace */
        // contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        // let listingPrice = await contract.getListingPrice()
        // listingPrice = listingPrice.toString()

        // transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
        // await transaction.wait()
        router.push('/my-assets')
    }

    return (
        <div className="flex justify-center pt-12">
            <div className="w-1/2 flex flex-col pb-12" style={{ alignItems: 'center' }}>
                <img src="https://marketplace.thetanarena.com/7daf5c4a366b2d0f8c649fdacb1b546e.svg" style={{ width: 200 }} />
                <p style={{ fontWeight: 'bold', fontSize: 18, marginTop: 20, fontStyle: 'italic' }}>COMMON BOX</p>
                <button onClick={() => openBox('COMMOM_HERO', '1000')} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    1,000 FTK
                </button>
            </div>
            <div className="w-1/2 flex flex-col pb-12" style={{ alignItems: 'center' }}>
                <img src="https://marketplace.thetanarena.com/b2555a1ec7cd904b2fc2010c50ea679e.svg" style={{ width: 200 }} />
                <p style={{ fontWeight: 'bold', fontSize: 18, marginTop: 20, fontStyle: 'italic' }}>EPIC BOX</p>
                <button onClick={() => openBox('EPIC_HERO', '2000')} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    2,000 FTK
                </button>
            </div>
            <div className="w-1/2 flex flex-col pb-12" style={{ alignItems: 'center' }}>
                <img src="https://marketplace.thetanarena.com/1155c18b8b0d418023f0c752cf3b531e.svg" style={{ width: 200 }} />
                <p style={{ fontWeight: 'bold', fontSize: 18, marginTop: 20, fontStyle: 'italic' }}>LEGENDARY BOX</p>
                <button onClick={() => openBox('LEGENDARY_HERO', '10000')} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    10,000 FTK
                </button>
            </div>
        </div>
    )
}