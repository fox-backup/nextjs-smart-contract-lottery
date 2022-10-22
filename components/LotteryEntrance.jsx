import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../constants"
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LoteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex);
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const{runContractFunction: enterRaffle} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const{runContractFunction: getEntranceFee, isFetching, isLoading} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const{runContractFunction: getNumberOfPlayers} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const{runContractFunction: getRecentWinner} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString();
        const recentWinnerFromCall = (await getRecentWinner()).toString();
        setEntranceFee(entranceFeeFromCall);
        setNumPlayers(numberOfPlayersFromCall);
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1);
            handleNewNotification(tx);
            updateUI();
        } catch(e) {
            console.log(error);
        }
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="LotteryEntrance">
            { lotteryAddress ? (
                <div className="ContractInteractions">
                    <div className="ContractText">The entrance fee into the lottery is {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div className="ContractText">There are {numPlayers} entered into the lottery!</div>
                    <div className="ContractText">The last winner was {recentWinner}</div>
                    <button 
                        className="EnterRaffle"
                        onClick={async () =>
                            {await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error => console.log(error))
                                })
                            }
                        }
                        disabled={isFetching || isLoading}
                    >
                        {isLoading || isFetching ? (
                            <div className="ButtonLoading"></div>
                        ) : (
                            "Enter Raffle"
                        )}
                    </button>
                    <div className="LinksContainer">
                        <a className="Links" href="https://goerli.etherscan.io/address/0xd5aEdbBB11f34F42af2d9bF20a5bF9634Bdd7a4a">Contract address: {lotteryAddress}</a>
                        <br />
                        <br />
                        <a className="Links" href="https://www.foxr.xyz">Made by FOXR.</a>
                    </div>
                </div>
            ) : (
                <div>No Lottery Address Detected</div>
            ) }
        </div>
    )
}