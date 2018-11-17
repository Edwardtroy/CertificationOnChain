var CACCertificationContract = artifacts.require("./CACCertificationContract.sol");

contract('CACCertificationContract', function(accounts){
    it("should register coach successfully", function(){
        var cacCertification;
        var coachName = "Coach 1";
        var coachAddress = accounts[0];
        var returnValue = [coachName, coachAddress];

        return CACCertificationContract.new().then(function(instance){
            cacCertification = instance;
            return cacCertification.registerCoach(coachName, {from: coachAddress});
        }).then(function(){
            return cacCertification.getCoach(coachAddress);
        }).then(function(res){
            assert.equal(res.valueOf()[0], coachName, "if coach has been registered in contract.");
            assert.equal(res.valueOf()[1], coachAddress, "if coach has been registered in contract.");
        });
    });

    it("should issue certification for coachee", function(){
        var cacCertification;
        
        var company = "ThoughtWorks";
        var trainingName = "CAC";
        var trainingCategory = "Quality Coach";
        
        var coach_1_name = "Coach 1";
        var coach_1_address = accounts[0];
        var coach_2_name = "Coach 2";
        var coach_2_address = accounts[1];

        var coachee_name = "Coachee";
        var coachee_address = accounts[2];
        var sha3Msg = web3.sha3(company + trainingName + trainingCategory);
        var signedStr = web3.eth.sign(coachee_address, sha3Msg);

        

        return CACCertificationContract.new().then(function(instance){
            cacCertification = instance;
            return cacCertification.registerCoach(coach_1_name, {from: coach_1_address});
        }).then(function(){
            return cacCertification.registerCoach(coach_2_name, {from: coach_2_address});
        }).then(function(){
            return cacCertification.getCoach(coach_1_address);
        }).then(function(res){
            assert.equal(res.valueOf()[0], coach_1_name, "if coach has been registered in contract.");
            assert.equal(res.valueOf()[1], coach_1_address, "if coach has been registered in contract.");
        }).then(function(){
            return cacCertification.getCoach(coach_2_address);
        }).then(function(res){
            assert.equal(res.valueOf()[0], coach_2_name, "if coach has been registered in contract.");
            assert.equal(res.valueOf()[1], coach_2_address, "if coach has been registered in contract.");
        }).then(function(){
            return cacCertification.issueCertification(company, trainingName, trainingCategory, signedStr, {from: coach_1_address})
        }).then(function(){
            return cacCertification.getMyCertification(sha3Msg, signedStr, {from: coachee_address});
        }).then(function(res){
            assert.equal(res.valueOf()[0], company, "should get certification successfully.");
            assert.equal(res.valueOf()[1], trainingName, "should get certification successfully.");
            assert.equal(res.valueOf()[2], trainingCategory, "should get certification successfully.");
            assert.equal(res.valueOf()[3][0], coach_1_address, "should get certification successfully.");
            assert.equal(res.valueOf()[3][1], coach_2_address, "should get certification successfully.");
        }).then(function(){
            return cacCertification.getAllCertLength({from: coach_1_address});
        }).then(function(res){
            assert.equal(res.valueOf(), "1", "total list should be 1.");
        });
    });
});