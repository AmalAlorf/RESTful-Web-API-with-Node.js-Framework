// const Blockchain = require('./simpleChain.js');

// // Controller Definition  to work with blocks
// class BlockController {

//     // Constructor to create a new BlockController, you need to initialize here all your endpoints
//     constructor(app) {
//         this.app = app;
//         this.blockchain = new Blockchain.Blockchain();
//         //GET Block Endpoint
//         this.getBlockByIndex();
//         //   POST Block Endpoint
//         this.postNewBlock();
//     }

//     // Implement a GET endpoint to retrieve a block by index

//     getBlockByIndex() {
//         this.app.get("/block/:index", async(req, res) => {
//             let index = req.params.index;
//             try {
//                 console.log(`Trying to get block with index ${index}`);
//                 let result = await this.blockchain.getBlock(index);
//                 res.status(200).json(result);
//                 res.end();
//             } catch (err) {
//                 console.log(`Bad request: ${err}`);
//                 res.status(400).send(`Bad request: ${err}`);
//             }
//         });
//     }

//     // Implement a POST endpoint to add a new block, url: "/block"
//     postNewBlock() {
//         this.app.post("/block", async(req, res) => {
//             let body = req.body.body;
//             try {
//                 // validate if there is content in the block before creating and adding it to the chain.
//                 if (body) {
//                     let result = await this.blockchain.addBlock(new Blockchain.Block(body));
//                     res.status(200).json(result);
//                     res.end();
//                 } else {
//                     console.log("Bad request: Empty body");
//                     res.status(400).send("Bad request: Empty body");
//                     res.end();
//                 }
//             } catch (err) {
//                 console.log(`Bad request: ${err}`);
//                 res.status(400).send(`Bad request: ${err}`);
//             }
//         });
//     }

// }