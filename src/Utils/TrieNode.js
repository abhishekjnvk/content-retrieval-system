module.exports = class TrieNode{
  constructor(char){
    this.children = [];
    for(var i=0; i<26; i++){ 
      this.children[i]=null;
    }
    this.isEndWord = false; 
    this.count=0;
    this.path="";
    this.char = char; 
    this.file = "";
  }
  
  markAsLeaf(key,file){
    this.isEndWord = true;
    if(this.file==file)
      this.count+=1;
    else{
      this.count=1;
      this.file=file;
    }
    this.path=key;
  }

  unMarkAsLeaf(){
    if(this.count==1)
      this.isEndWord = false;
    else
      this.count-=1
  }
}