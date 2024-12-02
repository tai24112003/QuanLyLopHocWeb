import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { element } from 'prop-types';
import withAuth from 'utils/hoc/withAuth.jsx';
import onlyAdmin from 'utils/hoc/onlyAdmin';
import onlyMaintain from 'utils/hoc/onlyMaintain';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const RoomScreen = Loadable(lazy(() => import('views/pages/room')));
const ManageStudentScreen = Loadable(lazy(() => import('views/pages/manage-student')));
const RoomDetailScreen = Loadable(lazy(() => import('views/pages/room-detail')));
const AccountListScreen = Loadable(lazy(() => import('views/pages/account-list')));
const MaintainScreen = Loadable(lazy(() => import('views/pages/maintain')));
const DetailMaintainScreen = Loadable(lazy(() => import('views/pages/detail-session')));
const HistoryComputerScreen = Loadable(lazy(() => import('views/pages/history-computer')));
const ProfilePage = Loadable(lazy(() => import('views/pages/my-account')));
const ClassScreen = Loadable(lazy(() => import('views/pages/class')));
const NotFound = Loadable(lazy(() => import('views/NotFound')));

// sample page routing
const AuthRoomScreen = withAuth(onlyMaintain(RoomScreen));
const AuthCLassScreen = withAuth(ClassScreen);
const AuthManageStudentScreen = withAuth(ManageStudentScreen);
const AuthRoomDetailScreen = withAuth(onlyMaintain(RoomDetailScreen));
const AuthAccountListScreen = withAuth(onlyAdmin(AccountListScreen));
const AuthMaintainScreen = withAuth(onlyMaintain(MaintainScreen));
const AuthDetailMaintainScreen = withAuth(onlyMaintain(DetailMaintainScreen));
const AuthHistoryComputerScreen = withAuth(onlyMaintain(HistoryComputerScreen));
const AuthDashboardDefault = withAuth(onlyAdmin(DashboardDefault));
const AuthNotFound = withAuth(NotFound);
const AuthProfilePage = withAuth(ProfilePage);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <AuthManageStudentScreen />
    },
    {
      path: 'account',
      children: [
        {
          path: '',
          element: <AuthAccountListScreen />
        }
      ]
    },
    {
      path: 'my-account',
      children: [
        {
          path: '',
          element: <AuthProfilePage />
        }
      ]
    },
    {
      path: 'room',
      children: [
        {
          path: '',
          element: <AuthRoomScreen />
        },
        {
          path: ':id',
          element: <AuthRoomDetailScreen />
        }
      ]
    },
    {
      path: 'class',
      children: [
        {
          path: '',
          element: <AuthCLassScreen />
        }
      ]
    },
    {
      path: 'maintain',
      children: [
        {
          path: '',
          element: <AuthMaintainScreen />
        },
        {
          path: ':id',
          element: <AuthDetailMaintainScreen />
        }
      ]
    },
    {
      path: 'history',
      children: [
        {
          path: ':id',
          element: <AuthHistoryComputerScreen />
        }
      ]
    },
    {
      path: 'student',
      children: [
        {
          path: '',
          element: <AuthManageStudentScreen />
        }
      ]
    },
    {
      path: '*',
      element: <AuthNotFound />
    }
  ]
};

export default MainRoutes;
