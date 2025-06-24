import React, { useEffect } from 'react';
import { useFiles } from '../../hooks/useFiles'; // Adjust path as necessary
import type { FileMetadata } from '../../types/file.ts'; // Adjust path as necessary
// import { Lightbox } from "yet-another-react-lightbox"; // Conceptual, user would install
// import "yet-another-react-lightbox/styles.css";

interface ImageGalleryProps {
  entityType: string;
  entityId: number | string;
  bucketName?: string; // Optional: filter by a specific bucket if entity files are in multiple
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
    entityType,
    entityId,
    bucketName,
    className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
}) => {
  const { files, loading, error } = useFiles(entityType, entityId, bucketName, undefined, 1, 20); // Remove fetchFiles

  // State for lightbox (conceptual)
  // const [lightboxOpen, setLightboxOpen] = useState(false);
  // const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    // fetchFiles hook now handles initial fetch based on prop changes
  }, [entityType, entityId, bucketName]); // Refetch if these change

  if (loading && files.length === 0) return <p className="text-gray-500">Loading gallery...</p>;
  if (error) return <p className="text-red-500">Error loading images: {error.message}</p>;
  if (!files || files.length === 0) return <p className="text-gray-500 text-sm">No images in this gallery yet.</p>;

  const imageFiles = files.filter(file => file.mime_type?.startsWith('image/'));
  // const nonImageFiles = files.filter(file => !file.mime_type?.startsWith('image/')); // For a mixed FileList

  // const lightboxSlides = imageFiles.map(file => ({ src: file.public_url || '' }));

  // const openLightbox = (index: number) => {
  //   setLightboxIndex(index);
  //   setLightboxOpen(true);
  // };

  if (imageFiles.length === 0) return <p className="text-gray-500 text-sm">No images found for this entity.</p>;


  return (
    <div className="mt-4">
      <div className={className}>
        {imageFiles.map((file: FileMetadata) => (
          <div
            key={file.id}
            className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer"
            // onClick={() => openLightbox(index)} // Conceptual lightbox trigger
          >
            <img
              src={file.public_url || `https://via.placeholder.com/300?text=${encodeURIComponent(file.file_name)}`}
              alt={file.title || file.file_name}
              className="w-full h-full object-cover"
            />
            {file.title && <p className="text-xs text-center p-1 bg-black bg-opacity-50 text-white truncate">{file.title}</p>}
          </div>
        ))}
      </div>
      {/* Conceptual Lightbox integration
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxSlides}
          index={lightboxIndex}
        />
      )}
      */}

      {/* Placeholder for non-image files if this were a general FileList */}
      {/* {nonImageFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-2">Other Documents:</h4>
          <ul className="list-disc pl-5">
            {nonImageFiles.map(file => (
              <li key={file.id} className="text-sm">
                <a href={file.public_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  {file.file_name} ({Math.round(file.size_bytes / 1024)} KB)
                </a>
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default ImageGallery;
