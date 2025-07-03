import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi('https://devnet.helius-rpc.com/?api-key=71d05d9f-5d94-4548-9137-c6c3d9f69b3e');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader({address: "https://devnet.irys.xyz/",}));
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        const image = await readFile("/home/mehan/step_7/turbin_q3/solana-starter/ts/cluster1/mehanImg.jpeg");
        //2. Convert image to generic file.
        const genetic_file =  createGenericFile(image,"mehan.png",{contentType:"image/png"});
        //3. Upload image
        const [myUri] = await umi.uploader.upload([genetic_file]);
        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
