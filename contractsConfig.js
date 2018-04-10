const contractConfig = {
  ABI: [
  	{
  		"constant": false,
  		"inputs": [
  			{
  				"name": "_tokenGet",
  				"type": "address"
  			},
  			{
  				"name": "_amountGet",
  				"type": "uint256"
  			},
  			{
  				"name": "_tokenGive",
  				"type": "address"
  			},
  			{
  				"name": "_amountGive",
  				"type": "uint256"
  			},
  			{
  				"name": "_expires",
  				"type": "uint256"
  			},
  			{
  				"name": "_nonce",
  				"type": "uint256"
  			},
  			{
  				"name": "_user",
  				"type": "address"
  			},
  			{
  				"name": "_v",
  				"type": "uint8"
  			},
  			{
  				"name": "_r",
  				"type": "bytes32"
  			},
  			{
  				"name": "_s",
  				"type": "bytes32"
  			},
  			{
  				"name": "_amount",
  				"type": "uint256"
  			},
  			{
  				"name": "_store",
  				"type": "address"
  			}
  		],
  		"name": "instantTrade",
  		"outputs": [],
  		"payable": true,
  		"stateMutability": "payable",
  		"type": "function"
  	},
  	{
  		"constant": false,
  		"inputs": [
  			{
  				"name": "_token",
  				"type": "address"
  			}
  		],
  		"name": "withdrawFees",
  		"outputs": [],
  		"payable": false,
  		"stateMutability": "nonpayable",
  		"type": "function"
  	},
  	{
  		"constant": true,
  		"inputs": [],
  		"name": "owner",
  		"outputs": [
  			{
  				"name": "",
  				"type": "address"
  			}
  		],
  		"payable": false,
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"constant": false,
  		"inputs": [
  			{
  				"name": "_newOwner",
  				"type": "address"
  			}
  		],
  		"name": "transferOwnership",
  		"outputs": [],
  		"payable": false,
  		"stateMutability": "nonpayable",
  		"type": "function"
  	},
  	{
  		"payable": true,
  		"stateMutability": "payable",
  		"type": "fallback"
  	}
  ],
  contractAddress: process.env.CONTRACT_ADDRESS
};

export default contractConfig;
