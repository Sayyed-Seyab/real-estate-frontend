import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const BlogEditor = () => {
    const [content, setContent] = useState("");

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }], // Headers (h1, h2, h3)
            ["bold", "italic", "underline", "strike"], // Text formatting
            [{ list: "ordered" }, { list: "bullet" }], // Lists
            ["link", "image", "video"], // Media
            ["clean"], // Remove formatting
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        "image",
        "video",
    ];

    return (
        <div>
            <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Write your blog here..."
            />
            <div className="mt-4">
                <h3>Preview:</h3>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
};

export default BlogEditor;