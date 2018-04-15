import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { PropTypes as PropTypesMobX } from 'mobx-react';
import Menu, { MenuItem } from 'material-ui/Menu';
import { BigNumber } from 'bignumber.js';

@observer
export default class InstantTrade extends Component {
  static propTypes = {
    buyOrders: PropTypesMobX.observableArray,
    sellOrders: PropTypesMobX.observableArray,
    baseToken: PropTypes.string,
    quoteToken: PropTypes.string,
    onSellAction: PropTypes.func,
    onBuyAction: PropTypes.func,
    onMultiplierChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      pageBuy: 0,
      pageSell: 0,
      rowsPerPage: 10,
      multiplier: 1,
      anchorEl: null
    };

    this.handleCloseMultiplierMenu = this.handleCloseMultiplierMenu.bind(this);
  }

  componentWillReact() {
  }

  handleChangePageBuy(event, page) {
    this.setState({ pageBuy: page });
  };

  handleChangePageSell(event, page) {
    this.setState({ pageSell: page });
  };

  handleChangeRowsPerPage(event) {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleCloseMultiplierMenu(multiplier) {
    this.setState({
      multiplier,
      anchorEl: false
    });
    this.props.onMultiplierChange(multiplier);
  };

  formatAmount(amount, decimals, type) {
    return window.web3.fromWei(new BigNumber(amount.toString()).times(this.state.multiplier), type);
  }

  onBuyAction(order) {
    this.props.onBuyAction(order);
  }

  onSellAction(order) {
    this.props.onSellAction(order);
  }

  render() {
    const { pageBuy, pageSell, rowsPerPage } = this.state;

    return <div>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6}>
          <Typography variant="title">Buy {this.props.baseToken} instantly</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="title">Sell {this.props.baseToken} instantly</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Amount {this.props.quoteToken}</TableCell>
                <TableCell>Amount {this.props.baseToken}</TableCell>
                <TableCell>Buy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.buyOrders && this.props.buyOrders.slice(pageBuy * rowsPerPage, pageBuy * rowsPerPage + rowsPerPage).map(n => {
                let availableVolumeGet = (n.availableVolume / n.amountGet) * n.amountGive;
                let availableVolumeGive = n.availableVolume;
                return (
                  <TableRow key={n.numericId}>
                    <TableCell>{this.formatAmount(availableVolumeGive, n.tokenGetDecimals, 'ether')}</TableCell>
                    <TableCell>{this.formatAmount(availableVolumeGet, n.tokenGiveDecimals, 'ether')}</TableCell>
                    <TableCell>
                      <Button variant="raised" onClick={() => this.onBuyAction(n)}>
                        Instant Buy
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <Button
                  aria-haspopup="true"
                  onClick={event => this.setState({ anchorEl: event.currentTarget })}
                >
                  Multipler x{ this.state.multiplier }
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={this.state.anchorEl}
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleCloseMultiplierMenu}
                >
                  <MenuItem onClick={this.handleCloseMultiplierMenu.bind(this, 0.01)}>x0.01</MenuItem>
                  <MenuItem onClick={this.handleCloseMultiplierMenu.bind(this, 0.1)}>x0.1</MenuItem>
                  <MenuItem onClick={this.handleCloseMultiplierMenu.bind(this, 1)}>x1</MenuItem>
                </Menu>
                <TablePagination
                  colSpan={6}
                  count={this.props.buyOrders.length}
                  rowsPerPage={rowsPerPage}
                  page={pageBuy}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page',
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page',
                  }}
                  onChangePage={this.handleChangePageBuy.bind(this)}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage.bind(this)}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Amount {this.props.baseToken}</TableCell>
                <TableCell>Amount {this.props.quoteToken}</TableCell>
                <TableCell>Buy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.sellOrders && this.props.sellOrders.slice(pageSell * rowsPerPage, pageSell * rowsPerPage + rowsPerPage).map(n => {
                let availableVolumeGet = n.availableVolume;
                let availableVolumeGive = (n.amountGet / n.availableVolume) * n.amountGive;
                return (
                  <TableRow key={n.numericId}>
                    <TableCell>{this.formatAmount(availableVolumeGet, n.tokenGetDecimals, 'ether')}</TableCell>
                    <TableCell>{this.formatAmount(availableVolumeGive, n.tokenGiveDecimals, 'ether')}</TableCell>
                    <TableCell>
                      <Button variant="raised" onClick={() => this.onSellAction(n)}>
                        Instant Sell
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  count={this.props.buyOrders.length}
                  rowsPerPage={rowsPerPage}
                  page={pageSell}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page',
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page',
                  }}
                  onChangePage={this.handleChangePageSell.bind(this)}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage.bind(this)}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Grid>
      </Grid>
    </div>;
  }
}
