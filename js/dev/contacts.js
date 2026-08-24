import { n as slideToggle, r as slideUp, t as formValidate } from "./main.min.js";
/* empty css                    */
//#region src/components/forms/select/select.js
var SelectConstructor = class {
	constructor(props, data = null) {
		let defaultConfig = {
			init: true,
			speed: 150
		};
		this.config = Object.assign(defaultConfig, props);
		this.selectClasses = {
			classSelect: "select",
			classSelectBody: "select__body",
			classSelectTitle: "select__title",
			classSelectValue: "select__value",
			classSelectLabel: "select__label",
			classSelectInput: "select__input",
			classSelectText: "select__text",
			classSelectLink: "select__link",
			classSelectOptions: "select__options",
			classSelectOptionsScroll: "select__scroll",
			classSelectOption: "select__option",
			classSelectContent: "select__content",
			classSelectRow: "select__row",
			classSelectData: "select__asset",
			classSelectDisabled: "--select-disabled",
			classSelectTag: "--select-tag",
			classSelectOpen: "--select-open",
			classSelectActive: "--select-active",
			classSelectFocus: "--select-focus",
			classSelectMultiple: "--select-multiple",
			classSelectCheckBox: "--select-checkbox",
			classSelectOptionSelected: "--select-selected",
			classSelectPseudoLabel: "--select-pseudo-label"
		};
		this._this = this;
		if (this.config.init) {
			const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select[data-fls-select]");
			if (selectItems.length) this.selectsInit(selectItems);
		}
	}
	getSelectClass(className) {
		return `.${className}`;
	}
	getSelectElement(selectItem, className) {
		return {
			originalSelect: selectItem.querySelector("select"),
			selectElement: selectItem.querySelector(this.getSelectClass(className))
		};
	}
	selectsInit(selectItems) {
		selectItems.forEach((originalSelect, index) => {
			this.selectInit(originalSelect, index + 1);
		});
		document.addEventListener("click", function(e) {
			this.selectsActions(e);
		}.bind(this));
		document.addEventListener("keydown", function(e) {
			this.selectsActions(e);
		}.bind(this));
		document.addEventListener("focusin", function(e) {
			this.selectsActions(e);
		}.bind(this));
		document.addEventListener("focusout", function(e) {
			this.selectsActions(e);
		}.bind(this));
	}
	selectInit(originalSelect, index) {
		index && (originalSelect.dataset.flsSelectId = index);
		if (originalSelect.options.length) {
			const _this = this;
			let selectItem = document.createElement("div");
			selectItem.classList.add(this.selectClasses.classSelect);
			originalSelect.parentNode.insertBefore(selectItem, originalSelect);
			selectItem.appendChild(originalSelect);
			originalSelect.hidden = true;
			if (this.getSelectPlaceholder(originalSelect)) {
				originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
				if (this.getSelectPlaceholder(originalSelect).label.show) this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
			}
			selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
			this.selectBuild(originalSelect);
			originalSelect.dataset.flsSelectSpeed = originalSelect.dataset.flsSelectSpeed ? originalSelect.dataset.flsSelectSpeed : this.config.speed;
			this.config.speed = +originalSelect.dataset.flsSelectSpeed;
			originalSelect.addEventListener("change", function(e) {
				_this.selectChange(e);
			});
		}
	}
	selectBuild(originalSelect) {
		const selectItem = originalSelect.parentElement;
		if (originalSelect.id) {
			selectItem.id = originalSelect.id;
			originalSelect.removeAttribute("id");
		}
		selectItem.dataset.flsSelectId = originalSelect.dataset.flsSelectId;
		originalSelect.dataset.flsSelectModif && selectItem.classList.add(`select--${originalSelect.dataset.flsSelectModif}`);
		originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
		originalSelect.hasAttribute("data-fls-select-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
		this.setSelectTitleValue(selectItem, originalSelect);
		this.setOptions(selectItem, originalSelect);
		originalSelect.hasAttribute("data-fls-select-search") && this.searchActions(selectItem);
		originalSelect.hasAttribute("data-fls-select-open") && this.selectAction(selectItem);
		this.selectDisabled(selectItem, originalSelect);
	}
	selectsActions(e) {
		const t = e.target, type = e.type;
		const isSelect = t.closest(this.getSelectClass(this.selectClasses.classSelect));
		const isTag = t.closest(this.getSelectClass(this.selectClasses.classSelectTag));
		if (!isSelect && !isTag) return this.selectsСlose();
		const selectItem = isSelect || document.querySelector(`.${this.selectClasses.classSelect}[data-fls-select-id="${isTag.dataset.flsSelectId}"]`);
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		if (originalSelect.disabled) return;
		if (type === "click") {
			const tag = t.closest(this.getSelectClass(this.selectClasses.classSelectTag));
			const title = t.closest(this.getSelectClass(this.selectClasses.classSelectTitle));
			const option = t.closest(this.getSelectClass(this.selectClasses.classSelectOption));
			if (tag) {
				const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-fls-select-id="${tag.dataset.flsSelectId}"] .select__option[data-fls-select-value="${tag.dataset.flsSelectValue}"]`);
				this.optionAction(selectItem, originalSelect, optionItem);
			} else if (title) this.selectAction(selectItem);
			else if (option) this.optionAction(selectItem, originalSelect, option);
		} else if (type === "focusin" || type === "focusout") {
			if (isSelect) selectItem.classList.toggle(this.selectClasses.classSelectFocus, type === "focusin");
		} else if (type === "keydown" && e.code === "Escape") this.selectsСlose();
	}
	selectsСlose(selectOneGroup) {
		const selectActiveItems = (selectOneGroup ? selectOneGroup : document).querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
		if (selectActiveItems.length) selectActiveItems.forEach((selectActiveItem) => {
			this.selectСlose(selectActiveItem);
		});
	}
	selectСlose(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		if (!selectOptions.classList.contains("_slide")) {
			selectItem.classList.remove(this.selectClasses.classSelectOpen);
			slideUp(selectOptions, originalSelect.dataset.flsSelectSpeed);
			setTimeout(() => {
				selectItem.style.zIndex = "";
			}, originalSelect.dataset.flsSelectSpeed);
		}
	}
	selectAction(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`);
		const selectOpenzIndex = originalSelect.dataset.flsSelectZIndex ? originalSelect.dataset.flsSelectZIndex : 3;
		this.setOptionsPosition(selectItem);
		if (originalSelect.closest("[data-fls-select-one]")) {
			const selectOneGroup = originalSelect.closest("[data-fls-select-one]");
			this.selectsСlose(selectOneGroup);
		}
		setTimeout(() => {
			if (!selectOptions.classList.contains("--slide")) {
				selectItem.classList.toggle(this.selectClasses.classSelectOpen);
				slideToggle(selectOptions, originalSelect.dataset.flsSelectSpeed);
				if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) selectItem.style.zIndex = selectOpenzIndex;
				else setTimeout(() => {
					selectItem.style.zIndex = "";
				}, originalSelect.dataset.flsSelectSpeed);
			}
		}, 0);
	}
	setSelectTitleValue(selectItem, originalSelect) {
		const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
		const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
		if (selectItemTitle) selectItemTitle.remove();
		selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
		originalSelect.hasAttribute("data-fls-select-search") && this.searchActions(selectItem);
	}
	getSelectTitleValue(selectItem, originalSelect) {
		let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
		if (originalSelect.multiple && originalSelect.hasAttribute("data-fls-select-tags")) {
			selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option) => `<span role="button" data-fls-select-id="${selectItem.dataset.flsSelectId}" data-fls-select-value="${option.value}" class="--select-tag">${this.getSelectElementContent(option)}</span>`).join("");
			if (originalSelect.dataset.flsSelectTags && document.querySelector(originalSelect.dataset.flsSelectTags)) {
				document.querySelector(originalSelect.dataset.flsSelectTags).innerHTML = selectTitleValue;
				if (originalSelect.hasAttribute("data-fls-select-search")) selectTitleValue = false;
			}
		}
		selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.flsSelectPlaceholder || "";
		if (!originalSelect.hasAttribute("data-fls-select-tags")) selectTitleValue = selectTitleValue ? selectTitleValue.map((item) => item.replace(/"/g, "&quot;")) : "";
		let pseudoAttribute = "";
		let pseudoAttributeClass = "";
		if (originalSelect.hasAttribute("data-fls-select-pseudo-label")) {
			pseudoAttribute = originalSelect.dataset.flsSelectPseudoLabel ? ` data-fls-select-pseudo-label="${originalSelect.dataset.flsSelectPseudoLabel}"` : ` data-fls-select-pseudo-label="Заповніть атрибут"`;
			pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
		}
		this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
		if (originalSelect.hasAttribute("data-fls-select-search")) return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-fls-select-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`;
		else {
			const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.flsSelectClass ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.flsSelectClass}` : "";
			return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
		}
	}
	getSelectElementContent(selectOption) {
		const selectOptionData = selectOption.dataset.flsSelectAsset ? `${selectOption.dataset.flsSelectAsset}` : "";
		const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
		let selectOptionContentHTML = ``;
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
		selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
		selectOptionContentHTML += selectOptionData ? `</span>` : "";
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
		selectOptionContentHTML += selectOption.textContent;
		selectOptionContentHTML += selectOptionData ? `</span>` : "";
		selectOptionContentHTML += selectOptionData ? `</span>` : "";
		return selectOptionContentHTML;
	}
	getSelectPlaceholder(originalSelect) {
		const selectPlaceholder = Array.from(originalSelect.options).find((option) => !option.value);
		if (selectPlaceholder) return {
			value: selectPlaceholder.textContent,
			show: selectPlaceholder.hasAttribute("data-fls-select-show"),
			label: {
				show: selectPlaceholder.hasAttribute("data-fls-select-label"),
				text: selectPlaceholder.dataset.flsSelectLabel
			}
		};
	}
	getSelectedOptionsData(originalSelect, type) {
		let selectedOptions = [];
		if (originalSelect.multiple) selectedOptions = Array.from(originalSelect.options).filter((option) => option.value).filter((option) => option.selected);
		else selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
		return {
			elements: selectedOptions.map((option) => option),
			values: selectedOptions.filter((option) => option.value).map((option) => option.value),
			html: selectedOptions.map((option) => this.getSelectElementContent(option))
		};
	}
	getOptions(originalSelect) {
		const selectOptionsScroll = originalSelect.hasAttribute("data-fls-select-scroll") ? `` : "";
		const customMaxHeightValue = +originalSelect.dataset.flsSelectScroll ? +originalSelect.dataset.flsSelectScroll : null;
		let selectOptions = Array.from(originalSelect.options);
		if (selectOptions.length > 0) {
			let selectOptionsHTML = ``;
			if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) selectOptions = selectOptions.filter((option) => option.value);
			selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}px"` : ""} class="${this.selectClasses.classSelectOptionsScroll}">`;
			selectOptions.forEach((selectOption) => {
				selectOptionsHTML += this.getOption(selectOption, originalSelect);
			});
			selectOptionsHTML += `</div>`;
			return selectOptionsHTML;
		}
	}
	getOption(selectOption, originalSelect) {
		const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
		const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-fls-select-show-selected") && !originalSelect.multiple ? `hidden` : ``;
		const selectOptionClass = selectOption.dataset.flsSelectClass ? ` ${selectOption.dataset.flsSelectClass}` : "";
		const selectOptionLink = selectOption.dataset.flsSelectHref ? selectOption.dataset.flsSelectHref : false;
		const selectOptionLinkTarget = selectOption.hasAttribute("data-fls-select-href-blank") ? `target="_blank"` : "";
		let selectOptionHTML = ``;
		selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-fls-select-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-fls-select-value="${selectOption.value}" type="button">`;
		selectOptionHTML += this.getSelectElementContent(selectOption);
		selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
		return selectOptionHTML;
	}
	setOptions(selectItem, originalSelect) {
		const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		selectItemOptions.innerHTML = this.getOptions(originalSelect);
	}
	setOptionsPosition(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
		const customMaxHeightValue = +originalSelect.dataset.flsSelectScroll ? `${+originalSelect.dataset.flsSelectScroll}px` : ``;
		const selectOptionsPosMargin = +originalSelect.dataset.flsSelectOptionsMargin ? +originalSelect.dataset.flsSelectOptionsMargin : 10;
		if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
			selectOptions.hidden = false;
			const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue("max-height"));
			const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
			const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
			selectOptions.hidden = true;
			const selectItemHeight = selectItem.offsetHeight;
			const selectItemPos = selectItem.getBoundingClientRect().top;
			const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
			const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);
			if (selectItemResult < 0) {
				const newMaxHeightValue = selectOptionsHeight + selectItemResult;
				if (newMaxHeightValue < 100) {
					selectItem.classList.add("select--show-top");
					selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
				} else {
					selectItem.classList.remove("select--show-top");
					selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
				}
			}
		} else setTimeout(() => {
			selectItem.classList.remove("select--show-top");
			selectItemScroll.style.maxHeight = customMaxHeightValue;
		}, +originalSelect.dataset.flsSelectSpeed);
	}
	optionAction(selectItem, originalSelect, optionItem) {
		if (selectItem.querySelector(this.getSelectClass(this.selectClasses.classSelectOptions)).classList.contains("--slide")) return;
		if (originalSelect.multiple) {
			optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
			const selectedEls = this.getSelectedOptionsData(originalSelect).elements;
			for (const el of selectedEls) el.removeAttribute("selected");
			const selectedUI = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
			for (const el of selectedUI) {
				const val = el.dataset.flsSelectValue;
				const opt = originalSelect.querySelector(`option[value="${val}"]`);
				if (opt) opt.setAttribute("selected", "selected");
			}
		} else {
			if (!originalSelect.hasAttribute("data-fls-select-show-selected")) setTimeout(() => {
				const hiddenOpt = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`);
				if (hiddenOpt) hiddenOpt.hidden = false;
				optionItem.hidden = true;
			}, this.config.speed);
			originalSelect.value = optionItem.dataset.flsSelectValue || optionItem.textContent;
			this.selectAction(selectItem);
		}
		this.setSelectTitleValue(selectItem, originalSelect);
		this.setSelectChange(originalSelect);
	}
	selectChange(e) {
		const originalSelect = e.target;
		this.selectBuild(originalSelect);
		this.setSelectChange(originalSelect);
	}
	setSelectChange(originalSelect) {
		if (originalSelect.hasAttribute("data-fls-select-validate")) formValidate.validateInput(originalSelect);
		if (originalSelect.hasAttribute("data-fls-select-submit") && originalSelect.value) {
			let tempButton = document.createElement("button");
			tempButton.type = "submit";
			originalSelect.closest("form").append(tempButton);
			tempButton.click();
			tempButton.remove();
		}
		const selectItem = originalSelect.parentElement;
		this.selectCallback(selectItem, originalSelect);
	}
	selectDisabled(selectItem, originalSelect) {
		if (originalSelect.disabled) {
			selectItem.classList.add(this.selectClasses.classSelectDisabled);
			this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
		} else {
			selectItem.classList.remove(this.selectClasses.classSelectDisabled);
			this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
		}
	}
	searchActions(selectItem) {
		const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		selectInput.addEventListener("input", () => {
			const inputValue = selectInput.value.toLowerCase();
			selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`).forEach((item) => {
				item.hidden = !item.textContent.toLowerCase().includes(inputValue);
			});
			if (selectOptions.hidden) this.selectAction(selectItem);
		});
	}
	selectCallback(selectItem, originalSelect) {
		document.dispatchEvent(new CustomEvent("selectCallback", { detail: { select: originalSelect } }));
	}
};
document.querySelector("select[data-fls-select]") && window.addEventListener("load", () => window.flsSelect = new SelectConstructor({}));
//#endregion
