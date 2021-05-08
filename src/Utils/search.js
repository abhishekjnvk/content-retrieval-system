const fs   = require("fs");
const Path = require('path');

const searchDir=(dir,key)=>{
    const files=fs.readdirSync(dir);
    return readAllFilesAndCount(dir,files,key);
    
}

const readAllFilesAndCount=(dir,files,keys)=>{
    var freq=[];
    for(i in files){
        const path = Path.join(dir,files[i]);
        const data =fs.readFileSync(path);
        const keyArray=keys.split(" ");
        var count={}
        for(i in keyArray){
            count[keyArray[i].toString()]=occurrences(data.toString(),keyArray[i],true);
        }
        freq.push({
            "path":path,
            "count": count
        });
    }
    freq=freq.sort((a,b)=>{
        p1=1
        p2=1
        s1=0
        s2=0
       var values1=Object.values(a.count);
       var values2=Object.values(b.count);
       for(i=0;i<values1.length;i++){
           p1=p1*values1[i]
           p2=p2*values2[i]
           s1=s1+values1[i]
           s2=s2+values2[i]
       } 
       if(p1==p2)return s2-s1;
       return p2-p1;
    });
    return freq;
}
const occurrences=(string, subString, allowOverlapping)=>{
    
    string = string.toLowerCase()
    subString =subString.toLowerCase()

    if (subString.length <= 0) return (string.length + 1);

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
}
