
fcViews.agendaDay = AgendaDayView;

function AgendaDayView(element, calendar) {
	var t = this;
	
	
	// exports
	t.renderSessions = renderSessions;
	t.clearSessions = clearSessions;
	t.render = render;
	
	
	// imports
	AgendaView.call(t, element, calendar, 'agendaDay');
	var opt = t.opt;
	var renderAgenda = t.renderAgenda;
	var formatDate = calendar.formatDate;
	
	
	
	function render(date, delta) {
		if (delta) {
			addDays(date, delta);
			if (!opt('weekends')) {
				skipWeekend(date, delta < 0 ? -1 : 1);
			}
		}
		var start = cloneDate(date, true);
		var end = addDays(cloneDate(start), 1);
		t.title = formatDate(date, opt('titleFormat'));
		t.start = t.visStart = start;
		t.end = t.visEnd = end;
		renderAgenda(1);
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

			for(var i=0; i<slotNum; i++)
			{
				if((time >= session.start) && (time < session.end))
				{
					selector.push(".ts-0" + formatDate(time, "-HH-mm"));
				}
				addMinutes(time, interval);
				
			}

			var nodes = $("tbody").find(selector.join()).attr("data-location", session.location).addClass("active").css("background", session.colour? session.colour : "white")
			if (session.title)
				nodes.find(".title").html(" - " + session.title)
		}
	}
	

}
