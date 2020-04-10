var wsUri = "ws://127.0.0.1:8181/";
var websocket = new WebSocket(wsUri);
var indicator = document.getElementById("indicator");
var offsetX = 0.0, offsetY = 0.0;

websocket.onopen = function (e) {
    
};

websocket.onclose = function (e) {
    
};

websocket.onmessage = function (e) {
    applyCoordinates(e.data);
};

websocket.onerror = function (e) {
    
};

function applyCoordinates(message) {
    var coords = message.split(";");
    var tracked_values ={
        browser_x : Mir_windowTools.get_browserweb_coordinates().x,
        browser_y : Mir_windowTools.get_browserweb_coordinates().y,
        browser_width : Mir_windowTools.get_browserweb_size().width,
        browser_height : Mir_windowTools.get_browserweb_size().height,
        viewport_width : Mir_windowTools.get_viewPort_size().width,
        viewport_height : Mir_windowTools.get_viewPort_size().height,
        calculated_viewport_x : Mir_windowTools.get_browserweb_coordinates().x,
        calculated_viewport_y : Mir_windowTools.get_browserweb_coordinates().y + (Mir_windowTools.get_browserweb_size().height - Mir_windowTools.get_viewPort_size().height),
		screen_width : Mir_windowTools.get_screen_size().width,
        screen_height : Mir_windowTools.get_screen_size().height,
    }
	
	var newX = coords[0] * tracked_values.screen_width - tracked_values.calculated_viewport_x + offsetX;
    var newY = coords[1] * tracked_values.screen_height - tracked_values.calculated_viewport_y + offsetY;
    
    indicator.style.left=newX;
    indicator.style.top=newY;
}

// TOOLS for position transpose

if (!Mir_windowTools) { var Mir_windowTools = new Object(); };

Mir_windowTools = {
    scrollBarPadding: 17, // padding to assume for scroll bars

    //CUSTOM
    get_browserweb_coordinates: function () {
        //NOT SUPPORTED by IE8 or less
        coordX = (typeof window.screenLeft == "number") ? window.screenLeft : window.screenX;
        coordY = (typeof window.screenTop == "number") ? window.screenTop : window.screenY;
        return {
            x: coordX,
            y: coordY
        };
    },

    //CUSTOM
    get_browserweb_size: function () {
        //NOT SUPPORTED by IE8 or less
        var width = window.outerWidth;
        var height = window.outerHeight;
        var result = {};
        result.width = width;
        result.height = height;

        return result;
    },

    get_document_size: function () {
        // document dimensions
        var viewportWidth, viewportHeight;
        if (window.innerHeight && window.scrollMaxY) {
            viewportWidth = document.body.scrollWidth;
            viewportHeight = window.innerHeight + window.scrollMaxY;
        } else if (document.body.scrollHeight > document.body.offsetHeight) {
            // all but explorer mac
            viewportWidth = document.body.scrollWidth;
            viewportHeight = document.body.scrollHeight;
        } else {
            // explorer mac...would also work in explorer 6 strict, mozilla and safari
            viewportWidth = document.body.offsetWidth;
            viewportHeight = document.body.offsetHeight;
        };
        return {
            width: viewportWidth,
            height: viewportHeight
        };
    },

    get_viewPort_size: function () {
        // view port dimensions
        var windowWidth, windowHeight;
        if (self.innerHeight) {
            // all except explorer
            windowWidth = self.innerWidth;
            windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) {
            // explorer 6 strict mode
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else if (document.body) {
            // other explorers
            windowWidth = document.body.clientWidth;
            windowHeight = document.body.clientHeight;
        };
        return {
            width: windowWidth,
            height: windowHeight
        };
    },

    get_scroll_offset: function () {
        // viewport vertical scroll offset
        var horizontalOffset, verticalOffset;
        if (self.pageYOffset) {
            horizontalOffset = self.pageXOffset;
            verticalOffset = self.pageYOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) {
            // Explorer 6 Strict
            horizontalOffset = document.documentElement.scrollLeft;
            verticalOffset = document.documentElement.scrollTop;
        } else if (document.body) {
            // all other Explorers
            horizontalOffset = document.body.scrollLeft;
            verticalOffset = document.body.scrollTop;
        };
        return {
            horizontal: horizontalOffset,
            vertical: verticalOffset
        };
    },
	
    get_screen_size: function() 
    {
        return {
            height: window.screen.height,
            width: window.screen.width
        };
    },
};