// 전역변수
// target은 td를 클릭했을 때 어떤 td가 선택되었는지를 담고 있는 정보
let target = null;

$("#click").on("click", function (e) {
  let clickDate = $(this).text(); // 클릭한 td에 있는 글자
  $("#clickDate").val(clickDate);
  target = this; // target 변수에 내가 선택한 td의 정보를 담는다.
});
$("button").on("click", function () {
  let addContent = $("#addContent").val();
  $(target).append("<strong>" + addContent + "</strong>");
  // append는 html 문서로 넣어주는 친구 = innerText x innerHTML O
});
