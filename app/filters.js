module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  var filters = {}

  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */

// Date filter - https://github.com/e-picas/nunjucks-date-filter
var dateFilter = require('nunjucks-date-filter');
dateFilter.install();
dateFilter.setDefaultFormat('DD/MM/YYYY');

filters.date = dateFilter;

filters.dateTimeLong = function(dateTime) {
  return dateFilter(dateTime, "ddd, DD MMM YYYY hh:mm");
}

filters.dateTimeVerbose = function(dateTime) {
  return dateFilter(dateTime, "D MMMM YYYY [at] H:mm");
}

// Return false if JSON property is defined but has no value
filters.isEmptyObject = function(obj) {
    return JSON.stringify(obj) === "{}";
}





  return filters
}
