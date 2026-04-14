import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadStory } from '../services/story.api';
import styles from './StoryUpload.module.scss';

const StoryUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const preview = useMemo(() => {
    if (!file) {
      return '';
    }
    return URL.createObjectURL(file);
  }, [file]);

  const handleFile = (event) => {
    const selected = event.target.files?.[0];
    setError('');
    setFile(selected || null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError('Please select an image');
      return;
    }

    try {
      setUploading(true);
      await uploadStory({ storyImage: file });
      navigate('/');
    } catch (uploadError) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Upload Story</h1>
        <p className={styles.caption}>Share a moment that auto expires in 24 hours.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.fileInput} htmlFor="storyFile">
            {file ? 'Change image' : 'Choose image'}
          </label>
          <input id="storyFile" type="file" accept="image/*" onChange={handleFile} hidden />

          {preview ? <img src={preview} alt="story preview" className={styles.preview} /> : null}

          {error ? <p className={styles.error}>{error}</p> : null}

          <button className={styles.submit} type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Story'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default StoryUpload;
