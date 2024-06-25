import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTypography,
} from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';
import { uploadProfilePhoto } from '../Services/ApiServices';
import { getAccountDetailsService } from '../Services/GetAccountsDetails';
// components
import Iconify from '../components/iconify';
// external css
import '../_css/ProfilePage.css';

export default function ProfilePage() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const accountDetails = await getAccountDetailsService();
        setProfile(accountDetails);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const uplodPhoto = async (event) => {
    const selectedFile = event.target.files[0]; 

    if (selectedFile) {
      console.log('Selected file:', selectedFile);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await uploadProfilePhoto(profile.email, formData);

      const alertMessage = response.status === 200 ? response.data.message : 'Upload failed! Try again';

      alert(alertMessage);
      // window.location.reload();
    }
  };

  return (
    <div className="gradient-custom-2" style={{ backgroundColor: 'rgba(145, 158, 171, 0.12)' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard>
              <div
                className="rounded-top text-white d-flex flex-row"
                style={{ backgroundColor: 'darkcyan', height: '200px' }}
              >
                <div className="ms-4 mt-5 d-flex flex-column" id="container" style={{ width: '150px' }}>
                  <MDBCardImage
                    src={profile.dpurl}
                    alt="No image found"
                    className="mt-4 mb-2 img-thumbnail"
                    id="image"
                    fluid
                    style={{ width: '150px', zIndex: '1', maxHeight: '155px', minHeight: '155px' }}
                  />
                  <label className="btn btn-outline-secondary" style={{ zIndex: 1 }} htmlFor='fileInput'>
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      id="fileInput" 
                      onChange={e => uplodPhoto(e)}
                    />
                    <Iconify icon={'mdi:camera'} className="icon" />
                    Upload Photo
                  </label>
                </div>
                <div className="ms-3" style={{ marginTop: '130px' }}>
                  <MDBTypography tag="h5">{profile.name}</MDBTypography>
                  <MDBCardText>{profile.role}</MDBCardText>
                </div>
              </div>
              <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <MDBCardText className="mb-1 h5">253</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Photos</MDBCardText>
                  </div>
                  <div className="px-3">
                    <MDBCardText className="mb-1 h5">1026</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                  </div>
                  <div>
                    <MDBCardText className="mb-1 h5">478</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Following</MDBCardText>
                  </div>
                </div>
              </div>
              <MDBCardBody className="text-black p-4">
                <div className="mb-5">
                  <p className="lead fw-normal mb-1">Personal Informations</p>
                  <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Field</th>
                          <th scope="col">Info</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Email</td>
                          <td>{profile.email}</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Phone</td>
                          <td>{profile.phone}</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Profession</td>
                          <td>{profile.profession}</td>
                        </tr>
                        <tr>
                          <th scope="row">4</th>
                          <td>Address</td>
                          <td>{profile.address}</td>
                        </tr>
                        <tr>
                          <th scope="row">5</th>
                          <td>Age</td>
                          <td>{profile.age}</td>
                        </tr>
                        <tr>
                          <th scope="row">6</th>
                          <td>Gender</td>
                          <td>{profile.gender}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
