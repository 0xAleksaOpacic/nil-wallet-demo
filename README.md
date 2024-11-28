# React Chrome Extension Test (Counter)

This small React app demonstrates how to send and sign transactions with a demo wallet extension.

---

## Steps to Run

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add a `.env` file**

   Create a `.env` file in the project root and add the following variables:

   ```plaintext
   REACT_APP_WALLET_ADDRESS=0x00015b3f8b4ee70193cd13acdc099e46562c8011
   REACT_APP_PRIVATE_KEY=0xbe18c62bc86ea56f38aaffa0a3a532e99e904fa7a1fbcbac294b95a59cf13f37
   REACT_APP_CONTRACT_ADDRESS=0x00015b3f8b4ee70193cd13acdc099e46562c8011
   ```

   Additionally, set your own RPC endpoint and the extension ID when deploying the extension locally:

   ```plaintext
   RPC_ENDPOINT=
   EXTENSION_ID=
   ```

2. **Start**
   ```bash
   npm start
   ```
---

## Notice

When you start the page, you might see the following error:

```
export 'default' (imported as '$') was not found in '@iden3/js-crypto'
```

You can safely ignore this error and close it.

---

Enjoy experimenting with the React Chrome Extension Test!
