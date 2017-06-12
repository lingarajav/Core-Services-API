var mongoose = require('mongoose');
var express = require('express');

module.exports = (function() {
	'use strict';
    var appointment = express.Router();
	var Schema = mongoose.Schema;

	var appointmentSchema = new Schema({
		customerName : {type : String, required : true},
		email : String,
		phoneNo : String,
		created : Date,
		type : String,
		orderTotal : String,
		date : String,
		service : String,
		duration : String,
		staff : String,
		price : String,
		bookingNo : String,
		bookingStatus : String,
		orderNo : String,
		custId : { type: Schema.ObjectId, ref: 'CustomerInfo' },
		cardHolderName : String,
		isvisited : Boolean,
		serviceStartTime : String		
//		serviceCompletiondate : Date
	},{ collection: 'Appointments' });

	var model = mongoose.model('Appointments', appointmentSchema);
	var coreAppointment;
    
	appointment.post('/insert', function (request, response) {
		
    	var cusObj = {
    		customerName : request.body.name,
    		email : request.body.email,
    		created : request.body.created,
    		date : request.body.date,
    		service : request.body.service,
    		duration : request.body.duration,
    		staff : request.body.staff,
    		price : request.body.price,
    		bookingNo : request.body.bookingNo,
    		orderNo : request.body.orderNo,
    		custId : mongoose.Types.ObjectId(request.body.custId),
    		cardHolderName : request.body.cardHolderName,
    		serviceStartTime : request.body.serviceStartTime
    	}

    	coreAppointment = new model(cusObj);

    	coreAppointment.save(function (err) {
    	  if (err)
    		  response.send({status:"error",message:err});
    	  else
    		  response.send({status:"success",_id:coreAppointment._id});
    	});    	
    });
	
	appointment.post('/get', function (request, response) {
		var searchQuery = { $and: [
	       {'custId':request.body.custId},
	       {'bookingNo': request.body.bookingNo},
	       {'date':request.body.date},
	       {'serviceStartTime':request.body.serviceStartTime}
	    ]};
     	model.find(searchQuery).exec(function(err, customers) {
     		response.send(customers);
     	});    	
    });
	
	appointment.post("/search", function (request, response) {
		var cardholderName = request.body.cardholderName;
		if (cardholderName.indexOf(' ') >= 0) {
			var names = cardholderName.split(" ");
			var fName = names[0];
			var lName = names[1];
     		var searchQuery = {
     	      $or: [
     	          { $and: [{'customerName':fName}, {'date':new Date()}] },
     	          { $and: [{'customerName':lName}, {'date':new Date()}] },
     	          { $and: [{'customerName':cardholderName}, {'date':new Date()}] },
     	          { $and: [{'customerName':fName + " " + lName.charAt(0)}, {'date':new Date()}] },
	     	      { $and: [{'customerName':lName + " " + fName.charAt(0)}, {'date':new Date()}] }
     	      ]
     		};
         	model.find(searchQuery).distinct('custId',function(err, customers) {
         		response.send(customers);
         	});
		} else {
     		var searchQuery = { $and: [{'customerName':cardholderName}, {'date':new Date()}] };
         	model.find(searchQuery).exec(function(err, customers) {
         		response.send(customers);
         	});
		}
	});
	
//	appointment.post("/search", function (request, response) {
//		var searchObj = {};
//		if (request.body.searchCriteria.length > 1) {
//			searchObj.$and = [];
//			for(var i=0; i<request.body.searchCriteria.length; i++) {
//				var obj = {};
//				if (request.body.searchCriteria[i].condition == "="){
//					obj[request.body.searchCriteria[i].field] = request.body.searchCriteria[i].value;
//					searchObj.$and.push(obj);
//				} else {
//					var conObj = {};
//					conObj[request.body.searchCriteria[i].condition] = request.body.searchCriteria[i].value;
//					obj[request.body.searchCriteria[i].field] = conObj;
//					searchObj.$and.push(obj);					
//				}
//			}			
//		} else {
//			if (request.body.searchCriteria[0].condition == "="){
//				searchObj[request.body.searchCriteria[0].field] = request.body.searchCriteria[0].value;
//			} else if (request.body.searchCriteria[0].condition == "$regex") {
//				var conObj = {};
//				conObj[request.body.searchCriteria[0].condition] = request.body.searchCriteria[0].value;
//				conObj.$options = "i";
//				searchObj[request.body.searchCriteria[0].field] = conObj;
//			} else {
//				var conObj = {};
//				conObj[request.body.searchCriteria[0].condition] = request.body.searchCriteria[0].value;
//				searchObj[request.body.searchCriteria[0].field] = conObj;
//			}			
//		}
//    	model.find(searchObj).exec(function(err, appointments) {
//    	    if (err) 
//      		  response.send({status:"error",message:err});
//      	  	else 
//      		  response.send(appointments);
//      	}); 		
//	
//	});
    
	return appointment;

})();
