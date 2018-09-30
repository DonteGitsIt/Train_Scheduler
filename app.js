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

//on click funcion that runs whenever the submit button is clicked
$('#submit-button').on('click', function (event) {
    /*prevents page refresh on click of submit button
    (which is the default function of a form submit button)*/
    event.preventDefault();
    //sets variable for user input of train name
    var trainName = $('#name-input').val().trim()
    //sets variable for user input of destination
    var destination = $('#destination-input').val().trim()
    //sets variable for user input of first train
    var startTime = $('#time-input').val().trim()
    //sets variable for user input of frequency
    var frequency = $('#frequency-input').val().trim()

    // pushes retrieved info from above to the database as an object (firebase)
    database.ref().push({
        trainName: trainName,
        destination: destination,
        startTime: startTime,
        frequency: frequency,

    })

    //resets all areas of user input
    $('#name-input').val("")
    $('#destination-input').val("")
    $('#time-input').val("")
    $('#frequency-input').val("")
})
/*function that runs everytime firebase detects a new object in its database 
(runs through all objects in database when page is refreshed)*/
database.ref().on("child_added", function (snapshot) {
    /*sets variable that uses moment.js to convert the first train time of current
    object to exactly one year ago (required in order for us to find out how long til the next train comes and 
    its' arival time)*/
    var startTimeConversion = moment(snapshot.val().startTime, "HH:mm").subtract(1, "years")
    /*Finds the difference between now(moment().diff()) and the time of the first train in minutes*/
    var diffInTime = moment().diff(moment(startTimeConversion), "minutes")
    /*Finds the remainder when you take the differece from above and divide it by the frequency of train
    (within current database object)*/
    var remainder = diffInTime % snapshot.val().frequency
    /*Finds current amount of time til the next train by subtracting remainder variable from the frequency value
    of the current object */
    var minTilNextTrain = snapshot.val().frequency - remainder
    /*Adds above variable to the current time (moment().add()) in order to find out exact time of the train's 
    arrival and then reformats the answer into a digital clock style of time*/
    var nextTrain = moment().add(minTilNextTrain, "minutes").format("hh:mm a")

    //sets variable for creating a new table row
    var newRow = $("<tr>")
    //appends newly created table row to the table body
    $("#table-data").append(newRow)
    //appends all necessary data to the new row in the order that they appear in table columns
    $(newRow).append($("<td>").text(snapshot.val().trainName))
    $(newRow).append($("<td>").text(snapshot.val().destination))
    $(newRow).append($("<td>").text(snapshot.val().frequency))
    $(newRow).append($("<td>").text(nextTrain))
    $(newRow).append($("<td>").text(minTilNextTrain))
})