import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import { Provider } from 'mobx-react';

import styles from './styles.jsx';
import InstantTradeContainer from './containers/InstantTradeContainer.jsx';
import OrderBookStore from './stores/OrderBookStore.js';

class App extends Component {
   constructor(props) {
      super(props);

      this.state = {
      };
      this.orderBookInstance = new OrderBookStore();
    }

   render() {
      return <div>
          <Provider orderBookStore={this.orderBookInstance}>
            <div>
              <InstantTradeContainer
                symbolApiLink={process.env.TOKEN_API_URL}></InstantTradeContainer>
            </div>
          </Provider>
      </div>;
   }
}

ReactDOM.render(<App />, document.querySelector('#root'));
