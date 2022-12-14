import type { NextPage } from "next";
import Head from "next/head";
import SideNav from "../components/SideNav";
import TransactionTable from "../components/Table/TransactionTable";
import FixedWrapper from "../components/FixedWrapper";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FixedWrapper>
        <SideNav />
        <div className="max-w-8xl mx-auto mt-10 w-full overflow-hidden px-2">
          <TransactionTable />
        </div>
      </FixedWrapper>
    </>
  );
};

export default Home;
