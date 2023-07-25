let posts = JSON.parse(localStorage.getItem("posts")) || [];

function uploadPost() {
  const postText = document.getElementById("postInput").value.trim();
  if (postText === "") return; // 내용이 비어있으면 업로드하지 않음

  const post = {
    text: postText,
    timestamp: new Date().getTime(), // 현재 시간으로 타임스탬프 생성
    likes: 0, // 초기 좋아요 수는 0으로 설정
  };

  posts.unshift(post); // 최신 글을 배열의 맨 앞에 추가
  document.getElementById("postInput").value = ""; // 글 작성 영역 비우기
  updatePostList();
  saveToLocalStorage();
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} `;
}
function deletePost(index) {
  posts.splice(index, 1); // 해당 인덱스의 게시글을 배열에서 제거
  updatePostList();
  saveToLocalStorage();
}

function updatePostList() {
  const postListDiv = document.getElementById("postList");
  postListDiv.innerHTML = ""; // 게시글 목록 초기화

  // 최신순으로 정렬된 글 목록을 출력
  posts
    .sort((a, b) => b.timestamp - a.timestamp)
    .forEach((post, index) => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("postDiv");

      const postText = document.createElement("p");
      postText.textContent = post.text;
      postDiv.appendChild(postText);

      const postTime = document.createElement("small");
      postTime.textContent = formatTime(post.timestamp);
      postDiv.appendChild(postTime);

      const likeButton = document.createElement("button");
      likeButton.classList.add("heartButton");
      likeButton.innerHTML = post.likes > 0 ? "❤️" : "🤍";
      likeButton.onclick = () => {
        post.likes += 1;
        likeButton.innerHTML = "❤️";
        updatePostList();
        saveToLocalStorage();
      };
      postDiv.appendChild(likeButton);

      const likeCount = document.createElement("span");
      likeCount.textContent = ` ${post.likes}`;
      postDiv.appendChild(likeCount);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "삭제";
      deleteButton.onclick = () => deletePost(index);
      postDiv.appendChild(deleteButton);

      postListDiv.appendChild(postDiv);
    });
}

function saveToLocalStorage() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// 페이지 로딩 시 최신 글 목록 표시
updatePostList();
