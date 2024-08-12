package com.amazoonS3.mini.mapper;

import com.amazoonS3.mini.model.Board;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BoardMapper {

    List<Board> getAll();

    void insertBoard(Board board);

    void updateBoard(Board board);

    Board getBoardById(int bIdx);

    void deleteBoard(int bIdx);

    void updateLikes(Board board);
    void updateDislikes(Board board);
}
