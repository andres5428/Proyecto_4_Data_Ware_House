/**
 * Imports
 */
import request from './services.js';

/**
 * Global variables
 */
let expr = 0;
let data = {};
let modify_Id_Contact;
let delete_Name_Contact;
let delete_Id_Contact;
let checkbox_Array = {};
let admin_State = false;
const URL_CREATE_CONTACT = 'http://localhost:3030/wareHouse/post/createContact/';
const URL_GET_COMPANIES = 'http://localhost:3030/wareHouse/get/getCompanies/';
const URL_GET_REGIONS = 'http://localhost:3030/wareHouse/get/getRegions';
const URL_GET_SPECIFIC_REGION = 'http://localhost:3030/wareHouse/get/region/';
const URL_GET_SPECIFIC_COUNTRY = 'http://localhost:3030/wareHouse/get/country/';
const URL_GET_CONTACTS = 'http://localhost:3030/wareHouse/get/getContacts';
const URL_MODIFY_CONTACTS = 'http://localhost:3030/wareHouse/put/contact/';
const URL_DELETE_CONTACTS = 'http://localhost:3030/wareHouse/delete/contact/';
const URL_SEARCH_CONTACTS = 'http://localhost:3030/wareHouse/post/postFilteredContacts';
const URL_ASCENDING_CONTACTS = 'http://localhost:3030/wareHouse/get/ASC_Contacts';
const URL_DESCENDING_CONTACTS = 'http://localhost:3030/wareHouse/get/DESC_Contacts';
const URL_ADMIN_STATE = 'http://localhost:3030/wareHouse/get/adminState';
const URL_EXPORT_CONTACTS = 'http://localhost:3030/api/excel/wareHouse/excel/get/contacts';


/**
 * DOM variables
 */
const input_ContactName = document.querySelector('.input_ContactName');
const input_ContactLastName = document.querySelector('.input_ContactLastName');
const input_ContactPosition = document.querySelector('.input_ContactPosition');
const input_ContactEmail = document.querySelector('.input_ContactEmail');
const contact_Company_Select = document.querySelector('.contact_Company_Select');
const contact_Region_Select = document.querySelector('.contact_Region_Select');
const contact_Country_Select = document.querySelector('.contact_Country_Select');
const contact_City_Select = document.querySelector('.contact_City_Select');
const input_Contact_Address = document.querySelector('.input_Contact_Address');
const interest_Bar = document.querySelector('.interest_Bar');
const contact_Interest_Select = document.querySelector('.contact_Interest_Select');
const input_ContactChannel_Select = document.querySelector('.input_ContactChannel_Select');
const input_ContactAccount = document.querySelector('.input_ContactAccount');
const contact_Preference_Select = document.querySelector('.contact_Preference_Select');
const modal_AddContact_Btn = document.querySelector('.modal_AddContact_Btn');
const add_Contact_Btn = document.querySelector('.add_Contact_Btn');
const label_Account = document.querySelector('.label_Account');
const contact_Table = document.querySelector('.contact_Table');
const modal_DeleteConfirm_Accept = document.querySelector('.modal_DeleteConfirm_Accept');
const Img_CreateContact = document.querySelector('.Img_CreateContact');
const modal_ModifyContact_Btn = document.querySelector('.modal_ModifyContact_Btn');
const contactModal_Header_Text = document.querySelector('.contactModal_Header_Text');
const input_Contact_Search = document.querySelector('.input_Contact_Search');
const Search_Btn = document.querySelector('.Search_Btn');
const Refresh_Search_Btn = document.querySelector('.Refresh_Btn');
const contacts_Section_Container = document.querySelector('.contacts_Section_Container');
const Delete_Selected_Container = document.querySelector('.Delete_Selected_Container');
const Delete_Selected_Contacts_Btn = document.querySelector('.Delete_Selected_Contacts_Btn');
const number_Selected_Contacts = document.querySelector('.number_Selected_Contacts');
const row_Page = document.querySelector('.row_Page');
const btn_Page_Left = document.querySelector('.btn_Page_Left');
const btn_Page_Right = document.querySelector('.btn_Page_Right');
const label_Paging = document.querySelector('.label_Paging');
const logo = document.querySelector('.logo');
const btn_Export_Contacts = document.querySelector('.btn_Export_Contacts');
const image_Result = document.querySelector('#imageResult');

/**
 * Add event listener to export contacts button
 */
btn_Export_Contacts.addEventListener('click', () => {
    Export_Contacts();
});

/**
 * @method Export_Contacts
 * @description Request to export contacts to excel file
 */
const Export_Contacts = (() => {
    const anchor = document.createElement('a');
    anchor.setAttribute('download', 'contacts.xlsx');
    anchor.href = URL_EXPORT_CONTACTS;
    anchor.click(); // Simular un click
});

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
 * Add event listener to search button
 */
if (Search_Btn !== null) {
    Search_Btn.addEventListener('click', () => {
        contact_Search();
    });
}


/**
 * Add event listener to refresh search button
 */
if (Refresh_Search_Btn !== null) {
    Refresh_Search_Btn.addEventListener('click', () => {
        get_Contacts();
        input_Contact_Search.value = '';
    });
}


/**
 * @method contact_Search
 * @description Request to the server to bring the filtered contacts
 */
const contact_Search = (() => {
    data = {};
    data = {
        search: input_Contact_Search.value
    }
    request.create(URL_SEARCH_CONTACTS, data).then((response) => {
        if (response.ok === true) {
            let view_Index = 0;
            print_Contacts(response.data,view_Index);
            console.log(response)
        }
    }).catch((error) => console.log({
        error: error
    }));
});

/**
 * Add event listener to add contact button
 */
if (add_Contact_Btn !== null) {
    add_Contact_Btn.addEventListener('click', () => {
        if (modal_AddContact_Btn.className === 'btn btn-primary modal_AddContact_Btn modal_AddContact_Btn--hidden') {
            modal_AddContact_Btn.classList.toggle('modal_AddContact_Btn--hidden');
        }
        if (modal_ModifyContact_Btn.className === 'btn btn-primary modal_ModifyContact_Btn') {
            modal_ModifyContact_Btn.classList.toggle('modal_ModifyContact_Btn--hidden');
        }
        contactModal_Header_Text.innerHTML = 'Ingresa los datos para agregar un nuevo contacto';
        input_ContactName.value = '';
        input_ContactLastName.value = '';
        input_ContactPosition.value = '';
        input_ContactEmail.value = '';
        contact_Company_Select.value = '';
        contact_Region_Select.value = '';
        contact_Country_Select.value = '';
        contact_City_Select.value = '';
        input_Contact_Address.value = '';
        input_ContactAccount.value = '';
        contact_Country_Select.disabled = true;
        contact_City_Select.disabled = true;
        get_Companies_CreateContact();
        get_Regions_CreateContact();
        $("#progress_Bar_Modal").css("width", `0%`);
    });
}


/**
 * Add event listener to select of interest in add contact modal
 */
if (contact_Interest_Select !== null) {
    contact_Interest_Select.addEventListener('change', () => {
        $(function () {
            $("#progress_Bar_Modal").css("width", `${contact_Interest_Select.value}%`);
            interest_Bar.innerHTML = `${contact_Interest_Select.value}%`;
            if (contact_Interest_Select.value === '25') {
                $("#progress_Bar_Modal").css("background-color", '#1CC1F5');
            }
            if (contact_Interest_Select.value === '50') {
                $("#progress_Bar_Modal").css("background-color", '#FFC700');
            }
            if (contact_Interest_Select.value === '75') {
                $("#progress_Bar_Modal").css("background-color", '#FF6F00');
            }
            if (contact_Interest_Select.value === '100') {
                $("#progress_Bar_Modal").css("background-color", '#DE0028');
            }
        });
    });
}


/**
 * Add event listener to select of preference in add contact modal
 */
if (input_ContactChannel_Select !== null) {
    input_ContactChannel_Select.addEventListener('change', () => {
        if (input_ContactChannel_Select.value === 'No') {
            input_ContactAccount.disabled = true;
        }
        else {
            input_ContactAccount.disabled = false;
            label_Account.innerHTML = `Ingresar ${input_ContactChannel_Select.value}`;
        }

    });
}


/**
 * @method get_Contacts
 * @description request to the server to bring all the contacts from the database
 */
const get_Contacts = (() => {
    request.get(URL_GET_CONTACTS).then((response) => {
        let view_Index = 0;
        print_Contacts(response.data, view_Index);
    }).catch((error) => {
        console.log(error);
    });
});
get_Contacts();

/**
 * @method change_ProgressBar_Width
 * @description Change progress bar width according to the interest value in the database
 */
const change_ProgressBar_Width = ((progressBar, widthValue) => {
    $(function () {
        if (widthValue === '25') {
            $(`#${progressBar}`).css("background-color", '#1CC1F5');
        }
        if (widthValue === '50') {
            $(`#${progressBar}`).css("background-color", '#FFC700');
        }
        if (widthValue === '75') {
            $(`#${progressBar}`).css("background-color", '#FF6F00');
        }
        if (widthValue === '100') {
            $(`#${progressBar}`).css("background-color", '#DE0028');
        }
        $(`#${progressBar}`).css("width", `${widthValue}%`);
    });
});

/**
 * @method print_Contacts
 * @description Print the contacts brought from the database
 */
const print_Contacts = ((data, view_Index) => {
    while (contact_Table.firstChild) { contact_Table.removeChild(contact_Table.firstChild) };
    let listener_Delete_Contact = [];
    let listener_Modify_Contact = [];
    let listener_Checkbox_All = [];
    let listener_Sort_Icon = [];
    const table_Body = document.createElement('tbody');
    table_Body.classList.add('contact_TableBody');
    const table_Header = document.createElement('tr');
    table_Body.appendChild(table_Header);
    const row_Header_Checkbox = document.createElement('th');
    const input_Header_Checkbox = document.createElement('input');
    input_Header_Checkbox.type = 'checkbox';
    input_Header_Checkbox.classList.add('checkbox_All');
    listener_Checkbox_All.push({ checkbox: input_Header_Checkbox });
    row_Header_Checkbox.appendChild(input_Header_Checkbox);
    table_Header.appendChild(row_Header_Checkbox);
    const row_Header_Contact = document.createElement('th');
    row_Header_Contact.classList.add('contactName_Th');
    row_Header_Contact.innerHTML = 'Contacto';
    const i_Sort_Contact = document.createElement('i');
    i_Sort_Contact.classList.add('fas', 'fa-sort')
    i_Sort_Contact.value = 'name';
    row_Header_Contact.appendChild(i_Sort_Contact);
    table_Header.appendChild(row_Header_Contact);
    const row_Header_Region = document.createElement('th');
    row_Header_Region.innerHTML = 'País/Region';
    const i_Sort_Region = document.createElement('i');
    i_Sort_Region.classList.add('fas', 'fa-sort')
    i_Sort_Region.value = 'cityId';
    row_Header_Region.appendChild(i_Sort_Region);
    table_Header.appendChild(row_Header_Region);
    const row_Header_Company = document.createElement('th');
    row_Header_Company.innerHTML = 'Compañia';
    const i_Sort_Company = document.createElement('i');
    i_Sort_Company.classList.add('fas', 'fa-sort')
    i_Sort_Company.value = 'companyId';
    row_Header_Company.appendChild(i_Sort_Company);
    table_Header.appendChild(row_Header_Company);
    const row_Header_Position = document.createElement('th');
    row_Header_Position.innerHTML = 'Cargo';
    const i_Sort_Position = document.createElement('i');
    i_Sort_Position.classList.add('fas', 'fa-sort')
    i_Sort_Position.value = 'position';
    row_Header_Position.appendChild(i_Sort_Position);
    table_Header.appendChild(row_Header_Position);
    const row_Header_Channel = document.createElement('th');
    row_Header_Channel.innerHTML = 'Canal Preferido';
    table_Header.appendChild(row_Header_Channel);
    const row_Header_Interest = document.createElement('th');
    row_Header_Interest.innerHTML = 'Interes';
    const i_Sort_Interest = document.createElement('i');
    i_Sort_Interest.classList.add('fas', 'fa-sort')
    i_Sort_Interest.value = 'interest';
    row_Header_Interest.appendChild(i_Sort_Interest);
    table_Header.appendChild(row_Header_Interest);
    const row_Header_Actions = document.createElement('th');
    row_Header_Actions.innerHTML = 'Acciones';
    table_Header.appendChild(row_Header_Actions);
    contact_Table.appendChild(table_Body);
    listener_Sort_Icon.push({ icon: [i_Sort_Contact, i_Sort_Region, i_Sort_Company, i_Sort_Position, i_Sort_Interest] });
    const contacts_Divided_Array = data.slice(view_Index, view_Index + 10);
    contacts_Divided_Array.forEach((contact, index) => {
        label_Paging.innerHTML = `${view_Index + 1}-${contacts_Divided_Array.length} de ${data.length} filas`;
        const row = document.createElement('tr');
        contact_Table.lastChild.appendChild(row);
        const input_Checkbox_Td = document.createElement('td');
        const input_Checkbox = document.createElement('input');
        input_Checkbox.type = 'checkbox';
        input_Checkbox.name = 'selected_Contact';
        input_Checkbox.value = contact.id;
        add_Event_Checkbox(input_Checkbox, input_Checkbox.name, row);
        input_Checkbox_Td.appendChild(input_Checkbox);
        row.appendChild(input_Checkbox_Td);
        const div_Contact_Img = document.createElement('div');
        div_Contact_Img.classList.add('div_Contact_Img');
        const img_Contact = document.createElement('img');
        img_Contact.classList.add('contact_Img');
        div_Contact_Img.appendChild(img_Contact);
        const contact_Name_Td = document.createElement('td');
        contact_Name_Td.classList.add('contact_Name_Td');
        const label_Contact_Name = document.createElement('label');
        label_Contact_Name.innerHTML = `${contact.name} ${contact.lastname}`;
        contact_Name_Td.appendChild(div_Contact_Img);
        contact_Name_Td.appendChild(label_Contact_Name);
        if (contact.image !== null) {
            img_Contact.src = contact.image;
        }
        else {
            img_Contact.src = '../resources/1200px-Google_Contacts_icon.svg.png';
        }
        row.appendChild(contact_Name_Td);
        const contact_Region_Td = document.createElement('td');
        if (contact.city !== null && contact.city !== null && contact.city.country !==null && contact.city.country.region!==null) {
            contact_Region_Td.innerHTML = `${contact.city.country.name}/${contact.city.country.region.name}`;
        } else {
            contact_Region_Td.innerHTML = `No aplica`;
        }
        row.appendChild(contact_Region_Td);
        const contact_Company_Td = document.createElement('td');
        if (contact.company !== null) {
            contact_Company_Td.innerHTML = contact.company.name;
        } else {
            contact_Company_Td.innerHTML = 'No aplica';
        }
        row.appendChild(contact_Company_Td);
        const contact_Position_Td = document.createElement('td');
        contact_Position_Td.innerHTML = contact.position;
        row.appendChild(contact_Position_Td);
        const contact_Channel_Td = document.createElement('td');
        if (contact.channel === '') {
            contact_Channel_Td.innerHTML = 'No aplica';
        }
        else {
            contact_Channel_Td.innerHTML = contact.channel;
        }
        row.appendChild(contact_Channel_Td);
        const contact_Interest_Td = document.createElement('td');
        const div_Progress_Container = document.createElement('div');
        div_Progress_Container.classList.add('progress');
        const div_Progress = document.createElement('div');
        div_Progress.classList.add('progress-bar', `interest_Bar`);
        div_Progress.id = `interest_Bar${index}`;
        div_Progress_Container.appendChild(div_Progress);
        div_Progress.setAttribute('role', 'progressbar');
        div_Progress.setAttribute('aria-valuemin', '0');
        div_Progress.setAttribute('aria-valuemax', '100');
        div_Progress.setAttribute('width', `${contact.interest}%`)
        change_ProgressBar_Width(div_Progress.id, contact.interest)
        div_Progress.setAttribute('aria-valuenow', `${contact.interest}`);
        div_Progress.innerHTML = `${contact.interest}%`;
        contact_Interest_Td.appendChild(div_Progress_Container);
        row.appendChild(contact_Interest_Td);
        const contact_Action_Td = document.createElement('td');
        const icon_Container = document.createElement('div');
        icon_Container.classList.add('icon_Container');
        const icon_Menu = document.createElement('i');
        icon_Menu.classList.add('fas', 'fa-ellipsis-h');
        icon_Container.appendChild(icon_Menu);
        const modify_Icon_Contact = document.createElement('i');
        modify_Icon_Contact.classList.add('fas', 'fa-pen');
        modify_Icon_Contact.dataset.toggle = 'modal';
        modify_Icon_Contact.dataset.target = '#modal_Add_Contact';
        icon_Container.appendChild(modify_Icon_Contact);
        const delete_Icon_Contact = document.createElement('i');
        delete_Icon_Contact.classList.add('fas', 'fa-trash');
        delete_Icon_Contact.dataset.toggle = 'modal';
        delete_Icon_Contact.dataset.target = '#modal_Delete_Confirm';
        icon_Container.appendChild(delete_Icon_Contact);
        contact_Action_Td.appendChild(icon_Container);
        row.appendChild(contact_Action_Td);
        listener_Delete_Contact.push({ id: contact.id, delete_Icon: delete_Icon_Contact, name: contact.name });
        listener_Modify_Contact.push({ id: contact.id, modify_Icon: modify_Icon_Contact, name: contact.name });
    });
    create_Modify_Contact(listener_Modify_Contact);
    create_Delete_Contact(listener_Delete_Contact);
    create_Checkbox_Listener(listener_Checkbox_All);
    create_Sort_Listener(listener_Sort_Icon); // Función que realice la petición a los nuevos endpoints ordenados
    view_Index += 10;
    if (data.length >= 10 && view_Index < data.length) {
        btn_Page_Right.addEventListener("click", () => {
            print_Contacts(data, view_Index);
            label_Paging.innerHTML = `${view_Index + 1}-${data.length + view_Index - contacts_Divided_Array.length} de ${data.length} filas`;
        });
        btn_Page_Left.addEventListener('click', () => {
            print_Contacts(data, view_Index - 10);
        })
    }
});

/**
 * @method create_Sort_Listener
 * @description Listener for sorting icons
 */
const create_Sort_Listener = ((listeners) => {
    listeners.forEach((listener) => {
        listener.icon.forEach((icon) => {
            icon.addEventListener('click', () => {
                get_Ordered_Contacts(icon.value);
            });
        });
    });
});

/**
 * @method get_Ordered_Contacts
 * @description request to the server to bring the ordered contacts
 */
const get_Ordered_Contacts = ((value) => {
    let view_Index = 0
    switch (expr) {
        case 0:
            data = {};
            data = { column: value }
            request.create(URL_ASCENDING_CONTACTS, data).then((response) => {
                expr += 1;
                print_Contacts(response.data, view_Index);
            }).catch((error) => {
                console.log(error);
            });
            break;
        case 1:
            data = {};
            data = { column: value }
            request.create(URL_DESCENDING_CONTACTS, data).then((response) => {
                expr -= 1;
                print_Contacts(response.data, view_Index);
            }).catch((error) => {
                console.log(error);
            });
            break;
        default:
            break;
    }

});

/**
 * @method create_Checkbox_Listener
 * @description Create listener to checkbox header
 */
const create_Checkbox_Listener = ((listeners) => {
    listeners.forEach((listener) => {
        listener.checkbox.addEventListener('click', () => {
            check_All_Boxes();
        });
    });
});

/**
 * Add event listener to delete selected contacts button
 */
if (Delete_Selected_Contacts_Btn !== null) {
    Delete_Selected_Contacts_Btn.addEventListener('click', () => {
        const selected = checkbox_Array.selected;
        checkbox_Array.values.forEach((contactId) => {
            delete_Contact(contactId, selected);
        });
    });
}


/**
 * @method add_Event_Checkbox
 * @description Add event listener to every checkbox in the contact row and store the contact id
 */
const add_Event_Checkbox = ((checkbox, name, row) => {
    checkbox.addEventListener('click', () => {
        checkbox_Array = {};
        const id_Checkbox_Array = get_Checkbox_Values(name);
        checkbox_Array = { values: id_Checkbox_Array, selected: true };
        row.classList.toggle('tr_Selected')
        if (anyCheckbox(name) === true) {
            if (Delete_Selected_Container.className === 'Delete_Selected_Container Delete_Selected_Container--hidden') {
                Delete_Selected_Container.classList.toggle('Delete_Selected_Container--hidden')
            }
        }
        else {
            if (Delete_Selected_Container.className === 'Delete_Selected_Container') {
                Delete_Selected_Container.classList.toggle('Delete_Selected_Container--hidden')
            }
        }
    });
});

/**
 * @method anyCheckbox
 * @description Returns true if a checkbox is "checked" else return false
 */
const anyCheckbox = (name) => {
    var inputElements = document.querySelectorAll(`input[name="${name}"]`);
    for (var i = 0; i < inputElements.length; i++)
        if (inputElements[i].type == "checkbox")
            if (inputElements[i].checked)
                return true;
    return false;
}
/**
 * @method get_Checkbox_Values
 * @description Return the values of every checkbox in the contact row
 */
const get_Checkbox_Values = ((name) => {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    let values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value);
        number_Selected_Contacts.innerHTML = `${values.length} Seleccionados`;
    });
    return values;
});

/**
 * @method check_All_Boxes 
 * @description Checked = true in all row contact checkboxes
 */
const check_All_Boxes = (() => {
    const checkboxes = document.querySelectorAll('input[name = "selected_Contact"]');
    checkboxes.forEach((cb) => {
        if (cb.checked === true) {
            cb.checked = false;
            if (anyCheckbox('selected_Contact') === true) {
                if (Delete_Selected_Container.className === 'Delete_Selected_Container Delete_Selected_Container--hidden') {
                    Delete_Selected_Container.classList.toggle('Delete_Selected_Container--hidden')
                }
            }
            else {
                if (Delete_Selected_Container.className === 'Delete_Selected_Container') {
                    Delete_Selected_Container.classList.toggle('Delete_Selected_Container--hidden')
                }
            }
        }
        else {
            cb.checked = true;
            get_Checkbox_Values('selected_Contact');
            if (anyCheckbox('selected_Contact') === true) {
                if (Delete_Selected_Container.className === 'Delete_Selected_Container Delete_Selected_Container--hidden') {
                    Delete_Selected_Container.classList.toggle('Delete_Selected_Container--hidden')
                }
            }
            else {
                if (Delete_Selected_Container.className === 'Delete_Selected_Container') {
                    Delete_Selected_Container.classList.toggle('Delete_Selected_Container--hidden')
                }
            }
        }

    });
});

// /**
//  * 
//  */
// checkbox_All.addEventListener('click', () => {
//     // check_All_Boxes();
// })

/**
 * @method create_Modify_Contact
 * @description Create listeners for all the modify contact icons
 */
const create_Modify_Contact = ((listeners) => {
    listeners.forEach((listener) => {
        listener.modify_Icon.addEventListener('click', () => {
            get_Regions_CreateContact();
            get_Companies_CreateContact();
            if (modal_ModifyContact_Btn.className === 'btn btn-primary modal_ModifyContact_Btn modal_ModifyContact_Btn--hidden') {
                modal_ModifyContact_Btn.classList.toggle('modal_ModifyContact_Btn--hidden');
            }
            if (modal_AddContact_Btn.className === 'btn btn-primary modal_AddContact_Btn') {
                modal_AddContact_Btn.classList.toggle('modal_AddContact_Btn--hidden');
            }
            contactModal_Header_Text.innerHTML = `Ingresa los datos para modificar el contacto "${listener.name}"`;
            modify_Id_Contact = listener.id;
        });
    });
});

/**
 * @method create_Delete_Contact
 * @description Create listeners for all the delete contact icons
 */
const create_Delete_Contact = ((listeners) => {
    listeners.forEach((listener) => {
        listener.delete_Icon.addEventListener('click', () => {
            delete_Id_Contact = listener.id;
            delete_Name_Contact = listener.name;
        });
    });
});

/**
 * @method delete_Contact
 * @description Delete contact from the database
 */
const delete_Contact = ((id, selected) => {
    URL = '';
    URL = URL_DELETE_CONTACTS;
    URL += `${id}`;
    request.delete(URL).then((response) => {
        if (response.ok === true) {
            if (selected !== true) {
                swal(`${response.title}`, `${response.detail}`, 'success');
                get_Contacts();
            }
            else {
                swal(`Petición aceptada`, `Los contactos seleccionados han sido eliminados`, 'success');
                get_Contacts();
            }
        }
        else {
            swal(`${response.title}`, `${response.detail}`, 'error');
        }
    }).catch((error) => console.log({
        error: error
    }));
});

/**
 * Add event listener to accept contact delete button
 */
if (modal_DeleteConfirm_Accept !== null) {
    modal_DeleteConfirm_Accept.addEventListener('click', () => {
        delete_Contact(delete_Id_Contact);
        $('#modal_Delete_Confirm').modal('hide');
    });
}


/**
 * @method get_Regions_CreateContact
 * @description Request to the server to bring the regions from the database
 */
const get_Regions_CreateContact = (() => {
    request.get(URL_GET_REGIONS).then((response) => {
        print_Regions_CreateContact(response.data);
    });
});

/**
 * @method print_Regions_CreateContact
 * @description Print all the regions in the create contact modal
 */
const print_Regions_CreateContact = ((data) => {
    while (contact_Region_Select.firstChild) { contact_Region_Select.removeChild(contact_Region_Select.firstChild) };
    // while (country_Region_Select_Search.firstChild) {country_Region_Select_Search.removeChild(country_Region_Select_Search.firstChild)};
    const option_Header = document.createElement('option');
    option_Header.innerHTML = 'Elige una región';
    option_Header.disabled = true;
    option_Header.selected = true;
    contact_Region_Select.appendChild(option_Header);
    // country_Region_Select_Search.appendChild(option_Header);
    data.forEach((region) => {
        const option_Region = document.createElement('option');
        option_Region.innerHTML = region.name;
        option_Region.value = region.id;
        contact_Region_Select.appendChild(option_Region);
        // country_Region_Select_Search.appendChild(option_Region_Search);
    });
});

/**
 * Add event listener to region_Select for changing the countries in country_Select
 */
if (contact_Region_Select !== null) {
    contact_Region_Select.addEventListener('change', () => {
        get_Specific_Region(contact_Region_Select.value);
    });

}


/**
 * @method get_Specific_Region
 * @description Get the specific region to bring its countries
 */
const get_Specific_Region = ((id) => {
    URL = '';
    URL = URL_GET_SPECIFIC_REGION;
    URL += `${id}`;
    request.get(URL).then((response) => {
        print_Countries_Create_Contact(response.data);
        contact_Country_Select.disabled = false;
    }).catch((error) => console.log({
        error: error
    }));
});

/**
 * @method print_Countries_Create_Contact
 * @description Print all the countries depending of the region
 */
const print_Countries_Create_Contact = ((data) => {
    while (contact_Country_Select.firstChild) { contact_Country_Select.removeChild(contact_Country_Select.firstChild) };
    const option_Header = document.createElement('option');
    option_Header.innerHTML = 'Elige un país';
    option_Header.disabled = true;
    option_Header.selected = true;
    contact_Country_Select.appendChild(option_Header);
    data.countries.forEach((country) => {
        const option_country = document.createElement('option');
        option_country.innerHTML = country.name;
        option_country.value = country.id;
        contact_Country_Select.appendChild(option_country);
    });
});

/**
 * Add event listener to region_Select for changing the countries in country_Select
 */
if (contact_Country_Select !== null) {
    contact_Country_Select.addEventListener('change', () => {
        get_Specific_Country(contact_Country_Select.value);
    });
}


/**
 * @method get_Specific_Country
 * @description Gets the specific country to bring its cities
 */
const get_Specific_Country = ((id) => {
    URL = '';
    URL = URL_GET_SPECIFIC_COUNTRY;
    URL += `${id}`;
    request.get(URL).then((response) => {
        print_Cities_Create_Contact(response.data);
        contact_City_Select.disabled = false;
    });
});

/**
 * @method print_Cities_Create_Contact
 * @description Print all the cities depending of the country
 */
const print_Cities_Create_Contact = ((data) => {
    while (contact_City_Select.firstChild) { contact_City_Select.removeChild(contact_City_Select.firstChild) };
    const option_Header = document.createElement('option');
    option_Header.innerHTML = 'Elige una ciudad';
    option_Header.disabled = true;
    option_Header.selected = true;
    contact_City_Select.appendChild(option_Header);
    data.cities.forEach((city) => {
        const option_City = document.createElement('option');
        option_City.innerHTML = city.name;
        option_City.value = city.id;
        contact_City_Select.appendChild(option_City);
    });
});

/**
 * @method get_Companies_CreateContact
 * @description Request to the server to bring the companies from the database
 */
const get_Companies_CreateContact = (() => {
    request.get(URL_GET_COMPANIES).then((response) => {
        print_Companies_CreateContact(response.data);
    }).catch((error) => {
        console.log(error);
    });
});

/**
 * @method print_Companies_CreateContact
 * @description Print all the companies in the create contact modal
 */
const print_Companies_CreateContact = ((data) => {
    while (contact_Company_Select.firstChild) { contact_Company_Select.removeChild(contact_Company_Select.firstChild) };
    const option_Header = document.createElement('option');
    option_Header.innerHTML = 'Elige una compañia';
    option_Header.disabled = true;
    option_Header.selected = true;
    contact_Company_Select.appendChild(option_Header);
    data.forEach((company) => {
        const option_Company = document.createElement('option');
        option_Company.innerHTML = company.name;
        option_Company.value = company.id;
        contact_Company_Select.appendChild(option_Company);
    });
});

/**
 * Add event listener to modal modify contact button
 */
if (modal_ModifyContact_Btn !== null) {
    modal_ModifyContact_Btn.addEventListener('click', () => {
        if (input_ContactName.value === '') {
            swal("Error", "No ingresaste el nombre del contact.", "error");
        }
        else if (input_ContactLastName.value === '') {
            swal("Error", "No ingresaste el apellido del contacto.", "error");
        }
        else if (input_ContactPosition.value === '') {
            swal("Error", "No ingresaste el cargo del contacto.", "error");
        }
        else if (input_ContactEmail.value === '') {
            swal("Error", "No ingresaste el email del contacto.", "error");
        }
        else if (contact_Company_Select.value === '') {
            swal("Error", "No ingresaste la compañia del contacto.", "error");
        }
        else if (contact_Region_Select.value === '') {
            swal("Error", "No ingresaste la región del contacto", "error");
        }
        else if (contact_Country_Select.value === '') {
            swal("Error", "No ingresaste el país del contacto.", "error");
        }
        else if (contact_City_Select.value === '') {
            swal("Error", "No ingresaste la ciudad del contacto.", "error");
        }
        else if (input_Contact_Address.value === '') {
            swal("Error", "No ingresaste la dirección del contacto.", "error");
        }
        else if (input_ContactAccount.value === '') {
            swal("Error", "No ingresaste la cuenta del contacto.", "error");
        }
        else {
            Modify_Contact(contact_City_Select.value, contact_Company_Select.value);
            $('#modal_Add_Contact').modal('hide');
        }
    });
}


/**
 * Add event listener to modal save contact button
 */
if (modal_AddContact_Btn !== null) {
    modal_AddContact_Btn.addEventListener('click', () => {
        if (input_ContactName.value === '') {
            swal("Error", "No ingresaste el nombre del contact.", "error");
        }
        else if (input_ContactLastName.value === '') {
            swal("Error", "No ingresaste el apellido del contacto.", "error");
        }
        else if (input_ContactPosition.value === '') {
            swal("Error", "No ingresaste el cargo del contacto.", "error");
        }
        else if (input_ContactEmail.value === '') {
            swal("Error", "No ingresaste el email del contacto.", "error");
        }
        else if (contact_Company_Select.value === '') {
            swal("Error", "No ingresaste la compañia del contacto.", "error");
        }
        else if (contact_Region_Select.value === '') {
            swal("Error", "No ingresaste la región del contacto", "error");
        }
        else if (contact_Country_Select.value === '') {
            swal("Error", "No ingresaste el país del contacto.", "error");
        }
        else if (contact_City_Select.value === '') {
            swal("Error", "No ingresaste la ciudad del contacto.", "error");
        }
        // else if (input_Contact_Address.value === '') {
        //     swal("Error", "No ingresaste la dirección del contacto.", "error");
        // }
        // else if (input_ContactAccount.value === '') {
        //     swal("Error", "No ingresaste la cuenta del contacto.", "error");
        // }
        else {
            create_Contact(contact_City_Select.value, contact_Company_Select.value);
            $('#modal_Add_Contact').modal('hide');
        }
    });
}


/**
 * @method create_Contact
 * @description Create contact in the database
 */
const create_Contact = ((cityId, companyId) => {
    data = {};
    data = {
        name: input_ContactName.value, lastname: input_ContactLastName.value,
        email: input_ContactEmail.value, position: input_ContactPosition.value,
        channel: input_ContactChannel_Select.value, interest: contact_Interest_Select.value,
        account: input_ContactAccount.value, preference: contact_Preference_Select.value,
        image: image_Result.src
    }
    URL = '';
    URL = URL_CREATE_CONTACT;
    URL += `${cityId}/${companyId}`;
    request.create(URL, data).then((response) => {
        if (response.ok === true) {
            swal(`${response.title}`, `${response.detail}`, 'success');
            get_Contacts();
        }
        else {
            swal(`${response.title}`, `${response.detail}`, 'error');
        }
    }).catch((error) => console.log({
        error: error
    }));
});

/**
 * @method Modify_Contact
 * @description Create contact in the database
 */
const Modify_Contact = ((cityId, companyId) => {
    data = {};
    data = {
        name: input_ContactName.value, lastname: input_ContactLastName.value,
        email: input_ContactEmail.value, position: input_ContactPosition.value,
        channel: input_ContactChannel_Select.value, interest: contact_Interest_Select.value,
        account: input_ContactAccount.value, preference: contact_Preference_Select.value,
    }
    URL = '';
    URL = URL_MODIFY_CONTACTS;
    URL += `${cityId}/${companyId}/${modify_Id_Contact}`;
    request.put(URL, data).then((response) => {
        if (response.ok === true) {
            swal(`${response.title}`, `${response.detail}`, 'success');
            get_Contacts();
        }
        else {
            swal(`${response.title}`, `${response.detail}`, 'error');
        }
    }).catch((error) => console.log({
        error: error
    }));
});

/*  ==========================================
    SHOW UPLOADED IMAGE
* ========================================== */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imageResult')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);

    }
}

/*  ==========================================
    SHOW UPLOADED IMAGE NAME
* ========================================== */
var input = document.getElementById('upload');
$(function () {
    $('#upload').on('change', function () {
        console.log(input.files[0].size)
        if (input.files[0].size > 54000) {
            swal(`Error`, `Elegiste una imagen demasiado grande. Debe de ser una imagen pequeña`, 'error')
        }
        else {
            readURL(input);
        }
    });
});


// /**
//  * Stop event propagation when you click inside the dropdown menu
//  */
// const dropdown_Menu = document.querySelector('.dropdown_Menu');
// dropdown_Menu.addEventListener('click', function (event) {
//     event.stopPropagation();
// }); 