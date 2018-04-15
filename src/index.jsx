import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import { Provider } from 'mobx-react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import styles from './styles.jsx';
import InstantTradeContainer from './containers/InstantTradeContainer.jsx';
import OrderBookStore from './stores/OrderBookStore.js';

class App extends Component {
   constructor(props) {
      super(props);

      this.state = {
      };
      this.orderBookInstance = new OrderBookStore();
      this.theme = createMuiTheme();
    }

   render() {
      let tokenApiUrl = process.env.API_URL + process.env.TOKEN_CONTRACT;
      return <MuiThemeProvider theme={this.theme}>
          <Provider orderBookStore={this.orderBookInstance}>
            <div>
              <InstantTradeContainer
                symbolApiLink={tokenApiUrl}></InstantTradeContainer>
            </div>
          </Provider>
        </MuiThemeProvider>;
   }
}

ReactDOM.render(<App />, document.querySelector('#root'));
