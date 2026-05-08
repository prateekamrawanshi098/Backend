/**
 * string , boolean , number , array , tuple , void vs never 
 * 
 * 
 * Array=>fixed type nut dynamic lenght
 * 
 * 
 * tuple =>  fixed lenght and type 
 */

import { isThrowStatement } from "typescript";

/**=================Array=================== */

let array: number[] = [1, 2]
array.push(1);
array.push(4);
array.push(6)
array.push(5)
console.log(array)


/**=================Tuple=================== */

let tuple: [number, string, boolean] = [1, "hey", false]
console.log(tuple)


/**================void function ==================== 
 * it doesn't return anything
*/

function greet(name:string):void  {
    console.log("Hello "+name)
}
greet("prateek")



/**================never function ==================== 
 * it doesn't return anything
*/

function greet1():never{
throw new Error("Something went wrong")
}

greet1()