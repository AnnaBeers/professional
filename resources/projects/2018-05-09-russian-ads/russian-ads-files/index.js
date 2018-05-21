
// I'm sorry this Javascript looks so confusing and out of order -- amateurs need to practice too.

// Static Variables

var ad_values = ['ad_id', 'ad_text','ad_landing_page', 'ad_targeting_location', 'age', 'language', 'placements', 'people_who_match', 'and_must_also_match', 'ad_impressions', 'ad_clicks', 'ad_spend', 'ad_creation_date', 'ad_end_date', 'interest_expansion'];
var sort_values = ['ad_creation_date', 'ad_clicks', 'ad_impressions', 'ad_spend', 'efficiency_clicks', 'efficiency_impressions']
var ad_values_length = ad_values.length;


// Static Functions

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function updatePrimaryContent() {
 $("#primary-image").children('img').attr('src', 'https://github.com/AndrewBeers/anderff-site/raw/master/resources/projects/2018-05-09-russian-ads/data/' + $(this).children(".caption").children('.detail').children('.image_filepath').text());

 for(i = 0; i < ad_values_length; i++) {
  $("#primary_details").children().children('#' + ad_values[i]).text($(this).children(".caption").children('.detail').children('.' + ad_values[i]).text());
}
}

function buildSortOptions(name){

  if(name == 'ad_clicks'){
    return {'ad_clicks': 'desc'}  
  }

  if(name == 'ad_spend'){
    return {'ad_spend': 'desc'}  
  }

  if(name == 'ad_impressions'){
    return {'ad_impressions': 'desc'}  
  }

  if(name == 'ad_creation_date'){
    return {'ad_creation_date': 'desc'}  
  }

  if(name == 'efficiency_impressions'){
    return {'efficiency_impressions': 'desc'}  
  }

  if(name == 'efficiency_clicks'){
    return {'efficiency_clicks': 'desc'}  
  }
}


function initSliders(){
  $("#click_slider").slider({
    min: 0,
    max: 100000,
    values:[0, 100000],
    step: 1,
    range:true,
    slide: function( event, ui ) {
      $("#click_range_label" ).html(ui.values[ 0 ] + ' - ' + ui.values[ 1 ] + ' clicks');
      $('#click_filter').val(ui.values[0] + '-' + ui.values[1]).trigger('change');
    }
  });

  $("#impressions_slider").slider({
    min: 0,
    max: 1000000,
    values:[0, 1000000],
    step: 1,
    range: true,
    slide: function( event, ui ) {
      $("#impressions_range_label" ).html(ui.values[ 0 ] + ' - ' + ui.values[ 1 ] + ' impressions');
      $('#impressions_filter').val(ui.values[0] + '-' + ui.values[1]).trigger('change');
    }
  });

  $("#spend_slider").slider({
    min: 0,
    max: 50000,
    values:[0, 50000],
    step: 1,
    range: true,
    slide: function( event, ui ) {
      $("#spend_range_label" ).html(ui.values[ 0 ] + ' - ' + ui.values[ 1 ] + ' RUB');
      $('#spend_filter').val(ui.values[0] + '-' + ui.values[1]).trigger('change');
    }
  });

}
  // $('#year_criteria :checkbox').prop('checked', true);

// Functions after DOM loads (I think?)

window.onload = function(){

  var page_id = parseFloat(getParameterByName('ad_id'));

  var needle = russian_ads.filter(
    function(data){ return data.ad_id === page_id }
    );

  $("#primary-image").children('img').attr('src', 'https://github.com/AndrewBeers/anderff-site/raw/master/resources/projects/2018-05-09-russian-ads/data/' + needle[0].image_filepath)

  for(i = 0; i < ad_values_length; i++) {
    $("#primary-details").children().children('#' + ad_values[i]).text(needle[0][ad_values[i]]);
  }
}

$(document).ready(function(){

  initSliders();

  //NOTE: To append in different container
  var appendToContainer = function(htmlele, record){
    console.log(record)
  };

  var afterFilter = function(result, jQ){
    $('#total-russian-ads').text(result.length);

    // var checkboxes  = $("#genre_criteria :input");

    // checkboxes.each(function(){
    //   var c = $(this), count = 0

    //   if(result.length > 0){
    //     count = jQ.where({ 'year': c.val() }).count;
    //   }
    //   c.next().text(c.val() + '(' + count + ')')
    // });

  };

  var FJS = FilterJS(russian_ads, '#russian-ads', {
    template: '#russian-ad-template',
    // search: { ele: '#searchbox' },
    search: {ele: '#searchbox', fields: ['ad_text']}, // With specific fields
    callbacks: {
      afterFilter: afterFilter
    },
    pagination: {
      container: '#pagination',
      visiblePages: 5,
      perPage: {
        values: [12, 15, 18],
        container: '#per_page'
      },
    }
  });

  FJS.addCallback('beforeAddRecords', function(){

  });

  FJS.addCallback('beforeRender', function(){
    $(".thumbnail").click(function() {
     $("#primary-image").children('img').attr('src', 'https://github.com/AndrewBeers/anderff-site/raw/master/resources/projects/2018-05-09-russian-ads/data/' + $(this).children(".caption").children('.detail').children('.image_filepath').text());
   })
  })

  FJS.addCallback('afterAddRecords', function(){
    var percent = (this.recordsCount - 250)*100/250;

    $('#stream_progress').text(percent + '%').attr('style', 'width: '+ percent +'%;');

    if (percent == 100){
      $('#stream_progress').parent().fadeOut(1000);
    }

  });

  var sortOptions = {};

  // for(i = 0; i < sort_values.length; i++) {
    $(".sort-button").on('change', function(e){
      sortOptions = buildSortOptions($(this).val());
      FJS.filter();
      e.preventDefault();
    });
// }

  FJS.addCallback('shortResult', function(query){
    if(sortOptions){
      query.order(sortOptions);
    }

  });

  // FJS.addCriteria({field: 'year', ele: '#year_filter', type: 'range', all: 'all'});
  FJS.addCriteria({field: 'ad_clicks', ele: '#click_filter', type: 'range'});
  FJS.addCriteria({field: 'ad_impressions', ele: '#impressions_filter', type: 'range'});
  FJS.addCriteria({field: 'ad_spend', ele: '#spend_filter', type: 'range'});
  FJS.addCriteria({field: 'year', ele: '#year-criteria input:checkbox'});
  FJS.addCriteria({field: 'month', ele: '#month-criteria input:checkbox'});


  /*
   * Add multiple criterial.
    FJS.addCriteria([
      {field: 'genre', ele: '#genre_criteria input:checkbox'},
      {field: 'year', ele: '#year_filter', type: 'range'}
    ])
    */

  FJS.filter();

  window.FJS = FJS;

  $('#sort-button-click').click();
  $('#all_month').on('click', function(){
    $('#genre_criteria :checkbox').prop('checked', $(this).is(':checked'));
  });

  });