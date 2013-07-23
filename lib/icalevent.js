
var tzone = require('tzone');


var iCalEvent = function(){
	this.version = '2.0';
	this.id = '-//shanebo//iCalEvent.js v0.2//EN';
	this.uid = this.uuid();
	this.event = {};
}

iCalEvent.prototype = {

	uuid: function(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	},

	format: function(datetime){

		function pad(n){
			n = parseInt(n);
			return n < 10 ? '0' + n : '' + n;
		}

		var d = new Date(datetime);
		d.setUTCMinutes(d.getUTCMinutes() - this.event.offset);

		padded = (d.getUTCFullYear()
			+ pad(d.getUTCMonth() + 1)
			+ pad(d.getUTCDate()) + 'T'
			+ pad(d.getUTCHours())
			+ pad(d.getUTCMinutes())
			+ pad(d.getUTCSeconds()));

		return padded;
	},

	set: function(key, value){
		if (this[key]) this[key](value)
		else this.event[key] = value;
	},

	organizer: function(obj){
		this.event.organizer = obj;
	},

	start: function(datetime){
		var d = new Date(datetime);
		d.setUTCMinutes(d.getUTCMinutes() - this.event.offset);
		this.event.location = tzone.getLocation(d);
		this.event.starts = this.format(datetime);
	},

	end: function(datetime){
		this.event.ends = this.format(datetime);
	},

	summary: function(summary){
		this.event.summary = summary;
	},

	toFile: function(){
		var result = '';
		result += 'BEGIN:VCALENDAR\r\n';
		result += 'METHOD:REQUEST\r\n';
		result += 'BEGIN:VEVENT\r\n';
		result += 'UID:' + this.uid + '\r\n';
		result += 'DTSTAMP:' + this.format(new Date()) + '\r\n';
		if (this.event.organizer) 	result += 'ORGANIZER;CN="' + this.event.organizer.name + '":mailto:' + this.event.organizer.email + '\r\n';
		if (this.event.starts) 		result += 'DTSTART:' + this.event.starts + '\r\n';
		if (this.event.ends) 		result += 'DTEND:' + this.event.ends + '\r\n';
		if (this.event.url) 		result += 'URL;VALUE=URI:' + this.event.url + '\r\n';
		if (this.event.summary) 	result += 'SUMMARY:' + this.event.summary + '\r\n';

		result += 'END:VEVENT\r\n';
		result += 'END:VCALENDAR\r\n';
		return result;
	}

}


module.exports = iCalEvent;