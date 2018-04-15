import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { BigNumber } from 'bignumber.js';
import Web3 from 'web3';
import { withStyles } from 'material-ui/styles';

import InstantTrade from '../components/InstantTrade.jsx';
import contractConfig from '../../contractsConfig';

@inject('orderBookStore')
@observer
class TokenExchangeContainer extends Component {
  static propTypes = {
    symbolApiLink: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      tokenConfirmation: false,
      tokenConfirmationAmount: 0,
      tokenConfirmationSymbol: '',
      order: null,
      approvePending: false,
      tradingPending: false
    };

    this.account = null;
    web3.eth.getAccounts((error, accounts) => {
      // fetching user account
      this.account = accounts[0];
    });

    this.multiplier = 1;

    this.onBuyAction = this.onBuyAction.bind(this);
    this.onSellAction = this.onSellAction.bind(this);
    this.onMultiplierChange = this.onMultiplierChange.bind(this);
  }

  componentDidMount() {
    this.props.orderBookStore.getOrderBook(this.props.symbolApiLink);

    this.web3 = null;
    this.contractInstance = null;
    this.erc20ContractInstance = null;

    // initing web3 for application
    if (typeof window.web3 !== 'undefined'){
      console.log('Using web3 detected from external source like Metamask');
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      throw new Error('Metamask not found, please install');
    }
    this.contractInstance = new this.web3.eth.Contract(contractConfig.ABI, contractConfig.contractAddress, {
      gasLimit: 300000
    });
    this.erc20ContractInstance = new this.web3.eth.Contract(contractConfig.ERC20ABI, {
      gasLimit: 300000
    });
  }

  onApprove() {
    debugger;
    if (this.type === 'buy') {
      this.onApproveBuy();
    } else {
      this.onApproveSell();
    }
  }

  async onBuyAction(order) {
    this.type = 'buy';
    let TOKENSTORE_FEE = +process.env.TOKENSTORE_FEE + 1 || 1; // adding fee

    this.setState({
      tokenConfirmation: true,
      tokenConfirmationAmount: web3.fromWei(new BigNumber(order.availableVolume.toString()).times(this.multiplier).times(TOKENSTORE_FEE).toNumber(), 'ether'),
      tokenConfirmationAmountWei: new BigNumber(order.availableVolume.toString()).times(this.multiplier).times(TOKENSTORE_FEE).toNumber(),
      tokenConfirmationSymbol: order.tokenGetSymbol,
      order: order
    });
  }

  async onApproveBuy() {
    try {
      let instantTrade = this.contractInstance.methods.instantTrade(
        this.state.order.tokenGet,
        this.state.order.amountGet,
        this.state.order.tokenGive,
        this.state.order.amountGive,
        this.state.order.expires,
        this.state.order.nonce,
        this.state.order.account,
        this.state.order.signature.v,
        this.state.order.signature.r,
        this.state.order.signature.s,
        new BigNumber(this.state.order.availableVolume.toString()).times(this.multiplier).toNumber(),
        this.state.order.contract
      );

      this.setState({
        approvePending: false,
        tradingPending: true
      });

      let result = await instantTrade.send({ from: this.account, value: this.state.tokenConfirmationAmountWei });

      this.setState({
        tradingPending: false,
        tokenConfirmation: false,
        tokenConfirmationAmount: 0,
        tokenConfirmationAmountWei: 0,
        tokenConfirmationSymbol: '',
        order: null
      });
    } catch (e) {
      this.props.orderBookStore.errorOnServer = e;
    }
  }

  async onSellAction(order) {
    this.type = 'sell';
    let TOKENSTORE_FEE = +process.env.TOKENSTORE_FEE + 1 || 1; // adding fee

    this.setState({
      tokenConfirmation: true,
      tokenConfirmationAmount: web3.fromWei(new BigNumber(order.availableVolume.toString()).times(this.multiplier).times(TOKENSTORE_FEE).toNumber(), 'ether'),
      tokenConfirmationAmountWei: new BigNumber(order.availableVolume.toString()).times(this.multiplier).times(TOKENSTORE_FEE).toNumber(),
      tokenConfirmationSymbol: order.tokenGetSymbol,
      order: order
    });
  }

  async onApproveSell() {
    try {
      this.erc20ContractInstance.options.address = this.state.order.tokenGet;
      let approveToken = this.erc20ContractInstance.methods.approve(this.state.order.contract, this.state.tokenConfirmationAmountWei);

      this.setState({
        approvePending: true
      });

      let resultOfApprove = await approveToken.send({ from: this.account });

      this.setState({
        approvePending: false,
        tradingPending: true
      });

      let instantTrade = this.contractInstance.methods.instantTrade(
        this.state.order.tokenGet,
        this.state.order.amountGet,
        this.state.order.tokenGive,
        this.state.order.amountGive,
        this.state.order.expires,
        this.state.order.nonce,
        this.state.order.account,
        this.state.order.signature.v,
        this.state.order.signature.r,
        this.state.order.signature.s,
        new BigNumber(this.state.order.availableVolume.toString()).times(this.multiplier).toNumber(),
        this.state.order.contract
      );

      let resultOfInstantTrade = await instantTrade.send({ from: this.account });

      this.setState({
        tradingPending: false,
        tokenConfirmation: false,
        tokenConfirmationAmount: 0,
        tokenConfirmationAmountWei: 0,
        tokenConfirmationSymbol: '',
        order: null
      });
    } catch (e) {
      this.props.orderBookStore.errorOnServer = e;
    }
  }

  onMultiplierChange(multiplier) {
    this.multiplier = multiplier;
  }

  getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  render() {
    const { classes } = this.props;

    return <div>
      <InstantTrade
        onBuyAction={this.onBuyAction}
        onSellAction={this.onSellAction}
        baseToken={this.props.orderBookStore.baseToken}
        quoteToken={this.props.orderBookStore.quoteToken}
        buyOrders={this.props.orderBookStore.buyOrders}
        sellOrders={this.props.orderBookStore.sellOrders}
        onSellAction={this.onSellAction}
        onBuyAction={this.onBuyAction}
        onMultiplierChange={this.onMultiplierChange}></InstantTrade>
      <Modal
          open={Boolean(this.props.orderBookStore.errorOnServer)}
        >
        <div style={this.getModalStyle()} className={classes.paper}>
          <Typography variant="title" id="modal-title">
            {this.props.orderBookStore.errorOnServer.toString()}
          </Typography>
        </div>
      </Modal>
      <Modal open={this.state.tokenConfirmation}>
        <div style={this.getModalStyle()} className={classes.paper}>
          { !this.state.approvePending && !this.state.tradingPending ?
            <div>
              <Typography variant="title" id="modal-title">
                You are about to send {this.state.tokenConfirmationAmount} {this.state.tokenConfirmationSymbol}. Please approve this transaction to blockchain.
              </Typography>
              <Button onClick={this.onApprove.bind(this)}>Approve</Button>
            </div>
            :
            null
          }
          { this.state.approvePending && !this.state.tradingPending ?
            <div>
              <Typography variant="title" id="modal-title">
                Transaction is being approved, please approve in MetaMask and wait...
              </Typography>
            </div>
            :
            null
          }
          { !this.state.approvePending && this.state.tradingPending ?
            <div>
              <Typography variant="title" id="modal-title">
                Trading is in progress, please approve in MetaMask and wait...
              </Typography>
            </div>
            :
            null
          }
        </div>
      </Modal>
    </div>;
  }
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

export default withStyles(styles)(TokenExchangeContainer);
