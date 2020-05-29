// ---------------------------- Constants ----------------------------
const CBTYPE = {
	DEFAULT: 0,
	AMERICAN_EXP: 1,
	MASTER_CARD: 2,
	VISA: 3,
	CB: 4
}
const currentMillenium = 2000;

const creditCardFormValidation = {
	firstNameLastName: false,
	number: false,
	date: false,
	cvv: false
}
// ---------------------------- Elements ------------------------
const body = document.getElementsByTagName("body").item(0);
const creditCardNumberInput = document.getElementById("credit_card_number");
const creditCardDateInput = document.getElementById("credit_card_expiration_date");
const creditCardNameInput = document.getElementById("credit_card_owner_name");
const creditCardCVVInput = document.getElementById("credit_card_security_code");
const creditCardSaveToggleOff = document.getElementById("toggle-off");
const creditCardSaveToggleOn = document.getElementById("toggle-on");
const saveCardInput = document.getElementById("save_card");
const form = document.getElementById("credit-card-form");
const submitBtn = document.getElementById("credit_card_submit_button");
const globalFormError = document.getElementById("global-form-error");
const closeErrorBtn = document.getElementById("close-error");
const errorIconCardDate = document.getElementById("error_icon_card_date");
const errorIconCardNbr = document.getElementById("error_icon_card_nbr");
const errorMsgCardNbr = document.getElementById("card_nbr_error");
const errorMsgCardDate = document.getElementById("card_date_error");
const lockIcon = document.getElementById("lock_icon");
const pickerTypeIconWrapper = document.getElementById("card_picker")
const pickerTypeCardUp = document.getElementById("picker_icon_up");
const pickerTypeCardDown = document.getElementById("picker_icon_down");
const creditCardTypeWrapper = document.getElementById("card-type-wrapper");
const creditCardTypeList = document.getElementById("card-list");
const amex = document.getElementById("amex");
const mc = document.getElementById("mc");
const visa = document.getElementById("visa");
const cb = document.getElementById("cb");
const cardTypeInput = document.getElementById("card_type_input");
const toggleCartDetails = document.getElementById("toggle_cart_details");
const toggleCartDetailsDown = document.getElementById("cart_icon_down");
const toggleCartDetailsUp = document.getElementById("cart_icon_up");
const cardDetails = document.getElementById("cart_detail");
const totalDesc = document.getElementById("total_descriptions");
const cvvIcon = document.getElementById("cvv_icon");
const cvvMobile = document.getElementById("cvv_mobile_wrapper");
const closeCvvIcon = document.getElementById("close_cvv");
const cvvMobileInstructions = document.getElementById("cvv_instruction_container")
// ---------------------------- Mask Input ----------------------------
const cardIm = new Inputmask({
	mask: "9999 9999 9999 999[9]",
	placeholder: "",
	showMaskOnHover: false,
	jitMasking: true
});
cardIm.mask(creditCardNumberInput);

const dateIm = new Inputmask({
	mask: "99/99",
	placeholder: "",
	showMaskOnHover: false,
	jitMasking: true
});
dateIm.mask(creditCardDateInput);

const cvvIm = new Inputmask({
	mask: "999[9]",
	placeholder: "",
	showMaskOnHover: false,
	jitMasking: true
});
cvvIm.mask(creditCardCVVInput);


// ---------------------------- Credit Card Form Validation ----------------------------
let cbType = null;

creditCardNumberInput.addEventListener("keyup", function () {
	lockIcon.classList.add("hidden");
	hideCreditCardNumberError();
	if (creditCardNumberInput.value.startsWith('34') || creditCardNumberInput.value.startsWith('37')) {
		cbType = CBTYPE.AMERICAN_EXP;
		setCbTypeInput(CBTYPE.AMERICAN_EXP);
	} else if (creditCardNumberInput.value.startsWith('4')) {
		//VISA BY DEFAULT
		cbType = CBTYPE.VISA
		setCbTypeInput(CBTYPE.VISA);
	} else if (creditCardNumberInput.value.startsWith('51') || creditCardNumberInput.value.startsWith('55')) {
		cbType = CBTYPE.MASTER_CARD;
		setCbTypeInput(CBTYPE.MASTER_CARD);
	} else if (creditCardNumberInput.value.length > 0) {
		displayCreditCardNumberError();
	} else {
		creditCardTypeWrapper.classList.add("hidden");
		lockIcon.classList.remove("hidden");
	}
})

creditCardNameInput.addEventListener("keyup", function () {
	if (creditCardNameInput.value.length > 0) {
		creditCardFormValidation.firstNameLastName = true;
	} else {
		creditCardFormValidation.firstNameLastName = false;
	}
	checkFormValidity();
})

creditCardCVVInput.addEventListener("keyup", function () {
	if (creditCardCVVInput.value.length >= 3) {
		creditCardFormValidation.cvv = true;
	} else {
		creditCardFormValidation.cvv = false;
	}
	checkFormValidity();
})

creditCardNumberInput.addEventListener("focusout", function (evt) {
	if (creditCardNumberInput.value.length > 0) {
		switch (cbType) {
			case CBTYPE.AMERICAN_EXP:
				if (creditCardNumberInput.value.replace(/\s/g, '').length !== 15) {
					displayCreditCardNumberError();
					creditCardFormValidation.number = false;
				} else {
					hideCreditCardNumberError();
					creditCardFormValidation.number = true;
				}
				break;
			case CBTYPE.MASTER_CARD:
			case CBTYPE.CB:
			case CBTYPE.VISA:
				if (creditCardNumberInput.value.replace(/\s/g, '').length !== 16) {
					displayCreditCardNumberError()
					creditCardFormValidation.number = false;
				} else {
					hideCreditCardNumberError();
					creditCardFormValidation.number = true;
				}
				break;
			default:
				displayCreditCardNumberError();
				creditCardFormValidation.number = false;
		}
	} else {
		hideCreditCardNumberError();
		creditCardFormValidation.number = false;
	}
	checkFormValidity();
})

creditCardDateInput.addEventListener("focusout", function () {
	hideCreditCardDateError();
	if (creditCardDateInput.value.length > 0) {
		creditCardFormValidation.date = true;
		const now = new Date();
		const typedYear = parseInt(creditCardDateInput.value.slice(3, 5)) + currentMillenium;
		const typedMonth = parseInt(creditCardDateInput.value.slice(0, 2));
		if (creditCardDateInput.value.length === 5) {
			if (now.getFullYear() < typedYear) {
				checkFormValidity();
				return;
			} else if (now.getFullYear() <= typedYear && (now.getMonth() + 1) <= typedMonth) {
				checkFormValidity();
				return;
			}
		}
		creditCardFormValidation.date = false;
		displayCreditCardDateError();
		checkFormValidity();
	}
})

submitBtn.addEventListener("click", function () {
	globalFormError.classList.add(hidden);
})

closeErrorBtn.addEventListener("click", function () {
	globalFormError.removeChild(globalFormError.lastElementChild);
	globalFormError.classList.add("hidden");
	submitBtn.classList.remove("grey");
})

// ---------------------------- Credit Card Save Toggle Mgmt ----------------------------
creditCardSaveToggleOff.addEventListener("click", function () {
	creditCardSaveToggleOff.classList.add("hidden");
	creditCardSaveToggleOn.classList.remove("hidden");
	saveCardInput.checked = true;
})
creditCardSaveToggleOn.addEventListener("click", function () {
	creditCardSaveToggleOff.classList.remove("hidden");
	creditCardSaveToggleOn.classList.add("hidden");
	saveCardInput.checked = false;
})

// ---------------------------- Credit Card Type Mgmt ----------------------------
pickerTypeCardUp.addEventListener("click", function () {
	pickerTypeCardUp.classList.add("hidden");
	pickerTypeCardDown.classList.remove("hidden");
	creditCardTypeList.classList.remove("active");
	creditCardTypeWrapper.classList.remove("active");
})

pickerTypeCardDown.addEventListener("click", function () {
	pickerTypeCardDown.classList.add("hidden");
	pickerTypeCardUp.classList.remove("hidden");
	creditCardTypeList.classList.add("active");
	creditCardTypeWrapper.classList.add("active");
})

cb.addEventListener("click", function () {
	closeCardPicker();
	setCbTypeInput(CBTYPE.CB);
})

visa.addEventListener("click", function () {
	closeCardPicker();
	setCbTypeInput(CBTYPE.VISA);
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

//---------------------------- Mobile CVV Mgmt ----------------------------
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
// ------------------------- Functions

function displayFormError(errorMessage = "Une erreur est survenue veuillez réessayer") {
	const errorP = document.createElement("p");
	const textnode = document.createTextNode(errorMessage);
	errorP.appendChild(textnode);
	globalFormError.appendChild(errorP);
	globalFormError.classList.remove("hidden");
	submitBtn.classList.add("grey");
	submitBtn.disabled = true;
}

function displayCreditCardNumberError() {
	creditCardTypeWrapper.classList.add("hidden");
	errorIconCardNbr.classList.remove("hidden");
	errorMsgCardNbr.classList.remove("hidden");
}

function hideCreditCardNumberError() {
	errorIconCardNbr.classList.add("hidden");
	errorMsgCardNbr.classList.add("hidden");
}

function displayCreditCardDateError() {
	errorIconCardDate.classList.remove("hidden");
	errorMsgCardDate.classList.remove("hidden");
}

function hideCreditCardDateError() {
	errorIconCardDate.classList.add("hidden");
	errorMsgCardDate.classList.add("hidden");
}

function setCbTypeInput(type) {
	creditCardTypeList.classList.add("hidden");
	creditCardTypeWrapper.classList.remove("hidden");
	pickerTypeIconWrapper.classList.add("hidden");
	amex.classList.add("hidden");
	mc.classList.add("hidden");
	lockIcon.classList.add("hidden");
	switch (type) {
		case CBTYPE.AMERICAN_EXP:
			amex.classList.remove("hidden");
			cardTypeInput.value = type;
			break;
		case CBTYPE.MASTER_CARD:
			mc.classList.remove("hidden");
			cardTypeInput.value = type;
			break;
		case CBTYPE.VISA:
			creditCardTypeList.classList.remove("cb");
			creditCardTypeList.classList.remove("hidden");
			pickerTypeIconWrapper.classList.remove("hidden");
			cardTypeInput.value = type;
			break;
		case CBTYPE.CB:
			creditCardTypeList.classList.add("cb");
			creditCardTypeList.classList.remove("hidden");
			pickerTypeIconWrapper.classList.remove("hidden");
			cardTypeInput.value = type;
			break;
		default:
			cardTypeInput.value = type;
	}
}

function closeCardPicker() {
	pickerTypeCardUp.classList.add("hidden");
	pickerTypeCardDown.classList.remove("hidden");
	creditCardTypeList.classList.remove("active");
	creditCardTypeWrapper.classList.remove("active");
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