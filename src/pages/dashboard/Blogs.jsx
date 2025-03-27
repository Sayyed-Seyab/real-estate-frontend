import { StoreContext } from '@/context/Context';
import { Avatar, Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { projectsData } from '@/data';

export default function Blog() {
  const {data, setloading,   GetBlogs, Blogs, loading,  tostMsg, SetTostMsg, setEditBlog, EditBlog, Token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false);
  const [isUpdateCityModalOpen, setIsUpdateCityModalOpen] = useState(false);
  const [isDltCityModalOpen, setIsDltCityModalOpen] = useState(false);
  const [CityId, SetCityId] = useState('')


  const rowsPerPage = 20; // Number of rows per page
 

  useEffect(() => {
    GetBlogs();
    console.log(Blogs)
      if (tostMsg !== null) {
          // Show toast and reset state after a delay
          const toastTimeout = setTimeout(() => {
              toast.success(tostMsg);
          }, 1000);

          const resetTimeout = setTimeout(() => {
              SetTostMsg(null); // Reset state after 5 seconds
          }, 5000);

          // Cleanup timeouts on component unmount
          return () => {
              clearTimeout(toastTimeout);
              clearTimeout(resetTimeout);
          };
      }
  }, [ ]);
 


  // Pagination logic
  const totalPages = Math.ceil(Blogs.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = Blogs.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
      }
  };

  const handleAddBlog = () => {

      navigate("/dashboard/add-blog");
  };
  const handleUpdateProjectCategory = (blog) => {
    setEditBlog(blog)
    console.log(EditBlog);
      // setIsUpdateCityModalOpen(true)
      // const findcity = cityDataAllLang.filter((item) => item._id === city._id)
      // SetEditCity(findcity)
      // setloading(false)
      navigate("/dashboard/update-blog")
  }

  
  const handleDelete = async (blog) => {
      try {
        const isDltImage = await axios.delete(`${data.url}/api/admin/upload/blog/${blog.image}`, {
                headers: {
                
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            })
        if(isDltImage.data.success){
            // toast.success(isDltImage.data.message)
            const response = await axios.delete(`${data.url}/api/admin/blog/${blog._id}`, {
                headers: {
                  
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            })
          if (response.data.success) {
              toast.success(response.data.message)
              GetBlogs();

          }else{
            toast.error(response.data.message)
            console.log('no success')
          }
        }else{
            toast.error(isDltImage.data.message)
            console.log('no image')
        }

          
      } catch (error) {
         alert(error)
      }
  }

  


  
  https://crmapi.jawartaibah.com
  if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      );
      
    }
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
            
    <Card>
        <CardHeader
            variant="gradient"
            color="gray"
            className="mb-8 p-6 flex justify-between"
        >
            <Typography variant="h6" color="white">
                Project Category Table
            </Typography>

            <div className="flex items-center gap-4">
                {/* Trigger Button */}
                <Button
                    variant="text"
                    color="light-gray"
                    onClick={handleAddBlog}
                    className="bg-gray-500  hover:bg-gray-600 text-white hidden items-center gap-1 px-4 xl:flex normal-case"
                >
                    ADD BLOG
                </Button>
            </div>
        </CardHeader>
        <CardBody className="max-h-[415px] overflow-y-auto px-0 pt-0 pb-2">
             {currentData.length === 0 ? (
                            <Typography
                                className="text-center text-gray-500 font-medium py-8"
                                variant="h6"
                            >
                                No Blogs available.
                            </Typography>
                        ) : (
                            <>
                            <table className="w-full min-h-[0px] table-auto">
                <thead>
                    <tr>
                        {["Image", "Name", "Description","Status", "Action"].map((header) => (
                            <th
                                key={header}
                                className="border-b border-blue-gray-50 py-3 px-5 text-left"
                            >
                                <Typography
                                    variant="small"
                                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                                >
                                    {header}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((blog, index) => (
                       
                        <tr key={index}>
                            <td className="px-5 py-2 border-b border-blue-gray-50">
                                        <Avatar
                                            src={blog.image ? `${data.url}/Images/blog/${blog.image}` : "../../public/img/noimg.png"}
                                            alt={blog.alt || 'No image'}
                                            size="lg"
                                            variant="rounded"
                                            className="w-20"
                                        />
                                    </td>
                            {/* Image */}
                            <td className="px-5 py-2 border-b border-blue-gray-50">
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                                    {blog.name}
                                </Typography>
                            </td>

                            {/* City Name */}
                            <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                            <div style={{width:"15rem"}}  className="overflow-y-auto cursor-pointer max-h-[50px]">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                    {blog.description}
                                </Typography>
                                </div>
                            </td>

                            {/* Description */}
                            <td className=" px-5 border-b border-blue-gray-50  min-h-[100px]">
                               
                                <Typography  className=" text-xs font-normal text-blue-gray-500">
                                    {blog.status? "Active" : "Inactive"}
                                </Typography>
                                
                            </td>

                            {/* Action Icons */}
                            <td className="px-5 border-b border-blue-gray-50">
                                <div className="flex justify-center items-center gap-2">
                                    <AiFillEdit
                                        className="hover:text-blue-gray-500"
                                        style={{ fontSize: "20px", cursor: "pointer" }}
                                        onClick={() => handleUpdateProjectCategory(blog)}
                                    />
                                    <MdDelete
                                        className="hover:text-blue-gray-500"
                                        style={{ fontSize: "20px", cursor: "pointer" }}
                                        onClick={() => handleDelete(blog)}
                                    />
                                    {/* <Alertmsg
                                        isOpen={isDltCityModalOpen}
                                        onClose={() => setIsDltCityModalOpen(false)}
                                        onAgree={handleDelete}
                                    /> */}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <Typography
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-sm hover:text-blue-gray-500 font-bold rounded-lg p-1 cursor-pointer  ml-4"
                    size="sm"
                >
                    Previous
                </Typography>
                <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            variant={currentPage === index + 1 ? "gradient" : "text"}
                            color={currentPage === index + 1 ? "blue" : "gray"}
                            className="text-sm "
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>
                <Typography
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-sm hover:text-blue-gray-500 font-bold rounded-lg p-1 cursor-pointer  mr-5"
                    size="sm"
                >
                    Next
                </Typography>
            </div>
                            </>
                        )}
            
        </CardBody>
    </Card>
</div>
  )
}
