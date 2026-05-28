package com.careeros.dto.resume;

import java.time.Instant;

public record ResumeResponse(
        Long id,
        String originalFilename,
        String storedFilename,
        String filePath,
        Long fileSize,
        String contentType,
        String versionLabel,
        boolean defaultResume,
        Instant createdAt) {
}
