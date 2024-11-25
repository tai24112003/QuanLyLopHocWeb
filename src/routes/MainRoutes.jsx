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
const QuestionScreen = Loadable(lazy(() => import('views/pages/question/index')));
const ExamScreen = Loadable(lazy(() => import('views/pages/exam')));
const RoomScreen = Loadable(lazy(() => import('views/pages/room')));
const ManageStudentScreen = Loadable(lazy(() => import('views/pages/manage-student')));
const RoomDetailScreen = Loadable(lazy(() => import('views/pages/room-detail')));
const ExamListScreen = Loadable(lazy(() => import('views/pages/exam-list')));
const ExamViewScreen = Loadable(lazy(() => import('views/pages/exam-view')));
const AccountListScreen = Loadable(lazy(() => import('views/pages/account-list')));
const MaintainScreen = Loadable(lazy(() => import('views/pages/maintain')));
const DetailMaintainScreen = Loadable(lazy(() => import('views/pages/detail-session')));
const HistoryComputerScreen = Loadable(lazy(() => import('views/pages/history-computer')));
const SubjectChapterScreen = Loadable(lazy(() => import('views/pages/subject-chapter')));
const NotFound = Loadable(lazy(() => import('views/NotFound')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const AuthRoomScreen = withAuth(onlyMaintain(RoomScreen));
const AuthManageStudentScreen = withAuth(ManageStudentScreen);
const AuthRoomDetailScreen = withAuth(onlyMaintain(RoomDetailScreen));
const AuthAccountListScreen = withAuth(onlyAdmin(AccountListScreen));
const AuthMaintainScreen = withAuth(onlyMaintain(MaintainScreen));
const AuthDetailMaintainScreen = withAuth(onlyMaintain(DetailMaintainScreen));
const AuthHistoryComputerScreen = withAuth(onlyMaintain(HistoryComputerScreen));
const AuthDashboardDefault = withAuth(onlyAdmin(DashboardDefault));
const AuthNotFound = withAuth(NotFound);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <AuthDashboardDefault />
    },
    // {
    //   path: 'question',
    //   children: [
    //     {
    //       path: '',
    //       element: <AuthQuestionScreen />
    //     }
    //   ]
    // },
    // {
    //   path: 'exam',
    //   children: [
    //     {
    //       path: '',
    //       element: <AuthExamListScreen />
    //     },
    //     {
    //       path: 'create',
    //       element: <AuthExamScreen />
    //     },
    //     {
    //       path: 'view/:id',
    //       element: <AuthExamViewScreen />
    //     }
    //   ]
    // },
    // {
    //   path: 'subject',
    //   children: [
    //     {
    //       path: '',
    //       element: <AuthSubjectChapterScreen />
    //     }
    //   ]
    // },
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
