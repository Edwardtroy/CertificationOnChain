pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

import "./Decode.sol";

contract CACCertificationContract {
    mapping(address => Coach) public addressToCoach;
    mapping(bytes32 => Certification) public signedMsgToCertification;
    address[] public coachAccts;
    bytes32[] public keyList;

    struct Coach {
        string coachName;
        address coachAddress;
    }

    struct Certification {
        string company;
        string trainingName;
        string trainingCategory;
        address[] coachList;
        bytes signedMsg;
    }

    event RegisterCoach(string coachName, address coachAddress);
    event IssueCertification(bytes32 key, string company, string trainingName, string trainingCategory, address[] coachAccts, bytes signedMsg);
    event log2(address name);

    modifier onlyCoach(address validateAddress) {
        require(isCoach(validateAddress));
        _;
    }

    function isCoach(address coachAddr) constant returns(bool res) {
        for(var index = 0; index < coachAccts.length; index++) {
            if(coachAccts[index] == coachAddr){
                return true;
            }
        }

        return false;
    }

    function registerCoach(string coachName) public {
        addressToCoach[msg.sender] = Coach(coachName, msg.sender);
        coachAccts.push(msg.sender);

        emit RegisterCoach(coachName, msg.sender);
    }

    function getCoach(address coachAddress) constant public returns(string, address) {
        return (addressToCoach[coachAddress].coachName, addressToCoach[coachAddress].coachAddress);
    }

    function issueCertification(string company, string trainingName, string trainingCategory, bytes signedMsg) onlyCoach(msg.sender) public {
        bytes32 key = bytesToBytes32(signedMsg, 0);
        signedMsgToCertification[key] = Certification(company, trainingName, trainingCategory, coachAccts, signedMsg);
        keyList.push(key);

        emit IssueCertification(key, company, trainingName, trainingCategory, coachAccts, signedMsg);
    }

    function getMyCertification(bytes memory sha3Msg, bytes memory signedStr) constant public returns(string, string, string, address[]) {
        require(Decode.decode(sha3Msg, signedStr) == msg.sender);
        bytes32 key = bytesToBytes32(signedStr, 0);
        Certification cert = signedMsgToCertification[key];

        return (cert.company, cert.trainingName, cert.trainingCategory, cert.coachList);
    }

    function getCertificationByIndex(uint index) constant onlyCoach(msg.sender) public returns(string, string, string, address[], bytes) {
        bytes32 key = keyList[index - 1];
        Certification cert = signedMsgToCertification[key];

        return (cert.company, cert.trainingName, cert.trainingCategory, cert.coachList, cert.signedMsg);
    }

    function getAllCertLength() constant onlyCoach(msg.sender) public returns(uint) {
        return keyList.length;
    }

    function bytesToBytes32(bytes b, uint offset) private pure returns (bytes32) {
        bytes32 out;

        for (uint i = 0; i < 32; i++) {
            out |= bytes32(b[offset + i] & 0xFF) >> (i * 8);
        }
        return out;
    }
}