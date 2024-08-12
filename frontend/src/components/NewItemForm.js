import React, { useState } from 'react';
import { Button, Form, FormField, Input } from '@cloudscape-design/components';

function NewItemForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ title, content });
  };

  return (
    <Form
      header={<h3>Add New Item</h3>}
      actions={
        <>
          <Button variant="link" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Submit</Button>
        </>
      }
    >
      <FormField
        label="Title"
        description="Enter the title of the new item"
      >
        <Input
          value={title}
          onChange={(event) => setTitle(event.detail.value)}
        />
      </FormField>
      <FormField
        label="Content"
        description="Enter the content of the new item"
      >
        <Input
          value={content}
          onChange={(event) => setContent(event.detail.value)}
        />
      </FormField>
    </Form>
  );
}

export default NewItemForm;
