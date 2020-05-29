// ---------------------------- Constants ---------------------------

const creditCardFormValidation = {
	cvv: false
}

const htmlInputCVV = document.getElementById('cvv_input_wrapper').outerHTML;

// ---------------------------- Elements ------------------------
const cardListItems = document.getElementsByClassName("card-list-item");
const cvvInputWrapper = document.getElementsByClassName("input-wrapper").item(0);
const submitBtn = document.getElementById("credit_card_submit_button");
const cvvIcon = document.getElementById("cvv_icon");
const cvvMobile = document.getElementById("cvv_mobile_wrapper");
const closeCvvIcon = document.getElementById("close_cvv");
const cvvMobileInstructions = document.getElementById("cvv_instruction_container");
const body = document.getElementsByTagName("body").item(0);
const toggleCartDetails = document.getElementById("toggle_cart_details");
const toggleCartDetailsDown = document.getElementById("cart_icon_down");
const toggleCartDetailsUp = document.getElementById("cart_icon_up");
const cardDetails = document.getElementById("cart_detail");
const totalDesc = document.getElementById("total_descriptions");

// ---------------------------- Selection Switch and Validation Mgmt ---------------------------- 
initCVVInput(cvvInputWrapper);

[].slice.call(cardListItems).forEach(function (item, index) {
	item.addEventListener("click", function () {
		const activeItems = document.getElementsByClassName("active");
		for (let activeItem of activeItems) {
			activeItem.classList.remove("active");
			const cvvInputWrapper = activeItem.getElementsByClassName("input-wrapper").item(0);
			activeItem.removeChild(cvvInputWrapper);

		}
		item.classList.add("active");
		const buttonNode = item.getElementsByClassName("delete_btn").item(0);
		const newCVVInput = createElementFromHtml(htmlInputCVV);
		initCVVInput(newCVVInput);
		item.insertBefore(newCVVInput, buttonNode);
		creditCardFormValidation.cvv = false;
		setRadioInput(index);
		checkFormValidity();
	})
})

//---------------------------- Mobile cart display Mgmt ----------------------------
let closedDetails = true;
toggleCartDetails.addEventListener("click", function () {
	if (closedDetails) {
		totalDesc.style.display = "block";
		cardDetails.style.display = "block";
		toggleCartDetailsDown.classList.add("hidden");
		toggleCartDetailsUp.classList.remove("hidden");
	} else {
		totalDesc.style.display = "none";
		cardDetails.style.display = "none";
		toggleCartDetailsUp.classList.add("hidden");
		toggleCartDetailsDown.classList.remove("hidden");
	}
	closedDetails = !closedDetails;
})

// ---------------------------- Functions ------------------------

function createElementFromHtml(htmlString) {
	var div = document.createElement('div');
	div.innerHTML = htmlString.trim();

	return div.firstChild;
}

function initCVVInput(inputWrapper) {

	if ($(window).width() <= 1120) {
		cvvIcon.addEventListener("touchstart", function () {
			body.style.overflow = "hidden";
			cvvMobile.classList.remove("hidden");
		})

		closeCvvIcon.addEventListener("touchstart", function () {
			cvvMobile.classList.add("hidden");
			body.style.overflow = "scroll";
		})

		cvvMobile.addEventListener("touchstart", function () {
			cvvMobile.classList.add("hidden");
			body.style.overflow = "scroll";
		})

		cvvMobileInstructions.addEventListener("touchstart", function (evt) {
			evt.stopPropagation();
		})
	}

	inputWrapper.addEventListener("click", function (evt) {
		if (evt.target.className === "far fa-info-circle tooltip" && $(window).width() <= 1120) {
			body.style.overflow = "hidden";
			cvvMobile.classList.remove("hidden");
		}
		evt.stopPropagation();
	})
	const inputCvv = inputWrapper.getElementsByTagName("input").item(0);
	const cvvIm = new Inputmask({
		mask: "999[9]",
		placeholder: "",
		showMaskOnHover: false,
	});
	cvvIm.mask(inputCvv);
	inputCvv.addEventListener("keyup", function () {
		if (inputCvv.value.length >= 3) {
			creditCardFormValidation.cvv = true;
		} else {
			creditCardFormValidation.cvv = false;
		}
		checkFormValidity();
	})
}

function setRadioInput(cardIndex) {
	const radioInputs = document.getElementsByClassName('card-radio-input');

	[].slice.call(radioInputs).forEach(function (item, index) {
		item.checked = false;
		if (index === cardIndex) {
			item.checked = true;
		}
	})
}

function checkFormValidity() {
	for (property in creditCardFormValidation) {
		if (!creditCardFormValidation[property]) {
			submitBtn.classList.remove("valid");
			submitBtn.disabled = true;
			return;
		}
	}
	submitBtn.disabled = false;
	return submitBtn.classList.add("valid");;
}