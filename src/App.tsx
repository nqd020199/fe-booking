/* eslint-disable import/order */
import React, { Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import Authencation from 'pages/Authencation';
import './App.scss';
import Calendar from 'pages/Calendar';
import Setting from 'pages/Setting';
import OtherCalendar from 'pages/OtherCalendar';
import Error from 'pages/Error';
import UnderDevelop from 'pages/UnderDevelop';
import ComfirmSuccess from 'pages/ComfirmSuccess';
import './i18n';
import Loading from 'components/atoms/Loading';
import { QueryClient, QueryClientProvider } from 'react-query';
import { DEFAULT_QUERY_OPTION } from 'utils/constants';
import { Provider } from 'react-redux';
import { store } from 'store';
import Derpartment from 'pages/Derpartment';
import Messages from 'pages/Messages';

const routes = [
  {
    path: '/',
    element: <Calendar />,
  },
  {
    path: 'authen/:page',
    element: <Authencation />,
  },
  {
    path: 'setting',
    element: <Setting />,
  },
  {
    path: '/:userId/:departmentName',
    element: <OtherCalendar />,
  },
  {
    path: '/comming-soon/:name',
    element: <UnderDevelop />,
  },
  {
    path: '/authen/forgot/confirm',
    element: <ComfirmSuccess />,
  },
  {
    path: '/department',
    element: <Derpartment />,
  },
  {
    path: '/message',
    element: <Messages />
  },
  {
    path: '*',
    element: <Error />,
  },
];
const queryClient = new QueryClient({
  defaultOptions: {
    queries: DEFAULT_QUERY_OPTION
  }
});

const App: React.FC = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Loading variant="fullScreen" />}>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={`route-${index.toString()}`}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);

export default App;
