'use client'

import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Text, Flex, Box, useToast } from '@chakra-ui/react'
import ConnectWallet from './components/ConnectWallet'
import ProposalManagement from './components/ProposalManagement'
import Voting from './components/Voting'
import { contractAddress, contractABI } from './config';

export default function App() {
  const [isOwner, setIsOwner] = useState(false)
  const [account, setAccount] = useState('')
  const toast = useToast()

  useEffect(() => {
    const initializeContract = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          setAccount(address)

          const votingContract = new ethers.Contract(contractAddress, contractABI, signer)

          const owner = await votingContract.owner()
          console.log('Owner:', owner.toLowerCase())
          console.log('Address:', address.toLowerCase())
          setIsOwner(owner.toLowerCase() === address.toLowerCase())
        } catch (error) {
          console.error('Failed to initialize contract:', error)
          toast({
            title: 'Error',
            description: 'Failed to connect to the contract. Please check your wallet connection.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      } else {
        toast({
          title: 'Wallet Not Found',
          description: 'Please install MetaMask or another Ethereum wallet.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
      }
    }

    initializeContract()
  }, [toast])

  return (
    <Box className="App">
      <Flex bg='tomato' h='100px' color='white' justify='center' align='center'>
        <Text fontSize='3xl' alignSelf="center">Welcome to Decentralized Voting Platform</Text>
        <Flex pos="absolute" right="20px">
          <ConnectWallet account={account} />
        </Flex>
      </Flex>
      {
        isOwner ? (
          <ProposalManagement />
        ) : (
          <Voting />
        )
      }
    </Box>
  )
}

console.log("App Loaded")