$(document).ready(function(){
    $.getJSON("/resources/projects/2018-05-09-russian-ads/russian_ads.json",function(data){
       $.each(data, function (index, value) {
         console.log(value['Ad ID']);
         var content = '<h3>' + value['Ad ID'] + '</h3>';
          $(content).appendTo("#ads_list");       // READ THE DATA.
       });
    });  
});