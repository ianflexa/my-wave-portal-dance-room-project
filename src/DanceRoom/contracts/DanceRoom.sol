// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract DanceRoom {
    address owner;
    uint256 totalDances;
    uint256  xmyShake;
    uint256 seed;
    string message;

    event abc (address indexed from, uint timestamp, string song);
    event xyz (address indexed from, string message, uint xmyShake);

    mapping(address => uint256) public nDances;
    mapping(address => uint256) public lastDanceAt;
    
    struct Dance {
        address dancer;
        string song;
        uint timestamp;
    }   

    Dance[] dances;

    struct Ntime {
        address dude;
        string message;
        uint xmyShake;
    }

    Ntime[] times;

    
    
    constructor() payable {
        owner = msg.sender;
        seed = (block.timestamp + block.difficulty) % 100;
        console.log("Tutz tutz, I am a DanceRoom, come dance on me!");
    }
    
    function shake(string memory _song) public {
        require(lastDanceAt[msg.sender] + 20 seconds < block.timestamp, "wait 20 seconds" );
        lastDanceAt[msg.sender] = block.timestamp;

        nDances[msg.sender] += 1;
        totalDances += 1;
        console.log("%s has shaked listening to the song called: %s !", msg.sender, _song);

        dances.push(Dance(msg.sender, _song, block.timestamp));

        seed = (block.timestamp + block.difficulty + seed) % 100;
        console.log("Random # generated: %s", seed);

        if(seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;

            require(prizeAmount <= address(this).balance, "Trying to withdraw more money that the contract has.");

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw ether from contract." );
        }
        
        emit abc(msg.sender, block.timestamp, _song);
    }
    
    function getAllDances() public view returns(Dance[] memory) {
        return dances;
    }

    function getTotalDances() public view returns (uint256) {
        console.log("We have %d total Dances!", totalDances);
        return totalDances;
    }

    function myShakes() public {
        xmyShake = nDances[msg.sender];
        if (xmyShake == 1) {
            string memory _message = "You have shaked your body only 1 time! Let's shake it again!";
            message = _message;
            times.push(Ntime(msg.sender, _message, xmyShake));

            emit xyz(msg.sender, _message, xmyShake);

        } else if (xmyShake >= 2){
            string memory _message = "OMG! You are a big dancer! You have shaked your body: ";
            message = _message;
            times.push(Ntime(msg.sender, _message, xmyShake));

            emit xyz(msg.sender, _message, xmyShake);
            
        } else {
            string memory _message = "You haven't shaken it yet, don't be ashamed let's shake it!";
            message = _message;
            times.push(Ntime(msg.sender, _message, xmyShake));

            emit xyz(msg.sender, _message, xmyShake);
        }
        
    }
}
