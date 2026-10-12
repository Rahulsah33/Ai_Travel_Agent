package com.Ai_Agent_Backend.config;

import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;

@Slf4j
public class DotenvLoader {

    public static void load() {
        List<String> candidatePaths = List.of(".env", "../.env", "Ai_Agent_Backend/.env");
        for (String path : candidatePaths) {
            File envFile = new File(path);
            if (envFile.exists() && envFile.isFile()) {
                loadFile(envFile);
                return;
            }
        }
    }

    private static void loadFile(File file) {
        log.info("Loading environment configuration from: {}", file.getAbsolutePath());
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                int delimiterIdx = line.indexOf('=');
                if (delimiterIdx > 0) {
                    String key = line.substring(0, delimiterIdx).trim();
                    String value = line.substring(delimiterIdx + 1).trim();

                    if ((value.startsWith("\"") && value.endsWith("\""))
                            || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.substring(1, value.length() - 1);
                    }

                    // System property only set if not already present in OS environment
                    if (System.getProperty(key) == null && System.getenv(key) == null) {
                        System.setProperty(key, value);
                    }
                }
            }
        } catch (IOException exception) {
            log.warn("Failed to read .env file {}: {}", file.getName(), exception.getMessage());
        }
    }
}
