
        // runing clock in real time 
        var clock;
        function runningClock() {
            time = moment().format("hh:mm:ss A");
            $("#time").text(time);
        }
        clock = setInterval(runningClock, 1000);

        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyC1R2VMtgkj8c9VlbP7F5aZFwkBmpX-Yt8",
            authDomain: "bootcamp-78721.firebaseapp.com",
            databaseURL: "https://bootcamp-78721.firebaseio.com",
            projectId: "bootcamp-78721",
            storageBucket: "bootcamp-78721.appspot.com",
            messagingSenderId: "601185461394"
        };
        firebase.initializeApp(config);

        // Create a variable to reference the database.
        var database = firebase.database();

        // Initial Values
        var name = "Train_Name";
        var destination = "Destination";
        var firstTrain = "First_Train";
        var frequency = "Frequency";

        // Capture Button Click
        $("#Submit").on("click", function (event) {
            event.preventDefault();

            // Grabbed values from text boxes
            name = $("#Train_Name").val().trim();
            destination = $("#Destination").val().trim();
            firstTrain = $("#First_Train").val().trim();
            frequency = $("#Frequency").val().trim();

            // Code for handling the push
            database.ref().push({
                name: name,
                destination: destination,
                firstTrain: firstTrain,
                frequency: frequency,
                dateAdded: firebase.database.ServerValue.TIMESTAMP

            });
            $("form")[0].reset();
        });

        // Firebase watcher .on("child_added"
        database.ref().on("child_added", function (childSnapshot) {

           
            // storing the childSnapshot.val() in a variable for convenience
            var nextArr;
            var minAway;
            // Chang year so first train comes before now
            var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
            // Difference between the current and firstTrain
            var diffTime = moment().diff(moment(firstTrainNew), "minutes");
            var remainder = diffTime % childSnapshot.val().frequency;
            // Minutes until next train
            var minAway = childSnapshot.val().frequency - remainder;
            // Next train time
            var nextTrain = moment().add(minAway, "minutes");
            nextTrain = moment(nextTrain).format("hh:mm");
            console.log(minAway, firstTrainNew, diffTime, remainder, minAway, nextTrain);


            // Console.loging the last user's data
            console.log(name);
            console.log(destination);
            console.log(firstTrain);
            console.log(frequency);

            // Change the HTML to reflect 

            $("#add-row").append("<tr><td>" + childSnapshot.val().name +
            "</td><td>" + childSnapshot.val().destination +
            "</td><td>" + childSnapshot.val().frequency +
            "</td><td>" + nextTrain + 
            "</td><td>" + minAway + "</td></tr>");

            // Handle the errors
        }, function (errorObject) {
            console.log("Errors handled: " + errorObject.code);

        });

        database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
            // Change the HTML to reflect
            $("#name-display").html(snapshot.val().name);
            $("#email-display").html(snapshot.val().email);
            $("#age-display").html(snapshot.val().age);
            $("#comment-display").html(snapshot.val().comment);
        });
 