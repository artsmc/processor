define(function (require) {	
	require('model');
	require('autogrow');
  		$(function() {//start doing cool shit here 
			$('textarea').autogrow({onInitialize: true});
			Sortable.create(section, { /* options */ });
			Sortable.create(sectionThoughts, { /* options */ });
			var Store = P.App.Store.Projects;
			console.log(Store[0])
			/*--------------------VIEW LAYER--------------*/
				Store[0]['Sections'].forEach(function (section) {
					var card='';
					card +='<div class="section card" data-order='+section.order+' data-id='+section.id+'>';
						card +='<div class="content">';
							section.Thoughts.forEach(function (thought) {
								if(thought.state==true){
									card +='<p>'+thought.text+'</p>';
								}
							});
						card +='</div>';
						card +='<div class="inline-buttons">';
							card +='<button class="red square">Delect Section</button>';
							card +='<button class="light-blue square">Tab to Iterate</button>';
						card +='</div>';
					card +='</div>';
					$('#section').append(card);
					$('.section.card').on('click',function(e){
						console.log('click');
						newSection();
						var tcard= $(this);
						if(tcard.hasClass('active')){
							$('#sectionThoughts .card').remove();
							tcard.removeClass('active');
						}else{
							tcard.addClass('active');
							loadThoughts({thoughts:section.Thoughts});
						}
					})
				});
				function loadThoughts(opt){
					$('#sectionThoughts .card').remove();
					opt.thoughts.forEach(function (thought) {
						var card='';
						card +='<div class="thought card" data-sID='+thought.sID+' data-order='+thought.order+' data-id='+thought.id+'>';
							card +='<div class="content">';
								card +='<p>'+thought.text+'</p>';
							card +='</div>';
							card +='<div class="inline-buttons">';
								card +='<button class="light-blue square">Drag to Promote</button>';
							card +='</div>';
						card +='</div>';
						$('#sectionThoughts').append(card);
					});
				}
				function newSection(){
					var section = P.App.Store.addSection('Section',1)
					section.new('Thought',{text:"Hello World Max Out"},function(data){
						console.log(section);
					});
				}

			/*--------------------VIEW LAYER--------------*/
    	});//END APP
});