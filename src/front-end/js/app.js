// actual application here
application = {};

(function(a) {


	// initializes application resources
	a.init = function () {
		if(a.initialized) return;

		a.loading = false;
		// data about user
		a.session = {};
		if(sessionStorage.session != undefined)
			a.session = JSON.parse(sessionStorage.session);

		a.nav = []; // navigation stack
		if(sessionStorage.nav != undefined)
			a.nav = JSON.parse(sessionStorage.nav);

		// handle bars template compilation
		a.hbTemplates = {}; // array of templates
		a.hbTemplates["top-table-entry"] = Handlebars.compile($("#top-table-entry").html());
		a.hbTemplates["auth-frame"] = Handlebars.compile($("#auth-frame").html());
		a.hbTemplates["home-frame"] = Handlebars.compile($("#home-frame").html());
		a.hbTemplates["error-frame"] = Handlebars.compile($("#error-frame").html());
		a.hbTemplates["kill-frame"] = Handlebars.compile($("#kill-frame").html());
		a.hbTemplates["congrats-frame"] = Handlebars.compile($("#congrats-frame").html());

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

		// restore previous session
		if(a.nav.length > 0)
		{
			var navEntry = a.nav[a.nav.length-1];
			a.pushUC(navEntry.frame, navEntry.data);
		}
		else // push auth screen
		a.pushUC("auth-frame", {});
	};

	// pushes UC to screen, binds data and binds related events
	a.pushUC = function(frame, data) {
		var uc = $("#uc");
		uc.fadeToggle();

		setTimeout(function() {
			uc.html("");
			uc.append(a.hbTemplates[frame](data));
			a.bindUC(frame);
		}, 300);

		uc.fadeToggle();
		a.nav.push({
			"frame": frame,
			"data": data
		});
		sessionStorage.nav = JSON.stringify(a.nav); // save to session storage
	};

	a.goBack = function() {
		a.nav.pop(); // remove current
		var last = a.nav.pop(); // remove precedent
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
						a.saveSession();


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
						a.saveSession();

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
				$("#killButton").on("click", function() { a.pushUC("kill-frame", {"target": a.session["data"].target})});
				break;	
			case "kill-frame":
				$("#finishButton").on("click", function() {
					api.killRequest($("#pin").val(), function(r) {
						if(r.status == "ok")
							a.pushUC("congrats-frame", {"target": a.session["data"].target});
						else
							a.pushUC("error-frame", {error: "PIN scorretto!"});
					});
				});
				break;
			case "congrats-frame":
				setTimeout(function() {a.pushUC("home-frame", a.session["data"]);}, 3000 );
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
					a.session["data"] = r;
					a.saveSession();
					a.pushUC("home-frame", r);
				}
				else
					a.pushUC("error-frame", {error: "Errore durante l'autentificazione."});
			});
		}

		else if(result.status == "verify") { // user exists in db, need additional data
			a.session["auth-state"] = "verify";
			a.saveSession();

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

	// saves a.session to session storage
	a.saveSession = function () {
		sessionStorage.session = JSON.stringify(a.session);
	};

	// toggles loading screen in UC frame
	a.toggleLoading = function() {
		var uc = $("#uc");		
		if(a.loading) {
			uc.html(a.ucContent);
			a.loading = false;
		}
		else
		{
			a.ucContent = uc.html();
			uc.html("<div class=\"progress progress-striped active\"><div class=\"bar\" style=\"width: 100%;\"></div></div>");
			a.loading = true;
		}
	};

})(application);

application.init();
application.start();
