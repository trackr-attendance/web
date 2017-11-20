var template = Handlebars.compile($("#form_rows_tpl").html()),
    $target = $(".dynamic-rows"),
    $btnAdd = $("button.add"),
    $btnRemove = $("button.remove"),
    rows = 1;

$btnAdd.click(function(e){
  e.preventDefault();
  addRows();
});

$btnRemove.click(function(e){
  e.preventDefault();
  removeRows();
});

function addRows(){
  var context = {count: rows};
  console.log(context);
  var html = template(context);
  $target.append(html);
  rows++;
}

function removeRows(){
  $target.find('.row').last().remove();
  $msg.text('');
  if(rows <= 1){
    rows = 1;
  }else{
    rows--;
  }
}

addRows();