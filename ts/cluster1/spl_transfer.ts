import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("FHhsYPKZ4DMNAHpVbWiFkiy6H7761Lr7QVTRJgAYU7oq");

// Recipient address
const to = new PublicKey("Hpkf7fa8sCwdUrTw7aR3cVXdRfYbqHjQkPDjc1wv9v61");
// const to = new PublicKey("DcwsdNovKybMa7VMALj3VD8syjahNrrMzDWthmFoCULa");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const ownerAta = await getOrCreateAssociatedTokenAccount(connection,keypair,mint,keypair.publicKey,true)   ;
        console.log(`Your ata is: ${ownerAta.address.toBase58()}`);

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toAta = await getOrCreateAssociatedTokenAccount(connection,keypair,mint,to,true);
        console.log(`Your to ata is: ${toAta.address.toBase58()}`);

        // Transfer the new token to the "toTokenAccount" we just created
        const tx =await transfer(connection,keypair,ownerAta.address,toAta.address,keypair.publicKey,100n*1_000_000n);
        console.log(`Your transfer txid: ${tx}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();