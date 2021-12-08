var data;


client = new Paho.MQTT.Client('192.168.100.8', 8883, "IOTWeb");
// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;


// connect the client
//client.connect({onSuccess:onConnect});
client.connect({
    onSuccess: onConnect,
    userName: "TranDangKhoa",
    password: "0915527900"
});

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("MyLAP");
    message = new Paho.MQTT.Message('connected');
    message.destinationName = "MyLAP";
    client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    data = message.payloadString;
    //console.log(data);
}




function SendMess() {
    message = new Paho.MQTT.Message(document.getElementById("mess").value);
    message.destinationName = "MyLAP";
    client.send(message);

    document.getElementById("mess").value = "";

    console.log(data);
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function ledControl() {
    if (isJson(data)) {
        var obj = JSON.parse(data);
    } else {
        return;
    }

    if (obj.LedState == 0) {
        message = new Paho.MQTT.Message("LED ON");
        message.destinationName = "MyLAP";
        client.send(message);
    } else {
        message = new Paho.MQTT.Message("LED OFF");
        message.destinationName = "MyLAP";
        client.send(message);
    }


    //LedState = message

}

function dataProgress() {
    if (isJson(data)) {
        var obj = JSON.parse(data);
    } else {
        return;
    }


    document.getElementById("state").innerHTML = ((obj.value * 100 / 4059)).toFixed(0) + "%";
    document.getElementById("PrBar").style.width = ((obj.value * 100 / 4059)).toFixed(0) + "%";
    document.getElementById("PrBar1").style.width = ((obj.value1 * 100 / 4059)).toFixed(0) + "%";
    document.getElementById("PrBar2").style.width = ((obj.value2 * 100 / 4059)).toFixed(0) + "%";
}

setInterval(dataProgress, 250);