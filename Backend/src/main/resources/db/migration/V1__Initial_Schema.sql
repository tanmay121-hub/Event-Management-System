-- V1__Initial_Schema.sql
-- Initial schema for Event Management System

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_user_email (email)
);

-- 2. Organizations Table
CREATE TABLE organizations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description VARCHAR(500),
    status VARCHAR(50) NOT NULL,
    created_by BIGINT NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME,
    updated_at DATETIME,
    CONSTRAINT fk_org_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 3. Events Table
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(1000),
    status VARCHAR(50) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    organization_id BIGINT NOT NULL,
    organizer_id BIGINT NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME,
    updated_at DATETIME,
    CONSTRAINT fk_event_org FOREIGN KEY (organization_id) REFERENCES organizations(id),
    CONSTRAINT fk_event_organizer FOREIGN KEY (organizer_id) REFERENCES users(id)
);

-- 4. Teams Table
CREATE TABLE teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    join_code VARCHAR(255) NOT NULL UNIQUE,
    event_id BIGINT,
    leader_id BIGINT,
    created_at DATETIME,
    CONSTRAINT fk_team_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT fk_team_leader FOREIGN KEY (leader_id) REFERENCES users(id)
);

-- 5. Registrations Table
CREATE TABLE registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    event_id BIGINT,
    team_id BIGINT,
    type VARCHAR(50),
    status VARCHAR(50),
    created_at DATETIME,
    CONSTRAINT fk_reg_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT fk_reg_team FOREIGN KEY (team_id) REFERENCES teams(id),
    UNIQUE KEY uk_event_user (event_id, user_id)
);

-- 6. Team Members Table
CREATE TABLE team_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT,
    user_id BIGINT,
    role VARCHAR(50),
    CONSTRAINT fk_tm_team FOREIGN KEY (team_id) REFERENCES teams(id),
    CONSTRAINT fk_tm_user FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY uk_team_user (team_id, user_id)
);

-- 7. Announcements Table
CREATE TABLE announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message VARCHAR(2000) NOT NULL,
    event_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    created_at DATETIME,
    CONSTRAINT fk_ann_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT fk_ann_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 8. Attendance Table
CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    check_in_time DATETIME NOT NULL,
    CONSTRAINT fk_att_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_att_event FOREIGN KEY (event_id) REFERENCES events(id),
    UNIQUE KEY uk_att_event_user (event_id, user_id)
);
