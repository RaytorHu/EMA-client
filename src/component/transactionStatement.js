import React, { Component } from "react";
import { Button, Icon, Input, Card, Table } from 'antd';
import TransactionModal from './transactionModal';
import 'antd/dist/antd.css';
import storage from '../utils/Storage';
import config from '../config.js';
import axios from 'axios';
import moment from "moment";

class TransactionStatement extends Component {

    constructor(props) {
      super(props);
      this.state = {
        transactions: [],
        token: false,
        showForm: false,
        transactionId: '',
        transactionIndex: '',
        transactionAmount: '',
        transactionDescription: '',
        transactionTimestamp: '',
        error: '',
        loading: true,
        visible: false
      }
      this.showForm = this.showForm.bind(this);
      this.handleTransactionAmount = this.handleTransactionAmount.bind(this);
      this.handleTransactionDescription = this.handleTransactionDescription.bind(this);
      this.onDelete = this.onDelete.bind(this);
      this.editTransaction = this.editTransaction.bind(this);
      this.addTransaction = this.addTransaction.bind(this)
    }
  
    showForm() {
      var currentTime = new Date();
      var month = currentTime.getMonth() + 1;
      var day = currentTime.getDate();
      var year = currentTime.getFullYear();

      this.setState({
        visible: true,
        modalTile: "Add New Transaction",
        transactionId: '',
        transactionTimestamp: year + "-" + month + "-" + day,
        transactionAmount: '',
        transactionDescription: ''
      });

      this.forceUpdate();
    }
  
    handleTransactionAmount(event) {
      this.setState({
        transactionAmount: event.target.value
      });
    }
  
    handleTransactionDescription(event) {
      this.setState({
        transactionDescription: event.target.value
      });
    }
  
    addTransaction() {
  
      /**
       * Validate user input
       */
      if(isNaN(this.state.transactionAmount)) {
  
        this.setState({
          error: 'Amount must be numbers',
        });
        this.forceUpdate();
        return;
  
      } else if (this.state.transactionAmount === '' || this.state.transactionDescription === '') {
  
        this.setState({
          error: 'All fileds are required',
        });
        this.forceUpdate();
        return;
  
      } else {
  
        this.setState({
          error: '',
        });
        this.forceUpdate();
  
      }
  
      var oldTransactions = this.state.transactions;
      var newTransaction = {
        amount: this.state.transactionAmount,
        description: this.state.transactionDescription,
        timestamp: this.state.transactionTimestamp
      }
      oldTransactions.unshift(newTransaction);

      this.setState({
        transactions: oldTransactions
      });

      this.setState({
        visible: false
      });
  
      this.forceUpdate();
  
      /**
       * AJAX call to create a new transaction
       */
      axios({
  
        method: 'post',
        url: config.base_url+'api/v1/transaction',
        data: {
          amount: parseFloat(this.state.transactionAmount),
          description: this.state.transactionDescription
        },
        headers: {
          'Authorization': 'Bearer ' + storage.getAuthToken()
        }
  
      })
        .then( (response) => {
  
        })
        .catch( (error) => {
          
          console.log(error);
  
          this.setState({
            error: 'Server Error: Please contact administrator',
            loading: false
          });
  
        });
    }
  
    componentDidMount() {
  
      /**
       * AJAX call to get transactions from server
       */
      axios({
        method: 'get',
        url: config.base_url+'api/v1/transaction',
        headers: {
          'Authorization': 'Bearer ' + storage.getAuthToken()
        }
      })
      .then( (response) => {
  
        this.setState({
          transactions: response.data.data,
          loading: false
        })
      })
      .catch( (error) => {
  
        console.log(error);
  
        this.setState({
          error: 'Server Error: Please contact administrator',
          loading: false
        });
  
        this.forceUpdate();
  
      });
  
    }

    onDelete(id, index) {
      
      var tmpTransactions = this.state.transactions;
      tmpTransactions.splice(index, 1);
      this.setState( prevState => ({
        transactions: tmpTransactions,
        loading: false
      }));
  
      this.forceUpdate();

      // delete transactions from database using ajax
      axios({
        method: 'delete',
        url: config.base_url+'/api/v1/transaction/'+id,
        headers: {
          'Authorization': 'Bearer ' + storage.getAuthToken()
        },
        data: null
      }).then( (response) => {
        

      }).catch( (error) => {

        console.log(error);
  
        this.setState({
          error: 'Server Error: Please contact administrator',
          loading: false
        });
  
        this.forceUpdate();

      });

    }

    onEdit(id, index) {

      this.setState({
        transactionId: id,
        transactionIndex: index,
        modalTile: "Edit Transaction",
        visible: true,
        transactionTimestamp: this.state.transactions[index].timestamp,
        transactionAmount: this.state.transactions[index].amount,
        transactionDescription: this.state.transactions[index].description
      });

      this.forceUpdate();

    }

    handleOk() {
      if(this.state.transactionId === '') {
        this.addTransaction();
      } else {
        this.editTransaction();
      }
    }

    editTransaction() {

      if(isNaN(this.state.transactionAmount)) {
  
        this.setState({
          error: 'Amount must be numbers',
        });
        this.forceUpdate();
        return;
  
      } else if (this.state.transactionAmount === '' || this.state.transactionDescription === '') {
  
        this.setState({
          error: 'All fileds are required',
        });
        this.forceUpdate();
        return;
  
      } else {
  
        this.setState({
          error: '',
        });
        this.forceUpdate();
  
      }
  
      var oldTransactions = this.state.transactions;
      var newTransaction = {
        amount: this.state.transactionAmount,
        description: this.state.transactionDescription,
        timestamp: this.state.transactionTimestamp.format("YYYY-MM-DD")
      }
      
      oldTransactions[this.state.transactionIndex] = newTransaction;
      console.log(oldTransactions);
      this.setState({
        transactions: oldTransactions,
      });
  
      this.setState({
        visible: false
      });

      this.forceUpdate();
    
      axios({
  
        method: 'put',
        url: config.base_url+'api/v1/transaction/'+this.state.transactionId,
        data: {
          amount: parseFloat(this.state.transactionAmount),
          description: this.state.transactionDescription,
          timestamp: moment(this.state.transactionTimestamp).unix()
        },
        headers: {
          'Authorization': 'Bearer ' + storage.getAuthToken()
        }
  
      })
        .then( (response) => {
  
        })
        .catch( (error) => {
          
          console.log(error);
  
        });

    }

    handleCancel() {
      this.setState({
          visible: false
      });
    }

    onDateChange(date, dateString) {
      // use date.unix() e.g. 1542441716

      this.setState({
        transactionTimestamp: date
      });

      this.forceUpdate();

  }

    onAmountChange(event) {

      this.setState({
        transactionAmount: event.target.value
      });

      this.setState();

    }

    onDescriptionChange(event) {

      this.setState({
        transactionDescription: event.target.value
      });

      this.setState();
    }

    render() {
      /**
       * Styles
       */
      const thStyle = {
        fontSize: '20pt',
        color: '#2f4b6a',
        textAlign: 'left'
      }
  
      const tableStyle = {
        borderCollapse: 'collapse' ,
        width: '100%',
        padding: '10pt',
      }
  
      const timeStyle = {
        fontSize: '18pt',
        color: '#362010',
        textAlign: 'left'
      }
  
      const amountStyle = {
        fontSize: '18pt',
        color: '#002928',
        textAlign: 'left'
      }
  
      const descriptionStlye = {
        fontSize: '18pt',
        textAlign: 'left'
      }
  
      const secStyle = {
        fontSize: '18pt',
        color: '#367371',
        textAlign: 'left'
      }
  
      /**
       * Data
       */

      const columns = [
        {
          title: 'Transaction Date',
          dataIndex: 'timestamp',
          key: 'timestamp'
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount'
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: 'actions',
          dataIndex: '',
          key: 'actions',
          render: (text, record, index) => (
            <div>
              <Button type="info" onClick={this.onEdit.bind(this, text.id, index)}> Edit </Button>
              <Button type="danger" onClick={this.onDelete.bind(this,text.id, index)}> Delete </Button>
            </div>
          )
        },
      ]
  
      /**
       * Table
       */
      const content = (
        <div>
        <div>
        <Button type="primary" size="large" onClick={this.showForm}><Icon type="form" theme="outlined" />Add New Transaction</Button> <br/><br/>
        <form style={{display: this.state.showForm ? 'inline-block' : 'none'}}>
          <span> Transaction Amount </span><Input type="text" onChange={this.handleTransactionAmount}/><br/>
          <span> Transaction Description </span><Input type="text" onChange={this.handleTransactionDescription}/><br/><br/>
          <Button id="submitButton" onClick={this.handleSubmit}> Submit </Button><br/>
        </form>

        </div>
  
        <Card loading={this.state.loading}>

          <Table dataSource={this.state.transactions} columns={columns} />

        </Card>

        <TransactionModal visible={this.state.visible} 
        handleOk={this.handleOk.bind(this)} handleCancel={this.handleCancel.bind(this)}
        onDateChange={this.onDateChange.bind(this)} onAmountChange={this.onAmountChange.bind(this)}
        onDescriptionChange={this.onDescriptionChange.bind(this)}
        transactionTimestamp={this.state.transactionTimestamp}
        transactionAmount={this.state.transactionAmount}
        transactionDescription={this.state.transactionDescription}
        modalTitle={this.state.modalTile}
        error={this.state.error}
        > </TransactionModal>

        </div>
      );
  
      return content;
    }
}
  
export default TransactionStatement;
