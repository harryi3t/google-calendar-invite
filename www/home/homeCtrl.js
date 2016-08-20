(function homeCtrl () {
  'use strict';

  www.controller('homeCtrl', ['$scope', homeCtrl]);

  function homeCtrl($scope) {
    $scope.isAuthorized = false;
    $scope.loadedMonths = new Set();
    var calendarEvents = [];
    var menuWidth = 400;

    var CLIENT_ID = '307520883194-jbf6t1ic6lr2s7lsh9huu403cafqqkia.apps.googleusercontent.com';
    var SCOPES = ["https://www.googleapis.com/auth/calendar"];

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
        $scope.isAuthorized = true;
        $scope.loadCalendarApi();
      } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
        $scope.isAuthorized = false;
      }
      $scope.$apply();
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
    function listUpcomingEvents(monthsPrev, monthsNext) {
      var timeMin = monthsPrev || moment().startOf('month')
        .add(0,'month').format();
      var timeMax = monthsNext || moment().endOf('month')
        .add(1,'month').format();

      if ($scope.loadedMonths.has(timeMin)) {
        console.info('skipping for ', timeMin);
        return;
      }

      $scope.loadedMonths.add(timeMin);
      if (!monthsNext) {
        var nextMonthStartDate = moment().startOf('month')
          .add(1,'month').format()
        $scope.loadedMonths.add(nextMonthStartDate);
      }

      var request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': timeMin,
        'timeMax': timeMax,
        'showDeleted': false,
        'singleEvents': true,
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
      height: 'auto',
      header: {
        left: 'prev next today',
        center: 'title',
        right: 'month basicWeek basicDay'
      },
      dayClick: clickHandler.bind(null, $scope)
    });

    function clickHandler ($scope, date, jsEvent) {
      $scope.currentEventDate = date;
      var left = jsEvent.pageX > menuWidth/2 ?
        jsEvent.pageX - menuWidth/2 : jsEvent.pageX;
      var top = jsEvent.pageY + 11;

      $('#menu').css( 'top', top);
      $('#menu').css( 'left', left);
      $('#menu').show();
    }

    $scope.cancelInvite = function () {
      $('#menu').hide();
    };
    $scope.sendInvite = function () {
      var event = getEventObject();
      var request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        sendNotifications: true,
      });

      request.execute(function(event) {
        console.log(event);
      });
    };

    $scope.isValidInvite = function () {
      if (!$scope.summary) return false;
      if (!$scope.email) return false;
      if (!$scope.location) return false;
      return true;
    };

    function getEventObject() {
      return {
        summary: $scope.summary,
        location: $scope.location,
        description: $scope.description,
        timezone: 'local',
        start: {
          date: $scope.currentEventDate.format()
        },
        end: {
          date: $scope.currentEventDate.format()
        },
        attendees: [
          {email: $scope.email},
        ],
        reminders: {
          useDefault: false,
          overrides: [
            {method: 'email', minutes: 24 * 60},
            {method: 'popup', minutes: 10}
          ]
        }
      };
    }

    $('.fc-next-button').click(loadCurrentMonthEvents);
    $('.fc-prev-button').click(loadCurrentMonthEvents);

    function loadCurrentMonthEvents() {
      var curStartMonthDate =
        moment($('#calendar').fullCalendar('getDate'))
        .local()
        .startOf('month')
        .format();
      var curEndMonthDate =
        moment($('#calendar').fullCalendar('getDate'))
        .local()
        .endOf('month')
        .format();

      listUpcomingEvents(curStartMonthDate, curEndMonthDate);
    }

  }
}());