const $ = require("jquery");
const fs = require("fs");
const moment = require("moment");
const os = require("os");
const md5 = require("md5");
const jsStringEscape = require("js-string-escape");
var exec = require("child_process").exec;
var files = [];
var current_directory = os.homedir();
var current_location = current_directory + "/Documents";

function loadSideBar(directory, div_id = "sidebar_list") {
  $(`#${div_id}`).empty();
  if (fs.existsSync(directory)) {
    files = fs.readdirSync(directory);
    files.forEach((file, index) => {
      let name_split = file.split("");
      if (
        fs.statSync(directory + "/" + file).isDirectory() &&
        name_split[0] != "."
      ) {
        addIntoSideBar(directory, file, div_id);
      }
    });
  } else {
    console.log("No Folder Exist");
  }
}

function addIntoSideBar(directory, file, div_id) {
  var id = md5(directory + "/" + file);
  $(`#${div_id}`).append(
    `<li class="p-2 sidebar_folder border" location="${directory + "/" + file}">
      ${file}
      <div id="child_${id}"></div>
    </li>`
  );
}

$(document).ready(function () {
  $(".sidebar_folder").click(function (e) {
    let location = $(this).attr("location");
    if ($(".selected_sidebar"))
      $(".selected_sidebar").removeClass("selected_sidebar");
    $(this).addClass("selected_sidebar");
    current_location = location;
    LoadAllFiles();
  });
});

function LoadAllFiles() {
  $("#table_content").empty();
  if (fs.existsSync(current_location)) {
    files = fs.readdirSync(current_location);
    files.forEach((file) => {
      // console.log(file);
      addEntry(current_location + "/" + file);
    });
  } else {
    console.log("No Folder Exist");
  }
}

function addEntry(location) {
  let stats = fs.statSync(location);
  let name = location.split("/");
  name = name[name.length - 1];
  let updateString = `<tr><td>${name}</td><td>${
    stats.size / 1000
  } KB</td><td>${moment(stats.mtime).format("Do MMMM, h:mm A")}</td></tr>`;
  $("#table_content").append(updateString);
}

function search(term) {
  $("#table_content").empty();
  var command = `grep "${term}" ${current_location}/* -i -l -R`;
  // console.log(command);
  exec(command, function (error, stdout, stderr) {
    if (stderr) {
      console.log(stderr);
    } else {
      // console.log(stdout);
      var all_file = stdout.trim().split("\n");
      all_file.forEach((single) => {
        single = single.split(":");
        var file_location = single[0].trim();
        if (file_location) addEntry(file_location);
      });
      if (all_file.length === 1 && !all_file[0]) {
        let updateString = `<tr><td  colspan="3">No File Found</td></tr>`;
        $("#table_content").append(updateString);
      }
    }
  });
}

$("#search_term").on("input", function () {
  var term = $("#search_term").val();
  term = jsStringEscape(term);
  if (term) search(term);
  else LoadAllFiles();
});

LoadAllFiles();
loadSideBar(current_directory);
