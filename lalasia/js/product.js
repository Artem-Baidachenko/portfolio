import "./main.js";
/* empty css      */
/* empty css          */
import "./form.js";
/* empty css     */
//#region src/components/pages/product/product.js
var searchInput = document.querySelector(".form-filters__input");
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
