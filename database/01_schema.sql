-- ==========================================
-- Base de datos: SaludFamiliarDB
-- Motor: MySQL
-- Archivo: 01_schema.sql
-- Descripción: Estructura base para el sistema 
--              de gestión de IMC familiar.
-- ==========================================

-- Creación de la base de datos con soporte completo de caracteres
CREATE DATABASE IF NOT EXISTS SaludFamiliarDB 
    DEFAULT CHARACTER SET utf8mb4 
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE SaludFamiliarDB;

-- ==========================================
-- Tabla: PERSONAS
-- ==========================================
CREATE TABLE PERSONAS (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Sexo ENUM('M', 'F') NOT NULL,
    FechaNacimiento DATE NOT NULL,
    Altura INT NOT NULL COMMENT 'Altura en centímetros (ej: 175)'
) ENGINE=InnoDB;

-- ==========================================
-- Tabla: REGISTROS
-- ==========================================
CREATE TABLE REGISTROS (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PersonaId INT NOT NULL,
    Fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora exacta del registro',
    Peso DECIMAL(5,2) NOT NULL COMMENT 'Peso en kilogramos (ej: 75.50)',
    IMC DECIMAL(5,2) NOT NULL COMMENT 'Índice de Masa Corporal calculado',
    Diagnostico VARCHAR(255) DEFAULT NULL COMMENT 'Observación o diagnóstico del estado',
    
    -- Restricción de integridad referencial
    FOREIGN KEY (PersonaId) REFERENCES PERSONAS(Id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- Índices para optimizar búsquedas en producción
-- ==========================================
CREATE INDEX idx_persona_fecha ON REGISTROS(PersonaId, Fecha);