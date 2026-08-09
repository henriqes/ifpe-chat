package com.ifpe.ifpe_chat.dto;

import java.util.List;

public class UsersOnlineDTO {

    private MessageType type;

    private List<String> users;

    public UsersOnlineDTO() {
    }

    public UsersOnlineDTO(MessageType type,
                          List<String> users) {

        this.type = type;
        this.users = users;

    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public List<String> getUsers() {
        return users;
    }

    public void setUsers(List<String> users) {
        this.users = users;
    }

}