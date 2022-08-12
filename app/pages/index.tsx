import type { NextPage } from "next";
import { FaTwitter } from "react-icons/fa";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { FormEvent, useState, useEffect } from "react";
import idl from "../../target/idl/gif_portal.json";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

const TWITTER_HANDLE = "trinidadhype";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
  "https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp",
  "https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g",
  "https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g",
  "https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp",
];

const kp = JSON.parse(process.env.NEXT_PUBLIC_KEYPAIR as string);
const arr: number[] = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const gifAccount = web3.Keypair.fromSecretKey(secret);

const programID = new PublicKey(idl.metadata.address);

const Home: NextPage = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState<{ gifLink: string }[] | null>([]);

  const onInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    setInputValue(value);
  };

  async function getProvider() {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signTransaction ||
      !wallet.signAllTransactions
    ) {
      return;
    }

    const signerWallet = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    };

    const provider = new AnchorProvider(connection, signerWallet, {
      preflightCommitment: "processed",
    });
    return provider;
  }

  const sendGif = async () => {
    if (inputValue.length === 0) {
      console.log("No gif link given!");
      return;
    }
    setInputValue("");
    console.log("Gif link:", inputValue);
    try {
      const provider = await getProvider();
      const program = new Program(idl as any, programID, provider);

      await program.methods
        .addGif(inputValue)
        .accounts({
          gifAccount: gifAccount.publicKey,
          user: provider?.wallet.publicKey,
        })
        .rpc();

      console.log("GIF successfully sent to program", inputValue);

      await getGifList();
    } catch (error) {
      console.log("Error sending GIF:", error);
    }
  };

  const getGifList = async () => {
    try {
      const provider = await getProvider();
      const program = new Program(idl as any, programID, provider);
      const account = await program.account.gifAccount.fetch(
        gifAccount.publicKey
      );

      console.log("Got the account", account);
      setGifList(account.gifList);
    } catch (error) {
      console.log("Error in getGifList: ", error);
      setGifList(null);
    }
  };

  const createGifAccount = async () => {
    try {
      const provider = await getProvider();
      const program = new Program(idl as any, programID, provider);
      console.log("ping");
      await program.methods
        .initialize()
        .accounts({
          gifAccount: gifAccount.publicKey,
          user: provider?.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([gifAccount])
        .rpc();

      console.log(
        "Created a new BaseAccount w/ address:",
        gifAccount.publicKey.toString()
      );
      await getGifList();
    } catch (error) {
      console.log("Error creating BaseAccount account:", error);
    }
  };

  const renderConnectedContainer = () => {
    if (gifList === null) {
      return (
        <div className="mt-12">
          <button
            className="bg-[#512da8] border-none inline-flex items-center text-base text-white font-semibold h-12 py-0 px-6 rounded-md"
            onClick={createGifAccount}
          >
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendGif();
            }}
            className="mt-12"
          >
            <input
              value={inputValue}
              onChange={onInputChange}
              type="text"
              placeholder="Enter gif link!"
              className="shadow appearance-none border rounded mr-2 h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="submit"
              className="bg-[#512da8] border-none inline-flex items-center text-base text-white font-semibold h-12 py-0 px-6 rounded-md"
            >
              Submit
            </button>
          </form>
          <div className="mt-16">
            <div className="flex flex-wrap justify-center gap-3">
              {gifList?.map((gif, index) => (
                <div key={index} className="flex-[0_1_300px]">
                  <Image
                    src={gif.gifLink}
                    alt="User submitted GIF image"
                    width={300}
                    height={300}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (wallet.publicKey) {
      console.log("Fetching GIF list...");

      getGifList();
    }
  }, [wallet.publicKey]);

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex flex-row justify-end p-3">
        <WalletMultiButton />
      </nav>
      <div className="text-center">
        <div className="flex relative flex-col justify-center px-8">
          <div className="">
            <p className="m-5 text-5xl font-bold text-white">🦑 GIF Portal</p>
            <p className="text-2xl text-white">
              View your GIF collection in the metaverse ✨
            </p>
            {wallet.publicKey && renderConnectedContainer()}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mt-auto pb-11">
        <FaTwitter color="white" className="mr-2" />
        <a
          className="text-white text-base font-bold"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built by @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  );
};

export default Home;
