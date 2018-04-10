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

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

@inject('orderBookStore')
@observer
class TokenExchangeContainer extends Component {
  static propTypes = {
    symbolApiLink: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false
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
  }

  componentWillReact() {
    if (this.props.orderBookStore.baseToken && !this.erc20ContractInstance) {
      this.erc20ContractInstance = new this.web3.eth.Contract(contractConfig.ERC20, contractConfig.TokensContracts[this.props.orderBookStore.baseToken], {
        gasLimit: 300000
      });
    }
  }

  async onBuyAction(order) {
    let TOKENSTORE_FEE = +process.env.TOKENSTORE_FEE + 1 || 1; // adding fee
    try {
      let instantTrade = this.contractInstance.methods.instantTrade(
        order.tokenGet,
        order.amountGet,
        order.tokenGive,
        order.amountGive,
        order.expires,
        order.nonce,
        order.account,
        order.signature.v,
        order.signature.r,
        order.signature.s,
        new BigNumber(order.availableVolume.toString()).times(this.multiplier),
        order.contract
      );
      let result = await instantTrade.send({ from: this.account, value: new BigNumber(order.availableVolume.toString()).times(this.multiplier).times(TOKENSTORE_FEE) });
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }

  async onSellAction(order) {
    let TOKENSTORE_FEE = +process.env.TOKENSTORE_FEE + 1 || 1; // adding fee
      let instantTrade = this.contractInstance.methods.instantTrade(
        order.tokenGet,
        order.amountGet,
        order.tokenGive,
        order.amountGive,
        order.expires,
        order.nonce,
        order.account,
        order.signature.v,
        order.signature.r,
        order.signature.s,
        new BigNumber(order.availableVolume.toString()).times(this.multiplier),
        order.contract
      );
      
      let result = await instantTrade.send({ from: this.account });
  }

  onMultiplierChange(multiplier) {
    this.multiplier = multiplier;
  }

  render() {
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
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={Boolean(this.props.orderBookStore.errorOnServer)}
        >
        <div>
          <Typography variant="title" id="modal-title">
            {this.props.orderBookStore.errorOnServer.toString()}
          </Typography>
      </div>
      </Modal>
    </div>;
  }
}

export default withStyles(styles)(TokenExchangeContainer);
