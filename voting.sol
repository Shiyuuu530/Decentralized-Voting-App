// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Voting {
    address public owner;

    // Define candidate structure
    struct Candidate {
        string id; // eg studentId
        string name;
        uint256 voteCount;
    }

    uint256 proposalNum;
    // Define proposal
    struct Proposal {
        uint256 proposalNum;
        string description;
        uint256 electionStartTime;
        uint256 electionEndTime;
        uint256 totalVoteCount;
        bool isActive;
    }

    mapping(uint256 => Proposal) public Proposals;
    mapping(uint256 => Candidate[]) public proposalCandidates;
    mapping(uint256 => mapping(address => bool)) public hasVotedOnProposal;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        proposalNum = 0;
    }

    function transferOwner(address _owner) public onlyOwner {
        owner = _owner;
    }

    function endElection(uint256 _proposalNum) public onlyOwner {
        Proposals[_proposalNum].isActive = false;
    }

    function addProposal(
        string memory _description,
        uint256 startTime,
        uint256 endTime
    ) public onlyOwner returns (uint256) {
        require(startTime < endTime, "Start time must be before end time");
        require(
            startTime > block.timestamp,
            "Start time must be in the future"
        );

        proposalNum++;
        Proposals[proposalNum] = Proposal({
            proposalNum: proposalNum,
            description: _description,
            electionStartTime: startTime,
            electionEndTime: endTime,
            totalVoteCount: 0,
            isActive: true
        });

        return proposalNum;
    }

    function addCandidate(
        uint256 _proposalNum,
        string memory _id,
        string memory _name
    ) public onlyOwner {
        proposalCandidates[_proposalNum].push(Candidate(_id, _name, 0));
    }

    function getCandidates(uint256 _proposalNum)
        public
        view
        returns (Candidate[] memory)
    {
        return proposalCandidates[_proposalNum];
    }

    function getProposal(uint256 _proposalNum)
        public
        view
        returns (Proposal memory)
    {
        return Proposals[_proposalNum];
    }

    function vote(uint256 _proposalNum, string memory _candidateId) public {
        require(
            !hasVotedOnProposal[_proposalNum][msg.sender],
            "You have already voted."
        );

        bool candidateFound = false;
        uint256 candidateIndex;
        Candidate[] storage candidates = proposalCandidates[_proposalNum];

        for (uint256 i = 0; i < candidates.length; i++) {
            if (
                keccak256(abi.encodePacked(candidates[i].id)) ==
                keccak256(abi.encodePacked(_candidateId))
            ) {
                candidateFound = true;
                candidateIndex = i;
                break;
            }
        }
        require(candidateFound, "Candidate not found.");

        Proposal storage proposal = Proposals[_proposalNum];
        require(proposal.isActive, "Proposal is not active.");

        require(
            block.timestamp >= proposal.electionStartTime &&
                block.timestamp <= proposal.electionEndTime,
            "Voting is not allowed at this time."
        );

        candidates[candidateIndex].voteCount++;
        hasVotedOnProposal[_proposalNum][msg.sender] = true;
        proposal.totalVoteCount++;
    }
}
