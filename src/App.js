/*global chrome*/
import React, { useState, useEffect } from "react";
import "./App.css";
import { encodeFunctionData } from "viem";

// Import ABI from the artifacts
import CounterABI from "./artifacts/Counter.json";
import { createClient } from "./util/client";

function App() {
    const [logs, setLogs] = useState([]);
    const [port, setPort] = useState(null);
    const [value, setValue] = useState(-1);

    const extensionId = process.env.REACT_APP_EXTENSION_ID;
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

    const addLog = (log) => {
        setLogs((prevLogs) => [...prevLogs, log]);
    };

    useEffect(() => {
        console.log(process.env)
        const connectionPort = chrome.runtime.connect(extensionId, { name: "signAndSend" });
        setPort(connectionPort);

        connectionPort.onMessage.addListener((msg) => {
            addLog(`Message from extension via port: ${JSON.stringify(msg)}`);
        });

        connectionPort.onDisconnect.addListener(() => {
            addLog("Port disconnected");
            setPort(null);
        });

        return () => {
            connectionPort.disconnect();
        };
    }, [extensionId]);

    const decodeHexToNumber = (hexValue) => {
        const cleanedHex = hexValue.replace(/^0x0*/, "");
        return cleanedHex.toString();
    };

    const getValue = async () => {
        try {
            const { wallet, publicClient } = await createClient();

            const calldata = encodeFunctionData({
                abi: CounterABI.abi,
                functionName: "getValue",
                args: [],
            });

            const result = await publicClient.call(
                {
                    data: calldata,
                    to: contractAddress,
                },
                "latest"
            );

            console.log("Contract Value:", result);
            setValue(decodeHexToNumber(result.data));
        } catch (error) {
            console.error("Error calling getValue:", error);
        }
    };

    const sendMessageToExtension = () => {
        if (!chrome.runtime) {
            console.error("Chrome Extension API is not available.");
            addLog("Error: Chrome Extension API is not available.");
            return;
        }

        const calldata = encodeFunctionData({
            abi: CounterABI.abi,
            functionName: "increment",
            args: [],
        });

        const message = {
            action: "signAndSend",
            payload: {
                to: contractAddress,
                value: 0,
                data: calldata,
            },
        };

        chrome.runtime.sendMessage(extensionId, message, (response) => {
            if (chrome.runtime.lastError) {
                const errorLog = `Error sending message: ${chrome.runtime.lastError.message}`;
                console.error(errorLog);
                addLog(errorLog);
                return;
            }

            const responseLog = `Response from extension: ${JSON.stringify(response)}`;
            console.log(responseLog);
            addLog(responseLog);
        });
    };

    const clearLogs = () => {
        setLogs([]);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>React Chrome Extension Test (Counter)</h1>
                <h3>{value}</h3>
                <button onClick={sendMessageToExtension}>Increment</button>
                <button onClick={getValue}>Get Value</button>
                <button onClick={clearLogs}>Clear Logs</button>
                <div className="log-container">
                    <h2>Logs:</h2>
                    <div className="log-box">
                        {logs.map((log, index) => (
                            <div key={index}>{log}</div>
                        ))}
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
