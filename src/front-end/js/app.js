// actual application here
application = {};

(function(a) {


	// initializes application resources
	a.init = function () {
		if(a.initialized) return;

		// data about user
		a.session = {};
		a.session.nav = []; // navigation stack

		// handle bars template compilation
		a.hbTemplates = {}; // array of templates
		a.hbTemplates["top-table-entry"] = Handlebars.compile($("#top-table-entry").html());
		a.hbTemplates["auth-frame"] = Handlebars.compile($("#auth-frame").html());
		a.hbTemplates["home-frame"] = Handlebars.compile($("#home-frame").html());
		a.hbTemplates["error-frame"] = Handlebars.compile($("#error-frame").html());

		a.initialized = true;
	}

	// startes the application
	a.start = function () {
		// get and bind top 5 table
		api.chartRequest(function (result) {
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
		var uc = $("#uc");
		uc.fadeToggle()

		setTimeout(function() {
			uc.html("");
			uc.append(a.hbTemplates[frame](data));
			a.bindUC(frame);
		}, 400);

		uc.fadeToggle();
		a.session.nav.push({
			"frame": frame,
			"data": data
		});
	};

	a.goBack = function() {
		a.session.nav.pop(); // remove current
		var last = a.session.nav.pop(); // remove precedent
		a.pushUC(last.frame, last.data); // repush precedent
	};

	// bind UCs controls callbacks
	a.bindUC = function(frame) {
		switch (frame) {
			case "auth-frame":
				$("form").on("submit", function(e) {
					e.preventDefault();

					console.log("submit!");

					// normal auth request
					if(a.session["auth-state"] != "verify") {
						a.session["login"] = $("#authUsername").val();
						a.session["password"] = $("#authPassword").val();

						api.authRequest(
							a.session["login"],
							a.session["password"],
							a.handleAuthentication);
					}

					// registration verification request
					else {
						a.session["login"] = $("#authUsername").val();
						a.session["password"] = $("#authPassword").val();
						a.session["name"] = $("#authName").val();
						a.session["surname"] = $("#authSurname").val();

						api.verifyRequest(
							a.session["login"],
							a.session["password"],
							a.session["name"],
							a.session["surname"],
							a.handleAuthentication);
					}

				});
 				break;
			case "error-frame":
				$("#goBackButton").on("click", function() {a.goBack()});
				break; 		
			case "home-frame":
				$("#killButton").on("click", function() {a.pushUC("kill-frame")});
				break;		
		};
	};

	/// UX HANDLERS
	a.handleAuthentication = function(result) {

		console.log(result);
		if(result.status == "ok") {
			// make a request for user and the push screen with result
			api.userdataRequest(function(r) {
				if(r.status == "ok") {
					a.session["auth-state"] = "ok";
					a.pushUC("home-frame", r);
				}
				else
					a.pushUC("error-frame", {error: "Errore durante l'autentificazione."});
			});
		}

		else if(result.status == "verify") { // user exists in db, need additional data
			a.session["auth-state"] = "verify";

			// show the registration form
			$("form").find(":hidden").each(function() {$(this).slideToggle();});
			$("#authButton").text("Iscriviti");
		}

		else if(result.status == "fail")
		{
			a.pushUC("error-frame", {error: "Errore durante l'autentificazione."});
		}

		else // unavailable
		{
			a.pushUC("error-frame", {error: "Server d'autentificazione attualmente non disponibile, riprovare piu' tardi."});
		}
	};

})(application);

application.init();
application.start();
