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
  contractAddress: process.env.CONTRACT_ADDRESS,
  ERC20: [{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"},{"name":"extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}],
  TokensContracts: {
    EVN: '0xd780ae2bf04cd96e577d3d014762f831d97129d0'
  }
};

export default contractConfig;
