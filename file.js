let date = new Date();

// console.log(date.getFullYear());
// console.log(date.getMonth());
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

console.log(date.toString());
console.log(date.getFullYear().toString().substr(2,2),monthNames[ date.getMonth() ],date.getDate().toString());