var P = P || {};
P.App = new function(options){
  'use strict';
  this.Store={
    Projects:[],
    new:function(type){
      var process = new P.App.Store['_'+type];
      P.App.Store.Projects.push(process);
      return process;
    },
    _Project:(function() {
      'use strict';
      function _Project(args) {
        this.id = P.App.Store.Projects.length+1;
        this.name ="";
        this.Sections=[];
        this.Versions=[]; 
        _Project.prototype.new = function(type){
          if(type==="Section"){
            var section = new P.App.Store['_'+type]({
              id:this.Sections.length+1,
              pID:this.id
            });
            this.Sections.push(section);
            return section;
          }else{
            var version = new P.App.Store['_'+type]({id:this.Versions.length+1});
            this.Versions.push(version);
            return version;
          }
        };
        
      }
      return _Project;
    }()),
    _Section:(function() {
      'use strict';
      function _Section(args) {
        this.id = args.id;
        this.projectID =args.pID;
        this.order =args.id;
        this.Thoughts=[]; 
        this._defaults= {
          id:this.Thoughts.length+1,
          order:this.Thoughts.length+1,
          sID:this.id,
          state: findState(this.Thoughts)
        }
        //PUBLIC METHODS
          _Section.prototype.updateThought = function(id,value){
            this.Thoughts.forEach(function(thought){
              if(thought.id===id){
                thought.order = value.order || thought.order;
                thought.text = value.text || thought.text;
                thought.state = value.state || thought.state;
                thought.update = new Date();
                thought.changes = thought.changes+1
              }
            })
          }
          _Section.prototype.removeThought = function(id){
            this.Thoughts = $.grep(this.Thoughts, function(e){ 
                 return e.id != id; 
            });
          }
          _Section.prototype.iterate = function(id){
            var options = this._defaults;
            var sThought = this.Thoughts;
            this.Thoughts.forEach(function (thought) {
              if(thought.id===id){
                var defaults = extendDefaults(options,{
                  id:sThought.length+1,
                  order:sThought.length+1,
                  text : thought.text,
                  state: false
                });
                var thought = new P.App.Store['_Thought'](defaults);
                sThought.push(thought);
                return thought;    
              }
            });
          }
          _Section.prototype.updateOrder = function(org,des){
            var move;
            if(org>des){
              move="up";
              var range=this.Thoughts.slice(des-1,org)
            }else{
              move="down";
              var range=this.Thoughts.slice(org-1,des)
            }
            this.Thoughts.forEach(function (thought) {
              if(thought.order===org){
                thought.order=des;
              }else{
                if(move==="up"){
                  thought.order=thought.order+1;
                }else{
                  thought.order=thought.order-1
                }
              } 
            });
            this.Thoughts.sort(function(a, b) {
                return parseFloat(a.order) - parseFloat(b.order);
            });
          }
          _Section.prototype.new = function(type,options){
            var defaults = extendDefaults(this._defaults, arguments[1]);
            var thought = new P.App.Store['_'+type](extendDefaults(defaults,{
              id:this.Thoughts.length+1,
              order:this.Thoughts.length+1,
            }));
            this.Thoughts.push(thought);
            return thought;
          }
        //PRIVATE METHODS
          function sortNumber(a,b) {
            return a - b;
          }
          function findState(Tht){
            if(Tht.length<1){
              return true;
            }else{
              Tht.forEach(function (thought) {
                if(thought.state===true){
                   return false;
                }else{
                    return true;
                }
              });
            }
          }
      }
      return _Section;
    }()),
    _Thought:(function() {
      'use strict';
      function _Thought(args) {
        this.id = args.id;
        this.SectionID =args.sID;
        this.order =args.id;
        this.text=args.text||"";
        this.state=args.state;
        this.date = new Date();
        this.update = new Date();
        this.changes = 0;
      }
      return _Thought;
    }()),
    Compile: function(options){
      //copy all text to clipboard
    }
  }
  //PUBLIC METHODS
    this.get = function(property){
      return this[property];
    }
    this.set = function(property,value){
      this[property]=value;
    }
    this.init = function(){
    }
  //PRIVATE METHODS
    function extendDefaults(source, properties) {
      var property;
      for (property in properties) {
        if (properties.hasOwnProperty(property)) {
          source[property] = properties[property];
        }
      }
      return source;
    }
}
//P.App.Store.new('Project')
var coolSection = P.App.Store.new('Project').new('Section');
var coolThought = coolSection.new('Thought',{text:"Hello World"});
coolSection.iterate(1);
coolSection.new('Thought',{text:"Hello World Max Out"});
coolSection.updateOrder(1,3);
coolSection.removeThought(3);
coolSection.new('Thought',{text:"Hello World Max Out"});
console.log(P.App)
