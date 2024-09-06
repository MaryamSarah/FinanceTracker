package com.iitJava.financialTracker.service;

import com.iitJava.financialTracker.model.User;

public interface UserService {

    public User saveUser(User user);

    public boolean authenticateUser(String username, String password);
}
