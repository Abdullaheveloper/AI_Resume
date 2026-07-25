import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const maxFileSize = 5 * 1024 * 1024; // 5MB

function App() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    coverLetter: ''
  });
  const [cvFile, setCvFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setCvFile(null);
      setStatusMessage('');
      setStatusType('');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setStatusMessage('Please attach a PDF, DOC, or DOCX resume file.');
      setStatusType('error');
      setCvFile(null);
      return;
    }

    if (file.size > maxFileSize) {
      setStatusMessage('The attached file is too large. Please keep it under 5 MB.');
      setStatusType('error');
      setCvFile(null);
      return;
    }

    setCvFile(file);
    setStatusMessage(`Selected resume: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    setStatusType('success');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.role || !form.coverLetter) {
      setStatusMessage('Please complete every field before submitting the application.');
      setStatusType('error');
      return;
    }

    if (!cvFile) {
      setStatusMessage('Attach your resume file before submitting.');
      setStatusType('error');
      return;
    }

    const data = new FormData();
    data.append('fullName', form.fullName);
    data.append('email', form.email);
    data.append('phone', form.phone);
    data.append('role', form.role);
    data.append('coverLetter', form.coverLetter);
    data.append('resume', cvFile);

    setStatusMessage('Sending application...');
    setStatusType('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      setForm({ fullName: '', email: '', phone: '', role: '', coverLetter: '' });
      setCvFile(null);
      setStatusMessage('Your application was submitted successfully!');
      setStatusType('success');
    } catch (error) {
      setStatusMessage('There was an error submitting your application. Please try again later.');
      setStatusType('error');
    }
  };

  return (
    <main className="app-card">
      <header>
        <h1>Application Form</h1>
        <p>Submit your resume and cover letter with an attached CV file. This form is ready for React integration and can be wired to a backend endpoint later.</p>
      </header>

      <form onSubmit={handleSubmit} className="form-grid" noValidate>
        <label>
          Full name
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={updateField}
            placeholder="Jane Doe"
            required
          />
        </label>

        <label>
          Email address
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            placeholder="jane@example.com"
            required
          />
        </label>

        <label>
          Phone number
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={updateField}
            placeholder="(123) 456-7890"
            required
          />
        </label>

        <label>
          Position applying for
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={updateField}
            placeholder="Frontend Engineer"
            required
          />
        </label>

        <section className="wide file-upload">
          <label htmlFor="resumeUpload">
            Attach your CV
            <input
              id="resumeUpload"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              required
            />
          </label>
          <p className="note">Accepted formats: PDF, DOC, DOCX. Max size: 5 MB.</p>
          {cvFile && (
            <p className="file-summary">Ready to upload: {cvFile.name}</p>
          )}
        </section>

        <label className="wide">
          Cover letter
          <textarea
            name="coverLetter"
            value={form.coverLetter}
            onChange={updateField}
            placeholder="Tell us why you're a great fit for the role..."
            required
          />
        </label>

        <div className="actions wide">
          <button type="submit">Submit application</button>
        </div>

        {statusMessage && (
          <div className={`message ${statusType === 'success' ? 'message--success' : statusType === 'error' ? 'message--error' : ''}`}>
            {statusMessage}
          </div>
        )}
      </form>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
