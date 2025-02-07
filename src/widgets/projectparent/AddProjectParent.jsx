import { StoreContext } from "@/context/context";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";


export default function AddProjectParent() {
    const {data, SetTostMsg, tostMsg} = useContext(StoreContext)
    const navigate = useNavigate()
    console.log(data)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: null,
        addedby: data.id,
      });
    
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
          ...formData,
          [name]: type === "checkbox" ? checked : value,
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append("name", formData.name);
        formdata.append("description", formData.description);
        formdata.append("status", formData.status);
        formdata.append("addedby", formData.addedby);

        try {
          const response = await axios.post(
            `${data.url}/api/admin/projectparent`,
            formdata,
            { headers: { "Content-Type": "application/json" } }
        );
            console.log(response)
            if (response.data.success) {
               SetTostMsg(response.data.message);
               navigate('/dashboard/parent-project')
            }else{
                 toast.error(response.data.message);
            }

            setFormData({
              name: "",
              description: "",
              status: null,
              addedby: data.id,
            });
            
        } catch (error) {
            console.error("Error adding city:", error);
          // SetTostMsg(error.response?.data?.message || "Failed to add city");
        }
    };
      useEffect(()=>{
        console.log(formData)
      },[formData])
  return (
    <div>
  <div className="w-full max-w-4xl m-2 mx-auto bg-white rounded-lg p-6">
  <h2 className="text-xl font-bold mb-4 text-center">Create Parent Project</h2>
  <form onSubmit={handleSubmit}>
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
        className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </div>
  </form>
</div>

    </div>
  )
}
