export interface ProductInterface {
  id: string;
  name: string;
  description: string;
  price: number;
  img: string;
  category: string;
  getProducts?: () => Promise<void>;
}
