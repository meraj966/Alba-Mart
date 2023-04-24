import { DELIVERY_CHARGE_TABLE_HEADERS } from "./Constants"

export const splitText = (text) => {
    let str = "", res = []
    for (let i = 0; i < text.length; i++) {
        if (text[i] == ",") {
            res.push(str)
            str = ""
        } else if (text[i] != " ") str += text[i]
    }
    return res
}

export const getDiscountedPrice = (saleType, price, discount = 0) => {
    let discountedPrice = price
    if (saleType === '%') {
        let percent = (discount/100).toFixed(2)
        discount = (price * percent).toFixed(2)
        discountedPrice = price - discount
    } else if (['Rs', 'RS'].includes(saleType)) {
        discountedPrice = price - discount
    } else discountedPrice = '-'
    return discountedPrice
}