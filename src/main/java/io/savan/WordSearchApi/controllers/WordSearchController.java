package io.savan.WordSearchApi.controllers;

import ch.qos.logback.core.net.SyslogOutputStream;
import io.savan.WordSearchApi.services.WordGridService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("/")
public class WordSearchController {

   @Autowired
   WordGridService wordGridService;

    @GetMapping("/wordgrid")
    public String createWordGrid(@RequestParam int gridSize, @RequestParam List<String> words){

        char[][] grid = wordGridService.generateGrid(gridSize, words);
        String gridToString = "";

        for(int i = 0; i < gridSize; i++){
            for(int j = 0; j < gridSize; j++){
                gridToString += grid[i][j] + " ";
            }
            gridToString += "\r\n";
        }
        System.out.println(gridToString);
        return gridToString;
    }
}
