var mongoose = require('mongoose');
var express = require('express');

module.exports = (function() {
	'use strict';
    var fallout = express.Router();    
	var Schema = mongoose.Schema;

	var falloutSchema = new Schema({
		custId : { type: Schema.ObjectId, ref: 'CustomerInfo' },
		comment : String
	},{ collection: 'FalloutAppointment' });

	var model = mongoose.model('FalloutAppointment', falloutSchema);
	var coreFallout;
	    
	fallout.post('/insert', function (request, response) {
		console.log("inside");
    	var cusObj = {
    		custId : request.body.custId,
    		comment : request.body.comment
    	}

    	coreFallout = new model(cusObj);

    	coreFallout.save(function (err) {
    	  if (err)
    		  response.send({status:"error",message:err});
    	  else
    		  response.send({status:"success",_id:coreFallout._id});
    	})    	
    });   
    
	return fallout;

})();