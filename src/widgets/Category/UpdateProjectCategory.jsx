import { StoreContext } from "@/context/Context";
import { Typography } from "@material-tailwind/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";

export default function UpdateProjectCategory() {
    const { data, Token, SetTostMsg, EditProjectCategory, GetProjectParent, setEditProjectCategory, Projectparent,  Isloading, setIsloading } = useContext(StoreContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        parentid: "",
        categoryimage: null,
        name: "",
        description: "",
        status: null,
        lasteditby: data.id,
        addedby: data.id,
    });

    const [PreviewImage, setPreviewImage] = useState("");

    // Prefill form if EditProjectCategory is provided
    useEffect(() => {
        if (EditProjectCategory) {
            GetProjectParent()
            setFormData((prevFormData) => ({
                ...prevFormData,
                parentid: EditProjectCategory.parentid || "",
                alt: EditProjectCategory.alt || "",
                name: EditProjectCategory.name || "",
                description: EditProjectCategory.description || "",
                status: EditProjectCategory.status !== undefined ?  EditProjectCategory.status : true ,
                addedby: EditProjectCategory.addedby || data.id,
                categoryimage: null, // Set null to allow new uploads
            }));

            setPreviewImage(`${data.url}/Images/category/${EditProjectCategory.categoryimage}` || null);
        } else {
            navigate("/dashboard/project-category"); // Redirect if no data is available for editing
        }
    }, [EditProjectCategory, data.url, navigate]);

console.log(formData)
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("Updating field:", name, "with value:", value); // Log for debugging
        setFormData({
            ...formData,
            [name]: value === "true" ? true : value === "false" ? false : value,
        });
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                categoryimage: file,
            });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);

    try {
        let newImagePath = formData.categoryimage;
        const uploadData = new FormData();

        // 1️⃣ CHECK IF A NEW IMAGE IS SELECTED
        if (formData.categoryimage instanceof File) {
            uploadData.append("file", formData.categoryimage);

            // If there is an old image, delete it first
            if (EditProjectCategory?.categoryimage) {
                console.log("Old image exists, deleting before uploading new one...");
                
                await axios
                    .delete(`${data.url}/api/admin/upload/category/${EditProjectCategory.categoryimage}`, {
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            })
                    .then((response) => {
                        if (!response.data.success) {
                            toast.error("Failed to delete old image.");
                             setIsloading(false)
                            throw new Error("Old image deletion failed");
                            
                        }
                        console.log("Old image deleted successfully");
                    })
                    .catch((error) => console.error("Error deleting old image:", error));
            }

            // 2️⃣ UPLOAD NEW IMAGE
            console.log("Uploading new image...");
            await axios
                .post(`${data.url}/api/admin/upload/category`, uploadData, {
                headers: {
                  
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            })
                .then((response) => {
                    if (!response.data.success) {
                        toast.error("Image upload failed.");
                         setIsloading(false)
                        throw new Error("Image upload failed");
                    }
                    console.log("New image uploaded successfully");
                    newImagePath = response.data.file; // Set new image path
                })
                .catch((error) => console.error("Error uploading new image:", error));
        }

        // 3️⃣ UPDATE CATEGORY WITH NEW OR EXISTING IMAGE
        const updateResponse = await axios.put(
            `${data.url}/api/admin/projectcategory/${EditProjectCategory._id}`,
            { ...formData, categoryimage: newImagePath }, {
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            }
        );

        if (updateResponse.data.success) {
            toast.success("Category updated successfully!");
            setEditProjectCategory(null);
            navigate("/dashboard/project-category");
        } else {
            toast.error(updateResponse.data.message);
             setIsloading(false)
        }
    } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while updating the category.");
         setIsloading(false)
    } finally {
        setIsloading(false);
    }
};

    

    return (
        <div>
            { Isloading ? (
                <Loader/>
            ):(
                 <div className="w-full max-w-4xl m-2 mx-auto bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-center">Update Project Category</h2>
                <form onSubmit={handleSubmit}>
                    {/* Category Image */}
                    <div className="space-y-2 mb-4">
    <Typography variant="small" className="font-medium">
        Category Image
    </Typography>
    <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
        <input
            type="file"
            accept="image/*"
            name="categoryimage"
            onChange={handleImageChange}
            className="hidden"
        />
        <span className="text-gray-700">Choose a file</span>
    </label>

    {PreviewImage && (
        <div> {/* Wrapped in a div to prevent JSX error */}
            <img
                src={PreviewImage}
                alt="Preview"
                className="mt-4 w-80 object-cover rounded-lg border"
            />
            <input
                type="text"
                placeholder="Enter alt text"
                name="alt"
                value={formData.alt}
                onChange={handleChange}
                className="mt-2 w-80 px-2 py-1 border rounded-md"
            />
        </div>
    )}
</div>


                    {/* Parent ID Dropdown */}
                    <div className="form-group">
                        <label className="block text-gray-700 font-medium mb-2">Select Parent Project* :</label>
                        <select
                            name="parentid"
                            value={formData.parentid || ""}
                            onChange={handleChange}
                            className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                            required
                        >
                            <option value="" disabled>Select Parent</option>
                            {Projectparent.map((parent) => (
                                <option key={parent._id} value={parent._id}>
                                    {parent.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Name Field */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Category Name*
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Description Field */}
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Category Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                           
                        ></textarea>
                    </div>

                    {/* Status Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Project Status*</label>
                        <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="status"
                                    value={true}
                                    checked={formData.status === true}
                                    onChange={() => setFormData({ ...formData, status: true })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Active</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="status"
                                    value={false}
                                    checked={formData.status === false}
                                    onChange={() => setFormData({ ...formData, status: false })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Inactive</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className=" bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Update Category
                        </button>
                    </div>
                </form>
            </div>
            )}
           
        </div>
    );
}
