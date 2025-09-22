import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";
import Navbar from "./Navbar";
import BackToTop from "./BackToTop";
import { useLocation } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";

function SchoolList() {
  const [schools, setSchools] = useState([]);
  const [medias, setMedias] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(UserContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const schoolType = params.get("type");
  const schoolCity = params.get("city");
  const schoolName = params.get("name");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    const city = params.get("city");

    let url = "/api/schools";
    const query = [];
    if (type) query.push(`type=${encodeURIComponent(type)}`);
    if (city) query.push(`city=${encodeURIComponent(city)}`);
    if (query.length) url += "?" + query.join("&");

    const fetchSchools = async () => {
      const response = await fetch(url);
      const data = await response.json();
      setSchools(data);
    };
    fetchSchools();

  // Fetch all school media (images, etc.)
    const fetchMedias = async () => {
      const response = await fetch("/api/SchoolMedias");
      const data = await response.json();
      setMedias(data);
    };
    fetchMedias();

  // Fetch current user's favorite list
    if (user?.id) {
      fetch(`/api/UserFavorites?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setFavorites(data))
        .catch(() => setFavorites([]));
    }
  }, [location.search, user]);

  const breadcrumbItems = [
    { link: "/", icon: "fas fa-home", label: "Home" }
  ];

  if (schoolType) {
    breadcrumbItems.push({
      link: `/schools?type=${encodeURIComponent(schoolType)}`,
      label: schoolType
    });
  }

  if (schoolCity) {
    breadcrumbItems.push({
      link: `/schools?type=${encodeURIComponent(schoolType)}&city=${encodeURIComponent(schoolCity)}`,
      label: schoolCity
    });
  }

  if (schoolName) {
    breadcrumbItems.push({ label: schoolName });
  }

  // Favorite/Unfavorite operation
  const handleFavorite = async (school) => {
    if (!user?.id) {
      { alert("Please log in first.") };
      return;
    }
    const isFavorited = favorites.some(f => f.schoolID === school.id);
    if (isFavorited) {
  // Unfavorite
      const fav = favorites.find(f => f.schoolID === school.id);
      const res = await fetch(`/api/UserFavorites/${fav.id}`, { method: "DELETE" });
      if (res.ok) {
        setFavorites(favorites.filter(f => f.schoolID !== school.id));
      } else {
        alert("Failed to unfavorite.");
      }
    } else {
  // Add to favorites
      const res = await fetch(`/api/UserFavorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user.id, schoolID: school.id })
      });
      if (res.ok) {
        const newFav = await res.json();
        setFavorites([...favorites, newFav]);
      } else {
        alert("Failed to favorite.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-head"
        style={{
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.3),rgb(238,241,245,1), rgb(238,241,245,1) ),url('https://www.qmcamp.com/img/hamilton/hm1.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center"
        }}>

        <div className="container pt-3">
          {/** Breadcrumb navigation **/}
          <Breadcrumb items={breadcrumbItems} />

          <div className="school">
            {schools.map((school) => {
              const bannerMedia = medias.find(
                media => media.schoolID === school.id && media.mediaType === "Photo" && media.url.toLowerCase().includes("banner")
              );
              const bannerUrl = bannerMedia?.url;
              const safeBannerUrl = bannerUrl ? bannerUrl.replace(/'/g, "%27") : "";
              const isFavorited = favorites.some(f => f.schoolID === school.id);
              return (
                <React.Fragment key={school.id}>
                  <a
                    className="school-img img-bg"
                    style={{ backgroundImage: `url(${safeBannerUrl})` }}
                    href={`/schools/${school.id}`}
                  ></a>
                  <div className="school-text bg-white p-3 ps-4 d-flex flex-column gap-3 mb-4">
                    <div className="d-flex flex-row gap-2 align-items-center">
                      {/* School logo */}
                      <img src={school.logo} height="80px" />
                      {/* School name */}
                      <b className="school-name fs-4 clamp-2-ellipsis">
                        <a target="_blank" href={`/schools/${school.id}`}>{school.name}</a>
                      </b>

                      <div className="vr mx-2"></div>

                      {/* School type */}
                      <img src="https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/school_type_icon_black.png" height="30px" />
                      <a>{school.type}</a>
                      {/* City */}
                      <img src="https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/school_city_icon_black.png" height="24px" />
                      <a>{school.city}</a>
                      {/* Like and detail buttons */}
                      <div className="d-flex flex-row gap-2 ms-auto">
                        <button type="button" className={`btn btn-sm save${isFavorited ? " active" : ""}`} onClick={() => handleFavorite(school)}>
                          <span className="on-off on" style={{ display: isFavorited ? "none" : "inline" }}><i className="far fa-heart"></i> Favorite</span>
                          <span className="on-off off" style={{ display: isFavorited ? "inline" : "none" }}><i className="fas fa-heart"></i> Favorited</span>
                        </button>
                        <a href={`/schools/${school.id}`} className="btn btn-dark btn-sm sm:d-none">Detail <i className="fas fa-circle-right text-white"></i></a>
                      </div>
                    </div>
                    <div className="s-meta-wrap">
                      <div className="my-2 clamp-2-ellipsis grey-035 sm:d-none">
                        {/* Just show the first 100 characters */}
                        {school.introduction && school.introduction.length > 500
                          ? school.introduction.slice(0, 500) + '......'
                          : school.introduction}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Back to top button */}
          <BackToTop />
        </div>
      </div >
    </div >
  );
}

export default SchoolList;