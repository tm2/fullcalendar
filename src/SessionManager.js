function SessionManager(options, _sessions) {
    var t = this;

    t.fetchSessions = fetchSessions;
    
    // imports
    var trigger = t.trigger;
    var getView = t.getView;
    var reportSessions = t.reportSessions;
    
    
    // locals
    var sessions = _sessions || [];
    
    /* Fetching
    -----------------------------------------------------------------------------*/
    
    function fetchSessions() {
        if (sessions) {
            if ($.isFunction(sessions)) {
                reportSessions(sessions());
            }
            else if ($.isArray(sessions)) {
                reportSessions(sessions);
            }
            else {
                reportSessions([]);
            }
        }
        else{
            reportSessions([])
        }
    }
}