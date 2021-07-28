var dateContainer = $('#date');

var todaysDate = moment().format('MMM Do, YYYY');

dateContainer.text(todaysDate);

console.log(todaysDate)