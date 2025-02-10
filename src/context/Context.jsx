
import axios from "axios";
import { createContext, useEffect, useState } from "react"


export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    const [tostMsg, SetTostMsg] = useState(null);
    const [Project, setProject] = useState([]);
    const [Projectparent, setProjectparent] = useState([])
    const [ProjectCategories, setProjectCategories] = useState([])
    const [ EditProjectCategory, setEditProjectCategory] = useState()
    const [EditProject, setEditProject] = useState()
    const [ProjectProduct, setProjectProduct] = useState([])
    const [EditProduct, setEditProduct] = useState([])
    const [ProductPlan, setProductPlan] = useState([])
    const [EditProductPlan, setEditProductPlan] = useState()
    const [loading, setloading] = useState(false);
 const data = {
    id:"678f4b3b9ae39dee56d2fa44",
    url:"http://152.42.237.126:4000"
 }
 
  // Fetch cities on component mount or when language changes
  const GetDetailProjectData = async () => {

    try {
        const response = await axios.get(`${data.url}/api/admin/detailproject`, {
            headers: {
                'Content-Type': 'application/json',
               
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
        const response = await axios.get(`${data.url}/api/admin/projectparent`, {
            headers: {
                'Content-Type': 'application/json',
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

    useEffect(() => {
        GetDetailProjectData();
        GetProjectParent();
        GetProjectCategories();
        GetProjectProduct();
        GetProductPlan();
        
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
    }
    return (
        <StoreContext.Provider value={ContextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider
