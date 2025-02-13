import React, { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import Quill from "quill";
import ImageCompress from "quill-image-compress"; // Import ImageCompress module

// Register the module
Quill.register("modules/imageCompress", ImageCompress);


const BlogEditor = ({ handleChange, detaildesc }) => {
    const quillRef = useRef(null);

    
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            ["clean"],
            ["image"], // Enables image upload
        ],

        
        imageCompress: {
            quality: 0.7, // Adjust image quality (0.1 - 1)
            maxWidth: 1000, // Max width
            maxHeight: 1000, // Max height
            imageType: "image/jpeg", // Image format
            debug: true, // Enable debugging
            handleOnPaste: true, // Compress pasted images
          },
    };

    return (
        <div>
            <label htmlFor="Detail description" className="block text-sm font-medium text-gray-700">
                Detail Description
            </label>
            <ReactQuill
                theme="snow"
                name="detaildesc"
                value={detaildesc}
                onChange={handleChange}
                modules={modules}
                ref={quillRef}
                placeholder="Write your blog here..."
            />
        </div>
    );
};

export default BlogEditor;
