package com.amazoonS3.mini.mapper;

import com.amazoonS3.mini.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user WHERE username = #{username}")
    User findByUsername(String username);

    @Insert("INSERT INTO user (username, email, password) VALUES (#{username}, #{email}, #{password})")
    void insert(User user);

    @Update("UPDATE user SET password = #{password} WHERE username = #{username}")
    void updatePassword(User user);
}
