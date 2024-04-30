import dotenv from "dotenv";
import algosdk from "algosdk";
dotenv.config();

// Don’t forget to add your mnemonic
let myaccount = algosdk.mnemonicToSecretKey("train arch legal casual question unfold together speak oppose catch you risk artefact famous rookie wise enact stay utility ensure actual cup purpose about drink");

const baseServer = "https://testnet-api.algonode.cloud";
const algodClient = new algosdk.Algodv2("", baseServer, "");

// Define the blockchain function
const blockchain = async () => {
  try {
    let params = await algodClient.getTransactionParams().do();
    // Receiver will be some random address.
    const receiver = "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA";
    const enc = new TextEncoder();
    const note = enc.encode("My first transaction on Algo!");
    let amount = 100000; // Equals 0.1 ALGO
    let sender = myaccount.addr;
    let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender,
      to: receiver,
      amount: amount,
      note: note,
      suggestedParams: params,
    });

    console.log("HERE3");
    let accountInfo = await algodClient.accountInformation(myaccount.addr).do();
    console.log("Account balance: %d microAlgos", accountInfo.amount);

    // Sign transaction
    let signedTxn = txn.signTxn(myaccount.sk);
    let txId = txn.txID().toString();
    console.log("Signed transaction with txID: %s", txId);

    await algodClient.sendRawTransaction(signedTxn).do();

    // Wait for confirmation
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

    accountInfo = await algodClient.accountInformation(myaccount.addr).do();
    console.log("Transaction Amount: %d microAlgos", confirmedTxn.txn.txn.amt);
    console.log("Transaction Fee: %d microAlgos", confirmedTxn.txn.txn.fee);
    console.log("Account balance: %d microAlgos", accountInfo.amount);
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
};

// Execute the blockchain function
blockchain();
