
# Lista de Compras Inteligente

Bem-vindo ao **Lista de Compras Inteligente**! Este é um aplicativo web que permite aos usuários criar, editar e gerenciar listas de compras de maneira fácil e prática.

## Funcionalidades

-   **Cadastro e Login de Usuários**: Registre-se e faça login para acessar suas listas de compras personalizadas.
-   **Criação de Listas de Compras**: Crie quantas listas desejar para organizar suas compras.
-   **Gerenciamento de Itens**: Adicione, edite e remova itens em suas listas.
-   **Marcar Itens como Comprados**: Mantenha o controle dos itens que já foram comprados.
-   **Atualização em Tempo Real**: As listas são atualizadas em tempo real usando Socket.IO.
-   **Perfil do Usuário**: Atualize suas informações pessoais e altere sua senha.
-   **Interface Amigável**: Design simples e intuitivo para facilitar a navegação.

## Capturas de Tela

### Tela de Login

![login](https://github.com/user-attachments/assets/59e543ee-e38c-4bc9-80db-117f2e6a0189)

### Tela de Registro

![registro](https://github.com/user-attachments/assets/c652b79d-4035-436c-aeff-f7e9984c1bcc)


### Página Inicial


![landingpage](https://github.com/user-attachments/assets/d247a642-80e5-44cc-b998-407863962f3f)

### Minhas Listas

![minhaslistas](https://github.com/user-attachments/assets/931d1ccc-ce68-4064-8358-9f68a94a4d30)


### Lista de Compras

![listaeitens](https://github.com/user-attachments/assets/80acbfef-4ed3-4623-bc92-df1f31a06f68)


### Perfil do Usuário

![perfil](https://github.com/user-attachments/assets/97c85237-f973-4949-8f17-c9624478ddb3)


## Como Executar o Projeto Localmente

### Pré-requisitos

-   **Node.js** (versão 14 ou superior)
-   **npm** (geralmente instalado junto com o Node.js)
-   **MongoDB** (instância local ou serviço como MongoDB Atlas)

### Passo a Passo

#### 1. Clone o Repositório

```bash
git clone https://github.com/matheusharlen/trabalho-lista-compras.git

```

#### 2. Configure as Variáveis de Ambiente

Você precisará configurar as variáveis de ambiente tanto para o servidor (back-end) quanto para o cliente (front-end).

##### Back-end (Servidor)

-   Navegue até a pasta do servidor:
    
    ```bash
    cd trabalho-lista-compras/api-server
    
    ```
    
-   Crie um arquivo `.env` na raiz da pasta `api-server` com o seguinte conteúdo:
    
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    
    ```
    
    -   `MONGO_URI`: String de conexão com o seu banco de dados MongoDB.
    -   `JWT_SECRET`: Uma chave secreta para assinatura dos tokens JWT.

##### Front-end (Cliente)

-   Navegue até a pasta do cliente:
    
    ```bash
    cd trabalho-lista-compras/client-front
    
    ```
    
-   Crie um arquivo `.env` na raiz da pasta `client-front` com o seguinte conteúdo:
    
    ```env
    REACT_APP_API_URL=http://localhost:5000
    
    ```
    
    -   Certifique-se de que a URL corresponde à porta configurada no servidor.

#### 3. Instale as Dependências

##### Servidor

```bash
cd trabalho-lista-compras/api-server
npm install

```

##### Cliente

```bash
cd trabalho-lista-compras/client-front
npm install

```

#### 4. Execute o Servidor

-   Na pasta `api-server`, inicie o servidor:
    
    ```bash
    npm start
    
    ```
    
    -   O servidor estará rodando em `http://localhost:5000`.

#### 5. Execute o Cliente

-   Em outra janela do terminal, na pasta `client-front`, inicie o cliente:
    
    ```bash
    npm start
    
    ```
    
    -   A aplicação será aberta em `http://localhost:3000` no seu navegador.

#### 6. Acesse a Aplicação

-   Abra o navegador e acesse `http://localhost:3000`.
    
-   Registre um novo usuário ou faça login se já tiver um cadastro.
    

## Tecnologias Utilizadas

-   **Front-end**:
    
    -   React.js
    -   Axios
    -   React Router DOM
    -   Bootstrap e Bootstrap Icons
-   **Back-end**:
    
    -   Node.js
    -   Express.js
    -   MongoDB com Mongoose
    -   JWT para autenticação
    -   Socket.IO para atualização em tempo real

## Observações

-   **Banco de Dados**: Certifique-se de que o MongoDB está rodando e acessível pela string de conexão fornecida em `MONGO_URI`.
-   **Variáveis de Ambiente**: Nunca compartilhe suas chaves secretas ou strings de conexão sensíveis. O arquivo `.env` deve ser mantido fora do controle de versão.

## Contato

Se tiver alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato.

