// url base
const baseUrl = 'http://localhost:3000/api/total'

// posts
const getPosts = async(url) => {
    try {
        const response = await fetch(url)
        const { data } = await response.json();
        console.log(data);
        console.log(data[0].location)
        console.log(data[0].confirmed)
        if (data) {
            getDataChart(data);
        }
        return data
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

// url por país
const getPostCountry = async(country) => {
    try {
        const response = await fetch(`http://localhost:3000/api/countries/${country}`);
        const { data } = await response.json();
        console.log(data)
        if (data) {
            getCountryChart(data)
        }
        return data
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

// login
const postData = async(email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            body: JSON.stringify({ email: email, password: password })
        })
        const { token } = await response.json();
        localStorage.setItem('token-usuario', token);
        return token
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

//casos
let dataApiConfirmed = [];
let dataApiDeath = [];

let countryApiConfirmed = [];
let countryApiDeath = [];

// canvas js
const getDataChart = (data) => {
    let dataComplete = data;
    let arrayfilter = dataComplete.filter((m) => {
        return m.confirmed > 1500000;
    });
    console.log(arrayfilter);
    arrayfilter.forEach((k) => {
        dataApiConfirmed.push({
            label: k.location,
            y: k.confirmed,
        });
        dataApiDeath.push({
            label: k.location,
            y: k.deaths
        })
    });
    console.log(dataApiConfirmed)
    let config = {
        animationEnabled: true,
        theme: "dark1",
        title: {
            text: "Casos covid-19 a nivel mundial",
            fontFamily: 'Open Sans',
            fontWeight: "normal",
        },
        axisX: {
            title: "",
            labelAngle: 45,
            interval: 1,
            labelFontColor: "#fff",

        },
        axisY: {
            title: "",
            titleFontColor: "#a3a3a3",
            lineColor: "#a3a3a3",
            labelFontColor: "#6d78ad",
            tickColor: "#a3a3a3",
            gridThickness: 1
        },

        legend: {
            cursor: "pointer",
        },
        dataPointWidth: 15,
        height: 350,

        data: [{
                type: "column",
                name: "total confirmados",
                legendText: "Confirmados",
                showInLegend: true,
                dataPoints: dataApiConfirmed
            },
            {
                type: "column",
                name: "total muertes",
                legendText: "Muertes",
                axisYType: "secondary",
                showInLegend: true,
                dataPoints: dataApiDeath
            }
        ]
    };
    let chart = new CanvasJS.Chart("covidChart", config);
    chart.render();

    // grafico pais
    function datoTabla(datafilter) {
        let texto = "<tr><th>Paises</th><th>Confirmados</th><th>Muertos</th><th>Gráfico</th></tr>";
        for (let i = 0; i < datafilter.length; i++) {
            texto += `<tr>
                    <td>${datafilter[i].location}</td>
                    <td>${datafilter[i].confirmed}</td>
                    <td>${datafilter[i].deaths}</td>
                    <td><button type="button" class="btnCountry btn btn-outline-success" data-toggle="modal" data-target="#chartPais" value="${datafilter[i].location}">detalles</button></td>              
                    </tr>`;
        }
        document.querySelector("#tabla-covid").innerHTML = texto;
    }
    datoTabla(dataComplete);
    $(".btnCountry").click(function() {
        countryApiConfirmed = [];
        countryApiDeath = [];
        const pais = $(this).val();
        var pais2 = pais.split(' ').join('_');
        getPostCountry(pais2);
    });
}

// grafico boton
const getCountryChart = (data) => {
    let countryData = data;
    countryApiConfirmed.push({
        label: countryData.location,
        y: countryData.confirmed
    });
    countryApiDeath.push({
        label: countryData.location,
        y: countryData.deaths
    })
    console.log(countryApiConfirmed)
    console.log(countryApiDeath)
    let configPais = {
        animationEnabled: true,
        theme: "light1",
        title: {
            text: "Caso País"
        },
        axisX: {
            labelAngle: 0,
            interval: 1
        },
        axisY: {
            title: "Confirmados",
            titleFontColor: "#000",
            lineColor: "#000",
            labelFontColor: "#000",
            tickColor: "#000"
        },
        axisY2: {
            title: "Muertes",
            titleFontColor: "#000",
            lineColor: "#000",
            labelFontColor: "#000",
            tickColor: "#000"
        },


        dataPointWidth: 50,
        height: 200,
        data: [{
                type: "column",
                name: "total confirmados",
                legendText: "Confirmados",
                showInLegend: true,
                dataPoints: countryApiConfirmed
            },
            {
                type: "column",
                name: "total muertes",
                legendText: "Muertes",
                axisYType: "secondary",
                showInLegend: true,
                dataPoints: countryApiDeath
            },

        ]
    };
    let chart = new CanvasJS.Chart("covidChartPais", configPais);
    chart.render();
}


$('#form-login').submit(async(event) => {
    event.preventDefault();
    const email = document.querySelector("#covid-mail").value;
    const pass = document.querySelector("#covid-pass").value;
    const JWT = await postData(email, pass);
    linkPage("confirmed")

})
getPosts(baseUrl);