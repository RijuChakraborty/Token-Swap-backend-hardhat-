const { INITIAL_SUPPLY, developmentChains }= require("../helper-hardhat-config")
const{ getNamedAccounts, deployments, network }= require("hardhat")
const {verify} = require("../utils/verify")

module.exports= async ({getNamedAccounts, deployments})=>{
    const {deploy, log}= deployments
    const {deployer}= await getNamedAccounts()

    const rckToken= await deploy("RockToken",{
        from: deployer,
        args: [INITIAL_SUPPLY],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`rckToken deployed at ${rckToken.address}`)

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(rckToken.address, [INITIAL_SUPPLY])
    }

    log("-------------------------------------------------")

    const tokenSwap= await deploy("TokenSwap",{
        from: deployer,
        args: [rckToken.address],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
    log(`tokenSwap deployed at ${tokenSwap.address}`)

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(tokenSwap.address, args)
    }

    log("-------------------------------------------------")
}
module.exports.tags=["all"]