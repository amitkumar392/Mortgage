import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import '../../node_modules/@polymer/paper-item/paper-item.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/app-route/app-location.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-form/iron-form.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';


/**
 * @customElement
 * @polymer
 */
class PaymentPage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        #btn{
          background-color:  #ff7a22;
          color: white;
          text-align:center;
          width:100%;
          margin-top:20px;
         }
         #loginForm
         {
             width:30%;
             margin:0px auto;
             border:1px solid black;
             padding:10px;
             margin-top:100px;
             border-radius:20px;
             background:light-pink;
         }
     
         h2{
             text-align:center;
         }
         #spin{
             position:fixed;
             margin-left:50%;
             top:50%;
         }
         #dialog1{
          width:50%;
          border-radius:20px;
        }
        
        paper-button {
          text-align: center;
          background-color:black;
          color:white;
        }
        #buttons{
          position:absolute;
          top:50px;
          left:1100px;
        }
        
        a{
          text-decoration:none;
          color:white;
        }
      </style>
      <app-location route={{route}}></app-location>
      <div id="buttons">
      <paper-button raised class="custom indigo" on-click="_handleDashboard">Home</paper-button>
      <paper-button raised class="custom indigo" on-click="_handleLogout"><a name="login-page" href="[[rootPath]]login-page">Logout</a></paper-button>

</div>


      <iron-form id="loginForm">
        <form>
        <h2> Make Payment </h2>
                               
               
                <paper-dropdown-menu label="From Account" id="fromAccount" required  error-message="">
                <paper-listbox slot="dropdown-content" selected="0">
                  <paper-item>{{cust.savingAccountNo}}</paper-item>
                </paper-listbox>
              </paper-dropdown-menu>

              <paper-dropdown-menu label="To Account" id="toAccount" required  error-message="">
              <paper-listbox slot="dropdown-content" selected="0">
                <paper-item>{{cust.mortgageNo}}</paper-item>
              </paper-listbox>
            </paper-dropdown-menu>

            <h3> Total Due Amount: {{cust.emi}}</h3>

            

            <paper-button type="submit" id="btn" on-click="_handlePayment">Make Payment</paper-button>

             

        </form>
      </iron-form>

      
<paper-dialog id="dialog1">
<paper-dialog-scrollable>
<iron-icon icon="icons:clear" on-click="_handleCross"></iron-icon>
  <h3>  {{message}} </h3>

  </paper-dialog-scrollable>
  
</paper-dialog>

      <paper-toast text={{message}}  class="fit-bottom" id="toast"></paper-toast>
      <paper-spinner id="spin" active={{waiting}}></paper-spinner>
      <iron-ajax id="ajax" on-response="_handleResponse" handle-as="json" content-type='application/json'></iron-ajax>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'payment page'
      },
      selected: {
        type: Number,
        value: 0
      },
      action: {
        type: String,
        value: 'List'
      },
      users: {
        type: Array,
        value: []
      },
      login: {
        type: Boolean,
        value: false
      }
    };
  }
  ready() {
    super.ready();
    // this.addEventListener('user-details',(e)=>this._handleResponse(e));
  }


  connectedCallback() {
    super.connectedCallback();
    this.cust = JSON.parse(sessionStorage.getItem('cust'));
    console.log(this.cust.customerId);
    let customerId = this.cust.customerId;
    console.log(this.cust.emi);

  }
  _handleDashboard()
  {
    this.set('route.path', './dashboard-page');
  }
  _handleCross() {

    this.$.dialog1.close();
    this.set('route.path', './dashboard-page');

}

  _handlePayment() {
    let fromAccountNumber = parseInt(this.$.fromAccount.value);
    let toMortgageAccountNumber = parseInt(this.$.toAccount.value);
    let amount = this.cust.emi;

    let obj = {amount,fromAccountNumber,toMortgageAccountNumber,amount};
    console.log(obj);
    this._makeAjax(`http://localhost:9095/mortgage/transactions?customerId=${this.cust.customerId}`, "post", obj);
    this.waiting=true;

  }

  // /**
  //  * fetching the user data from database and validating the phone number and password
  //  */
  // handleLogin() {
  //   if (this.$.loginForm.validate()) {
  //     let customerId = this.$.customerId.value;
  //     let password = this.$.password.value;
  //     let obj = { customerId, password }
  //     console.log(obj);
  //     this._makeAjax(`http://localhost:9095/mortgage/login/login`, "post", obj);
  //     this.waiting = true;
  //     console.log(obj);
  //   }
  //   else {
  //     this.message = "Please enter valid Details";
  //     this.$.toast.open();
  //   }

  // }

  /**
   * calling main ajax call method 
   * @param {String} url 
   * @param {String} method 
   * @param {Object} postObj 
   */
  _makeAjax(url, method, postObj) {
    const ajax = this.$.ajax;
    ajax.method = method;
    ajax.url = url;
    ajax.body = postObj ? JSON.stringify(postObj) : undefined;
    ajax.generateRequest();
  }

  /**
   * handling error if encounter error from backend server
   */
  _handleError(event) {
    console.log(event);
    this.message = "";
    this.$.toast.open();
  }


  /**
   * getting response from server and storing user data and id in session storage
   * @param {*} event 
   */
  _handleResponse(event) {

    switch (this.action) {

      case 'List':
        console.log(event);
        this.users = event.detail.response;
        this.waiting = false;
        // console.log(event.detail.response);
        console.log(this.users.statusCode);
        
        if(this.users.statusCode==650){
          this.message = "Your Payment is Successful!";
          this.$.dialog1.open();

        }
        
        // sessionStorage.setItem('customer', JSON.stringify(this.users));
        // this.customer = JSON.parse(sessionStorage.getItem('customer'));
        // console.log(this.customer.customerId);


    }


  }


}

window.customElements.define('payment-page', PaymentPage);
