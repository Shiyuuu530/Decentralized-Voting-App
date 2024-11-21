import React, { useState } from 'react';
import { ethers } from 'ethers';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    useToast,
    Heading,
} from '@chakra-ui/react';
import { contractAddress, contractABI } from '../config';

export default function AddProposal() {
    const [description, setDescription] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                console.log('signer:', signer);
                const contract = new ethers.Contract(contractAddress, contractABI, signer)
                const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000)
                const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000)
                console.log('description:', description);
                console.log('startTimestamp:', startTimestamp);
                console.log('endTimestamp:', endTimestamp);

                const tx = await contract.addProposal(description, startTimestamp, endTimestamp)
                console.log('tx:', tx);
                await tx.wait()

                toast({
                    title: 'Proposal created successfully',
                    description: `tx hash: ${tx.hash}`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })

                setDescription('')
                setStartTime('')
                setEndTime('')
            } else {
                toast({
                    title: 'error',
                    description: 'Please install MetaMask!',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
        } catch (error) {
            console.error('Error:', error)
            toast({
                title: 'error',
                description: 'Proposal creation failed',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box maxWidth="500px" margin="auto" mt={8}>
            <Heading as="h1" size="xl" textAlign="center" mb={6}>
            Create a new proposal
            </Heading>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Proposal Description</FormLabel>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter proposal description' />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Voting start Time</FormLabel>
                        <Input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Voting end time</FormLabel>
                        <Input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        isLoading={isLoading}
                        loadingText="Submitting..."
                    >
                        Create Proposal
                    </Button>
                </VStack>
            </form>
        </Box>
    )
}