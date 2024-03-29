/**
 * jQuery.timers - Timer abstractions for jQuery
 * Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
 * Date: 2009/02/08
 *
 * @author Blair Mitchelmore
 * @version 1.1.2
 *
 **/
jQuery.fn.extend({
	everyTime: function(interval, label, fn, times, belay) {
		return this.each(function() {
			jQuery.timer.add(this, interval, label, fn, times, belay);
		});
	},
	oneTime: function(interval, label, fn) {
		return this.each(function() {
			jQuery.timer.add(this, interval, label, fn, 1);
		});
	},
	stopTime: function(label, fn) {
		return this.each(function() {
			jQuery.timer.remove(this, label, fn);
		});
	}
});

jQuery.event.special

jQuery.extend({
	timer: {
		global: [],
		guid: 1,
		dataKey: "jQuery.timer",
		regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
		powers: {
			// Yeah this is major overkill...
			'ms': 1,
			'cs': 10,
			'ds': 100,
			's': 1000,
			'das': 10000,
			'hs': 100000,
			'ks': 1000000
		},
		timeParse: function(value) {
			if (value == undefined || value == null)
				return null;
			var result = this.regex.exec(jQuery.trim(value.toString()));
			if (result[2]) {
				var num = parseFloat(result[1]);
				var mult = this.powers[result[2]] || 1;
				return num * mult;
			} else {
				return value;
			}
		},
		add: function(element, interval, label, fn, times, belay) {
			var counter = 0;
			
			if (jQuery.isFunction(label)) {
				if (!times) 
					times = fn;
				fn = label;
				label = interval;
			}
			
			interval = jQuery.timer.timeParse(interval);

			if (typeof interval != 'number' || isNaN(interval) || interval <= 0)
				return;

			if (times && times.constructor != Number) {
				belay = !!times;
				times = 0;
			}
			
			times = times || 0;
			belay = belay || false;
			
			var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});
			
			if (!timers[label])
				timers[label] = {};
			
			fn.timerID = fn.timerID || this.guid++;
			
			var handler = function() {
				if (belay && this.inProgress) 
					return;
				this.inProgress = true;
				if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
					jQuery.timer.remove(element, label, fn);
				this.inProgress = false;
			};
			
			handler.timerID = fn.timerID;
			
			if (!timers[label][fn.timerID])
				timers[label][fn.timerID] = window.setInterval(handler,interval);
			
			this.global.push( element );
			
		},
		remove: function(element, label, fn) {
			var timers = jQuery.data(element, this.dataKey), ret;
			
			if ( timers ) {
				
				if (!label) {
					for ( label in timers )
						this.remove(element, label, fn);
				} else if ( timers[label] ) {
					if ( fn ) {
						if ( fn.timerID ) {
							window.clearInterval(timers[label][fn.timerID]);
							delete timers[label][fn.timerID];
						}
					} else {
						for ( var fn in timers[label] ) {
							window.clearInterval(timers[label][fn]);
							delete timers[label][fn];
						}
					}
					
					for ( ret in timers[label] ) break;
					if ( !ret ) {
						ret = null;
						delete timers[label];
					}
				}
				
				for ( ret in timers ) break;
				if ( !ret ) 
					jQuery.removeData(element, this.dataKey);
			}
		}
	}
});

jQuery(window).bind("unload", function() {
	jQuery.each(jQuery.timer.global, function(index, item) {
		jQuery.timer.remove(item);
	});
});

(function($) {
$.fn.Horinaja = function(settings) {
	    options =  { 
		capture: '',
        delai:  300,
        duree: 4000,
        pagination: true
    	};  
    var options = $.extend(options, settings);  
    return this.each(function(){
		$this = $(this);
		var capture = options.capture;
		var px = $('#'+capture+' > ul > li').width();
        var delai = (options.delai)*1000;  
        var duree    = (options.duree)*1000;  
        var pagination = options.pagination;  
		var nCell = $('#'+capture+' > ul > li').length;
		var po = 0;
		var id = 0;
		function fadeP(it,opac){if(pagination){$('#'+capture+' > ol.horinaja_pagination > li:eq('+it+')').fadeTo("fast", opac);}}
		function moveP(){
			if(po!=-((px*nCell)-px)){
				$('#'+capture+' > ul').animate({ 
				left: (po-px)+"px"
				}, delai);	
				po = po-px;
				fadeP(id,0.4);
				id=id+1;
				fadeP(id,0.7);
			}else{
				$('#'+capture+' > ul').animate({ 
				left: "0px"
				}, delai);
				po = 0;	
				fadeP(id,0.4);
				id=0;
				fadeP(id,0.7);
			}	
		}
        $(this).everyTime(duree,capture,function(){moveP();});
		$('#'+capture).css({'overflow':'hidden','position':'relative'});
		$('#'+capture+' > ul').css({'width' : px*nCell+'px'});
		$('#'+capture+' > ul > li').css({'width':px,'float':'left'});
	if(pagination){
		$('#'+capture+' > ul').after('<ol class="horinaja_pagination"></ol>');
		$('#'+capture+' > ol.horinaja_pagination').css({'width':px+'px'});
		var wb = Math.floor(px/nCell);
		for(i=1;i!=(nCell+1);i++){$('#'+capture+' > ol.horinaja_pagination').append('<li><a style="width:'+wb+'px;">'+i+'</a></li>');}
		$('#'+capture+' > ol.horinaja_pagination > li').fadeTo("fast", 0.4);
		$('#'+capture+' > ol.horinaja_pagination > li:first').fadeTo("fast", 0.7);
	}
    /*$(this)
        .bind('mousewheel', function(event, delta) {
            var dir = delta > 0 ? 'Up' : 'Down',
                vel = Math.abs(delta);
				if(dir=='Up'){
					if(po !=0){
						$('#'+capture+' > ul').animate({ 
						left: (po+px)+"px"
						}, delai);
						po = po+px;
						fadeP(id,0.4);
						id=id-1;
						fadeP(id,0.7);
					}
				}else{
					if(po!=-((px*nCell)-px)){
						$('#'+capture+' > ul').animate({ 
						left: (po-px)+"px"
						}, delai);	
						po = po-px;
						fadeP(id,0.4);
						id=id+1;
						fadeP(id,0.7);
					}
				}
            return false;
        });*/
	$(this)
	.bind('mouseenter',function(){$(this).stopTime(capture);});
	$(this)
	.bind('mouseleave',function(){$(this).everyTime(duree,capture,function(){moveP();});});
	if(pagination){
		$('#'+capture+' > ol.horinaja_pagination > li').each(function(i) {
		  $(this).bind('click', {index:i}, function(e){
			 var occ = parseInt(e.data.index);
			 fadeP(occ,0.7);
			 fadeP(id,0.4);
			if(id>occ){
				var diff= id-occ;
				po=po+(px*diff);
				id = occ;
				$('#'+capture+' > ul').animate({ 
				left: (po)+"px"
				}, delai);	
			}else if(id<occ){
				diff= occ-id;
				po=po-(px*diff);
				id=occ;
				$('#'+capture+' > ul').animate({ 
				left: (po)+"px"
				}, delai);			
			}			
		  });
		});
	}
	});
};
})(jQuery);