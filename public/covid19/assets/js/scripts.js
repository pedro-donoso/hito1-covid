const baseUrl = 'http://localhost:3000/api/total'

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

const baseUrlChile = 'http://localhost:3000/api'
const getPostChile = async(url, jwt) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const { data } = await response.json();
        if (data) {
            getChileChart(data)
            console.log(data)
            return data
        }
    } catch (err) {
        localStorage.clear();
        console.error(`Error: ${err}`)
    }
}
const linkPage = async(page) => {
    const token = localStorage.getItem('token-usuario')
    console.log(token)
    const url = `${baseUrlChile}/${page}`;
    return getPostChile(url, token);
}
const init = async() => {
    const token = localStorage.getItem('token-usuario')
    if (token) {
        getPostChile(token);
    }
}
init();


let dataApiConfirmed = [];
let dataApiDeath = [];

let countryApiConfirmed = [];
let countryApiDeath = [];

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
        theme: "light2",
        title: {
            text: "Casos covid-19 a nivel mundial",
            fontFamily: 'Open Sans',
            fontWeight: "normal",
        },
        axisX: {
            title: "",
            labelAngle: 45,
            interval: 1,
            labelFontColor: "#3c3c3c",

        },
        axisY: {
            title: "",
            titleFontColor: "#a3a3a3",
            lineColor: "#a3a3a3",
            labelFontColor: "#6d78ad",
            tickColor: "#a3a3a3",
            gridThickness: 1
        },
        axisY2: {
            // title: "",
            // titleFontColor: "#C0504E",
            // lineColor: "#C0504E",
            // labelFontColor: "#C0504E",
            // tickColor: "#C0504E"
        },
        // toolTip: {
        //     shared: true
        // },
        legend: {
            cursor: "pointer",
            // itemclick: toggleDataSeries
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
            },
            // {
            //     type: "column",	
            //     name: "Oil Production (million/day)",
            //     legendText: "Oil Production",
            //     axisYType: "secondary",
            //     showInLegend: true,
            //     dataPoints:[
            //         { label: "Saudi", y: 10.46 },
            //         { label: "Venezuela", y: 2.27 },
            //         { label: "Iran", y: 3.99 },
            //         { label: "Iraq", y: 4.45 },
            //         { label: "Kuwait", y: 2.92 },
            //         { label: "UAE", y: 3.1 }
            //     ]
            // }
        ]
    };
    let chart = new CanvasJS.Chart("covidChart", config);
    chart.render();

    function datoTabla(datafilter) {
        let texto = "<tr><th>Paises</th><th>Confirmados</th><th>Muertos</th><th>Detalle</th></tr>";
        for (let i = 0; i < datafilter.length; i++) {
            texto += `<tr>
                    <td>${datafilter[i].location}</td>
                    <td>${datafilter[i].confirmed}</td>
                    <td>${datafilter[i].deaths}</td>
                    <td><button type="button" class="btnCountry btn btn-outline-primary" data-toggle="modal" data-target="#chartPais" value="${datafilter[i].location}">Ver más</button></td>              
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
        theme: "light2",
        title: {
            text: ""
        },
        axisX: {
            labelAngle: 45,
            interval: 1
        },
        axisY: {
            title: "",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },
        axisY2: {
            title: "",
            titleFontColor: "#51cda0",
            lineColor: "#51cda0",
            labelFontColor: "#51cda0",
            tickColor: "#C0504E"
        },
        // toolTip: {
        //     shared: true
        // },
        // legend: {
        //     cursor:"pointer",
        //     itemclick: toggleDataSeries
        // },
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
            // {
            //     type: "column",	
            //     name: "Oil Production (million/day)",
            //     legendText: "Oil Production",
            //     axisYType: "secondary",
            //     showInLegend: true,
            //     dataPoints:[
            //         { label: "Saudi", y: 10.46 },
            //         { label: "Venezuela", y: 2.27 },
            //         { label: "Iran", y: 3.99 },
            //         { label: "Iraq", y: 4.45 },
            //         { label: "Kuwait", y: 2.92 },
            //         { label: "UAE", y: 3.1 }
            //     ]
            // }
        ]
    };
    let chart = new CanvasJS.Chart("covidChartPais", configPais);
    chart.render();
}
let confirmedChileChart = [];
const getChileChart = (data) => {
    let dataChile = data;
    let confirmadosChileDate = 0;
    let confirmadosChileNumb = 0;

    for (let i = 0; i < dataChile.length; i += 15) {
        confirmadosChileDate = data[i].date;
        confirmadosChileNumb = data[i].total;

        confirmedChileChart.push({
            label: confirmadosChileDate,
            y: confirmadosChileNumb
        });

    }
    console.log(confirmedChileChart)
}

$('#form-login').submit(async(event) => {
    event.preventDefault();
    console.log("hola submit")
    const email = document.querySelector("#covid-mail").value;
    const pass = document.querySelector("#covid-pass").value;
    const JWT = await postData(email, pass);
    linkPage("confirmed")

})
getPosts(baseUrl);