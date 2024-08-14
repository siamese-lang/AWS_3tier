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

import { fetchBoardItems, fetchVersion } from '../api/board';
const LOCALE = 'en';

function AppLayoutPreview() {
  const [user, setUser] = useState(null);

  const [boardItems, setBoardItems] = useState([]);
  const [version, setVersion] = useState(null);
  const navigate = useNavigate();
  const [toolsOpen, setToolsOpen] = useState(true);

  const handleItemCreated = (newItem) => {
    setBoardItems(prevItems => [...prevItems, newItem]);
  };

  const handleItemDeleted = (deletedItemId) => {
    setBoardItems(prevItems => prevItems.filter(item => item.bidx !== deletedItemId));
  };

  const toggleHelpPanel = () => {
    setToolsOpen(!toolsOpen);
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

  useEffect(() => {
    const loadVersion = async () => {
      try {
        const versionInfo = await fetchVersion();
        setVersion(versionInfo);
      } catch (error) {
        console.error('버전 정보 로딩 실패:', error);
      }
    };

    loadVersion();
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
                //content: `React Version: v1             Spring Boot Version: ${version || '로딩 중...'}`,
                content: <div>React Version: v1<br />Spring Boot Version: {version || '로딩 중...'}</div>,
                id: 'version_info',
              },
            ]}
          />
        }
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        tools={
          <HelpPanel header={<h2>개요</h2>}>
            <p>
              이 애플리케이션은 사용자가 게시물을 생성, 수정, 삭제할 수 있는 게시판 시스템입니다.
            </p>
            <p>
              주요 기능:
            </p>
            <ul>
              <li>게시물 작성</li>
              <li>게시물 수정 및 삭제</li>
              <li>좋아요/싫어요 기능</li>
            </ul>
            <p>
              더 자세한 정보나 도움이 필요하시면 관리자에게 문의해주세요.
            </p>
          </HelpPanel>
        }
        content={
          <ContentLayout
            header={
              <Header
                variant="h1"
                info={<Link variant="info">Info</Link>}
                actions={
                  <>
                    <Button onClick={toggleHelpPanel} variant="normal" className="board-container-button">
                      도움말
                    </Button>
                    <Button onClick={handleLogout} variant="primary" className="board-container-button">
                      로그아웃
                    </Button>
                  </>
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