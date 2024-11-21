import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Box, Button } from '@chakra-ui/react';

const ConnectWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const address = accounts[0]; // Use the first account
        setWalletAddress(address);
        console.log("Connected wallet:", address);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  function formatWalletAddress(walletAddress) {
    if (walletAddress.length <= 11) {
      return walletAddress;
    }
    const start = walletAddress.slice(0, 5);
    const end = walletAddress.slice(-6);
    return `${start}...${end}`;
  }

  return (
    <Box>
      <Button onClick={connectWallet}>
        {walletAddress ? `${formatWalletAddress(walletAddress)}` : "Connect Wallet"}
      </Button>
    </Box>
  );
};

export default ConnectWallet;
