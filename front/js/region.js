/**
 * Imports
 */
import request from './services.js';

/**
 * Global variables
 */

const toggler = document.getElementsByClassName("caret");
let admin_State = false;
let i;
let data = {};
let id_Modify_Region;
let id_Delete_Region;
let id_Region;
let id_modify_Country;
let id_Delete_Country;
let id_Country;
let id_Modify_City;
let id_Delete_City;
let URL = '';
const URL_GET_REGIONS = 'http://localhost:3030/wareHouse/get/getRegions';
const URL_CREATE_REGION = 'http://localhost:3030/wareHouse/post/createRegion';
const URL_MODIFY_REGION = 'http://localhost:3030/wareHouse/put/region/';
const URL_DELETE_REGION = 'http://localhost:3030/wareHouse/delete/region/';
const URL_CREATE_COUNTRY = 'http://localhost:3030/wareHouse/post/createCountry/';
const URL_MODIFY_COUNTRY = 'http://localhost:3030/wareHouse/put/country/';
const URL_DELETE_COUNTRY = 'http://localhost:3030/wareHouse/delete/country/';
const URL_CREATE_CITY = 'http://localhost:3030/wareHouse/post/createCity/';
const URL_MODIFY_CITY = 'http://localhost:3030/wareHouse/put/city/';
const URL_DELETE_CITY = 'http://localhost:3030/wareHouse/delete/city/';
const URL_ADMIN_STATE = 'http://localhost:3030/wareHouse/get/adminState';

/**
 * DOM Variables
 */
const tree_Top_Ul = document.querySelector('.tree_Top_Ul');
const add_Region_Button = document.querySelector('.add_Region');
const modal_ModifyRegion_Btn = document.querySelector('.modal_ModifyRegion_Btn');
const modal_AddCountry_Btn = document.querySelector('.modal_AddCountry_Btn');
const modal_ModifyCountry_Btn = document.querySelector('.modal_ModifyCountry_Btn');
const modal_Input_Name = document.querySelector('.modal_Input_Name');
const modal_AddRegion_Btn = document.querySelector('.modal_AddRegion_Btn');
const modal_Input_CountryName = document.querySelector('.modal_Input_CountryName');
const regionModal_Header_Text = document.querySelector('.regionModal_Header_Text');
const countryModal_Header_Text = document.querySelector('.countryModal_Header_Text');
const cityModal_Header_Text = document.querySelector('.cityModal_Header_Text');
const modal_Input_CityName = document.querySelector('.modal_Input_CityName');
const modal_AddCity_Btn = document.querySelector('.modal_AddCity_Btn');
const modal_ModifyCity_Btn = document.querySelector('.modal_ModifyCity_Btn');
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
 * Create the event listeners for the tree view
 */
const create_Listeners_Caret = (() => {
  for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function () {
      this.parentElement.querySelector(".nested").classList.toggle("active");
      this.classList.toggle("caret-down");
    });
  };
})


/**
 * @method get_Regions
 * @description get the regions from the database
 */

const get_Regions = (() => {
  request.get(URL_GET_REGIONS).then((response) => {
    create_Ul_Regions(response.data);
  }).catch((error) => {
    console.log(error);
  });
});

get_Regions();

/**
 * @method create_Ul_Regions
 * @description Create a ul and his components filled with the region data
 */

const create_Ul_Regions = ((data) => {
  while (tree_Top_Ul.firstChild) { tree_Top_Ul.removeChild(tree_Top_Ul.firstChild) }
  let listener_Modify_Region = [];
  let listener_Delete_Region = [];
  let listener_Add_Country = [];
  let listener_Modify_Country = [];
  let listener_Delete_Country = [];
  let listener_Add_City = [];
  let listener_Modify_City = [];
  let listener_Delete_City = [];
  data.forEach(treeData => {
    const li_Region = document.createElement('li');
    li_Region.classList.add('top_Li');
    tree_Top_Ul.appendChild(li_Region);
    const div_Content_Region = document.createElement('div');
    div_Content_Region.classList.add('div_Content_Region');
    li_Region.appendChild(div_Content_Region);
    const span_Caret = document.createElement('span');
    span_Caret.textContent = treeData.name;
    span_Caret.classList.add('caret');
    div_Content_Region.appendChild(span_Caret);
    const icon_Container = document.createElement('div');
    icon_Container.classList.add('icon_Container');
    div_Content_Region.appendChild(icon_Container);
    const icon_Menu = document.createElement('i');
    icon_Menu.classList.add('fas', 'fa-ellipsis-h');
    icon_Container.appendChild(icon_Menu);
    const modify_Icon = document.createElement('i');
    modify_Icon.classList.add('fas', 'fa-pen');
    modify_Icon.dataset.toggle = "modal";
    modify_Icon.dataset.target = "#modal_Add_Region";
    icon_Container.appendChild(modify_Icon);
    const delete_Icon = document.createElement('i');
    delete_Icon.classList.add('fas', 'fa-trash');
    icon_Container.appendChild(delete_Icon);
    const btn_AddCountry = document.createElement('button');
    btn_AddCountry.classList.add('btn-sm', 'btn-primary', 'add_Country_Btn');
    btn_AddCountry.textContent = 'Agregar país';
    btn_AddCountry.dataset.toggle = "modal";
    btn_AddCountry.dataset.target = "#modal_Add_Country";
    div_Content_Region.appendChild(btn_AddCountry);
    const ul_Nested = document.createElement('ul');
    ul_Nested.classList.add('nested');
    div_Content_Region.appendChild(ul_Nested);
    const countries = treeData.countries;
    listener_Modify_Region.push({ id: treeData.id, modify_Icon: modify_Icon, name: treeData.name });
    listener_Delete_Region.push({ id: treeData.id, delete_Icon: delete_Icon, name: treeData.name });
    listener_Add_Country.push({ id: treeData.id, btn_AddCountry: btn_AddCountry, name: treeData.name });
    countries.forEach((country) => {
      const li_Country = document.createElement('li');
      const div_Content_Country = document.createElement('div');
      div_Content_Country.classList.add('div_Content_Country');
      li_Country.appendChild(div_Content_Country);
      const span_Caret = document.createElement('span');
      span_Caret.textContent = country.name;
      span_Caret.classList.add('caret');
      div_Content_Country.appendChild(span_Caret);
      ul_Nested.appendChild(li_Country);
      const icon_Container = document.createElement('div');
      icon_Container.classList.add('icon_Container');
      div_Content_Country.appendChild(icon_Container);
      const icon_Menu = document.createElement('i');
      icon_Menu.classList.add('fas', 'fa-ellipsis-h');
      icon_Container.appendChild(icon_Menu);
      const modify_Icon = document.createElement('i');
      modify_Icon.classList.add('fas', 'fa-pen');
      modify_Icon.dataset.toggle = "modal";
      modify_Icon.dataset.target = "#modal_Add_Country";
      icon_Container.appendChild(modify_Icon);
      const delete_Icon = document.createElement('i');
      delete_Icon.classList.add('fas', 'fa-trash');
      icon_Container.appendChild(delete_Icon);
      const btn_AddCity = document.createElement('button');
      btn_AddCity.classList.add('btn-sm', 'btn-primary', 'add_City');
      btn_AddCity.textContent = 'Añadir ciudad';
      btn_AddCity.dataset.toggle = "modal";
      btn_AddCity.dataset.target = "#modal_Add_City";
      div_Content_Country.appendChild(btn_AddCity);
      const ul_Nested_Country = document.createElement('ul');
      ul_Nested_Country.classList.add('nested');
      div_Content_Country.appendChild(ul_Nested_Country);
      listener_Modify_Country.push({ id: country.id, modify_Icon: modify_Icon, name: country.name });
      listener_Delete_Country.push({ id: country.id, delete_Icon: delete_Icon, name: country.name });
      listener_Add_City.push({ id: country.id, btn_AddCity: btn_AddCity, name: country.name });
      const cities = country.cities;
      cities.forEach((city) => {
        const li_City = document.createElement('li');
        const div_Content_City = document.createElement('div');
        div_Content_City.classList.add('div_Content_City');
        li_City.appendChild(div_Content_City);
        const span_Text = document.createElement('span');
        span_Text.textContent = city.name;
        span_Text.classList.add('span_Text_City');
        div_Content_City.appendChild(span_Text);
        const icon_Container = document.createElement('div');
        icon_Container.classList.add('icon_Container');
        div_Content_City.appendChild(icon_Container);
        const icon_Menu = document.createElement('i');
        icon_Menu.classList.add('fas', 'fa-ellipsis-h');
        icon_Container.appendChild(icon_Menu);
        const modify_Icon = document.createElement('i');
        modify_Icon.classList.add('fas', 'fa-pen');
        modify_Icon.dataset.toggle = "modal";
        modify_Icon.dataset.target = "#modal_Add_City";
        icon_Container.appendChild(modify_Icon);
        const delete_Icon = document.createElement('i');
        delete_Icon.classList.add('fas', 'fa-trash');
        icon_Container.appendChild(delete_Icon);
        ul_Nested_Country.appendChild(li_City);
        listener_Modify_City.push({ id: city.id, modify_Icon: modify_Icon, name: city.name });
        listener_Delete_City.push({ id: city.id, delete_Icon: delete_Icon, name: city.name });
      });
    });
  });
  create_Listeners_Caret();
  create_Modify_listeners_Region(listener_Modify_Region);
  create_Delete_listeners_Region(listener_Delete_Region);
  create_AddCountry_Listeners(listener_Add_Country);
  create_Modify_Listeners_Country(listener_Modify_Country);
  create_Delete_Listeners_Country(listener_Delete_Country);
  create_AddCity_Listeners(listener_Add_City);
  create_Modify_Listeners_City(listener_Modify_City);
  create_Delete_Listeners_City(listener_Delete_City);
});

/**
 * Event listener for add region button
 */
add_Region_Button.addEventListener('click', () => {
  if (modal_ModifyRegion_Btn.className === "btn btn-primary modal_ModifyRegion_Btn modal_ModifyRegion_Btn--show") {
    modal_ModifyRegion_Btn.classList.toggle("modal_ModifyRegion_Btn--show");
  }
  if (modal_AddRegion_Btn.className === 'btn btn-primary modal_AddRegion_Btn modal_AddRegion_Btn--hidden') {
    modal_AddRegion_Btn.classList.toggle('modal_AddRegion_Btn--hidden');
  }
  regionModal_Header_Text.innerHTML = "Ingresa los datos para añadir una región";
});


/**
 * Event listener for modal add region button
 */
modal_AddRegion_Btn.addEventListener('click', () => {
  if (modal_Input_Name.value === '') {
    swal("Error", "Faltan campos por completar.", "error");
  }
  else {
    create_New_Region();
    get_Regions();
    $('#modal_Add_Region').modal('hide');
  }
});


/**
 * @method create_New_Region
 * @description Request for creating a new region in the database
 */
const create_New_Region = (() => {
  data = {};
  data = {
    name: modal_Input_Name.value
  }

  request.create(URL_CREATE_REGION, data).then((response) => {
    if (response.ok === true) {
      swal(`${response.title}`, `${response.detail}`, 'success');
      get_Regions();
    }
    else {
      swal(`${response.title}`, `${response.detail}`, 'error');
    }
  }).catch((error) => console.log({
    error: error
  }));
});

/**
 * @method create_Modify_listeners_Region
 * @description Create listeners for all region modify icons
 */

const create_Modify_listeners_Region = ((listeners) => {
  listeners.forEach((listener) => {
    listener.modify_Icon.addEventListener('click', () => {
      id_Modify_Region = listener.id;
      regionModal_Header_Text.textContent = `Ingresa los datos para modificar la región "${listener.name}"`;
      if (modal_ModifyRegion_Btn.className === "btn btn-primary modal_ModifyRegion_Btn") {
        modal_ModifyRegion_Btn.classList.toggle("modal_ModifyRegion_Btn--show");
      }
      if (modal_AddRegion_Btn.className === 'btn btn-primary modal_AddRegion_Btn') {
        modal_AddRegion_Btn.classList.toggle('modal_AddRegion_Btn--hidden');
      }
    });
  });
});

/**
 * @method create_Delete_listeners_Region
 * @description Create listeners for all region delete icons
 */

const create_Delete_listeners_Region = ((listeners) => {
  listeners.forEach((listener) => {
    listener.delete_Icon.addEventListener('click', () => {
      id_Delete_Region = listener.id;
      delete_Region(id_Delete_Region);
    });
  });
});

/**
 * @method create_AddCountry_Listeners
 * @description Create listeners for all country add buttons
 */
const create_AddCountry_Listeners = ((listeners) => {
  listeners.forEach((listener) => {
    listener.btn_AddCountry.addEventListener('click', () => {
      id_Region = listener.id;
      if (modal_ModifyCountry_Btn.className === "btn btn-primary modal_ModifyCountry_Btn modal_ModifyCountry_Btn--show") {
        modal_ModifyCountry_Btn.classList.toggle("modal_ModifyCountry_Btn--show");
      }
      if (modal_AddCountry_Btn.className === 'btn btn-primary modal_AddCountry_Btn modal_AddCountry_Btn--hidden') {
        modal_AddCountry_Btn.classList.toggle('modal_AddCountry_Btn--hidden');
      }
      countryModal_Header_Text.textContent = `Ingresa los datos para añadir un país en la región "${listener.name}"`;
    });
  });
});

/**
 * @method create_AddCity_Listeners
 * @description Create listeners for all city add buttons
 */
const create_AddCity_Listeners = ((listeners) => {
  listeners.forEach((listener) => {
    listener.btn_AddCity.addEventListener('click', () => {
      id_Country = listener.id;
      cityModal_Header_Text.textContent = `Ingresa los datos para añadir una ciudad en el país "${listener.name}"`;
      if (modal_ModifyCity_Btn.className === "btn btn-primary modal_ModifyCity_Btn modal_ModifyCity_Btn--show") {
        modal_ModifyCity_Btn.classList.toggle("modal_ModifyCity_Btn--show");
      }
      if (modal_AddCity_Btn.className === 'btn btn-primary modal_AddCity_Btn modal_AddCity_Btn--hidden') {
        modal_AddCity_Btn.classList.toggle('modal_AddCity_Btn--hidden');
      }
    });
  });
});

/**
 * @method create_Modify_Listeners_City
 * @description Create listeners for all city modify icons
 */
const create_Modify_Listeners_City = ((listeners) => {
  listeners.forEach((listener) => {
    listener.modify_Icon.addEventListener('click', () => {
      id_Modify_City = listener.id;
      cityModal_Header_Text.textContent = `Ingresa los datos para modificar la ciudad "${listener.name}"`;
      if (modal_ModifyCity_Btn.className === "btn btn-primary modal_ModifyCity_Btn") {
        modal_ModifyCity_Btn.classList.toggle("modal_ModifyCity_Btn--show");
      }
      if (modal_AddCity_Btn.className === 'btn btn-primary modal_AddCity_Btn') {
        modal_AddCity_Btn.classList.toggle('modal_AddCity_Btn--hidden');
      }
    });
  });
});

/**
 * @method create_Modify_Listeners_Country
 * @description Create listeners for all country modify icons
 */
const create_Modify_Listeners_Country = ((listeners) => {
  listeners.forEach((listener) => {
    listener.modify_Icon.addEventListener('click', () => {
      id_modify_Country = listener.id;
      countryModal_Header_Text.textContent = `Ingresa los datos para modificar el país "${listener.name}"`;
      if (modal_ModifyCountry_Btn.className === "btn btn-primary modal_ModifyCountry_Btn") {
        modal_ModifyCountry_Btn.classList.toggle("modal_ModifyCountry_Btn--show");
      }
      if (modal_AddCountry_Btn.className === 'btn btn-primary modal_AddCountry_Btn') {
        modal_AddCountry_Btn.classList.toggle('modal_AddCountry_Btn--hidden');
      }
    });
  });
});

/**
 * @method create_Delete_Listeners_Country
 * @description Create listeners for all country delete icons
 */
const create_Delete_Listeners_Country = ((listeners) => {
  listeners.forEach((listener) => {
    listener.delete_Icon.addEventListener('click', () => {
      id_Delete_Country = listener.id;
      delete_Country(id_Delete_Country);
      // swal("Petición aceptada", `La región ${listener.name} ha sido eliminada`, "success");
    });
  });
})

/**
 * @method create_Delete_Listeners_City
 * @description Create listeners for all city delete icons
 */
const create_Delete_Listeners_City = ((listeners) => {
  listeners.forEach((listener) => {
    listener.delete_Icon.addEventListener('click', () => {
      id_Delete_City = listener.id;
      delete_City(id_Delete_City);
    });
  });
});

/**
 * @method delete_City
 * @description Request to the server to delete a city from the database
 */
const delete_City = ((id) => {
  URL = '';
  URL = URL_DELETE_CITY;
  URL += `${id}`;
  request.delete(URL).then((response) => {
    if (response.ok === true) {
      swal(`${response.title}`, `${response.detail}`, 'success');
      get_Regions();
    }
    else {
      swal(`${response.title}`, `${response.detail}`, 'error');
    }
  }).catch((error) => console.log({
    error: error
  }));
});

/**
 * @method delete_Country
 * @description Request to the server to delete a country from the database
 */
const delete_Country = ((id) => {
  URL = '';
  URL = URL_DELETE_COUNTRY;
  URL += `${id}`;
  request.delete(URL).then((response) => {
    if (response.ok === true) {
      swal(`${response.title}`, `${response.detail}`, 'success');
      get_Regions();
    }
    else {
      swal(`${response.title}`, `${response.detail}`, 'error');
    }
  }).catch((error) => console.log({
    error: error
  }));
});

/**
 * Event listener for modal add region button
 */
modal_AddCountry_Btn.addEventListener('click', () => {
  if (modal_Input_CountryName.value === '') {
    swal("Error", "Faltan campos por completar.", "error");
  }
  else {
    add_Country(id_Region);
    modal_Input_Name.value = '';
    get_Regions();
    $('#modal_Add_Country').modal('hide');
  }
});

/**
 * @method add_Country
 * @description Add country to the database
 */
const add_Country = ((id) => {
  data = {};
  data = { name: modal_Input_CountryName.value };
  URL = '';
  URL = URL_CREATE_COUNTRY;
  URL += `${id}`;
  request.create(URL, data).then((response) => {
    if (response.ok === true) {
      swal(`${response.title}`, `${response.detail}`, 'success');
      get_Regions();
    }
    else {
      swal(`${response.title}`, `${response.detail}`, 'error');
    }
  }).catch((error) => console.log({
    error: error
  }));
});

/**
 * Event listener for modal add city button
 */
modal_AddCity_Btn.addEventListener('click', () => {
  if (modal_Input_CityName.value === '') {
    swal("Error", "Faltan campos por completar.", "error");
  }
  else {
    add_City(id_Country);
    modal_Input_Name.value = '';
    get_Regions();
    $('#modal_Add_Country').modal('hide');
  }
});

/**
 * @method add_City
 * @description Request to add city to the database
 */
const add_City = ((id) => {
  data = {};
  data = { name: modal_Input_CityName.value };
  URL = '';
  URL = URL_CREATE_CITY;
  URL += `${id}`;
  request.create(URL, data).then((response) => {
    if (response.ok === true) {
      swal(`${response.title}`, `${response.detail}`, 'success');
      get_Regions();
    }
    else {
      swal(`${response.title}`, `${response.detail}`, 'error');
    }
  }).catch((error) => console.log({
    error: error
  }));
});

/**
 * @method delete_Region
 * @description Delete the selected region
 */
const delete_Region = ((id) => {
  URL = '';
  URL = URL_DELETE_REGION;
  URL += `${id}`;
  request.delete(URL).then((response) => {
    if (response.ok === true) {
      swal(`${response.title}`, `${response.detail}`, 'success');
      get_Regions();
    }
    else {
      swal(`${response.title}`, `${response.detail}`, 'error');
    }
  }).catch((error) => console.log({
    error: error
  }));
});

/**
 * Add event listener for modify region button
 */
modal_ModifyRegion_Btn.addEventListener('click', () => {
  if (modal_Input_Name.value === '') {
    swal("Error", "Faltan campos por completar.", "error");
  }
  else {
    modify_Region(id_Modify_Region);
    modal_Input_Name.value = '';
    $('#modal_Add_Region').modal('hide');
  }
});

/**
 * @method modify_Region
 * @description Request for creating a new region in the database
 */
const modify_Region = ((id) => {
  data = {};
  data = {
    name: modal_Input_Name.value
  }
  URL = '';
  URL = URL_MODIFY_REGION;
  URL += `${id}`;
  request.put(URL, data).then((response) => {
    if (response.ok === true) {
      swal(`${response.title}`, `${response.detail}`, 'success');
      get_Regions();
    }
    else {
      swal(`${response.title}`, `${response.detail}`, 'error');
    }
  }).catch((error) => console.log({
    error: error
  }));
});

/**
 * Add event listener for modify country button
 */
modal_ModifyCountry_Btn.addEventListener('click', () => {
  if (modal_Input_CountryName.value === '') {
    swal("Error", "Faltan campos por completar.", "error");
  }
  else {
    modify_Country(id_modify_Country);

    modal_Input_CountryName.value = '';
    $('#modal_Add_Country').modal('hide');
  }
});

/**
 * @method modify_Country
 * @description Request to the server to modify the country in the database
 */

const modify_Country = ((id) => {
  data = {};
  data = {
    name: modal_Input_CountryName.value
  }
  URL = '';
  URL = URL_MODIFY_COUNTRY;
  URL += `${id}`;
  request.put(URL, data).then((response) => {
    if (response.ok === true) {
      swal(`${response.title}`, `${response.detail}`, 'success');
      get_Regions();
    }
    else {
      swal(`${response.title}`, `${response.detail}`, 'error');
    }
  }).catch((error) => console.log({
    error: error
  }));
});

/**
 * Add event listener for modify city button
 */
modal_ModifyCity_Btn.addEventListener('click', () => {
  if (modal_Input_CityName.value === '') {
    swal("Error", "Faltan campos por completar.", "error");
  }
  else {
    modify_city(id_Modify_City);
    modal_Input_CityName.value = '';
    $('#modal_Add_Region').modal('hide');
  }
});

/**
 * @method modify_city
 * @description Request to the server to modify a city in the database
 */

const modify_city = ((id) => {
  data = {};
  data = {
    name: modal_Input_CityName.value
  }
  URL = '';
  URL = URL_MODIFY_CITY;
  URL += `${id}`;
  request.put(URL, data).then((response) => {
    if (response.ok === true) {
      swal(`${response.title}`, `${response.detail}`, 'success');
      get_Regions();
    }
    else {
      swal(`${response.title}`, `${response.detail}`, 'error');
    }
  }).catch((error) => console.log({
    error: error
  }));
});