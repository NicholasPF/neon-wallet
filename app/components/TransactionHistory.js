import React, { Component } from 'react';
import { connect } from 'react-redux';
import { syncTransactionHistory } from "../components/NetworkSwitch";
import { shell } from 'electron';

const getExplorerLink = (net, txid) => {
  let base;
  if (net === "MainNet"){
    base = "http://antcha.in";
  } else {
    base = "http://testnet.antcha.in";
  }
  return base + "/tx/hash/" + txid;
}

const openExplorer = (srcLink) => {
  shell.openExternal(srcLink);
}

class TransactionHistory extends Component {

  componentDidMount = () => {
    syncTransactionHistory(this.props.dispatch, this.props.net, this.props.address);
  }

  render = () =>
    <div id="transactionInfo">
      <div className="columnHeader">Transaction History</div>
      <div className="headerSpacer"></div>
      <ul id="transactionList">
        {this.props.transactions.map((t) => {
          let formatAmount;
          if (t.type === "NEO"){ formatAmount = parseInt(t.amount); }
          else{ formatAmount = parseFloat(t.amount).toPrecision(5); }
          // ignore precision rounding errors for GAS
          if ((formatAmount > 0 && formatAmount < 0.001) || (formatAmount < 0 && formatAmount > -0.001)){
            formatAmount = 0.0.toPrecision(5);
          }
          return (<li>
              <div className="txid" onClick={() => openExplorer(getExplorerLink(this.props.net, t.txid))}>
                {t.txid.substring(0,32)}</div><div className="amount">{formatAmount} {t.type}
              </div></li>);
        })}
      </ul>
    </div>;
}

const mapStateToProps = (state) => ({
  address: state.account.address,
  net: state.wallet.net,
  transactions: state.wallet.transactions
});

TransactionHistory = connect(mapStateToProps)(TransactionHistory);

export default TransactionHistory;
