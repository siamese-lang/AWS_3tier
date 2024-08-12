package com.amazoonS3.mini.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazoonS3.mini.mapper.BoardMapper;
import com.amazoonS3.mini.model.Board;

import java.util.List;

@Service
public class BoardService {

    private final BoardMapper boardMapper;

    @Autowired
    public BoardService(BoardMapper boardMapper) {
        this.boardMapper = boardMapper;
    }

    public List<Board> getAll() {
        return boardMapper.getAll();
    }

    public Board insertBoard(Board board) {
        boardMapper.insertBoard(board);
        return boardMapper.getBoardById(board.getBIdx());
    }

    public Board updateBoard(Board board) {
        boardMapper.updateBoard(board);
        return boardMapper.getBoardById(board.getBIdx());
    }

    public void deleteBoard(int bIdx) {
        boardMapper.deleteBoard(bIdx);
    }


    public Board updateLikes(int bIdx, int likes) {
        Board board = boardMapper.getBoardById(bIdx);
        board.setLikes(likes);
        boardMapper.updateLikes(board);
        return board;
    }

    public Board updateDislikes(int bIdx, int dislikes) {
        Board board = boardMapper.getBoardById(bIdx);
        board.setDislikes(dislikes);
        boardMapper.updateDislikes(board);
        return board;
    }
}
