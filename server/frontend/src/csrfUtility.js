import Cookies from 'js-cookie';

const csrftoken = Cookies.get('csrftoken');

export {csrftoken};