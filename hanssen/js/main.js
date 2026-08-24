//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/components/effects/preloader/preloader.js
function preloader() {
	const preloaderImages = document.querySelectorAll("img");
	const htmlDocument = document.documentElement;
	const isPreloaded = localStorage.getItem(location.href) && document.querySelector("[data-fls-preloader=\"true\"]");
	if (preloaderImages.length && !isPreloaded) {
		document.body.insertAdjacentHTML("beforeend", `
			<div class="fls-preloader">
				<div class="fls-preloader__body">
					<div class="fls-preloader__counter">0%</div>
					<div class="fls-preloader__line"><span></span></div>
				</div>
			</div>`);
		document.querySelector(".fls-preloader");
		const showPecentLoad = document.querySelector(".fls-preloader__counter"), showLineLoad = document.querySelector(".fls-preloader__line span");
		let imagesLoadedCount = 0;
		let counter = 0;
		let progress = 0;
		htmlDocument.setAttribute("data-fls-preloader-loading", "");
		htmlDocument.setAttribute("data-fls-scrolllock", "");
		preloaderImages.forEach((preloaderImage) => {
			const imgClone = document.createElement("img");
			if (imgClone) {
				imgClone.onload = imageLoaded;
				imgClone.onerror = imageLoaded;
				preloaderImage.dataset.src ? imgClone.src = preloaderImage.dataset.src : imgClone.src = preloaderImage.src;
			}
		});
		function setValueProgress(progress) {
			showPecentLoad && (showPecentLoad.innerText = `${progress}%`);
			showLineLoad && (showLineLoad.style.width = `${progress}%`);
		}
		setValueProgress(progress);
		function imageLoaded() {
			imagesLoadedCount++;
			progress = Math.round(100 / preloaderImages.length * imagesLoadedCount);
			const intervalId = setInterval(() => {
				counter >= progress ? clearInterval(intervalId) : setValueProgress(++counter);
				counter >= 100 && addLoadedClass();
			}, 10);
		}
		const preloaderOnce = () => localStorage.setItem(location.href, "preloaded");
		document.querySelector("[data-fls-preloader=\"true\"]") && preloaderOnce();
	} else addLoadedClass();
	function addLoadedClass() {
		htmlDocument.setAttribute("data-fls-preloader-loaded", "");
		htmlDocument.removeAttribute("data-fls-preloader-loading");
		htmlDocument.removeAttribute("data-fls-scrolllock");
	}
}
document.addEventListener("DOMContentLoaded", preloader);
//#endregion
