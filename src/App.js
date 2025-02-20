import React, { useState, useEffect } from "react";
import { encodeFunctionData } from "viem";
import { createClient } from "./util/client";
import CounterArtifact from "./artifacts/Counter.json";
import { getContract } from "@nilfoundation/niljs"

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const CONTRACT_ABI = CounterArtifact.abi;

function App() {
    const [responseLog, setResponseLog] = useState([]);
    const [smartAccount, setSmartAccount] = useState(null);
    const [counterContract, setCounterContract] = useState(null);


    useEffect(() => {
        const initializeClient = async () => {
            try {
                const { smartAccount, publicClient } = await createClient();

                setSmartAccount(smartAccount);

                const contract = getContract({
                    client: publicClient,
                    abi: CONTRACT_ABI,
                    address: CONTRACT_ADDRESS,
                    smartAccount,
                });

                setCounterContract(contract);
            } catch (error) {
                logResponse(`❌ Failed to initialize smart account: ${error.message}`);
            }
        };

        initializeClient();
    }, []);

    const logResponse = (message) => {
        setResponseLog((prev) => [...prev, message]);
        console.log(message);
    };

    const clearLogs = () => setResponseLog([]);

    const requestAccounts = async () => {
        if (!window.nil || !window.nil.request) {
            logResponse("❌ Nil Wallet not found.");
            return;
        }

        try {
            const accounts = await window.nil.request({ method: "eth_requestAccounts" });
            logResponse(accounts?.length > 0 ? `✅ Connected: ${accounts[0]}` : "⚪ No accounts returned.");
        } catch (error) {
            logResponse(`❌ Error: ${error.message} (Code: ${error.code || "N/A"})`);
        }
    };

    const sendTransaction = async () => {
        if (!smartAccount) {
            logResponse("❌ Smart account not initialized.");
            return;
        }

        const tx = {
            to: "0x000150ca877f809d7095871b791858ad2c9c4372",
            value: 0.001,
            tokens: [{ id: "0x0001111111111111111111111111111111111114", amount: 1 }]
        };

        try {
            const txHash = await window.nil.request({
                method: "eth_sendTransaction",
                params: [tx],
            });
            logResponse(`✅ Transaction sent: ${txHash}`);
        } catch (error) {
            logResponse(`❌ Error sending transaction: ${error.message}`);
        }
    };

    const ethNonRegistered = async () => {
        if (!window.nil || !window.nil.request) {
            logResponse("❌ Nil Wallet not found.");
            return;
        }

        try {
            const result = await window.nil.request({ method: "eth_non_registered", params: [] });
            logResponse(`✅ eth_non_registered result: ${JSON.stringify(result, null, 2)}`);
        } catch (error) {
            logResponse(`❌ Error calling eth_non_registered: ${error.message}`);
        }
    };

    const getValue = async () => {
        if (!counterContract) {
            logResponse("❌ Contract not initialized.");
            return;
        }

        try {
            const value = await counterContract.read.getValue();
            logResponse(`✅ Counter value: ${value}`);
        } catch (error) {
            logResponse(`❌ Error getting counter value: ${error.message}`);
        }
    };

    const incrementCounter = async () => {
        if (!smartAccount) {
            logResponse("❌ Smart account not initialized.");
            return;
        }

        const data = encodeFunctionData({
            abi: CONTRACT_ABI,
            functionName: "increment",
            args: [],
        });

        const tx = {
            to: CONTRACT_ADDRESS,
            data: data
        };

        try {
            const txHash = await window.nil.request({
                method: "eth_sendTransaction",
                params: [tx],
            });
            logResponse(`✅ Increment transaction sent: ${txHash}`);
        } catch (error) {
            logResponse(`❌ Error incrementing counter: ${error.message}`);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>=nil; Wallet Test</h1>

            <div style={{ marginBottom: "20px" }}>
                <button onClick={requestAccounts}>🔑 Request Accounts</button>
                <button onClick={sendTransaction}>💸 Send Transaction</button>
                <button onClick={ethNonRegistered}>❓ eth_non_registered</button>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <h2>🔄 Contract Interaction (Counter)</h2>
                <button onClick={getValue}>📊 Get Counter Value</button>
                <button onClick={incrementCounter}>➕ Increment Counter</button>
            </div>

            <div style={{ marginTop: "20px", textAlign: "left", maxWidth: "600px", margin: "auto" }}>
                <h3>📝 Logs</h3>
                <button onClick={clearLogs}>🗑️ Clear Logs</button>
                <div style={{
                    background: "#eee",
                    padding: "10px",
                    minHeight: "200px",
                    overflowY: "auto",
                    maxHeight: "300px",
                    marginTop: "10px"
                }}>
                    {responseLog.length === 0 ? (
                        <p>No logs yet.</p>
                    ) : (
                        responseLog.map((log, index) => <p key={index}>{log}</p>)
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;