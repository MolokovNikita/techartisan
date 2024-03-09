// let list = {
//     names: [
//         { item: "dgsfg" },
//         { name: "John Doe" },
//         { age: "John Doe" },
//         { eofw: "123" },
//         { 132: "1312" },
//         { dfdsf: 999 }
//     ],
//     info: [
//         { name: 'Nikita' }
//     ]
// };
// function getAttributesAndValues(array) {
//     let attributeNames = [];
//     let attributeValues = [];

//     for (let i = 0; i < array.length; i++) {
//         for (let key in array[i]) {
//             attributeNames.push(key);
//             attributeValues.push(array[i][key]);
//         }
//     }

//     return { attributeNames, attributeValues };
// }
// const findMax = (array) => {
//     let max = 0;
//     for (let i = 1; i < array.length; i++) {
//         if (typeof array[i] !== 'number' || isNaN(array[i])) continue;
//         if (array[i] > max) {
//             max = array[i];
//         }
//     }
//     return max;
// };
// const foo = async (callback) => {
//     return new Promise((resolve, reject) => {
//         let { attributeNames, attributeValues } = getAttributesAndValues(callback);
//         console.log('Имена атрибутов:', JSON.stringify(attributeNames));
//         console.log('Значения атрибутов:', JSON.stringify(attributeValues));
//         setTimeout(() => {
//             let maximum = findMax(attributeValues);
//             if (maximum) resolve(maximum)
//             reject('error your argument is ' + maximum);
//         }, 5000)
//     });
// }
// const printer = async () => {
//     console.log("in printer")
//     main()
//     await new Promise((resolve, reject) => {
//         setTimeout(() => console.log("I Am printer!!"), resolve(console.log("Finally")) , 2500);
//     })

// };
// function main() {
//     console.log("in world")
//     console.log("world");
// }

// (async () => {
//     await foo(list.names)
//         .then((value) => console.log(`The maximum number is ${value}`))
//         .catch((err) => console.error(err));
//     console.log("Hello")
//     await printer()
//     // do not printed
// })();
// function GetInfo(){
// return new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         let data = 234
//         if(data>100) resolve(data)
//          reject(new Error('Invalid data'))
//     },5000)
// })
// }
// function GetBooks(data){
//     return new Promise((resolve,reject)=>{
//         const newdata = 333;
//         resolve(newdata)
//     })
// }
// function run(){
//     GetInfo()
//     .then((data)=>{
//         console.log(data)
//         return GetBooks(data)
//     })
//     .then((newdata)=>{
//         console.log(newdata)
//     })
//     .catch((msg)=>
//     {
//         console.log(msg);
//     })
// }
// console.log("start")
// run()
// console.log("end");

