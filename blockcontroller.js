const SHA256 = require('crypto-js/sha256');
const Blockchain = require('./simpleChain.js').Blockchain;
const Block = require('./simpleChain.js');
/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {
    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
            this.app = app;
            this.blocks = [];
            this.blockchain = new Blockchain();
            this.initializeMockData();
            this.getBlockByIndex();
            this.postNewBlock();
        }
        /**
         * Implement a GET endpoint to retrieve a block by index
         */
    getBlockByIndex() {
            this.app.get("/block/:index", async(req, res) => {
                //Get block hight "index"
                let index = req.params.index;
                try {
                    console.log(`Get block with index ${index}`);
                    //Get block by index
                    let result = await this.blockchain.getBlock(index);
                    //convert the block to json format
                    res.json(result);
                    res.end();
                } catch (err) {
                    console.log(`Error: ${err}`);
                    //Bad request
                    res.send(`Error: ${err}`);
                }
            });
        }
        /**
         * Implement a POST endpoint to add a new block, url: "/block"
         */
    postNewBlock() {
            this.app.post("/block", async(req, res) => {
                //Get body
                let body = req.body.body;
                try {
                    // check if the body is empty or not
                    if (body) {
                        //add the new block to chain
                        let result = await this.blockchain.addBlock(new Block.Block(body));
                        // convert the block to json format
                        res.json(result);
                        res.end();
                    } else {
                        console.log("Empty body");
                        res.send("Empty body");
                        res.end();
                    }
                } catch (err) {
                    console.log(`Error: ${err}`);
                    res.send(`Error: ${err}`);
                }
            });
        }
        /**
         * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
         */
    initializeMockData() {
        if (this.blocks.length === 0) {
            for (let index = 0; index < 10; index++) {
                let blockAux = new Block.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }

}
/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app); }