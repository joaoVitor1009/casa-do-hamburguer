# 🍔 Casa do Hambúrguer — Fullstack Delivery App

<p align="center">
  <img src="front-end/public/logo.png" alt="Logo Casa do Hambúrguer" width="120" />
</p>

<p align="center">
  Sistema completo de delivery e autoatendimento para hamburgueria, com catálogo interativo, autenticação via cookies/JWT, gerenciamento de carrinho, checkout com métodos de entrega e pagamento, além de <strong>atualização de status em tempo real via Server-Sent Events (SSE)</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma ORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

---

## ✨ Funcionalidades

### 🛒 Cliente / Usuário

- **Catálogo de Produtos:** filtro por categorias, como hambúrgueres, acompanhamentos e bebidas.
- **Carrinho Interativo:** adição, remoção e alteração dinâmica da quantidade de itens.
- **Autenticação Segura:** cadastro e login com senhas criptografadas via `bcrypt` e sessão autenticada por JWT em cookies `HTTP-Only`.
- **Checkout Completo:** seleção do endereço de entrega, forma de pagamento e campo de observações.
- **Acompanhamento de Pedidos em Tempo Real:** utilização de **Server-Sent Events (SSE)** para acompanhar as mudanças de status dos pedidos, como *Pendente*, *Em Preparo* e *Entregue*.

### ⚙️ Painel Administrativo / Gestão

- **Upload de Imagens:** cadastro de produtos com upload de arquivos utilizando `Multer`.
- **Notificações em Tempo Real:** recebimento de notificações sobre novos pedidos por meio da rota `/admin-events`.
- **Gerenciamento de Pedidos:** controle e atualização do status dos pedidos por meio da API.

---

## 🛠️ Tecnologias Utilizadas

### Front-end

- **React 19** com **Vite** para construção da interface.
- **TypeScript** para tipagem estática e maior segurança no desenvolvimento.
- **Tailwind CSS v4** para estilização moderna e responsiva.
- **React Router v8** para gerenciamento de rotas e páginas protegidas.
- **Lucide React** para iconografia.
- **Context API** para gerenciamento global do estado do carrinho e da sessão do usuário.

### Back-end

- **Node.js** com **Express** para construção da API.
- **TypeScript** para desenvolvimento tipado.
- **tsup** para compilação e empacotamento do código.
- **tsx** para execução do TypeScript durante o desenvolvimento.
- **Prisma ORM** para modelagem e migrações do banco de dados.
- **PostgreSQL** como banco de dados relacional.
- **JWT (JSON Web Token)** e **Cookie-Parser** para autenticação.
- **bcrypt** para criptografia das senhas.
- **Multer** para upload de imagens.
- **SSE (Server-Sent Events)** para comunicação unidirecional em tempo real.

---

## 🗄️ Modelo de Dados (Prisma)

A aplicação conta com cinco entidades principais:

- **`User`:**
