import type { NextPage } from "next";
import { FaTwitter } from "react-icons/fa";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { FormEvent, useState, useEffect } from "react";

const TWITTER_HANDLE = "trinidadhype";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
  "https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp",
  "https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g",
  "https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g",
  "https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp",
];

const Home: NextPage = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState<string[]>([]);

  const onInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    setInputValue(value);
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log("Gif link:", inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue("");
    } else {
      console.log("Empty input. Try again.");
    }
  };

  const renderConnectedContainer = () => (
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
          {gifList.map((gif) => (
            <div key={gif} className="flex-[0_1_300px]">
              <Image src={gif} alt={gif} width={300} height={300} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (publicKey) {
      console.log("Fetching GIF list...");

      // Call Solana program here.

      // Set state
      setGifList(TEST_GIFS);
    }
  }, [publicKey]);

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
            {publicKey && renderConnectedContainer()}
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
