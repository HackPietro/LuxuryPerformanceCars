package com.example.backend.Data.Service;

import com.example.backend.Data.Dao.ImmagineAutoDao;
import com.example.backend.Data.Entities.Auto;
import com.example.backend.Data.Entities.ImmagineAuto;
import com.example.backend.Data.Service.ImmagineAutoService;
import com.example.backend.Dto.ImmagineAutoDto;
import com.example.backend.Data.Dao.AutoDao;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImmagineAutoServiceImpl implements ImmagineAutoService {

    @Autowired
    private ImmagineAutoDao immagineAutoDao;

    @Autowired
    private AutoDao autoDao;

    @Override
    public List<ImmagineAutoDto> findAllByAutoId(Long autoId) {
        Auto auto = autoDao.findById(autoId)
                .orElseThrow(() -> new EntityNotFoundException("Auto con ID " + autoId + " non trovata"));

        // Cerca tutte le immagini associate all'auto
        return auto.getImmagini().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ImmagineAutoDto getById(Long id) {
        ImmagineAuto immagineAuto = immagineAutoDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Immagine con ID " + id + " non trovata"));
        return convertToDto(immagineAuto);
    }

    @Override
    public ImmagineAutoDto saveImmagineAuto(ImmagineAutoDto immagineAutoDto, Long autoId) {
        Auto auto = autoDao.findById(autoId)
                .orElseThrow(() -> new EntityNotFoundException("Auto con ID " + autoId + " non trovata"));

        ImmagineAuto immagineAuto = convertToEntity(immagineAutoDto);
        immagineAuto.setAuto(auto); // Imposta l'auto associata all'immagine
        ImmagineAuto savedImmagine = immagineAutoDao.save(immagineAuto);
        return convertToDto(savedImmagine);
    }

    @Override
    public void deleteById(Long id) {
        if (!immagineAutoDao.existsById(id)) {
            throw new EntityNotFoundException("Immagine con ID " + id + " non esiste");
        }
        immagineAutoDao.deleteById(id);
    }

    // Metodo per convertire ImmagineAuto a ImmagineAutoDto
    private ImmagineAutoDto convertToDto(ImmagineAuto immagineAuto) {
        ImmagineAutoDto immagineAutoDto = new ImmagineAutoDto();
        immagineAutoDto.setId(immagineAuto.getId());
        immagineAutoDto.setBase64(immagineAuto.getBase64());
        return immagineAutoDto;
    }

    private ImmagineAuto convertToEntity(ImmagineAutoDto immagineAutoDto) {
        ImmagineAuto immagineAuto = new ImmagineAuto();
        immagineAuto.setId(immagineAutoDto.getId());
        immagineAuto.setBase64(immagineAutoDto.getBase64());
        return immagineAuto;
    }

    @Override
    public boolean addImmagineAuto(Long autoId, String base64Image) {
        base64Image = cleanBase64(base64Image);

        ImmagineAuto immagineAuto = new ImmagineAuto();
        immagineAuto.setBase64(base64Image);

        Auto auto = autoDao.findById(autoId)
                .orElseThrow(() -> new EntityNotFoundException("Auto con ID " + autoId + " non trovata"));

        immagineAuto.setAuto(auto);
        immagineAutoDao.save(immagineAuto);

        return true;
    }

    private String cleanBase64(String base64Image) {
        if (base64Image.startsWith("{") && base64Image.endsWith("}")) {
            base64Image = base64Image.substring(1, base64Image.length() - 1);
            base64Image = base64Image.split(":")[1].trim();
        }
        if (base64Image.startsWith("data:image")) {
            base64Image = base64Image.replaceFirst("^data:image\\/[a-zA-Z]+;base64,", "");
        }
        base64Image = base64Image.replaceAll("\"", "");
        return base64Image;
    }

    @Override
    public void deleteByAutoId(Long autoId) {
        List<ImmagineAuto> immagini = immagineAutoDao.findByAutoId(autoId);

        if (immagini.isEmpty()) {
            throw new EntityNotFoundException("Nessuna immagine trovata per l'auto con ID " + autoId);
        }

        immagineAutoDao.deleteByAutoId(autoId);
    }



}
