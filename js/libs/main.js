define(function (require) {	
	require('model');
	require('autogrow');
	require('mousetrap');
  		$(function() {//start doing cool shit here 
			$('textarea').autogrow({onInitialize: true});
			var Store = P.App.Store.Projects;
			//console.log(P)
			/*--------------------VIEW LAYER--------------*/
				//PUBLIC METHODS]
					if(Store[0] !=undefined){
						Store[0]['Sections'].forEach(function (section) {
							var card='';
							card +='<li><div class="section card" data-order='+section.order+' data-id='+section.id+'>';
								card +='<div class="content">';
									section.Thoughts.forEach(function (thought) {
										if(thought.state==true){
											card +='<p data-id='+thought.id+'>'+thought.text+'</p>';
										}
									});
								card +='</div>';
								card +='<div class="inline-buttons">';
									card +='<button class="red square" id="delete" data-action="delete">Delect Section</button>';
									card +='<button class="light-blue square">Tab to Iterate</button>';
								card +='</div>';
							card +='</div></li>';
							$('#section ol').append(card);
						});
					}
				//PRIVATE METHODS
					function loadThoughts(opt){
						$('#sectionThoughts .card').remove();
						opt.thoughts.forEach(function (thought) {
							var card='';
							card +='<li><div class="thought card" data-sID='+thought.SectionID+' data-order='+thought.order+' data-id='+thought.id+'>';
								card +='<div class="content">';
									card +='<p data-id='+thought.id+'>'+thought.text+'</p>';
								card +='</div>';
								card +='<div class="inline-buttons">';
									card +='<button class="light-blue square">Drag to Promote</button>';
								card +='</div>';
							card +='</div></li>';
							$('#sectionThoughts ol').append(card);
						});
						$("#sectionThoughts ol").sortable({ axis: "y" });
						$("#sectionThoughts ol").disableSelection();
					}
					function newSection(params){
						if(Store[0] ==undefined){
							var prject= P.App.Store.new('Project');
							var section = prject.new('Section');
						}else{
							var section = Store[0].new('Section');
						}
						section.new('Thought',params,function(data){
							var card='';
							card +='<li><div class="section card" data-order='+section.order+' data-id='+section.id+'>';
								card +='<div class="content">';
									section.Thoughts.forEach(function (thought) {
										if(thought.state==true){
											card +='<p data-id='+thought.id+'>'+thought.text+'</p>';
										}
									});
								card +='</div>';
								card +='<div class="inline-buttons">';
									card +='<button class="red square" id="delete" data-action="delete">Delete Section</button>';
									card +='<button class="light-blue square">Tab to Iterate</button>';
								card +='</div>';
							card +='</div></li>';
							$('#section ol').append(card);
						});
						//sortThoughts.destroy();
						//sortThoughts.create();
					}
					function clickSection(card){
						var tcard= card;
						var id=tcard.attr('data-id');
						var thoughts = Store[0]['Sections'].filter(function(section){
							if(section.id===Number(id)){
								return section;
							}else{
								return false;
							}
						});
						if(tcard.hasClass('active')){
							$('#sectionThoughts .card').remove();
							$('.section.card').removeClass('active');
						}else{
							$('.section.card').removeClass('active');
							tcard.toggleClass('active');
							loadThoughts({thoughts:thoughts[0].Thoughts});
						}
					}
					setTimeout(function(){
						$("#section ol").sortable({ axis: "y" });
						$("#section ol").disableSelection();
					},500);
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
					$('#section').on('click','.section.card',function(e){
						e.stopPropagation();
						e.preventDefault();
						var thisCard = $(this);
						clickSection(thisCard);
					});
					$('#submit').on('click', function(e) {
						if(!$('.footer textarea').val()){
							$('.footer button').toggleClass('hide active');
						}else{
							$('.footer button').toggleClass('hide active');
							newSection({text:$('.footer textarea').val()});
							$('.footer textarea').val('');
						}
					});
					$('#section').on('click','#delete', function(e){
						e.stopPropagation();
						e.preventDefault();
						$this = $(this).closest('.card');
						var sId= Number($this.attr('data-id'));
						if($this.hasClass('active')){$this.click()};
						Store[0].removeSection(sId);
						$this.remove();
						
					})
					$('.footer textarea').bind('input propertychange', function() {
					      if(this.value.length>1 && $('.footer button').hasClass('hide')){
					        $('.footer button').toggleClass('hide active');
					      }else if(this.value.length<1 && $('.footer button').hasClass('active')){
					      	$('.footer button').toggleClass('hide active');
					      }
					});
					Mousetrap.bind('alt+enter', function(e) {
						console.log('So you press buttons')
						if($('.footer textarea').hasClass('typing')){
							if(!$('.footer textarea').val()){
								$('.footer button').toggleClass('hide active');
							}else{
								$('.footer button').toggleClass('hide active');
								newSection({text:$('.footer textarea').val()});
								$('.footer textarea').val('');
							}
						}else if ($('.thought.card').hasClass('typing')){
								var $this = $('.thought.card.typing');
								var sId= $('.thought.card.typing').attr('data-sid');
								var tId= $('.thought.card.typing textarea').attr('data-id');
								//console.log($('.thought.card.typing textarea').val())
								var section = Store[0].Sections.filter(function(section){
									if(section.id===Number(sId)){
										return section;
									}
								});
								section[0].updateThought(Number(tId),{text:$('.thought.card.typing textarea').val()},function(data){
									var $this = $('.thought.card.typing');
									//console.log(data);
									$this.find('.content').append('<p>'+data.text+'</p>');
									$this.find('textarea').remove();
									var $this = $('.thought.card').removeClass('typing');
								});
								//P.App.Store.updateThought(1,sId,tId);

						}else{
							console.log('issue error');
						}
					});
					Mousetrap.bind('tab', function(e) {
						if($('.section.card').hasClass('active')){
							var sId= $('.section.card.active').attr('data-id');
							var tId= $('.section.card.active p').attr('data-id');
							var section = Store[0].Sections.filter(function(section){
								if(section.id===Number(sId)){
									return section;
								}
							});
							section[0].iterate(Number(tId),function(data){
								var thought = data;
								var card='';
								card +='<li><div class="thought card" data-sID='+sId+' data-order='+thought.order+' data-id='+thought.id+'>';
									card +='<div class="content">';
										card +='<textarea data-id='+thought.id+' id='+thought.id+'>'+thought.text+'</textarea>';
									card +='</div>';
									card +='<div class="inline-buttons">';
										card +='<button class="light-blue square">Drag to Promote</button>';
									card +='</div>';
								card +='</div></li>';
								$('#sectionThoughts ol').append(card);
								$('#'+thought.id).focus(function(){
									var $this = $(this);
									$this.closest('.card').addClass('typing');
									$this.select();
								    $this.addClass('mousetrap');
								});
							});
						}
					})

			/*--------------------VIEW LAYER--------------*/
    	});//END APP
});