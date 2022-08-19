const { ethers, network}= require("hardhat")
const { INITIAL_SUPPLY } = require("../helper-hardhat-config")

async function transferTokens(){
    const tokenSwap= await ethers.getContract("TokenSwap")
    const rckToken= await ethers.getContract("RockToken")
    const tx= await rckToken.transfer (tokenSwap.address, INITIAL_SUPPLY)
    await tx.wait(1)
    console.log("TokenSwap contract now has all available tokens")
    
}

transferTokens()
    .then(()=> process.exit(0))
    .catch((error)=>{
        console.log(error)
        process.exit(1)
    })