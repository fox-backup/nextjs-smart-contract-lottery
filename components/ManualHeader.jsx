import { useMoralis } from "react-moralis";
import { useEffect } from "react";

export default function ManualHeader() {

    const { enableWeb3, isWeb3Enabled, account } = useMoralis()

    useEffect(() => {
        console.log("Web3 is connected!");
    }, [isWeb3Enabled]);

    return(
        <div>
            {account ? (<div>Connected to {account.slice(0,6)}...{account.slice(account.length - 4)}</div>) : (<button onClick={async () => {await enableWeb3()}}>Connect</button>)}
        </div>
    )
}