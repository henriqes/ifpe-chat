package com.ifpe.ifpe_chat.websocket;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ifpe.ifpe_chat.dto.ChatMessageDTO;
import com.ifpe.ifpe_chat.dto.MessageType;
import com.ifpe.ifpe_chat.dto.UsersOnlineDTO;
import com.ifpe.ifpe_chat.security.JwtUtils;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

@Component
@ServerEndpoint("/chat/{room}")
public class ChatEndpoint {

    private RoomManager getRoomManager() {
        return ServiceHolder.getRoomManager();
    }

    private SessionManager getSessionManager() {
        return ServiceHolder.getSessionManager();
    }

    private ObjectMapper getObjectMapper() {
        return ServiceHolder.getObjectMapper();
    }

    private String extractToken(Session session) {

        URI uri = session.getRequestURI();
        String query = uri.getQuery();

        if (query == null) {
            return null;
        }

        for (String param : query.split("&")) {

            if (param.startsWith("token=")) {
                return param.substring(6);
            }

        }

        return null;
    }

    private void broadcast(String room,
                           ChatMessageDTO message) throws IOException {

        String response =
                getObjectMapper().writeValueAsString(message);

        var sessions =
                getRoomManager().getRoomSessions(room);

        if (sessions == null) {
            return;
        }

        for (Session clientSession : sessions) {

            if (clientSession.isOpen()) {

                clientSession
                        .getBasicRemote()
                        .sendText(response);

            }

        }

    }

    private void broadcastUsers(String room) throws IOException {

        UsersOnlineDTO usersOnline = new UsersOnlineDTO();

        usersOnline.setType(MessageType.USERS);

        usersOnline.setUsers(

                new ArrayList<>(

                        getRoomManager()
                                .getRoomUsers(
                                        room,
                                        getSessionManager()
                                )

                )

        );

        String response =
                getObjectMapper()
                        .writeValueAsString(usersOnline);

        var sessions =
                getRoomManager()
                        .getRoomSessions(room);

        if (sessions == null) {
            return;
        }

        for (Session clientSession : sessions) {

            if (clientSession.isOpen()) {

                clientSession
                        .getBasicRemote()
                        .sendText(response);

            }

        }

    }

    @OnOpen
    public void onOpen(Session session,
                       @PathParam("room") String room)
            throws IOException {

        String token = extractToken(session);

        if (token == null || !JwtUtils.isTokenValid(token)) {

            session.close();
            return;

        }

        String username =
                JwtUtils.extractUsername(token);

        getSessionManager().register(session, username);

        getRoomManager().joinRoom(room, session);

        ChatMessageDTO joinMessage = new ChatMessageDTO();

        joinMessage.setRoom(room);
        joinMessage.setType(MessageType.JOIN);
        joinMessage.setUsername(username);
        joinMessage.setMessage("entrou na sala.");
        joinMessage.setDateTime(LocalDateTime.now());

        broadcast(room, joinMessage);

        broadcastUsers(room);

        System.out.println(username + " entrou na sala " + room);

    }

    @OnClose
    public void onClose(Session session,
                        @PathParam("room") String room)
            throws IOException {

        String username =
                getSessionManager().getUsername(session);

        getSessionManager().unregister(session);

        getRoomManager().leaveRoom(room, session);

        ChatMessageDTO leaveMessage = new ChatMessageDTO();

        leaveMessage.setRoom(room);
        leaveMessage.setType(MessageType.LEAVE);
        leaveMessage.setUsername(username);
        leaveMessage.setMessage("saiu da sala.");
        leaveMessage.setDateTime(LocalDateTime.now());

        broadcast(room, leaveMessage);

        broadcastUsers(room);

    }

    @OnError
    public void onError(Session session,
                        Throwable throwable) {

        System.out.println(
                "Erro na conexão WebSocket: "
                        + throwable.getMessage()
        );

    }

    @OnMessage
    public void onMessage(String json,
                          Session session,
                          @PathParam("room") String room)
            throws IOException {

        ChatMessageDTO message =
                getObjectMapper()
                        .readValue(json, ChatMessageDTO.class);

        message.setRoom(room);
        message.setUsername(
                getSessionManager().getUsername(session)
        );
        message.setDateTime(LocalDateTime.now());

        if (message.getType() == MessageType.TYPING) {

            broadcast(room, message);
            return;

        }

        if (message.getType() == MessageType.STOP_TYPING) {

            broadcast(room, message);
            return;

        }

        message.setType(MessageType.CHAT);

        broadcast(room, message);

    }

}