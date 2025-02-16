"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const ScribeSelection = () => {
  const [selectedScribe, setSelectedScribe] = useState("");
  const { user } = useUser();
  const [userId, setUserId] = useState(null);
  const [userLocation, setUserLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [userName, setUserName] = useState("");
  const [locationError, setLocationError] = useState("");
  const [scribeError, setScribeError] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      setUserName(user.fullName);
      fetchUserLocation(user.id);
    }
  }, [user]);

  useEffect(() => {
    const storedScribe = localStorage.getItem("selectedScribe");
    if (storedScribe) {
      setSelectedScribe(storedScribe);
    }
  }, []);

  const fetchUserLocation = async (userId) => {
    try {
      const response = await fetch(`https://trackserv.techfiz.com/api/v1/users/location/${userId}`);
      const data = await response.json();

      if (response.ok && data.location) {
          setUserLocation(data.location);
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location ,userName}),
      });

      if (response.ok) {
        setUserLocation(location);
      } else {
        console.error("Failed to update location");
      }
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const handleSubmit = async () => {
    let valid = true;

    if (!selectedScribe) {
      setScribeError("Please choose a scribe number");
      valid = false;
    }

    if (!userLocation && !selectedLocation) {
      setLocationError("Please choose a work location");
      valid = false;
    }

    if (!valid) return;

    if (!userLocation && selectedLocation) {
      await updateUserLocation(selectedLocation);
    }

    localStorage.setItem("selectedScribe", selectedScribe);
    localStorage.setItem("workLocation",userLocation || selectedLocation);
    router.push(`/workreport`);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ textAlign: "center", width: "300px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
        
        {/* Location Selection - Only if Location is Empty */}
        {!userLocation && (
          <div className="flex flex-col gap-2">
            <h4><strong>Choose Your Work Location:</strong></h4>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setLocationError("");
              }}
              style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="">Select Location</option>
              <option value="Gandhi Bhavan">Gandhi Bhavan</option>
              <option value="Lalbagh Botanical Garden">Lalbagh Botanical Garden</option>
            </select>
            {locationError && <p style={{ color: "red", fontSize: "12px" }}>{locationError}</p>}
          </div>
        )}

        {/* Scribe Selection */}
        <h4><strong>Choose the Scribe Number</strong></h4>
        <select
          value={selectedScribe}
          onChange={(e) => {
            setSelectedScribe(e.target.value);
            setScribeError("");
          }}
          style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">Select</option>
          {[...Array(30).keys()].map((num) => (
            <option key={num + 1} value={`ttscribe ${num + 1}`}>
              ttscribe {num + 1}
            </option>
          ))}
        </select>
        {scribeError && <p style={{ color: "red", fontSize: "12px" }}>{scribeError}</p>}

        {/* Single Button Handling Both Fields */}
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "#075985",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            cursor: "pointer",
            width: "55%",
          }}
        >
          Confirm
        </button>

      </div>
    </div>
  );
};

export default ScribeSelection;
