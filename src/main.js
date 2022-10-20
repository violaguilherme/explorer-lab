import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")
const securityCode = document.querySelector("#security-code")
const expirationDate = document.querySelector("#expiration-date")
const cardNumber = document.querySelector("#card-number")
const addButton = document.querySelector("#add-card")
const cardHolder = document.querySelector("#card-holder")
const ccHolder = document.querySelector(".cc-holder .value")
const ccSecurity = document.querySelector(".cc-security .value")
const ccNumber = document.querySelector(".cc-number")
const ccExpiration = document.querySelector(".cc-expiration .value")

function setCardType(type) {
    const colors = {
        visa: ["#436D99", "#2D57F2"],
        mastercard: ["#DF6F29", "#C69347"],
        default: ["black", "gray"]
        
    }
    
ccBgColor01.setAttribute("fill", colors[type][0])
ccBgColor02.setAttribute("fill", colors[type][1])
ccLogo.setAttribute("src", `cc-${type}.svg`)
}

const securityCodePattern = {
    mask: "0000"
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2)
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        }
    }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex:/^4\d{0,15}/,
            cardtype: "visa"
        },

        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1,5]\d{0,2}|^22[2,9]\d|^2[3,7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard"
        },

        {
            mask: "0000 0000 0000 0000",
            cardtype: "default"
        },
    ],
    dispatch: (appended, dynamicMasked) => {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "")
        const foundCardType = dynamicMasked.compiledMasks.find((item) => {
            return number.match(item.regex)
        })

        return foundCardType
    }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

addButton.addEventListener("click", () => {
    alert("Card added!")
})

document.querySelector("form").addEventListener("click", (event) => {
    event.preventDefault()
})

cardHolder.addEventListener("input", () => {
    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value)
})

cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    updateCardNumber(cardNumberMasked.value)
    setCardType(cardType)
})

expirationDateMasked.on("accept", () => {
    updateExpirationDate(expirationDateMasked.value)
})

function updateSecurityCode(code) {
    ccSecurity.innerText = code.length === 0 ? "123" : code
}

function updateCardNumber(number) {
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

function updateExpirationDate(date) {
    ccExpiration.innerText = date.length === 0 ? "02/32" : date
}




