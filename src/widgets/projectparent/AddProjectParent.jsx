import { StoreContext } from "@/context/Context";
import { Typography } from "@material-tailwind/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";


export default function AddProjectParent() {
    const {data, Token, SetTostMsg, tostMsg,} = useContext(StoreContext)
    const navigate = useNavigate()
    console.log(data)
    const [formData, setFormData] = useState({
        name: "",
        img:"",
        alt:"",
        description: "",
        status: null,
        addedby: data.id,
      });

    const [PreviewImage, setPreviewImage] = useState("");
    const [loading, setLoading] = useState(false); // Loader state
    
      // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
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
 setLoading(true); // Show loader
    console.log(formData)

    try {
        let uploadedImagePath = formData.img;

        // If a new image is selected, upload it
        if (formData.img instanceof File) {
            const uploadData = new FormData();
            uploadData.append("file", formData.img);

            const uploadResponse = await axios.post(
                `${data.url}/api/admin/upload/parent`,
                uploadData, {
                headers: {
                    
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            }
            );

            if (!uploadResponse.data.success) {
                toast.error("Image upload failed.");
                 setLoading(false)
                return;
            }

            uploadedImagePath = uploadResponse.data.file; // Get the uploaded image path
        }

        // Prepare form data with or without image
        const formdata = {
            name: formData.name,
            description: formData.description,
            status: formData.status,
            addedby: formData.addedby,
            img: uploadedImagePath, // Include image if uploaded
            alt: formData.alt
        };
console.log(formdata)
        const response = await axios.post(
            `${data.url}/api/admin/projectparent`,
            formdata, {
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            }
        );
console.log(response)
        if (response.data.success) {
            SetTostMsg(response.data.message); 
            navigate('/dashboard/parent-project');
             setLoading(false); // Show loader
        } else {
            toast.error(response.data.message);
             setLoading(false)
        }

        setFormData({
            name: "",
            description: "",
            status: null,
            img: null,
            addedby: data.id,
        });

    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An error occurred while submitting.");
         setLoading(false)
    }
};

      useEffect(()=>{
        console.log(formData)
      },[formData])

      // Return only the loader when submitting
   if (loading) {
    return (
       <Loader/>
    );
}


  return (
    <div>
  <div className="w-full max-w-4xl m-2 mx-auto bg-white rounded-lg p-6">
  <h2 className="text-xl font-bold mb-4 text-center">Create Parent Project</h2>
  <form onSubmit={handleSubmit}>

    <div className="space-y-2 mb-4">
        <Typography variant="small" className="font-medium">
            Parent Image (Optional)
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
        Name*
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
                                    required
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
                                    required
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
