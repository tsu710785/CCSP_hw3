(function(){

// 插入 <ul> 之 <li> 樣板
var tmpl = '<li><input type="text"><span></span></li>',
    addButton = $('#add'),
    connected = $('.connected'),      // 三個 <ul>
    placeholder = $('#placeholder'),  // 三個 <ul> 的容器
    mainUl = $('.main'),              // main <ul>
    deleteUl = $('.delete'),          // delete <ul>
    doneUl = $('.done');              // done <ul>
    var flag = false;
    var deleteORchangePosition = false;
    var startPosition,endPosition;
    
    

    addButton.on('click',function(){
    	$(tmpl).prependTo(mainUl).addClass('is-editing').find('input').focus();
    })

    mainUl.on('keyup','input',function(e){
    	if(e.which !== 13){
        flag=true;
      }
      if(flag===true){
          if(e.which === 13){
          var input = $(this);
          li = input.parents('li');
          li.find('span').text( input.val() );
          li.removeClass('is-editing');
          //save();
          add(input.val());
          }
      }
      
    });

    load();

    mainUl.sortable({
    	connectWith:[deleteUl,doneUl],
    	// connectWith:doneUl,
    	start: function( event, ui ){
        deleteORchangePosition = false;
    		placeholder.addClass('is-dragging')
        startPosition = ui.item.index();
        //console.log("start in " + startPosition);
    	},
    	beforeStop: function( event, ui ){
    		placeholder.removeClass('is-dragging')
    	},
    	stop: function( event, ui){
        endPosition = ui.item.index();
    		//console.log("end in " + endPosition);
        if(deleteORchangePosition===false){
          locationupdate(startPosition,endPosition);
        }
    	},

    });

    deleteUl.sortable({
    	connectWith:mainUl,
		  receive: function (event,ui) {
       tolerance: "pointer";
       deleteitem(ui.item.text(),startPosition);
       ui.item.remove();
       deleteORchangePosition = true;
		  }
    });

    doneUl.sortable({
    	receive: function (event,ui) {
    		ui.item.appendTo(mainUl).addClass('is-done');
    		classupdate(ui.item.text(),startPosition);
    	}
    });

    function classupdate(str,location){
      obj = new objectconstruct("is-done",str);
      //console.log(obj);
      $.ajax({
          type: 'PUT',
          url: '/items/'+ location,
          data:obj,
          dataType:'application/json',
          success: function(data) {
            console.log('success change class');
          }
      });
    }

    function deleteitem(str,location){
      console.log("delete location"+location);
      var arr = [];
      obj = new objectconstruct("del",str);
      $.ajax({
          type: 'DELETE',
          url: '/items/'+location,
          data:JSON.stringify(obj),
          dataType:"json",
          contentType: 'application/json',
          success: function(data) {
            console.log('success del');
          },
          error: function(data){
            console.log('fail del');
          }
      });
    }


    function locationupdate(start,end){
      var arr = [];
      $.ajax({
        type: 'PUT',
        url: '/items/' + start +'/reposition/' + end,
        data:JSON.stringify(arr),
        dataType:"json",
        contentType: 'application/json',
        success: function(data) {
          console.log('success add');
        }
      });
    }

    function add(addnew){
      var arr = [];
      var obj = new objectconstruct("none",addnew);
      arr.push(obj);
      $.ajax({
          type: 'POST',
          url: '/items',
          data:JSON.stringify(obj),
          dataType:"json",
          contentType: 'application/json',
          success: function(data) {
            console.log('success add');
            console.log(JSON.stringify(data));
          }
      });
    }


  	function save(){
  	  var obj = [];
      var tempobj = {};
      var temptext = [],
          tempclass = [];
      mainUl.find('span').each(function(){
        if (temptext.text!=="") {
          temptext.push($(this).text());
        };
      });
      mainUl.find('li').each(function(){
        if($(this).hasClass("is-done")){
          tempclass.push("is-done");
        }
        else{
          tempclass.push("none");
        }
      });
      for(var i=0;i<tempclass.length;i++){
        tempobj = new objectconstruct(tempclass[i],temptext[i]);
        obj.push(tempobj);
      }
      console.log(JSON.stringify(obj));

      $.ajax({
        type: 'PUT',
        url: '/items/:id',
        data:JSON.stringify(obj),
        dataType:"json",
        contentType: 'application/json',
        success: function(data) {
          console.log('save success');
        }
      });
  	};

  	function load(){
      $.ajax({
        type: 'GET',
        url: '/items',
        dataType:"json",
        contentType: 'application/json',
        success: function(data) {
          console.log('success');
          // console.log(JSON.stringify(data));
          for (var i = 0; i < data.length; i++) {
            $(tmpl).appendTo(mainUl).find('span').text(data[i].text).parents().addClass(data[i].class);
          };
        }
      });
    
  	}

    function objectconstruct(thisclass,thistext){
      this.class = thisclass;
      this.text = thistext;
    };

}());
