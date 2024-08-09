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
  TextContent,
} from '@cloudscape-design/components';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import { useNavigate } from 'react-router-dom';
import BoardContainer from './BoardContainer';

const LOCALE = 'en';

function AppLayoutPreview() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user authentication status and user info
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Add withCredentials: true to include cookies in the request
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/check-auth`, { withCredentials: true });
        console.log(response);
        if (response.data.authenticated) {
          setUser(response.data.username);
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

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/logout`);
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
              text: 'Service name',
            }}
            items={[{ type: 'link', text: `Page #1`, href: `#` }]}
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
              <h2>Welcome, {user || 'Guest'}!</h2>
              <BoardContainer />
            </TextContent>
            <SplitPanel header="Split panel header">Split panel content</SplitPanel>
          </ContentLayout>
        }
      />
    </I18nProvider>
  );
}

export default AppLayoutPreview;
