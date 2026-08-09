# IFPE Chat

Sistema de comunicação desenvolvido para a comunidade acadêmica do Instituto Federal de Pernambuco (IFPE).

O projeto tem como objetivo oferecer uma plataforma de comunicação entre usuários, permitindo autenticação e interação por meio de uma aplicação web.

## 📌 Sobre o projeto

O IFPE Chat é uma aplicação web desenvolvida como projeto acadêmico, utilizando uma arquitetura separada entre frontend e backend.

A aplicação possui:

- Cadastro de usuários
- Autenticação e login
- Persistência de usuários em banco de dados
- API REST para comunicação entre frontend e backend
- Interface web responsiva
- Integração com banco de dados MySQL

O projeto está em desenvolvimento e novas funcionalidades serão adicionadas conforme sua evolução.

---

## 🛠️ Tecnologias utilizadas

### Backend

- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven
- MySQL

### Frontend

- React
- JavaScript
- HTML
- CSS
- Axios
- React Router

### Infraestrutura

- Railway — hospedagem do backend e banco de dados
- Vercel — hospedagem do frontend
- GitHub — versionamento do projeto

---

## 📂 Estrutura do projeto

```text
ifpe-chat/
│
├── src/
│   └── main/
│       └── java/
│           └── com/
│               └── ifpe/
│                   └── ifpe_chat/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .gitignore
└── README.md
