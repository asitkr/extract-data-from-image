import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBackgroundRemoveImage } from '../redux/slices/BackgroundRemoveSlice';

const RemoveBackground = () => {

    const dispatch = useDispatch();
    const imageMetaData = useSelector(state => state.metaImage.imageMetaData);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isBgModalOpen, setIsBgModalOpen] = useState(false);

    const openModalBg = () => {
        setIsBgModalOpen(true);
    };

    const closeModalBg = () => {
        setIsBgModalOpen(false);
    };

    const handleBgFile = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);
        }
    }

    const handleBgRemove = (e) => {
        e.preventDefault();

        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            dispatch(fetchBackgroundRemoveImage({ data: formData }));
        }
    }
    return (
        <>
            <form onSubmit={handleBgRemove}>
                <div className="input-div">
                    <input className="input" name="file" type="file" onChange={handleBgFile} />
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth="2" fill="none" stroke="currentColor" className="icon"><polyline points="16 16 12 12 8 16"></polyline><line y2="21" x2="12" y1="12" x1="12"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
                </div>
                <div className='button__div'>
                    <button type='submit'>Upload</button>
                </div>
            </form>
        </>
    )
}

export default RemoveBackground;