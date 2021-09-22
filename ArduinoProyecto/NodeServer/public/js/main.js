
window.onload = function () {
    //I load all the functions on the page
    sockets();
    smoothLinks();

    //Inser onclick for the button "regar"
    document.getElementsByClassName("regar_button")[0].addEventListener("click", turnPump);
}

function smoothLinks() {

    //This method was inspired in one found on internet.

    $(document).ready(function () {
        // Add smooth scrolling to all links
        $(".fixed-side-navbar a, .primary-button a").on('click', function (event) {

            // Make sure this.hash has a value before overriding default behavior
            if (this.hash !== "") {
                // Prevent default anchor click behavior
                event.preventDefault();

                // Store hash
                var hash = this.hash;

                // Using jQuery's animate() method to add smooth page scroll
                // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 800, function () {

                    // Add hash (#) to URL when done scrolling (default click behavior)
                    window.location.hash = hash;
                });
            } // End if
        });
    });
}

//function to manage with sockets the info about the sensors on the page
function sockets() {
    var socket = io.connect();

    //According on every socket I do the connection to every data
    socket.on("temperatura", function (data) {
        document.getElementsByClassName("valor_temperatura")[0].innerHTML = data.value + " " + data.unit;
    })
    socket.on("humedad", function (data) {
        document.getElementsByClassName("valor_humedad")[0].innerHTML = data.value + " " + data.unit + " Ambiental";
    })
    socket.on("luz", function (data) {
        document.getElementsByClassName("valor_luz")[0].innerHTML = (100 - (((data.value / 4095) * 100))).toFixed(2) + data.unit;
    })
    socket.on("flujo", function (data) {
        document.getElementsByClassName("valor_flujo")[0].innerHTML = data.value + " " + data.unit;
    })
    socket.on("humedad_tierra", function (data) {
        document.getElementsByClassName("valor_humedad_tierra")[0].innerHTML = (100 - (((data.value / 4095) * 100))).toFixed(2) + "% " + data.unit + " De la Tierra";
    })
}

//Function to turn ON or OFF the pump according to the actual state when someon push the button.
function turnPump() {

    var statusRelay;

    //I do a get request to save the boolean value of the relay status, if it is OFF or ON
    axios.get('http://84.121.186.190/status')

        .then(res => {
            var data = res.data;
            console.log(data.value);
            data.value == 0 ? statusRelay = true : statusRelay = false;
            console.log(statusRelay);
            document.getElementsByClassName("primary-button")[1].className = "primary-button " + statusRelay;

            if (statusRelay) {
                document.getElementsByClassName("regar_button")[0].innerText = "Parar";
            } else {
                document.getElementsByClassName("regar_button")[0].innerText = "Regar";
            }

            //I do a post request according to the previous get request response with boolean "statusRelay"
            axios.post('http://84.121.186.190/status', {
                "id": 1, "status": statusRelay
            }).then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });

        })
        .catch(err => {
            console.log('Error: ', err.message);
        });

}