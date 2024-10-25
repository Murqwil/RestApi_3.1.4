package ru.kata.spring.boot_security.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        Role userRole = roleService.findById(1);
        if (userRole == null) {
            userRole = new Role("USER");
            roleService.save(userRole);
        }

        Role adminRole = roleService.findById(2);
        if (adminRole == null) {
            adminRole = new Role("ADMIN");
            roleService.save(adminRole);
        }


        User user = new User();
        user.setUsername("user");
        user.setAge(29);
        user.setPassword(passwordEncoder.encode("user"));
        user.setName("Rinat");
        user.setLastName("Sabirzynov");
        Set<Role> userRoles = new HashSet<>();
        userRoles.add(userRole);
        user.setRoles(userRoles);
        user.setRole("USER");
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);
        user.setEnabled(true);


        User admin = new User();
        admin.setUsername("admin");
        admin.setAge(25);
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setName("Timur");
        admin.setLastName("Sabirzynov");
        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(adminRole);
        admin.setRoles(adminRoles);
        admin.setRole("ADMIN");
        admin.setAccountNonExpired(true);
        admin.setAccountNonLocked(true);
        admin.setCredentialsNonExpired(true);
        admin.setEnabled(true);

        userRepository.save(user);
        userRepository.save(admin);
    }
}
