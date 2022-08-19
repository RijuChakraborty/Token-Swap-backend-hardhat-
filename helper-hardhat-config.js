const networkConfig= {
    31337: {
        name: "localhost"
    },
    4: {
        name: "rinkeby"
    },
}
const INITIAL_SUPPLY= "1000000000000000000000000"
                    //    1000000000000000000000000

const developmentChains= ["hardhat","localhost"]

module.exports = {
    networkConfig,
    developmentChains,
    INITIAL_SUPPLY,
  }