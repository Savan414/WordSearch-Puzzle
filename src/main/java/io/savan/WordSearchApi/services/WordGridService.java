package io.savan.WordSearchApi.services;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class WordGridService {


    private class Coordinate{
        int x;
        int y;

        Coordinate(int x, int y){
            this.x = x;
            this.y = y;
        }
    }

    private enum Direction{
        HORIZONTAL,
        VERTICAL,
        DIAGONAL,
        HORIZONTAL_INVERSE,
        VERTICAL_INVERSE,
        DIAGONAL_INVERSE
    }


    //Populate the grid with the given words
    public char[][] generateGrid(int gridSize, List<String> words){

        List<Coordinate> coordinates = new ArrayList<>();
        char[][] gridContents = new char[gridSize][gridSize];

        //Fill the grid with '_' character
        for(int i = 0; i < gridSize; i++){
            for(int j = 0; j < gridSize; j++){
                coordinates.add(new Coordinate(i,j));
                gridContents[i][j] = '_';

            }
        }

        //Select a random place in the grid with random direction to place each word
        Collections.shuffle(coordinates);
        for(String word: words){
            for(Coordinate coordinate: coordinates){
                int x = coordinate.x;
                int y = coordinate.y;
                Direction selectedDirection = getDirectionForFit(gridContents, word, coordinate);

                // Place the word in the selected direction which is empty and available
                if(selectedDirection != null){
                    switch (selectedDirection) {
                        case HORIZONTAL -> {
                            for(char c: word.toCharArray()){
                                gridContents[x][y++] = c;
                            }
                        }
                        case VERTICAL -> {
                            for(char c: word.toCharArray()){
                                gridContents[x++][y] = c;
                            }
                        }

                        case DIAGONAL -> {
                            for(char c: word.toCharArray()){
                                gridContents[x++][y++] = c;
                            }
                        }
                        case HORIZONTAL_INVERSE -> {
                            for(char c: word.toCharArray()){
                                gridContents[x][y--] = c;
                            }
                        }
                        case VERTICAL_INVERSE -> {
                            for(char c: word.toCharArray()){
                                gridContents[x--][y] = c;
                            }
                        }
                        case DIAGONAL_INVERSE -> {
                            for(char c: word.toCharArray()){
                                gridContents[x--][y--] = c;
                            }
                        }
                    }
                    break;

                }
            }
        }
        randomFillGrid(gridContents);
        return gridContents;
    }

    //Print the grid to the console
    public void dislayGrid(char[][] gridContents){
        int gridSize = gridContents[0].length;
        for(int i = 0; i < gridSize; i++){
            for(int j = 0; j < gridSize; j++){
                System.out.print(gridContents[i][j] + " ");
            }
            System.out.println("");
        }

    }


    // Fill the rest of the empty spaces in the grid with random letters
    private void randomFillGrid(char[][] gridContents) {
        int gridSize = gridContents[0].length;
        String allCapLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for(int i = 0; i < gridSize; i++) {
            for (int j = 0; j < gridSize; j++) {
                if (gridContents[i][j] == '_') {
                    int randomIndex = ThreadLocalRandom.current().nextInt(0, allCapLetters.length());
                    gridContents[i][j] = allCapLetters.charAt(randomIndex);
                }
            }
        }
    }

    private Direction getDirectionForFit(char[][] gridContents, String word, Coordinate coordinate){

        List<Direction> directions = Arrays.asList(Direction.values());
        Collections.shuffle(directions);

        for(Direction direction: directions){
            if(doesWordFit(gridContents, word, coordinate, direction)){
                return direction;
            }
        }
        return null;
    }

    private boolean doesWordFit(char[][] gridContents, String word, Coordinate coordinate, Direction direction){

        int gridSize = gridContents[0].length;
        //Find out in which direction the word fits in the grid
        switch (direction) {
            case HORIZONTAL -> {
                if (coordinate.y + word.length() > gridSize) return false;
                for (int i = 0; i < word.length(); i++) {
                    if (gridContents[coordinate.x][coordinate.y + i] != '_') return false;
                }
            }
            case VERTICAL -> {
                if (coordinate.x + word.length() > gridSize) return false;
                for (int i = 0; i < word.length(); i++) {
                    if (gridContents[coordinate.x + i][coordinate.y] != '_') return false;
                }
            }
            case DIAGONAL -> {
                if (coordinate.y + word.length() > gridSize || coordinate.x + word.length() > gridSize) return false;
                for (int i = 0; i < word.length(); i++) {
                    if (gridContents[coordinate.x + i][coordinate.y + i] != '_') return false;
                }
            }
            case HORIZONTAL_INVERSE -> {
                if (coordinate.y < word.length()) return false;
                for (int i = 0; i < word.length(); i++) {
                    if (gridContents[coordinate.x][coordinate.y - i] != '_') return false;
                }
            }
            case VERTICAL_INVERSE -> {
                if (coordinate.x < word.length()) return false;
                for (int i = 0; i < word.length(); i++) {
                    if (gridContents[coordinate.x - i][coordinate.y] != '_') return false;
                }
            }
            case DIAGONAL_INVERSE -> {
                if (coordinate.y < word.length() || coordinate.x < word.length()) return false;
                for (int i = 0; i < word.length(); i++) {
                    if (gridContents[coordinate.x - i][coordinate.y - i] != '_') return false;
                }
            }
        }

        return true;
    }

}
