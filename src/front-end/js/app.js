// actual application here

(function() {
	// handle bars template compilation
	var source   = $("#top-table-entry").html();
	var hbTemplates = {}; // array of templates
	hbTemplates["top-table-entry"] = Handlebars.compile(source);

	// get and bind top 5 table
	getTop5(function (result) {
		var t = $("#top5"); // get table element
		for (var i = 0 ; i < result.length; i++) {
			// compile, create and append
			t.append(hbTemplates["top-table-entry"](result[i]));
		};
	});
})();
