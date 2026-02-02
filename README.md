# Collaborators API

API REST para gerenciamento de colaboradores com persistência em banco de dados e consumo de API externa.

## Tecnologias

- **Runtime:** Node.js
- **Framework:** Express
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** Sequelize
- **Testes:** Jest, Supertest
- **Documentação:** Swagger/OpenAPI
- **API Externa:** JSONPlaceholder (https://jsonplaceholder.typicode.com/users)
- **Docker:** Docker & Docker Compose

## Instalação

### Pré-requisitos

- Node.js (v20 ou superior)
- PostgreSQL (ou usar Docker)
- npm ou yarn

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/Luis-H-Baroni/collaborator-management-api.git
cd collaborator-management-api
```

### Passo 2: Instalar dependências

```bash
npm install
```

### Passo 3: Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=teste_backend
```

### Passo 4: Executar o banco de dados

#### Opção A: Usar Docker Compose (Recomendado)

```bash
npm run docker:up
```

Isso iniciará o PostgreSQL em um container Docker.

#### Opção B: PostgreSQL Local

Certifique-se de que o PostgreSQL está rodando e crie o banco de dados:

```sql
CREATE DATABASE teste_backend;
```

### Passo 5: Executar migrações ou seed

Para popular o banco de dados com dados iniciais:

```bash
npm run seed
```

Isso importará colaboradores da API externa (JSONPlaceholder).

## Execução

### Desenvolvimento

```bash
npm run dev
```

A API estará disponível em http://localhost:3000

### Produção

```bash
npm run build
npm start
```

### Docker

```bash
npm run docker:up
```

A aplicação e o PostgreSQL estarão rodando em containers.

## Scripts Disponíveis

| Comando                 | Descrição                                                |
| ----------------------- | -------------------------------------------------------- |
| `npm run dev`           | Inicia o servidor em modo desenvolvimento com hot-reload |
| `npm run build`         | Compila TypeScript para JavaScript                       |
| `npm start`             | Inicia o servidor em modo produção                       |
| `npm test`              | Executa os testes                                        |
| `npm run test:watch`    | Executa os testes em modo watch                          |
| `npm run test:coverage` | Executa os testes com relatório de cobertura             |
| `npm run lint`          | Executa o ESLint                                         |
| `npm run format`        | Formata o código com Prettier                            |
| `npm run docker:up`     | Inicia containers Docker (app + postgres)                |
| `npm run docker:down`   | Para containers Docker                                   |
| `npm run docker:logs`   | Visualiza logs dos containers Docker                     |
| `npm run seed`          | Popula o banco de dados com dados iniciais               |

## API Endpoints

### Documentação

A documentação completa da API está disponível via Swagger UI:

http://localhost:3000/api-docs

### Endpoints

#### Health Check

```http
GET /collaborators/health
```

Verifica se a API está rodando.

**Resposta:**

```json
{
  "status": "ok",
  "message": "API is running"
}
```

#### Importar Colaboradores

```http
POST /collaborators/import
```

Importa colaboradores da API externa (JSONPlaceholder).

**Resposta:**

```json
{
  "imported": 8,
  "ignored": 2
}
```

#### Listar Colaboradores

```http
GET /collaborators?page=1&limit=10&search=joao&sort=name&order=asc
```

Lista colaboradores com paginação, filtro e ordenação.

**Query Parameters:**

- `page`: Página atual (padrão: 1, mínimo: 1)
- `limit`: Itens por página (padrão: 10, intervalo: 1-100)
- `search`: Filtra por nome (case-insensitive)
- `sort`: Campo para ordenação (padrão: createdAt)
- `order`: Direção da ordenação: asc ou desc (padrão: desc)

**Validação:**

- `page` deve ser um inteiro positivo (>= 1)
- `limit` deve ser um inteiro entre 1 e 100

**Resposta:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Nome do Colaborador",
      "email": "email@example.com",
      "city": "Cidade",
      "company": "Empresa",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### Buscar Colaborador por ID

```http
GET /collaborators/:id
```

Retorna um colaborador específico pelo UUID.

**Resposta:**

```json
{
  "id": "uuid",
  "name": "Nome do Colaborador",
  "email": "email@example.com",
  "city": "Cidade",
  "company": "Empresa",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Deletar Colaborador

```http
DELETE /collaborators/:id
```

Remove um colaborador pelo UUID.

**Resposta:** 204 No Content

## Tratamento de Erros

A API retorna os seguintes códigos de status HTTP:

- `200` - Sucesso
- `204` - Sucesso sem conteúdo (DELETE)
- `400` - Requisição inválida (validação, email duplicado)
- `404` - Registro não encontrado
- `500` - Erro interno do servidor

**Formato de Erro:**

```json
{
  "error": "Mensagem de erro"
}
```

**Exemplos de Erro 400 (Validação):**

```json
{
  "error": "Page must be a positive integer"
}
```

```json
{
  "error": "Limit must be a positive integer between 1 and 100"
}
```

**Exemplo de Erro 404 (Não encontrado):**

```json
{
  "error": "Collaborator not found"
}
```

## Testes

Para executar os testes:

```bash
# Executar todos os testes
npm test

# Executar em modo watch
npm run test:watch

# Executar com cobertura de código
npm run test:coverage
```

## Estrutura do Projeto

```
src/
├── config/
│   ├── database.ts       # Configuração do Sequelize
│   ├── env.ts           # Variáveis de ambiente
│   └── swagger.ts       # Configuração do Swagger
├── collaborators/
│   ├── controllers/      # Controladores HTTP
│   ├── dto/             # Data Transfer Objects
│   ├── models/          # Modelos Sequelize
│   ├── repositories/    # Acesso ao banco de dados
│   ├── routes/          # Definições de rotas Express
│   └── services/        # Lógica de negócio e integrações
├── shared/
│   ├── middleware/      # Middleware global (error handling)
│   ├── types/           # Tipos TypeScript compartilhados
│   └── utils/           # Utilitários (logger)
├── scripts/
│   └── seed.ts          # Script de seed do banco de dados
├── app.ts               # Configuração do Express
├── server.ts            # Servidor HTTP
└── index.ts             # Entry point
```

## Docker

### Arquivos Docker

- `Dockerfile` - Imagem da aplicação
- `docker-compose.yml` - Orquestração de serviços (app + postgres)

### Comandos

```bash
# Iniciar serviços
npm run docker:up

# Parar serviços
npm run docker:down

# Visualizar logs
npm run docker:logs
```

## Desenvolvimento

### Linting

```bash
npm run lint
```

### Formatação

```bash
npm run format
```

Formata todo o código com Prettier usando as configurações em `.prettierrc`.

### Build

```bash
npm run build
```

Compila TypeScript para JavaScript. O código compilado estará na pasta `dist/`.
