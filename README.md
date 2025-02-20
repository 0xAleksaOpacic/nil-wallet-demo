
# =nil; Wallet Demo App

This demo app showcases the integration of the =nil; Wallet for interacting with smart contracts and sending transactions. It demonstrates how to connect a wallet, send transactions, and interact with a deployed smart contract using a smart account.

## 🌟 Features

1. **Wallet Connection:** Connect to the =nil; Wallet using the `eth_requestAccounts` method
2. **Send Transaction:** Send a transaction with custom parameters
3. **eth_non_registered:** Demonstrates handling unsupported RPC methods
4. **Contract Interaction:** Interact with a deployed `Counter` smart contract:
   - `getValue`: Fetch the current counter value
   - `increment`: Increment the counter

## 🛠️ Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/0xAleksaOpacic/nil-wallet-demo.git
   cd nil-wallet-demo
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   Create a `.env` file in the root directory:

   ```ini
   REACT_APP_WALLET_ADDRESS=0x00019dc875b73b5eb509003427b19d90357c573c
   REACT_APP_PRIVATE_KEY=0x71477e7f6306d3e935daa5bdd8fd73c317a35b4da1da4423ee61c1cd0c1f65f1
   REACT_APP_CONTRACT_ADDRESS=0x000106ae723795b7c117264057894aedae4bd19b
   REACT_APP_RPC_ENDPOINT=your_rpc_endpoint_here
   ```

   - To get an RPC endpoint, use the [NilDevnetTokenBot](https://t.me/NilDevnetTokenBot).

4. **Start the App:**
   ```bash
   npm start
   ```

## 🔗 Contract Deployment

The app interacts with a deployed `Counter` contract. You can view the contract source code here:

- [Counter.sol](https://github.com/0xAleksaOpacic/nil-wallet-demo/blob/main/src/contract/Counter.sol)

To deploy your own contract, use the [Nil Sandbox](https://explore.nil.foundation/sandbox)

## 🪙 Interacting with the =nil; Wallet

The app interacts with the `window.nil` provider, which is injected by the =nil; Wallet extension. Currently, two methods are supported:

1. **eth_requestAccounts:** Requests user account access
2. **eth_sendTransaction:** Sends a transaction with specified parameters

Ensure the =nil; Wallet extension is installed and active in your browser


---

⚠️ **Disclaimer:** This project is for educational purposes
