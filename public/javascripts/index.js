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
  		var arr = [];
  		mainUl.find('span').each(function(){
    		if (arr!=="") {
          arr.push($(this).text());
        };
  		});
      var arr2 = [];
      mainUl.find('li').each(function(){
          if($(this).hasClass("is-done")){
            arr2.push("is-done");
          }
          else{
            arr2.push("a");
          }
      });
  		localStorage.todoItems = JSON.stringify(arr);
      localStorage["class"] = JSON.stringify(arr2);
  	};

  	function load(){
  		var arr = JSON.parse( localStorage.todoItems ), i;
      var arr2 = JSON.parse( localStorage["class"] );
  		for(i=0; i<arr.length; i+=1){
        if (arr[i]!==null) {
          $(tmpl).appendTo(mainUl).find('span').text(arr[i]).parents().addClass(arr2[i]);;

        }
      };
  	}





}());