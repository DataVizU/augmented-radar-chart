export const isColor = (color: string) => {
  const element = document.createElement('span');
  element.style.color = color;
  return element.style.color !== '';
};
