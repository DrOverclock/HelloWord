// api for itisfobia web service
/***

Authenticates a user with `username` and `password`, then calls the `callback`.
Object with state and user data is passed to `callback`.

***/
function authenticate(username, password, callback) {
	// TODO: replace with actual authentication
	if(username == 'dan' && password == "tuma")
	{
		callback({
			status: "ok"
		});
	}
	else
	{
		callback({
			status: "verify"
		});
	}
}

api = {};

(function(f){

	/***

	Gets top 5 players, then calls `callback` with responce array as argument. 
	Players are ordered by score in descending order.

	***/
	f.chartRequest = function(callback) {
		// TODO: replace with actual data
		callback([
				{
					number: 1,
					name: "Player 0",
					score: "10"
				},
				{
					number: 2,
					name: "Player 1",
					score: "9"
				},
				{
					number: 3,
					name: "Player 2",
					score: "8"
				},
				{
					number: 4,
					name: "Player 3",
					score: "7"
				},
				{
					number: 5,
					name: "Player 4",
					score: "6"
				}
			]);
	};


	/***

	Authenticates a user with `username` and `password`, then calls the `callback`.
	Object with state and user data is passed to `callback`.

	***/
	f.authRequest = function(username, password, callback) {
		// TODO: replace with actual authentication
		console.log("auth!");
		if(username == 'dan')
		{
			callback({
				status: "ok"
			});
		}		
		else if(username == 'cesco')
		{
			callback({
				status: "verify"
			});
		}		
		else if(username == 'patrick')
		{
			callback({
				status: "fail"
			});
		}
		else
		{
			callback({
				status: "unavailable"
			});
		}
	};

	/***

	Submits a user data to server, then calls `callback` with result.

	***/
	f.verifyRequest = function(username, password, name, surname, callback) {
		console.log("verify!");
		// TODO: actual code
		if(username == "dan")
		{
			callback({
				status: "ok"
			});
		}
		else
		{
			callback({
				status: "fail"
			});
		}
	};


	/***

	Gets user data for current user, then calls `callback` with result.

	***/
	f.userdataRequest =  function (callback) {
		console.log("get user data!");
		callback({
			status: "ok",
			name: "Dan Tumaykin",
			course: "5A IN",
			dieFrase: "Embrace the eternity!",
			pin: "007",
			score: 9001,
			target: "Alessandro Verona",
			section: "Triennio Informatica",
			killFrase: "WLF"
		});
	};

	f.killRequest = function(pin, callback) {
		console.log("finish him!");
		callback({
			status: "ok"
		});
	};

})(api);