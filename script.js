
$('#ticket-container').hide();
$('#valid-container').hide();
$('#invalid-container').hide();
$(document).ready(function () {
    let movie = null;
    $('#login').click(function (e) {
        e.preventDefault();
        // gets the info from the login page
        const userName = $('#username').val();
        const password = $('#password').val();
        //creating customer which save the info
        const customer = new Customer(userName, password);
        if (customer.checkValidAccount()) {
            //check the inputs and move into the ticket order place
            $('#login-container').hide();
            $('#valid-container').hide();
            $('#invalid-container').hide();
            $('#ticket-container').show();
            // creating movie
            movie = new Movie(customer, $('#movie-seat'));
            movie.setUpMovieSeats();
        }
    });
    $('#place-order').click(function () { if (movie) { movie.finishedOrder(); } }); // when click on the button call finishedorder func
    $('#go-back').click(function () { // when click go back buttn show the ticket place again
        $('#valid-container').hide();
        $('#invalid-container').hide();
        $('#ticket-container').show();
    });
    //customer class which check the info
    class Customer {
        constructor(userName, password) {
            this.userName = userName;
            this.password = password;
            this.seatList = [];
        }
        checkValidAccount() {
            if (this.userName.length === 0 || this.password.length < 4) {
                alert('Please check your name or your password (minimum 4 characters).');
                return false;
            }
            return true;
        }
    }
    // movie class represent the ordering place - setup the seats,create the into a div, change the color when click, and check which place to go after order
    class Movie {
        constructor(customer, divToRenderInside) {
            this.customer = customer;
            this.divToRenderInside = divToRenderInside;
            this.cinemaSeats = [];
            this.countdown = null;
        }
        setUpMovieSeats() {
            this.createSeats();
            this.startClock();
            this.arrangeSeats();
        }
        createSeats() {
            for (let i = 1; i <= 20; i++) {
                const seat = new Seat(i);
                this.cinemaSeats.push(seat);
            }
        }
        arrangeSeats() {
            this.cinemaSeats.forEach((seat) => { seat.render(this.divToRenderInside); });
        }
        // clock counting down
        startClock() {
            let totalSeconds = 15 * 60; // 15 minutesssds
            this.updateClock(totalSeconds);
            this.countdown = setInterval(() => {
                totalSeconds--;
                this.updateClock(totalSeconds);
                if (totalSeconds <= 0) {
                    clearInterval(this.countdown);
                    console.log('Countdown finished!');
                    this.showInvalidContainer();
                }
            }, 1000);
        }
        // change the clock evert second 
        updateClock(totalSeconds) {
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const formattedTime = `${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
            $('#clock').text(formattedTime);
        }
        formatTime(time) { return time < 10 ? '0' + time : time; }
        finishedOrder() {
            if (
                this.customer.seatList.length > 4 ||
                this.customer.seatList.length === 0 ||
                $('#clock').text() === '00:00'
            ) { this.showInvalidContainer(); } else { this.showValidContainer(); }
        }
        showValidContainer() {
            $('#ticket-container').hide();
            $('#valid-container').show();
            $('#invalid-container').hide();
            $('#order-name').text('Your order has been placed.');
        }
        showInvalidContainer() {
            $('#ticket-container').hide();
            $('#valid-container').hide();
            $('#invalid-container').show();
            s
        }
    }
    // class for one seat in the order place - change the clock when order or no create the element itself
    class Seat {
        constructor(id) {
            this.id = id;
            this.ordered = false;
            this.seatElement = this.createSeatElement();
        }
        createSeatElement() {
            const seat = document.createElement('div');
            seat.innerText = '🪑';
            seat.id = this.id;
            seat.style.background = 'gray';
            seat.className = 'seat';
            seat.addEventListener('click', this.seatClickHandler.bind(this));
            return seat;
        }
        render(divToRenderInside) { divToRenderInside.append(this.seatElement); }
        seatClickHandler() {
            if (!this.ordered) {
                if ($('.ordered').length >= 4) {
                    alert('You can only select up to 4 seats.');
                    return;
                }
                this.ordered = true;
                this.seatElement.style.background = 'green';
                this.seatElement.classList.add('ordered');
                const seatId = this.id;
                if (movie.customer && movie.customer.seatList) { movie.customer.seatList.push(seatId); }
            } else {
                this.ordered = false;
                this.seatElement.style.background = 'gray';
                this.seatElement.classList.remove('ordered');
                const seatId = this.id;
                if (movie.customer && movie.customer.seatList) {
                    const index = movie.customer.seatList.indexOf(seatId);
                    if (index > -1) { movie.customer.seatList.splice(index, 1); }
                }
            }
        }
    }
});