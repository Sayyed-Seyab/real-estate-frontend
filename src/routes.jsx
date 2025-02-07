import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import ParentProject from "./pages/dashboard/ParentProject";
import ProjectCategory from "./pages/dashboard/ProjectCategory";
import Project from "./pages/dashboard/Project";
import Product from "./pages/dashboard/Product";
import AddProductPlan from "./widgets/productplan/AddProductPlan";
import ProductPlan from "./pages/dashboard/ProductPlan";



const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
    ],
  },

   {
    title: "Manage Project",
    layout: "dashboard",
    pages: [
      {
        icon:"",
        name: "Project Parent",
        path: "/parent-project",
        element: <ParentProject />,
      },
      {
        icon:"",
        name: "Project Category",
        path: "/project-category",
        element: <ProjectCategory />,
      },
      {
        icon:"",
        name: "Projects",
        path: "/project",
        element: <Project />,
      },
      {
        icon:"",
        name: "Products",
        path: "/product",
        element: <Product />,
      },
      {
        icon:"",
        name: "Product plans",
        path: "/productplans",
        element: <ProductPlan />,
      },
    ],
   },

  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <RectangleStackIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
