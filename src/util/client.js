import {
	Hex,
	HttpTransport,
	LocalECDSAKeySigner,
	PublicClient,
	WalletV1,
} from "@nilfoundation/niljs";

export async function createClient() {
	const walletAddress = process.env.REACT_APP_WALLET_ADDRESS;

	if (!walletAddress) {
		throw new Error("WALLET_ADDRESS is not set in environment variables");
	}

	const endpoint = process.env.REACT_APP_RPC_ENDPOINT;

	if (!endpoint) {
		throw new Error("RPC_ENDPOINT is not set in environment variables");
	}

	const publicClient = new PublicClient({
		transport: new HttpTransport({
			endpoint: endpoint,
		}),
		shardId: 1,
	});

	const signer = new LocalECDSAKeySigner({
		privateKey: process.env.REACT_APP_PRIVATE_KEY,
	});

	const pubkey = await signer.getPublicKey();

	const wallet = new WalletV1({
		pubkey: pubkey,
		address: walletAddress,
		client: publicClient,
		signer,
	});

	console.log(publicClient)

	return { wallet, publicClient, signer };
}
