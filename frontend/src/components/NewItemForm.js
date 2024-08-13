import React, { useState } from 'react';
import { Button, Form, FormField, Input } from '@cloudscape-design/components';

function NewItemForm({ onSubmit, onCancel, user }) {
  console.log('NewItemForm received user:', user);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ title, content, username: user });
  };

  return (
    <Form
      header={<h3>새 아이템 추가</h3>}
      actions={
        <>
          <Button variant="link" onClick={onCancel}>취소</Button>
          <Button variant="primary" onClick={handleSubmit}>제출</Button>
        </>
      }
    >
      <FormField
        label="제목"
        description="새 아이템의 제목을 입력하세요"
      >
        <Input
          value={title}
          onChange={(event) => setTitle(event.detail.value)}
        />
      </FormField>
      <FormField
        label="내용"
        description="새 아이템의 내용을 입력하세요"
      >
        <Input
          value={content}
          onChange={(event) => setContent(event.detail.value)}
        />
      </FormField>
      <FormField
        label="작성자"
        description="현재 로그인한 사용자"
      >
        <Input
          value={user || '게스트'}
          disabled
        />
      </FormField>
    </Form>
  );
}

export default NewItemForm;