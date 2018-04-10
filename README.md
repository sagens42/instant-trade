# Instant Trade

Application for instant buying and instant selling tokens.

## Installation

```
npm install
```

## Configuring

In `.env` file following options available:

- `API_URL` - Api url base path
- `TOKEN_CONTRACT` - Token contract address. Token symbols and information is fetched from API, if you need to handle another type of token, just change this option.
- `CONTRACT_ADDRESS` - Contract address for instatrade
- `TOKENSTORE_FEE` - Fee to be taken from user for instant trading of tokens. Amount of funds sent to contract address will adjusted to this setting. Value should be in percent, for example 1, 0.4, 0.004

## Running

```
npm start
```

## UX

There are two types of operations allowed in application: buy and sell. Just choose any operation and confirm in Metamask. If you need smaller amount just switch Multiplicator dropdown to find needed value.
