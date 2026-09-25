import "./popup.min.js";
/* empty css                    */
/* empty css               */
import "./select.min.js";
/* empty css            */
/* empty css                */
/* empty css               */
//#region src/components/pages/shop/shop.js
var gridBtn = document.getElementById("grid-view");
var listBtn = document.getElementById("list-view");
var productsCards = document.querySelector(".ourproducts__cards");
if (gridBtn && listBtn && productsCards) {
	gridBtn.addEventListener("click", () => {
		productsCards.classList.remove("ourproducts__cards--list");
	});
	listBtn.addEventListener("click", () => {
		productsCards.classList.add("ourproducts__cards--list");
	});
}
//#endregion
