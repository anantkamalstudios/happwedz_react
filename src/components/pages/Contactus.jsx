
import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import { text } from '@fortawesome/fontawesome-svg-core';
import Swal from 'sweetalert2';

const Contactus = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        // alert('Form submitted successfully!');
        Swal.fire({
            icon:"success",
            text:"Form submitted successfully!",
            timer:1500
        })
    };

    const styles = {
        container: {
            backgroundColor: '#fff',
            minHeight: '100vh',
            padding: '40px 20px',
            fontFamily: 'Arial, sans-serif'
        },
        mainWrapper: {
            maxWidth: '1200px',
            margin: '0 auto'
        },
        row: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: '0 -15px'
        },
        leftCol: {
            flex: '0 0 60%',
            maxWidth: '60%',
            padding: '0 15px'
        },
        rightCol: {
            flex: '0 0 40%',
            maxWidth: '40%',
            padding: '0 15px'
        },
        card: {
            backgroundColor: 'white',
            boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px',
            borderRadius: '8px',
            padding: '30px',
            marginBottom: '20px'
        },
        heading: {
            color: '#d63384',
            fontWeight: 'bold',
            fontSize: '24px',
            marginBottom: '25px',
            marginTop: '0'
        },
        formRow: {
            display: 'flex',
            gap: '15px',
            marginBottom: '20px'
        },
        formGroup: {
            flex: '1',
            marginBottom: '20px'
        },
        label: {
            fontSize: '13px',
            color: '#666',
            marginBottom: '5px',
            display: 'block'
        },
        input: {
            width: '100%',
            padding: '16px 16px',
            borderRadius: '0px',
            backgroundColor: '#fce4ec',
            border: 'none',
            fontSize: '14px',
            boxSizing: 'border-box',
            outline: 'none'
        },
        textarea: {
            width: '100%',
            padding: '10px 12px',
            borderRadius: '4px',
            backgroundColor: '#fce4ec',
            border: '1px solid #f8bbd0',
            fontSize: '14px',
            minHeight: '80px',
            resize: 'vertical',
            boxSizing: 'border-box',
            outline: 'none'
        },
        button: {
            width: '100%',
            backgroundColor: '#d63384',
            color: 'white',
            borderRadius: '4px',
            padding: '12px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px'
        },
        sectionHeading: {
            color: '#d63384',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px',
            marginTop: '0'
        },
        contactBox: {
            backgroundColor: 'white',
            borderRadius: '3px',
            boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 10px 30px',
            padding: '20px',
            marginBottom: '15px'
        },
        contactTitle: {
            fontSize: '20px',
            color: '#d63384',
            marginBottom: '10px',
            marginTop: '0',
            fontWeight: 'bold',
        },
        contactTitleSmall: {
            fontSize: '12px',
            color: '#999',
            marginBottom: '10px',
            marginTop: '0'
        },
        contactInfo: {
            color: '#333',
            marginBottom: '8px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        icon: {
            color: '#d63384',
            fontSize: '16px'
        },
        addressBox: {
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '15px'
        },
        locationTitle: {
            color: '#d63384',
            fontWeight: 'bold',
            marginBottom: '8px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        addressText: {
            fontSize: '13px',
            color: '#666',
            marginBottom: '15px',
            lineHeight: '1.6'
        },
        categorySection: {
            textAlign: 'center',
            padding: '25px',
            marginBottom: '15px'
        },
        categoryHeading: {
            color: '#d63384',
            fontWeight: 'bold',
            marginBottom: '10px',
            fontSize: '30px',
            marginTop: '0',
        },
        categoryText: {
            fontSize: '20px',
            color: '#000',
            lineHeight: '1.7',
            marginBottom: '0'
        },
        appButtons: {
            marginTop: '15px'
        },
        appButton: {
            display: 'block',
            width: '140px',
            marginBottom: '10px'
        },
        appImg: {
            width: '100%',
            height: 'auto'
        }
    };

    const appButtonStyle = {
        ...styles.appButton,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        backgroundColor: '#000', color: '#fff', textDecoration: 'none', padding: '8px 12px'
    };

    const mobileStyles = `
    @media (max-width: 768px) {
      .left-col, .right-col {
        flex: 0 0 100% !important;
        max-width: 100% !important;
      }
      .form-row {
        flex-direction: column;
        gap: 0 !important;
      }
    }
  `;

    return (
        <div style={styles.container}>
            <style>{mobileStyles}</style>
            <div style={styles.mainWrapper}>
                <div style={styles.row}>
                    {/* Left Column - Contact Form */}
                    <div style={styles.leftCol} className="left-col">
                        <div style={styles.card}>
                            <h2 className='fs-40 fw-bold dark-pink-text text-center d-flex justify-content-center'>CONTACT US</h2>
                            <div>
                                <div style={styles.formRow} className="form-row">
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder='First Name'
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder='Last Name'
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            style={styles.input}
                                        />
                                    </div>
                                </div>

                                <div style={styles.formRow} className="form-row">
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder='Email'
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder='Phone'
                                            value={formData.phone}
                                            onChange={handleChange}
                                            style={styles.input}
                                        />
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Message</label>
                                    <textarea
                                        name="message"
                                        placeholder='Message'
                                        value={formData.message}
                                        onChange={handleChange}
                                        style={styles.textarea}
                                    ></textarea>
                                </div>

                                <button onClick={handleSubmit} style={styles.button}>
                                    SUBMIT
                                </button>
                            </div>
                        </div>

                        {/* Vendors Section */}
                        <div className="shadow-lg">
                            <div style={styles.categorySection}>
                                <h3 style={{
                                    ...styles.categoryHeading,
                                    borderBottom: '1px solid #e41f81ff',
                                    display: 'inline-block',
                                    paddingBottom: '5px',
                                    marginBottom: '15px'
                                }}>Vendors</h3>
                                <p style={styles.categoryText}>
                                    If you are a talented vendor in your field and looking for the right platform and get new business - feel free to send us an email at marketing@theshaadiclan.com
                                </p>
                            </div>

                            {/* Marketing Collaborations */}
                            <div style={styles.categorySection}>
                                <h3 style={{
                                    ...styles.categoryHeading,
                                    borderBottom: '1px solid #e41f81ff',
                                    display: 'inline-block',
                                    paddingBottom: '5px',
                                    marginBottom: '15px'
                                }}> Marketing Collaborations</h3>
                                <p style={styles.categoryText}>
                                    For Direct Collaborations - promotional events/shoots or paid events, contact us at marketing@theshaadiclan.com
                                </p>
                            </div>

                            {/* Wedding Submissions */}
                            <div style={styles.categorySection}>
                                <h3 style={{
                                    ...styles.categoryHeading,
                                    borderBottom: '1px solid #e41f81ff',
                                    display: 'inline-block',
                                    paddingBottom: '5px',
                                    marginBottom: '15px'
                                }}>Wedding Submissions</h3>
                                <p style={styles.categoryText}>
                                    We absolutely LOVE featuring Weddings on theshaadiclan.com! To submit the details and photos from your wedding along with vendor details, please mail us at submissions@theshaadiclan.com or DM this instagram_logo
                                </p>
                            </div>

                            {/* Careers */}
                            <div style={styles.categorySection}>
                                <h3 style={{
                                    ...styles.categoryHeading,
                                    borderBottom: '1px solid #e41f81ff',
                                    display: 'inline-block',
                                    paddingBottom: '5px',
                                    marginBottom: '15px'
                                }}>Careers</h3>
                                <p style={styles.categoryText}>
                                    We have a team of dedicated professionals on the network, however we are always on the lookout for new talents. Do send your resumes at hr@theshaadiclan.com
                                </p>
                            </div>

                            {/* Customers */}
                            <div style={styles.categorySection}>
                                <h3 style={{
                                    ...styles.categoryHeading,
                                    borderBottom: '1px solid #e41f81ff',
                                    display: 'inline-block',
                                    paddingBottom: '5px',
                                    marginBottom: '15px'
                                }}>Customers</h3>
                                <p style={styles.categoryText}>
                                    We focus to offer best in the premium vendors. If yes, Please feedback on your experiences. Since we are ever-learning organization, if you wish to share any feedback or concerns, we want to hear from you: Reach us at feedback@theshaadiclan.com
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Info */}
                    <div style={styles.rightCol} className="right-col">
                        {/* For Vendors */}
                        <p className='fs-30 dark-pink-text fw-medium'>Connect us to get best Deals</p>
                        <div style={styles.contactBox}>
                            <p style={{
                                ...styles.contactTitle, marginTop: '15px', borderBottom: '1px solid #ec4c9cff', // line below heading
                                display: 'inline-block',
                                paddingBottom: '5px',
                                marginBottom: '15px'
                            }}>For Vendors</p>
                            <div style={styles.contactInfo} className='mt-3'>
                                <FiMail size={25} className='primary-text' />
                                <span className='fs-18 fw-bold'>research@theshaadiclan.com</span>
                            </div>
                            <div style={styles.contactInfo} className='mt-5'>
                                <FiPhone size={25} className='primary-text' />
                                <span className='fs-18 fw-bold'>+91 456 700</span>
                            </div>
                        </div>

                        <div style={styles.contactBox}>
                            <p style={{
                                ...styles.contactTitle, marginTop: '15px', borderBottom: '1px solid #ec4c9cff', // line below heading
                                display: 'inline-block',
                                paddingBottom: '5px',
                                marginBottom: '15px'
                            }}>For Users</p>
                            <div style={styles.contactInfo} className='mt-3'>
                                <FiMail size={25} className='primary-text' />
                                <span className='fs-18 fw-bold'>info@theshaadiclan.com</span>
                            </div>
                            <div style={styles.contactInfo} className='mt-5'>
                                <FiPhone size={25} className='primary-text' />
                                <span className='fs-18 fw-bold'>+91 456 700</span>
                            </div>
                        </div>

                        <div style={styles.contactBox}>
                            <p style={{
                                ...styles.contactTitle, marginTop: '15px', borderBottom: '1px solid #ec4c9cff', // line below heading
                                display: 'inline-block',
                                paddingBottom: '5px',
                                marginBottom: '15px'
                            }}>Registered Address</p>
                            <div style={styles.contactInfo} className='mt-2'>
                                <FiMapPin size={25} className='primary-text' />
                                <div className="d-flex flex-column">
                                    <span className='fs-18 fw-bold'>Nataraj Bldg 2nd flr, Shahjahanabak</span>
                                    <span className='fs-18 fw-bold'>near Reliance Digital, Parel east Mumbai 400012 Get Directions</span>
                                </div>
                            </div>
                        </div>

                        <div style={styles.contactBox}>
                            <div className="d-flex flex-wrap justify-content-center gap-4">
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.wedmegood.wmgapp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src="/images/cta/playstore.svg"
                                        alt="Google Play"
                                        style={{
                                            width: "180px",
                                            height: "180px",
                                            objectFit: "contain",
                                        }}
                                    />
                                </a>
                                <a
                                    href="https://apps.apple.com/in/app/wedmegood/id919447453"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src="/images/cta/appstore.svg"
                                        alt="Apple Store"
                                        style={{
                                            width: "180px",
                                            height: "180px",
                                            objectFit: "contain",
                                        }}
                                    />
                                </a>
                            </div>
                            <p style={{ fontSize: '16px', color: '#000' }} className='text-center'> Gets the Happywedz App</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contactus;
