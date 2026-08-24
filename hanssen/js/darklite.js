import { c as slideUp, i as dataMediaQueries, l as uniqArray, n as bodyLockToggle, s as slideToggle, t as bodyLockStatus } from "./common.js";
//#region src/components/layout/spollers/spollers.js
function spollers() {
	const spollersArray = document.querySelectorAll("[data-fls-spollers]");
	if (spollersArray.length > 0) {
		document.addEventListener("click", setSpollerAction);
		const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
			return !item.dataset.flsSpollers.split(",")[0];
		});
		if (spollersRegular.length) initSpollers(spollersRegular);
		let mdQueriesArray = dataMediaQueries(spollersArray, "flsSpollers");
		if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem) => {
			mdQueriesItem.matchMedia.addEventListener("change", function() {
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
			initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
		});
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach((spollersBlock) => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add("--spoller-init");
					initSpollerBody(spollersBlock);
				} else {
					spollersBlock.classList.remove("--spoller-init");
					initSpollerBody(spollersBlock, false);
				}
			});
		}
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerItems = spollersBlock.querySelectorAll("details");
			if (spollerItems.length) spollerItems.forEach((spollerItem) => {
				let spollerTitle = spollerItem.querySelector("summary");
				if (hideSpollerBody) {
					spollerTitle.removeAttribute("tabindex");
					if (!spollerItem.hasAttribute("data-fls-spollers-open")) {
						spollerItem.open = false;
						spollerTitle.nextElementSibling.hidden = true;
					} else {
						spollerTitle.classList.add("--spoller-active");
						spollerItem.open = true;
					}
				} else {
					spollerTitle.setAttribute("tabindex", "-1");
					spollerTitle.classList.remove("--spoller-active");
					spollerItem.open = true;
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest("summary") && el.closest("[data-fls-spollers]")) {
				e.preventDefault();
				if (el.closest("[data-fls-spollers]").classList.contains("--spoller-init")) {
					const spollerTitle = el.closest("summary");
					const spollerBlock = spollerTitle.closest("details");
					const spollersBlock = spollerTitle.closest("[data-fls-spollers]");
					const oneSpoller = spollersBlock.hasAttribute("data-fls-spollers-one");
					const scrollSpoller = spollerBlock.hasAttribute("data-fls-spollers-scroll");
					const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
					if (!spollersBlock.querySelectorAll(".--slide").length) {
						if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
						!spollerBlock.open ? spollerBlock.open = true : setTimeout(() => {
							spollerBlock.open = false;
						}, spollerSpeed);
						spollerTitle.classList.toggle("--spoller-active");
						slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
						if (scrollSpoller && spollerTitle.classList.contains("--spoller-active")) {
							const scrollSpollerValue = spollerBlock.dataset.flsSpollersScroll;
							const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
							const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-fls-spollers-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
							window.scrollTo({
								top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
								behavior: "smooth"
							});
						}
					}
				}
			}
			if (!el.closest("[data-fls-spollers]")) {
				const spollersClose = document.querySelectorAll("[data-fls-spollers-close]");
				if (spollersClose.length) spollersClose.forEach((spollerClose) => {
					const spollersBlock = spollerClose.closest("[data-fls-spollers]");
					const spollerCloseBlock = spollerClose.parentNode;
					if (spollersBlock.classList.contains("--spoller-init")) {
						const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
						spollerClose.classList.remove("--spoller-active");
						slideUp(spollerClose.nextElementSibling, spollerSpeed);
						setTimeout(() => {
							spollerCloseBlock.open = false;
						}, spollerSpeed);
					}
				});
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveBlock = spollersBlock.querySelector("details[open]");
			if (spollerActiveBlock && !spollersBlock.querySelectorAll(".--slide").length) {
				const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
				const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
				spollerActiveTitle.classList.remove("--spoller-active");
				slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
				setTimeout(() => {
					spollerActiveBlock.open = false;
				}, spollerSpeed);
			}
		}
	}
}
window.addEventListener("load", spollers);
//#endregion
//#region src/components/layout/menu/menu.js
function menuInit() {
	document.addEventListener("click", function(e) {
		if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
			bodyLockToggle();
			document.documentElement.toggleAttribute("data-fls-menu-open");
		}
	});
}
document.querySelector("[data-fls-menu]") && window.addEventListener("load", menuInit);
//#endregion
//#region src/components/effects/watcher/watcher.js
var ScrollWatcher = class {
	constructor(props) {
		let defaultConfig = { logging: true };
		this.config = Object.assign(defaultConfig, props);
		this.observer;
		!document.documentElement.hasAttribute("data-fls-watch") && this.scrollWatcherRun();
	}
	scrollWatcherUpdate() {
		this.scrollWatcherRun();
	}
	scrollWatcherRun() {
		document.documentElement.setAttribute("data-fls-watch", "");
		this.scrollWatcherConstructor(document.querySelectorAll("[data-fls-watcher]"));
	}
	scrollWatcherConstructor(items) {
		if (items.length) uniqArray(Array.from(items).map(function(item) {
			if (item.dataset.flsWatcher === "navigator" && !item.dataset.flsWatcherThreshold) {
				let valueOfThreshold;
				if (item.clientHeight > 2) {
					valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
					if (valueOfThreshold > 1) valueOfThreshold = 1;
				} else valueOfThreshold = 1;
				item.setAttribute("data-fls-watcher-threshold", valueOfThreshold.toFixed(2));
			}
			return `${item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null}|${item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px"}|${item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0}`;
		})).forEach((uniqParam) => {
			let uniqParamArray = uniqParam.split("|");
			let paramsWatch = {
				root: uniqParamArray[0],
				margin: uniqParamArray[1],
				threshold: uniqParamArray[2]
			};
			let groupItems = Array.from(items).filter(function(item) {
				let watchRoot = item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null;
				let watchMargin = item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px";
				let watchThreshold = item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0;
				if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
			});
			let configWatcher = this.getScrollWatcherConfig(paramsWatch);
			this.scrollWatcherInit(groupItems, configWatcher);
		});
	}
	getScrollWatcherConfig(paramsWatch) {
		let configWatcher = {};
		if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root);
		else if (paramsWatch.root !== "null") {}
		configWatcher.rootMargin = paramsWatch.margin;
		if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) return;
		if (paramsWatch.threshold === "prx") {
			paramsWatch.threshold = [];
			for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
		} else paramsWatch.threshold = paramsWatch.threshold.split(",");
		configWatcher.threshold = paramsWatch.threshold;
		return configWatcher;
	}
	scrollWatcherCreate(configWatcher) {
		this.observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				this.scrollWatcherCallback(entry, observer);
			});
		}, configWatcher);
	}
	scrollWatcherInit(items, configWatcher) {
		this.scrollWatcherCreate(configWatcher);
		items.forEach((item) => this.observer.observe(item));
	}
	scrollWatcherIntersecting(entry, targetElement) {
		if (entry.isIntersecting) !targetElement.classList.contains("--watcher-view") && targetElement.classList.add("--watcher-view");
		else targetElement.classList.contains("--watcher-view") && targetElement.classList.remove("--watcher-view");
	}
	scrollWatcherOff(targetElement, observer) {
		observer.unobserve(targetElement);
	}
	scrollWatcherCallback(entry, observer) {
		const targetElement = entry.target;
		this.scrollWatcherIntersecting(entry, targetElement);
		targetElement.hasAttribute("data-fls-watcher-once") && entry.isIntersecting && this.scrollWatcherOff(targetElement, observer);
		document.dispatchEvent(new CustomEvent("watcherCallback", { detail: { entry } }));
	}
};
document.querySelector("[data-fls-watcher]") && window.addEventListener("load", () => new ScrollWatcher({}));
//#endregion
//#region src/components/effects/darklite/darklite.js
function getHours() {
	return (/* @__PURE__ */ new Date()).getHours();
}
function darkliteInit() {
	const htmlBlock = document.documentElement;
	const saveUserTheme = localStorage.getItem("fls-user-theme");
	let userTheme;
	if (document.querySelector("[data-fls-darklite-time]")) {
		let customRange = document.querySelector("[data-fls-darklite-time]").dataset.flsDarkliteTime;
		customRange = customRange || "18,5";
		const timeFrom = +customRange.split(",")[0];
		const timeTo = +customRange.split(",")[1];
		console.log(timeFrom);
		userTheme = getHours() >= timeFrom && getHours() <= timeTo ? "dark" : "light";
	} else {
		if (window.matchMedia) userTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
			!saveUserTheme && changeTheme();
		});
	}
	const themeButton = document.querySelector("[data-fls-darklite-set]");
	const resetButton = document.querySelector("[data-fls-darklite-reset]");
	if (themeButton) themeButton.addEventListener("click", function(e) {
		changeTheme(true);
	});
	if (resetButton) resetButton.addEventListener("click", function(e) {
		localStorage.setItem("fls-user-theme", "");
	});
	function setThemeClass() {
		htmlBlock.setAttribute(`data-fls-darklite-${saveUserTheme ? saveUserTheme : userTheme}`, "");
	}
	setThemeClass();
	function changeTheme(saveTheme = false) {
		let currentTheme = htmlBlock.hasAttribute("data-fls-darklite-light") ? "light" : "dark";
		let newTheme;
		if (currentTheme === "light") newTheme = "dark";
		else if (currentTheme === "dark") newTheme = "light";
		htmlBlock.removeAttribute(`data-fls-darklite-${currentTheme}`);
		htmlBlock.setAttribute(`data-fls-darklite-${newTheme}`, "");
		saveTheme && localStorage.setItem("fls-user-theme", newTheme);
	}
}
document.querySelector("[data-fls-darklite]") && window.addEventListener("load", darkliteInit);
//#endregion
