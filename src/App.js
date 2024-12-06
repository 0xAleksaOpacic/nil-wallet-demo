/*global chrome*/
import React, { useEffect, useState } from "react";
// Import ABI from the artifacts
import CounterABI from "./artifacts/Counter.json";
import { createClient } from "./util/client";
import { encodeFunctionData } from "viem";


// EIP-6963 Event Name Constants
const EIP6963EventNames = {
    Request: "eip6963:requestProvider",
    Announce: "eip6963:announceProvider",
};

function App() {
    const [provider, setProvider] = useState(null);
    const [value, setValue] = useState(0);
    const [responseLog, setResponseLog] = useState([]);
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

    useEffect(() => {
        const handleProviderAnnounce = (event) => {
            if (event.detail?.info?.uuid !== "439e2267-7284-40f2-85d3-0393cffc161c") {
                console.error("Wrong extension:", event.detail.info.name);
                return;
            }

            const { provider } = event.detail;
            if (!provider) {
                console.error("No provider received in announce event");
                return;
            }

            setProvider(provider);
        };

        window.addEventListener(EIP6963EventNames.Announce, handleProviderAnnounce);

        return () => {
            window.removeEventListener(EIP6963EventNames.Announce, handleProviderAnnounce);
        };
    }, []);

    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent(EIP6963EventNames.Request, {
                detail: {
                    name: "Sample Wallet Request",
                },
            })
        );
    }, []);

    useEffect(() => {
        getValue()
    }, []);

    const sendRequest = async () => {
        if (!provider || !provider.request) {
            console.error("Provider is not available or doesn't support request method");
            return;
        }

        // Encode calldata for the "increment" function
        const calldata = encodeFunctionData({
            abi: CounterABI.abi,
            functionName: "increment",
            args: [],
        });

        // Prepare transaction parameters
        const transactionParams = {
            to: contractAddress,  // Replace with your actual contract address
            value: "0x0",        // Value in hexadecimal format (0 ETH)
            data: calldata,      // Encoded function call data
        };



        try {
            // Send the transaction
            const result = await provider.request({
                method: "eth_sendTransaction",
                params: [transactionParams],
            });
            setResponseLog((prev) => [...prev, `Sent transaction: ${JSON.stringify(result, null, 2)}`]);
            getValue()
        } catch (error) {
            setResponseLog((prev) => [...prev, `Error sending transaction: ${error.message}`]);
        }
    };

    const decodeHexToNumber = (hexValue) => {
        const cleanedHex = hexValue.replace(/^0x0*/, "");
        return cleanedHex.toString();
    };

    const getValue = async () => {
        try {
            const { wallet, publicClient } = await createClient();

            const result = await publicClient.call(
                {
                    abi: CounterABI.abi,
                    functionName: "getValue",
                    feeCredit: 50000000n,
                    to: contractAddress,
                },
                "latest"
            );

            // Convert BigInt to string if necessary
            const resultData = typeof result.data === "bigint" ? result.data.toString() : result.data;

            result.decodedData = decodeHexToNumber(resultData)

            setValue(decodeHexToNumber(resultData));
            setResponseLog((prev) => [...prev, `Fetched value: ${JSON.stringify(result, null, 2)}`]);
        } catch (error) {
            setResponseLog((prev) => [...prev, `Error fetching value: ${error.message}`]);
        }
    };

    return (
        <div className="App">
            <div className="centered">
                <h1>React Chrome Extension Test (Counter)</h1>
                <div className="value-display">{value}</div>
                <div className="buttons">
                    <button onClick={sendRequest} disabled={!provider}>
                        Increase
                    </button>
                    <button onClick={getValue}>Get Value</button>
                </div>
                <div className="terminal">
                    <h3>Terminal</h3>
                    {responseLog.map((log, index) => (
                        <p key={index}>{log}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
