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

- **`User`:** armazena os dados cadastrais, o endereço (CEP), a senha criptografada e as permissões de administrador.
- **`Product`:** armazena o nome, a descrição, o preço, a imagem e a categoria do produto.
- **`CartItem`:** relaciona usuários e produtos, controlando a quantidade de cada item no carrinho.
- **`Order`:** registra as vendas, incluindo status, forma de pagamento, tipo de entrega e horário de entrega.
- **`OrderItem`:** armazena os itens comprados, incluindo o preço histórico e a quantidade de cada produto.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) — versão 18 ou superior.
- [PostgreSQL](https://www.postgresql.org/) — instalado e em execução.
- npm — gerenciador de pacotes incluído na instalação do Node.js.

### 1. Clonar o repositório

```bash
git clone https://github.com/joaoVitor1009/casa-do-hamburguer.git
cd casa-do-hamburguer
```

### 2. Configurar e executar o back-end

```bash
cd back-end

# Instalar as dependências
npm install
```

Crie um arquivo `.env` dentro da pasta `back-end` e configure as variáveis de ambiente:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/casa_hamburguer?schema=public"
JWT_SECRET="seu_segredo_jwt_aqui"
```

**Importante:** substitua `usuario`, `senha` e os demais valores pelos dados da sua instalação do PostgreSQL. Utilize um segredo JWT forte e mantenha o arquivo `.env` fora do controle de versão.

Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

Inicie o servidor em modo de desenvolvimento:

```bash
npm run start:watch
```

### 3. Configurar e executar o front-end

Abra outro terminal e execute:

```bash
cd front-end

# Instalar as dependências
npm install

# Iniciar a aplicação
npm run dev
```

Após iniciar os dois serviços, acesse o endereço local informado pelo Vite no terminal para utilizar a aplicação.

---

## 📌 Rotas da API (Visão Geral)

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|:---:|
| `POST` | `/register` | Cadastra um novo cliente | ❌ |
| `POST` | `/login` | Autentica o usuário e gera um cookie HTTP-Only | ❌ |
| `GET` | `/me` | Retorna os dados do usuário autenticado | ✅ |
| `GET` | `/getProduct` | Lista os produtos do cardápio | ❌ |
| `POST` | `/createProduct` | Cadastra um produto com imagem | ✅ Admin |
| `GET` | `/getItems` | Retorna os itens do carrinho do usuário | ✅ |
| `POST` | `/createCartitem` | Adiciona um produto ao carrinho | ✅ |
| `POST` | `/createOrders` | Cria um novo pedido | ✅ |
| `GET` | `/order-events/:id` | Estabelece uma conexão SSE para acompanhar o status do pedido | Conforme implementação |
| `GET` | `/admin-events` | Estabelece uma conexão SSE para monitoramento de novos pedidos | ✅ |

**Observação:** a exigência de autenticação de cada rota deve corresponder à implementação real do back-end. Confirme também os nomes exatos dos endpoints no código-fonte.

---

## 👨‍💻 Autor

Desenvolvido por **João Vitor**.

- GitHub: [@joaoVitor1009](https://github.com/joaoVitor1009)
- Repositório: [Casa do Hambúrguer](https://github.com/joaoVitor1009/casa-do-hamburguer)
