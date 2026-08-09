package com.ifpe.ifpe_chat.model.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpe.ifpe_chat.model.entities.User;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUserCode(String userCode);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

}
