// 0 - capturamos evento submit y llamada métodos
$('#js-form').submit(async(event) => {
        event.preventDefault()
        const email = document.getElementById('js-input-email').value
        const password = document.getElementById('js-input-password').value
        const JWT = await postData(email, password)
        getPosts(JWT)
        getAlbums(JWT)
    })
    // capturamos evento submit y llamada métodos

// 1 - llamado a la API y Login
const postData = async(email, password) => {
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            const { token } = await response.json()
            localStorage.setItem('jwt-token', token)
            return token
        } catch (err) {
            console.error(`Error: ${err}`);
        }
    }
    // llamado a la API y Login

// 2 - función que llama a la API de POSTS y almacena JWT en localStorage
const getPosts = async(jwt) => {
        try {
            const response = await fetch('http://localhost:3000/api/posts', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
            const { data } = await response.json()
            if (data) {
                fillTable(data, 'js-table-posts')
                toggleFormAndTable('js-form-wrapper', 'js-table-wrapper')
            }
        } catch (err) {
            localStorage.clear()
            console.error(`Error: ${err}`);
        }
    }
    // función que llama a la API de POSTS y almacena JWT en localStorage

// 3 - función que valida si hay un JWT
const init = async() => {
    const token = localStorage.getItem('jwt-token')
    if (token) {
        const posts = await getPosts(token)
        fillTable(posts, 'js-table-posts')
        toggleFormAndTable('js-form-wrapper', 'js-table-wrapper')
    }
}
init()
    // función que valida si hay un JWT



// 4 - función para completar tabla con datos
const fillTable = (data, table) => {
        let rows = "";
        // console.log(data)
        $.each(data, (i, row) => {
            rows += `<tr>
                        <td>${row.title}</td>
                        <td>${row.body}</td>
                    </tr>`
        })
        $(`#${table} tbody`).append(rows);
    }
    // función para completar tabla con datos

// 5 - función que oculta y muestra div
const toggleFormAndTable = (form, table) => {
        $(`#${form}`).toggle()
        $(`#${table}`).toggle()
    }
    // función que oculta y muestra div

// 22 - función que llama a la API de ALBUMS y almacena JWT en localStorage
const getAlbums = async(jwt) => {
        try {
            const response = await fetch('http://localhost:3000/api/albums', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
            const { data } = await response.json()
            if (data) {
                fillTableAlbums(data, 'js-table-albums')
                toggleFormAndTableAlbums('js-form-albums', 'js-table-albums')
            }
        } catch (err) {
            localStorage.clear()
            console.error(`Error: ${err}`);
        }
    }
    // función que llama a la API de POSTS y almacena JWT en localStorage

// 33 - función que valida si hay un JWT
const initAlbums = async() => {
    const token = localStorage.getItem('jwt-token')
    if (token) {
        const albums = await getAlbums(token)
        fillTableAlbums(albums, 'js-table-albums')
        toggleFormAndTableAlbums('js-form-albums', 'js-table-albums')
    }
}
initAlbums()
    // función que valida si hay un JWT

// 44 - función para completar tabla con datos
const fillTableAlbums = (data, table) => {
        let rows = "";
        // console.log(data)
        $.each(data, (i, row) => {
            rows += `<tr>
                    <td>${row.id}</td>
                    <td>${row.title}</td>
                </tr>`
        })
        $(`#${table} tbody`).append(rows);
    }
    // función para completar tabla con datos

// 55 - función que oculta y muestra div
const toggleFormAndTableAlbums = (form, table) => {
        $(`#${form}`).toggle()
        $(`#${table}`).toggle()
    }
    // función que oculta y muestra div

// prueba local storage
localStorage.setItem('llave-para-identificar', 'valor-que-guardamos')
localStorage.getItem('llave-para-identificar')
    // local storage