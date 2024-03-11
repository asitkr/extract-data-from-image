import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMetaFromImage } from '../redux/slices/MetaImageSlice';
import toast from 'react-hot-toast';

const GetMetaImage = () => {

    const dispatch = useDispatch();
    const imageMetaData = useSelector(state => state.metaImage.imageMetaData);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);

    const openModalMeta = () => {
        setIsMetaModalOpen(true);
    };

    const closeModalMeta = () => {
        setIsMetaModalOpen(false);
    };

    const handleFileChangeMeta = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);
        }
    }

    const handleUploadMetaData = (e) => {
        e.preventDefault();

        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            dispatch(fetchMetaFromImage({ data: formData }));
        }
    }

    useEffect(() => {
        if (imageMetaData) {
            console.log(imageMetaData);
        }

        if (imageMetaData?.status && imageMetaData?.statusCode === 200) {
            toast.success(imageMetaData?.message);
            openModalMeta();
        }
    }, [imageMetaData])


    return (
        <>
            <form onSubmit={handleUploadMetaData}>
                <div className="input-div">
                    <input className="input" name="file" type="file" onChange={handleFileChangeMeta} />
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth="2" fill="none" stroke="currentColor" className="icon"><polyline points="16 16 12 12 8 16"></polyline><line y2="21" x2="12" y1="12" x1="12"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
                </div>
                <div className='button__div'>
                    <button type='submit'>Upload</button>
                </div>
            </form>

            {
                isMetaModalOpen && (
                    <div className="modal-overlay" open={isMetaModalOpen}>
                        <div className="modal">
                            <button className="close_btn" onClick={closeModalMeta}>
                                &times;
                            </button>
                            <h1 style={{
                                fontSize: 25,
                                fontWeight: 700,
                                textAlign: 'center',
                                paddingBottom: 4
                            }}>Image Meta Data</h1>
                            {
                                imageMetaData && imageMetaData?.metadata?.data?.map((item, index) => (
                                    <div key={index}>
                                        <p>
                                            <strong>SourceFile:</strong>&nbsp;
                                            {item?.SourceFile}
                                        </p>
                                        <p>
                                            <strong>FileName:</strong>&nbsp;
                                            {item?.FileName}
                                        </p>
                                        <p>
                                            <strong>MIMEType:</strong>&nbsp;
                                            {item?.MIMEType}
                                        </p>
                                        <p>
                                            <strong>FileSize:</strong>&nbsp;
                                            {item?.FileSize}
                                        </p>
                                        <p>
                                            <strong>FileType:</strong>&nbsp;
                                            {item?.FileType}
                                        </p>
                                        <p>
                                            <strong>FileTypeExtension:</strong>&nbsp;
                                            {item?.FileTypeExtension}
                                        </p>
                                        <p>
                                            <strong>ImageWidth:</strong>&nbsp;
                                            {item?.ImageWidth}
                                        </p>
                                        <p>
                                            <strong>ImageHeight:</strong>&nbsp;
                                            {item?.ImageHeight}
                                        </p>
                                        <p>
                                            <strong>BitDepth:</strong>&nbsp;
                                            {item?.BitDepth}
                                        </p>
                                        <p>
                                            <strong>ColorType:</strong>&nbsp;
                                            {item?.ColorType}
                                        </p>
                                        <p>
                                            <strong>ImageSize:</strong>&nbsp;
                                            {item?.ImageSize}
                                        </p>
                                        <p>
                                            <strong>Megapixels:</strong>&nbsp;
                                            {item?.Megapixels}
                                        </p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default GetMetaImage;