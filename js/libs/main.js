define(function (require) {	
	require('model');
	require('autogrow');
  		$(function() {//start doing cool shit here 
			$('textarea').autogrow({onInitialize: true});
    	});//END APP
});