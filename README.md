# Daily Diet - API

API desenvolvida para servir o frontend do app Daily Diet.

Daily Diet é uma aplicação mobile para controle da sua dieta. Nele você pode registrar suas refeições e acompanhar como está seu progresso.

[Link para o layout da aplicação (Daily Diet) que utilizaria essa API.](<https://www.figma.com/design/ZRqCNWJXeH2FB9QKjgsqW8/Daily-Diet-%E2%80%A2-Desafio-React-Native-(Community)?node-id=0-1&t=iWABDpK6Hj5p2Vzw-0>)

### Regras da aplicação

- [x] Deve ser possível criar um usuário
- [x] Deve ser possível identificar o usuário entre as requisições
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
  - As refeições devem ser relacionadas a um usuário.
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [x] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência de refeições dentro da dieta
- [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

### Rotas

#### Users

> ##### Create
>
> Method: POST
> URL: {{BASE_URL}}/users/register
> Request Body:
>
> ```
> {
>    "name": "John Doe",
>    "email": "john@doe.com"
> }
> ```

#### Meals

> ##### Create
>
> Método: POST
> URL: /meals
> Request Body:
>
> ```
> {
>  "name": "Lunch",
>  "description": "Rice, beans, stewed meat, and salad",
>  "date": "2024-07-01T23:39:21.476Z",
>  "isDiet": true
> }
> ```

> ##### Fetch All
>
> Method: GET
> URL: /meals
> Request Body: None

> ##### Fetch One Meal
>
> Method: GET
> URL: /meals/{mealId}
> Request Body: None

> ##### Metrics
>
> Method: GET
> URL: /meals
> Request Body: None

> ##### Update
>
> Method: PATCH
> URL: /meals/{mealId}
> Request Body:
>
> ```
> {
>    "description": "Rice, beans, grilled chicken fillet, and salad"
> }
> ```

> ##### Delete
>
> Method: DELETE
> URL: /meals/{mealId}
> Request Body: None
