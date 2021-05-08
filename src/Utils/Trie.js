const TrieNode = require('./TrieNode.js');
 
class Trie{
 constructor(){
   this.root = new TrieNode('');
   this.results={}
  };

  getIndex(t){
   return t.charCodeAt(0) - "a".charCodeAt(0);
  }
  insert(path,key){
   if (key == null){
     return;
   };
  
   key = key.toLowerCase();
   let currentNode = this.root;
   let index = 0;  
         
   for (let level=0; level<key.length; level++){
     index = this.getIndex(key[level]);
    
     if (currentNode.children[index] == null){
       currentNode.children[index] = new TrieNode(key[level]);
     }
     currentNode = currentNode.children[index];
   }
   currentNode.markAsLeaf(key,path);
   this.results[key]=currentNode.count;
  };
  
 search(key){
  
    if (key == null){
      return false;
    }
   
    key = key.toLowerCase();
    let currentNode = this.root;
    let index = 0;
   
    for (var level=0; level<key.length; level++){
      index = this.getIndex(key[level]);
      if (currentNode.children[index] == null){
        return false;
      }
      currentNode = currentNode.children[index];
    }                                            
    if (currentNode != null && currentNode.isEndWord){
      return currentNode.count;
    }
    return false;
  };
 
 hasNoChildren(currentNode){
    for (let i=0; i<currentNode.children.length; i++){
      if (currentNode.children[i] != null)
        return false;
    }
    return true;
  }
   
 deleteHelper(key, currentNode, length, level){
    let deletedSelf = false;
        
    if (currentNode == null){
      console.log("Key does not exist");
      return deletedSelf;
    }
   
    if (level == length){
      if (this.hasNoChildren(currentNode)){
        currentNode = null;
        deletedSelf = true;
      }
      else{
        currentNode.unMarkAsLeaf();
        deletedSelf = false;
      }
    }
    else{
      let childNode = currentNode.children[this.getIndex(key[level])];
      let childDeleted = this.deleteHelper(key, childNode, length, level + 1);
      if (childDeleted){
        currentNode.children[this.getIndex(key[level])] = null;
        if (currentNode.isEndWord)
          deletedSelf = false;
        else if(this.hasNoChildren(currentNode) == false)
          deletedSelf = false;
        else{
          currentNode = null;
          deletedSelf = true;
        }
      } 
      else
        deletedSelf = false;
    } 
    return deletedSelf
  }

  delete(key){
     if (this.root == null || key == null){
      console.log("None key or empty trie error");
      return;
     }
   
     this.deleteHelper(key, this.root, key.length, 0);
  } 
} 

module.exports = new Trie();