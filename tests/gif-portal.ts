import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GifPortal } from "../target/types/gif_portal";

const { SystemProgram } = anchor.web3;

describe("gif-portal", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GifPortal as Program<GifPortal>;
  const gifAccount = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().accounts({
      gifAccount: gifAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
  }).signers([gifAccount]).rpc();

    console.log("Your transaction signature:", tx);

    let account = await program.account.gifAccount.fetch(gifAccount.publicKey);
    console.log('👀 GIF Count', account.numGifs.toString())
  });
});
