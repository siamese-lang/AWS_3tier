package com.amazoonS3.mini.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.Cookie;
import java.util.Optional;

import com.amazoonS3.mini.model.Board;
import com.amazoonS3.mini.service.BoardService;
import com.amazoonS3.mini.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/board")
public class BoardController {

    private final BoardService boardService;
    private final UserService userService;


    @Autowired
    public BoardController(BoardService boardService, UserService userService) {
        this.boardService = boardService;
        this.userService = userService;
    }
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", boardService.getAll());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> insertBoard(@RequestBody Board board) {
        Board insertedBoard = boardService.insertBoard(board);
        Map<String, Object> response = new HashMap<>();
        response.put("data", insertedBoard);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{bIdx}")
    public ResponseEntity<Map<String, Object>> updateBoard(@PathVariable int bIdx, @RequestBody Board board, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Board existingBoard = boardService.getBoardById(bIdx);
        if (existingBoard == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (!username.equals(existingBoard.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        board.setBIdx(bIdx);
        board.setUsername(username);  // 현재 로그인한 사용자의 이름으로 설정

        Board updatedBoard = boardService.updateBoard(board);
        Map<String, Object> response = new HashMap<>();
        response.put("data", updatedBoard);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{bIdx}")
    public ResponseEntity<?> deleteBoard(@PathVariable int bIdx, HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String currentUsername = (String) session.getAttribute("username");
            if (currentUsername == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Board board = boardService.getBoardById(bIdx);

            if (board == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            if (currentUsername.equals(board.getUsername())) {
                boardService.deleteBoard(bIdx);
                return ResponseEntity.ok().build();
            }

            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the board");
        }
    }

    @PutMapping("/{bIdx}/likes")
    public ResponseEntity<Map<String, Object>> updateLikes(@PathVariable int bIdx, @RequestBody Map<String, Integer> payload) {
        Board updatedBoard = boardService.updateLikes(bIdx, payload.get("likes"));
        Map<String, Object> response = new HashMap<>();
        response.put("data", updatedBoard);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{bIdx}/dislikes")
    public ResponseEntity<Map<String, Object>> updateDislikes(@PathVariable int bIdx, @RequestBody Map<String, Integer> payload) {
        Board updatedBoard = boardService.updateDislikes(bIdx, payload.get("dislikes"));
        Map<String, Object> response = new HashMap<>();
        response.put("data", updatedBoard);
        return ResponseEntity.ok(response);
    }

}
