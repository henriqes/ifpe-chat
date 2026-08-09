const WS_URL = "ws://localhost:8080";

let socket = null;

/**
 * Conecta o usuário à sala através do WebSocket.
 *
 * @param {string} room - Número da sala.
 * @param {function} onMessage - Executado quando uma mensagem é recebida.
 * @param {function} onOpen - Executado quando a conexão é aberta.
 * @param {function} onClose - Executado quando a conexão é encerrada.
 * @param {function} onError - Executado quando ocorre um erro.
 */
export function connectWebSocket(
    room,
    onMessage,
    onOpen,
    onClose,
    onError
) {

    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token JWT não encontrado.");
        return;
    }

    const url =
        `${WS_URL}/chat/${room}?token=${encodeURIComponent(token)}`;

    socket = new WebSocket(url);

    socket.onopen = () => {

        console.log(`WebSocket conectado à sala ${room}`);

        if (onOpen) {
            onOpen();
        }

    };

    socket.onmessage = (event) => {

        try {

            const data = JSON.parse(event.data);

            console.log("Mensagem recebida:", data);

            if (onMessage) {
                onMessage(data);
            }

        } catch (error) {

            console.error(
                "Erro ao interpretar mensagem WebSocket:",
                error
            );

        }

    };

    socket.onclose = (event) => {

        console.log(
            "WebSocket desconectado.",
            event
        );

        if (onClose) {
            onClose(event);
        }

    };

    socket.onerror = (error) => {

        console.error(
            "Erro no WebSocket:",
            error
        );

        if (onError) {
            onError(error);
        }

    };
}


/**
 * Envia uma mensagem para a sala.
 *
 * @param {string} message - Texto da mensagem.
 */
export function sendMessage(message) {

    if (!socket) {
        console.error("WebSocket não está conectado.");
        return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket ainda não está aberto.");
        return;
    }

    const data = {
        message: message
    };

    socket.send(JSON.stringify(data));

}


/**
 * Envia o indicador de que o usuário está digitando.
 */
export function sendTyping() {

    if (!socket) {
        return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
        return;
    }

    const data = {
        type: "TYPING"
    };

    socket.send(JSON.stringify(data));

}


/**
 * Fecha a conexão WebSocket.
 */
export function disconnectWebSocket() {

    if (!socket) {
        return;
    }

    if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
    ) {

        socket.close();

    }

    socket = null;

}


/**
 * Verifica se existe uma conexão WebSocket aberta.
 */
export function isWebSocketConnected() {

    return (
        socket !== null &&
        socket.readyState === WebSocket.OPEN
    );

}