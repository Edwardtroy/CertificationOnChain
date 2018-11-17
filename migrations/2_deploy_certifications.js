const Decode = artifacts.require("./Decode.sol");
const CACCertification = artifacts.require('CACCertificationContract');

module.exports = function (deployer) {
    deployer.deploy(Decode);
    deployer.link(Decode, CACCertification);
    deployer.deploy(CACCertification);
}