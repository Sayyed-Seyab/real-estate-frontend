
import axios from "axios";
import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify";


export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    const [tostMsg, SetTostMsg] = useState(null);
    const [Project, setProject] = useState([]);
    const [Projectparent, setProjectparent] = useState([])
    const [ProjectCategories, setProjectCategories] = useState([])
    const [EditProjectCategory, setEditProjectCategory] = useState()
    const [EditProject, setEditProject] = useState()
    const [ProjectProduct, setProjectProduct] = useState([])
    const [EditProduct, setEditProduct] = useState()
    const [ProductPlan, setProductPlan] = useState([])
    const [EditProductPlan, setEditProductPlan] = useState()
    const [Blogs, setBlogs] = useState([])
    const [EditBlog, setEditBlog] = useState([])
    const [loading, setloading] = useState(false);
    const [Editparent, setEditParent] = useState();
    const [Isloading, setIsloading] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [Token, setToken] = useState(null)
    const data = {
        id: adminData?.id,
        url: "https://hpapi.stashtechnologies.com"//connectin
    }
    //  152.42.237.126
    // sub diomain https://hpapi.stashtechnologies.com
    // Fetch cities on component mount or when language changes


    useEffect(() => {
            const fetchAdminData = async () => {
                try {
                    const token = localStorage.getItem("token");
                    console.log(token)
                    setToken(token)
                    if (!token) {
                        toast.error("Session expired! Please log in again.");
                        return;
                    }
    
                    const response = await axios.get(`${data.url}/api/admin/admin`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log(response)
    
                    setAdminData(response.data.message);
                } catch (err) {
                    if (err.response && err.response.status === 401) {
                        toast.error("Session expired! Please log in again.");
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    } else {
                        toast.error("Failed to fetch admin data");
                    }
                }
            };
    
            fetchAdminData();
        }, [Token]);
        console.log(adminData)
        console.log(Token)

        
    const GetDetailProjectData = async () => {

        try {
            const response = await axios.get(`${data.url}/api/admin/detailproject`, {
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${Token}`

                },
                withCredentials: true, // Enable credentials
            });

            // Safely handle the response
            const rawData = Array.isArray(response.data.message) ? response.data.message : [];

            if (rawData.length === 0) {
                setProject([]); // Reset cities state to empty if no data
                setloading(false)
                return; // Exit early if no data
            }

            setProject(rawData); // Processed data for selected language
            setloading(false)
        } catch (error) {
            console.error("Error fetching cities:", error);
            setProject([]); // Reset cities state in case of an error
        }
    };


    const GetProjectCategories = async () => {

        try {
            const response = await axios.get(`${data.url}/api/admin/projectcategories`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Token}`
                },
                
                withCredentials: true, // Enable credentials
            });

            // Safely handle the response
            const rawData = Array.isArray(response.data.message) ? response.data.message : [];

            if (rawData.length === 0) {
                setProjectCategories([]); // Reset cities state to empty if no data
                setloading(false)
                return; // Exit early if no data
            }

            setProjectCategories(rawData); // Processed data for selected language
            setloading(false)
        } catch (error) {
            console.error("Error fetching cities:", error);
            setProjectCategories([]); // Reset cities state in case of an error
        }
    };


    const GetProjectProduct = async () => {

        try {
            const response = await axios.get(`${data.url}/api/admin/products`, {
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            });

            // Safely handle the response
            const rawData = Array.isArray(response.data.message) ? response.data.message : [];

            if (rawData.length === 0) {
                setProjectProduct([]); // Reset cities state to empty if no data
                setloading(false)
                return; // Exit early if no data
            }

            setProjectProduct(rawData); // Processed data for selected language
            setloading(false)
        } catch (error) {
            console.error("Error fetching products:", error);
            setProjectProduct([]); // Reset cities state in case of an error
        }
    };

    const GetProductPlan = async () => {

        try {
            const response = await axios.get(`${data.url}/api/admin/productplans`, {
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            });

            // Safely handle the response
            const rawData = Array.isArray(response.data.message) ? response.data.message : [];

            if (rawData.length === 0) {
                setProductPlan([]); // Reset cities state to empty if no data
                setloading(false)
                return; // Exit early if no data
            }

            setProductPlan(rawData); // Processed data for selected language
            setloading(false)
        } catch (error) {
            console.error("Error fetching product plan:", error);
            setProductPlan([]); // Reset cities state in case of an error
        }
    };




    const GetProjectParent = async () => {

        try {
             const token = localStorage.getItem("token");
            const response = await axios.get(`${data.url}/api/admin/projectparent`, {
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            });

            // Safely handle the response
            const rawData = Array.isArray(response.data.message) ? response.data.message : [];

            if (rawData.length === 0) {
                setProjectparent([]); // Reset cities state to empty if no data
                setloading(false)
                return; // Exit early if no data
            }

            setProjectparent(rawData); // Processed data for selected language
            setloading(false)
        } catch (error) {
            console.error("Error fetching project parent:", error);
            setProjectparent([]); // Reset cities state in case of an error
        }
    };


    const GetBlogs = async () => {

        try {
            const response = await axios.get(`${data.url}/api/admin/blog`, {
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            });

            // Safely handle the response
            const rawData = Array.isArray(response.data.message) ? response.data.message : [];

            if (rawData.length === 0) {
                setBlogs([]); // Reset cities state to empty if no data
                setloading(false)
                return; // Exit early if no data
            }

            setBlogs(rawData); // Processed data for selected language
            setloading(false)
        } catch (error) {
            console.error("Error fetching project parent:", error);
            setBlogs([]); // Reset cities state in case of an error
        }
    };

       

    useEffect(() => {
        GetDetailProjectData();
        GetProjectParent();
        GetProjectCategories();
        GetProjectProduct();
        GetProductPlan();
        GetBlogs();

    }, [])



    const ContextValue = {
        data,
        Project,
        loading,
        setloading,
        SetTostMsg,
        tostMsg,
        GetDetailProjectData,
        Projectparent,
        GetProjectParent,
        ProjectCategories,
        GetProjectCategories,
        EditProjectCategory,
        setEditProjectCategory,
        EditProject,
        setEditProject,
        ProjectProduct,
        GetProjectProduct,
        EditProduct,
        setEditProduct,
        ProductPlan,
        GetProductPlan,
        EditProductPlan,
        setEditProductPlan,
        GetBlogs,
        Blogs,
        setBlogs,
        setEditBlog,
        EditBlog,
        Editparent,
        setEditParent,
        Isloading,
        setIsloading,
        adminData,
        setAdminData,
        Token,
        setToken,
    }
    return (
        <StoreContext.Provider value={ContextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider