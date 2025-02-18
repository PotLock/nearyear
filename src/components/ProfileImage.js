import Image from "next/image";
import { useState } from "react"; // Add missing import

const ProfileImage = ({ 
    accountId, 
    width = 96, // Default value
    height = 96, // Default value
    className = "rounded-full border-4 border-blue-100", // Default styling
    fallbackImage // Optional custom fallback
}) => {
    const [isError, setIsError] = useState(false);

    const handleImageError = () => {
        if (!isError) {
            setIsError(true);
        }
    };

    if (!accountId) return null;

    const imageSource = isError
        ? fallbackImage || `https://robohash.org/${accountId}.png`
        : `https://i.near.social/magic/thumbnail/https://near.social/magic/img/account/${accountId}`;

    return (
        <Image
            src={imageSource}
            alt={`Profile image for ${accountId}`}
            width={width}
            height={height}
            className={className}
            onError={handleImageError}
        />
    );
};

export default ProfileImage;