import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../pages/Login.module.scss';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with', formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  console.log(styles)

  return (
    <div className={styles.container}>
      {/* Left Panel - Matches Register Page */}
      <div className={styles.leftPanel}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        <div className={styles.textContent}>
          <h1>Welcome back</h1>
          <p>Log in to continue sharing your moments and connecting with friends.</p>
          
          <div className={styles.carouselDots}>
            <span className={styles.dot}></span>
            <span className={`${styles.dot} ${styles.active}`}></span>
            <span className={styles.dot}></span>
          </div>
        </div>
      </div>

      {/* Right Panel - Glassmorphism Card */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <h2 className={styles.heading}>Instagram</h2>
          <p className={styles.subtitle}>Welcome back! Please enter your details.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="info.johndoe@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility} 
                  className={styles.passwordToggle}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className={styles.forgotPassword}>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Log In
            </button>
          </form>
          
          <div className={styles.divider}>
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          <div className={styles.socialAuth}>
            <button className={styles.googleBtn}>
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Log in with Google
            </button>
          </div>

          <div className={styles.footer}>
            <p>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;