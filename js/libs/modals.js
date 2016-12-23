var alertModals = function(method){
	var methods = {
		settings: {
			appendTo : $('body'),
			type : '',
			theme: 'light',
			message: '',
			showButtons:false,
			buttons:[],
			timed: true,
			time: 3000
		},
		//START PUBLIC METHODS HERE
        init : function(options) {
        	methods.settings = $.extend(methods.settings, options);
        	//console.log(methods.settings.buttons[0].action);
        	var buttons = methods.settings.buttons.map(function(object){
    			return '<button data-action="'+object.name+'" class="data-action '+object.name+' btn-cta blue">'+object.value+'</button>';
        	});
			var html = '<div class="modal-alert '+methods.settings.theme+' not-active"><div class="modal-wrapper top"><div class="detail-header"><ul class="ul-right"><li class="inline-text"><span class="black close">Close</span></li></ul></div><!--detail-header--><div class="row detail"><div class="span14 body-text"><p class="black sans">'+methods.settings.message+'</p></div><div class="row">'+buttons+'</div></div></div></div>';
			methods.settings.appendTo.prepend(html).find('.modal-alert').addClass('active').removeClass('not-active');
			$('button.data-action').each(function(btn){
					$(this).click(function(e){
						var dataAction = $(this).attr('data-action'); 
						var action =  $.grep(methods.settings.buttons, function(e) { 
							return e.name === dataAction 
						});
						action[0].action();
        			});
			});
			if(methods.settings.timed){
				setTimeout(function(){
					$('.modal-alert').addClass('not-active').removeClass('active');
				},methods.settings.time); 
				setTimeout(function(){
					$('.modal-alert').remove();
				},methods.settings.time+300); 
			}
			$('.close').on("click", function(ev) {
				setTimeout(function(){
					$('.modal-alert').addClass('not-active').removeClass('active');
				},0); 
				setTimeout(function(){
					$('.modal-alert').remove();
				},methods.settings.time+100); 
			});
		},
		getLoader: function(position){
			//
			//
		},
		removeLoader: function(){
			//
			//
		},

	}
	//START PRIVATE FUNCTIONS HERE
	var privacy = {
       
	}
	//SET METHODS AND SETTINGS
	if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
    } else {
            $.error( 'Method "' +  method + '" does not exist in pluginName plugin!');
    }
}//END PLUGIN