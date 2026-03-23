import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import Chatbot from "@/pages/Chatbot";
import CourseDetail from "@/pages/CourseDetail";
import Courses from "@/pages/Courses";
import EducatorClassroom from "@/pages/EducatorClassroom";
import EducatorPanel from "@/pages/EducatorPanel";
import Home from "@/pages/Home";
import Payment from "@/pages/Payment";
import Profile from "@/pages/Profile";
import RankPredictor from "@/pages/RankPredictor";
import Recordings from "@/pages/Recordings";
import StudentDashboard from "@/pages/StudentDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

const queryClient = new QueryClient();

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const coursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/courses",
  component: Courses,
});

const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/courses/$id",
  component: CourseDetail,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: StudentDashboard,
  beforeLoad: () => {
    const stored = localStorage.getItem("ii-identity");
    if (!stored) throw redirect({ to: "/" });
  },
});

const educatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/educator",
  component: EducatorPanel,
});

const educatorClassroomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/educator/classroom",
  component: EducatorClassroom,
});

const rankPredictorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rank-predictor",
  component: RankPredictor,
});

const chatbotRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chatbot",
  component: Chatbot,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment",
  component: Payment,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});

const recordingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recordings",
  component: Recordings,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  coursesRoute,
  courseDetailRoute,
  dashboardRoute,
  educatorRoute,
  educatorClassroomRoute,
  rankPredictorRoute,
  chatbotRoute,
  paymentRoute,
  profileRoute,
  recordingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
