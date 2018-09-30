// Initialize Firebase
var config = {
    apiKey: "AIzaSyA7JTBkZvWswsQYVk6R46vE1K_d_qlj1Ug",
    authDomain: "train-schedules-b25aa.firebaseapp.com",
    databaseURL: "https://train-schedules-b25aa.firebaseio.com",
    projectId: "train-schedules-b25aa",
    storageBucket: "train-schedules-b25aa.appspot.com",
    messagingSenderId: "449955495158"
  };
  firebase.initializeApp(config);

var database = firebase.database()

$('#submit-button').on('click', function(event){
    event.preventDefault();
    var trainName = $('#name-input').val().trim()
    var destination = $('#destination-input').val().trim()
    var startTime = $('#time-input').val().trim()
    var frequency = $('#frequency-input').val().trim()

    
    database.ref().push({
        trainName: trainName,
        destination: destination,
        startTime: startTime,
        frequency: frequency,
    
    })
    $('#name-input').val("")
    $('#destination-input').val("")
    $('#time-input').val("")
    $('#frequency-input').val("")
})

database.ref().on("child_added", function(snapshot){
    var startTimeConversion = moment(snapshot.val().startTime, "HH:mm").subtract(1, "years")
    var diffInTime = moment().diff(moment(startTimeConversion), "minutes")
    var remainder = diffInTime % snapshot.val().frequency
    var minTilNextTrain = snapshot.val().frequency - remainder 
    var nextTrain = moment().add(minTilNextTrain, "minutes").format("dddd, MMMM Do YYYY, h:mm a")
   
    var newRow = $("<tr>")
    $("#table-data").append(newRow)
    $(newRow).append($("<td>").text(snapshot.val().trainName))
    $(newRow).append($("<td>").text(snapshot.val().destination))
    $(newRow).append($("<td>").text(snapshot.val().frequency))
    $(newRow).append($("<td>").text(nextTrain))
    if (minTilNextTrain >= 1){
        $(newRow).append($("<td>").text(minTilNextTrain))
    }else{
        $(newRow).append($("<td>").text("Arriving"))
    }
    
})