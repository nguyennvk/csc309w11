function flattenArray(nestedArray){
    if (!Array.isArray(nestedArray)){
        console.error("Invalid input array")
        return null
    }
    let arr = []
    for (var x of nestedArray){
        if (Array.isArray(x)){
            arr = arr.concat(flattenArray(x))
        }
        else{
            arr.push(x)
        }
    }
    return arr
}


function groupBy(arr, property){
    if (!Array.isArray(arr)){
        console.error("Invalid input array")
        return null
    }
    let return_arr = {}
    for (var x of arr){
        if (typeof x !== "object" || x[property] === undefined){
            console.error("Invalid input")
            return null
        }
        if (return_arr.hasOwnProperty(String(x[property]))){
            return_arr[String(x[property])].push(x)
        }
        else{
            return_arr[String(x[property])] = [x]
        }
    }
    return return_arr
}
  

function append(...args){
    var s = ""
    for (var x of args){
        s += String(x)
    }
    return s
}

function memoize(fn){
    if (typeof fn !== "function"){
        console.error("Invalid input")
        return null
    }
    const memo = {}
    return function (...args){
        if (memo.hasOwnProperty(append(args))){
            return memo[append(args)]
        }
        else{
            memo[append(args)] = fn(args)
            return fn(args)
        }

    }
}

function sumNestedValues(obj){
    if (typeof obj !== "object"){
        console.error("Invalid input")
        return null
    }
    let result = 0
    for (var x in obj){
        if (typeof obj[x] === "object"){
            result += sumNestedValues(obj[x])
        }
        else if (typeof obj[x] === "number"){
            result += obj[x]
        }
    }
    return result
}


function paginateArray(arr, pageSize, pageNumber){
    if(typeof pageSize ==='number' && typeof pageNumber ==="number" 
        && pageSize > 0 && pageNumber > 0){
        const max_page = Math.ceil(arr.length/pageSize)
        let array = []
        if (pageNumber > max_page){
            return array
        }
        let start_ind = pageSize*(pageNumber-1)
        for (let x = 0; x<pageSize;x++){
            if (x >= arr.length){
                break
            }
            array.push(arr[start_ind+x])
        }
        return array
    }
    else{
        console.error("Invalid input")
        return null
    }
}


class EventEmitter{
    constructor(){
        this.registar = {}
    }
    on(event, handler){
        if (typeof handler !== "function"){
            console.error("Invalid input")
            return null
        }
        this.registar[event] = handler
    }
    emit(event, data){
        if (this.registar[event] === undefined){
            console.error("Invalid input")
            return null
        }
        this.registar[event](data)
    }
}  

function firstNonRepeatingChar(str){
    if (typeof str !== "string"){
        console.error("Invalid input")
        return null
    }
    let obj = {}
    for (let x of str){
        if (obj.hasOwnProperty(x)){
            obj[x] += 1
        }
        else{
            obj[x] = 1
        }
    }
    for (let x in obj){
        if (obj[x] == 1){
            return x
        }
    }
    return null
}

module.exports = {
    flattenArray,
    groupBy,
    memoize,
    sumNestedValues,
    paginateArray,
    EventEmitter,
    firstNonRepeatingChar,
  };
  
