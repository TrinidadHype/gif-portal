import type { NextPage } from "next";
import { FaTwitter } from "react-icons/fa";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const TWITTER_HANDLE = "trinidadhype";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const Home: NextPage = () => {
  return (
    <div className="h-screen bg-[#1a202c] overflow-auto text-center">
      <div className="h-screen flex relative flex-col justify-center px-8">
        <div className="">
          <p className="m-0 text-5xl font-bold text-white">🖼 GIF Portal</p>
          <p className="text-2xl text-white">
            View your GIF collection in the metaverse ✨
          </p>
          <WalletMultiButton />
        </div>
        <div className="flex justify-center items-center absolute w-full bottom-0 left-0 pb-11">
          <FaTwitter color="white" className="mr-2" />
          <a
            className="text-white text-base font-bold"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
