# `Autenticação com Node.js e JWT (JSON Web Token)`

## API RESTful com Node.js e MongoDB | Express e Mongoose

- Api REST para ser implemntado em sistema de autenticação, login e registro.

` Esta API é para você que precisa de um opção prática e simples para proteger o acesso ao seu sistema.`



## Guia de utilização:

> ### **`[POST]/auth/register`** - Criação de Logins

Para a criação dos usuários basta seguir a código abaixo:

```json
    {
    "name": "",
    "mail": "",
    "password": "",
    "confirmPassword": ""
    }
Obs: Todos os campos são obrigatórios.
```
> ### **`[GET]/auth/login`** - Acessar os usuários criados

Use este método passando o email e senha no body para acessar seus usuários e será retornado o token de autorização.

1. *`Request`*
```json
    {
    "mail": "",
    "password": ""
    }
```
2. *`Result`*
```json
    {
    "message": "",
    "token": ""
    }
```

 > ### **`[GET]/user/{Id}`** - Acessar usuários por Id
 Este método tem por finalidade retornar os dados de cadastros do usuário, segue código abaixo:

 ```json
{
    "user": {
        "_id": "",
        "name": "",
        "mail": "",
        "__v": 
    }
}
```
