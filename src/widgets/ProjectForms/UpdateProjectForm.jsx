import { StoreContext } from "@/context/Context";
import { Button, Typography } from "@material-tailwind/react";
import alertGhost from "@material-tailwind/react/theme/components/alert/alertGhost";
import axios from "axios";
import { instanceOf } from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProjectForm = () => {
    const navigate = useNavigate()
    const { data, ProjectCategories, EditProject } = useContext(StoreContext)
    const [step, setStep] = useState(1); // Track the current part of the form
    const [previewgallery, setpreviewgallery] = useState({
        gallery: ""
    })
    const [ImagesToDlt, setImagesToDlt] = useState([])


    const [formData, setFormData] = useState({
        categories: [],
        name: "",
        price: "",
        area: "",
        address: "",
        accommodation: "",
        type: "",
        gallery: [{ galleryimage: "", alt: "" }],
        video: "",
        status: null,
        metatitle: "",
        metadesc: "",
        producttitle: "",
        productsubtitle: "",
        productdesc: "",
        productplantitle: "",
        sections1: [{ sectiontype: "", title: "", subtitle: "", desc: "", section1image: "", section1alt: "" }],
        section2title: "",
        section2subtitle: "",
        section2desc: "",
        sections2: [{ name: "", desc: "", section2image: "", section2alt: "" }],
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [projectParent] = useState([{ _id: "1", name: "Parent 1" }, { _id: "2", name: "Parent 2" }]);
    const [eixstfile, setfile] = useState(false)


    useEffect(() => {
        if (EditProject) {
            setFormData({
                categories: EditProject.categories[0].projectCategory.map(category => ({ id: category._id })) || [{ id: "" }],
                name: EditProject.name || "",
                price: EditProject.price || "",
                area: EditProject.area || "",
                address: EditProject.address || "",
                accommodation: EditProject.accommodation || "",
                type: EditProject.type || "",
                gallery: EditProject.gallery || [{ galleryimage: "", alt: "" }],
                video: EditProject.video || "",
                status: EditProject.status || null,
                metatitle: EditProject.metatitle || "",
                metadesc: EditProject.metadesc || "",
                producttitle: EditProject.producttitle || "",
                productsubtitle: EditProject.productsubtitle || "",
                productdesc: EditProject.productdesc || "",
                productplantitle: EditProject.productplantitle || "",
                sections1: EditProject.sections1 || [{ sectiontype: "", title: "", subtitle: "", desc: "", section1image: "", section1alt: "" }],
                section2title: EditProject.section2title || "",
                section2subtitle: EditProject.section2subtitle || "",
                section2desc: EditProject.section2desc || "",
                sections2: EditProject.sections2 || [{ name: "", desc: "", section2image: "", section2alt: "" }],
            });

            // Set preview image if available
            // if (EditProject.categoryimage) {
            //     setPreviewImage(`${data.url}/Images/category/${EditProject.categoryimage}`);
            // } else {
            //     setPreviewImage(null);
            // }
        } else {
            // Redirect if no data is available for editing
            // navigate("/dashboard/project-category");
        }

        console.log(ImagesToDlt);
    }, [EditProject, data.url, ImagesToDlt]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value === 'true' ? true : value === 'false' ? false : value,
        });
    };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const NewImages = files.map((file) => ({
            galleryimage: file, // Temporary URL
            alt: "", // Initialize alt as empty
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

    const handleRemoveImage = (index) => {
        // Filter out the specific image by index
        const updatedformGallery = formData.gallery.filter((_, idx) => idx !== index);
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
            ? { sectiontype: "", title: "", subtitle: "", desc: "", section1image: "", section1alt: "" }
            : { name: "", desc: "", section2image: "", section2alt: "" };

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
        if (formData.gallery.length == 0) {
            toast.error('image required')
        }



         // Step 1: Find images to delete
    const imagesToDelete = EditProject.gallery.filter(
        (img) =>
            !formData.gallery.some(
                (dltimage) => !(dltimage.galleryimage instanceof File) && dltimage.galleryimage === img.galleryimage
            )
    );


        const sec1imagesToDelete = EditProject.sections1.filter(
            (img) =>
                !formData.sections1.some((dltimage) => !(dltimage.section1image instanceof File) && dltimage.section1image === img.section1image)
        );


        const Sec2imagesToDelete = EditProject.sections2.filter(
            (img) =>
                !formData.sections2.some((dltimage) => !(dltimage.section2image instanceof File) && dltimage.section2image === img.section2image)
        );

        console.log(imagesToDelete)
        console.log(sec1imagesToDelete)
        console.log(Sec2imagesToDelete)
         // Combine all images to delete
    const imagesToDeleteArray = [
        ...imagesToDelete.map((img) => ({ file: img.galleryimage })),
        ...sec1imagesToDelete.map((img) => ({ file: img.section1image })),
        ...Sec2imagesToDelete .map((img) => ({ file: img.section2image }))
    ];
console.log(imagesToDeleteArray)
       
        
       

        try {

        //      // 1️⃣ **Delete Images First**
        if(imagesToDeleteArray.length > 0){
            console.log(imagesToDeleteArray)
          const response =   await Promise.all(
                imagesToDeleteArray.map(async (file) => {
                    console.log(file)
                   const res =  await axios.delete(`${data.url}/api/admin/upload/project/${file.file}`);
                   console.log(res)
                })
            );

           if(response){
              console.log(response)
            }
        }

            // Prepare promises for uploading gallery, section1images, and section2images
            const galleryImagePromises = formData.gallery.map(async (image) => {
                if (image.galleryimage instanceof File) {
                    const formDataImage = new FormData();
                    formDataImage.append('file', image.galleryimage);

                    const response = await axios.post(`${data.url}/api/admin/upload/project`, formDataImage, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    return response.data.file; // Assuming the response contains the uploaded image URL
                }
                return image.galleryimage; // If no file, return the current value (could be URL)
            });

            const section1ImagePromises = formData.sections1.map(async (section) => {
                if (section.section1image instanceof File) {
                    const formDataImage = new FormData();
                    formDataImage.append('file', section.section1image);

                    const response = await axios.post(`${data.url}/api/admin/upload/project`, formDataImage, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    return response.data.file; // Assuming the response contains the uploaded image URL
                }
                return section.section1image; // If no file, return the current value (could be URL)
            });

            const section2ImagePromises = formData.sections2.map(async (section) => {
                if (section.section2image instanceof File) {
                    const formDataImage = new FormData();
                    formDataImage.append('file', section.section2image);

                    const response = await axios.post(`${data.url}/api/admin/upload/project`, formDataImage, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    return response.data.file; // Assuming the response contains the uploaded image URL
                }
                return section.section2image; // If no file, return the current value (could be URL)
            });

            // Wait for all image uploads to complete
            const galleryImageUrls = await Promise.all(galleryImagePromises);
            const section1ImageUrls = await Promise.all(section1ImagePromises);
            const section2ImageUrls = await Promise.all(section2ImagePromises);

            // Update sections and gallery with the uploaded image URLs
            const updatedGallery = formData.gallery.map((image, index) => ({
                ...image,
                galleryimage: galleryImageUrls[index] 
            }));

            const updatedSections1 = formData.sections1.map((section, index) => ({
                ...section,
                section1image: section1ImageUrls[index] 
            }));

            const updatedSections2 = formData.sections2.map((section, index) => ({
                ...section,
                section2image: section2ImageUrls[index] 
            }));


             // 🔹 4️⃣ **Prepare Updated Data (Avoid State Delay)**
            //  const updatedData = {
            //     ...formData,
            //     gallery: formData.gallery.map((img, i) => ({
            //         galleryimage: updatedGallery[i],  // Ensure it's a string
            //         alt: img.alt || ""  // Keep alt if needed
            //     })),
            //     sections1: formData.sections1.map((img, i) => ({
            //         ...img,
            //         section1image: updatedSections1[i]  // Ensure it's a string
            //     })),
            //     sections2: formData.sections2.map((img, i) => ({
            //         ...img,
            //         section2image: updatedSections2[i]  // Ensure it's a string
            //     }))
            // };

            // Update formData with the new image URLs
            const updatedFormData = {
                ...formData,
                gallery: updatedGallery,
                sections1: updatedSections1,
                sections2: updatedSections2
            };
    
            setFormData(updatedFormData);
            console.log(updatedFormData)

            // Send the updated form data to your API
            const response = await axios.put(`${data.url}/api/admin/project/${EditProject._id}`, updatedFormData);
            console.log(response)
            // if (response.data.success) {
            //     console.log('Project added successfully:', response.data);
            //     // Handle success (e.g., redirect, show success message, etc.)
            // } else {
            //     console.error('Error adding project:', response.data);
            //     // Handle error (e.g., show error message)
            // }
        } catch (error) {
            console.error('Error in form submission:', error);
            // Handle error (e.g., show error message)
        }
    };


    useEffect(() => {
        console.log(ImagesToDlt)
        if (ImagesToDlt.length > 0) {
            alert('Image to delete');
        }
    }, [ImagesToDlt]); // Watches for changes in the images array of ImagesToDlt

    // Render the form based on the current step
    return (
        <div className="w-full max-w-4xl m-2 mx-auto bg-white rounded-lg p-6">
            <form onSubmit={handleSubmit} className=" max-h-[500px] overflow-y-auto">
                {step === 1 && (
                    <div className="mt-10 bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-center">Update Project </h2>
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
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <span className="text-gray-700">Choose a file</span>
                            </label>
                            {/* Display Image Previews with Alt Inputs */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {formData.gallery ? formData.gallery.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative flex flex-col items-center space-y-2 group"
                                    >
                                        {/* Image */}
                                        <img
                                            src={image.galleryimage instanceof File ? URL.createObjectURL(image.galleryimage) : `${data.url}/Images/project/${image.galleryimage}`}
                                            alt={image.alt || "Uploaded image"}
                                            className="h-32 w-full object-cover rounded-lg border"
                                        />

                                        {/* Remove Button (only visible on hover) */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 text-sm text-white bg-red-600 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Remove
                                        </button>

                                        {/* Alt Text Input */}
                                        <input
                                            type="text"
                                            placeholder="Enter alt text"
                                            name="alt"
                                            value={image.alt}
                                            onChange={(e) => handleAltChange(index, e.target.value)}
                                            className="w-full px-2 py-1 border rounded-md"
                                        />
                                    </div>
                                )) : null}





                            </div>
                        </div>

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

                            {/* Product Subtitle */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Product Subtitle</label>
                                <input
                                    type="text"
                                    name="productsubtitle"
                                    value={formData.productsubtitle}
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

                            {/* Product Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Product Description</label>
                                <textarea
                                    name="productdesc"
                                    value={formData.productdesc}
                                    onChange={handleChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>
                        {/* Sections 1 */}
                        <h3 className="text-lg font-semibold mt-6 mb-2">Sections 1</h3>
                        {formData.sections1.map((section, index) => (
                            <div key={index} className="mb-6 p-4 rounded-lg shadow-sm">

                                <div>
                                    {/* Image */}
                                    <div className="mb-2">
                                        <Typography variant="small" className="font-medium">
                                            Section Image
                                        </Typography>
                                        <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                                            <input
                                                type="file"
                                                name="section1image"
                                                // value={section.section1image}
                                                onChange={(e) => handleSectionChange(e, "sections1", index)}
                                                className="hidden"
                                            />
                                            <span className="text-gray-700">Choose a file</span>
                                        </label>
                                    </div>

                                    <div className="w-full mb-4">
                                        {/* Image Preview */}
                                        {section.section1image ? (
                                            section.section1image instanceof File ? (
                                                // If section.section1image is a File, show the preview
                                                <img
                                                    src={URL.createObjectURL(section.section1image)}
                                                    alt={section.alt || `Gallery image ${index + 1}`}
                                                    className="w-full h-50 object-cover rounded-lg"
                                                />
                                            ) : (
                                                // If section.section1image is not a File, show the image from the URL
                                                <img
                                                    src={`${data.url}/Images/project/${section.section1image}`}
                                                    alt={section.alt || `Gallery image ${index + 1}`}
                                                    className="w-full h-50 object-cover rounded-lg"
                                                />
                                            )
                                        ) : (
                                            // Fallback if section.section1image is not available
                                            <p>No image available</p>
                                        )}
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
                                    {/* Section Type */}
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Section Type</label>
                                        <input
                                            type="text"
                                            name="sectiontype"
                                            value={section.sectiontype}
                                            onChange={(e) => handleSectionChange(e, "sections1", index)}
                                            className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

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
                                                onChange={(e) => handleSectionChange(e, "sections2", index)}
                                                className="hidden"
                                            />
                                            <span className="text-gray-700">choose a file</span>
                                        </label>
                                    </div>

                                    <div className="w-full  mb-4">
                                        {/* Image Preview */}
                                        {section.section2image ? (
                                            section.section2image instanceof File ? (
                                                <img
                                                    src={URL.createObjectURL(section.section2image)}
                                                    alt={section.alt || `Gallery image ${index + 1}`}
                                                    className="w-full h-50 object-cover rounded-lg"
                                                />
                                            ) : (
                                                // If section.section1image is not a File, show the image from the URL
                                                <img
                                                    src={`${data.url}/Images/project/${section.section2image}`}
                                                    alt={section.alt || `Gallery image ${index + 1}`}
                                                    className="w-full h-50 object-cover rounded-lg"
                                                />
                                            )
                                        ) : (
                                            <p>no image available</p>
                                        )}

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
                                        <label className="block text-sm font-medium text-gray-700">Section Name</label>
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
