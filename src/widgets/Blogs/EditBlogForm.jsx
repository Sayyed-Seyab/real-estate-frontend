import { StoreContext } from "@/context/Context";
import { Typography } from "@material-tailwind/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BlogEditor from "../Quill/Quill";


export default function EditBlogForm() {
    const { data, SetTostMsg, tostMsg, Projectparent, setEditBlog, EditBlog } = useContext(StoreContext)
    const [Btnloading, setBtnloading] = useState(false)
    const [PreviewImage, setPreviewImage] = useState()
    const navigate = useNavigate()
    console.log(data)
    const [formData, setFormData] = useState({
        image: "",
        name: "",
        description: "",
        detaildesc:"",
        status: null,
        metatitle:"",
        metadesc:"",
        addedby: data.id,
    });


    useState(()=>{
        if(EditBlog){
            setFormData((prevFormData) => ({
                ...prevFormData,
                name: EditBlog.name || "",
                description: EditBlog.description || "", 
                detaildesc: EditBlog.detaildesc || "",
                status: EditBlog.status || "",
                addedby: EditBlog.addedby || data.id,
                metatitle: EditBlog.metatitle || "",
                metadesc: EditBlog.metadesc || "",
            }));
            setPreviewImage(`${data.url}/Images/blog/${EditBlog.image}` || null);
  
        }else{
            navigate("/dashboard/blogs")
        }
    },[])
    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name] : value,
        });
    };

    const handleDescChange = (value) =>{
      setFormData({
        ...formData,
        detaildesc: value
      })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        console.log(file)
        if (file) {
            setFormData({
                ...formData,
                image: file,
            })
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        
    
        // Prepare FormData for file upload
        const uploadData = new FormData();
        uploadData.append("file", formData.image); // Ensure this matches your backend field
    
        try {

            if (formData.image instanceof File) {
                console.log("New file selected, handling old image deletion, upload, and category update...");
    
                // Promise for deleting the old image
                const deleteOldImagePromise = axios.delete(
                    `${data.url}/api/admin/upload/blog/${EditBlog.image}`
                );
    
                // Promise for uploading the new image
                // Upload the file first
            const uploadNewImagePromise = await axios.post(
                `${data.url}/api/admin/upload/blog`,
                uploadData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
    
                // Execute promises for delete and upload in parallel
                const [deleteResponse, uploadResponse] = await Promise.all([
                    deleteOldImagePromise,
                    uploadNewImagePromise,
                ]);
    
                // Check results
                if (!deleteResponse.data.success) {
                    toast.error("Failed to delete the old image.");
                    return; // Stop if deletion fails
                }
    
                if (!uploadResponse.data.success) {
                    toast.error("Failed to upload the new image.");
                    return; // Stop if upload fails
                }
    
                console.log("Old image deleted and new image uploaded successfully");
                formData.image = uploadResponse.data.file; // Update file path in formData
            }


           
    
              setBtnloading(true)
                
               
    
                // Send the updated formData to the backend
                const BlogResponse = await axios.put(
                    `${data.url}/api/admin/blog/${EditBlog._id}`,
                    {
                        name: formData.name,
                        image: formData.image, // Send file path
                        description: formData.description,
                        detaildesc: formData.detaildesc,
                        status: formData.status,
                        metatitle: formData.metatitle,
                        metdesc: formData.metadesc,
                        addedby: formData.addedby,
                    },
                    { headers: { "Content-Type": "application/json" } }
                );
    
                console.log(BlogResponse);
    
                // if (BlogResponse.data.success) {
                //     SetTostMsg(BlogResponse.data.message);
                //     navigate('/dashboard/blogs')
                    
                // } else {
                //     toast.error(BlogResponse.data.message);
                // }
           
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    
    useEffect(() => {
        console.log(formData)
        console.log(formData.description)
    }, [formData])
    return (
        <div>
            <div className="w-full max-w-4xl m-2 mx-auto bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-center">Add Blog</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-2 mb-4">
                        <Typography variant="small" className="font-medium">
                            Blog Image
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
                                className="mt-4 h-100 w-60 object-cover rounded-lg border"
                            />
                        )}
                    </div>

                   
                    {/* Name Field */}
                    <div className="mb-4">

                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Blog  Name
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
                            <label htmlFor="metadesc" className="block text-sm font-medium text-gray-700">
                                Description
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

                    {/* Description Field */}
                    <div className="mb-4">
                      <BlogEditor handleChange={handleDescChange} detaildesc={formData.detaildesc}/>
                      
                       
                    </div>

                     {/* Meta Title Field */}
                     <div className="mb-4">
                            <label htmlFor="metatitle" className="block text-sm font-medium text-gray-700">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                id="metatitle"
                                name="metatitle"
                                value={formData.metatitle}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>


                     {/* Meta Description Field */}
                     <div className="mb-4">
                            <label htmlFor="metadesc" className="block text-sm font-medium text-gray-700">
                                Meta Description
                            </label>
                            <textarea
                                id="metadesc"
                                name="metadesc"
                                value={formData.metadesc}
                                onChange={handleChange}
                                rows="4"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>

                       

                    {/* Status Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Blog Status</label>
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
                           {Btnloading ? (
          <>
            <span className="mr-2">Loading...</span>
            <div className="flex items-center justify-center h-1">
        <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-blue-500 border-solid"></div>
      </div>
          </>
        ) : (
          "Submit"
        )}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )
}

