$(document).ready(function () {
  //setup our data arrays
  var timeData = [],
    temperatureData = [],
    humidityData = [],
    //acceleration
    axData = [],
    ayData = [],
    azData = [],
    //orientation?
    xData = [],
    yData = [],
    zData = [];


// --------- temperature chart -------------
  var temperatureChartData = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        data: temperatureData
      }
    ]
  }

  var temperatureChartBasicOption = {
    title: {
      display: true,
      text: 'Temperature Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature (C)',
          display: true
        },
        position: 'left',
      }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctxTemperature = document.getElementById("temperatureChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myTemperatureLineChart = new Chart(ctxTemperature, {
    type: 'line',
    data: temperatureChartData,
    options: temperatureChartBasicOption
  });

  // //------- second chart for acceleration ----------
  // var accelerationChartData = {
  //   labels: timeData,
  //   datasets: [
  //     {
  //       fill: false,
  //       label: 'X',
  //       yAxisID: 'acceleration',
  //       borderColor: "rgba(255, 0, 0, 1)",
  //       backgroundColor: "rgba(255, 0, 0, 0.4)",
  //       data: axData
  //     },
  //     {
  //       fill: false,
  //       label: 'Y',
  //       yAxisID: 'acceleration',
  //       borderColor: "rgba(0, 255, 0, 1)",
  //       backgroundColor: "rgba(0, 255, 0, 0.4)",
  //       data: ayData
  //     },
  //     {
  //       fill: false,
  //       label: 'Z',
  //       yAxisID: 'acceleration',
  //       borderColor: "rgba(0, 0, 255, 1)",
  //       backgroundColor: "rgba(0, 0, 255, 0.4)",
  //       data: azData
  //     }
  //   ]
  // }

  // var accelerationChartBasicOption = {
  //   title: {
  //     display: true,
  //     text: 'Acceleration Real-time Data',
  //     fontSize: 36
  //   },
  //   scales: {
  //     yAxes: [{
  //       id: 'acceleration',
  //       type: 'linear',
  //       scaleLabel: {
  //         labelString: 'Acceleration',
  //         display: true
  //       },
  //       position: 'left',
  //     }]
  //   }
  // }

  // //Get the context of the canvas element we want to select
  // var ctxAcceleration = document.getElementById("accelerationChart").getContext("2d");
  // var myAccelerationLineChart = new Chart(ctxAcceleration, {
  //   type: 'line',
  //   data: accelerationChartData,
  //   options: accelerationChartBasicOption
  // });



  //------- third chart for Orientation ----------
  var orientationChartData = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'X',
        yAxisID: 'XYZ',
        borderColor: "rgba(255, 0, 0, 1)",
        backgroundColor: "rgba(255, 0, 0, 0.4)",
        data: xData
      },
      {
        fill: false,
        label: 'Y',
        yAxisID: 'XYZ',
        borderColor: "rgba(0, 255, 0, 1)",
        backgroundColor: "rgba(0, 255, 0, 0.4)",
        data: yData
      },
      {
        fill: false,
        label: 'Z',
        yAxisID: 'XYZ',
        borderColor: "rgba(0, 0, 255, 1)",
        backgroundColor: "rgba(0, 0, 255, 0.4)",
        data: zData
      }
    ]
  }

  var orientationChartBasicOption = {
    title: {
      display: true,
      text: 'Orientation Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'XYZ',
        type: 'linear',
        scaleLabel: {
          labelString: 'Orientation',
          display: true
        },
        position: 'left',
      }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctxOrientation = document.getElementById("orientationChart").getContext("2d");
  var myOrientationLineChart = new Chart(ctxOrientation, {
    type: 'line',
    data: orientationChartData,
    options: orientationChartBasicOption
  });

  // ------ Setup Websockets and data connectivity

  var wsprotocol;
  if (location.protocol === "https:") {
    wsprotocol = "wss://";
  } else {
    wsprotocol = "ws://"; //for local testing
  }
  var ws = new WebSocket(wsprotocol + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.Temperature) {
        return;
      }
      timeData.push(obj.time);
      temperatureData.push(obj.Temperature);
      //acceleration
      axData.push(obj.AcceX);
      ayData.push(obj.AcceY);
      azData.push(obj.AcceZ);
      //orientation?
      xData.push(obj.X);
      yData.push(obj.Y);
      zData.push(obj.Z);
      //humidityData.push(obj.humidity);

      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
        axData.shift();
        ayData.shift();
        azData.shift();
        //orientation?
        xData.shift();
        yData.shift();
        zData.shift();
        //humidityData.shift();
      }
      //myAccelerationLineChart.update();
      myTemperatureLineChart.update();
      myOrientationLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
