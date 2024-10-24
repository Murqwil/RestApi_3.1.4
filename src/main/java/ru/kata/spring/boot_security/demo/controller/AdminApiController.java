package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminApiController {

    private final UserService userService;

    @Autowired
    public AdminApiController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.findAll();
    }

    @PostMapping("/users")
    public void createUser(@RequestBody User user) {
        userService.save(user);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteById(id);
    }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable("id") Integer id) {
        return userService.getById(id);
    }

    @GetMapping("/user")
    public User getUserByUsername(Principal principal) {
        return userService.findByEmail(principal.getName());
    }

    @PutMapping("/users/{id}")
    public void updateUser(@PathVariable("id") Integer id, @RequestBody User user) {
        user.setId(id);
        userService.update(user);
    }
}
