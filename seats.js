//Movie Objects Section
let movieObjects;
if (localStorage.getItem('movies')) {
  movieObjects = JSON.parse(localStorage.getItem('movies'));
}
else {
  movieObjects = [
    {
      name: 'Wedding Crashers',
      price: '5.50',
      seatsOccupied: []
    },
    {
      name: 'Ratatouille',
      price: '10.00',
      seatsOccupied: []
    },
    { 
      name: 'Pulp Fiction',
      price: '6.25', 
      seatsOccupied: []
    },
    {
      name: 'Lion King',
      price: '7.33',
      seatsOccupied: []
    },
    {
      name: 'Vertigo',
      price: '8.00',
      seatsOccupied: []
    }
  ];
}

// selected seats not purchased (to be pushed into seatsOccupied)
let userSelectedSeats = [];

//Grabbing our Table from Dom
let seatsSection = document.getElementById('seats');
const seatsTable = seatsSection.children[0];
const seatsTableBody = seatsTable.children[0];
//Grabbing our ticket cost labels 
const ticketQuantityLabel = document.getElementById('quantity');
const ticketPriceLabel = document.getElementById('pricePerTicket');
const totalPriceLabel = document.getElementById('totalPrice');
const moviesSelectValue = document.getElementById('movies');
const purchaseButton = document.getElementById('purchase');
const clearLocalStorage = document.getElementById('clearLocalStorage');

let currentMovieSelected;
let ticketCounter = 0;

//counts how many time the user has switched movies 
//(ie set up clickListeners only on first)
let movieSelectOnChangeCount = 0;
let movieSelected;
let ticketsPurchased = true;

//disable our purchase button until it can be used
purchaseButton.disabled = true;

moviesSelectValue.onchange = function() {
  //no alert for first movie select
  if (movieSelectOnChangeCount === 0){
    purchaseButton.disabled = false;
    swapMovies.call(this);
    movieSelected = moviesSelectValue.value;
  }
  else if (movieSelectOnChangeCount > 0){
    if (!ticketsPurchased) {
      const confirmStatus = confirm(`Do you want to buy these tickets for $${(parseFloat(currentMovieSelected.price) * ticketCounter).toFixed(2)}?`);
      if (confirmStatus){
        //reset html dropdown
        movieSelected = moviesSelectValue.value;
        // if purchased, push to movie
        currentMovieSelected.seatsOccupied = currentMovieSelected.seatsOccupied.concat(userSelectedSeats);
        
        alert(`Total was $${(parseFloat(currentMovieSelected.price) * ticketCounter).toFixed(2)}. Thank you for your purchase!`);
        swapMovies.call(this);
        userSelectedSeats = [];
        const movieObjectsJSON = JSON.stringify(movieObjects);
        localStorage.setItem('movies', movieObjectsJSON);
      } else {
        moviesSelectValue.value = movieSelected;
      }
    }
    //if purchased, push to movie (ie purchased button already pressed)
    else {
      movieSelected = moviesSelectValue.value;
      currentMovieSelected.seatsOccupied = currentMovieSelected.seatsOccupied.concat(userSelectedSeats);
      userSelectedSeats = [];
      swapMovies.call(this);
    }
  }
  
  //setting up our tickets, prices and totals
  function swapMovies() {
    ticketCounter = 0;
    ticketQuantityLabel.innerText = ticketCounter;
    ticketPriceLabel.innerText = `$${movieObjects[this.value].price}`;
    totalPriceLabel.innerText = '$0.00';

    movieSelectOnChangeCount++;
    currentMovieSelected = movieObjects[this.value];
    //pass in selected movie object and change count
    setUpSeatSection(movieObjects[this.value], movieSelectOnChangeCount);
    ticketsPurchased = true;
    purchaseButton.className = '';
  }
}

function resetPurchaseButton() {
  ticketsPurchased = false;
  purchaseButton.className = '';
}

purchaseButton.addEventListener('click', ()=> {
  ticketsPurchased = true;
  if (userSelectedSeats.length !== 0){
    purchaseButton.className = 'purchased';
    alert(`Total was $${(parseFloat(currentMovieSelected.price) * ticketCounter).toFixed(2)}. Thank you for your purchase!`);
  }

  const movieObjectsJSON = JSON.stringify(movieObjects);
  localStorage.setItem('movies', movieObjectsJSON);
});

clearLocalStorage.addEventListener('click', () => {
  localStorage.clear();
  movieObjects.forEach(movieObject => {
    movieObject.seatsOccupied = [];
  });
  location.reload();
});


function setUpSeatSection(movie, movieSelectOnChangeCount) {
  let tableDataCounter = 0;

  for (let i = 0; i < seatsTableBody.children.length; i++) {
    // iterate over our table rows
    
    const seatsTableRow = seatsTableBody.children[i];
    const numTableDataLength = seatsTableRow.children.length;

    for (let j = 0; j < numTableDataLength; j++) {
      // iterate over table squares/data
      tableDataCounter++;
      
      const seatTableData = seatsTableRow.children[j];
      seatTableData.className = '';
      //Add ID to element based on tableDataCounter
      seatTableData.setAttribute('id', tableDataCounter);

      //checks for occupied seats in movie object array and sets their class name 
      if (movie.seatsOccupied.includes(tableDataCounter)){
        seatTableData.className = 'occupiedSeat';
      }
      // if first 
      if (movieSelectOnChangeCount === 1) {
        //selectASeat(currentMovieSelected, seatTableData);
        selectASeat(seatTableData);
      }
     }
  }
}

function workTicketPrices(incremental){
  incremental ? ticketCounter++ : ticketCounter--;
  ticketQuantityLabel.innerText = ticketCounter;
  totalPriceLabel.innerText = `$${(parseFloat(currentMovieSelected.price) * ticketCounter).toFixed(2)}`;
}

function selectASeat(seatTableData){  
  // a global variable called currentMovieSelected
  // but we have a parameter also called currentMovieSelcted
  // ^ that will 'override' the global one

  /*add clickListener:
  - check if seat is already occupied (don't add to seatsOccupied)
  - apply selectedSeat class/color`
  - push seat number to seatsOccupied
  */  
  seatTableData.addEventListener('click', function(e){

    if(seatTableData.className !== 'occupiedSeat'){
      //check if already clicked
      //if clicked, unclick 
      const seatIDNumber = parseInt(e.target.getAttribute('id'));

      if (e.target.className === '') { 
        e.target.className = 'selectedSeat';
        
        userSelectedSeats.push(seatIDNumber);
        
        //update ticket price labels
        workTicketPrices(true);
        resetPurchaseButton();
      }

      else if (e.target.className === 'selectedSeat'){
        e.target.className = '';
        const index = userSelectedSeats.indexOf(seatIDNumber);
        userSelectedSeats.splice(index, 1);
        if (ticketCounter > 0) {
          workTicketPrices(false);
        }
        if (userSelectedSeats.length === 0) {
          ticketsPurchased = true;
        }
      }  
    }
  });

}
