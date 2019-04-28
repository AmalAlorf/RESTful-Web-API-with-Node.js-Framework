/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');

//////////////////
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);
/////////////
/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
    constructor(data) {
        this.hash = "",
            this.height = 0,
            this.body = data,
            this.time = 0,
            this.previousBlockHash = ""
    }
}
/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
    constructor() {
            this.chain = this.addGenesisBlock();
            this.addBlock(new Block("First block in the chain - Genesis block"));
        }
        ////////function to add first block in the chain//////////
    async addGenesisBlock() {
            const genesis_block = new Block("First block in the chain - Genesis block");
            //set hight
            genesis_block.height = 0;
            //set time
            genesis_block.time = new Date().getTime().toString();
            //calculate hash 
            genesis_block.hash = await SHA256(JSON.stringify(genesis_block)).toString();
            // Add genesis block to chain
            try {
                await db.put(genesis_block.height, JSON.stringify(genesis_block).toString());
                //  console.log("Genesis block added");
            } catch (err) {
                console.log("error in addGenesisBlock function:" + err);
            }
        }
        // Add new block function
    async addBlock(newBlock) {
            try {
                // get Block height
                let height = await this.getBlockHeight(); // review 
                //check if the block is genesis or no 
                if (height === 0) {
                    //if hight equal 0 means that's this block is the first block in the chain 
                    //call addGenesisBlock function
                    await this.addGenesisBlock();
                    height++;
                }
                newBlock.height = height;
                // set time stamp
                newBlock.time = new Date().getTime().toString();
                // get previous block hash
                let previousBlock = await this.getBlock(newBlock.height - 1);
                newBlock.previousBlockHash = previousBlock.hash;
                // Block hash with SHA256 
                newBlock.hash = await SHA256(JSON.stringify(newBlock)).toString();
                // Adding new block to chain
                await db.put(newBlock.height, JSON.stringify(newBlock).toString());
            } catch (err) {
                console.log("Error in AddBlock function:" + err);
            }
        }
        // Get block height
    getBlockHeight() {
            return new Promise(resolve => {
                let height = 0;
                ///////////reads sequentially from the current chain to get the block height 
                db.createReadStream().on('data', (data) => {
                    height++;
                }).on('close', () => {
                    resolve(height);
                });
            });
        }
        // get block function
    async getBlock(blockHeight) {
            try {
                //get the block from chain
                let blockValue = await db.get(blockHeight);
                return blockValue;
            } catch (err) {
                console.log("Error in getBlock function :" + err);
            }
        }
        // check if the block is validate or no 
    async validateBlock(blockHeight) {
            // get block object
            let block = await this.getBlock(blockHeight);
            // get block hash
            let blockHash = block.hash;
            // remove block hash to test block integrity
            block.hash = '';
            // generate block hash
            let validBlockHash = await SHA256(JSON.stringify(block)).toString();
            // Compare
            if (blockHash === validBlockHash) {
                return true;
            } else {
                console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
                return false;
            }
        }
        // Validate blockchain
    async validateChain() {
        let errorLog = [];
        for (var i = 0; i < this.chain.length - 1; i++) {
            // validate block
            if (!await this.validateBlock(i)) errorLog.push(i);
            // compare blocks hash link
            let blockHash = await this.chain[i].hash;
            let previousHash = this.chain[i + 1].previousBlockHash;
            if (blockHash !== previousHash) {
                errorLog.push(i);
            }
        }
        if (errorLog.length > 0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: ' + errorLog);
        } else {
            console.log('No errors detected');
        }
    }
}
module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
///Testing 
(function theLoop(i) {
    setTimeout(function() {
        const blockTest = new Block("Test Block - " + (i + 1));
        let blockchain = new Blockchain();
        blockchain.addBlock(blockTest).then((result) => {
            //display the object in json format
            console.log(JSON.stringify(blockTest));
            // console.log(result);
            i++;
            if (i < 10) theLoop(i);
        });
    }, 10000);
})(0);