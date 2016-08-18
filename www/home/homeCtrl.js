(function homeCtrl () {
  'use strict';

  www.controller('homeCtrl', ['$scope', homeCtrl]);

  function homeCtrl($scope) {
    $scope.foo = {a:1};
    var sc = $scope;
    var calendarEvents = [
      {
        title: 'demo-event',
        start: moment().format('YYYY-MM-DD'),
        color: 'red',
        textColor: 'black'
      }
    ];
    var menuWidth = 400;

    var CLIENT_ID = '307520883194-jbf6t1ic6lr2s7lsh9huu403cafqqkia.apps.googleusercontent.com';
    var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

    /**
     * Check if current user has authorized this application.
     */
    $scope.checkAuth = function () {
      gapi.auth.authorize(
        {
          'client_id': CLIENT_ID,
          'scope': SCOPES.join(' '),
          'immediate': true
        }, handleAuthResult);
    }

    setTimeout($scope.checkAuth, 1000);

    /**
     * Handle response from authorization server.
     *
     * @param {Object} authResult Authorization result.
     */
    function handleAuthResult(authResult) {
      var authorizeDiv = document.getElementById('authorize-div');
      if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        $scope.loadCalendarApi();
      } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
      }
    }

    /**
     * Initiate auth flow in response to user clicking authorize button.
     *
     * @param {Event} event Button click event.
     */
    $scope.handleAuthClick = function (event) {
      gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResult);
      return false;
    };

    /**
     * Load Google Calendar client library. List upcoming events
     * once client library is loaded.
     */
    $scope.loadCalendarApi = function () {
      gapi.client.load('calendar', 'v3', listUpcomingEvents);
    }

    /**
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
    function listUpcomingEvents() {
      var request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      });

      request.execute(function(resp) {
        var events = resp.items;

        if (events.length > 0) {
          for (var i = 0; i < events.length; i++) {
            var event = events[i];
            var when = moment(event.start.dateTime || event.start.date)
              .format('YYYY-MM-DD');
            var upto = moment(event.end.dateTime || event.end.date)
              .format('YYYY-MM-DD');
            var event = {
              title: event.summary,
              start: when,
              end: upto
            };
            $('#calendar').fullCalendar('renderEvent', event, true);
          }
        }
      });
    }

    $('#calendar').fullCalendar({
      eventSources: [{
        events: calendarEvents
      }],
      dayClick: clickHandler.bind(null, $scope)
    });

    function clickHandler ($scope, date, jsEvent) {
      $scope.currentEventDate = 'no';
      var left = jsEvent.pageX > menuWidth/2 ?
        jsEvent.pageX - menuWidth/2 : jsEvent.pageX;
      var top = jsEvent.pageY + 11;

      $('#menu').css( 'top', top);
      $('#menu').css( 'left', left);
      $('#menu').show();
    }
  }
}());