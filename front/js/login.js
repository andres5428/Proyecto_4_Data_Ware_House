/**
 * Imports
 */
import request from './services.js';

/**
 * Endpoints
 */

const URL_LOGIN_USER = 'http://localhost:3030/wareHouse/user/post/login';
const URL_LOGIN_ADMIN = 'http://localhost:3030/wareHouse/admin/post/login';

/**
 * DOM variables
 */

const user_Input = document.querySelector('.user_Input');
const user_Password = document.querySelector('.user_Password');
const submit_Btn = document.querySelector('.submit_Btn');
const user_Log = document.querySelector('.user_Log');
const admin_Log = document.querySelector('.admin_Log');
const user_Html_Link = document.querySelector('.user_Html_Link');
const company_Html_Link = document.querySelector('.company_Html_Link');
const contact_Html_Link = document.querySelector('.contact_Html_Link');
const region_Html_Link = document.querySelector('.region_Html_Link');

/**
 * Global variables
 */
let data = {};
let link_Permission = false;

/**
 * Login
 */

const login = (() => {
  data = {};
  data = {
    email: user_Input.value,
    password: user_Password.value
  };
  let URL = '';

  if (user_Log.checked === true) {
    URL = URL_LOGIN_USER;
  }

  if (admin_Log.checked == true) {
    URL = URL_LOGIN_ADMIN;
  }
  request.login(URL, data)
    .then((response) => {
      if (response.ok === true) {
        swal(`${response.title}`, `${response.detail}`, 'success').then(() =>
          window.location.replace('../html/contacts.html'))
        link_Permission = true;
      }
      else {
        swal(`${response.title}`, `${response.detail}`, 'error')
      }
      save_Token(response.token);
    }).catch((error) => {
      console.log({
        status: 401,
        error: error,
      })
    })
});

/**
 * @method save_Token
 * @description Save the token in the localStorage
 */
const save_Token = ((responseToken) => {
  localStorage.removeItem('Token');
  const token = [];
  token.push(responseToken);
  localStorage.setItem('Token', JSON.stringify(token));
})

/**
 * Add event listener to the submit button 
 */
if (submit_Btn !== null) {
  submit_Btn.addEventListener('click', () => login());
}
