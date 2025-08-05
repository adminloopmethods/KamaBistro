const emailRegex = {
    regexpression: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    checkRegex: function (string) {
        return this.regexpression.test(string)
    }
}
function checkRegex(email, toast) {
    if (!emailRegex.checkRegex(email)) {
        toast.error("Invalid email format!");
        return false;
    }
    return true;
}


export default emailRegex
export { checkRegex }