//
// giphtastic.js - HW using AJAX & Giphy API
//

// giphy api key

var categories = [ "doge", "ytmnd", "fail", "win", "facepalm", "success", "awkward", "unimpressed" ];
var ret_rating = "0"; // Y G PG PG-13 R
var rating_opts = [ "R", "PG-13", "PG", "G", "Y" ];

function genAPI(giph_q = "", giph_limit = 5, giph_offset = 0, max_rating = "") {
  var apiUrl="https://api.giphy.com/v1/gifs/search?api_key=d89333e1a3c74b0092963d4603c17ff8";
  max_rating = ret_rating;
  if (! Number.isInteger(giph_limit)) {
    giph_limit=5
  }
  if (! Number.isInteger(giph_offset)) {
    giph_offset=0
  }

  // start assembly + query
  apiUrl += "&q=" + escape(giph_q);
  // +rating
  if (max_rating != "") {
    if (rating_opts.indexOf(max_rating) != -1) {
      apiUrl += "&rating=" + max_rating;
    }
  }
  // +limit
  apiUrl += "&limit=" + giph_limit;
  // +offset
  apiUrl += "&offset=" + giph_offset;
  // return
  return apiUrl;
}
function createCatButtons(button_list) {
  var html="";

  var ratingClass = [];
  ratingClass["Y"]="";
  ratingClass["G"]="";
  ratingClass["PG"]="";
  ratingClass["PG-13"]=""
  ratingClass["R"]=""
  ratingClass["0"]=""
  if (rating_opts.indexOf(ret_rating) == -1) {
    ret_rating = 0
  }

  for (var i = 0; i < button_list.length; i++) {
    var cbutton="<li><a href='#' class='giph-cat-btn' id='cat" + i + "'>" + button_list[i] + "</a></li>";
    html += cbutton;
  }
  html += '<li class="dropdown" id="ratingSelect"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Choose Rating <span class="caret"></span></a><ul class="dropdown-menu" id="ratingselect"><li id="rate_Y"' + ratingClass["Y"] + '><a href="#" class="ratingChoice">Y</a></li><li id="rate_G"' + ratingClass["G"] + '><a href="#" class="ratingChoice">G</a></li><li id="rate_PG"' + ratingClass["PG"] + '><a href="#" class="ratingChoice">PG</a></li><li id="rate_PG-13"' + ratingClass["PG-13"] + '><a href="#" class="ratingChoice">PG-13</a></li><li id="rate_r"' + ratingClass["R"] + '><a href="#" class="ratingChoice">R</a></li><li role="separator" class="divider"></li><li id="rate_null"' + ratingClass[""] + '><a href="#" class="ratingChoice">None</a></li></ul></li>';
  return html;
}

function makeName(nameStr) {
  var nameList = nameStr.split(" ");
  var madeStr;
  if (nameList.length <= 1) {
    return nameStr.toLowerCase();
  }
  madeStr=nameList[0].toLowerCase();
  for (var i = 1; i < nameList.length; i++) {
    madeStr += "_" + nameList[i].toLowerCase();
  }
  console.log("madeStr: " + madeStr);
  return madeStr;
}
function tog_thumbAnim(tid) {
  var targ_id = "#img_" + tid;
  var isStill = $(targ_id).data("still");
  var stillsrc = $(targ_id).data("srcStill");
  var playsrc = $(targ_id).data("srcPlay");
  var btn_id = "#tog_" + tid;
  if (isStill != 0) {
    // start animation
    $(targ_id).attr("src", playsrc);
    $(targ_id).data("still", 0);
    $(btn_id).html("<span class='glyphicon glyphicon-remove-circle'></span> Stop");
  } else {
    // Toggle animation off.
    $(targ_id).attr("src", stillsrc);
    $(targ_id).data("still", 1);
    $(btn_id).html("<span class='glyphicon glyphicon-play-circle'></span> Start");
  }
}
function start_thumbAnim() {
  var thumbObj = $("#" + this.id)
  var thumbId = thumbObj.data("id");
  var thumbStill = thumbObj.data("still");

  if (thumbStill == 0) {
    return true;
  } else {
    var thumbStSrc = thumbObj.data("srcStill");
    var thumbPlSrc = thumbObj.data("srcPlay");
    thumbObj.attr("src", thumbPlSrc);
  }
}
function stop_thumbAnim() {
  var thumbImg = $("#" + this.id);
  var thumbId = thumbImg.data("id");
  var still = thumbImg.data("still");
  var stillSrc = thumbImg.data("srcStill");

  if (still == 0) {
    return true;
  } else {
    thumbImg.attr("src", stillSrc);
  }
}
function addThumb(srcStill, srcPlay, addimgId, cat="N/A", addalt="giphy search return", addrating="None") {
  var cat_name = makeName(cat);
  var imageObj = $("<img>");
  imageObj.attr("src", srcStill);
  imageObj.data("id", addimgId);
  imageObj.attr("id", "img_" + addimgId);
  imageObj.data("still", 1);
  imageObj.data("srcPlay", srcPlay);
  imageObj.data("srcStill", srcStill);
  imageObj.data("category", cat_name);
  imageObj.data("rating", addrating);
  imageObj.attr("alt", addalt);
  imageObj.addClass("giph_thumbs thumbs_still");
  //imageObj.hover();
  var html = "<div class='thumbnail' id='thumb_" + addimgId + "'><div class='caption'><p>ID: " + addimgId + "</p><p>Rating:  " + ( addrating == 0 ? "N/A" : addrating) + "</p><p>Parent button: " + cat_name + "</p><p><a href='#' class='btn btn-primary btn-xs btn-toggleimg' role='button' id='tog_" + addimgId + "'><span class='glyphicon glyphicon-play-circle'></span> Play</a><a href='#' class='btn btn-xs btn-danger pull-right' role='button' id='rem_" + addimgId + "'><span class='glyphicon glyphicon-remove-circle'></span> Close</a></p></div></div>";
  $("#content-main").prepend(html);
  imageObj.prependTo("#thumb_" + addimgId);
  imageObj.hover(start_thumbAnim, stop_thumbAnim);
  $("#tog_" + addimgId).click(function(event) {
    tog_thumbAnim(addimgId);
  });
  $("#rem_" + addimgId).click(function(event) {
    $("#thumb_" + addimgId).fadeOut();
  });
  return $("#thumb_" + addimgId);
}
var fudge;
function addCatBtn(catStr) {
  var newLI = $("<li></li>");
  var newBtn = $("<a href='#'></a>")
  newBtn.attr("id", "cat" + $(".giph-cat-btn").length);
  newBtn.addClass("giph-cat-btn");
  newBtn.text(catStr);
  newBtn.appendTo(newLI);
  newLI.prependTo("#catlist");
  fudge = newBtn;
  console.log(fudge);
  newBtn.click(function(event) {
    var api_q = this.innerText;
    var api_rating = ret_rating;
    var api_url = genAPI(api_q, 10, 0, api_rating);
    $.get(api_url).done(function(json) {
      for (var i = 0; i < json.data.length; i++) {
        var newImgId = json.data[i].id;
        var newImgStill = json.data[i].images.fixed_height_still.url;
        var newImgAni = json.data[i].images.fixed_height.url;
        var newImgCat = catStr;
        var newImgAlt = "IMG #" + newImgId;
        var newImgRating = json.data[i].rating;
        var newImgImportTime = json.data[i].import_datetime;
        // addThumb...
        var newThumb = addThumb(newImgStill, newImgAni, newImgId, newImgCat, newImgAlt, newImgRating);
      }
    });
  });
}

$(document).ready(function() {
  $("#catlist").html(createCatButtons(categories));
  $("#catAdd").click(function(event) {

    var catName = $("#catAddName").val();
    if (categories.indexOf(catName) != -1) {
      addCatBtn(catName);
    }
  });
  $(".giph-cat-btn").click(function(event){
    var button_val = this.innerText;
    var target_id = this.id;
    // console.log("IMG id: " + target_id);
    var api_url = genAPI(button_val, 10, 0, ret_rating);
    // console.log(api_url);
    var api_ret = $.get(api_url).done(function(json) {
      if (json.data.length < 10) {
        return false;
      }
      for (var i = 0; i < json.data.length; i++) {
        var doImgId = json.data[i].id;
        var doImgStill = json.data[i].images.fixed_height_still.url;
        var doImgAni = json.data[i].images.fixed_height.url;
        var doImgCat = button_val;
        var doImgAlt = "IMG: #" + doImgId + " + Category: " + doImgCat + "";
        var doImgRating = json.data[i].rating;
        var doImgDate = json.data[i].import_datetime;
        // addThumb(still, animated, id, category, alt, rating)
        var newThumb = addThumb(doImgStill, doImgAni, doImgId, doImgCat, doImgAlt, doImgRating);
      }
    });
  });
  $(".ratingChoice").click(function(event){
    var new_rating = this.innerText;
    var btn_id = this.id;
    if (new_rating == "None") {
      new_rating = "0";
    }
    $(".ratingChoice").removeClass("active");
    $(this).addClass("active");
    // $(".ratingChoice").removeClass("active");
    // this.addClass("active")
    ret_rating = new_rating;
    console.log(ret_rating);
  });
  $("#add_cat_btn").click(function() {
    console.log("CLICK add?");
    //event.preventDefault();
    var newCatName = $("#add_cat_txt").val();
    console.log("name: " + newCatName);
    addCatBtn(newCatName);
  });
  // $(".category-buttons").click(function(event) {
  //
  // });
});
