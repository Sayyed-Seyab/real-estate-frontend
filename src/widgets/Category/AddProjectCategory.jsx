import { StoreContext } from "@/context/context";
import { Typography } from "@material-tailwind/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function AddProjectCategory() {
    const { data, SetTostMsg, tostMsg, Projectparent } = useContext(StoreContext)
    const navigate = useNavigate()
    console.log(data)
    const [formData, setFormData] = useState({
        parentid:"",
        categoryimage: "",
        name: "",
        description: "",
        status: null,
        addedby: data.id,
    });
    const [PreviewImage, setPreviewImage] = useState()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name] : value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        console.log(file)
        if (file) {
            setFormData({
                ...formData,
                categoryimage: file,
            })
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        
    
        // Prepare FormData for file upload
        const uploadData = new FormData();
        uploadData.append("file", formData.categoryimage); // Ensure this matches your backend field
    
        try {
            // Upload the file first
            const uploadResponse = await axios.post(
                `${data.url}/api/admin/upload/category`,
                uploadData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
    
            console.log(uploadResponse);
    
            if (uploadResponse.data.success) {
                // Update formData with the uploaded file path
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    categoryimage: uploadResponse.data.file, // Save the file path/object
                }));
    
                // Send the updated formData to the backend
                const categoryResponse = await axios.post(
                    `${data.url}/api/admin/projectcategory`,
                    {
                        parentid: formData.parentid,
                        categoryimage: uploadResponse.data.file, // Send file path
                        name: formData.name,
                        description: formData.description,
                        status: formData.status,
                        addedby: formData.addedby,
                    },
                    { headers: { "Content-Type": "application/json" } }
                );
    
                console.log(categoryResponse);
    
                if (categoryResponse.data.success) {
                    SetTostMsg(categoryResponse.data.message);
               navigate('/dashboard/project-category')
                    
                } else {
                    toast.error(categoryResponse.data.message);
                }
            } else {
                toast.error(uploadResponse.data.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    
    useEffect(() => {
        console.log(formData)
    }, [formData])
    return (
        <div>
            <div className="w-full max-w-4xl m-2 mx-auto bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-center">Add Project Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-2 mb-4">
                        <Typography variant="small" className="font-medium">
                            Category Image
                        </Typography>
                        <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                            <input
                                type="file"
                                accept="image/*"
                                name="image"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <span className="text-gray-700">Choose a file</span>
                        </label>
                        {PreviewImage && (
                            <img
                                src={PreviewImage}
                                alt="Selected City"
                                className="mt-4  w-80 object-cover rounded-lg border"
                            />
                        )}
                    </div>

                     {/* cities */}
                     <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Select City:</label>
                                <select
                                    name="parentid"
                                    value={formData.parentid || ""} // Controlled value
                                    onChange={handleChange}
                                    className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                                    required
                                >
                                    <option className="text-gray-700" value="" disabled>
                                        Select Parent
                                    </option>
                                    {Projectparent.map((parent, index) => (
                                        <option key={index} value={parent._id}>
                                            {parent.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                    {/* Name Field */}
                    <div className="mb-4">

                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Category  Name
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
                            required
                        ></textarea>
                    </div>

                    {/* Status Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Category Status</label>
                        <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="status"
                                    value="true"
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
                                    value="false"
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
                            className="w-40 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )
}
