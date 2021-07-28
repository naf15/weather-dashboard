var dateContainer = $('#date');

var todaysDate = moment().format('MMM Do, YYYY');

dateContainer.text(todaysDate);

console.log(todaysDate)




/*=====================
WIDGETS
=====================*/

// Autocomplete

$( function() {
    var availableTags = [
      "ActionScript",
      "AppleScript",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
    ];
    $( "#city-input" ).autocomplete({
      source: availableTags
    });
  } );