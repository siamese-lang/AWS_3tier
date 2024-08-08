import React, { useEffect, useState, useCallback } from 'react';
import { Container, Header, Button } from '@cloudscape-design/components';
import Board from "@cloudscape-design/board-components/board";
import BoardItem from "@cloudscape-design/board-components/board-item";
import NewItemForm from './NewItemForm';
import UpdateItemForm from './UpdateItemForm';
import { fetchBoardItems, createBoardItem, updateBoardItem, deleteBoardItem } from '../api/board';

function BoardContainer() {
  const [items, setItems] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetchBoardItems();
        if (Array.isArray(response)) {
          setItems(response);
        } else {
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    loadItems();
  }, []);

  const handleCreate = useCallback(async (newItem) => {
    try {
      const response = await createBoardItem(newItem);
      const createdItem = { ...newItem, ...response }; // Adjust based on actual API response
      setItems(prevItems => [...prevItems, createdItem]);
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  }, []);

  const handleUpdate = useCallback(async (item) => {
    try {
      if (!item.bidx) {
        console.error('Item ID (bidx) is missing.');
        return;
      }

      const response = await updateBoardItem(item);
      const updatedItem = response.data.data; // Assume response contains the updated item

      setItems(prevItems =>
        prevItems.map(i => i.bidx === item.bidx ? updatedItem : i)
      );
      setIsFormVisible(false);
      setIsEditing(false);
      setEditItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }, []);

  const handleDelete = useCallback(async (bidx) => {
    try {
      await deleteBoardItem(bidx);
      setItems(prevItems =>
        prevItems.filter(item => item.bidx !== bidx)
      );
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, []);

  const handleItemsChange = (event) => {
    const updatedItems = event.detail.items;
    setItems(updatedItems);

    updatedItems.forEach(item => {
      if (!item.bidx) {
        handleCreate({ ...item, rowSpan: 1, columnSpan: 2 });
      } else {
        handleUpdate(item);
      }
    });
  };

  const i18nStrings = {
    liveAnnouncementDndStarted: operationType =>
      operationType === "resize" ? "Resizing" : "Dragging",
    liveAnnouncementDndItemReordered: operation => {
      const columns = `column ${operation.placement.x + 1}`;
      const rows = `row ${operation.placement.y + 1}`;
      return createAnnouncement(
        `Item moved to ${operation.direction === "horizontal" ? columns : rows}.`,
        operation.conflicts,
        operation.disturbed
      );
    },
    liveAnnouncementDndItemResized: operation => {
      const columnsConstraint = operation.isMinimalColumnsReached ? " (minimal)" : "";
      const rowsConstraint = operation.isMinimalRowsReached ? " (minimal)" : "";
      const sizeAnnouncement =
        operation.direction === "horizontal"
          ? `columns ${operation.placement.width}${columnsConstraint}`
          : `rows ${operation.placement.height}${rowsConstraint}`;
      return createAnnouncement(
        `Item resized to ${sizeAnnouncement}.`,
        operation.conflicts,
        operation.disturbed
      );
    },
    liveAnnouncementDndItemInserted: operation => {
      const columns = `column ${operation.placement.x + 1}`;
      const rows = `row ${operation.placement.y + 1}`;
      return createAnnouncement(
        `Item inserted to ${columns}, ${rows}.`,
        operation.conflicts,
        operation.disturbed
      );
    },
    liveAnnouncementDndCommitted: operationType => `${operationType} committed`,
    liveAnnouncementDndDiscarded: operationType => `${operationType} discarded`,
    liveAnnouncementItemRemoved: op =>
      createAnnouncement(
        `Removed item ${op.item.title || 'No Title'}.`,
        [],
        op.disturbed
      ),
    navigationAriaLabel: "Board navigation",
    navigationAriaDescription: "Click on non-empty item to move focus over",
    navigationItemAriaLabel: item => item ? item.title : "Empty"
  };

  function createAnnouncement(operationAnnouncement, conflicts, disturbed) {
    const conflictsAnnouncement =
      conflicts.length > 0
        ? `Conflicts with ${conflicts.map(c => c.title).join(", ")}.`
        : "";
    const disturbedAnnouncement =
      disturbed.length > 0
        ? `Disturbed ${disturbed.length} items.`
        : "";
    return [operationAnnouncement, conflictsAnnouncement, disturbedAnnouncement]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <Container
      header={
        <Header variant="h2" description="Container description">
          Container header
          <Button onClick={() => { setIsFormVisible(true); setEditItem(null); }}>Add Item</Button>
        </Header>
      }
    >
      {isFormVisible && (
        isEditing ? (
          <UpdateItemForm
            initialData={editItem}
            onCancel={() => {
              setIsFormVisible(false);
              setEditItem(null);
              setIsEditing(false);
            }}
            onSubmit={(title, content) => handleUpdate({ ...editItem, title, content })}
          />
        ) : (
          <NewItemForm
            onCancel={() => {
              setIsFormVisible(false);
              setEditItem(null);
            }}
            onSubmit={(title, content) => handleCreate({ rowSpan: 1, columnSpan: 2, title, content })}
          />
        )
      )}
      <Board
        renderItem={item => (
          <BoardItem
            key={item.bidx}
            header={<Header>{item.title || 'No Title'}</Header>}
            i18nStrings={i18nStrings}
          >
            <div>
              {item.content || 'No Content'}
              <Button onClick={() => {
                setEditItem(item);
                setIsFormVisible(true);
                setIsEditing(true);
              }}>
                Edit
              </Button>
              <Button onClick={() => handleDelete(item.bidx)}>Delete</Button>
            </div>
          </BoardItem>
        )}
        onItemsChange={handleItemsChange}
        items={items} // Directly use items as an array
        i18nStrings={i18nStrings}
      />
    </Container>
  );
}

export default BoardContainer;
