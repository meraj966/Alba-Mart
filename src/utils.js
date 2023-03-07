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