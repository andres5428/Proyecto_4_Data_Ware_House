const request = {
  get: ((URL) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `bearer ${JSON.parse(localStorage.getItem('Token'))}`);
    return new Promise((resolve, reject) => {
      fetch(URL, {
        method: 'GET',
        headers: myHeaders
      })
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    })
  }),
  export: ((URL) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    myHeaders.append("Content-Disposition", "attachment; filename=" + "contacts.xlsx");
    return new Promise((resolve, reject) => {
      fetch(URL, {
        method: 'GET',
        headers: myHeaders
      })
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    })
  }),
  login: ((URL, data) => {
    return new Promise((resolve, reject) => {
      fetch(URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      })
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    })
  }),
  create: ((URL, data) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `bearer ${JSON.parse(localStorage.getItem('Token'))}`);
    return new Promise((resolve, reject) => {
      fetch(URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: myHeaders,
      })
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    })
  }),
  create_Attachment: ((URL, data, files) => {
    var formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    Object.keys(files).forEach((file) => {
      formData.append(file, files[file].file, files[file].name);
    });
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `bearer ${JSON.parse(localStorage.getItem('Token'))}`);
    return new Promise((resolve, reject) => {
      fetch(URL, {
        method: 'POST',
        body: formData,
        headers: myHeaders,
      })
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    })
  }),
  put: ((URL, data) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `bearer ${JSON.parse(localStorage.getItem('Token'))}`);
    return new Promise((resolve, reject) => {
      fetch(URL, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: myHeaders,
      })
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    })
  }),
  delete: ((URL) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `bearer ${JSON.parse(localStorage.getItem('Token'))}`);
    return new Promise((resolve, reject) => {
      fetch(URL, {
        method: 'DELETE',
        headers: myHeaders,
      })
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    })
  })
};

export default request;