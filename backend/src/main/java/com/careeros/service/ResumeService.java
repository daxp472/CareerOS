package com.careeros.service;

import com.careeros.domain.ActivityType;
import com.careeros.domain.entity.Resume;
import com.careeros.domain.entity.User;
import com.careeros.dto.resume.ResumeResponse;
import com.careeros.exception.BadRequestException;
import com.careeros.exception.ResourceNotFoundException;
import com.careeros.mapper.CareerOsMapper;
import com.careeros.repository.ResumeRepository;
import com.careeros.security.CurrentUserService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final CurrentUserService currentUserService;
    private final CareerOsMapper mapper;
    private final ActivityLogService activityLogService;

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Transactional
    public ResumeResponse upload(MultipartFile file, String versionLabel, boolean defaultResume) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Resume file is required");
        }
        User user = currentUserService.user();
        try {
            Path root = Path.of(uploadDir, "resumes", String.valueOf(user.getId()));
            Files.createDirectories(root);
            String storedFilename = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path target = root.resolve(storedFilename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            Resume resume = new Resume();
            resume.setUser(user);
            resume.setOriginalFilename(file.getOriginalFilename() == null ? "resume" : file.getOriginalFilename());
            resume.setStoredFilename(storedFilename);
            resume.setFilePath(target.toAbsolutePath().toString());
            resume.setFileSize(file.getSize());
            resume.setContentType(file.getContentType());
            resume.setVersionLabel(versionLabel);
            resume.setDefaultResume(defaultResume);
            if (defaultResume) {
                clearDefaultResume(user.getId());
            }
            Resume saved = resumeRepository.save(resume);
            activityLogService.record(user, ActivityType.RESUME, "Resume", String.valueOf(saved.getId()), "Resume uploaded", saved.getOriginalFilename());
            return mapper.toResumeResponse(saved);
        } catch (IOException exception) {
            throw new BadRequestException("Unable to store resume file");
        }
    }

    @Transactional(readOnly = true)
    public List<ResumeResponse> list(Long userId) {
        return resumeRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(mapper::toResumeResponse).toList();
    }

    @Transactional
    public ResumeResponse markDefault(Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId).orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        ensureOwner(resume);
        clearDefaultResume(resume.getUser().getId());
        resume.setDefaultResume(true);
        return mapper.toResumeResponse(resumeRepository.save(resume));
    }

    @Transactional(readOnly = true)
    public Resource download(Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId).orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        ensureOwner(resume);
        try {
            return new UrlResource(Path.of(resume.getFilePath()).toUri());
        } catch (Exception exception) {
            throw new ResourceNotFoundException("Resume file unavailable");
        }
    }

    @Transactional
    public void delete(Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId).orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        ensureOwner(resume);
        try {
            Files.deleteIfExists(Path.of(resume.getFilePath()));
        } catch (IOException ignored) {
        }
        resumeRepository.delete(resume);
    }

    private void clearDefaultResume(Long userId) {
        resumeRepository.findByUserIdOrderByCreatedAtDesc(userId).forEach(resume -> {
            if (resume.isDefaultResume()) {
                resume.setDefaultResume(false);
                resumeRepository.save(resume);
            }
        });
    }

    private void ensureOwner(Resume resume) {
        if (!resume.getUser().getId().equals(currentUserService.userId()) && currentUserService.user().getRole() != com.careeros.domain.UserRole.ADMIN) {
            throw new ResourceNotFoundException("Resume not found");
        }
    }
}
