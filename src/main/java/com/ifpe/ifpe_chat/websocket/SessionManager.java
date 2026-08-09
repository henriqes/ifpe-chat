package com.ifpe.ifpe_chat.websocket;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import jakarta.websocket.Session;

@Component
public class SessionManager {


    private final Map<Session, String> sessionUsers =
            new ConcurrentHashMap<>();

    
    public void register(Session session, String username) {

        sessionUsers.put(session, username);

    }

    public void unregister(Session session) {

        sessionUsers.remove(session);

    }

    public String getUsername(Session session) {

        return sessionUsers.get(session);

    }

    public boolean contains(Session session) {

        return sessionUsers.containsKey(session);

    }
    
    public java.util.List<String> getAllUsernames() {

        return new java.util.ArrayList<>(
                sessionUsers.values()
        );

    }

}