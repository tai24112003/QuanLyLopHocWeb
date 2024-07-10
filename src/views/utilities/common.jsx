const scrollToCenter = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
};
const flattenArray = (arr) => {
  return arr.flatMap((item) => {
    if (Array.isArray(item.questions)) {
      return flattenArray(item.questions);
    } else {
      return item;
    }
  });
};

const isPhoneNumberValid = (phone) => {
  const phoneRegex = /^(09|08|03|07|05)\d{8}$/;
  return phoneRegex.test(phone);
};

const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export { scrollToCenter, flattenArray, isPhoneNumberValid, isEmailValid };
