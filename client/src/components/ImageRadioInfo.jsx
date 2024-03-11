import React, { useState } from 'react';
import GetTextImage from '../Pages/GetTextImage';
import GetMetaImage from '../Pages/GetMetaImage';
import RemoveBackground from '../Pages/RemoveBackground';

const ImageRadioInfo = () => {

    const [selectedOption, setSelectedOption] = useState('');

    const handleRadioChange = (e) => {
        setSelectedOption(e.target.value);
    };

    return (
        <>
            <div className='container'>
                <h1 className='title'>Choose Image Type Process:</h1>
                <div className="radio">
                    <input
                        value="metadata"
                        name="image"
                        id="metadata"
                        type="radio"
                        label="Get Image Meta Data"
                        onChange={handleRadioChange}
                    />

                    <input
                        value="textdata"
                        name="image"
                        id="textdata"
                        type="radio"
                        label="Get Text from an Image"
                        onChange={handleRadioChange}
                    />

                    <input
                        value="bgremove"
                        name="image"
                        id="bgremove"
                        type="radio"
                        label="Remove Background from Image"
                        onChange={handleRadioChange}
                    />
                </div>
            </div>

            {selectedOption === 'metadata' && <GetMetaImage />}
            {selectedOption === 'textdata' && <GetTextImage />}
            {selectedOption === 'bgremove' && <RemoveBackground />}
        </>
    )
}

export default ImageRadioInfo;