const images = document.querySelectorAll(".gallery-container img");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const close = document.getElementById("close");

images.forEach(function (image) {

    image.addEventListener("click", function () {

        lightbox.style.display = "flex";

        lightboxImg.src = image.src;

    });

});


close.addEventListener("click", function () {

    lightbox.style.display = "none";

});


lightbox.addEventListener("click", function (event) {

    if (event.target === lightbox) {

        lightbox.style.display = "none";

    }

});