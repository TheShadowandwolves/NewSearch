const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class jar {
  constructor(isWeighted = false) {
    this.array = [],
    this.length = 0,
    this.isWeighted = isWeighted
  }
    moveConstructor(array, length, isWeighted) {
        this.array = array,
        this.length = length,
        this.isWeighted = isWeighted
    }
    push(bullet) {
        this.array.push(bullet);
        this.length++;
        if (this.isWeighted) {
            this.setListWeight()
        }
    }
    pop() {
        let temp = this.array.pop();
        this.length--;
        return temp
    }
    peek() {
        return this.array[this.length-1]
    }
    isEmpty() {
        return this.length == 0
    }
    size() {
        return this.length
    }
    setWeighted() {
        this.isWeighted = true
    }
    getWeight(index) {
        return this.array[index].weight
    }
    getMaxWeight() {
        let max = 0;
        for (let i = 0; i < this.length; i++) {
            if (this.array[i].weight > max) {
                max = this.array[i].weight
            }
        }
        return max
    }
    getMinWeight() {
        let min = this.array[0].weight;
        for (let i = 0; i < this.length; i++) {
            if (this.array[i].weight < min) {
                min = this.array[i].weight
            }
        }
        return min
    }
    setListWeight() {
        for (let i = 0; i < this.length; i++) {
            this.array[i].addWeight()
        }
    }
    shuffle() {
        for (let i = this.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let temp = this.array[i]
            this.array[i] = this.array[j]
            this.array[j] = temp
        }
    }
    union(jar) {
        if (this.isWeighted) {
            for (let i = 0; i < this.length; i++) {
                jar.array.push(this.array[i]);
            }
            this.array = jar.array;
        } else {
            for (let i = 0; i < jar.length; i++) {
                this.array.push(jar.array[i])
            }
        }
        this.length += jar.length;
        this.shuffle();
        return this;
    }
    print() {
        let temp = ""
        for (let i = 0; i < this.length; i++) {
            if (this.isWeighted){
                temp += this.array[i].content.toString() + " (" + this.array[i].weight + ") "
            } else {
                temp += this.array[i].content.toString() + " "
            }
        }
        return temp
    }

}
class bullet {
  constructor(contents) {
    this.content = contents;
    this.weight = 0;
  }
  contents() {
    return this.content
  }
  isEqual(bullet) {
    return this.content == bullet.content
  }
  addWeight() {
    this.weight++;
  }
  subWeight() {
    this.weight--
  }
  sameWeight(bullet) {
    return this.weight == bullet.weight
  }
  print() {
    return this.content
  }
}

function make_bullets(content) {
    return new bullet(content.toString())
}
function make_jar(isWeighted = false) {
    return new jar(isWeighted)
}

// function type(obj, type) {
//     if (type == "content") {
//         return (obj.content.toString());
//     // } else if (type == "weight") {
//     //     return obj.weight
//     } else if (type == "number") {
//         return Number(obj.content)
//     } else {
//         return obj
//     }

// }
function listType(array){
    for (let i = 0; i < array.length; i++) {
        if (isNaN(Number(array[i]))) {
            return "content";
        }
    }
    return "number"
}
/**
 * 
 * @param {string} str
 * @returns {boolean}
 */
function isNum(str) {
    console.log("isNum: "+str + " " + !isNaN(Number(str)))
    return !isNaN(Number(str))
}
/**
 * 
 * @param {bullet} obj
 * @param {bullet} obj2
 * @param {string} type
 * @returns {boolean} 
 */
function compares(obj, obj2, type) {
    a = obj;
    b = obj2;
    console.log("a: "+a+" b: "+b)
    try{
           if (type == "content") {
        if (isNum(a) && isNum(b)) {
            return Number(a) > Number(b);
        } else if (isNum(a) && !isNum(b)) {
            return false
        } else if (!isNum(a) && isNum(b)) {
            return true
        } else {
            return a > b
        }
    } else if (type == "number") {
        return Number(a) > Number(b)
    } else {
        return a > b
    } 
    } catch (e) {
        console.log(e)
        process.exit()
    }

}

/**
 * 
    * @param {jar} jar
    * @param {string} types
 * @returns {array} tempArray
 */
function sort_jar(jar, types){
    console.log("Jar: "+jar.print())
    let tempArray = []
    let i = 0;
    let tempBullet = new bullet("0");
    while (!jar.isEmpty()) {
        tempBullet = jar.pop();
        console.log("TempBullet: "+tempBullet.print())
        try{
            if (compares(tempArray.length, 0, "number")) { // tempArray.length == 0
                tempArray.push(tempBullet)

            } else if (compares(tempBullet, tempArray[tempArray.length-1], types)) { //type(tempBullet, types) > type(tempArray[tempArray.length-1], types) 
                tempArray.push(tempBullet)
            } else if (tempArray.length == 1) {
                if (!compares(tempBullet, tempArray[0], types)) { // type(tempBullet, types) < type(tempArray[0], types)
                    tempArray.unshift(tempBullet)
                } else { // type(tempBullet, types) > type(tempArray[0], types)
                    tempArray.push(tempBullet)
                }
            } else { 
                let alength = tempArray.length - 1;
                for (let j = alength; j >= 0; j--) {
                    // actual sorting
                    if (!compares(tempBullet, tempArray[j], types)) { // type(tempBullet, types) < type(tempArray[j], types)
                        jar.push(tempArray.pop())
                        if (j == 0) {
                            tempArray.push(tempBullet);
                            break
                        }
                        
                    } else {
                        tempArray.push(tempBullet);
                        break
                    }

                }
            }
        } catch (e) {
            console.log("Error in sort_jar: "+e)
        }
        i++;
        jar.shuffle();
    }
    // console.log("TempArray: "+tempArray.print())
    return {array: tempArray, runs: i}
}
/**
 * 
 * @param {array} arraya
 * @param {boolean} isWeighted
 * @returns {jar} sorted
 */
function isBullet(element) {
    return element instanceof bullet
}
function sort(arraya, isWeighted = false){
    let sortedArray = [];
    let typ = "";
    let jar = make_jar(isWeighted);
    if (isBullet(arraya[0])) {
        typ = "content";
        for (let i = 0; i < arraya.length; i++) {
            jar.push(arraya[i])
        } 
        console.log("bullet: ")
    } else {
        typ = listType(arraya);
        for (let i = 0; i < arraya.length; i++) {
            jar.push(make_bullets(arraya[i]))
            console.log("list: "+ arraya[i])
        }
    }
    console.log("Type: "+typ)
    sortedArray = sort_jar(jar, typ);
     
    if (typ == "content"){
        for (let i = 0; i < sortedArray.array.length; i++) {
            sortedArray.array[i].content = sortedArray.array[i].content.toString()
        }
    }
    let sorted = make_jar(isWeighted);
    sorted.moveConstructor(sortedArray.array, sortedArray.array.length, isWeighted)

    return {array: sorted, runs: sortedArray.runs}
}

// let arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
// let arr2 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

// let jar3 = make_jar();
// let jar2 = make_jar();

// for (let i = 0; i < arr.length; i++) {
//     jar3.push(make_bullets(arr[i]))
// }
// for (let i = 0; i < arr2.length; i++) {
//     jar2.push(make_bullets(arr2[i]))
// }
// // console.log("Jar3: "+jar3.print())
// // console.log("Jar2: "+jar2.print())
// let jarmix = jar3.union(jar2);
// // console.log("Union: "+jar3.print() + " length: "+jar3.length + "array: "+jar3.array)
// let sortedArray1 = sort(jarmix.array, true);
// // console.log(sortedArray1.array)
// console.log("Final array: "+sortedArray1.array.print() + " runs: "+sortedArray1.runs)

rl.question("Enter array, keep the values separate with spaces: \n", (input) => {
    let inputs = input.toString();
    let arr = inputs.split(" ");
    console.log("Array: "+arr)
    sortedArraymix = sort(arr, false);
    console.log("Final arraymix: "+sortedArraymix.array.print() + " runs: "+sortedArraymix.runs)
    process.exit();
});
// process.exit();