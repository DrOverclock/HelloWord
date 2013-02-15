// actual application here
application = {};

(function(a) {


	// initializes application resources
	a.init = function () {
		if(a.initialized) return;

		// handle bars template compilation
		a.hbTemplates = {}; // array of templates
		a.hbTemplates["top-table-entry"] = Handlebars.compile($("#top-table-entry").html());
		a.hbTemplates["auth-frame"] = Handlebars.compile($("#auth-frame").html());
		a.hbTemplates["home-frame"] = Handlebars.compile($("#home-frame").html());

		a.initialized = true;
	}

	// startes the application
	a.start = function () {
		// get and bind top 5 table
		getTop5(function (result) {
			var t = $("#top5"); // get table element
			for (var i = 0 ; i < result.length; i++) {
				// compile, create and append
				t.append(a.hbTemplates["top-table-entry"](result[i]));
			};
		});

		// push auth screen
		a.pushUC("auth-frame", {});
	};

	// pushes UC to screen, binds data and binds related events
	a.pushUC = function(frame, data) {
		var uc = $("#uc").html("");
		uc.append(a.hbTemplates[frame](data));
		a.bindUC(frame);
	};

	// bind UCs controls callbacks
	a.bindUC = function(frame) {
		switch (frame) {
			case "auth-frame":
				$("form").on("submit", function(e) {
					e.preventDefault();
					authenticate(
						$("#authUsername").val(),
						$("#authPassword").val(),
						a.handleAuthentication);
				});
 				break;
		};
	};

	/// UX HANDLERS
	a.handleAuthentication = function(result) {
		console.log(result);
		if(result.status == "ok")
			a.pushUC("home-frame", result.data);
	};

})(application);

application.init();
application.start();
