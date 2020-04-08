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


/**
 * @customElement
 * @polymer
 */
class LoginPage extends PolymerElement {
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
           paper-button {
            text-align: center;
            background-color:black;
            color:white;
          }
          #buttons{
            position:absolute;
            top:50px;
            left:1200px;
          }
      </style>
      <div id="buttons">
      <paper-button raised class="custom indigo" on-click="_handleLoan">Apply Loan</paper-button>
</div>

      <app-location route={{route}}></app-location>

    
      <iron-form id="loginForm">
        <form>
        <h2> User Login</h2>
                <paper-input  label="Customer Id" id="customerId" type="text"  name="customerId" auto-validate required error-message="enter valid customer id"><iron-icon slot="suffix" icon="icons:account-circle"></iron-icon> </paper-input>
                <paper-input type="password" label="Password" auto-validate required error-message="Enter the password" id="password"><iron-icon slot="suffix" icon="lock"></iron-icon></paper-input>
                <paper-button type="submit" id="btn" on-click="handleLogin">Login</paper-button>
             

        </form>
      </iron-form>
      <paper-toast text={{message}}  class="fit-bottom" id="toast"></paper-toast>
      <paper-spinner id="spin" active={{waiting}}></paper-spinner>
      <iron-ajax id="ajax" on-response="_handleResponse" handle-as="json" content-type='application/json'></iron-ajax>
    `;
    }
    static get properties() {
        return {

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

    }
    _handleLoan(){
        this.set('route.path', './apply-loan');
    }

    /**
     * fetching the user data from database and validating the phone number and password
     */
    handleLogin() {
        if (this.$.loginForm.validate()) {
            let customerId = this.$.customerId.value;
            let password = this.$.password.value;
            let obj = { customerId, password }
            console.log(obj);
            this._makeAjax(`http://localhost:9095/mortgage/login`, "post", obj);
            this.waiting = true;
            console.log(obj);
        }
        else {
            this.message = "Please enter valid Details";
            this.$.toast.open();
        }

    }

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
        this.message = "Wrong Credentials";
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
                console.log(this.users);
                sessionStorage.setItem('customer', JSON.stringify(this.users));
                // this.customer = JSON.parse(sessionStorage.getItem('customer'));
                // console.log(this.customer.customerId);
                this.set('route.path', './dashboard-page');
               
        }


    }


}

window.customElements.define('login-page', LoginPage);
