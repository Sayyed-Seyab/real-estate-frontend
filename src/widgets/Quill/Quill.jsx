import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import imageCompression from "browser-image-compression";

const BlogEditor = ({ handleChange, detaildesc, placeholder }) => {
  const editor = useRef(null);

  // Function to resize & compress images before converting to Base64
//   const handleImageUpload = async (files, callback) => {
//     if (!files.length) return;

//     const options = {
//       maxSizeMB: 0.2, // Compress image to ~200KB max
//       maxWidthOrHeight: 400, // Resize image to max 400px width or height
//       useWebWorker: true,
//       fileType: "image/jpeg", // Convert images to JPEG format
//     };

//     try {
//       // Compress the image
//       const compressedFile = await imageCompression(files[0], options);
//       console.log("Compressed file size:", compressedFile.size / 1024, "KB");

//       // Manually resize image before converting to Base64
//       const resizedImage = await resizeImage(compressedFile, 400);

//       // Convert resized image to Base64
//       const reader = new FileReader();
//       reader.readAsDataURL(resizedImage);
//       reader.onload = () => {
//         callback(reader.result); // Insert resized Base64 image into editor
//       };
//     } catch (error) {
//       console.error("Image processing failed:", error);
//     }
//   };

  // Function to manually resize the image
//   const resizeImage = (file, maxSize) => {
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = (event) => {
//         const img = new Image();
//         img.src = event.target.result;
//         img.onload = () => {
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");

//           let width = img.width;
//           let height = img.height;

//           if (width > maxSize) {
//             height *= maxSize / width;
//             width = maxSize;
//           }

//           canvas.width = width;
//           canvas.height = height;

//           ctx.drawImage(img, 0, 0, width, height);

//           canvas.toBlob((blob) => {
//             resolve(new File([blob], file.name, { type: "image/jpeg" }));
//           }, "image/jpeg", 0.8); // 80% quality JPEG
//         };
//       };
//     });
//   };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
      uploader: {
        // insertImageAsBase64URI: true, // Keep Base64 conversion enabled
        // images: {
        //   upload: (files, callback) => handleImageUpload(files, callback), // Resize before Base64
        // },
      },
      image: {
        openOnDblClick: true, // Enable double-click to edit images
        dragAndDrop: true, // Enable drag and drop
      },
      toolbarSticky: false,
      buttons: "bold,italic,underline,|,image", // Ensure image upload button is present
    }),
    [placeholder]
  );

  return (
    <div>
      <label htmlFor="detail-description" className="block text-sm font-medium text-gray-700">
        Detail Description
      </label>
      <JoditEditor
        ref={editor}
        value={detaildesc}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => handleChange(newContent)}
      />
    </div>
  );
};

export default BlogEditor;
