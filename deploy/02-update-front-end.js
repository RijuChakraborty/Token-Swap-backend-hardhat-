const { ethers, network } = require("hardhat")
const fs= require("fs")

const FRONT_END_ADDRESSES_FILE= "../nextjs-token-swap/constants/contractAddresses.json"
const frontEndAbiLocation= "../nextjs-token-swap/constants/"
const frontEndTokenAddress= "../nextjs-token-swap/constants/tokenAddress.json"

module.exports= async function(){
    if (process.env.UPDATE_FRONT_END){
        console.log("Updating front end...")
        await updateContractAddress()
        await updateAbi()
    }
}

async function updateAbi(){
    const tokenSwap= await ethers.getContract("TokenSwap")
    fs.writeFileSync(`${frontEndAbiLocation}TokenSwap.json`, tokenSwap.interface.format(ethers.utils.FormatTypes.json))

    const rckToken= await ethers.getContract("RockToken")
    fs.writeFileSync(`${frontEndAbiLocation}RockToken.json`,rckToken.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddress(){
    const tokenSwap= await ethers.getContract("TokenSwap")
    let chainId= network.config.chainId.toString()
    let currentAddresses= JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
    if (chainId in currentAddresses){
        if (!currentAddresses[chainId].includes(tokenSwap.address)){
            currentAddresses[chainId].push(tokenSwap.address)
        }
    }
    else {
        currentAddresses[chainId]= [tokenSwap.address]
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))

    const rckToken= await ethers.getContract("RockToken")
    chainId= network.config.chainId.toString()
    currentAddresses= JSON.parse(fs.readFileSync(frontEndTokenAddress, "utf8"))
    if (chainId in currentAddresses){
        if (!currentAddresses[chainId].includes(rckToken.address)){
            currentAddresses[chainId].push(rckToken.address)
        }
    }
    else {
        currentAddresses[chainId]= [rckToken.address]
    }
    fs.writeFileSync(frontEndTokenAddress, JSON.stringify(currentAddresses))
}

module.exports.tags= ["all", "frontend"]