import React, { useState, useEffect } from 'react';
import { Button, Form, FormField, Input } from '@cloudscape-design/components';

function UpdateItemForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(title, content);
  };

  return (
    <Form
      header={<h3>Update Item</h3>}
      actions={
        <>
          <Button variant="link" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Submit</Button>
        </>
      }
    >
      <FormField
        label="Title"
        description="Update the title of the item"
      >
        <Input
          value={title}
          onChange={(event) => setTitle(event.detail.value)}
        />
      </FormField>
      <FormField
        label="Content"
        description="Update the content of the item"
      >
        <Input
          value={content}
          onChange={(event) => setContent(event.detail.value)}
        />
      </FormField>
    </Form>
  );
}

export default UpdateItemForm;
