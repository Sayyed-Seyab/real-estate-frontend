import { StoreContext } from "@/context/Context";
import { Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";

const AddProjectForm = () => {
    const navigate = useNavigate()
    const { data, Token,  ProjectCategories,GetProjectCategories, SetTostMsg, Isloading, setIsloading } = useContext(StoreContext)
    const [step, setStep] = useState(1); // Track the current part of the form
    const [previewgallery, setpreviewgallery] = useState({
        gallery: ""
    })
    const [formData, setFormData] = useState({
        template:null,
        categories: [],
        name: "",
        price: "",
        area: "",
        address: "",
        accomodation: "",
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
        pdfFile:"",
        sections1: [{ file:"", sectiontype: "", title: "", subtitle: "", desc: "", gallery: [], section1alt: "" }],
        section2title: " ",
        section2subtitle: " ",
        section2desc: " ",
        sections2: [{ sectiontype: "", name: "", desc: "", section2image: "", section2alt: "" }],
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [projectParent] = useState([{ _id: "1", name: "Parent 1" }, { _id: "2", name: "Parent 2" }]);
    const [eixstfile, setfile] = useState(false)
    const step1Ref = useRef(null); // Ref for step 1 container
    const step2Ref = useRef(null); // Ref for step 2 container
    const [errors, setErrors] = useState({});


    // Scroll the container when step changes
    useEffect(() => {
        GetProjectCategories()
        if (step === 1 && step1Ref.current) {
            step1Ref.current.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll step 1 container
        } else if (step === 2 && step2Ref.current) {
            step2Ref.current.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll step 2 container
        }
    }, [step]);

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
                headers: {
                   
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
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

            await axios.delete(`${data.url}/api/admin/upload/project/${imageUrl}`, {
                headers: {
                  
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            });

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
                headers: {
                   
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
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
                headers: {
                    
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
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
            await axios.delete(`${data.url}/api/admin/upload/project/${imageUrl}`, {
                headers: {
                    
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            })

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
                headers: {
                  
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
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

    //  const handleSection1AltChange = (index, value) => {
    //     const updatedGallery = formData.sections1.gallery.map((item, idx) => {

    //         if (idx === index) {

    //             return { ...item, alt: value }; // Update alt text for specific image

    //         }
    //         return item;
    //     });

    //     setFormData((prev) => ({
    //         ...prev,
    //         gallery: updatedGallery,
    //     }));
    // };

    const handleSecAltChange = (e, sectionIndex, imgIndex) => {
    const { value } = e.target;

    setFormData((prevData) => {
        const updatedSections = [...prevData.sections1];
        const updatedGallery = [...updatedSections[sectionIndex].gallery];

        // Ensure we're only updating the alt text of the specific image
        updatedGallery[imgIndex] = {
            ...updatedGallery[imgIndex],
            section1alt: value,
        };

        updatedSections[sectionIndex] = {
            ...updatedSections[sectionIndex],
            gallery: updatedGallery,
        };

        return {
            ...prevData,
            sections1: updatedSections,
        };
    });
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

    const validateStep1 = () => {
        let newErrors = {};
        if (!formData.template) newErrors.template = "Project type is required";
        if (!formData.name) newErrors.name = "Project Name is required";
        if (formData.gallery.length == 0) newErrors.gallery = "Project gallery is required";
        if (formData.categories.length == 0) newErrors.categories = "Project categories is required";
        if (formData.status == null) newErrors.status = "Project status is required";
        if (!formData.price) newErrors.price = "Project Price is required";
        if (!formData.area) newErrors.area = "Project Area is required";
        if (!formData.address) newErrors.address = "Project Address is required";
        if (!formData.accomodation) newErrors.accomodation = "Project Accomodation is required";


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const validateStep2 = () => {
        let newErrors = {};

        if (!formData.producttitle) newErrors.producttitle = "Product Title is required";
        if (!formData.productplantitle) newErrors.productplantitle = "Product Plan Title is required";
        if (!formData.amenitytitle) newErrors.amenitytitle = "Amenity Title is required";
        if (!formData.amenitydesc) newErrors.amenitydesc = "Amenity Description is required";



        formData.sections1.forEach((section, index) => {
            if (!section.sectiontype) {
                newErrors[`sectiontype_${index}`] = "Selection type is required.";
            }
            if (!section.gallery || section.gallery.length === 0) {
                newErrors[`gallery_${index}`] = "At least one image is required.";
            }
            // if (!section.section1alt) {
            //     newErrors[`section1alt_${index}`] = "Image Alt text is required.";
            // }
            if (!section.title) {
                newErrors[`title_${index}`] = "Title is required.";
            }
        });



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };



    // Handle navigation between parts
    const nextStep = () => {
        if (validateStep1()) {
            setStep((prevStep) => prevStep + 1);
            forceScrollToTop()
        }


    };

    const prevStep = () => {
        setStep((prevStep) => prevStep - 1);
        forceScrollToTop()
    };

    const forceScrollToTop = () => {
        // Temporarily increase the body height to ensure scrolling works
        document.body.style.minHeight = '101vh'; // Slightly more than 100vh
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reset the body height after a short delay
        setTimeout(() => {
            document.body.style.minHeight = '';
        }, 500); // Adjust the delay as needed
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

    const UploadFile = async (e)=>{
         const file = e.target.files[0]; // Get the selected file
        if (!file) return;
        const fileData = new FormData();
        fileData.append("file", file);
         try {
            const response = await axios.post(`${data.url}/api/admin/upload/project`, fileData, {
                headers: {
                  
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            });

            if (response.data.success) {
                const fileUrl = response.data.file; // Get uploaded file URL

                setFormData((prevData) => ({
                    ...prevData,
                    pdfFile: fileUrl
    }));
                toast.success("File uploaded successfully!");
                console.log("Uploaded File URL:", fileUrl);
            } else {
                toast.error("File upload failed.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Error uploading file.");
        }
    }


    // Handle File Upload
    const handleFileUpload = async (e, index) => {
        const file = e.target.files[0]; // Get the selected file
        if (!file) return;

        const fileData = new FormData();
        fileData.append("file", file);

        try {
            const response = await axios.post(`${data.url}/api/admin/upload/project`, fileData, {
                headers: {
                  
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            });

            if (response.data.success) {
                const fileUrl = response.data.file; // Get uploaded file URL

                setFormData((prevData) => {
        const updatedSections = [...prevData.sections1]; // Copy sections array
        updatedSections[index] = { 
            ...updatedSections[index], 
            file: fileUrl  // Assign the file object
        };

        return {
            ...prevData,
            sections1: updatedSections, // Update the sections1 array
        };
    });
                toast.success("File uploaded successfully!");
                console.log("Uploaded File URL:", fileUrl);
            } else {
                toast.error("File upload failed.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Error uploading file.");
        }
    };


    const handleDeleteFile = async () => {
        if (!formData.file) {
            alert("No file to delete");
            return;
        }

        try {
            const response = await axios.delete(`${data.url}/api/admin/upload/project/${formData.file}`, {
                headers: {
                   
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            });

            if (response.data.success) {
                setFormData((prev) => ({ ...prev, file: "" })); // Remove file from formData
                alert("File deleted successfully!");
            } else {
                alert("Error deleting file");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert("Error deleting file");
        }
    };


     const handleDeletepdfFile = async () => {
        if (!formData.pdfFile) {
            alert("No file to delete");
            return;
        }

        try {
            const response = await axios.delete(`${data.url}/api/admin/upload/project/${formData.pdfFile}`, {
                headers: {
                   
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            });

            if (response.data.success) {
                setFormData((prev) => ({ ...prev, pdfFile: "" })); // Remove file from formData
                alert("File deleted successfully!");
            } else {
                alert("Error deleting file");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert("Error deleting file");
        }
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true)

        if (!validateStep2()) {
             setIsloading(false)
            return;
             setIsloading(false)
        }

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
            const response = await axios.post(`${data.url}/api/admin/project`, formData , {
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            });
            console.log(response.data.message)
            if (response.data.success) {
                console.log('Project added successfully:', response.data);
                SetTostMsg(response.data.message);
                navigate('/dashboard/project')
                setIsloading(false)
                // Handle success (e.g., redirect, show success message, etc.)
            } else {
                toast.error(response.data.message);
                 setIsloading(false)
               
                // Handle error (e.g., show error message)
            }
        } catch (error) {
            console.error('Error in form submission:', error);
             setIsloading(false)
             toast.error('error occured')
             console.log(error)
            // Handle error (e.g., show error message)
        }
    };


    // Render the form based on the current step
    return (
        <div>
            {
                Isloading ? (
<div>
        <Loader/>
     </div>
                ) : (
<div className="w-full max-w-4xl m-2 mx-auto bg-white rounded-lg p-6">
            <form onSubmit={handleSubmit} className="">
                {step === 1 && (
                    <div ref={step1Ref} className="mt-10 bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-center">Add Project </h2>
                        {/* Project Image */}
                        <div className="space-y-2 mb-4">
                            <Typography variant="small" className="font-medium">
                                Project Image*
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
                            {errors.gallery && <p className="text-red-500 text-sm">{errors.gallery}</p>}
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
                        {/* Project type */}
                         <div className="mb-4">
                            <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                                Project type*
                            </label>
                            <select
                                id="categories"
                                name="template"
                                value={formData.template} // Single selected category
                                  onChange={handleChange}
                                className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                                required
                            >
                                <option value="" >
                                    Select project type
                                </option>
                             
                                    <option  value='1'>Appartment</option>
                                    <option  value='2'>Villas</option>
                             
                            </select>
                            {errors.template && <p className="text-red-500 text-sm">{errors.template}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                                Project Categories*
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
                            {errors.categories && <p className="text-red-500 text-sm">{errors.categories}</p>}
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
                                <label className="block text-sm font-medium text-gray-700">Category Status*</label>
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
                                    {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                                </div>
                            </div>






                            {/* Project Name */}
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Project Name*
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
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

                            {/* Project Price */}
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Project Price*
                                </label>
                                <input
                                    type="text"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                            </div>

                            {/* Project Area */}
                            <div className="mb-4">
                                <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                                    Project Area*
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
                                {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
                            </div>

                            {/* Project Address */}
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Project Address*
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
                                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                            </div>

                            {/* Project accomodation */}
                            <div className="mb-4">
                                <label htmlFor="accomodation" className="block text-sm font-medium text-gray-700">
                                    Project Accomodation*
                                </label>
                                <input
                                    type="text"
                                    id="accomodation"
                                    name="accomodation"
                                    value={formData.accomodation}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.accomodation && <p className="text-red-500 text-sm">{errors.accomodation}</p>}
                            </div>

                            {/* Project accomodation */}
                            <div className="mb-4">
                                <label htmlFor="accomodation" className="block text-sm font-medium text-gray-700">
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
                                {errors.metatitle && <p className="text-red-500 text-sm">{errors.metatitle}</p>}
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
                                {errors.metadesc && <p className="text-red-500 text-sm">{errors.metadesc}</p>}
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
                    <div ref={step2Ref} className="  mt-10 bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Product Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Title */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Product Title*</label>
                                <input
                                    type="text"
                                    name="producttitle"
                                    value={formData.producttitle}
                                    onChange={handleChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"

                                />
                                {errors.producttitle && <p className="text-red-500 text-sm">{errors.producttitle}</p>}
                            </div>

                            {/* Product Plan Title */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Product Plan Title*</label>
                                <input
                                    type="text"
                                    name="productplantitle"
                                    value={formData.productplantitle}
                                    onChange={handleChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.productplantitle && <p className="text-red-500 text-sm">{errors.productplantitle}</p>}
                            </div>

                            {/* Product Subtitle */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Amenties Title*</label>
                                <input
                                    type="text"
                                    name="amenitytitle"
                                    value={formData.amenitytitle}
                                    onChange={handleChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.amenitytitle && <p className="text-red-500 text-sm">{errors.amenitytitle}</p>}
                            </div>


                            {/* Product Description */}
                            <div className="">
                                <label className="block text-sm font-medium text-gray-700">Amenties Description*</label>
                                <textarea
                                    name="amenitydesc"
                                    value={formData.amenitydesc}
                                    onChange={handleChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.amenitydesc && <p className="text-red-500 text-sm">{errors.amenitydesc}</p>}
                            </div>

                            {/* Product Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Nearby title*</label>
                                <input
                                    type="text"
                                    name="nearby"
                                    value={formData.nearby}
                                    onChange={handleChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                />
                                 {errors.nearby && <p className="text-red-500 text-sm">{errors.nearby}</p>}
                            </div>
                            
                            {/* file */}
                             <div className="mb-4">
                                      <label className="block text-sm font-medium text-gray-700">Upload file (optional)</label>
                                    {/* File Upload Input */}
                                    <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                                        <input
                                            type="file"
                                            accept=".pdf,.txt,.doc,.docx" // Restrict file types
                                            onChange={(e)=>UploadFile(e)}
                                            className="hidden"
                                        />
                                        <span className="text-gray-700">Upload File (PDF)</span>
                                    </label>
                                    {/* Show uploaded file URL */}
                                    {formData.pdfFile && (
                                        <div className="mt-4  mb-4">
                                            <p className="text-green-600 font-medium">File Uploaded:</p>
                                            <a href={`${data.url}/Files/${formData.pdfFile}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                {formData.pdfFile}
                                            </a>
                                            {/* Delete File Button */}
                                            <button
                                                onClick={handleDeletepdfFile}
                                                className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    )}
                                </div>

                        </div>
                        {/* Sections 1 */}
                        <h3 className="text-lg font-semibold mt-6 mb-2">Sections*</h3>
                        {formData.sections1.map((section, index) => (
                            <div key={index} className="mb-6 p-4 rounded-lg shadow-sm">
                                <div className="mb-4">
                                      {/* <label className="block text-sm font-medium text-gray-700">Upload file (optional)</label> */}
                                    {/* File Upload Input */}
                                    {/* <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                                        <input
                                            type="file"
                                            accept=".pdf,.txt,.doc,.docx" // Restrict file types
                                            onChange={(e)=>handleFileUpload(e,index)}
                                            className="hidden"
                                        />
                                        <span className="text-gray-700">Upload File (PDF)</span>
                                    </label> */}
                                    {/* Show uploaded file URL */}
                                    {section.file && (
                                        <div className="mt-4  mb-4">
                                            {/* <p className="text-green-600 font-medium">File Uploaded:</p>
                                            <a href={`${data.url}/Files/${section.file}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                {section.file}
                                            </a>
                                            {/* Delete File Button */}
                                            {/* <button
                                                onClick={handleDeleteFile}
                                                className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>  */}

                                        </div>
                                    )}
                                </div>

                                {/* section type */}
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Selection Type*:
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
                                        <option value="Amenties">Amenties</option>
                                        <option value="Nearby">Nearby</option>
                                    </select>
                                    {errors[`sectiontype_${index}`] && (
                                        <p className="text-red-500 text-sm">{errors[`sectiontype_${index}`]}</p>
                                    )}
                                </div>


                                <div>
                                    {/* Image */}
                                    <div className="mb-2">
                                        <Typography variant="small" className="font-medium">
                                            Section Image*
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
                                        {errors[`gallery_${index}`] && (
                                            <p className="text-red-500 text-sm">{errors[`gallery_${index}`]}</p>
                                        )}
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
                                                              {/* Image Alt */}
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Image Alt*</label>
                                        <input
                                            type="text"
                                            name="section1alt"
                                          value={img.section1alt || ""}
                                            onChange={(e) => handleSecAltChange(e, index, imgIndex)}
                                            className="mt-2 p-2 border border-gray-300 rounded-md w-60 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors[`section1alt_${index}`] && (
                                            <p className="text-red-500 text-sm">{errors[`section1alt_${index}`]}</p>
                                        )}
                                    </div>
                                                        </div>
                                                    ) : null // ✅ Skips rendering if no image exists
                                                )}
                                            </div>
                                        ) : null}
                                    </div>




                                  

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">



                                    {/* Title */}
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Title*</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={section.title}
                                            onChange={(e) => handleSectionChange(e, "sections1", index)}
                                            className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors[`title_${index}`] && (
                                            <p className="text-red-500 text-sm">{errors[`title_${index}`]}</p>
                                        )}
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
                                <div className="flex justify-between items-center">
                                    {/* Add Section Button should always be visible */}
                                    <Button
                                        type="button"
                                        onClick={() => addSection("sections1")}
                                        className="p-2 bg-gray-700 text-white rounded-md mt-4 hover:bg-green-600 focus:ring-2 focus:ring-green-500"
                                    >
                                        Add Another Section
                                    </Button>

                                    {/* Remove Section Button inside a mapped section */}
                                    {index > 0 && (
                                        <Button
                                            size="small"
                                            type="button"
                                            onClick={() => removeSection("sections1", index)}
                                            className="p-2 bg-red-500 text-white rounded-md mt-4 hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                                        >
                                            Remove Section
                                        </Button>
                                    )}
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
                )
            }
        </div>
        
    );
};

export default AddProjectForm;
