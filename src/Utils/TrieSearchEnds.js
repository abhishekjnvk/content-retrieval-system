const t = require("./Trie")
const fs=require("fs");
const path = require("path")

const cache_dir = "cache"

// fs.rmdirSync(cache_dir, { recursive: true });

const addData=(data,path)=>{
    const keys = data.split(" ")
    for (let i=0; i<keys.length; i++){
        t.insert(path,keys[i]);
    }
    var key = Object.keys(t.results)
    for(i=0;i<key.length;i++){
        fs.writeFileSync( "./cache/"+key[i] , path+" "+t.results[key[i]]+"\n" , {encoding: "utf8",flag: "a+"})
    }
}

const search=(search_term)=>{
    result = {}
    const keys =search_term.split(" ");
    for (let i=0; i<keys.length; i++){
        if(t.search(keys[i])==false)
            continue;
        const data =  fs.readFileSync(path.join(cache_dir,t.search(keys[i])))
        const lines = data.toString().split("\n");
        for(j=0;j<lines.length-1;j++){
            line =  lines[j]
            file_freq = line.split(" ");
            if(result[file_freq[0]]==null){
                result[file_freq[0]]=[file_freq[1]]
            }else{
                result[file_freq[0]].push(file_freq[1]);
            }
        }
    }
    var sortable = [];
    for (var file in result) {
        sortable.push([file, result[file]]);
    }

    sortable.sort((a, b) => {
        a = a[1]
        b = b[1]
        if(a.length!=b.length)
            return b.length-a.length;
        else
            return b.reduce((a,b)=>a+b,0)-a.reduce((a,b)=>a+b,0)
    });
    console.log(sortable);
}

addData("the the the quick brown fox","file1");
addData("the quick brown fox","file2");
addData("the the the the the brown fox","file3");
addData("the the the the the quick quick brown fox","file4");

search("the quick");