import React, { useState } from "react";

function App() {
    const [responseLog, setResponseLog] = useState([]);

    const logResponse = (message) => {
        setResponseLog((prev) => [...prev, message]);
        console.log(message);
    };

    const requestAccounts = async () => {
        if (!window.nil || !window.nil.request) {
            logResponse("❌ Nil Wallet not found.");
            return;
        }

        try {
            const accounts = await window.nil.request({ method: "eth_requestAccounts" });

            if (accounts && accounts.length > 0) {
                logResponse(`✅ Connected: ${accounts[0]}`);
            } else {
                logResponse("⚪ No accounts returned. User might have rejected or no wallet available.");
            }
        } catch (error) {
            logResponse(`❌ Error: ${error.message} (Code: ${error.code || "N/A"})`);
        }
    };

    const sendTransaction = async () => {
        if (!window.nil || !window.nil.request) {
            logResponse("❌ Nil Wallet not found.");
            return;
        }

        const tx = {
            to: "0x000150ca877f809d7095871b791858ad2c9c4372",
            value: 0.005,
            tokens: [
                {id:"0x0001111111111111111111111111111111111114", amount:2}
            ]
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

    const callRandomFunction = async () => {
        if (!window.nil || !window.nil.request) {
            logResponse("❌ Nil Wallet not found.");
            return;
        }

        try {
            const result = await window.nil.request({ method: "random_unknown_method", params: [] });
            console.log(JSON.stringify(result, null, 2))
        } catch (error) {
            logResponse(`❌ Error calling random function: ${error.message}`);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>=nil; Wallet Test</h1>

            <button onClick={requestAccounts}>🔑 Request Accounts</button>
            <button onClick={sendTransaction}>💸 Send Transaction</button>
            <button onClick={callRandomFunction}>❓ Call Random Function</button>

            <div style={{ marginTop: "20px", textAlign: "left", maxWidth: "500px", margin: "auto" }}>
                <h3>📝 Logs</h3>
                <div style={{ background: "#eee", padding: "10px", minHeight: "150px", overflowY: "auto" }}>
                    {responseLog.length === 0 ? <p>No logs yet.</p> : responseLog.map((log, index) => <p key={index}>{log}</p>)}
                </div>
            </div>
        </div>
    );
}

export default App;
