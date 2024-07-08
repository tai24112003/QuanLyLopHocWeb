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

export { scrollToCenter, flattenArray };
