// components/DataForm.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';

const DataForm = () => {

  const {  user } = useUser();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);   
  useEffect(() => {
    if (user) {
      setUserId(user.id);
      setUserName(user.fullName);
    }
 }, [user]);
  const router = useRouter();
  const [selectedScribe, setSelectedScribe] = useState(null);
  const getScribeNumber = () => {
    const storedScribe = localStorage.getItem('selectedScribe');
    if (!storedScribe) {
      router.push('/');
    } else {
      setSelectedScribe(storedScribe);
    }
 };

 useEffect(() => {
    getScribeNumber();
 }, []);
  const [formData, setFormData] = useState({
    title: '',
    pages_scanned: '',
    ID_url: '',
    author_name: '',
    publisher_name: '',
    year: '',
    isbn:'',
    language:''
  });

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

       // Validate that "Year" and "Pages Scanned" are positive numbers
     const isValid = validateForm()
     if(isValid){
      const data = {
        title: formData.title,
        pages_scanned: formData.pages_scanned,
        ID_url: formData.ID_url,
        author_name: formData.author_name,
        publisher_name: formData.publisher_name,
        year: formData.year,
        isbn: formData.isbn,
        language: formData.language,
        scribe_number: selectedScribe,
        userId: userId,
        userName: userName,
     };

      const response = await fetch('https://digitized-work-tracker-backend-vishal-marvel.vercel.app/api/v1/books/save-book-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    

      if (response.ok) {
        setFormData({
          title: '',
          pages_scanned: '',
          ID_url: '',
          author_name: '',
          publisher_name: '',
          year: '',
          isbn:'',
          language:''
        });
      } else {
        console.error('Failed to submit the form to the backend');
      }
    }
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const validateForm = () => {
    const { title, pages_scanned, ID_url, author_name, publisher_name, year, isbn, language } = formData;

    if (!title || !pages_scanned || !ID_url ) {
      alert('Title, Total pages and IDentifier  fields are required');
      return false;
    }

    if (pages_scanned <= 0) {
      alert('Total pages scanned should be a positive number');
      return false;
    }

    if (year && year <= 0) {
      alert('Year of publication should be a positive number');
      return false;
    }

    return true;
 };

  return (
   
<>

  <div className="p-4">
  <div className=" p-4 rounded-lg shadow-custom ">
    <form onSubmit={handleSubmit} >
    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-sky-800 mb-4 text-center col-span-2">Enter the Book Details</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
        <div style={{ color:'#0369a1',display: 'flex', flexDirection: 'column', gap: '47px' }}>
          <label>Book Name:</label>
          <label>Total Pages:</label>
          <label>Identifier:</label>
          <label>Author:</label>
          <label>Publisher:</label>
          <label>Published Year:</label>
          <label>ISBN:</label>
          <label>Language:</label>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required style={{ padding: '10px', backgroundColor: '#dcdcdc' }} />
          <input type="number" name="pages_scanned" value={formData.pages_scanned} onChange={handleInputChange} required style={{ padding: '10px', backgroundColor: '#dcdcdc' }} />
          <input type="text" name="ID_url" value={formData.ID_url} onChange={handleInputChange} required style={{ padding: '10px', backgroundColor: '#dcdcdc' }} />
          <input type="text" name="author_name" value={formData.author_name} onChange={handleInputChange}  style={{ padding: '10px', backgroundColor: '#dcdcdc' }} />
          <input type="text" name="publisher_name" value={formData.publisher_name} onChange={handleInputChange}  style={{ padding: '10px', backgroundColor: '#dcdcdc' }} />
          <input type="number" name="year" value={formData.year} onChange={handleInputChange}  style={{ padding: '10px', backgroundColor: '#dcdcdc' }} />
          <input type="string" name="isbn" value={formData.isbn} onChange={handleInputChange}  style={{ padding: '10px', backgroundColor: '#dcdcdc' }} />
          <input type="text" name="language" value={formData.language} onChange={handleInputChange}  style={{ padding: '10px', backgroundColor: '#dcdcdc' }} />
        </div>
      </div>
      <div className="mt-4 ml-auto w-40">
        <button className="button"  type="submit">
          Submit
        </button>
      </div>
    </form>
  </div>
  <div className="fixed bottom-4 left-4">
    <div className="mr-4">
      <h2 className="text-lg font-bold text-sky-800">Table View</h2>
    </div>
    <div>
      <Link href="/spreadsheet">
        <button className="button">View</button>
      </Link>
    </div>
  </div>
</div>
</>
  );
};

export default DataForm;
