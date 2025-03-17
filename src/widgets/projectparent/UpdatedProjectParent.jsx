import { StoreContext } from "@/context/Context";
import { Typography } from "@material-tailwind/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";


export default function UpdateProjectParent() {
    const {data, Token, SetTostMsg, tostMsg,  Editparent, setEditParent, Isloading, setIsloading} = useContext(StoreContext)
    const navigate = useNavigate()
    console.log(data)
    const [formData, setFormData] = useState({
        name: "",
        img:"",
        alt:"",
        description: "",
        status: null,
         lasteditby: data.id,
        addedby: data.id,
      });

       const [PreviewImage, setPreviewImage] = useState("");
    

       useEffect(() => {
                      if (Editparent) {
                          const deepCopyOfParent = JSON.parse(JSON.stringify(Editparent));
              
                          setFormData({
                            
                              name: deepCopyOfParent.name || "",
                              description: deepCopyOfParent.description || "",
                              img: deepCopyOfParent.gallery || "",
                              alt: deepCopyOfParent.alt || "",
                             status: deepCopyOfParent.status !== undefined ? deepCopyOfParent.status : true, // Ensure boolean
                              addedby: deepCopyOfParent.addedby || data.id,
                              lasteditby: data.id,
                          });

                           setPreviewImage(`${data.url}/Images/parent/${Editparent.img}` || null);
                      }else{
                           navigate("/dashboard/project-parent"); // Redirect if no data is available for editing
                      }
                     
                  }, [Editparent, data.id,]);
                  console.log(formData)
    
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
          ...formData,
          [name]: type === "checkbox" ? checked : value,
        });
      };

       const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                img: file,
            });
            setPreviewImage(URL.createObjectURL(file));
        }
    };


     const handleSubmit = async (e) => {
        e.preventDefault();
       setIsloading(true)
    
        // Prepare FormData outside the block
        const uploadData = new FormData();
    
        try {
            if (formData.img instanceof File) {
                console.log("New file selected, handling old image deletion, upload, and category update...");
    
                // Append the file to FormData
                uploadData.append("file", formData.img);
    
                // Promise for deleting the old image
                const deleteOldImagePromise = axios.delete(
                    `${data.url}/api/admin/upload/parent/${Editparent.img}`, {
                headers: {
                   
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            }
                );
    
                // Promise for uploading the new image
                const uploadNewImagePromise = axios.post(
                    `${data.url}/api/admin/upload/parent`,
                    uploadData, {
                headers: {
                   
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            }
                );
    
                // Execute promises for delete and upload in parallel
                const [deleteResponse, uploadResponse] = await Promise.all([
                    deleteOldImagePromise,
                    uploadNewImagePromise,
                ]);
    
                // Check results
                if (!deleteResponse.data.success) {
                    toast.error("Failed to delete the old image.");
                     setIsloading(false)
                    return; // Stop if deletion fails
                }
    
                if (!uploadResponse.data.success) {
                    toast.error("Failed to upload the new image.");
                     setIsloading(false)
                    return; // Stop if upload fails
                }
    
                console.log("Old image deleted and new image uploaded successfully");
                formData.img = uploadResponse.data.file; // Update file path in formData
            }
    
            // Update the category
            const updateResponse = await axios.put(
                `${data.url}/api/admin/projectparent/${Editparent._id}`,
                {
        name: formData.name,
        img:formData.img,
        alt:formData.alt,
        description: formData.description,
        status: formData.status,
         lasteditby: formData.lasteditby,
        addedby: formData.addedby,
                }, {
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            }
            );
    
            // Check update response
            if (updateResponse.data.success) {
                toast.success("Parent project updated successfully!");
                setEditParent(null); // Clear the EditProjectCategory state
                setIsloading(false)
                 navigate('/dashboard/parent-project');
                
            } else {
                toast.error(updateResponse.data.message);
                 setIsloading(false)
            }
        } catch (error) {
            console.error("Error during the operation:", error);
            toast.error("An error occurred while updating the category.");
             setIsloading(false)
        }
    };
    
 // Return only the loader when submitting
  

    //   const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const formdata = new FormData();
    //     formdata.append("name", formData.name);
    //     formdata.append("img", formData.img);
    //     formdata.append("alt", formData.alt);
    //     formdata.append("description", formData.description);
    //     formdata.append("status", formData.status);
    //     formdata.append("addedby", formData.addedby);
    //      formdata.append("lasteditby", formData.lasteditby);

    //     try {
    //       const response = await axios.post(
    //         `${data.url}/api/admin/projectparent`,
    //         formdata,
    //         { headers: { "Content-Type": "application/json" } }
    //     );
    //         console.log(response)
    //         if (response.data.success) {
    //            SetTostMsg(response.data.message);
    //            navigate('/dashboard/parent-project')
    //         }else{
    //              toast.error(response.data.message);
    //         }

    //         setFormData({
    //           name: "",
    //           description: "",
    //           status: null,
    //           addedby: data.id,
    //         });
            
    //     } catch (error) {
    //         console.error("Error adding city:", error);
    //       // SetTostMsg(error.response?.data?.message || "Failed to add city");
    //     }
    // };
      useEffect(()=>{
        console.log(formData)
      },[formData])
  return (
    <div>
      {Isloading ? (
 <div>
        <Loader/>
     </div>
      ): (
<div className="w-full max-w-4xl m-2 mx-auto bg-white rounded-lg p-6">
  <h2 className="text-xl font-bold mb-4 text-center">Update Parent Project</h2>
  <form onSubmit={handleSubmit}>

    <div className="space-y-2 mb-4">
    <Typography variant="small" className="font-medium">
        Parent Image
    </Typography>
    <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
        <input
            type="file"
            accept="image/*"
            name="img"
            onChange={handleImageChange}
            className="hidden"
        />
        <span className="text-gray-700">Choose a file</span>
    </label>
    {PreviewImage && (
        <div> {/* Wrapper added here */}
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

    {/* Name Field */}
    <div className="mb-4">
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        Name
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
        Description
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
      <label className="block text-sm font-medium text-gray-700">Status</label>
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
      )}
  

    </div>
  )
}
