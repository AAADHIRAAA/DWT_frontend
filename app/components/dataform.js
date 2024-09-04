// components/DataForm.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const DataForm = () => {
  const { user } = useUser();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [correctionChecked, setCorrectionChecked] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [isFormEditable, setIsFormEditable] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(""); 
  const [selectedScribe, setSelectedScribe] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      setUserName(user.fullName);
      fetchUserLocation(user.id);
    }
  }, [user]);

  const fetchUserLocation = async (userId) => {
    try {
      const response = await fetch(`https://trackserv.techfiz.com/api/v1/users/location/${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data.location);
        if(!data.location){
          setShowLocationPrompt(true);
        }
        else {
          setUserLocation(data.location);
          setIsFormEditable(true);
        } 
      } else {
        console.error("Failed to fetch user location");
      }
    } catch (error) {
      console.error("Error fetching user location:", error);
    }
  };

  const updateUserLocation = async (location) => {
    try {
        const response = await fetch(`https://trackserv.techfiz.com/api/v1/users/location/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location }),
        });

        if (response.ok) {
            setUserLocation(location);
            setIsFormEditable(true);
            setShowLocationPrompt(false);
        } else {
            console.error('Failed to update location');
        }
    } catch (error) {
        console.error('Error updating location:', error);
    }
};
const handleLocationSelect = () => {
  console.log(selectedLocation);
  if (selectedLocation) {
      updateUserLocation(selectedLocation);
  }
};


  
  const getScribeNumber = () => {
    const storedScribe = localStorage.getItem("selectedScribe");
    if (!storedScribe) {
      router.push("/");
    } else {
      setSelectedScribe(storedScribe);
    }
  };

  useEffect(() => {
    getScribeNumber();
  }, []);

  const [formData, setFormData] = useState({
    correction: "",
    title: "",
    pages_scanned: "",
    ID_url: "",
    author_name: "",
    publisher_name: "",
    year: "",
    isbn: "",
    language: "",
  });
  const handleCorrectionChange = () => {
    setCorrectionChecked(!correctionChecked);
  };

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
      const isValid = validateForm();
      if (isValid) {
        const correctionValue = correctionChecked ? "Yes" : "No";
        const data = {
          correction: correctionValue,
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
          location: userLocation,
        };

        const response = await fetch(
          "https://trackserv.techfiz.com/api/v1/books/save-book-data",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          setFormData({
            correction: "",
            title: "",
            pages_scanned: "",
            ID_url: "",
            author_name: "",
            publisher_name: "",
            year: "",
            isbn: "",
            language: "",
          });
          setCorrectionChecked(false);
        } else {
          console.error("Failed to submit the form to the backend");
        }
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const validateForm = () => {
    const {
      title,
      pages_scanned,
      ID_url,
     year,
     
    } = formData;

    if (!title || !pages_scanned || !ID_url) {
      alert("Title, Total pages and IDentifier  fields are required");
      return false;
    }

    if (pages_scanned <= 0) {
      alert("Total pages scanned should be a positive number");
      return false;
    }

    if (year && year <= 0) {
      alert("Year of publication should be a positive number");
      return false;
    }

    return true;
  };

  return (
    <>
    {showLocationPrompt && (
                <div className="flex justify-center align-middle border border-sky-800 shadow-md rounded-xl p-3 m-3">
                    <div className="flex flex-col gap-2" >
                        <h4><strong>Please choose your work location:</strong></h4>
                        <div className="flex flex-row gap-4">
                        <select 
                            value={selectedLocation} 
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="border border-sky-800 rounded-md"
                        >
                            <option value="">Select Location</option>
                            <option value="Gandhi Bhavan">Gandhi Bhavan</option>
                            <option value="Lalbagh Botanical Garden">Lalbagh Botanical Garden</option>
                        </select>
                        <button className="rounded-md bg-sky-600 px-2 py-1 text-white-900" onClick={handleLocationSelect}>Update</button>
                        </div>
                    </div>
                </div>
            )}

      <div className="p-4">
        <div className=" p-4 rounded-lg shadow-custom ">
          <form onSubmit={handleSubmit}>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-sky-800 mb-8 text-center col-span-2">
              Enter the Book Details
            </h1>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "25px",
              }}
            >
              <div
                style={{
                  color: "#0369a1",
                  display: "flex",
                  flexDirection: "column",
                  gap: "45px",
                }}
              >
                <label>Correction:</label>
                <label>
                  Book Name<span style={{ color: "red" }}>*</span>:
                </label>
                <label>
                  Total Pages<span style={{ color: "red" }}>*</span>:
                </label>
                <label>
                  Identifier<span style={{ color: "red" }}>*</span>:
                </label>
                <label>Author:</label>
                <label>Publisher:</label>
                <label>Published Year:</label>
                <label>ISBN:</label>
                <label>Language:</label>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "25px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    id="correction"
                    name="correction"
                    checked={correctionChecked}
                    onChange={handleCorrectionChange}
                    disabled={!isFormEditable}
                    style={{
                      marginLeft: "10px",
                      transform: "scale(2.0)",
                      padding: "10px",
                      marginBottom: "20px",
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={!isFormEditable}
                  style={{ padding: "10px", backgroundColor: "#dcdcdc" }}
                />
                <input
                  type="number"
                  name="pages_scanned"
                  value={formData.pages_scanned}
                  onChange={handleInputChange}
                  required
                  disabled={!isFormEditable}
                  style={{ padding: "10px", backgroundColor: "#dcdcdc" }}
                />
                <input
                  type="text"
                  name="ID_url"
                  value={formData.ID_url}
                  onChange={handleInputChange}
                  required
                  disabled={!isFormEditable}
                  style={{ padding: "10px", backgroundColor: "#dcdcdc" }}
                />
                <input
                  type="text"
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleInputChange}
                  disabled={!isFormEditable}
                  style={{ padding: "10px", backgroundColor: "#dcdcdc" }}
                />
                <input
                  type="text"
                  name="publisher_name"
                  value={formData.publisher_name}
                  onChange={handleInputChange}
                  disabled={!isFormEditable}
                  style={{ padding: "10px", backgroundColor: "#dcdcdc" }}
                />
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  disabled={!isFormEditable}
                  style={{ padding: "10px", backgroundColor: "#dcdcdc" }}
                />
                <input
                  type="string"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  disabled={!isFormEditable}
                  style={{ padding: "10px", backgroundColor: "#dcdcdc" }}
                />
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  disabled={!isFormEditable}
                  style={{ padding: "10px", backgroundColor: "#dcdcdc" }}
                />
              </div>
            </div>
            <div className="mt-4 ml-auto w-40">
              <button className="button" type="submit">
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
