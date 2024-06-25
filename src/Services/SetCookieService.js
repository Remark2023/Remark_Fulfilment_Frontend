import Cookies from 'js-cookie';

const setCookie = (cookieName, cookieBody) =>
  Cookies.set(cookieName, cookieBody, { expires: 1, sameSite: 'None', secure: true });

export default setCookie;
