package com.careeros.controller;

import com.careeros.dto.ApiResponse;
import com.careeros.dto.resume.ResumeResponse;
import com.careeros.security.CurrentUserService;
import com.careeros.service.ResumeService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final CurrentUserService currentUserService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ResumeResponse> upload(@RequestParam("file") MultipartFile file,
                                              @RequestParam(value = "versionLabel", required = false) String versionLabel,
                                              @RequestParam(value = "defaultResume", defaultValue = "false") boolean defaultResume) {
        return ApiResponse.success("Resume uploaded", resumeService.upload(file, versionLabel, defaultResume));
    }

    @GetMapping
    public ApiResponse<List<ResumeResponse>> list() {
        return ApiResponse.success(resumeService.list(currentUserService.userId()));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) throws IOException {
        Resource resource = resumeService.download(id);
        Path path = Path.of(resource.getURI());
        String contentType = Files.probeContentType(path);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType == null ? MediaType.APPLICATION_OCTET_STREAM_VALUE : contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + path.getFileName() + "\"")
                .body(resource);
    }

    @PutMapping("/{id}/default")
    public ApiResponse<ResumeResponse> markDefault(@PathVariable Long id) {
        return ApiResponse.success("Default resume updated", resumeService.markDefault(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        resumeService.delete(id);
        return ApiResponse.success("Resume deleted");
    }
}
