import { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/register.css";
import { register } from "../services/api";

function Register() {

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(event) {

      event.preventDefault();

      try {

          await register(
              name,
              username,
              email,
              password
          );

          alert("Conta criada com sucesso!");

          window.location.href = "/login";

      } catch (error) {

          console.error(
              "Erro ao criar conta:",
              error
          );

          alert(
              error.response?.data ||
              "Não foi possível criar a conta."
          );

      }

  }
    return (
        <main className="register-page">

            <section className="register-card">

                <div className="register-header">

                    <h1>Crie sua conta</h1>

                    <p>
                        Cadastre-se para entrar no IFPE Chat.
                    </p>

                </div>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="name">
                            Nome
                        </label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Digite seu nome"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="username">
                            Usuário
                        </label>

                        <input
                            id="username"
                            type="text"
                            placeholder="Escolha seu usuário"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="email">
                            E-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="password">
                            Senha
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Crie uma senha"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />

                    </div>

                    <button
                        type="submit"
                        className="register-button"
                    >
                        Criar conta
                    </button>

                </form>

                <div className="login-link">

                    <span>
                        Já possui uma conta?
                    </span>

                    <Link to="/login">
                        Entrar
                    </Link>

                </div>

            </section>

        </main>
    );
}

export default Register;