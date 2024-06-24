import 'dayjs/locale/de';
import '@refinedev/antd/dist/reset.css';

import {
  DashboardOutlined,
  ProductOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  ErrorComponent,
  ThemedLayoutV2,
  useNotificationProvider,
} from '@refinedev/antd';
import type { IResourceItem } from '@refinedev/core';
import { Authenticated, Refine } from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools';
import { RefineKbarProvider } from '@refinedev/kbar';
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import { authProvider } from './authProvider';
import { Header, Title } from './components';
import { ConfigProvider } from './context';
import { useAutoLoginForDemo } from './hooks';
import { AuthPage } from './pages/auth';
import { BrandCreate, BrandEdit, BrandList, BrandShow } from './pages/brands';
import { CustomerList } from './pages/customers';
import { DashboardPage } from './pages/dashboard';
import {
  ProductCreate,
  ProductEdit,
  ProductList,
  ProductShow,
} from './pages/products';
import { dataProvider } from './rest-data-provider';

interface TitleHandlerOptions {
  resource?: IResourceItem;
}

const customTitleHandler = ({ resource }: TitleHandlerOptions): string => {
  const baseTitle = 'My Watch Store';
  const titleSegment = resource?.name;
  const title = titleSegment ? `${titleSegment} | ${baseTitle}` : baseTitle;
  return title;
};
const App: React.FC = () => {
  // This hook is used to automatically login the user.
  // We use this hook to skip the login page and demonstrate the application more quickly.
  const { loading } = useAutoLoginForDemo();

  const API_URL = import.meta.env.VITE_API_URL;

  const data = dataProvider(API_URL);

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, parameters: object) => t(key, parameters),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  if (loading) {
    return null;
  }

  return (
    <BrowserRouter>
      <ConfigProvider>
        <RefineKbarProvider>
          <DevtoolsProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={data}
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: 'vJyqp2-XpgDqf-5v0KTA',
              }}
              notificationProvider={useNotificationProvider}
              resources={[
                {
                  name: 'dashboard',
                  list: '/',
                  meta: {
                    label: 'Dashboard',
                    icon: <DashboardOutlined />,
                  },
                },
                {
                  name: 'members',
                  list: '/members',
                  meta: {
                    icon: <UserOutlined />,
                  },
                },
                {
                  name: 'watches',
                  list: '/watches',
                  create: '/watches/new',
                  edit: '/watches/:id/edit',
                  show: '/watches/:id',
                  meta: {
                    icon: <ProductOutlined />,
                  },
                },
                {
                  name: 'brands',
                  list: '/brands',
                  create: '/brands/new',
                  edit: '/brands/:id/edit',
                  show: '/brands/:id',
                  meta: {
                    icon: <TagsOutlined />,
                  },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-routes"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2 Header={Header} Title={Title}>
                        <div
                          style={{
                            maxWidth: '1200px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}
                        >
                          <Outlet />
                        </div>
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route index element={<DashboardPage />} />

                  <Route
                    path="/members"
                    element={
                      <CustomerList>
                        <Outlet />
                      </CustomerList>
                    }
                  ></Route>

                  <Route
                    path="/watches"
                    element={
                      <ProductList>
                        <Outlet />
                      </ProductList>
                    }
                  >
                    <Route path="new" element={<ProductCreate />} />
                    <Route path=":id" element={<ProductShow />} />
                    <Route path=":id/edit" element={<ProductEdit />} />
                  </Route>
                  <Route
                    path="/brands"
                    element={
                      <BrandList>
                        <Outlet />
                      </BrandList>
                    }
                  >
                    <Route path="new" element={<BrandCreate />} />
                    <Route path=":id" element={<BrandShow />} />
                    <Route path=":id/edit" element={<BrandEdit />} />
                  </Route>
                </Route>

                <Route
                  element={
                    <Authenticated key="auth-pages" fallback={<Outlet />}>
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route
                    path="/login"
                    element={
                      <AuthPage
                        type="login"
                        formProps={{
                          initialValues: {
                            email: 'admin@gmail.com',
                            password: '1234',
                          },
                        }}
                      />
                    }
                  />
                </Route>

                <Route
                  element={
                    <Authenticated key="catch-all">
                      <ThemedLayoutV2 Header={Header} Title={Title}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
              </Routes>
              <UnsavedChangesNotifier />
              <DocumentTitleHandler handler={customTitleHandler} />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </RefineKbarProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
