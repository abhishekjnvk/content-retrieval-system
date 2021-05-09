// const fs   = require("fs");
const Path = require("path");

const searchDir = (dir, key) => {
  const files = getTextFiles(dir);
  return readAllFilesAndCount(dir, files, key);
};

const readAllFilesAndCount = (dir, files, keys, type = 1) => {
  //type(1:text,2:audio)
  var freq = [];
  for (i in files) {
    var path = Path.join(dir, files[i]);
    if (type == 2) {
      //if file is audio then searching in transcript
      path = Path.join(__dirname + "/temp/" + md5(dir + "/" + files[i]));
    }
    const data = fs.readFileSync(path);
    const keyArray = keys.split(" ");
    var count = {};

    if (type != 1) {
      path = files[i];
    }

    for (i in keyArray) {
      count[keyArray[i].toString()] = occurrences(
        data.toString(),
        keyArray[i],
        true
      );
    }
    freq.push({
      path: path,
      count: count,
    });
  }
  freq.sort((a, b) => {
    p1 = 1;
    p2 = 1;
    s1 = 0;
    s2 = 0;
    var values1 = Object.values(a.count);
    var values2 = Object.values(b.count);
    for (i = 0; i < values1.length; i++) {
      p1 = p1 * values1[i];
      p2 = p2 * values2[i];
      s1 = s1 + values1[i];
      s2 = s2 + values2[i];
    }
    if (p1 == p2) return s2 - s1;
    return p2 - p1;
  });
  freq = freq.filter((a) => {
    s = 0;
    var values1 = Object.values(a.count);
    for (i = 0; i < values1.length; i++) {
      s = s + values1[i];
    }
    return s > 0;
  });
  return freq;
};
const occurrences = (string, subString, allowOverlapping) => {
  string = string.toLowerCase();
  subString = subString.toLowerCase();

  if (subString.length <= 0) return string.length + 1;

  var n = 0,
    pos = 0,
    step = allowOverlapping ? 1 : subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else break;
  }
  return n;
};

const searchAudio = (dir, term) => {
  var audio_files = getAudioFiles(dir);
  audio_files = audio_files.map((file) => {
    let transcript = __dirname + "/temp/" + md5(dir + "/" + file);
    if (fs.existsSync(transcript)) return file;
  });
  audio_files = audio_files.filter(function (element) {
    return element !== undefined;
  });
  return readAllFilesAndCount(dir, audio_files, term, 2);
};

