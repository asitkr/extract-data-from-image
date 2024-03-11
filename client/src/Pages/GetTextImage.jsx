import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTextFromImage } from '../redux/slices/TextImageSlice';
import toast from 'react-hot-toast';

const GetTextImage = () => {

    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isTextModalOpen, setIsTextModalOpen] = useState(false);
    const texImageData = useSelector(state => state.textImage.texImageData)

    const openModalText = () => {
        setIsTextModalOpen(true);
    };

    const closeModalText = () => {
        setIsTextModalOpen(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            dispatch(fetchTextFromImage({ data: formData }));
        }
    }

    useEffect(() => {
        // if (texImageData) {
        //     console.log(texImageData);
        // }

        if (texImageData?.status && texImageData?.statusCode === 200) {
            toast.success(texImageData?.message);
            openModalText();
        }
    }, [texImageData])

    return (
        <>
            <form onSubmit={handleUpload}>
                <div className="input-div">
                    <input className="input" name="file" type="file" onChange={handleFileChange} />
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth="2" fill="none" stroke="currentColor" className="icon"><polyline points="16 16 12 12 8 16"></polyline><line y2="21" x2="12" y1="12" x1="12"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
                </div>
                <div className='button__div'>
                    <button type='submit'>Upload</button>
                </div>
            </form>

            {
                isTextModalOpen && (
                    <div className="modal-overlay" open={isTextModalOpen}>
                        <div className="modal">
                            <button className="close_btn" onClick={closeModalText}>
                                &times;
                            </button>
                            <p><strong>Text:</strong> {texImageData?.text?.replace(/[^\w\s]/gi, '')}</p>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default GetTextImage;