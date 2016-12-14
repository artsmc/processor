define(function (require) {	
	require('model');
	require('autogrow');
	require('mousetrap');
  		$(function() {//start doing cool shit here 
			$('textarea').autogrow({onInitialize: true});
			Sortable.create(section, { /* options */ });
			Sortable.create(sectionThoughts, { /* options */ });
			var Store = P.App.Store.Projects;
			console.log(P.App.Store)
			/*--------------------VIEW LAYER--------------*/
				//PUBLIC METHODS]
					if(Store[0] !=undefined){
						Store[0]['Sections'].forEach(function (section) {
							var card='';
							card +='<div class="section card" data-order='+section.order+' data-id='+section.id+'>';
								card +='<div class="content">';
									section.Thoughts.forEach(function (thought) {
										if(thought.state==true){
											card +='<p data-id='+thought.id+'>'+thought.text+'</p>';
										}
									});
								card +='</div>';
								card +='<div class="inline-buttons">';
									card +='<button class="red square">Delect Section</button>';
									card +='<button class="light-blue square">Tab to Iterate</button>';
								card +='</div>';
							card +='</div>';
							$('#section').append(card);
						});
					}
				//PRIVATE METHODS
					function loadThoughts(opt){
						$('#sectionThoughts .card').remove();
						opt.thoughts.forEach(function (thought) {
							var card='';
							card +='<div class="thought card" data-sID='+thought.sID+' data-order='+thought.order+' data-id='+thought.id+'>';
								card +='<div class="content">';
									card +='<p data-id='+thought.id+'>'+thought.text+'</p>';
								card +='</div>';
								card +='<div class="inline-buttons">';
									card +='<button class="light-blue square">Drag to Promote</button>';
								card +='</div>';
							card +='</div>';
							$('#sectionThoughts').append(card);
						});
					}
					function newSection(params){
						if(Store[0] ==undefined){
							var prject= P.App.Store.new('Project');
							var section = prject.new('Section');
						}else{
							var section = P.App.Store.addSection('Section',1)
						}
						section.new('Thought',params,function(data){
							var card='';
							card +='<div class="section card" data-order='+section.order+' data-id='+section.id+'>';
								card +='<div class="content">';
									section.Thoughts.forEach(function (thought) {
										if(thought.state==true){
											card +='<p data-id='+thought.id+'>'+thought.text+'</p>';
										}
									});
								card +='</div>';
								card +='<div class="inline-buttons">';
									card +='<button class="red square">Delect Section</button>';
									card +='<button class="light-blue square">Tab to Iterate</button>';
								card +='</div>';
							card +='</div>';
							$('#section').append(card);
						});
					}
					function clickSection(card){
						var tcard= card;
						var id=tcard.attr('data-id');
						var thoughts = Store[0]['Sections'][id-1] ||null;
						if(tcard.hasClass('active')){
							$('#sectionThoughts .card').remove();
							$('.section.card').removeClass('active');
						}else{
							$('.section.card').removeClass('active');
							tcard.toggleClass('active');
							loadThoughts({thoughts:thoughts.Thoughts});
						}
					}


				/*-------EVENTS----------*/
					$('.footer textarea').on('focus', function(e){
						$(this).addClass('typing mousetrap');
						if(this.value.length>1 && $('.footer button').hasClass('hide')){
							$('.footer button').toggleClass('hide active');
						}else if(this.value.length<1 && $('.footer button').hasClass('active')){
							$('.footer button').toggleClass('hide active');
						}
						
					});
					$('.footer textarea').on('blur', function(e){
						$(this).removeClass('typing mousetrap');
						if(this.value.length>1 && $('.footer button').hasClass('hide')){
							$('.footer button').toggleClass('hide active');
						}else if(this.value.length<1 && $('.footer button').hasClass('active')){
							$('.footer button').toggleClass('hide active');
						}
					});
					$('.section.card').on('click',function(e){
						var thisCard = $(this);
						clickSection(thisCard);
					});
					$('.footer textarea').bind('input propertychange', function() {
					      if(this.value.length>1 && $('.footer button').hasClass('hide')){
					        $('.footer button').toggleClass('hide active');
					      }else if(this.value.length<1 && $('.footer button').hasClass('active')){
					      	$('.footer button').toggleClass('hide active');
					      }
					});
					Mousetrap.bind('alt+enter', function(e) {
						if($('.footer textarea').hasClass('typing')){
							if(!$('.footer textarea').val()){
								console.log('please type something');
								$('.footer button').toggleClass('hide active');
							}else{
								console.log('you ready to make something')
								$('.footer button').toggleClass('hide active');
								newSection({text:$('.footer textarea').val()});
								$('.footer textarea').val('');
							}
						}else{
							console.log('issue error');
						}
					});
					Mousetrap.bind('tab', function(e) {
						if($('.section.card').hasClass('active')){
							var sId= $('.section.card.active').attr('data-id');
							var tId= $('.section.card.active p').attr('data-id');
							P.App.Store.iterateThought('Thought',1,sId,tId,function(data){
								var thought = data;
								var card='';
								card +='<div class="thought card" data-sID='+thought.sID+' data-order='+thought.order+' data-id='+thought.id+'>';
									card +='<div class="content">';
										card +='<p data-id='+thought.id+'>'+thought.text+'</p>';
									card +='</div>';
									card +='<div class="inline-buttons">';
										card +='<button class="light-blue square">Drag to Promote</button>';
									card +='</div>';
								card +='</div>';
								$('#sectionThoughts').append(card);
							})

						}
					})

			/*--------------------VIEW LAYER--------------*/
    	});//END APP
});