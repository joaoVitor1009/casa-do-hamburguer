# ðŸ” Casa do HambÃºrguer â€” Fullstack Delivery App

<p align="center">
  <img src="front-end/public/logo.png" alt="Logo Casa do HambÃºrguer" width="120" />
</p>

<p align="center">
  Sistema completo de delivery e autoatendimento para hamburgueria, com catÃ¡logo interativo, autenticaÃ§Ã£o via cookies/JWT, gerenciamento de carrinho, checkout com mÃ©todos de entrega/pagamento e <strong>atualizaÃ§Ã£o de status em tempo real via Server-Sent Events (SSE)</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

---

## âœ¨ Funcionalidades

### ðŸ›’ Cliente / UsuÃ¡rio
- **CatÃ¡logo de Produtos:** Filtro por categorias (HambÃºrgueres, Acompanhamentos, Bebidas).
- **Carrinho Interativo:** AdiÃ§Ã£o, remoÃ§Ã£o e alteraÃ§Ã£o dinÃ¢mica de quantidade de itens.
- **AutenticaÃ§Ã£o Segura:** Cadastro e Login com senha criptografada via `bcrypt` e sessÃ£o persistida via `HTTP-Only Cookies` + JWT.
- **Checkout Completo:** SeleÃ§Ã£o do endereÃ§o de entrega, forma de pagamento (Dinheiro, CartÃ£o, etc.) e campo de observaÃ§Ãµes.
- **Acompanhamento de Pedido em Tempo Real:** Escuta de eventos via **Server-Sent Events (SSE)** para monitorar a transiÃ§Ã£o de status do pedido (*Pendente*, *Em Preparo*, *Entregue*).

### âš™ï¸ Painel / GestÃ£o
- **Upload de Imagens:** CriaÃ§Ã£o de novos produtos com upload multipart via `Multer`.
- **Canal de Eventos Admin:** NotificaÃ§Ã£o em tempo real de novos pedidos recebidos via rota `/admin-events`.
- **AtualizaÃ§Ã£o de Status de Pedidos:** Controle do ciclo de vida dos pedidos via API.

---

## ðŸ› ï¸ Tecnologias Utilizadas

### Front-end
- **React 19** com **Vite**
- **TypeScript** para tipagem estÃ¡tica e seguranÃ§a
- **Tailwind CSS v4** para estilizaÃ§Ã£o moderna e responsiva
- **React Router v8** para gerenciamento de rotas e rotas protegidas
- **Lucide React** para iconografia
- **Context API** para gerenciamento global de estado (Carrinho e SessÃ£o)

### Back-end
- **Node.js** com **Express**
- **TypeScript** compilado via **tsup** e executado com **tsx**
- **Prisma ORM** para modelagem e migraÃ§Ãµes no banco de dados
- **PostgreSQL** como banco de dados relacional
- **JWT (JSON Web Token)** & **Cookie-Parser** para autenticaÃ§Ã£o segura
- **Multer** para upload de imagens
- **SSE (Server-Sent Events)** para comunicaÃ§Ã£o unidirecional em tempo real

---

## ðŸ—„ï¸ Modelo de Dados (Prisma)

A aplicaÃ§Ã£o conta com 5 entidades principais:
- **`User`**: Dados cadastrais, endereÃ§o (CEP), senha hasheada e permissÃµes de administrador.
- **`Product`**: Nome, descriÃ§Ã£o, preÃ§o em centavos, imagem e categoria.
- **`CartItem`**: AssociaÃ§Ã£o entre usuÃ¡rio e produto com controle de quantidade.
- **`Order`**: Registro de venda com status, forma de pagamento, tipo de entrega e horÃ¡rio de entrega.
- **`OrderItem`**: Snapshot dos itens comprados com preÃ§o histÃ³rico e quantidade.

---

## ðŸš€ Como Executar o Projeto Localmente

### PrÃ©-requisitos
- [Node.js](https://nodejs.org/) (versÃ£o 18 ou superior)
- InstÃ¢ncia do [PostgreSQL](https://www.postgresql.org/) rodando

### 1. Clonar o repositÃ³rio
```bash
git clone https://github.com/joaoVitor1009/casa-do-hamburguer.git
cd casa-do-hamburguer
```

### 2. Configurar e rodar o Back-end
```bash
cd back-end

# Instalar dependÃªncias
npm install

# Configurar variÃ¡veis de ambiente no arquivo .env:
# DATABASE_URL="postgresql://usuario:senha@localhost:5432/casa_hamburguer?schema=public"
# JWT_SECRET="seu_segredo_jwt_aqui"

# Executar migraÃ§Ãµes do banco
npx prisma migrate dev

# Iniciar servidor em desenvolvimento
npm run start:watch
```

### 3. Configurar e rodar o Front-end
```bash
cd front-end

# Instalar dependÃªncias
npm install

# Iniciar aplicaÃ§Ã£o web
npm run dev
```

---

## ðŸ“Œ Rotas da API (VisÃ£o Geral)

| MÃ©todo | Endpoint | DescriÃ§Ã£o | AutenticaÃ§Ã£o |
| :--- | :--- | :--- | :---: |
| `POST` | `/register` | Cadastra novo cliente | âŒ |
| `POST` | `/login` | Autentica e gera cookie HTTP-Only | âŒ |
| `GET` | `/me` | Retorna dados do usuÃ¡rio autenticado | âœ… |
| `GET` | `/getProduct` | Lista produtos do cardÃ¡pio | âŒ |
| `POST` | `/createProduct` | Cadastra novo produto com imagem | âœ… Admin |
| `GET` | `/getItems` | Retorna itens do carrinho do usuÃ¡rio | âœ… |
| `POST` | `/createCartitem` | Adiciona produto ao carrinho | âœ… |
| `POST` | `/createOrders` | Fecha e cria um novo pedido | âœ… |
| `GET` | `/order-events/:id` | ConexÃ£o SSE para acompanhar status do pedido | âŒ |
| `GET` | `/admin-events` | ConexÃ£o SSE de monitoramento para administradores | âœ… |

---

## ðŸ‘¨â€ðŸ’» Autor

Desenvolvido por **JoÃ£o Vitor**  
- GitHub: [@joaoVitor1009](https://github.com/joaoVitor1009)