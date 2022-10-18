import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import ManualHeader from "../components/ManualHeader";

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>FOXR's Ethereum Lottery</title>
                <meta name="description" content="Our smart contract lottery on the Goerli Ethereum Testnet" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ManualHeader />
        </div>
    );
}
