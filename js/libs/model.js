var P;
window.P = P || {};
P.App = new function(options){
  'use strict';
  this.Store={
    Projects:returnStore(),
    Items:[],
    new:function(type){
      var $this = P.App.Store.Projects.push(new P.App.Store['_'+type]);
      return P.App.Store.Projects[$this-1];  
    },
    addSection:function(type,pID,callback){
        var sections = P.App.Store.Projects[pID-1].Sections;
        var $this = sections.push(new P.App.Store['_'+type]({
          id:sections.length+1,
          pID:pID
        }));
        if(callback){callback(P.App.Store.Projects[pID-1].Sections[$this-1])};
        return P.App.Store.Projects[pID-1].Sections[$this-1];
    },
    iterateThought:function(type,pID,sId,tID,callback){
        var thoughts = P.App.Store.Projects[pID-1].Sections[sId-1].Thoughts;
        thoughts.forEach(function (thought) {
          if(thought.id===Number(tID)){
            var defaults ={
              id:thoughts.length+1,
              sID:Number(sId),
              order:thoughts.length+1,
              text : thought.text,
              state: false
            };
            var $this = thoughts.push(new P.App.Store['_Thought'](defaults));
            console.log(thoughts[$this-1])
            if(callback){callback(thoughts[$this-1])};
            return thoughts[$this-1];    
          }
        });
        P.App.Store.saveState();
    },
    updateThought:function(pID,sId,tID,params,callback){
        var section = P.App.Store.Projects[pID-1].Sections[sId-1];
        section.updateThought(Number(tID),params,callback);
        P.App.Store.saveState()
    },
    _Project:(function() {
      'use strict';
      function _Project(args) {
        this.id = P.App.Store.Projects.length+1;
        this.name ="";
        this.Sections=[];
        this.Versions=[]; 
        _Project.prototype.new = function(type,callback){
          if(type==="Section"){
            var section = new P.App.Store['_'+type]({
              id:this.Sections.length+1,
              pID:this.id
            });
            this.Sections.push(section);
            if(callback){callback(section)};
            return section;
          }else{
            var version = new P.App.Store['_'+type]({id:this.Versions.length+1});
            this.Versions.push(version);
            if(callback){callback(version)};
            return version;
          }
        };
        _Project.prototype.removeSection = function(id,callback){
          this.Sections = $.grep(this.Sections, function(e){ 
               return e.id != Number(id); 
          });
          if(callback){callback(id)};
          P.App.Store.saveState();
        }
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
          _Section.prototype.updateThought = function(id,value,callback){
            this.Thoughts.forEach(function(thought){
              if(thought.id===Number(id)){
                thought.order = value.order || thought.order;
                thought.text = value.text || thought.text;
                thought.state = value.state || thought.state;
                thought.update = new Date();
                thought.changes = thought.changes+1;
              }
            })
            P.App.Store.saveState()
          }
          _Section.prototype.removeThought = function(id,callback){
            this.Thoughts = $.grep(this.Thoughts, function(e){ 
                 return e.id != Number(id); 
            });
            if(callback){callback(id)};
            P.App.Store.saveState();
          }
          _Section.prototype.iterate = function(id,callback){
            var options = this._defaults;
            var sThought = this.Thoughts;
            this.Thoughts.forEach(function (thought) {
              if(thought.id===Number(id)){
                var defaults = extendDefaults(options,{
                  id:sThought.length+1,
                  order:sThought.length+1,
                  text : thought.text,
                  state: false
                });
                var thought = new P.App.Store['_Thought'](defaults);
                sThought.push(thought);
                if(callback){callback(thought)};
                return thought;    
              }
            });
            P.App.Store.saveState();
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
            P.App.Store.saveState();
          }
          _Section.prototype.new = function(type,options,callback){
            var defaults = extendDefaults(this._defaults, arguments[1]);
            var $this = this.Thoughts.push(new P.App.Store['_'+type](extendDefaults(defaults,{
              id:this.Thoughts.length+1,
              order:this.Thoughts.length+1,
            })));
            if(callback){callback(this.Thoughts[$this-1])};  
            P.App.Store.saveState();
            return this.Thoughts[$this-1];
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
    function returnStore(){
      if (localStorage.getItem("DataStore") === null) {
        return [];
      }else{
        return JSON.parse(localStorage.getItem('DataStore'));
      }
    }
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
P._Project = (function() {
  'use strict';
  function _Project(args) {
    this.removeSection = function(id,callback){
      this.Sections = $.grep(this.Sections, function(e){ 
           return e.id != Number(id); 
      });
      if(callback){callback(id)};
      P.App.Store.saveState();
    }
    this.new = function(type,callback){
      if(type==="Section"){
        var section = new P.App.Store['_'+type]({
          id:this.Sections.length+1,
          pID:this.id
        });
        this.Sections.push(section);
        if(callback){callback(section)};
        return section;
      }else{
        var version = new P.App.Store['_'+type]({id:this.Versions.length+1});
        this.Versions.push(version);
        if(callback){callback(version)};
        return version;
      }
    };
  }
  return _Project;
}());
P._Section=(function() {
  'use strict';
  function _Section(args) {
    
    //PUBLIC METHODS
      this.updateThought = function(id,value,callback){
        this.Thoughts.forEach(function(thought){
          if(thought.id===id){
            thought.order = value.order || thought.order;
            thought.text = value.text || thought.text;
            thought.state = value.state || thought.state;
            thought.update = new Date();
            thought.changes = thought.changes+1;
            if(callback){callback(thought)};
          }
        })
        P.App.Store.saveState();
      }
      this.removeThought = function(id,callback){
        this.Thoughts = $.grep(this.Thoughts, function(e){ 
             return e.id != id; 
        });
        if(callback){callback(id)};
        P.App.Store.saveState()
      }
      this.iterate = function(id,callback){
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
            if(callback){callback(thought)};
            return thought;    
          }
        });
        P.App.Store.saveState()
      }
      this.updateOrder = function(org,des){
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
        P.App.Store.saveState()
      }
      this.new = function(type,options,callback){
        var defaults = extendDefaults(this._defaults, arguments[1]);
        var $this = this.Thoughts.push(new P.App.Store['_'+type](extendDefaults(defaults,{
          id:this.Thoughts.length+1,
          order:this.Thoughts.length+1,
        })));
        if(callback){callback(this.Thoughts[$this-1])};  
        P.App.Store.saveState()
        return this.Thoughts[$this-1];
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
P.App.Store.saveState = function(){
  localStorage.setItem('DataStore', JSON.stringify([]));
  localStorage.setItem('DataStore', JSON.stringify(P.App.Store.Projects));
}
window.onload= (function() {
  P.App.Store.Projects.forEach(function (project) {
    project.__proto__ = new P._Project();
    project.Sections.forEach(function (section) {
      section.__proto__ = new P._Section();
      section.Thoughts.forEach(function (thought) {
        //thought.__proto__ = new P._Section();
      });
    });
  });
}())
//P.App.Store.new('Project')
/*var coolPrject= P.App.Store.new('Project')
var coolSection = coolPrject.new('Section');
var coolThought = coolSection.new('Thought',{text:"Hello World"});
coolSection.iterate(1);
coolSection.new('Thought',{text:"Hello World Max Out"});
coolSection.updateOrder(1,3);
coolSection.removeThought(3);
coolSection.new('Thought',{text:"Hello World Max Out"});
data = JSON.stringify(P.App.Store.Projects)*/
//console.log(P.App)
