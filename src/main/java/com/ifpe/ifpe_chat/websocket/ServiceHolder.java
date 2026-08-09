package com.ifpe.ifpe_chat.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class ServiceHolder {

    private static RoomManager roomManager;

    private static SessionManager sessionManager;

    private static ObjectMapper objectMapper;


    @Autowired
    public ServiceHolder(RoomManager roomManager,
                         SessionManager sessionManager,
                         ObjectMapper objectMapper) {

        ServiceHolder.roomManager = roomManager;
        ServiceHolder.sessionManager = sessionManager;
        ServiceHolder.objectMapper = objectMapper;

    }


    public static RoomManager getRoomManager() {

        return roomManager;

    }


    public static SessionManager getSessionManager() {

        return sessionManager;

    }


    public static ObjectMapper getObjectMapper() {

        return objectMapper;

    }

}