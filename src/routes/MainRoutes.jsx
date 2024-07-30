import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { element } from 'prop-types';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const QuestionScreen = Loadable(lazy(() => import('views/pages/question/index')));
const ExamScreen = Loadable(lazy(() => import('views/pages/exam')));
const RoomScreen = Loadable(lazy(() => import('views/pages/room')));
const ManageStudentcreen = Loadable(lazy(() => import('views/pages/manage-student')));
const RoomDetailScreen = Loadable(lazy(() => import('views/pages/room-detail')));
const ExamListScreen = Loadable(lazy(() => import('views/pages/exam-list')));
const ExamViewScreen = Loadable(lazy(() => import('views/pages/exam-view')));
const AccountListScreen = Loadable(lazy(() => import('views/pages/account-list')));
const SubjectChapterScreen = Loadable(lazy(() => import('views/pages/subject-chapter')));
const NotFound = Loadable(lazy(() => import('views/notfound')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'question',
      children: [
        {
          path: '',
          element: <QuestionScreen />
        }
      ]
    },
    {
      path: 'exam',
      children: [
        {
          path: '',
          element: <ExamListScreen />
        },
        {
          path: 'create',
          element: <ExamScreen />
        },
        {
          path: 'view/:id',
          element: <ExamViewScreen />
        }
      ]
    },
    {
      path: 'subject',
      children: [
        {
          path: '',
          element: <SubjectChapterScreen />
        }
      ]
    },
    {
      path: 'account',
      children: [
        {
          path: '',
          element: <AccountListScreen />
        }
      ]
    },
    {
      path: 'room',
      children: [
        {
          path: '',
          element: <RoomScreen />
        },
        {
          path: ':id',
          element: <RoomDetailScreen />
        }
      ]
    },
    {
      path: 'student',
      children: [
        {
          path: '',
          element: <ManageStudentcreen />
        }
      ]
    },
    {
      path: '*',
      element: <NotFound />
    }
    // {
    //   path: 'icons',
    //   children: [
    //     {
    //       path: 'tabler-icons',
    //       element: <UtilsTablerIcons />
    //     }
    //   ]
    // },
    // {
    //   path: 'icons',
    //   children: [
    //     {
    //       path: 'material-icons',
    //       element: <UtilsMaterialIcons />
    //     }
    //   ]
    // },
  ]
};

export default MainRoutes;
