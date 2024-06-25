import Cookies from "js-cookie";

const getCookie = (cookieName) => Cookies.get(cookieName);

export default getCookie;