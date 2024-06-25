import Cookies from "js-cookie";

const removeCookie = (cookieName) => Cookies.remove(cookieName);

export default removeCookie;