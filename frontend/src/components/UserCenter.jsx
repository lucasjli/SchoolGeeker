import { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import Navbar from "./Navbar";
import BackToTop from "./BackToTop";
import Breadcrumb from "./Breadcrumb";


function UserCenter() {
  const { user, logout, setUser } = useContext(UserContext);
  const [openGallery, setOpenGallery] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [comments, setComments] = useState([]);
  const [schools, setSchools] = useState([]);
  const [medias, setMedias] = useState([]);

  // Fetch real favorited schools and comments data
  useEffect(() => {
  // Fetch all schools
    fetch("/api/Schools")
      .then(res => res.json())
      .then(data => setSchools(data))
      .catch(() => setSchools([]));
  // Fetch current user's favorited schools
    if (user?.id) {
      fetch(`/api/UserFavorites/user/${user.id}`)
        .then(res => res.json())
        .then(data => setFavorites(data))
        .catch(() => setFavorites([]));
    } else {
      setFavorites([]);
    }
  // Fetch comments
    fetch("/api/UserReviews")
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(() => setComments([]));
  // Fetch all school media
    fetch("/api/SchoolMedias")
      .then(res => res.json())
      .then(data => setMedias(data))
      .catch(() => setMedias([]));
  }, [user]);
  const [compare, setCompare] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUserName, setNewUserName] = useState(user?.username || "");
  const [newAvatar, setNewAvatar] = useState(user?.avatarURL || "https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/default_avatar.jpg");

  // Add/Remove comparison
  const toggleCompare = (school) => {
    if (compare.find(s => s.id === school.id)) {
      setCompare(compare.filter(s => s.id !== school.id));
    } else if (compare.length < 2) {
      setCompare([...compare, school]);
    } else {
      alert("You can only compare up to 2 schools.");
    }
  };

  // Remove favorite (interact with backend)
  const removeFavorite = async (favoriteId) => {
    try {
      const res = await fetch(`/api/UserFavorites/${favoriteId}`, { method: "DELETE" });
      if (res.ok) {
        setFavorites(favorites.filter(f => f.id !== favoriteId));
        setCompare(compare.filter(s => s.id !== favoriteId));
      } else {
        alert("Failed to remove favorite.");
      }
    } catch {
      alert("Network error.");
    }
  };

  // Delete comment (interact with backend)
  const removeComment = async (id) => {
    try {
      const res = await fetch(`/api/UserReviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setComments(comments.filter(c => c.id !== id));
      } else {
        alert("Failed to delete comment.");
      }
    } catch {
      alert("Network error.");
    }
  };

  // Save user info (submit new avatar and username to backend, backend updates Users table)
  const handleSave = async () => {
    if (!user?.id) {
      alert("请先登录");
      return;
    }
  // Ensure email and passwordHash have values
    const payload = {
      email: user.email || "",
      passwordHash: user.passwordHash || "",
      username: newUserName,
      avatarURL: newAvatar
    };
    const res = await fetch(`/api/Users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const updatedUser = await res.json();
      if (updatedUser) {
        setUser(updatedUser);
        setNewUserName(updatedUser.username);
        setNewAvatar(updatedUser.avatarURL);
      }
      setShowModal(false);
    } else {
      alert("保存失败，请重试");
    }
  };

  // Handle avatar change (upload to backend, backend uploads to Oracle Cloud and returns public URL)
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("userId", user.id);
      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const { url } = await res.json();
        setNewAvatar(url);
      } else {
        alert("Avatar upload failed.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5 pt-3">
  {/** Breadcrumb navigation **/}
        <Breadcrumb items={[{ link: "/", icon: "fas fa-home", label: "Home" }, { label: "User Center" }]} />

        <div className="card" id='user-center-card'>
          <div className="UserCenterBG" style={{ backgroundImage: "url(https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/UserCenterCover.png)" }}>
            <div className="bg-overlay"></div>

            {/* User info overlay at bottom left */}
            <div className="user-info-overlay">
              <img src={user?.avatarURL || "https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/default_avatar.jpg"} alt="User Avatar" className="user-avatar" />
              <div className="user-text">
                <span className="user-name">{user?.username || "Not Log In"}</span>
                <span className="user-data">Favorited Schools: {favorites.length} | Comments: {comments.filter(c => c.userID === user?.id).length} </span>
              </div>
            </div>

            {/* Vertical button group at bottom right */}
            <div style={{ position: "absolute", right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <button className="btn btn-overlay edit-profile-btn"
                type="button"
                onClick={() => {
                  setNewUserName(user?.username || "");
                  setNewAvatar(user?.avatarURL);
                  setShowModal(true);
                }}
              >Edit Profile
              </button>
              <button
                className="btn btn-overlay logout-btn"
                type="button"
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
              >
                Log Out
              </button>
            </div>

          </div>
          <div className="school-text p-3 ps-4 d-flex flex-column gap-3">
            <section className="mb-0">
              <h3>My Favorited Schools</h3>
              {favorites.length === 0 ? (
                <div className="d-flex flex-column align-items-center py-5">
                  <div className="mb-3 fs-5 text-secondary">Discover excellent schools in NZ</div>
                  <button
                    className="btn btn-primary"
                    onClick={() => window.location.href = '/'}
                  >
                    Go to Home Page
                  </button>
                </div>
              ) : (
                <div className="row justify-content-start">
                  {favorites.map(fav => {
                    const school = schools.find(s => s.id === fav.schoolID);
                    if (!school) return null;
                    const bannerMedia = medias.find(
                      media => media.schoolID === school.id && media.mediaType === "Photo" && media.url.toLowerCase().includes("banner")
                    );
                    const bannerUrl = bannerMedia?.url;
                    return (
                      <div className="col-md-6 mb-3" key={fav.id}>
                        <a className="UserCenter-school-item hover-shadow"
                          href={`/schools/${school.id}`}
                          style={{ backgroundImage: `url('${bannerUrl}')` }}>
                          <div className="school-text">
                            <div className="school-title fswhite-font d-flex align-items-center justify-content-between">
                              <div>
                                <span>{school.name}</span><br />
                                <small>{school.city}</small>
                              </div>
                              <div className="d-flex gap-2 me-3">
                                <button
                                  type="button"
                                  className="usercenter-btn btn btn-sm btn-primary"
                                  onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    toggleCompare(school);
                                  }}
                                  disabled={compare.length === 2 && !compare.find(s => s.id === school.id)}
                                >
                                  {compare.find(s => s.id === school.id) ? "Cancel Compare" : "Compare"}
                                </button>
                                <button
                                  type="button"
                                  className="usercenter-btn btn btn-sm btn-danger"
                                  onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    removeFavorite(fav.id);
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <hr className="mt-0 mb-0" />

            <section className="mb-0">
              <h3>My comments</h3>
              {comments.filter(c => c.userID === user?.id).length === 0 ? (
                <div className="text-muted py-4">No comments</div>
              ) : (
                <ul>
                  {comments
                    .filter(comment => comment.userID === user?.id)
                    .map(comment => (
                      <li key={comment.id} className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <b>{schools.find(s => s.id === comment.schoolID)?.name}</b>：{comment.comments}
                          <span className="ms-3">
                            {comment.isLiked && (
                              <i className="fas fa-thumbs-up text-success"></i>
                            )}
                            {comment.isDisliked && (
                              <i className="fas fa-thumbs-down text-danger"></i>
                            )}
                          </span>
                        </div>
                        <div className="text-end ms-3">
                          <span className="text-muted">({comment.dateSubmitted ? new Date(comment.dateSubmitted).toLocaleDateString() : ""})</span>
                        </div>
                        <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => removeComment(comment.id)}>Delete</button>
                      </li>
                    ))}
                </ul>
              )}
            </section>

            <hr className="mt-0 mb-0" />

            <section>
              <h3>Compare Schools</h3>
              {compare.length === 0 ? (
                <div className="text-muted">You can favorite schools and select two of them to compare</div>
              ) : (
                <table className="table table-bordered">
                  <colgroup>
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "350px" }} />
                    <col style={{ width: "350px" }} />
                  </colgroup>

                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>School Name</th>
                      {compare.map(s => <th style={{ textAlign: "center" }} key={s.id}>{s.name}</th>)}
                    </tr>
                  </thead>

                  <tbody>

                    <tr>
                      <td style={{ textAlign: "center" }}>City</td>
                      {compare.map(s => <td style={{ textAlign: "center" }} key={s.id}>{s.city}</td>)}
                    </tr>

                    <tr>
                      <td style={{ textAlign: "center" }}>Introduction</td>
                      {compare.map(s => <td key={s.id}>{s.introduction}</td>)}
                    </tr>

                    <tr>
                      <td style={{ textAlign: "center" }}>Liked Count</td>
                      {compare.map(s => {
                        // Count number of reviews in UserReviews table with matching schoolID and isLiked true
                        const likedCount = comments.filter(c => c.schoolID === s.id && c.isLiked === true).length;
                        return <td style={{ textAlign: "center" }} key={s.id}>{likedCount}</td>;
                      })}
                    </tr>

                    <tr>
                      <td style={{ textAlign: "center" }}>Disliked Count</td>
                      {compare.map(s => {
                        // Count number of reviews in UserReviews table with matching schoolID and isDisliked true
                        const dislikedCount = comments.filter(c => c.schoolID === s.id && c.isDisliked === true).length;
                        return <td style={{ textAlign: "center" }} key={s.id}>{dislikedCount}</td>;
                      })}
                    </tr>

                    <tr>
                      <td style={{ textAlign: "center" }}>Photo</td>
                      {compare.map(s => {
                        const schoolPhotos = medias.filter(
                          m => m.schoolID === s.id && m.mediaType === "Photo" && !m.url.toLowerCase().includes("banner")
                        );
                        return (
                          <td key={s.id} style={{ textAlign: "center" }}>
                            {schoolPhotos.length > 0 && (
                              <div className="ratio ratio-16x9">
                                <img
                                  src={schoolPhotos[0].url}
                                  className="thumb d-block w-100"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => { setOpenGallery(s.id); setGalleryIndex(0); }}
                                  alt="School"
                                />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Gallery Modal (only render once, outside table) */}
                    {openGallery !== null && (() => {
                      const schoolPhotos = medias.filter(
                        m => m.schoolID === openGallery && m.mediaType === "Photo" && !m.url.toLowerCase().includes("banner")
                      );
                      if (schoolPhotos.length === 0) return null;
                      return (
                        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                          <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">School Gallery</h5>
                                <button type="button" className="btn-close" onClick={() => setOpenGallery(null)}></button>
                              </div>
                              <div className="modal-body p-0" style={{ position: "relative" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <button
                                    className="carousel-control-prev"
                                    style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: 32, zIndex: 2 }}
                                    onClick={() => setGalleryIndex((galleryIndex - 1 + schoolPhotos.length) % schoolPhotos.length)}
                                    disabled={schoolPhotos.length <= 1}
                                  >
                                    <span className="carousel-control-prev-icon" style={{ backgroundColor: "#333" }}></span>
                                  </button>
                                  <img
                                    src={schoolPhotos[galleryIndex].url}
                                    className="d-block w-100"
                                    alt={`Slide ${galleryIndex + 1}`}
                                    style={{ maxHeight: "500px", objectFit: "contain" }}
                                  />
                                  <button
                                    className="carousel-control-next"
                                    style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: 32, zIndex: 2 }}
                                    onClick={() => setGalleryIndex((galleryIndex + 1) % schoolPhotos.length)}
                                    disabled={schoolPhotos.length <= 1}
                                  >
                                    <span className="carousel-control-next-icon" style={{ backgroundColor: "#333" }}></span>
                                  </button>
                                </div>
                                <div style={{ textAlign: "center", marginTop: 8 }}>
                                  {galleryIndex + 1} / {schoolPhotos.length}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <tr>
                      <td style={{ textAlign: "center" }}>Video</td>
                      {compare.map(s => {
                        const videoMedia = medias.find(
                          media => media.schoolID === s.id && media.mediaType === "Video"
                        );
                        const videoUrl = videoMedia?.url;
                        return (
                          <td key={s.id} style={{ textAlign: "center" }}>
                            {videoUrl ? (
                              <div className="ratio ratio-16x9">
                                <iframe
                                  src={videoUrl}
                                  title="YouTube video player"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            ) : (
                              <div>Coming soon.</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                  </tbody>
                </table>
              )}
            </section>

            {/* Bootstrap Modal popup */}
            {showModal && (
              <>
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Edit Profile</h5>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                      </div>
                      <div className="modal-body">
                        <div className="mb-3 text-center">
                          <img src={newAvatar} alt="新头像" className="user-avatar mb-2" style={{ width: 80, height: 80 }} />
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={handleAvatarChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Username</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newUserName}
                            onChange={e => setNewUserName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                          Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                          Save
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
                {/* Modal backdrop */}
                <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
              </>
            )}

            <BackToTop />
          </div>


        </div>
      </div>
    </div>
  );
}

export default UserCenter;