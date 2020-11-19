/**
 * Imports
 */
import request from './services.js';


/**
 * Endpoints
 */

const URL_CREATE_USER = 'http://localhost:3030/wareHouse/admin/post/createUser';
const URL_CREATE_ADMIN = 'http://localhost:3030/wareHouse/admin/post/createAdmin';
const URL_GET_USERS = 'http://localhost:3030/wareHouse/admin/get/getUsers';
const URL_ADMIN_STATE = 'http://localhost:3030/wareHouse/get/adminState';

/**
 * Global Variables
 */

let id_Modify_User;
let id_Delete_User;
let data = {};
let admin_State = false;
/**
 * DOM Variables
 */

const name_Input_Users = document.querySelector('.name_Input_Users');
const lastName_Input_Users = document.querySelector('.lastName_Input_Users');
const email_Input_Users = document.querySelector('.email_Input_Users');
const password_Input_Users = document.querySelector('.password_Input_Users');
const passwordRepeat_Users = document.querySelector('.passwordRepeat_Users');
const create_Button_Users = document.querySelector('.create_Button_Users');
const admin_Account_Checkbox_Users = document.querySelector('.admin_Account_Checkbox_Users');
const user_Account_Checkbox_Users = document.querySelector('.user_Account_Checkbox_Users');
const registered_Users_Link = document.querySelector('.registered_Users_Link');
const create_User_Link = document.querySelector('.create_User_Link');
const createUser_Section = document.querySelector('.createUser_Section');
const registered_users_Section = document.querySelector('.registered_users_Section');
const table_RegisteredUsers = document.querySelector('.table_RegisteredUsers');
const modify_User_Modal = document.querySelector('.modify_User_Modal');
const closeButton_Modal_Modify_User = document.querySelector('.closeButton_Modal_Modify_User');
const modify_User_Btn = document.querySelector('.modify_User_Btn');
const inputName_Modify_User = document.querySelector('.inputName_Modify_User');
const inputLastname_Modify_User = document.querySelector('.inputLastname_Modify_User');
const inputEmail_Modify_User = document.querySelector('.inputEmail_Modify_User');
const delete_User_Btn = document.querySelector('.delete_User_Btn');
const logo = document.querySelector('.logo');
const user_Html_Link = document.querySelector('.user_Html_Link');
/**
 * Add event listener to logo
 */
logo.addEventListener('click', () => {
  window.location.replace('../html/login.html');
});

/**
 * @method check_Admin_State
 * @description Checks the admin state and redirect to login page if token isnt valid
 */
const check_Admin_State = (() => {
  request.get(URL_ADMIN_STATE).then((response) => {
    if (response.ok === true) {
      admin_State = response.admin
      if (admin_State === true) {
        if (user_Html_Link.className === 'user_Html_Link')
          user_Html_Link.classList.toggle('user_Html_Link--show')
      }
      else {
        if (user_Html_Link.className === 'user_Html_Link user_Html_Link--show')
          user_Html_Link.classList.toggle('user_Html_Link--show')
      }
    }
    else {
      swal(`${response.title}`, `${response.detail}`, 'error').then(() =>
        window.location.replace('../html/login.html'))
    }
  }).catch((error) => {
    console.log(error)
  });
  console.log(admin_State);

});

check_Admin_State();

/**
 * @method create_New_Account
 * @description Create an user in the database
 */

const create_New_Account = (() => {
  data = {};

  data = {
    name: name_Input_Users.value,
    lastname: lastName_Input_Users.value,
    email: email_Input_Users.value,
    password: passwordRepeat_Users.value,
  }
  let URL = '';

  if (admin_Account_Checkbox_Users.checked === true) {
    URL = URL_CREATE_ADMIN;
  }
  if (user_Account_Checkbox_Users.checked === true) {
    URL = URL_CREATE_USER;
  }

  request.create(URL, data).then((response) => {
    if (response.ok === true) {
      swal(`${response.title}`, `${response.detail}`, 'success');
    }
    else {
      swal(`${response.title}`, `${response.detail}`, 'error');
    }
  }).catch((error) => console.log({
    error: error
  }));
});

/**
 * Click event listener for button
 */

create_Button_Users.addEventListener('click', () => {
  if (name_Input_Users.value === '') {
    swal("Error", "No ingresaste el nombre del usuario.", "error");
  }
  else if (lastName_Input_Users.value === '') {
    swal("Error", "No ingresaste el apellido del usuario.", "error");
  }
  else if (email_Input_Users.value === '') {
    swal("Error", "No ingresaste el email del usuario.", "error");
  }
  else if (password_Input_Users.value === '') {
    swal("Error", "No ingresaste una contraseña", "error");
  }
  else if (password_Input_Users.value !== passwordRepeat_Users.value) {
    swal("Error", "Las contraseñas deben de coincidir. Por favor verifica la información ingresada", "error");
  }
  else {
    create_New_Account();
  }
});


/**
 * Add event for changing to create user section
 */

create_User_Link.addEventListener('click', () => {
  if (create_User_Link.className === 'create_User_Link') {
    create_User_Link.classList.toggle('create_User_Link--focus')
  }
  if (registered_Users_Link.className === 'registered_Users_Link registered_Users_Link--focus') {
    registered_Users_Link.classList.toggle('registered_Users_Link--focus')
  }
  if (createUser_Section.className === 'createUser_Section') {
    createUser_Section.classList.toggle('createUser_Section--show')
  }
  if (registered_users_Section.className === 'registered_users_Section') {
    registered_users_Section.classList.toggle('registered_users_Section--hidden')
  }

});

/**
 * Add event for changing to registered users section
 */

registered_Users_Link.addEventListener('click', () => {

  if (registered_Users_Link.className === 'registered_Users_Link') {
    registered_Users_Link.classList.toggle('registered_Users_Link--focus')
  }
  if (create_User_Link.className === 'create_User_Link create_User_Link--focus') {
    create_User_Link.classList.toggle('create_User_Link--focus')
  }
  if (createUser_Section.className === 'createUser_Section createUser_Section--show') {
    createUser_Section.classList.toggle('createUser_Section--show')
  }
  if (registered_users_Section.className === 'registered_users_Section registered_users_Section--hidden') {
    registered_users_Section.classList.toggle('registered_users_Section--hidden')
  }
  get_Users();
})

/**
 * @method get_Users
 * @description Get registered users in the database
 */

const get_Users = () => {

  request.get(URL_GET_USERS).then((response) => {
    fill_User_Table(response.data)

  }).catch((error) => {
    console.log(error)
  })
};

get_Users();

/**
 * @method fill_User_Table
 * @description fill the user table with the information in the database
 */

const fill_User_Table = ((data) => {
  while (table_RegisteredUsers.firstChild) { table_RegisteredUsers.removeChild(table_RegisteredUsers.firstChild) }
  let listener_Modify_Users = [];
  let listener_Delete_Users = [];
  const table_body = document.createElement('tbody');
  const table_Header = document.createElement('tr');
  const row_Header_Id = document.createElement('th');
  row_Header_Id.textContent = 'ID';
  table_Header.appendChild(row_Header_Id);
  const row_Header_Name = document.createElement('th');
  row_Header_Name.textContent = 'Nombres';
  table_Header.appendChild(row_Header_Name);
  const row_Header_Lastname = document.createElement('th');
  row_Header_Lastname.textContent = 'Apellidos';
  table_Header.appendChild(row_Header_Lastname);
  const row_Header_Email = document.createElement('th');
  row_Header_Email.textContent = 'Email';
  table_Header.appendChild(row_Header_Email);
  const row_Header_Menu = document.createElement('th');
  row_Header_Menu.textContent = 'Acciones';
  table_Header.appendChild(row_Header_Menu);
  table_body.appendChild(table_Header);
  table_RegisteredUsers.appendChild(table_body);
  data.forEach(rowData => {
    const row = document.createElement('tr');
    table_RegisteredUsers.lastChild.appendChild(row);
    const id_User = document.createElement('td');
    id_User.textContent = rowData.id;
    row.appendChild(id_User);
    const name_User = document.createElement('td');
    name_User.textContent = rowData.name;
    row.appendChild(name_User);
    const lastname_User = document.createElement('td');
    lastname_User.textContent = rowData.lastname;
    row.appendChild(lastname_User);
    const email_User = document.createElement('td');
    email_User.textContent = rowData.email;
    row.appendChild(email_User);
    const menu_User = document.createElement('td');
    const list_Menu_User = document.createElement('ul');
    list_Menu_User.classList.add('list_Menu_User');
    const list_Item_Icon = document.createElement('li');
    const icon_Menu = document.createElement('i');
    icon_Menu.classList.add('fas', 'fa-ellipsis-h');
    list_Item_Icon.appendChild(icon_Menu);
    const modify_Icon_User = document.createElement('i');
    modify_Icon_User.classList.add('fas', 'fa-pen');
    modify_Icon_User.dataset.toggle = 'modal';
    modify_Icon_User.dataset.target = '#modal_Modify_User';
    list_Item_Icon.appendChild(modify_Icon_User);
    const delete_Icon_User = document.createElement('i');
    delete_Icon_User.classList.add('fas', 'fa-trash');
    list_Item_Icon.appendChild(delete_Icon_User);
    list_Menu_User.appendChild(list_Item_Icon);
    menu_User.appendChild(list_Menu_User);
    row.appendChild(menu_User);
    listener_Modify_Users.push({ id: rowData.id, modify_Icon: modify_Icon_User });
    listener_Delete_Users.push({ id: rowData.id, delete_Icon: delete_Icon_User });
  });
  create_Modify_Listener(listener_Modify_Users);
  create_Delete_Listener(listener_Delete_Users);
});

/**
 * @method create_Modify_Listener
 * @description Create click listener for the modify icon
 */

const create_Modify_Listener = ((listeners) => {
  listeners.forEach((listener) => {
    listener.modify_Icon.addEventListener('click', () => {
      id_Modify_User = listener.id;
      id_Delete_User = listener.id;
    });
  });
});

/**
 * @method create_Delete_Listener
 * @description Create click listener for the delete icon
 */
const create_Delete_Listener = ((listeners) => {
  listeners.forEach((listener) => {
    listener.delete_Icon.addEventListener('click', () => {
      id_Delete_User = listener.id;
      delete_Users_Request(id_Delete_User);
    })
  })
})

/**
 * Add event listener to the modify button of the modal
 */
modify_User_Btn.addEventListener('click', () => {
  if (inputName_Modify_User.value === '') {
    swal("Error", "No ingresaste el nombre del usuario.", "error");
  }
  else if (inputLastname_Modify_User.value === '') {
    swal("Error", "No ingresaste el apellido del usuario.", "error");
  }
  else if (inputEmail_Modify_User.value === '') {
    swal("Error", "No ingresaste el email del usuario.", "error");
  }
  else {
    modify_Users_Request(id_Modify_User);
    inputName_Modify_User.value = '';
    inputLastname_Modify_User.value = '';
    inputEmail_Modify_User.value = '';
    $('#modal_Modify_User').modal('hide');
  }

})



/**
 * @method modify_Users_Request
 * @description Request to the server for modify a user data row
 */

const modify_Users_Request = ((id) => {
  data = {};
  data = {
    name: inputName_Modify_User.value,
    lastname: inputLastname_Modify_User.value,
    email: inputEmail_Modify_User.value
  }
  let URL_PUT_USERS = 'http://localhost:3030/wareHouse/put/users/';
  URL_PUT_USERS += `${id}`;
  request.put(URL_PUT_USERS, data)
    .then((response) => {
      if (response.ok === true) {
        swal(`${response.title}`, `${response.detail}`, 'success')
        get_Users();
      }
      else {
        swal(`${response.title}`, `${response.detail}`, 'error')
      }
    }
    ).catch((error) => {
      console.log(error)
    });
});

/**
 * Add event listener to the modify button of the modal
 */
delete_User_Btn.addEventListener('click', () => {
  delete_Users_Request(id_Delete_User);
  inputName_Modify_User.value = '';
  inputLastname_Modify_User.value = '';
  inputEmail_Modify_User.value = '';
  $('#modal_Modify_User').modal('hide');
})

/**
 * @method delete_Users_Request
 * @description Request to the server for delete a user data row
 */

const delete_Users_Request = ((id) => {
  let URL_DELETE_USERS = 'http://localhost:3030/wareHouse/delete/users/';
  URL_DELETE_USERS += `${id}`;
  request.delete(URL_DELETE_USERS)
    .then((response) => {
      if (response.ok === true) {
        swal(`${response.title}`, `${response.detail}`, 'success')
        get_Users();
      }
      else {
        swal(`${response.title}`, `${response.detail}`, 'error')
      }
    }
    ).catch((error) => {
      console.log(error)
    });
})