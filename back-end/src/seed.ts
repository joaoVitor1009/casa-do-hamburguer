import { prisma } from "./db.js";

const initialProducts = [
  {
    name: "SMASH TRIPLO",
    description:
      "Três finas e crostantes carnes amassadas na chapa, com queijo cheddar, cebola roxa e molho especial no pão de batata.",
    price: 34,
    category: "Burgers",
    img: "/smash-triplo.jpg",
  },
  {
    name: "CALABRESA ESPECIAL",
    description:
      "Hambúrguer de carne bovina coberto com linguiça calabresa fatiada, cebola caramelizada e muçarela derretida.",
    price: 41,
    category: "Burgers",
    img: "/calabresa-especial.jpg",
  },
  {
    name: "DUPLO DA CASA",
    description:
      "Dois suculentos hambúrgueres de 120g, queijo cheddar derretido, maionese da casa e picles no pão brioche tostado.",
    price: 34,
    category: "Burgers",
    img: "/duplo_da_casa.jpg",
  },
  {
    name: "COCA-COLA LATA",
    description: "Refrigerante Coca-Cola lata 350ml bem gelada.",
    price: 7,
    category: "Bebida",
    img: "/coca-cola.jpg",
  },
  {
    name: "SUCO DE LARANJA",
    description: "Suco natural de laranja da fruta 500ml bem gelado.",
    price: 10,
    category: "Bebida",
    img: "/suco-de-laranja.jpg",
  },
  {
    name: "VITAMINA DE MORANGO",
    description: "Vitamina cremosa de morango com leite 400ml.",
    price: 14,
    category: "Bebida",
    img: "/vitamina-de-morango.jpg",
  },
  {
    name: "BATATA FRITA TRADICIONAL",
    description:
      "Porção generosa de batatas fritas crocantes com sal e tempero especial da casa.",
    price: 22,
    category: "Porções",
    img: "/batata-frita.jpg",
  },
  {
    name: "BATATA FRITA CANOA",
    description:
      "Batatas corte canoa crocantes por fora e macias por dentro, com cheddar cremoso e bacon crocante.",
    price: 28,
    category: "Porções",
    img: "/batata-frita-canoa.jpg",
  },
];

async function main() {
  console.log("Cadastrando produtos no banco Neon...");
  for (const item of initialProducts) {
    const exists = await prisma.product.findFirst({
      where: { name: item.name },
    });
    if (!exists) {
      await prisma.product.create({ data: item });
      console.log(`Criado: ${item.name}`);
    } else {
      console.log(`Já existe: ${item.name}`);
    }
  }
  console.log("Todos os produtos cadastrados com sucesso!");
  process.exit(0);
}

main().catch((e) => {
  console.error("Erro no seed:", e);
  process.exit(1);
});
