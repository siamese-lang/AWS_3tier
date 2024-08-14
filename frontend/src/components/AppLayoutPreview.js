'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AppLayout,
  BreadcrumbGroup,
  ContentLayout,
  Flashbar,
  Header,
  HelpPanel,
  Link,
  SideNavigation,
  SplitPanel,
  Button,
  TextContent
} from '@cloudscape-design/components';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import { useNavigate } from 'react-router-dom';
import BoardContainer from './BoardContainer';

import { fetchBoardItems } from '../api/board';
const LOCALE = 'en';

function AppLayoutPreview() {
  const [user, setUser] = useState(null);

  const [boardItems, setBoardItems] = useState([]);

  const navigate = useNavigate();

  const handleItemCreated = (newItem) => {
    setBoardItems(prevItems => [...prevItems, newItem]);
  };

  const handleItemDeleted = (deletedItemId) => {
    setBoardItems(prevItems => prevItems.filter(item => item.bidx !== deletedItemId));
  };
  // Fetch user authentication status and user info
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/check-auth`, { withCredentials: true });
        console.log('Authentication response:', response);
        if (response.data.authenticated) {
          setUser(response.data.username);
          console.log('User set:', response.data.username);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        navigate('/login');
      }
    };
  
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const loadBoardItems = async () => {
      try {
        const items = await fetchBoardItems();
        setBoardItems(items);
      } catch (error) {
        console.error('게시물 불러오기 실패:', error);
      }
    };
  
    loadBoardItems();
  }, []);

  const handleLikeUpdate = (updatedItem) => {
    setBoardItems(prevItems =>
      prevItems.map(item => item.bidx === updatedItem.bidx ? updatedItem : item)
        .sort((a, b) => ((b.likes || 0) - (b.dislikes || 0)) - ((a.likes || 0) - (a.dislikes || 0)))
    );
  };
  
  
  const handleDislikeUpdate = (updatedItem) => {
    setBoardItems(prevItems =>
      prevItems.map(item => item.bidx === updatedItem.bidx ? updatedItem : item)
        .sort((a, b) => ((b.likes || 0) - (b.dislikes || 0)) - ((a.likes || 0) - (a.dislikes || 0)))
    );
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: 'Home', href: '#' },
              { text: 'Service', href: '#' },
            ]}
          />
        }
        navigationOpen={true}
        navigation={
<SideNavigation
  header={{
    href: '#',
    text: '서비스 이름',
  }}
  items={[
    { 
      type: 'link', 
      text: '홈', 
      href: '#', 
      info: <Link variant="info" fontSize="body-s" fontWeight="bold">메인 페이지</Link> 
    },
    {
      type: 'section',
      text: '게시글 목록',
      items: boardItems
        .sort((a, b) => ((b.likes || 0) - (b.dislikes || 0)) - ((a.likes || 0) - (a.dislikes || 0)))
        .map((item, index) => ({
          type: 'link',
          text: (
            <div>
              <span style={{ fontWeight: 'bold', color: '#0073bb' }}>
                {index < 3 ? ['🥇', '🥈', '🥉'][index] : ''} {item.title}
              </span>
              <div>
                <span style={{ fontSize: '0.8em', color: '#687078' }}>
                  👍 인기도: {(item.likes || 0) - (item.dislikes || 0)}
                </span>
              </div>
              <hr style={{ margin: '8px 0', borderTop: '1px solid #e1e4e8' }} />
            </div>
          ),
          href: `#item-${item.bidx}`,
        })),
    },
  ]}
/>
        }
        notifications={
          <Flashbar
            items={[
              {
                type: 'info',
                dismissible: true,
                content: 'This is an info flash message.',
                id: 'message_1',
              },
            ]}
          />
        }
        toolsOpen={true}
        tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}
        content={
          <ContentLayout
            header={
              <Header
                variant="h1"
                info={<Link variant="info">Info</Link>}
                actions={
                  <Button onClick={handleLogout} variant="primary">
                    Logout
                  </Button>
                }
              >
                Page header
              </Header>
            }
          >
<TextContent>
  <h2>Welcome, {user || 'Guest'}님!</h2>
  <BoardContainer 
    onLikeUpdate={handleLikeUpdate} 
    onDislikeUpdate={handleDislikeUpdate}
    onItemCreated={handleItemCreated}
    onItemDeleted={handleItemDeleted}
    user={user}
  />
</TextContent>
            <SplitPanel header="Split panel header">Split panel content</SplitPanel>
          </ContentLayout>
        }
      />
    </I18nProvider>
  );
}

export default AppLayoutPreview;