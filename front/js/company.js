/**
 * Imports
 */
import request from './services.js';

/**
 * Global variables
 */
let data = {};
let id_Modify_Company;
let id_Delete_Company;
let admin_State = false;
const URL_GET_COMPANIES = 'http://localhost:3030/wareHouse/get/getCompanies/';
const URL_CREATE_COMPANY = 'http://localhost:3030/wareHouse/post/createCompany/';
const URL_GET_CITIES = 'http://localhost:3030/wareHouse/get/getCities/';
const URL_MODIFY_COMPANY = 'http://localhost:3030/wareHouse/put/company/';
const URL_DELETE_COMPANY = 'http://localhost:3030/wareHouse/delete/company/';
const URL_ADMIN_STATE = 'http://localhost:3030/wareHouse/get/adminState';

/**
 * DOM variables
 */
const companies_Table = document.querySelector('.companies_Table');
const modal_AddCompany_Btn = document.querySelector('.modal_AddCompany_Btn');
const modal_Input_CompanyName = document.querySelector('.modal_Input_CompanyName');
const modal_Input_CompanyAddress = document.querySelector('.modal_Input_CompanyAddress');
const modal_Input_CompanyEmail = document.querySelector('.modal_Input_CompanyEmail');
const modal_Input_CompanyTel = document.querySelector('.modal_Input_CompanyTel');
const select_City = document.querySelector('.select_City');
const select_Modify_City = document.querySelector('.select_Modify_City');
const add_Company_Btn = document.querySelector('.add_Company_Btn');
const modal_ModifyCompany_Btn = document.querySelector('.modal_ModifyCompany_Btn');
const companyModifyModal_Header_Text = document.querySelector('.companyModifyModal_Header_Text');
const modal_Input_CompanyModifyName = document.querySelector('.modal_Input_CompanyModifyName');
const modal_Input_CompanyModifyCity = document.querySelector('.modal_Input_CompanyModifyCity');
const modal_Input_CompanyModifyAddress = document.querySelector('.modal_Input_CompanyModifyAddress');
const modal_Input_CompanyModifyEmail = document.querySelector('.modal_Input_CompanyModifyEmail');
const modal_Input_CompanyModifyTel = document.querySelector('.modal_Input_CompanyModifyTel');
const logo = document.querySelector('.logo');
const user_Html_Link = document.querySelector('.user_Html_Link')

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
 * @method get_Companies
 * @description Get registered users in the database
 */

const get_Companies = () => {
    request.get(URL_GET_COMPANIES).then((response) => {
        fill_Company_Table(response.data)

    }).catch((error) => {
        console.log(error)
    });
};
get_Companies();
/**
* @method fill_Company_Table
* @description fill the table with companies information from the database
*/
const fill_Company_Table = ((data) => {
    while (companies_Table.firstChild) { companies_Table.removeChild(companies_Table.firstChild) }
    let listener_Modify_Companies = [];
    let listener_Delete_Companies = [];
    const table_body = document.createElement('tbody');
    const table_Header = document.createElement('tr');
    const row_Header_Name = document.createElement('th');
    row_Header_Name.textContent = 'Nombre';
    table_Header.appendChild(row_Header_Name);
    const row_Header_City = document.createElement('th');
    row_Header_City.textContent = 'Ciudad / País';
    table_Header.appendChild(row_Header_City);
    const row_Header_Address = document.createElement('th');
    row_Header_Address.textContent = 'Dirección';
    table_Header.appendChild(row_Header_Address);
    const row_Header_Email = document.createElement('th');
    row_Header_Email.textContent = 'Email';
    table_Header.appendChild(row_Header_Email);
    const row_Header_Tel = document.createElement('th');
    row_Header_Tel.textContent = 'Teléfono';
    table_Header.appendChild(row_Header_Tel);
    const row_Header_Actions = document.createElement('th');
    row_Header_Actions.textContent = 'Acciones';
    table_Header.appendChild(row_Header_Actions);
    table_body.appendChild(table_Header);
    companies_Table.appendChild(table_body);
    data.forEach((tableData) => {
        const row = document.createElement('tr');
        companies_Table.lastChild.appendChild(row);
        const company_Name = document.createElement('td');
        company_Name.textContent = tableData.name;
        row.appendChild(company_Name);
        const company_City = document.createElement('td');
        if (tableData.city !== null && tableData.city.country !== null) {
            company_City.innerHTML = `${tableData.city.name} / ${tableData.city.country.name}`;
        } else {
            company_City.innerHTML = 'No aplica'
        }
        row.appendChild(company_City);
        const company_Address = document.createElement('td');
        company_Address.innerHTML = tableData.address;
        row.appendChild(company_Address);
        const company_Email = document.createElement('td');
        company_Email.innerHTML = tableData.email;
        row.appendChild(company_Email);
        const company_telephone = document.createElement('td');
        company_telephone.innerHTML = tableData.telephone;
        row.appendChild(company_telephone);
        const company_Actions = document.createElement('td');
        const icon_Container = document.createElement('div');
        icon_Container.classList.add('icon_Container');
        const icon_Menu = document.createElement('i');
        icon_Menu.classList.add('fas', 'fa-ellipsis-h');
        icon_Container.appendChild(icon_Menu);
        const modify_Icon_Company = document.createElement('i');
        modify_Icon_Company.classList.add('fas', 'fa-pen');
        modify_Icon_Company.dataset.toggle = 'modal';
        modify_Icon_Company.dataset.target = '#modal_Modify_Company'
        icon_Container.appendChild(modify_Icon_Company);
        const delete_Icon_Company = document.createElement('i');
        delete_Icon_Company.classList.add('fas', 'fa-trash');
        icon_Container.appendChild(delete_Icon_Company);
        company_Actions.appendChild(icon_Container);
        row.appendChild(company_Actions);
        listener_Modify_Companies.push({ id: tableData.id, modify_Icon_Company: modify_Icon_Company, name: tableData.name });
        listener_Delete_Companies.push({ id: tableData.id, delete_Icon: delete_Icon_Company, name: tableData.name })
    });
    create_Modify_Company_Listeners(listener_Modify_Companies);
    create_Delete_Company_Listeners(listener_Delete_Companies);
});

/**
 * @method create_Modify_Company_Listeners
 * @description Add listeners to modify company icons
 */
const create_Modify_Company_Listeners = ((listeners) => {
    listeners.forEach((listener) => {
        listener.modify_Icon_Company.addEventListener('click', () => {
            id_Modify_Company = listener.id;
            companyModifyModal_Header_Text.innerHTML = `Ingresa los datos para modificar la compañia "${listener.name}"`;
            get_Cities_Modify();
        });
    });
});

/**
 * @method create_Delete_Company_Listeners
 * @description Add listeners to delete company icons
 */
const create_Delete_Company_Listeners = ((listeners) => {
    listeners.forEach((listener) => {
        listener.delete_Icon.addEventListener('click', () => {
            id_Delete_Company = listener.id;
            delete_Company(id_Delete_Company);
        });
    })
});

/**
 * @method delete_Company
 * @description request to the server to delete a company from the database
 */
const delete_Company = ((id) => {
    URL = '';
    URL = URL_DELETE_COMPANY;
    URL += `${id}`;
    request.delete(URL).then((response) => {
        if (response.ok === true) {
            swal(`${response.title}`, `${response.detail}`, 'success');
            get_Companies();
        }
        else {
            swal(`${response.title}`, `${response.detail}`, 'error');
        }
    }).catch((error) => console.log({
        error: error
    }));
});

/**
 * @method modify_Company
 * @description Modify company in the database
 */

const modify_Company = ((id_Company, id_City) => {
    data = {};
    data = {
        name: modal_Input_CompanyModifyName.value,
        address: modal_Input_CompanyModifyAddress.value,
        email: modal_Input_CompanyModifyEmail.value,
        telephone: modal_Input_CompanyModifyTel.value
    }
    URL = '';
    URL = URL_MODIFY_COMPANY;
    URL += `${id_Company}/${id_City}`;
    request.put(URL, data).then((response) => {
        if (response.ok === true) {
            swal(`${response.title}`, `${response.detail}`, 'success');
            get_Companies();
        }
        else {
            swal(`${response.title}`, `${response.detail}`, 'error');
        }
    }).catch((error) => console.log({
        error: error
    }));
});

/**
 * Add event listener to the button in the modify modal
 */
modal_ModifyCompany_Btn.addEventListener('click', () => {
    if (modal_Input_CompanyModifyName.value === '') {
        swal("Error", "No ingresaste el nombre de la compañia.", "error");
    }
    else if (select_Modify_City.value === '') {
        swal("Error", "No ingresaste la ciudad de la compañia.", "error");
    }
    else if (modal_Input_CompanyModifyAddress.value === '') {
        swal("Error", "No ingresaste la dirección de la compañia.", "error");
    }
    else if (modal_Input_CompanyModifyEmail.value === '') {
        swal("Error", "No ingresaste el email de la compañia.", "error");
    }
    else if (modal_Input_CompanyModifyTel.value === '') {
        swal("Error", "No ingresaste el teléfono de la compañia.", "error");
    }
    else {
        modify_Company(id_Modify_Company, select_Modify_City.value);
        modal_Input_CompanyModifyName.value = '';
        modal_Input_CompanyModifyAddress.value = '';
        modal_Input_CompanyModifyEmail.value = '';
        modal_Input_CompanyModifyTel.value = '';
        $('#modal_Modify_Company').modal('hide');
        get_Companies();
    }
});

/**
 * Add event listener to the button in the modal for adding a company
 */
modal_AddCompany_Btn.addEventListener('click', () => {
    if (modal_Input_CompanyName.value === '') {
        swal("Error", "No ingresaste el nombre de la compañia.", "error");
    }
    else if (select_City.value === '') {
        swal("Error", "No ingresaste la ciudad de la compañia.", "error");
    }
    else if (modal_Input_CompanyAddress.value === '') {
        swal("Error", "No ingresaste la dirección de la compañia.", "error");
    }
    else if (modal_Input_CompanyEmail.value === '') {
        swal("Error", "No ingresaste el email de la compañia.", "error");
    }
    else if (modal_Input_CompanyTel.value === '') {
        swal("Error", "No ingresaste el teléfono de la compañia.", "error");
    }
    else {
        add_Company(select_City.value);
        modal_Input_CompanyName.value = '';
        modal_Input_CompanyAddress.value = '';
        modal_Input_CompanyEmail.value = '';
        modal_Input_CompanyTel.value = '';
        $('#modal_Add_Company').modal('hide');
        get_Companies();

    }
});

/**
 * Add event Listener to the button for adding a company
 */
add_Company_Btn.addEventListener('click', () => {
    $('#modal_Add_Company').modal('show');
    get_Cities();
});

/**
 * @method get_Cities
 * @description Request get to the server to bring the avaiable cities to be chosen 
 */
const get_Cities = () => {
    request.get(URL_GET_CITIES).then((response) => {
        fill_Select_Options(response.data)

    }).catch((error) => {
        console.log(error)
    });
};

/**
 * @method get_Cities_Modify
 * @description Request get to the server to bring the avaibale cities to be chosen in the modify modal
 */
const get_Cities_Modify = (() => {
    request.get(URL_GET_CITIES).then((response) => {
        fill_Select_Options_Modify(response.data)

    }).catch((error) => {
        console.log(error)
    });
});

/**
 * @method fill_Select_Options_Modify
 * @description Create the options of the select tag in modify modal
 */
const fill_Select_Options_Modify = ((data) => {
    while (select_Modify_City.firstChild) { select_Modify_City.removeChild(select_Modify_City.firstChild) };
    const option_Tag_Disabled = document.createElement('option');
    option_Tag_Disabled.innerHTML = 'Modifica la ciudad de origen';
    option_Tag_Disabled.disabled = true;
    option_Tag_Disabled.selected = true;
    option_Tag_Disabled.value = '';
    select_Modify_City.appendChild(option_Tag_Disabled);
    data.forEach((city) => {
        const option_Tag_Value = document.createElement('option');
        option_Tag_Value.innerHTML = `${city.name} / ${city.country.name}`;
        option_Tag_Value.value = city.id;
        select_Modify_City.appendChild(option_Tag_Value);
    });
});

/**
 * @method fill_Select_Options
 * @description Create the options of the select tag
 */
const fill_Select_Options = ((data) => {
    console.log(data)
    while (select_City.firstChild) { select_City.removeChild(select_City.firstChild) };
    const option_Tag_Disabled = document.createElement('option');
    option_Tag_Disabled.innerHTML = 'Escoge la ciudad de origen';
    option_Tag_Disabled.disabled = true;
    option_Tag_Disabled.selected = true;
    option_Tag_Disabled.value = '';
    select_City.appendChild(option_Tag_Disabled);
    data.forEach((city) => {
        if (city !== null && city.country !== null) {
            const option_Tag_Value = document.createElement('option');
            option_Tag_Value.innerHTML = `${city.name} / ${city.country.name}`;
            select_City.appendChild(option_Tag_Value);
            option_Tag_Value.value = city.id;
        }
    })
});

/**
 * @method add_Company
 * @description Create a company in the database
 */

const add_Company = ((id) => {
    data = {};
    data = { name: modal_Input_CompanyName.value, address: modal_Input_CompanyAddress.value, email: modal_Input_CompanyTel.value, telephone: modal_Input_CompanyTel.value };
    URL = '';
    URL = URL_CREATE_COMPANY;
    URL += `${id}`;
    request.create(URL, data).then((response) => {
        if (response.ok === true) {
            swal(`${response.title}`, `${response.detail}`, 'success');
            get_Companies();
        }
        else {
            swal(`${response.title}`, `${response.detail}`, 'error');
        }
    }).catch((error) => console.log({
        error: error
    }));
});

