const options = {
    series: [{
        name: 'CLP',
        data: []
    }],
    chart: {
        height: 400,
        type: 'line',
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight'
    },
    title: {
        text: 'Historial últimos diez días',
        align: 'center'
    },
    grid: {
        row: {
            colors: ['#224F91', 'transparent'],
            opacity: 0.1
        }
    },
    xaxis: {
        categories: []
    }
};

const btn = document.getElementById('btn');
const amountValue = document.getElementById('amountValue');
const currency = document.getElementById('currency');
const result = document.getElementById('result');
const chartContainer = document.querySelector("#chart");
let chart;

const renderChart = (serie) => {
    const historial = serie.slice(0, 10).reverse();

    options.series[0].data = [];
    options.xaxis.categories = [];

    historial.forEach((dia) => {
        options.series[0].data.push(dia.valor);
        options.xaxis.categories.push(dia.fecha.split('T')[0]);
    });

    if (chart) {
        chart.updateOptions(options);
    } else {
        chart = new ApexCharts(chartContainer, options);
        chart.render();
    }
};

const getData = async (indicator) => {
    try {
        const response = await fetch(`https://mindicador.cl/api/${indicator}`);
        const json = await response.json();
        return json;

    } catch (error) {
        result.textContent = '¡Error al obtener los datos! Verifica tu conexión a Internet.';
        result.style.color = 'red';
    }
};

btn.addEventListener('click', async () => {
    const amount = parseFloat(amountValue.value);

    if (isNaN(amount)) {
        result.textContent = 'Por favor, ingresa un monto válido.';
        result.style.color = 'red';
        return;
    }

    const selectedCurrency = currency.value;
    const data = await getData(selectedCurrency);

    const conversion = amount / data.serie[0].valor;
    result.textContent = `Resultado: $${conversion.toFixed(2)}`;

    renderChart(data.serie);
});
