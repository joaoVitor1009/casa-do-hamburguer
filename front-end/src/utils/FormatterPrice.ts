export const formatterPrice = (value: number) => {
  return "R$" + value.toFixed(2).replace(".", ",");
};

export const base = "http://localhost:3000/";
