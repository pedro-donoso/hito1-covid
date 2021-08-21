$('#form').submit(async(event) => {
    event.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const JWT = await postData(email, password)
    getPosts(JWT)


})

const postData = async(email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            body: JSON.stringify({ email: email, password: password })
        })
        const { token } = await response.json()
        localStorage.setItem('jwt-token', token)
        return token
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

const getPosts = async(jwt) => {
    try {
        const response = await fetch('http://localhost:3000/api/photos', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const { data } = await response.json()

        if (data) {
            fillTable(data)
            toggleFormAndTable()
        }

    } catch (err) {
        localStorage.clear()
        console.error(`Error: ${err}`)
    }
}

const init = async() => {
    const token = localStorage.getItem('jwt-token')
    if (token) {
        const posts = await getPosts(token)
    }
}
init()

const fillTable = (data) => {
    let rows = "";
    console.log(data);
    $.each(data, (i, row) => {
        rows += `<div class="card d-block my-1 px-0 mx-0" style="border:1px solid red">
        <img class="card-img-top" src="${row.download_url}" alt=" " style="margin-inline: auto;">
        <div >
            <p class="card-text p-1">Autor: ${row.author}</p>
        </div>
    </div>`
    })
    document.getElementById('contenido').innerHTML = rows
}

const toggleFormAndTable = () => {
    $(`#js-form`).toggle()
    $(`#js-contenido`).toggle()
}




document.getElementById('logout').addEventListener('click', () => {
    localStorage.clear()
    location.reload()
})

let pagina = 2

document.getElementById('elBoton').addEventListener('click', async() => {
    const token = localStorage.getItem('jwt-token')
    if (pagina <= 10) {
        try {
            const response = await fetch(`http://localhost:3000/api/photos?page=${pagina}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const { data } = await response.json()
            if (data) {
                console.log(data);
                let rows = "";
                $.each(data, (i, row) => {
                    rows += `<div class="card d-block my-1 px-0 mx-0" style="border:1px solid red">
                                <img class="card-img-top" src="${row.download_url}" alt=" " style="margin-inline: auto;">
                                <div>
                                    <p class="card-text p-3">Autor: ${row.author}</p>
                                </div>
                            </div>`
                })
                document.getElementById('contenido').innerHTML += rows
            }
        } catch (err) {
            localStorage.clear()
            console.error(`Error: ${err}`)
        }
        pagina++
        if (pagina == 11) {
            document.getElementById('masFotitos').innerHTML = "Ya viste todas las fotos"
        }
    }
})