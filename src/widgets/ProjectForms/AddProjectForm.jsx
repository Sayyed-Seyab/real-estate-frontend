import { StoreContext } from "@/context/Context";
import { Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProjectForm = () => {
    const navigate = useNavigate()
    const { data, ProjectCategories, SetTostMsg } = useContext(StoreContext)
    const [step, setStep] = useState(1); // Track the current part of the form
    const [previewgallery, setpreviewgallery] = useState({
        gallery: ""
    })
    const [formData, setFormData] = useState({
        categories: [],
        name: "",
        price: "",
        area: "",
        address: "",
        accommodation: "",
        type: "",
        gallery: [],
        video: "",
        status: null,
        metatitle: "",
        metadesc: "",
        producttitle: "",
        amenitytitle: "",
        amenitydesc: "",
        productplantitle: "",
        sections1: [{ sectiontype: "", title: "", subtitle: "", desc: "", gallery: [], section1alt: "" }],
        section2title: " ",
        section2subtitle: " ",
        section2desc: " ",
        sections2: [{ sectiontype: "", name: "", desc: "", section2image: "", section2alt: "" }],
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [projectParent] = useState([{ _id: "1", name: "Parent 1" }, { _id: "2", name: "Parent 2" }]);
    const [eixstfile, setfile] = useState(false)

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageUploadSection1 = async (e, sectionIndex) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const uploadedImages = [];

        for (const file of files) {
            const imageData = new FormData();
            imageData.append("file", file);

            try {
                const response = await axios.post(`${data.url}/api/admin/upload/project`, imageData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (response.data.success) {
                    uploadedImages.push({ section1image: response.data.file, section1alt: "" });
                } else {
                    toast.error(`Failed to upload ${file.name}`);
                }
            } catch (error) {
                console.error("Upload error:", error);
                toast.error(`Error uploading ${file.name}`);
            }
        }
        if (uploadedImages.length > 0) {
            setFormData((prevData) => ({
                ...prevData,
                sections1: prevData.sections1.map((section, idx) =>
                    idx === sectionIndex
                        ? { ...section, gallery: [...section.gallery, ...uploadedImages] }
                        : section
                ),
            }));

            toast.success("Images uploaded successfully!");
        }
    };


    // Handle image deletion for Section 1
    const handleDeleteImageSection1 = async (sectionIndex, imageIndex) => {
        try {
            const imageUrl = formData.sections1[sectionIndex]?.gallery[imageIndex]?.section1image;
            if (!imageUrl) {
                toast.error("No image found to delete.");
                return;
            }

            await axios.delete(`${data.url}/api/admin/upload/project/${imageUrl}`);

            setFormData((prevData) => ({
                ...prevData,
                sections1: prevData.sections1.map((section, secIdx) =>
                    secIdx === sectionIndex
                        ? {
                            ...section,
                            gallery: section.gallery.filter((_, imgIdx) => imgIdx !== imageIndex),
                        }
                        : section
                ),
            }));
            toast.success("Image deleted successfully!");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Error deleting image.");
        }
    };



    const handleImageUpload = async (e) => {

        const files = e.target.files;
        if (!files.length) return;

        const uploadPromises = Array.from(files).map(async (file) => {
            const imageData = new FormData();
            imageData.append("file", file);

            try {
                const response = await axios.post(`${data.url}/api/admin/upload/project`, imageData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                console.log(response)
                if (response.data.success) {

                    return { galleryimage: response.data.file, alt: "" }; // Store image URL in `galleryimage`

                } else {
                    toast.error("Image upload failed.");
                    return null;
                }
            } catch (error) {
                console.error("Upload error:", error);
                toast.error("Error uploading image.");
                return null;
            }
        });

        const uploadedImages = (await Promise.all(uploadPromises)).filter(Boolean); // Remove any failed uploads

        setFormData((prevData) => ({
            ...prevData,
            gallery: [...prevData.gallery, ...uploadedImages], // Append new images
        }));
        setfile(true)
        console.log(uploadedImages);
    };

    const handleImageUploadSection2 = async (e, index) => {
        const file = e.target.files[0]; // Get first file
        if (!file) return;

        const imageData = new FormData();
        imageData.append("file", file);

        try {
            const response = await axios.post(`${data.url}/api/admin/upload/project`, imageData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                const imageUrl = response.data.file; // Get uploaded image URL

                // Update the specific index in sections1 array
                setFormData((prevData) => ({
                    ...prevData,
                    sections2: prevData.sections2.map((section, i) =>
                        i === index ? { ...section, section2image: imageUrl } : section
                    ),
                }));

                console.log("Uploaded Image URL:", imageUrl);
            } else {
                toast.error("Image upload failed.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Error uploading image.");
        }
    };

    const handleDeleteImageSection2 = async (index) => {
        try {
            // Get the image URL to delete
            const imageUrl = formData.sections2[index].section2image;
            if (!imageUrl) return;

            // Send request to delete image from the server
            await axios.delete(`${data.url}/api/admin/upload/project/${imageUrl}`)

            // Update formData to remove the image
            setFormData((prevData) => ({
                ...prevData,
                sections2: prevData.sections2.map((section, i) =>
                    i === index ? { ...section, section2image: "" } : section
                ),
            }));

            toast.success("Image deleted successfully!");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Error deleting image.");
        }
    };




    const HandleRemoveImage = async (imageUrl) => {

        try {
            const response = await axios.delete(`${data.url}/api/admin/upload/project/${imageUrl.galleryimage}`, {
            });
            if (response.data.success) {
                setFormData((prev) => ({
                    ...prev,
                    gallery: [
                        ...prev.gallery.filter((item) => item.galleryimage !== imageUrl.galleryimage), // Remove empty object

                    ],
                }));
                toast.success("Image deleted.");
            } else {
                toast.error("Failed to delete image.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Error deleting image.");
        }
    };



    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            galleryimage: URL.createObjectURL(file), // Temporary URL
            alt: "", // Initialize alt as empty
        }));

        const NewImages = files.map((file) => ({
            galleryimage: file, // Temporary URL
            alt: "", // Initialize alt as empty
        }));

        // Update gallery in formData
        setpreviewgallery((prev) => ({
            ...prev,
            gallery: [...prev.gallery, ...newImages],
        }));

        setFormData((prev) => ({
            ...prev,
            gallery: [
                ...prev.gallery.filter((item) => item.galleryimage !== ""), // Remove empty object
                ...NewImages,
            ],
        }));
        setfile(true)
    };

    const handleAltChange = (index, value) => {
        const updatedGallery = formData.gallery.map((item, idx) => {

            if (idx === index) {

                return { ...item, alt: value }; // Update alt text for specific image

            }
            return item;
        });

        setFormData((prev) => ({
            ...prev,
            gallery: updatedGallery,
        }));
    };

    const H = (index) => {
        // Filter out the specific image by index
        const updatedGallery = previewgallery.gallery.filter((_, idx) => idx !== index);
        const updatedformGallery = formData.gallery.filter((_, idx) => idx !== index);

        setpreviewgallery((prev) => ({
            ...prev,
            gallery: updatedGallery,
        }));
        setFormData((prev) => ({
            ...prev,
            gallery: updatedformGallery,
        }));

    };



    const handleSectionChange = (e, sectionName, index) => {
        const { name, type } = e.target;
        let value;

        // Handle file inputs separately
        if (type === "file") {
            value = e.target.files[0]; // Get the first selected file
        } else {
            value = e.target.value;
        }

        const updatedSections = [...formData[sectionName]];
        updatedSections[index] = { ...updatedSections[index], [name]: value };

        setFormData({
            ...formData,
            [sectionName]: updatedSections,
        });
    };


    // Add a new section (either sections1 or sections2)
    const addSection = (sectionName) => {
        const newSection = sectionName === "sections1"
            ? { sectiontype: "", title: "", subtitle: "", desc: "", gallery: [{ section1image: "", section1alt: "" }], section1alt: "" }
            : { sectiontype: "", name: "", desc: "", section2image: "", section2alt: "" };

        setFormData({
            ...formData,
            [sectionName]: [...formData[sectionName], newSection],
        });
    };

    // Remove a section (either sections1 or sections2)
    const removeSection = (sectionName, index) => {
        const updatedSections = formData[sectionName].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [sectionName]: updatedSections,
        });
    };

    // Handle navigation between parts
    const nextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const prevStep = () => {
        setStep((prevStep) => prevStep - 1);
    };
    useEffect(() => {
        console.log(formData)
    }, [formData])

    // Handle category selection change
    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;

        if (selectedCategoryId) {
            const alreadyexistCategory = formData.categories.some((cat) => cat.id === selectedCategoryId)
            console.log(selectedCategoryId)
            if (!alreadyexistCategory) {
                setFormData({
                    ...formData,
                    categories: [
                        ...formData.categories,
                        { id: selectedCategoryId },
                    ]
                })
            }
        }
    };

    // Remove selected category from the list
    const removeCategory = (index) => {
        const updatedCategories = formData.categories.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            categories: updatedCategories,
        });
    };







    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Prepare promises for uploading gallery, section1images, and section2images
            // const galleryImagePromises = formData.gallery.map(async (image) => {
            //     if (image.galleryimage instanceof File) {
            //         const formDataImage = new FormData();
            //         formDataImage.append('file', image.galleryimage);

            //         const response = await axios.post(`${data.url}/api/admin/upload/project`, formDataImage, {
            //             headers: {
            //                 'Content-Type': 'multipart/form-data',
            //             },
            //         });
            //         return response.data.file; // Assuming the response contains the uploaded image URL
            //     }
            //     return image.galleryimage; // If no file, return the current value (could be URL)
            // });

            // const section1ImagePromises = formData.sections1.map(async (section) => {
            //     if (section.section1image instanceof File) {
            //         const formDataImage = new FormData();
            //         formDataImage.append('file', section.section1image);

            //         const response = await axios.post(`${data.url}/api/admin/upload/project`, formDataImage, {
            //             headers: {
            //                 'Content-Type': 'multipart/form-data',
            //             },
            //         });
            //         return response.data.file; // Assuming the response contains the uploaded image URL
            //     }
            //     return section.section1image; // If no file, return the current value (could be URL)
            // });

            // const section2ImagePromises = formData.sections2.map(async (section) => {
            //     if (section.section2image instanceof File) {
            //         const formDataImage = new FormData();
            //         formDataImage.append('file', section.section2image);

            //         const response = await axios.post(`${data.url}/api/admin/upload/project`, formDataImage, {
            //             headers: {
            //                 'Content-Type': 'multipart/form-data',
            //             },
            //         });
            //         return response.data.file; // Assuming the response contains the uploaded image URL
            //     }
            //     return section.section2image; // If no file, return the current value (could be URL)
            // });

            // Wait for all image uploads to complete
            // const galleryImageUrls = await Promise.all(galleryImagePromises);
            // const section1ImageUrls = await Promise.all(section1ImagePromises);
            // const section2ImageUrls = await Promise.all(section2ImagePromises);

            // Update sections and gallery with the uploaded image URLs
            // const updatedGallery = formData.gallery.map((image, index) => ({
            //     ...image,
            //     galleryimage: galleryImageUrls[index] || image.galleryimage,
            // }));

            // const updatedSections1 = formData.sections1.map((section, index) => ({
            //     ...section,
            //     section1image: section1ImageUrls[index] || section.section1image,
            // }));

            // const updatedSections2 = formData.sections2.map((section, index) => ({
            //     ...section,
            //     section2image: section2ImageUrls[index] || section.section2image,
            // }));

            // Update formData with the new image URLs
            // Update formData with the new image URLs
            // const updatedFormData = {
            //     ...formData,
            //     gallery: updatedGallery,
            //     sections1: updatedSections1,
            //     sections2: updatedSections2
            // };

            // Send the updated form data to your API
            const response = await axios.post(`${data.url}/api/admin/project`, formData);
            console.log(response)
            if (response.data.success) {
                console.log('Project added successfully:', response.data);
                SetTostMsg(response.data.message);
                navigate('/dashboard/project')
                // Handle success (e.g., redirect, show success message, etc.)
            } else {
                console.error('Error adding project:', response.data);
                // Handle error (e.g., show error message)
            }
        } catch (error) {
            console.error('Error in form submission:', error);
            // Handle error (e.g., show error message)
        }
    };


    // Render the form based on the current step
    return (
        <div className="w-full max-w-4xl m-2 mx-auto bg-white rounded-lg p-6">
            <form onSubmit={handleSubmit} className=" max-h-[500px] overflow-y-auto">
                {step === 1 && (
                    <div className="mt-10 bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-center">Add Project </h2>
                        {/* Project Image */}
                        <div className="space-y-2 mb-4">
                            <Typography variant="small" className="font-medium">
                                Project Image
                            </Typography>
                            <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple // Allow multiple file selection
                                    name="image"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <span className="text-gray-700">Choose a file</span>
                            </label>
                            {/* Display Image Previews with Alt Inputs */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {eixstfile ? formData.gallery?.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative flex flex-col  space-y-2 group"
                                    >
                                        {/* Image */}
                                        <img
                                            src={`${data.url}/Images/project/${image.galleryimage}`}
                                            alt={image.alt || "Uploaded image"}
                                            className="h-32 w-full object-cover rounded-lg border"
                                        />

                                        {/* Remove Button (only visible on hover) */}
                                        <button
                                            type="button"
                                            onClick={() => HandleRemoveImage(image)}
                                            className="absolute top-2 right-2 text-sm text-white bg-red-600 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Remove
                                        </button>

                                        {/* Alt Text Input */}
                                        <input
                                            type="text"
                                            placeholder="Enter alt text"
                                            name="alt"
                                            onChange={(e) => handleAltChange(index, e.target.value)}
                                            className="w-full px-2 py-1 border rounded-md"
                                        />
                                    </div>
                                )) : null}

                            </div>
                        </div>

                        {/* Project Type */}
                        {/* Project Categories */}
                        {/* Project Categories */}

                        <div className="mb-4">
                            <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                                Project Categories
                            </label>
                            <select
                                id="categories"
                                name="categories"
                                value={formData.selectedCategory || ""} // Single selected category
                                onChange={handleCategoryChange}
                                className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                                required
                            >
                                <option value="" disabled>
                                    Select Category
                                </option>
                                {ProjectCategories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Display selected categories */}
                        {formData.categories.length > 0 ?
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Selected Categories
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.categories.map((category, index) => (
                                        <span
                                            key={category.id}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full flex items-center"
                                        >
                                            {ProjectCategories.find(c => c._id === category.id)?.name}
                                            <button
                                                type="button"
                                                onClick={() => removeCategory(index)}
                                                className="ml-2 text-sm  font-bold text-red-500"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            : null}

                        {/* Parent Project Selection */}
                        {/* <div className="form-group mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Select Parent:</label>
                        <select
                            name="parentid"
                            value={formData.parentid || ""}
                            onChange={handleChange}
                            className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                            required
                        >
                            <option className="text-gray-700" value="" disabled>
                                Select Parent
                            </option>
                            {projectParent.map((parent, index) => (
                                <option key={index} value={parent._id}>
                                    {parent.name}
                                </option>
                            ))}
                        </select>
                    </div> */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                            {/* Category Status */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Category Status</label>
                                <div className="flex items-center space-x-4 mt-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="true"
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
                                            onChange={() => setFormData({ ...formData, status: false })}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Inactive</span>
                                    </label>
                                </div>
                            </div>






                            {/* Project Name */}
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Project Name
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

                            {/* Project Price */}
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Project Price
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Project Area */}
                            <div className="mb-4">
                                <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                                    Project Area
                                </label>
                                <input
                                    type="text"
                                    id="area"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Project Address */}
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Project Address
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Project Accommodation */}
                            <div className="mb-4">
                                <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700">
                                    Project Accommodation
                                </label>
                                <input
                                    type="text"
                                    id="accommodation"
                                    name="accommodation"
                                    value={formData.accommodation}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Project Accommodation */}
                            <div className="mb-4">
                                <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700">
                                    Project video (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="video"
                                    name="video"
                                    value={formData.video}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"

                                />
                            </div>



                            {/* Meta Title */}
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



                            {/* Meta Description */}
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






                        </div>
                        {/* Submit Button for Step 1 */}
                        <div>
                            <Button
                                type="Button"
                                onClick={nextStep}
                                className="w-20 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Next
                            </Button>
                        </div>
                    </div>

                )}

                {step === 2 && (
                    <div className="  mt-10 bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Product Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Title */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Product Title</label>
                                <input
                                    type="text"
                                    name="producttitle"
                                    value={formData.producttitle}
                                    onChange={handleChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Product Plan Title */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Product Plan Title</label>
                                <input
                                    type="text"
                                    name="productplantitle"
                                    value={formData.productplantitle}
                                    onChange={handleChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Product Subtitle */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Amenties Title</label>
                                <input
                                    type="text"
                                    name="amenitytitle"
                                    value={formData.amenitytitle}
                                    onChange={handleChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                />
                            </div>


                            {/* Product Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Amenties Description</label>
                                <textarea
                                    name="amenitydesc"
                                    value={formData.amenitydesc}
                                    onChange={handleChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>
                        {/* Sections 1 */}
                        <h3 className="text-lg font-semibold mt-6 mb-2">Sections 1</h3>
                        {formData.sections1.map((section, index) => (
                            <div key={index} className="mb-6 p-4 rounded-lg shadow-sm">

                                {/* section type */}
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Selection Type:
                                    </label>
                                    <select
                                        name="sectiontype"
                                        value={section.sectiontype}
                                        onChange={(e) => handleSectionChange(e, "sections1", index)}
                                        className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                                        required
                                    >
                                        <option value="" >
                                            Select Type
                                        </option>
                                        <option value="Hero">Hero</option>
                                        <option value="About">About</option>
                                        <option value="Location">Location</option>
                                        <option value="Background">Background</option>
                                        <option value="Associations">Associations</option>
                                    </select>
                                </div>


                                <div>
                                    {/* Image */}
                                    <div className="mb-2">
                                        <Typography variant="small" className="font-medium">
                                            Section Image
                                        </Typography>
                                        <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                                            <input
                                                type="file"
                                                multiple
                                                name="section1image"
                                                // value={section.section1image}
                                                onChange={(e) => handleImageUploadSection1(e, index)}
                                                className="hidden"
                                            />
                                            <span className="text-gray-700">Choose a file</span>
                                        </label>
                                    </div>

                                    <div className="w-full mb-4">
                                        {/* Image Preview */}
                                        {section.gallery && section.gallery.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                {section.gallery.map((img, imgIndex) =>
                                                    img.section1image ? (
                                                        <div key={imgIndex} className="relative group">
                                                            <img
                                                                src={`${data.url}/Images/project/${img.section1image}`}
                                                                alt={img.section1alt || `Gallery image ${imgIndex + 1}`}
                                                                className="w-full h-50 object-cover rounded-lg"
                                                            />

                                                            {/* Remove Button (visible on hover) */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteImageSection1(index, imgIndex)}
                                                                className="absolute top-2 right-2 text-sm text-white bg-red-600 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ) : null // ✅ Skips rendering if no image exists
                                                )}
                                            </div>
                                        ) : null}
                                    </div>




                                    {/* Image Alt */}
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Image Alt</label>
                                        <input
                                            type="text"
                                            name="section1alt"
                                            value={section.section1alt}
                                            onChange={(e) => handleSectionChange(e, "sections1", index)}
                                            className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">



                                    {/* Title */}
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={section.title}
                                            onChange={(e) => handleSectionChange(e, "sections1", index)}
                                            className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Subtitle */}
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                                        <input
                                            type="text"
                                            name="subtitle"
                                            value={section.subtitle}
                                            onChange={(e) => handleSectionChange(e, "sections1", index)}
                                            className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>


                                    {/* Description */}
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            name="desc"
                                            value={section.desc}
                                            onChange={(e) => handleSectionChange(e, "sections1", index)}
                                            className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                </div>
                                <div className="flex justify-between">
                                    {index > 0 ? (
                                        <div>
                                            {/* Remove Section Button */}
                                            <Button
                                                size="small"
                                                type="Button"
                                                onClick={() => removeSection("sections1", index)}
                                                className="p-2 bg-red-500 text-white rounded-md mt-4 hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                                            >
                                                Remove Section
                                            </Button>


                                        </div>
                                    ) : ""}
                                    <div>
                                        {/* Add Section Button */}
                                        <Button
                                            type="Button"
                                            onClick={() => addSection("sections1")}
                                            className="p-2 bg-gray-700 text-white rounded-md mt-4 hover:bg-green-600 focus:ring-2 focus:ring-green-500"
                                        >
                                            Add Another Section
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        ))}



                        {/* Navigation Buttons */}
                        <div className="mt-6 flex justify-between">
                            <Button
                                type="Button"
                                onClick={prevStep}
                                className="w-20 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
                            >
                                Previous
                            </Button>
                            <Button
                                type="Button"
                                onClick={nextStep}
                                className="w-20 ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                            >
                                Next
                            </Button>
                        </div>
                    </div>

                )}

                {step === 3 && (
                    <div className="mt-10 bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Section 2 Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Section 2 Title */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Section 2 Title</label>
                                <input
                                    type="text"
                                    name="section2title"
                                    value={formData.section2title}
                                    onChange={handleChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Section 2 Subtitle */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Section 2 Subtitle</label>
                                <input
                                    type="text"
                                    name="section2subtitle"
                                    value={formData.section2subtitle}
                                    onChange={handleChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Section 2 Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Section 2 Description</label>
                                <textarea
                                    name="section2desc"
                                    value={formData.section2desc}
                                    onChange={handleChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        {/* Dynamic Section 2 Fields */}
                        <h3 className="text-lg font-semibold mt-6 mb-2">Sections 2</h3>
                        {formData.sections2.map((section, index) => (
                            <div key={index} className="mb-6 p-4 rounded-lg shadow-sm">

                                {/* section type */}
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Selection Type:
                                    </label>
                                    <select
                                        name="sectiontype"
                                        value={section.sectiontype}
                                        onChange={(e) => handleSectionChange(e, "sections2", index)}
                                        className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                                        required
                                    >
                                        <option value="" >
                                            Select Type
                                        </option>
                                        <option value="Amenties">Amenties</option>
                                        <option value="Nearby">Nearby</option>
                                    </select>
                                </div>

                                <div>
                                    {/* Section Image */}
                                    <div className="mb-2">
                                        <Typography variant="small" className="font-medium">
                                            Section Image
                                        </Typography>
                                        <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                                            <input
                                                type="file"
                                                name="section2image"
                                                onChange={(e) => handleImageUploadSection2(e, index)}
                                                className="hidden"
                                            />
                                            <span className="text-gray-700">choose a file</span>
                                        </label>
                                    </div>

                                    <div className="w-full  mb-4">
                                        {/* Image Preview */}
                                        {section.section2image ? (
                                            <div className="relative flex group">
                                                <img
                                                    src={`${data.url}/Images/project/${section.section2image}`}
                                                    alt={section.alt || `Gallery image ${index + 1}`}
                                                    className="w-full h-50 object-cover rounded-lg"
                                                />

                                                {/* Remove Button (visible on hover) */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteImageSection2(index)}
                                                    className="absolute top-2 right-2 text-sm text-white bg-red-600 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* Section Alt Text */}
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Image Alt</label>
                                        <input
                                            type="text"
                                            name="section2alt"
                                            value={section.section2alt}
                                            onChange={(e) => handleSectionChange(e, "sections2", index)}
                                            className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Section Name */}
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700"> Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={section.name}
                                            onChange={(e) => handleSectionChange(e, "sections2", index)}
                                            className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Section Description */}
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            name="desc"
                                            value={section.desc}
                                            onChange={(e) => handleSectionChange(e, "sections2", index)}
                                            className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>


                                </div>
                                <div className="flex justify-between">
                                    {index > 0 ? (
                                        <div>
                                            {/* Remove Section Button */}
                                            <Button
                                                size="small"
                                                type="Button"
                                                onClick={() => removeSection("sections2", index)}
                                                className="p-2 bg-red-500 text-white rounded-md mt-4 hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                                            >
                                                Remove Section
                                            </Button>


                                        </div>
                                    ) : ""}
                                    <div>
                                        {/* Add Section Button */}
                                        <Button
                                            type="Button"
                                            onClick={() => addSection("sections2")}
                                            className="p-2 bg-gray-700 text-white rounded-md mt-4 hover:bg-green-600 focus:ring-2 focus:ring-green-500"
                                        >
                                            Add Another Section
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        ))}



                        {/* Navigation Buttons */}
                        <div className="mt-6 flex justify-between">
                            <Button
                                type="Button"
                                onClick={prevStep}
                                className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
                            >
                                Previous
                            </Button>
                            <Button
                                type="submit"
                                className="w-40 ml-2 p-2 bg-gray-800 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500"
                            >
                                Submit
                            </Button>
                        </div>
                    </div>

                )}
            </form>
        </div>
    );
};

export default AddProjectForm;
