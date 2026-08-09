import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../services/api";

import "../styles/login.css";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        if (!username || !password) {

            setError("Preencha todos os campos.");

            return;
        }

        try {

            setLoading(true);

            const token = await login(
                username,
                password
            );

            localStorage.setItem("token", token);

            navigate("/rooms");

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data ||
                    "Usuário ou senha inválidos."
                );

            } else {

                setError(
                    "Não foi possível conectar ao servidor."
                );

            }

        } finally {

            setLoading(false);

        }

    }

    return (
        <main className="login-page">

            <section className="login-card">

                <div className="login-header">

                    <h1>IFPE Chat</h1>

                    <p>
                        Conecte-se com seus colegas de turma.
                    </p>

                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="username">
                            Usuário
                        </label>

                        <input
                            id="username"
                            type="text"
                            placeholder="Digite seu usuário"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
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
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />

                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Entrando..."
                            : "Entrar"
                        }
                    </button>

                </form>

                <div className="register-link">

                    <span>
                        Ainda não possui uma conta?
                    </span>

                    <Link to="/register">
                        Cadastre-se
                    </Link>

                </div>

            </section>

        </main>
    );
}

export default Login;