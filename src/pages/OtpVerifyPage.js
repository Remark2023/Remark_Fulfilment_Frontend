import { useState } from "react";

const OtpVerifyPage = () => {
    const [otp, setOtp] = useState(new Array(4).fill(""));

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        //Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    return (
        <>
            

          

            <div className="row">
                <div className="col text-center">
                    <h2>Welcome to the otp varification process!!!</h2>
                    <p>Enter the OTP sent to you to verify your identity</p>

                    {otp.map((data, index) => {
                        return (
                            <input
                                className="otp-field"
                                type="text"
                                style={{
                                    border: '3px solid #ccc',
                                    borderRadius: '55px', // This sets the border radius to create a box shape
                                    padding: '0px',
                                    height:"55px",
                                    width:"90px"
                                  }}
                                name="otp"
                                maxLength="1"
                                key={index}
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onFocus={e => e.target.select()}
                            />
                        );
                    })}

                    <p>OTP Entered - {otp.join("")}</p>
                    
                </div>
            </div>
        </>
    );
};

export default OtpVerifyPage;