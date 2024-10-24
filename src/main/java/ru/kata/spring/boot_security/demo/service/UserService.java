package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService {
    List<User> findAll ();
    User getById(Integer id);
    void save(User user);
    void deleteById(Integer id);
    User findByEmail(String username);
    void update(User user);
    User passwordCoder(User user);
}
