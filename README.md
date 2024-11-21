# Decentralized Voting Platform

This project is a decentralized voting platform built on the Ethereum blockchain. It allows users to vote for candidates using a smart contract and a simple front-end interface built with React and MetaMask.

## Features

- **Smart Contract**: A Solidity-based voting contract deployed on the Ethereum blockchain, which allows secure and transparent voting.
- **Candidate List**: Displays all candidates with their current vote counts.
- **Voting**: Users can vote for their favorite candidate. Each user is restricted to one vote.
- **MetaMask Integration**: Users can connect to the platform using MetaMask, a popular Ethereum wallet.

## Prerequisites

- **Node.js** and **npm**: Make sure you have Node.js and npm installed on your machine.
- **MetaMask**: Install the MetaMask extension in your browser and connect to a supported test network (such as Sepolia or Goerli).
- **Ethereum Testnet Funds**: Use a faucet to obtain test ETH for deploying and interacting with the contract.

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/decentralized-voting-platform.git
    cd decentralized-voting-platform
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Configure the Smart Contract**:

    - Deploy the `Voting.sol` contract on a test network using Remix or Truffle.
    - Note the contract address and update it in the front-end code (`VotingApp.js` or `App.js`).

4. **Set Up Infura (Optional)**:

    If connecting to a network like Sepolia via Infura, create an account on [Infura](https://infura.io/) and obtain an API key. Use this API key to connect to the network.

## Usage

1. **Start the React App**:

    ```bash
    npm start
    ```

2. **Open MetaMask**:

    - Connect your MetaMask to the appropriate test network.
    - Ensure you have some test ETH in your account.

3. **Connect to the Platform**:

    - Open `http://localhost:3000` in your browser.
    - Click "Connect Wallet" to connect MetaMask to the platform.
    - You should see a list of candidates along with their vote counts.

4. **Vote for a Candidate**:

    - Click the "Vote" button next to your chosen candidate.
    - Confirm the transaction in MetaMask.
    - The vote count should update once the transaction is confirmed on the blockchain.

## Project Structure

- **`contracts/Voting.sol`**: The Solidity smart contract that defines the voting logic.
- **`src/components/ConnectWallet.js`**: A React component that connects to MetaMask.
- **`src/VotingApp.js`**: Main React component for displaying candidates and handling votes.
- **`public`**: Contains static files, such as `index.html`.
- **`src`**: Main source folder containing React components and configuration.

## Smart Contract Overview

The `Voting` smart contract contains:

- **Candidate Structure**: Stores candidate ID, name, and vote count.
- **Vote Function**: Allows users to vote for a candidate and restricts users to one vote.
- **Event Logging**: Emits an event every time a vote is cast.
