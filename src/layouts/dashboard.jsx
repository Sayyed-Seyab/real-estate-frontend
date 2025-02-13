import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import AddProjectParent from "@/widgets/projectparent/AddProjectParent";
import AddProjectCategory from "@/widgets/Category/AddProjectCategory";
import UpdateProjectCategory from "@/widgets/Category/UpdateProjectCategory";
import AddProjectForm from "@/widgets/ProjectForms/AddProjectForm";
import UpdateProjectForm from "@/widgets/ProjectForms/UpdateProjectForm";
import AddProductForm from "@/widgets/product/AddProductForm";
import UpdateProductForm from "@/widgets/product/UpdateProductForm";
import AddProductPlan from "@/widgets/productplan/AddProductPlan";
import UpdateProductPlan from "@/widgets/productplan/UpdateProductPlan";
import BlogEditor from "@/widgets/Quill/Quill";
import AddBlog from "@/widgets/Blogs/AddBlogForm";
import EditBlogForm from "@/widgets/Blogs/EditBlogForm";


export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>

        <Routes>
        <Route path="/add-Project-Parent"  element={<AddProjectParent/>}  />
        <Route path="/add-project-category"  element={<AddProjectCategory/>}  />
        <Route path="/update-project-category"  element={<UpdateProjectCategory/>}  />
        <Route path="/Add-project"  element={<AddProjectForm/>}  />
        <Route path="/update-project"  element={<UpdateProjectForm/>}  />
        <Route path="/add-product"  element={<AddProductForm/>}  />
        <Route path="/update-product"  element={<UpdateProductForm/>}  />
        <Route path="/add-product-plan"  element={<AddProductPlan/>}  />
        <Route path="/update-product-plan"  element={<UpdateProductPlan/>}  />
        <Route path="/add-blog"  element={<AddBlog/>}/>
        <Route path="/update-blog"  element={<EditBlogForm/>}/>
        <Route path="/quill"  element={<BlogEditor/>}/>
        </Routes>

        {/* <div className="text-blue-gray-600">
          <Footer />
        </div> */}
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
