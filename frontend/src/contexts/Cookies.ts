const setCookie = (name: string, value: string, minutes = 30, path = '/') => {
  const dt = new Date();
  dt.setMinutes(dt.getMinutes() + minutes);
  const expires = dt.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=${path}`;
};

const getCookie = (name: string) =>
  document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');

const deleteCookie = (name: string, path: string) => {
  setCookie(name, '', -1, path);
};

export { setCookie, getCookie, deleteCookie };
