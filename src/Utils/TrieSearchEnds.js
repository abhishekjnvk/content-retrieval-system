const t = require("./Trie")
const fs=require("fs")

const addData=(data,path)=>{
    const keys = data.split(" ")
    for (let i=0; i<keys.length; i++){
        t.insert(path,keys[i]);
    }
    var key = Object.keys(t.results)
    for(i=0;i<key.length;i++){
        fs.writeFileSync( "./cache/"+key[i] , path+" "+t.results[key[i]]+"\n" , {encoding: "utf8",flag: "a+"})
        console.log(key[i]+" "+t.results[key[i]]+" "+path);
    }
}
