// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Chat {
    struct Message {
        address sender;
        string text;
        uint256 timestamp;
    }

    Message[] public messages;

    function sendMessage(string memory _text) public {
        messages.push(
            Message({
                sender: msg.sender,
                text: _text,
                timestamp: block.timestamp
            })
        );
    }

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }
}
