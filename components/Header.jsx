import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div className="Header">
            <h1>FOXR's Decentralized Lottery</h1>
            <ConnectButton moralisAuth={false} />
        </div>
    )
}