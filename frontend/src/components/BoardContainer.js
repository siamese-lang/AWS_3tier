import React, { useEffect, useState, useCallback } from 'react';
import { Container, Header, Button } from '@cloudscape-design/components';
import Board from "@cloudscape-design/board-components/board";
import BoardItem from "@cloudscape-design/board-components/board-item";
import NewItemForm from './NewItemForm';
import UpdateItemForm from './UpdateItemForm';
import { fetchBoardItems, createBoardItem, updateBoardItem, deleteBoardItem } from '../api/board';
import axios from 'axios';

function BoardContainer({onLikeUpdate, onDislikeUpdate, onItemCreated, onItemDeleted, user}) {
  console.log('BoardContainer received user:', user);
  const [items, setItems] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetchBoardItems();
        if (Array.isArray(response)) {
          setItems(response.map(item => ({...item, likes: item.likes || 0})));
        } else {
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    loadItems();
  }, []);

  const handleLike = useCallback(async (item) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/board/${item.bidx}/likes`, {
        likes: (item.likes || 0) + 1
      }, { withCredentials: true });
      const updatedItem = response.data.data;
      setItems(prevItems =>
        prevItems.map(i => i.bidx === item.bidx ? {...i, likes: updatedItem.likes} : i)
      );
      onLikeUpdate(updatedItem);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  }, [onLikeUpdate]);
  
  const handleDislike = useCallback(async (item) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/board/${item.bidx}/dislikes`, {
        dislikes: (item.dislikes || 0) + 1
      }, { withCredentials: true });
      const updatedItem = response.data.data;
      setItems(prevItems =>
        prevItems.map(i => i.bidx === item.bidx ? {...i, dislikes: updatedItem.dislikes} : i)
      );
      onDislikeUpdate(updatedItem);
    } catch (error) {
      console.error('Error updating dislikes:', error);
    }
  }, [onDislikeUpdate]);

  const handleCreate = useCallback(async (newItem) => {
    try {
      const response = await createBoardItem(newItem);
      const createdItem = { ...response, likes: response.likes || 0, dislikes: response.dislikes || 0 };
      setItems(prevItems => [...prevItems, createdItem]);
      setIsFormVisible(false);
      onItemCreated(createdItem);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  }, [onItemCreated]);
  
  const handleUpdate = useCallback(async (updatedItem) => {
    try {
      if (!updatedItem || !updatedItem.bidx) {
        console.error('Item ID (bidx) is missing.');
        return;
      }
      
      console.log('Updating item:', updatedItem);
      const serverUpdatedItem = await updateBoardItem(updatedItem);
      console.log('Server updated item:', serverUpdatedItem);
  
      setItems(prevItems =>
        prevItems.map(i => i.bidx === updatedItem.bidx ? {...i, ...updatedItem, ...serverUpdatedItem} : i)
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
      onItemDeleted(bidx);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, [onItemDeleted]);

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
          <Button onClick={() => { setIsFormVisible(true); setIsEditing(false); setEditItem(null); }}>Add Item</Button>
        </Header>
      }
    >
{isFormVisible && (
  isEditing ? (
<UpdateItemForm
  initialData={editItem}
  onSubmit={(updatedData) => {
    console.log('Updated data:', updatedData);
    handleUpdate({...editItem, ...updatedData});
  }}
  onCancel={() => { setIsFormVisible(false); setIsEditing(false); setEditItem(null); }}
  user={user}
/>
  ) : (
    <NewItemForm
      onSubmit={handleCreate}
      onCancel={() => setIsFormVisible(false)}
      user = {user}
    />
  )
)}
      <Board
renderItem={(item) => (
  <BoardItem
    key={item.bidx}
    header={<Header variant="h3">{item.title || 'No Title'}</Header>}
    i18nStrings={i18nStrings}
    columnSpan={1}
  >
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, marginBottom: '10px', fontSize: '14px', color: '#333' }}>
        {item.content || 'No Content'}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>

<Button 
  onClick={() => handleLike(item)}
  variant="icon"
  iconName="thumbs-up"
>
  {item.likes > 0 ? item.likes : ''}
</Button>

<Button 
  onClick={() => handleDislike(item)}
  variant="icon"
  iconName="thumbs-down"
>
  {item.dislikes > 0 ? item.dislikes : ''}
</Button>

        </div>
        <div>
          <Button 
            onClick={() => {
              setEditItem(item);
              setIsFormVisible(true);
              setIsEditing(true);
            }}
            variant="normal"
          >
            Edit
          </Button>
          <Button 
            onClick={() => handleDelete(item.bidx)}
            variant="normal"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  </BoardItem>
)}
        onItemsChange={handleItemsChange}
        items={items}
        i18nStrings={i18nStrings}
        columnDefinitions={[{ width: 1 }, { width: 1 }]}
      />
    </Container>
  );
}

export default BoardContainer;
