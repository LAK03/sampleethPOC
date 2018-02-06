/*
MIT License

Copyright (c) 2017 Arshdeep Bahga and Vijay Madisetti

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

/*
 * When you compile and deploy your SolarCharger contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a SolarCharger abstraction. We will use this abstraction
 * later to create an instance of the SolarCharger contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

import solar_artifacts from '../../build/contracts/SolarCharge.json'

var SolarCharger = contract(solar_artifacts);

var accounts;
var account;
var balance;
var ticketPrice;
var myContractInstance;


function setStatus(message) {
  $("#status").html(message);
};

function refreshBalance() {
  $("#cb_balance").html(web3.fromWei(
      web3.eth.getBalance(web3.eth.coinbase), "ether").toFixed(5));
}

function refreshVars(){
  SolarCharger.deployed().then(function(contractInstance) {
  contractInstance.numUsers.call().then(function(numUsers) {
      $("#cf_users").html(numUsers.toNumber());
  contractInstance.numStations.call().then(function(numStations){
      $("#cf_stations").html(numStations.toNumber());
  contractInstance.coinRate.call().then(function(coinRate){
      console.log("coinRate "+coinRate);
      $("#cf_rate").html(coinRate.toNumber());
  });
});
});
  refreshBalance();
});

}

window.registerUser= function(solar) {
  var name = $("#name").val();
  var email = $("#email").val();
  setStatus("Initiating transaction... (please wait)");
SolarCharger.deployed().then(function(contractInstance) {
  contractInstance.registerUser(email, name,
     { from: web3.eth.coinbase, gas: 2000000}).then(
    function(result) {
      setStatus("Done!");
      refreshVars();
    });
  });
}

window.buyCoins = function(solar) {
  var amount = parseFloat($("#amount").val());
  var email = $("#email1").val();

  setStatus("Initiating transaction... (please wait)");
SolarCharger.deployed().then(function(contractInstance) {
  contractInstance.buyCoins(email,
    { from: web3.eth.coinbase, value: amount, gas: 2000000}).then(
    function(result) {
      setStatus("Done!");
      refreshVars();
    });
});
}





$( document ).ready(function(){
	if (typeof web3 !== 'undefined') {
	    console.warn("Using web3 detected from external source like AWS")
	    // Use Mist/MetaMask's provider
	   // window.web3 = new Web3(web3.currentProvider);
	   window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	 //  window.web3 = new Web3(new Web3.providers.HttpProvider("http://10.1.10.85:8545"));
	   console.log("Connectiong to localhost - if->"+window.web3);
	  	//window.web3 = new Web3(new Web3.providers.HttpProvider("http://ec2-34-210-156-191.us-west-2.compute.amazonaws.com:8000"));
	  } else {
		 // console.warn("Using web3 detected from external source like AWS")
	   // console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
	    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
	   // window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	// window.web3 = new Web3(new Web3.providers.HttpProvider("http://ec2-34-210-156-191.us-west-2.compute.amazonaws.com:8000"));
	  // console.log("Connectiong to remote->"+window.web3);
	  	window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	  //	window.web3 = new Web3(new Web3.providers.HttpProvider("http://10.1.10.85:8545"));
	    console.log("Connected to localhost - else->"+window.web3);
	  }
	//SolarCharger.setProvider(web3.currentProvider);
	SolarCharger.setProvider(window.web3.currentProvider);

	web3.eth.getAccounts(function(err, accs){
		if(err !=null){
			alert('There was an error fetching your accounts.');
			return;
		}
		if(accs.length == 0){
			alert("Coundn't get any accounts!");
			return;
		}

		console.log('No of accounts->'+accs.length);
		accounts = accs;
		account = accounts[1];
		//initializeContract();

		SolarCharger.deployed().then(function(contractInstance) {
    $("#cf_address").html(contractInstance.address);
    $("#cb_address").html(account);
    refreshVars();

		});
	});
});
