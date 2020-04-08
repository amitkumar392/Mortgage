import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '@polymer/iron-pages/iron-pages.js';

import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/app-route/app-location.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';


/**
* @customElement
* @polymer
*/
class ApplyLoan extends PolymerElement {
    static get template() {
        return html`
<style>
    :host {
        display: block;
    }
    #loginForm
    {
        width:30%;
        margin:0px auto;
        border:2px solid black;
        padding:10px;
        margin-top:70px;
        border-radius:20px;
    }
    paper-button{
        background-color:  #ff7a22;
        color: white;
        text-align:center;
        width:100%;
        margin-top:20px;
      }
      #checkBtn{
          width:10%;
      }
      #spin{
        position:fixed;
        margin-left:50%;
        top:50%;
        z-index:9999;
    }
    
    #dialog{
        width:50%;
        border-radius:20px;
      }
      
    #dialog1{
        width:50%;
        border-radius:20px;
      }
    h2{
        text-align:center;
    }
    
    paper-input.custom {
        margin-bottom: 14px;
        --primary-text-color: #01579B;
        --paper-input-container-color: black;
        --paper-input-container-focus-color: black;
        --paper-input-container-invalid-color: black;
        border: 1px solid #BDBDBD;
        border-radius: 5px;

        /* Reset some defaults */
        --paper-input-container: {
            padding: 0;
        };

        --paper-input-container-underline: {
            display: none;
            height: 0;
        };

        --paper-input-container-underline-focus: {
            display: none;
        };

        --paper-input-container-input-focus: {
            background: rgba(0, 0, 0, 0.1);
        };

        --paper-input-container-input-invalid: {
            background: rgba(255, 0, 0, 0.3);
        };

        --paper-input-container-label: {
            top: -8px;
            left: 4px;
            background: white;
            padding: 2px;
            font-weight: bold;
        };

    }

    form {
        width: 500px;
        border: 2px solid grey;
        margin: 0px auto;
        padding: 20px;
        border-radius: 5px;
        background: #f5f6ff;
    }

    paper-button {
        margin-top: 20px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        background-color:#ff7a22;
        color: white;
    }

    vaadin-date-picker {
        display: inline;
    }

   
</style>

<app-location route="{{route}}">
</app-location>

<h2>[[prop1]]!</h2>

<paper-dialog id="dialog">
<paper-dialog-scrollable>
<iron-icon icon="icons:clear" on-click="_handleCross"></iron-icon>
  <h3>  {{message}} </h3>
  <h3> Monthly EMI: {{selected.emiValue}} ₹</h3>
  <h3> Initial Deposit : {{selected.intialAmount}} ₹ </h3>
 <paper-button raised on-click='_handleProceed'>Do you want to proceed</paper-button>
 
 
 
  </paper-dialog-scrollable>
  
</paper-dialog>


<paper-dialog id="dialog1">
<paper-dialog-scrollable>
<iron-icon icon="icons:clear" on-click="_handleCross"></iron-icon>
  <h3>  {{message}} </h3>

  </paper-dialog-scrollable>
  
</paper-dialog>


<iron-form id="form1">
<paper-tabs selected={{selected}}>
    <paper-tab>Personal Details</paper-tab>
    <paper-tab>Occupational Details</paper-tab>
    <paper-tab>Property Details</paper-tab>
</paper-tabs>

<iron-pages selected={{selected}}>
    <div>
        <form>
            <paper-input class="custom" type='text' label="Full Name" id="fullName" auto-validate
            required error-message=""> </paper-input>

            


            <vaadin-date-picker class="custom" always-float-label id="dob" label="DOB" max="2020-03-31" required>
            </vaadin-date-picker>

            <paper-input class="custom" type='email' label="Email"  id="email" auto-validate
            required error-message=""></paper-input>

            <paper-input class="custom" type="text" label="Mobile Number" id="mobileNo"  auto-validate
            required error-message="" allowed-pattern=[0-9]    maxlength="10" ></paper-input>

            <paper-input class="custom" type="text" label="City" id="city"  auto-validate required error-message=""
                allowed-pattern="[a-zA-Z]*">
            </paper-input>
            
            <paper-input class="custom" type='text' label="Pan Card." id="pan" auto-validate required
                error-message="" allowed-pattern='[a-zA-Z0-9]*' maxlength="10"></paper-input>
    

            <paper-button raised on-click="_next">Next</paper-button>
        </form>
    </div>
    <div>
        <form>
            <paper-input class="custom" type='text' label="Occupation" id="occupation" auto-validate required error-message="" >
            </paper-input>
            <paper-button raised on-click='_nextApi'>Next</paper-button>
        </form>
    </div>
    <div>
        <form>
            <paper-input class="custom" type='text' label="Annual Income (₹)" id="income" required auto-validate
                error-message="{{msg}}" allowed-pattern=[0-9] maxlength="10"></paper-input>

            <paper-radio-group selected="homeLoan" id="homeLoan">
                <label for="Property Type">Property Type</label>
                <paper-radio-button name="homeLoan">Home Loan</paper-radio-button>
            </paper-radio-group>


            <paper-input class="custom" type='text' label="Property Value (₹)" id="propertyValue" auto-validate
                required error-message="" allowed-pattern=[0-9] maxlength="10"></paper-input>

            <paper-input class="custom" type='text' label="Loan Amount (₹)" id="loanAmount" auto-validate required
                error-message="" allowed-pattern=[0-9] maxlength="10"></paper-input>

            <paper-input class="custom" type='text' label="Tenure in months" id="tenure" auto-validate required
                error-message="" allowed-pattern=[0-9] maxlength="3"></paper-input>

            <h3>Rate of Interest:8.5% per annum</h3>


            <paper-button raised on-click='_checkEligibility'>Check Eligibility</paper-button>

        </form>
    </div>
</iron-pages>
</iron-form>

        <iron-ajax id="ajax" on-response="_handleResponse" on-error="_handleError" handle-as="json" content-type='application/json'>
        </iron-ajax>
        <paper-spinner id="spin" active={{waiting}}></paper-spinner>
        <paper-toast text={{message}}  class="fit-bottom" id="toast"></paper-toast>

        

        `;
    }
    static get properties() {
        return {
            prop1: {
                type: String,
                value: 'Apply Mortgage Loan'
            },
            selected: {
                type: Object
            },
            action: {
                type: String,
                value: 'List'
            },
        };
    }
    connectedCallback() {
        super.connectedCallback();
        this.selected = 0;
    }
    getCurrentDate()
    {
        let currentDate=new Date();
        return currentDate.toLocaleDateString();
    }
    _next() {
        
        console.log(this.$.dob.value);
        let currentDate = new Date();
        let currentDay = currentDate.getDate();
        let currentMonth = currentDate.getMonth()+1;
        let currentYear = currentDate.getFullYear();

        let dob = this.$.dob.value;
        let dobYear = parseInt(dob.slice(0,4));
        let dobDay = parseInt(dob.slice(5,7));
        let dobMonth = parseInt(dob.slice(8,10));
        console.log(dobDay,dobMonth,dobYear)
        let age=currentYear-dobYear;
        var m = currentMonth - dobMonth;
        if (m < 0 || (m === 0 && currentDay < dobDay)) {
            age--;
        }
        if(age<21)
        {
            alert('you can not apply for this loan ,your age should be age greater than 21');
        }
        else
        {
            this.selected=1;
        }
    }
    _nextApi() {
        this.selected = 2;
    }
    _checkEligibility() {
        let loanAmount = parseInt(this.$.loanAmount.value);
        let propertyValue = parseInt(this.$.propertyValue.value);
        let tenure = parseInt(this.$.tenure.value);
        let annualIncome = parseInt(this.$.income.value);
        let homeLoan = this.$.homeLoan.selected;
        console.log(homeLoan);

        let postObj = { loanAmount, propertyValue, tenure, annualIncome };
        console.log(postObj);
        this._makeAjax(`http://localhost:9095/mortgage/mortgages/valid`, "post", postObj);
        this.waiting = true;
        console.log('dfd');
    }
    _handleProceed() {
        let fullName = this.$.fullName.value;
        let dob = this.$.dob.value;
        let email = this.$.email.value;
        let mobile = this.$.mobileNo.value;
        let city = this.$.city.value;

        let panCard = this.$.pan.value;
        let employmentType = this.$.occupation.value;
        let annualIncome = parseInt(this.$.income.value);
        let propertyType = this.$.homeLoan.selected;
        let propertyValue = parseInt(this.$.propertyValue.value);
        let loanAmount = parseInt(this.$.loanAmount.value);
        let tenure = parseInt(this.$.tenure.value);
        let initialDeposit = this.deposit;
        let emi=this.emiValue
        console.log(initialDeposit);
        let obj = {
            fullName, dob, email, mobile, city, panCard, employmentType, annualIncome, propertyType,
            propertyValue, loanAmount, tenure, initialDeposit,emi
        }
        console.log(obj);

        this._makeAjax(`http://localhost:9095/mortgage/mortgages`, "post", obj);
        this.waiting = true;
        console.log('dfd');
        this.action = 'Store'

    }
    _handleCross() {
        this.$.dialog.close();
        this.$.dialog1.close();

    }
    /**
  * getting response from server and storing user data and id in session storage
  * @param {*} event 
  */
    _handleResponse(event) {
        switch (this.action) {
            case 'List':
                console.log('abc');
                this.waiting = false;
                console.log(event.detail.response);
                this.selected = event.detail.response;
                this.deposit = event.detail.response.intialAmount;
                this.emiValue = event.detail.response.emiValue;

                console.log(event.detail.response.status);
                if (event.detail.response.status == 600) {
                    this.message = "Not eligible, Your annual income should be greater than 4.5 lacs";
                    this.$.toast.open();
                    this.$.dialog1.open();

                }
                if (event.detail.response.status == 620) {
                    this.message = "Not eligible, You can not apply loan more than property value!";
                    this.$.toast.open();
                    this.$.dialog1.open();

                }
                if (event.detail.response.status == 630) {
                    this.message = "Not eligible, You can not apply loan, because EMI is greater than monthly income";
                    this.$.toast.open();
                    this.$.dialog1.open();

                }
                if (event.detail.response.status == 610) {
                    this.message = " You are eligible to apply loan!";
                    console.log(event.detail.response.emiValue);
                    console.log(event.detail.response.intialAmount);
                    this.$.toast.open();
                    this.$.dialog.open();

                }
                console.log('xyz');
                break;


            case 'Store':
                console.log(event.detail.response);
                this.waiting=false;
                confirm('wait');
                this.set('route.path', './login-page');


        }


    }

    _handleError() {

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
}

window.customElements.define('apply-loan', ApplyLoan);