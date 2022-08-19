const {assert,expect}= require("chai")
const {network, deployments, ethers, getNamedAccounts}= require("hardhat")
const {developmentChains}= require("../../helper-hardhat-config")
const provider = ethers.getDefaultProvider();;

!developmentChains.includes(network.name)
    ?describe.skip
    :describe("Token Swap Unit Tests", function(){
        let tokenSwap, rckToken, deployer, user

        function tokens(n) {
            return ethers.utils.parseEther(n);
          }

        beforeEach( async function(){
            deployer= (await getNamedAccounts()).deployer
            const accounts= await ethers.getSigners()
            user= accounts[1]
            await deployments.fixture(["all"])
            tokenSwap= await ethers.getContract("TokenSwap")
            rckToken= await ethers.getContract("RockToken")
            await rckToken.transfer(tokenSwap.address, tokens('1000000'))
        })

        describe("Token Swap deployment", function(){
            it("Contract has tokens", async function(){
                let balance= await rckToken.balanceOf(tokenSwap.address)
                assert.equal(balance.toString(), tokens("1000000"))
            })
        })

        describe("Buy tokens", function(){
            // it("Should be rejected if amount asked is more than balance of contract",async function(){
            //     tokenSwapUser= tokenSwap.connect(user)
            //     await tokenSwapUser.buyToken({value: ethers.utils.parseEther("1000001")}).should.be.rejected()
            // })

            it("Tokens tranfered to user from contract", async function(){
                // let ts= await provider.getBalance(tokenSwap.address);
                // console.log(ts.toString())
                tokenSwapUser= tokenSwap.connect(user)
                expect( await tokenSwapUser.buyToken({value: ethers.utils.parseEther("1")})).to.emit(
                    "TokenBought"
                )
                
                let userBalance= await rckToken.balanceOf(user.address)
                assert.equal(userBalance.toString(), tokens("100"))
                
                let tokenSwapBalance= await rckToken.balanceOf(tokenSwap.address)
                assert.equal(tokenSwapBalance.toString(), tokens("999900"))
                
                // tokenSwapBalance= await provider.getBalance(tokenSwap.address);
                // console.log(tokenSwapBalance.toString())
                // assert.equal(tokenSwapBalance.toString(), ethers.utils.parseEther("1"))// error contract balance not matching
            })
        })

        describe("Sell Tokens", function(){
            it("User sells token", async function(){
                tokenSwapUser= tokenSwap.connect(user)
                await tokenSwapUser.buyToken({value: ethers.utils.parseEther("1")})
                tokenUser= rckToken.connect(user)
                await tokenUser.approve(tokenSwap.address, tokens("50"))
                expect (await tokenSwapUser.sellToken(tokens('50'))).to.emit(
                    "TokenSold"
                )
                
                let userBalance= await rckToken.balanceOf(user.address)
                assert.equal(userBalance.toString(), tokens("50"))
                
                let tokenSwapBalance= await rckToken.balanceOf(tokenSwap.address)
                assert.equal(tokenSwapBalance.toString(), tokens("999950"))

                // tokenSwapBalance= await provider.getBalance(tokenSwap.address);
                // console.log(tokenSwapBalance.toString())
            })
        })
    })