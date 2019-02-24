const moment = require('moment');
const readline = require('readline');
const concat = require('goss_concat');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Введите значения rgb', (value) => {
  let res = value.split(" ");
  for (i = 0; i < res.length; i++) {
    if (res[i] > 255  || res[i] < 0)  {
      console.log("Неправильное значение");
      break;
    }
    if (i == 2)  console.log(concat('rgb(', res[0], ', ' ,res[1], ', ',  res[2], ')'));
  }
  rl.close();
});
