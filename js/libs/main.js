define(function (require) {	
	require('model');
	require('autogrow');
  		$(function() {//start doing cool shit here 
			$('textarea').autogrow({onInitialize: true});
			var thoughts = document.getElementById('section-thoughts');
			var section = document.getElementById('section');
			 Sortable.create(section, { /* options */ });
			Sortable.create(sectionThoughts, { /* options */ });
    	});//END APP
});