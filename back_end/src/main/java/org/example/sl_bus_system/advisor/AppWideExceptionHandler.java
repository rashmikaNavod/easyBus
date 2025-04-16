package org.example.sl_bus_system.advisor;

import org.example.sl_bus_system.dto.ResponseDTO;
import org.example.sl_bus_system.exception.ResourceAlreadyExistException;
import org.example.sl_bus_system.exception.ResourceNotFoundException;
import org.example.sl_bus_system.util.VarList;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AppWideExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ResponseDTO> resourceNotFound(Exception ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseDTO(VarList.Not_Found,ex.getMessage(),null));
    }

    @ExceptionHandler(ResourceAlreadyExistException.class)
    public ResponseEntity<ResponseDTO> resourceAlreadyExist(Exception ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ResponseDTO(VarList.Conflict, ex.getMessage(), null));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ResponseDTO> badCredentials(Exception ex){
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(new ResponseDTO(VarList.Bad_Gateway, ex.getMessage(), null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDTO> exception(Exception ex){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseDTO(VarList.Internal_Server_Error,ex.getMessage(),null));
    }

}
