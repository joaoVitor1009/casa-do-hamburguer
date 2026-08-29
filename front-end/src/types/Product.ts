export interface ProductInterface {
  id: String;
  name: String;
  description: String;
  price: number;
  img: String;
  category: String;
  getProducts: () => Promise<void>;
}
