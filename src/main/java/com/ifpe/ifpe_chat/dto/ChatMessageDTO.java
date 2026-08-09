package com.ifpe.ifpe_chat.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ChatMessageDTO {

    private MessageType type;

    private String username;

    private String room;

    private String message;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime dateTime;

    public ChatMessageDTO() {
    }

    public ChatMessageDTO(
            MessageType type,
            String username,
            String room,
            String message,
            LocalDateTime dateTime) {

        this.type = type;
        this.username = username;
        this.room = room;
        this.message = message;
        this.dateTime = dateTime;

    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

}