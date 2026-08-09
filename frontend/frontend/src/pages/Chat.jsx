import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
    connectWebSocket,
    disconnectWebSocket,
    sendMessage,
    sendTyping
} from "../services/websocket";

import "../styles/chat.css";

function Chat() {

    const { room } = useParams();

    const [connected, setConnected] = useState(false);

    const [users, setUsers] = useState([]);

    const [typingUser, setTypingUser] = useState(null);

    const [messages, setMessages] = useState([]);

    const [messageText, setMessageText] = useState("");

    /*
     * Guarda o timer do indicador de digitação.
     */
    const typingTimeoutRef = useRef(null);


    /*
     * Obtém o usuário atualmente logado
     * através do JWT armazenado no navegador.
     */
    const token = localStorage.getItem("token");

    let currentUsername = "";

    if (token) {

        try {

            const decodedToken = jwtDecode(token);

            currentUsername = decodedToken.sub;

        } catch (error) {

            console.error(
                "Erro ao interpretar o token JWT:",
                error
            );

        }

    }


    /*
     * Envia uma mensagem para a sala.
     */
    function handleSubmit(event) {

        event.preventDefault();

        const message = messageText.trim();

        if (!message) {
            return;
        }

        if (!connected) {

            console.error(
                "Não é possível enviar mensagem: WebSocket desconectado."
            );

            return;

        }

        sendMessage(message);

        setMessageText("");

    }


    /*
     * Informa aos outros usuários da sala
     * que o usuário atual está digitando.
     */
    function handleTyping() {

        if (!connected) {
            return;
        }

        sendTyping();

    }


    useEffect(() => {

        console.log(`Conectando à sala ${room}...`);

        connectWebSocket(

            room,

            // Mensagem recebida
            (data) => {

                console.log(
                    "Mensagem recebida do WebSocket:",
                    data
                );


                /*
                 * Atualiza a lista de usuários
                 * quando o backend envia USERS.
                 */
                if (data.type === "USERS") {

                    setUsers(data.users);

                }


                /*
                 * Adiciona mensagens normais
                 * ao histórico atual da sala.
                 */
                if (data.type === "CHAT") {

                    const newMessage = {

                        ...data,

                        own:
                            data.username === currentUsername

                    };

                    setMessages((currentMessages) => [

                        ...currentMessages,
                        newMessage

                    ]);

                }


                /*
                 * Adiciona mensagens de entrada e saída
                 * ao histórico da sala.
                 */
                if (
                    data.type === "JOIN" ||
                    data.type === "LEAVE"
                ) {

                    const systemMessage = {

                        ...data,

                        system: true

                    };

                    setMessages((currentMessages) => [

                        ...currentMessages,
                        systemMessage

                    ]);

                }


                /*
                 * Exibe o indicador de digitação
                 * quando outro usuário começa a digitar.
                 */
                if (data.type === "TYPING") {

                    if (data.username !== currentUsername) {

                        setTypingUser(data.username);


                        /*
                         * Cancela o timer anterior.
                         *
                         * Isso evita que o indicador desapareça
                         * enquanto o usuário continua digitando.
                         */
                        if (typingTimeoutRef.current) {

                            clearTimeout(
                                typingTimeoutRef.current
                            );

                        }


                        /*
                         * Mantém o indicador visível por 5 segundos.
                         *
                         * Se outro evento TYPING chegar antes
                         * dos 5 segundos, o timer será reiniciado.
                         */
                        typingTimeoutRef.current =
                            setTimeout(() => {

                                setTypingUser(null);

                            }, 5000);

                    }

                }

            },


            // Conexão aberta
            () => {

                console.log(
                    `WebSocket conectado à sala ${room}`
                );

                setConnected(true);

            },


            // Conexão fechada
            () => {

                console.log(
                    `WebSocket desconectado da sala ${room}`
                );

                setConnected(false);

            },


            // Erro
            (error) => {

                console.error(
                    "Erro no WebSocket:",
                    error
                );

                setConnected(false);

            }

        );


        return () => {

            console.log(
                `Saindo da sala ${room}...`
            );

            disconnectWebSocket();


            /*
             * Limpa o timer do indicador de digitação
             * quando o componente é desmontado.
             */
            if (typingTimeoutRef.current) {

                clearTimeout(
                    typingTimeoutRef.current
                );

            }

        };

    }, [room, currentUsername]);


    return (
        <main className="chat-page">


            <header className="chat-header">

                <div className="chat-header-left">

                    <Link
                        to="/rooms"
                        className="back-button"
                    >
                        ←
                    </Link>


                    <div className="chat-room-info">

                        <h1>
                            {room}º Período
                        </h1>

                        <span>

                            <span
                                className="online-dot"
                            ></span>

                            {connected
                                ? "Conectado"
                                : "Conectando..."
                            }

                        </span>

                    </div>

                </div>


                <div className="chat-logo">
                    IFPE Chat
                </div>

            </header>


            <section className="chat-container">


                <aside className="users-sidebar">

                    <div className="users-header">

                        <h2>
                            Usuários online
                        </h2>

                        <span className="users-count">
                            {users.length}
                        </span>

                    </div>


                    <div className="users-list">

                        {users.map((username) => (

                            <div
                                key={username}
                                className="user-item"
                            >

                                <div className="user-avatar">

                                    {username
                                        .charAt(0)
                                        .toUpperCase()}

                                </div>


                                <div className="user-name">
                                    {username}
                                </div>


                                <span className="user-online"></span>

                            </div>

                        ))}

                    </div>

                </aside>


                <section className="chat-main">


                    <div className="messages-area">

                        {messages.map((message, index) => {


                            /*
                             * Mensagem de sistema:
                             *
                             * João entrou na sala.
                             * João saiu da sala.
                             */
                            if (message.system) {

                                return (

                                    <div
                                        key={`system-${message.dateTime}-${index}`}
                                        className="system-message"
                                    >
                                        {message.username}{" "}
                                        {message.message}
                                    </div>

                                );

                            }


                            /*
                             * Mensagem normal:
                             * calcula o horário exibido.
                             */
                            const time = message.dateTime
                                ? new Date(
                                    message.dateTime
                                ).toLocaleTimeString(
                                    "pt-BR",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }
                                )
                                : "";


                            return (

                                <div
                                    key={`${message.dateTime}-${index}`}
                                    className={`message-wrapper ${
                                        message.own
                                            ? "message-own"
                                            : "message-other"
                                    }`}
                                >


                                    {!message.own && (

                                        <span className="message-username">
                                            {message.username}
                                        </span>

                                    )}


                                    <div className="message-bubble">

                                        <span className="message-text">
                                            {message.message}
                                        </span>


                                        <span className="message-time">
                                            {time}
                                        </span>

                                    </div>

                                </div>

                            );

                        })}

                    </div>


                    {typingUser && (

                        <div className="typing-indicator">

                            <span className="typing-user">
                                {typingUser}
                            </span>

                            <span>
                                está digitando
                            </span>

                            <span className="typing-dots">

                                <span></span>
                                <span></span>
                                <span></span>

                            </span>

                        </div>

                    )}


                    <form
                        className="message-form"
                        onSubmit={handleSubmit}
                    >

                        <input
                            type="text"
                            placeholder="Digite uma mensagem..."
                            value={messageText}
                            onChange={(event) => {

                                setMessageText(
                                    event.target.value
                                );

                                handleTyping();

                            }}
                        />


                        <button
                            type="submit"
                            className="send-button"
                        >
                            Enviar
                        </button>

                    </form>

                </section>

            </section>

        </main>
    );
}

export default Chat;