import "./popup.min.js";
/* empty css          */
/* empty css               */
/* empty css            */
/* empty css               */
//#region src/components/pages/blog/blog.js
var searchInput = document.querySelector(".form-popup__input");
var searchBlock = document.querySelector(".block-search");
searchInput.addEventListener("input", () => {
	if (searchInput.value.trim().length > 0) {
		searchBlock.style.opacity = "1";
		searchBlock.style.pointerEvents = "auto";
	} else {
		searchBlock.style.opacity = "0";
		searchBlock.style.pointerEvents = "none";
	}
});
//#endregion
