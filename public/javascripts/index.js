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
          save();
          }
      }
      
    });

    load();

    mainUl.sortable({
    	connectWith:[deleteUl,doneUl],
    	// connectWith:doneUl,
    	start: function( event, ui ){
    		placeholder.addClass('is-dragging')
    	},
    	beforeStop: function( event, ui ){
    		placeholder.removeClass('is-dragging')
    	},
    	stop: function( event, ui){
    		save()
    	},

    });

    deleteUl.sortable({
    	connectWith:mainUl,
		receive: function (event,ui) {
       tolerance: "pointer";
		   ui.item.remove();
		}
    });

    doneUl.sortable({
    	receive: function (event,ui) {
    		ui.item.appendTo(mainUl).addClass('is-done');
    		save();
    	}
    });



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
        // tempobj.push(tempclass[i],temptext[i]);
        tempobj = new objectconstruct(tempclass[i],temptext[i]);
        obj.push(tempobj);
      }
      // obj.push(tempobj);
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
        url: '/item',
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
    
  	};

    function objectconstruct(thisclass,thistext){
      this.class = thisclass;
      this.text = thistext;
    }

}());
