
fcViews.agendaWeek = AgendaWeekView;

function AgendaWeekView(element, calendar) {
	var t = this;
	
	
	// exports
	t.render = render;
	t.renderSessions = renderSessions;
	
	
	// imports
	AgendaView.call(t, element, calendar, 'agendaWeek');
	var opt = t.opt;
	var renderAgenda = t.renderAgenda;
	var formatDates = calendar.formatDates;
	
	
	
	function render(date, delta) {
		if (delta) {
			addDays(date, delta * 7);
		}
		var start = addDays(cloneDate(date), -((date.getDay() - opt('firstDay') + 7) % 7));
		var end = addDays(cloneDate(start), 7);
		var visStart = cloneDate(start);
		var visEnd = cloneDate(end);
		var weekends = opt('weekends');
		if (!weekends) {
			skipWeekend(visStart);
			skipWeekend(visEnd, -1, true);
		}
		t.title = formatDates(
			visStart,
			addDays(cloneDate(visEnd), -1),
			opt('titleFormat')
		);
		t.start = start;
		t.end = end;
		t.visStart = visStart;
		t.visEnd = visEnd;
		renderAgenda(weekends ? 7 : 5);
	}

	function renderSessions() {
		/*var d1 = new Date().getTime();*/
		$("tbody").find(".active").css("background", "transparent").removeClass("active");

		var options = calendar.options;
		var interval = options.slotMinutes
		var slotNum = ((t.end - t.start)/(1000*60*interval));
		var _sessions = [];

		if(!options.sessions) return

		if ($.isFunction(options.sessions)) {
			_sessions = options.sessions()
		}
		else if ($.isArray(options.sessions)) {
			_sessions = options.sessions
		}

		var sessions = _sessions.filter(function (el) {
			return (el.start < t.end) && (el.end > t.start)
		});
		
		if(!sessions || sessions.length < 1) return;
		
		for(var s=0; s < sessions.length; s++)
		{
			var session = sessions[s];
			var selector = "";
			var time = cloneDate(t.start)

			for(var i=0; i<slotNum; i++)
			{
				if((time >= session.start) && (time < session.end))
				{
					selector += ".ts-" + time.getDay() + formatDate(time, "-HH-mm") + ", ";
				}
				addMinutes(time, interval);
			}
			$("tbody").find(selector).addClass("active").css("background", session.colour? session.colour : "white")
		}
		/*console.log(new Date().getTime() - d1)*/
	}
}