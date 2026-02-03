import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  CHAT_CONTRACT_ABI,
  CHAT_CONTRACT_ADDRESS,
} from "../utils/constants";

export default function Home() {
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [contract, setContract] = useState(null);

  // 🔌 CONNECT WALLET
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not found");
        return;
      }

      console.log("🔌 Connecting wallet...");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const selectedAccount = accounts[0];
      setAccount(selectedAccount);

      console.log("✅ Wallet connected:", selectedAccount);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      console.log("✍️ Signer address:", await signer.getAddress());
      console.log("📍 Using contract address:", CHAT_CONTRACT_ADDRESS);

      const chatContract = new ethers.Contract(
        CHAT_CONTRACT_ADDRESS,
        CHAT_CONTRACT_ABI,
        signer
      );

      setContract(chatContract);
      console.log("✅ Contract initialized");

    } catch (err) {
      console.error("❌ Wallet connection failed:", err);
    }
  };

  // 📩 SEND MESSAGE (DEBUGGING HERE)
  const sendMessage = async () => {
    if (!message) {
      console.log("❌ Message is empty");
      return;
    }

    if (!contract) {
      console.log("❌ Contract is NOT initialized");
      return;
    }

    try {
      console.log("🚀 Sending message:", message);

      const tx = await contract.sendMessage(message);

      console.log("⏳ Transaction sent:", tx.hash);

      await tx.wait();

      console.log("✅ Transaction confirmed");

      setMessage("");
      loadMessages();

    } catch (err) {
      console.error("❌ Transaction error:", err);
    }
  };

  // 📥 LOAD MESSAGES FROM BLOCKCHAIN
  const loadMessages = async () => {
    if (!contract) return;

    try {
      console.log("📥 Loading messages...");
      const msgs = await contract.getMessages();
      setMessages(msgs);
      console.log("✅ Messages loaded:", msgs.length);
    } catch (err) {
      console.error("❌ Failed to load messages:", err);
    }
  };

  // 🔄 LOAD MESSAGES WHEN CONTRACT READY
  useEffect(() => {
    if (contract) {
      loadMessages();
    }
  }, [contract]);

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>Blockchain Chat DApp</h1>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>
          <b>Connected:</b> {account}
        </p>
      )}

      <hr />

      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>

      <ul>
        {messages.map((m, i) => (
          <li key={i}>
            <b>{m.sender.slice(0, 6)}:</b> {m.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
