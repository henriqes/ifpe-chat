package com.ifpe.ifpe_chat.websocket;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import jakarta.websocket.Session;

@Component
public class RoomManager {

    private final Map<String, Set<Session>> rooms = new ConcurrentHashMap<>();

    public RoomManager() {

        rooms.put("1", ConcurrentHashMap.newKeySet());
        rooms.put("2", ConcurrentHashMap.newKeySet());
        rooms.put("3", ConcurrentHashMap.newKeySet());
        rooms.put("4", ConcurrentHashMap.newKeySet());
        rooms.put("5", ConcurrentHashMap.newKeySet());
        rooms.put("6", ConcurrentHashMap.newKeySet());

    }

    public void joinRoom(String room, Session session) {

        if (rooms.containsKey(room)) {

            rooms.get(room).add(session);

        }

    }

    public void leaveRoom(String room, Session session) {

        if (rooms.containsKey(room)) {

            rooms.get(room).remove(session);

        }

    }

    public Set<Session> getRoomSessions(String room) {

        return rooms.get(room);

    }
    
    public Set<String> getRoomUsers(String room,
            SessionManager sessionManager) {

    	Set<String> users = ConcurrentHashMap.newKeySet();

    	Set<Session> sessions = rooms.get(room);

    	if (sessions == null) {
    		return users;
    	}

    	for (Session session : sessions) {

    		String username =
    				sessionManager.getUsername(session);

    		if (username != null) {
    			users.add(username);
    		}

    	}

    	return users;

    }

}