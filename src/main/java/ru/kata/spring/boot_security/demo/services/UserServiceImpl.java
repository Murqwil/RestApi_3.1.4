package ru.kata.spring.boot_security.demo.services;

import jakarta.annotation.PostConstruct;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User passwordCoder(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return user;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User getById(long id) {
        User user = null;
        Optional<User> optional = userRepository.findById(id);
        if(optional.isPresent()) {
            user = optional.get();
        }
        return user;
    }

    @Override
    public void save(User user) {
        userRepository.save(passwordCoder(user));
    }

    @Override
    public void update(User user) {
        userRepository.save(user);
    }

    @Override
    public void deleteById(long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    @PostConstruct
    public void addDefaultUser() {

        Set<Role> roleSetAdminAndUser = new HashSet<>();
        roleSetAdminAndUser.add(roleRepository.findById(1L).orElse(null));
        roleSetAdminAndUser.add(roleRepository.findById(2L).orElse(null));

        Set<Role> roleSetUser = new HashSet<>();
        roleSetUser.add(roleRepository.findById(2L).orElse(null));

        User usrAdmin = new User("Тимур","Сабирзянов",(byte) 25, "admin@mail.com","123",roleSetAdminAndUser);
        User usrUser = new User("Ринат","Сабирзянов",(byte) 29, "user@mail.com","123",roleSetUser);

        save(usrAdmin);
        save(usrUser);
    }
}

