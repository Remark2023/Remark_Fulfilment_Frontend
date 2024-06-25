/* eslint-disable import/no-dynamic-require */
/* eslint-disable react/jsx-key */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable global-require */

import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { getImageService } from '../Services/ApiServices';
import { useUser } from '../context/UserContext';
// Import the images at the beginning of your file

const ShowImages = () => {
  const { user } = useUser();
  console.log(user);
  const [imageList, setImageList] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        console.log(user);
        if (user) {
          const images = await getImageService(user);
          console.log(images.data);
          setImageList(images.data);
          console.log(images);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, [user]);

  console.log(imageList);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      <h2>Image Gallery</h2>
      <div className="image-container">
        <Slider {...sliderSettings}>
          {/* {imageList.length > 0 ? ( */}
          {imageList.map((image, index) => (
            <div key={index} className="image-item">
              <img
                // src={require(`../../../../OSMS/osms-frontend/src/Resources/Images/${image}`)}
                // src={require(`../../src/resources/img/${image}`)}
                alt={'Promotion'}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ShowImages;
