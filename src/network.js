
const WEBSERVICE_URL = `http://localhost:8085/`;

export function getHistoryList(){
  const promise =  new Promise((resolve, reject) => {
        fetch(`${WEBSERVICE_URL}history/`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data =>
        {
            return resolve(data)
        });
    })

    return promise;
}

export function saveHistoryData(display, result) {
    const promise = new Promise((resolve, reject) => {
        fetch(`${WEBSERVICE_URL}history/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({key: display, result})
    })
        .then(response => response.json())
        .then(data =>
     {
         return resolve(data)
     });
    })
    return promise;
}

export function deleteHistoryData(){
    const delPromise = new Promise((resolve,reject) => {
        fetch(`${WEBSERVICE_URL}history/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data =>
        {
            return resolve(data)
        });
    })
    return delPromise;  
}