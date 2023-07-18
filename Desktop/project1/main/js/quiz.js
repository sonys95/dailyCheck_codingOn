let num = 1;

function writeList() {
  // let writer = document.getElementById("writer").value;
  let content = document.getElementById("content").value;
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  // 1.table 요소 가져온 후 tr, td createElement 만들고 tr에 append로 넣고, table에 tr 넣고

  let tr = document.createElement("tr");
  // let html = `<td>${num}</td>`;
  // tr.innerHTML = html;
  let td1 = document.createElement("td");
  td1.innerText = "\uF4CA";
  // td1.innerText = document.querySelectorAll("tr").length;
  // let td2 = document.createElement("td");
  // td2.innerText = writer;
  let td2 = document.createElement("td");
  td2.innerText = content;
  let td3 = document.createElement("td");
  td3.innerText = `${year}-${month}-${day}`;

  tr.append(td1);
  tr.append(td2);
  tr.append(td3);
  // tr.append(td4);

  let table = document.querySelector("table");
  table.append(tr);
  num++;
}
