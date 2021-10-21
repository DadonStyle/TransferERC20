import React, { useState, useContext } from "react";
import Web3 from "web3";
import { abi, address } from "./components/HORD6";
import NotyfContext from "./helpers/notyf";
import "notyf/notyf.min.css";

function App() {
  const notyf = useContext(NotyfContext);
  const [userAddress, setUserAddress] = useState("no address found");

  const transactionExec = async (e) => {
    try {
      e.preventDefault();

      //get a Web3 instance
      const web3 = new Web3(window.ethereum || Web3.givenProvider);

      //get the data from the form
      const data = new FormData(e.target);
      const toAddress = data.get("toAddr");
      const amountToSend = data.get("amount");

      //validation
      if (!web3.utils.isAddress(toAddress)) {
        throw new Error("no address found!");
      }
      const balance = await web3.eth.getBalance(userAddress);
      if (balance < amountToSend) {
        throw new Error("Insufficient funds");
      }

      //smart contract instance
      const contract = new web3.eth.Contract(abi, address);

      //transaction here //need to get my head around this one
      await contract.methods.allowance(toAddress, userAddress).send({
        from: userAddress,
      });
    } catch (err) {
      notyf.error(err.message);
      console.log(err.message);
    }
  };

  const connectWallet = async () => {
    try {
      //check that metamask exists and connect to it
      if (window.ethereum) {
        //gives the acc array + handle connection and network [1,3 etc]
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        //update the state with the connected user address
        setUserAddress(account[0]);
      } else {
        throw new Error("please install a wallet");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="App">
      <button onClick={connectWallet}>Connect to your wallet</button>
      <form onSubmit={(e) => transactionExec(e)}>
        <div>
          <input type="text" name="toAddr" placeholder="toAddr" />
        </div>
        <div>
          <input type="number" name="amount" placeholder="amount" />
        </div>
        <button type="submit">Transfer!</button>
      </form>
    </div>
  );
}

export default App;
