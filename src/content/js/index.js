const $ = require("jquery");
const fs = require("fs");
const moment = require("moment");
const os = require("os");
const md5 = require("md5");
const jsStringEscape = require("js-string-escape");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
var allowed_extension = ["txt", "js", "python", "csv", "html"];
const shell = require("electron").shell;

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
    `<li class="p-2 py-3 mt-1 sidebar_folder border" location="${
      directory + "/" + file
    }">
      <i class="fas fa-folder"></i> ${file}
    </li>`
  );
}

$(document).ready(function () {
  $("#search_term").on("keypress", function (e) {
    if (e.which == 13) {
      search();
    }
  });
  $(".sidebar_folder").click(function (e) {
    let location = $(this).attr("location");
    if ($(".selected_sidebar"))
      $(".selected_sidebar").removeClass("selected_sidebar");
    $(this).addClass("selected_sidebar");
    current_location = location;
    LoadAllFiles();
    TranscriptAudio(current_location);
  });
  $(".search_button").click(function () {
    search();
  });
});

function LoadAllFiles() {
  $("#table_content").empty();
  if (fs.existsSync(current_location)) {
    let audio_files = getAudioFiles(current_location);
    files = getTextFiles(current_location);
    files = files.concat(audio_files);

    files.forEach((file) => {
      addEntry(current_location + "/" + file);
    });
  } else {
    console.log("No Folder Exist");
  }
}
function addEntry(location) {
  let stats = fs.statSync(location);
  if (stats.isDirectory()) {
    var file_class = "fas fa-folder";
  } else {
    file_class = "far fa-file-alt";
  }
  let name = location.split("/");
  name = name[name.length - 1];
  let updateString = `<tr><td><i class="${file_class}"></i> ${name}</td><td><small>${
    stats.size / 1000
  } </small></td><td><small>${moment(stats.mtime).format(
    "Do MMMM, h:mm A"
  )}</small></td><td class="text-end"><button class="btn btn-default" onclick="openFile('${location}')"><i class="fas fa-external-link-alt"></i></button></td></tr>`;
  $("#table_content").append(updateString);
}

function search() {
  var term = $("#search_term").val();
  let advance_search = $("#search_type").is(":checked");
  term = jsStringEscape(term);
  if (!term) {
    LoadAllFiles();
    return;
  }
  $("#table_content").empty();
  $("#table_content").append(
    "<tr><td colspan='4' class='text-center'><div class='lds-roller'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></td><tr>"
  );

  var searched_audio = searchAudio(current_location, term);
  console.log(searched_audio);
  if (advance_search) {
    let ranked_files = searchDir(current_location, term);
    $("#table_content").empty();
    ranked_files.map((single_file) => {
      console.log(single_file.count);
      var file_location = single_file.path.trim();
      if (file_location) addEntry(file_location);
    });
  } else {
    let files = getTextFiles(current_location);
    let searched_file = files.map(async (element) => {
      var command = `grep "${term}" "${current_location}/${element}" -i -R -o | wc -l`;
      const { stdout, stderr } = await exec(command);
      if (stdout > 0) {
        return [element, stdout.trim()];
      }
      if (stderr) {
        console.log(stderr);
      }
    });
    Promise.all(searched_file).then(function (results) {
      results = results.filter(function (element) {
        return element !== undefined;
      });
      let ranked_files = results.sort(function (a, b) {
        return b[1] - a[1];
      });
      $("#table_content").empty();
      ranked_files.map((single_file) => {
        console.log("Occurrence is " + single_file[1] + " Times");
        var file_location = single_file[0].trim();
        if (file_location) addEntry(current_location + "/" + file_location);
      });
    });
  }
}

function getTextFiles(location) {
  let files = fs.readdirSync(location);
  files = files.filter((file) => {
    let ext = file.split(".");
    ext = ext[ext.length - 1];
    if (allowed_extension.includes(ext)) {
      let stats = fs.statSync(location + "/" + file);
      if (!stats.isDirectory()) return file;
    }
  });
  return files;
}
function getAudioFiles(location) {
  let files = fs.readdirSync(location);
  files = files.filter((file) => {
    let ext = file.split(".");
    if (ext[ext.length - 1] == "wav") {
      let stats = fs.statSync(location + "/" + file);
      if (!stats.isDirectory()) return file;
    }
  });
  return files;
}

function openFile(file_location) {
  if (confirm("Launching in a external application"))
    shell.openPath(file_location);
}

function TranscriptAudio(location) {
  let files = getAudioFiles(location);
  if (!fs.existsSync(__dirname + "/temp/")) {
    fs.mkdirSync(__dirname + "/temp/");
  }
  files.forEach(async (audio) => {
    if (!fs.existsSync(__dirname + "/temp/" + md5(location + "/" + audio))) {
      var command = `python3 "${__dirname + "/python/audio2text.py"}" "${
        location + "/" + audio
      }"`;
      exec(command, function (error, stdout, stderr) {
        if (stderr) {
          console.log(stderr);
        } else {
          if (stdout.trim() != 0)
            fs.writeFileSync(
              __dirname + "/temp/" + md5(location + "/" + audio),
              stdout
            );
        }
      });
    } else {
      console.log("Transcript already available");
    }
  });
}

TranscriptAudio(current_location);
LoadAllFiles();
loadSideBar(current_directory);


// fs.watch(__dirname+"/"+"index.html", (eventType, filename) => {
//   console.log("\nThe file", filename, "was modified!");
//   console.log("The type of change was:", eventType);
// });
