// api for itisfobia web service

// Gets top 5 players, then calls `callback` with responce array as argument. Players are ordered by score in descending order.
function getTop5 (callback) {
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