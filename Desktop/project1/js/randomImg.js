function showRandomImage() {
  var images = document.getElementsByClassName("random-image");
  var randomIndex = Math.floor(Math.random() * images.length);

  for (var i = 0; i < images.length; i++) {
    images[i].classList.remove("show");
  }

  images[randomIndex].classList.add("show");
}
