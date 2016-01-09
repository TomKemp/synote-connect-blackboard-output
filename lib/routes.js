
//TEMP
var outputUser = "administrator";


module.exports = function(config,utilFunctions,input){

	var auth = require("./auth")(config);

	return {
		'GET /connect/course/:id': function (req, res, next) {
			var courseId = req.param("id");
			//var token = req.param("token");

			//auth.verifyToken(token,function(err,outputUser){
				//if(err){
				//	return res.json(401);
				//}

				utilFunctions.getCourseContents(courseId,outputUser,function(err,contents){
					if(err){
						console.log(err);
						res.status(401);
						return res.send("Not authorised");
					}

					var configured = contents !== null;

					var response = {
						configured : configured,
						recordings : contents
					}



					return res.json(response);
				});

			//});

			
		},

		'POST /connect/course': function (req, res, next) {
			//var token = req.param("token");

			//auth.verifyToken(token,function(err,user){
				//if(err){
				//	return res.json(401);
				//}

				var details = req.body;
				delete details.token;

				utilFunctions.configureCourse(details,outputUser,function(err,success){
					if(err){
						res.status(500);
						return res.send("error");
					}
				 	res.status(200);
				 	return res.send("ok");
				});

			//});

			
		},
		/*
			currentCollections
			allCollections
			suggestedCollections

		*/
		'GET /connect/course/:id/mappings': function (req, res, next) {
			if(!input){
				res.status(400);
				return res.send("Cannot be used without input configured");
			}

			var courseId = req.param("id");
			//var token = req.param("token");
			//auth.verifyToken(token,function(err,user){
				//if(err){
				//	return res.json(401);
				//}

				utilFunctions.getMappings(courseId,outputUser,function(err,contents){
					if(err){
						res.status(401);
						return res.send("Not authorised");
					}
					return res.json(contents);
				});

			//});
		},
		'POST /connect/course/:id/mappings': function (req, res, next) {
			if(!input){
				res.status(400);
				return res.send("Cannot be used without input configured");
			}

			var courseId = req.param("id");
			//var token = req.param("token");
			var collection = req.body.collection;

			//auth.verifyToken(token,function(err,user){
				//if(err){
				//	return res.json(401);
				//}

			if(!_.isArray(collection)){
				collection = [collection];
			}


			async.eachSeries(collection, function(id, callback) {

				utilFunctions.createMapping(courseId,id,outputUser,function(err,contents){
					if(err){
						return callback(err);
					}
					return callback(null,true);
				});

			}, function(err){
				if(err){
					res.status(401);
					return res.send("Not authorised");
				}
			    
			    return res.ok();
			});

			//});

			
		},
		'DELETE /connect/course/:id/mappings': function (req, res, next) {
			if(!input){
				res.status(400);
				return res.send("Cannot be used without input configured");
			}

			var courseId = req.param("id");
			//var token = req.param("token");
			var collection = req.body.collection;

			//auth.verifyToken(token,function(err,user){
				//if(err){
				//	return res.json(401);
				//}

			if(!_.isArray(collection)){
				collection = [collection];
			}


			async.eachSeries(collection, function(id, callback) {

				utilFunctions.deleteMapping(courseId,id,outputUser,function(err,contents){
					if(err){
						return callback(err);
					}
					return callback(null,true);
				});

			}, function(err){
				if(err){
					res.status(401);
					return res.send("Not authorised");
				}
			    
			    return res.ok();
			});

			//});

			
		},
		'GET /connect/course/:id/suggest': function (req, res, next) {
			if(!input){
				res.status(400);
				return res.send("Cannot be used without input configured");
			}
			
			var courseId = req.param("id");
			//var token = req.param("token");




			//auth.verifyToken(token,function(err,user){
				//if(err){
				//	return res.json(401);
				//}

				utilFunctions.getPossibleMappings(courseId,outputUser,function(err,contents){
					if(err){
						res.status(401);
						return res.send("Not authorised");
					}
					return res.json(contents);
				});


				/*utilFunctions.getMappings(courseId,user,function(err,contents){
					if(err){
						return res.json(401);
					}
					return res.json(contents);
				});*/

				

			//});
		}

	}
}

//As a particular user

//Current mappings
//Suggested mappings
//Collection contents
//New mapping
//Delete mapping