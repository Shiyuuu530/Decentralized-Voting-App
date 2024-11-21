'use client'

import React, { useState } from 'react';
import { ethers } from 'ethers';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast,
    Heading,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react';
import { contractAddress, contractABI } from '../config';


export default function VotingComponent() {
    const [proposalNum, setProposalNum] = useState('')
    const [candidateId, setCandidateId] = useState('')
    const [candidates, setCandidates] = useState([])
    const [proposal, setProposal] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const fetchCandidatesAndProposal = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractABI, provider)

            const candidatesData = await contract.getCandidates(proposalNum)
            setCandidates(candidatesData)

            const proposalData = await contract.getProposal(proposalNum)
            setProposal(proposalData)
        } catch (error) {
            console.error('Error fetching data:', error)
            toast({
                title: 'Error',
                description: 'Failed to fetch candidates and proposal data',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }


    const vote = async () => {
        if (!proposalNum || !candidateId) {
            toast({
                title: 'Error',
                description: 'Please fill in all fields',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        }

        setIsLoading(true)

        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' })

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer)

            // Call the vote function
            const transaction = await contract.vote(proposalNum, candidateId)
            await transaction.wait()

            toast({
                title: 'Success',
                description: 'Your vote has been recorded',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (error) {
            console.error('Error:', error)
            toast({
                title: 'Error',
                description: error.message || 'An error occurred while voting',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box maxWidth="400px" margin="auto" mt={8}>
            <VStack spacing={4}>
                <Text fontSize="2xl" fontWeight="bold">Vote on Proposal</Text>
                <FormControl>
                    <FormLabel>Proposal Number</FormLabel>
                    <Input
                        value={proposalNum}
                        onChange={(e) => setProposalNum(e.target.value)}
                        placeholder="Enter proposal number"
                    />
                </FormControl>

                <Button onClick={fetchCandidatesAndProposal} colorScheme="blue">
                    Fetch Proposal Data
                </Button>

                {proposal && (
                    <Box borderWidth={1} borderRadius="lg" p={4} width="100%">
                        <Heading as="h2" size="md" mb={2}>
                            Proposal Details
                        </Heading>
                        <Text>Description: {proposal.description}</Text>
                        <Text>Start Time: {new Date(Number(proposal.electionStartTime) * 1000).toLocaleString()}</Text>
                        <Text>End Time: {new Date(Number(proposal.electionEndTime) * 1000).toLocaleString()}</Text>
                        <Text>Total Votes: {proposal.totalVoteCount.toString()}</Text>
                        <Text>Active: {proposal.isActive ? 'Yes' : 'No'}</Text>
                    </Box>
                )}
                {candidates.length > 0 && (
                    <Table variant="simple">
                        <TableCaption>Candidates for Proposal {proposalNum}</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Candidate ID</Th>
                                <Th>Name</Th>
                                <Th isNumeric>Vote Count</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {candidates.map((candidate, index) => (
                                <Tr key={index}>
                                    <Td>{candidate.id}</Td>
                                    <Td>{candidate.name}</Td>
                                    <Td isNumeric>{candidate.voteCount.toString()}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
                <FormControl>
                    <FormLabel>Proposal Number</FormLabel>
                    <Input
                        type="number"
                        disabled
                        value={proposalNum}
                        onChange={(e) => setProposalNum(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Candidate ID</FormLabel>
                    <Input
                        type="number"
                        value={candidateId}
                        onChange={(e) => setCandidateId(e.target.value)}
                    />
                </FormControl>
                <Button
                    colorScheme="blue"
                    onClick={vote}
                    isLoading={isLoading}
                    loadingText="Voting..."
                >
                    Vote
                </Button>
            </VStack>
        </Box>
    )
}