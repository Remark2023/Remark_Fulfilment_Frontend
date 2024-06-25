/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useRef, useState } from 'react';
import { uploadImageService } from '../Services/ApiServices';
import { useUser } from '../context/UserContext';

const UploadImages = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [progressInfos, setProgressInfos] = useState({ val: [] });
  const [message, setMessage] = useState([]);
  const [imageInfos, setImageInfos] = useState([]);
  const progressInfosRef = useRef(null);
  const { user } = useUser();

  const selectFiles = (event) => {
    const images = [];

    for (let i = 0; i < event.target.files.length; i++) {
      images.push(URL.createObjectURL(event.target.files[i]));
    }

    setSelectedFiles(event.target.files);
    setImagePreviews(images);
    setProgressInfos({ val: [] });
    setMessage([]);
  };

  const uploadImages = async () => {
    console.log(selectedFiles[0]);
    const selectedFile = selectedFiles[0];
    if (selectedFile) {
      console.log('Selected file:', selectedFile);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await uploadImageService(user, formData);
      if (response.status === 200) {
        alert('Successfully Added');
      } else {
        alert('Failed.');
      }
    }

    const files = Array.from(selectedFiles);
    console.log(files);
    const result = uploadImageService(user, files);
  };

  return (
    <div>
      <div className="row">
        <div className="col-8">
          <label className="btn btn-default p-0">
            <input type="file" multiple accept="image/*" onChange={selectFiles} />
          </label>
        </div>

        <div className="col-4">
          <button className="btn btn-success btn-sm" disabled={!selectedFiles} onClick={uploadImages}>
            Upload
          </button>
        </div>
      </div>

      {progressInfos &&
        progressInfos.val.length > 0 &&
        progressInfos.val.map((progressInfo, index) => (
          <div className="mb-2" key={index}>
            <span>{progressInfo.fileName}</span>
            <div className="progress">
              <div
                className="progress-bar progress-bar-info"
                role="progressbar"
                aria-valuenow={progressInfo.percentage}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: `${progressInfo.percentage}%` }}
              >
                {progressInfo.percentage}%
              </div>
            </div>
          </div>
        ))}

      {imagePreviews && (
        <div>
          {imagePreviews.map((img, i) => (
            <img className="preview" src={img} alt={`image-${i}`} key={i} />
          ))}
        </div>
      )}

      {message.length > 0 && (
        <div className="alert alert-secondary mt-2" role="alert">
          <ul>
            {message.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadImages;
