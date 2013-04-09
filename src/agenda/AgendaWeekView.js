
fcViews.agendaWeek = AgendaWeekView;

function AgendaWeekView(element, calendar) {
	var t = this;
	
	
	// exports
	t.render = render;
	t.renderSessions = renderSessions;
	t.clearSessions = clearSessions;
	
	
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

	function clearSessions(){
		var nodes = $("tbody").find(".active").css("background", "transparent").removeClass("active");
		nodes.find(".title").html("");
	}

	function renderSessions(sessions) {
		var interval = calendar.options.slotMinutes
		var slotNum = ((t.end - t.start)/(1000*60*interval));

		if(!sessions) return;
		
		var _sessions = sessions.filter(function (el) {
			return (el.start < t.end) && (el.end > t.start)
		});
		
		for(var s=0; s < _sessions.length; s++)
		{
			var session = _sessions[s];
			var selector = [];
			var time = cloneDate(t.start)
			var ts = ((session.start.getDay() - opt('firstDay')) + 7) % 7;

			if(opt('weekends') == false && opt('firstDay') == 0)
			{
				ts -= 1
			}

			for(var i=0; i<slotNum; i++)
			{
				if((time >= session.start) && (time < session.end))
				{
					selector.push(".ts-" + ts + formatDate(time, "-HH-mm"));
				}
				addMinutes(time, interval);
			}

			var nodes = $("tbody").find(selector.join())
								  .attr("data-location", session.location)
								  /*.addClass("active")*/
								  .css("background", session.colour? session.colour : "white")
			if (session.title)
				nodes.find(".title").html(" - " + session.title)
		}
	}
}