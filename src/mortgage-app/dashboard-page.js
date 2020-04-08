import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/app-route/app-location.js';
import '@polymer/paper-spinner/paper-spinner.js';
import './shared/smart-accordion.js';

/**
 * @customElement
 * @polymer
 */
class DashboardPage extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          display: block;
        }
        table, td, th {  
            border: 1px solid rgb(0, 0, 0);
            text-align: left;
            border-style: dashed;
          }
          
          table {
            border-collapse: collapse;
            margin-top:20px;
            margin-bottom:20px;
            width: 90%;
          }
          
          th, td {
            padding: 15px;
          }
          #form {
            border: 2px solid black;
            width: 500px;
            margin-left: 400px;
          }
        
          form {
            margin-left: 20px;
            margin-right: 20px;
          }
          h2{
            text-align: center;
          }
          #buttons{
            position:absolute;
            top:50px;
            left:1100px;
          }
         
          paper-button {
            text-align: center;
            background-color:black;
            color:white;
          }

          a{
            text-decoration:none;
            color:white;
          }
          #spin{
            position:fixed;
            margin-left:50%;
            top:50%;
        }
        h1{
          text-align:center;
        }
      </style>

      
<app-location route={{route}}></app-location>
<smart-accordian id="aac"><div slot="summary">Mortgage Account</div><h3>Mortgage Account Number: {{data.mortgageNo}} </h3>
<h3>Mortgage Balance: {{data.mortgageBalance}} INR</h3><h3>Monthly EMI: {{data.emi}} INR</h3>



</smart-accordian>

<smart-accordian id="aac"><div slot="summary">Saving Account</div>
<h3>Saving Account No. : {{data.savingAccountNo}} </h3>
<h3>Saving Account Balance: {{data.savingBalance}} INR</h3>



</smart-accordian>

<div id="buttons">
<paper-button raised class="custom indigo" on-click="_handlePayment">Payment</paper-button>

<paper-button raised class="custom indigo" on-click="_handleLogout"><a name="login-page" href="[[rootPath]]login-page">Logout</a></paper-button>
</div>
<h3>Customer Id: {{data.customerId}}</h3>
<h3>Customer Name: {{data.customerName}} </h3>







<h1>Transaction History</h1>
<table>
  <tr>
  <th>Transaction Date</th>
  <th>From Account No (Saving)</th>
  
  <th> To Account No(Mortgage)</th>
    <th>Debit Amount</th>

  
    

  </tr>
    <template is="dom-repeat" items={{userData}} as="historyData">
  <tr>
  <td>{{historyData.transactionDate}}</td>



    <td>{{historyData.fromAccountNo}}</td>
    <td>{{historyData.toAccountNumber}}</td>
    <td>{{historyData.creditAmount}} ₹ </td>

    
  </tr>
  </template>
</table>






<iron-ajax id="ajax" handle-as="json" on-response="_handleResponse" 
content-type="application/json" on-error="_handleError"></iron-ajax>
    `;
    }
    static get properties() {
        return {
            prop1: {
                type: String,
                value: 'dashboard page'
            },
            action: {
                type: String
            },
            data: {
                type: Array,
                value: []
            },
            userData: {
                type: Array,
                value: []
            }

        };
    }
    //if session storage is clear then it will be redirected to login page
    ready() {
        super.ready();
        // this.customer = JSON.parse(sessionStorage.getItem('customer'));
        // // console.log(this.customer.userName);
        // if (this.customer.userName === null) {
        //     this.set('route.path', './login-page')
        // }
        console.log(this.$.aac);
    }

    //getting list of all the transasctions
    connectedCallback() {
        super.connectedCallback();
        this.customer = JSON.parse(sessionStorage.getItem('customer'));
        console.log(this.customer.customerId);
        let customerId=this.customer.customerId;
        this._makeAjax(`http://localhost:9095/mortgage/transactions/${this.customer.customerId}`, 'get', null)
        this.action = 'Data'

    }
      /**
   * clear session storage and route to login page
   */
  _handleLogout() {

    sessionStorage.clear();
    this.set('route.path', './login-page');
    window.location.reload();

  }
  _handlePayment(){
    this.set('route.path', './payment-page');
  }

    // calling main ajax call method 
  _makeAjax(url, method, postObj) {
    let ajax = this.$.ajax;
    ajax.method = method;
    ajax.url = url;
    ajax.body = postObj ? JSON.stringify(postObj) : undefined;
    ajax.generateRequest();
  }
  _handleResponse(event) {
    switch (this.action) {
      case 'Data':
        console.log(event.detail.response);
        this.data = event.detail.response;
        console.log(this.data);
        console.log(this.data.savingAccountNo);
        let amountNo=this.data.savingAccountNo
        sessionStorage.setItem('cust', JSON.stringify(this.data));
    
        
        this._makeAjax(`http://localhost:9095/mortgage/transactions?accountNo=${amountNo}`, 'get', null)
        this.action = 'History';
        break;

      case 'History':
        this.userData = event.detail.response;
        console.log(this.userData);
        break;
    }
  }

}

window.customElements.define('dashboard-page', DashboardPage);
