import React, { useState, useEffect } from 'react';
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

export default function ProposalManagement() {
    const [description, setDescription] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    const [proposalNum, setProposalNum] = useState('')
    const [candidateId, setCandidateId] = useState('')
    const [candidateName, setCandidateName] = useState('')
    const [candidates, setCandidates] = useState([])
    const [proposal, setProposal] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    useEffect(() => {
        if (proposalNum) {
            fetchCandidatesAndProposal()
        }
    }, [proposalNum])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
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

    const handleAddCandidate = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, contractABI, signer)

            const tx = await contract.addCandidate(proposalNum, candidateId, candidateName)
            await tx.wait()

            toast({
                title: 'Candidate Added',
                description: `Candidate ${candidateName} added successfully`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            })

            setCandidateId('')
            setCandidateName('')
            fetchCandidatesAndProposal()
        } catch (error) {
            console.error('Error adding candidate:', error)
            toast({
                title: 'Error',
                description: 'Failed to add candidate',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box maxWidth="800px" margin="auto" mt={8}>
            <Heading as="h1" size="xl" textAlign="center" mb={6}>
                Proposal Management
            </Heading>

            <VStack spacing={6}>
                <FormControl>
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
                </FormControl>

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

                <form onSubmit={handleAddCandidate} style={{ width: '100%' }}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Candidate ID</FormLabel>
                            <Input
                                value={candidateId}
                                onChange={(e) => setCandidateId(e.target.value)}
                                placeholder="Enter candidate ID"
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Candidate Name</FormLabel>
                            <Input
                                value={candidateName}
                                onChange={(e) => setCandidateName(e.target.value)}
                                placeholder="Enter candidate name"
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            colorScheme="green"
                            isLoading={isLoading}
                            loadingText="Adding..."
                        >
                            Add Candidate
                        </Button>
                    </VStack>
                </form>

                {candidates.length > 0 && (
                    <Table variant="simple">
                        <TableCaption>Candidates for Proposal {proposalNum}</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
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
            </VStack>
        </Box>
    )
}