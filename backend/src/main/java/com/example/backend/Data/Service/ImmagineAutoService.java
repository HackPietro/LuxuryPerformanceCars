package com.example.backend.Data.Service;

import com.example.backend.Dto.ImmagineAutoDto;
import java.util.List;

public interface ImmagineAutoService {
    List<ImmagineAutoDto> findAllByAutoId(Long autoId);
    ImmagineAutoDto getById(Long id);
    ImmagineAutoDto saveImmagineAuto(ImmagineAutoDto immagineAutoDto, Long autoId);
    void deleteById(Long id);
    boolean addImmagineAuto(Long autoId, String base64Image);
    void deleteByAutoId(Long autoId);
}
