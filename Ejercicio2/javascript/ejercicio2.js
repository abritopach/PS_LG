// A $( document ).ready() block.
$( document ).ready(function() {

    var dataPieChart = [];
    var dataLineChart = [];
    var myRegexp = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/g;


    var request1 = $.getJSON('http://s3.amazonaws.com/logtrust-static/test/test/data1.json');
    var request2 = $.getJSON('http://s3.amazonaws.com/logtrust-static/test/test/data2.json');
    var request3 = $.getJSON('http://s3.amazonaws.com/logtrust-static/test/test/data3.json');


    $.when(request1, request2, request3).then(function (resp1, resp2, resp3) {

        // DATA1

        var data1 = resp1[0];

        for (var i = 0; i < data1.length; i++) {
            var cat = data1[i].cat.toUpperCase().toString();
            var value = data1[i].value;
            updateDataLineChart(moment(data1[i].d).format("YYYY-MM-DD"), cat, value);
            updateDataPieChart(cat, value);
        }

        // DATA2

        var data2 = resp2[0];

        for (var i = 0; i < data2.length; i++) {
            var cat = data2[i].categ.toUpperCase().toString();
            var value = data2[i].val;
            updateDataPieChart(cat, value);
            updateDataLineChart(data2[i].myDate, cat, value);
        }

        // DATA3

        var data3 = resp3[0];

        for (var i = 0; i < data3.length; i++) {

            // Extract Date;
            var date = data3[i].raw.match(myRegexp);

            // Extract CAT.
            var cat = data3[i].raw.match("\\#(.*)#");

            var value = data3[i].val;
            updateDataPieChart(cat[1].toUpperCase(), value);
            updateDataLineChart(date[0], cat[1].toUpperCase(), value);
        }

        drawLineChart();
        drawPieChart();

    });

    function checkDate(date) {
        var hasMatch = false;
        for (var index = 0; index < dataLineChart.length; ++index) {
            if (dataLineChart[index].date == date) {
                hasMatch = true;
                break;
            }
        }
        return hasMatch;
    }

    function getPosition(date) {
        var position = dataLineChart.length;
        for (var index = 0; index < dataLineChart.length; ++index) {
            if (dataLineChart[index].date == date) {
                position = index;
                break;
            }
        }
        return position;
    }

    function getCatIndex(cat) {
        if (cat == "CAT 1") {
            return 0;
        }
        if (cat == "CAT 2") {
            return 1;
        }
        if (cat == "CAT 3") {
            return 2;
        }
        if (cat == "CAT 4") {
            return 3;
        }
    }

    function updateDataLineChart(date, cat, value) {
        var index = getPosition(date);
        var catIndex = getCatIndex(cat);
        if (checkDate(date)) {
            dataLineChart[index].values[catIndex] = dataLineChart[index].values[catIndex] + value;
        }
        else {
            var values = [0, 0, 0, 0];
            dataLineChart.push({date: date, values: values});
            dataLineChart[index].values[catIndex] = value;
        }
    }

    function updateDataPieChart(cat, value) {
        if (dataPieChart.map(function(e) { return e.name; }).indexOf(cat) == -1) {
            dataPieChart.push({name: cat, y: value})
        }
        else {
            var pos = dataPieChart.map(function(e) { return e.name; }).indexOf(cat);
            dataPieChart[pos].y += value;
        }
    }

    function createCSVStr() {

        dataLineChart.sort(function(a,b){
            var c = new Date(a.date);
            var d = new Date(b.date);
            return c-d;
        });

        var csvStr = "Day,CAT 1,CAT 2, CAT 3, CAT 4\n";
        for (var i = 0; i < dataLineChart.length; i++) {
            cat1Value = dataLineChart[i].values[0];
            cat2Value = dataLineChart[i].values[1];
            cat3Value = dataLineChart[i].values[2];
            cat4Value = dataLineChart[i].values[3];
            /*
            if (cat1Value == 0) cat1Value = '';
            if (cat2Value == 0) cat2Value = '';
            if (cat3Value == 0) cat3Value = '';
            if (cat4Value == 0) cat4Value = '';
            */
            csvStr +=  dataLineChart[i].date + ',' + cat1Value + ',' + cat2Value + ',' + cat3Value + ',' + cat4Value + '\n';
        }
        return csvStr;
    }

    function drawLineChart() {
        var csvStr = createCSVStr();

        // Line Chart.

        Highcharts.chart('lineChart', {

            data: { csv: csvStr},

            title: { text: ' Gráfica de líneas: fecha eje x y tantas series como categorías'},

            xAxis: {
                tickInterval: 7 * 24 * 3600 * 1000, // one week
                tickWidth: 0,
                gridLineWidth: 1,
                labels: { align: 'left', x: 3, y: -3}
            },

            yAxis: [{ // left y axis
                title: { text: null},
                labels: { align: 'left', x: 3, y: 16, format: '{value:.,0f}'},
                showFirstLabel: false
            }, { // right y axis
                linkedTo: 0,
                gridLineWidth: 0,
                opposite: true,
                title: { text: null},
                labels: { align: 'right', x: -3, y: 16, format: '{value:.,0f}'},
                showFirstLabel: false
            }],

            legend: {
                align: 'left',
                verticalAlign: 'top',
                y: 15,
                floating: true,
                borderWidth: 0
            },

            tooltip: { shared: true, crosshairs: true},

            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (e) {
                                hs.htmlExpand(null, {
                                    pageOrigin: {
                                        x: e.pageX || e.clientX,
                                        y: e.pageY || e.clientY
                                    },
                                    headingText: this.series.name,
                                    maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
                                    this.y + ' visits',
                                    width: 200
                                });
                            }
                        }
                    },
                    marker: {
                        lineWidth: 1
                    }
                }
            },

            series: [
                {name: 'CAT 1', lineWidth: 4, marker: {radius: 4}
                }, { name: 'CAT 2'}, {name: 'CAT 3'}, {name: 'CAT 4'}
            ]
        });
    }

    function drawPieChart() {

        // Pie Chart

        Highcharts.chart('pieChart', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Pie Chart por categoría con datos totales (sumatorio de los valores de cada categoría).'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{name: 'Total', colorByPoint: true, data: dataPieChart}]
        });
    }
});