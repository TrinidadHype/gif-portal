import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GifPortal } from "../target/types/gif_portal";

describe("gif-portal", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.GifPortal as Program<GifPortal>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
