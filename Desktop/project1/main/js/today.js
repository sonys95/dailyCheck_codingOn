var today = document.getElementById("today");
var todayDate = document.getElementById("todayDate");
function clock() {
  var time = new Date();

  // var month = time.getMonth();
  var date = time.getDate();
  var day = time.getDay();
  var week = ["일", "월", "화", "수", "목", "금", "토"];

  // var hours = time.getHours();
  // var minutes = time.getMinutes();
  // var seconds = time.getSeconds();

  today.innerText = `${week[day]}요일 `;
  todayDate.innerText = `${date}`;
}
clock();

const remainTime = document.querySelector("#remain-time");
