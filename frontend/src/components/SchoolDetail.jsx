import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import Navbar from "./Navbar";
import BackToTop from "./BackToTop";
import Breadcrumb from "./Breadcrumb";
import { useParams } from "react-router-dom";

function SchoolDetail() {
    function encodeSingleQuote(url) {
        return url.replace(/'/g, '%27');
    }

    const { schoolId } = useParams();
    const [school, setSchool] = useState(null);
    const [medias, setMedias] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);
    // 评论区交互相关 state
    const [commentText, setCommentText] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    // 点赞/踩按钮点击处理
    const handleLike = (e) => {
        e.preventDefault();
        setIsLiked(true);
        setIsDisliked(false);
    };
    const handleDislike = (e) => {
        e.preventDefault();
        setIsLiked(false);
        setIsDisliked(true);
    };

    // 评论提交处理
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user?.id) {
            const modalEl = document.getElementById("loginModal");
            if (modalEl) {
                const modal = window.bootstrap ? window.bootstrap.Modal.getOrCreateInstance(modalEl) : Modal.getOrCreateInstance(modalEl);
                modal.show();
            }
            return;
        }
        if (!commentText.trim()) {
            alert("Please enter your comment.");
            return;
        }
        // 写入 UserReviews 表
        const res = await fetch("/api/UserReviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userID: user.id,
                schoolID: school.id,
                comments: commentText,
                isLiked,
                isDisliked
            })
        });
        if (res.ok) {
            // 新增评论后刷新评论列表
            const newReview = await res.json();
            setReviews([newReview, ...reviews]);
            setCommentText("");
            setIsLiked(false);
            setIsDisliked(false);
        } else {
            alert("Failed to post comment.");
        }
    };

    useEffect(() => {
        fetch(`/api/schools/${schoolId}`)
            .then(res => res.json())
            .then(data => setSchool(data));
    }, [schoolId]);

    useEffect(() => {
        // 获取当前用户收藏列表
        if (user?.id) {
            fetch(`/api/UserFavorites?userId=${user.id}`)
                .then(res => res.json())
                .then(data => setFavorites(data))
                .catch(() => setFavorites([]));
        }
    }, [user, schoolId]);

    useEffect(() => {
        // 获取当前学校的所有评论
        fetch(`/api/UserReviews/school/${schoolId}`)
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(() => setReviews([]));
        // 获取所有用户信息
        fetch(`/api/Users`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(() => setUsers([]));
    }, [schoolId]);

    useEffect(() => {
        fetch(`/api/SchoolMedias/school/${schoolId}`)
            .then(res => res.json())
            .then(data => setMedias(data));
    }, [schoolId]);

    if (!school) return <div>Loading...</div>;

    // Get school banner
    const bannerMedia = medias.find(
        media => media.mediaType === "Photo" && media.url.toLowerCase().includes("banner")
    );
    const bannerUrl = bannerMedia?.url;

    // Get school video
    const videoMedia = medias.find(
        media => media.mediaType === "Video"
    );
    const videoUrl = videoMedia?.url;

    const safeBannerUrl = bannerUrl ? encodeSingleQuote(bannerUrl) : undefined;

    // Get school logo
    const logoUrl = school?.logo;

    // Get school name type and city
    const schoolName = school?.name;
    const schoolType = school?.type;
    const schoolCity = school?.city;

    // Get school introduction
    const introduction = school?.introduction;

    // Get school image gallery
    const photoMedias = medias.filter(media => media.mediaType === "Photo" && !media.url.toLowerCase().includes("banner")); // Exclude banner

    // Get map view url
    const mapViewUrl = school?.mapview;

    // Get street view url
    const streetViewUrl = school?.streetview;

    // Get enrolment info
    const enrolmentInfo = school?.enrolmentInfo;

    // Get Enrolment Form
    const enrolmentFormUrl = school?.enrolmentForm;

    // Get school zone
    const schoolZoneInfo = school?.schoolZone;

    // Get contact info
    const schoolEmail = school?.email;
    const schoolPhone = school?.telephone;

    // 复制链接并显示 toast
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            });
    };

    const breadcrumbItems = [
        { link: "/", icon: "fas fa-home", label: "Home" }
    ];

    if (schoolType) {
        let typeLink = `/schools?type=${encodeURIComponent(schoolType)}`;
        if (schoolCity) typeLink += `&city=${encodeURIComponent(schoolCity)}`;
        breadcrumbItems.push({ link: typeLink, label: schoolType });
    }

    if (schoolCity) {
        breadcrumbItems.push({ link: `/schools?type=${encodeURIComponent(schoolType)}&city=${encodeURIComponent(schoolCity)}`, label: schoolCity });
    }

    if (schoolName) {
        breadcrumbItems.push({ label: schoolName });
    }

    // 收藏/取消收藏操作
    const handleFavorite = async () => {
        if (!user?.id) {
            const modalEl = document.getElementById("loginModal");
            if (modalEl) {
                const modal = window.bootstrap ? window.bootstrap.Modal.getOrCreateInstance(modalEl) : Modal.getOrCreateInstance(modalEl);
                modal.show();
            }
            return;
        }

        if (isFavorited) {
            // 取消收藏（只删除当前用户的收藏）
            const fav = favorites.find(f => f.schoolID === school.id && f.userID === user.id);
            if (!fav) {
                alert("No favorite found for current user.");
                return;
            }
            const res = await fetch(`/api/UserFavorites/${fav.id}`, { method: "DELETE" });
            if (res.ok) {
                setFavorites(favorites.filter(f => f.id !== fav.id));
            } else {
                alert("Failed to unfavorite.");
            }
        } else {
            // 添加收藏
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

    const isFavorited = school?.id && user?.id && favorites.length > 0 && favorites.some(f => f.schoolID === school.id && f.userID === user.id);

    return (
        <section className="main s-profile s-smp us">
            <Navbar />
            {/* Header */}
            <div className="s-header">
                <div
                    className="bg img-bg"
                    style={{
                        backgroundImage: bannerUrl
                            ? `linear-gradient(0deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 100%), url(${safeBannerUrl})`
                            : undefined
                    }}
                ></div>
                <div className="content">
                    <div className="container px-0 mb-4">
                        <div className="row">
                            <div className="col-lg-10">
                                <div className="h2 d-flex gap-2 align-items-center mb-0">
                                    <img src={logoUrl} height="80px" alt="Logo" />
                                    <b>{schoolName}</b>
                                    <div className="vr mx-2"></div>
                                    <img src="https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/school_type_icon_white.png" height="30px" alt="School Type" />
                                    <a id="school_name">{schoolType}</a>
                                    <img src="https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/school_city_icon_white.png" height="24px" alt="Location" />
                                    <a id="school_city">{schoolCity}</a>
                                </div>
                            </div>
                            <div className="col-lg-2 action-box">
                                <div className="actions">
                                    <div className="actions-more">
                                        <button
                                            type="button"
                                            className={`btn btn-sm save fs-white px-0${isFavorited ? " active" : ""}`}
                                            onClick={handleFavorite}
                                        >
                                            <span className="on-off on" style={{ display: isFavorited ? "none" : "inline" }}><i className="far fa-heart"></i> Favorite</span>
                                            <span className="on-off off" style={{ display: isFavorited ? "inline" : "none" }}><i className="fas fa-heart"></i> Favorited</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm fs-white px-0 show-modal"
                                            onClick={handleCopyLink}
                                        >
                                            <i className="fas fa-share-nodes"></i> Share
                                        </button>
                                        {showToast && (
                                            <div
                                                style={{
                                                    position: "fixed",
                                                    bottom: "100px",
                                                    left: "50%",
                                                    transform: "translateX(-50%)",
                                                    background: "#222",
                                                    color: "#fff",
                                                    padding: "10px 24px",
                                                    borderRadius: "8px",
                                                    zIndex: 9999,
                                                    fontSize: "16px"
                                                }}
                                            >
                                                The sharing link has been copied
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container pt-3">
                <Breadcrumb items={breadcrumbItems} />

                {/* 主体内容 */}
                <div className="s-main container px-0">
                    <div className="s-body py-12">
                        <div className="row">

                            {/* Introduction */}
                            <div className="card" id="overview">
                                <div className="d-flex sm:flex-row align-items-baseline">
                                    <h3 className="fs-xl flex-grow-1">Introduction</h3>
                                </div>

                                <div className="row school-desc align-items-center">
                                    <div className="col-lg-7 col-md-7">
                                        <div className="school_desc_short clamp-ellipsis clamp-eight" style={{ whiteSpace: 'pre-line' }}>
                                            <p>
                                                {introduction}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-lg-5 col-md-5 d-flex justify-content-center">
                                        {photoMedias.length > 0 && (
                                            <img
                                                src={photoMedias[0].url}
                                                className="thumb"
                                                data-bs-toggle="modal"
                                                data-bs-target="#galleryModal"
                                                alt="School"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Modal 图片轮播 */}
                                <div className="modal fade" id="galleryModal" tabIndex="-1">
                                    <div className="modal-dialog modal-dialog-centered modal-lg">
                                        <div className="modal-content">
                                            <div className="modal-body p-0">
                                                <div id="modalCarousel" className="carousel slide" data-bs-ride="carousel">
                                                    <div className="carousel-inner">
                                                        {photoMedias.map((media, idx) => (
                                                            <div className={`carousel-item${idx === 0 ? " active" : ""}`} key={media.url}>
                                                                <img src={media.url} className="d-block w-100" alt={`Slide ${idx + 1}`} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button className="carousel-control-prev" type="button" data-bs-target="#modalCarousel" data-bs-slide="prev">
                                                        <span className="carousel-control-prev-icon"></span>
                                                    </button>
                                                    <button className="carousel-control-next" type="button" data-bs-target="#modalCarousel" data-bs-slide="next">
                                                        <span className="carousel-control-next-icon"></span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Video */}
                            <div className="card cs-video" id="videos">
                                <h3 className="fs-xl">Video</h3>
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
                                    <div>
                                        Coming soon.
                                    </div>
                                )}
                            </div>

                            {/* Location */}
                            <div className="card">
                                <h3>Location</h3>
                                <a>23 Strathmore Drive, Hamilton</a>
                                <div className="map-container">
                                    <iframe
                                        src={mapViewUrl}
                                        width="630"
                                        height="450"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Google Map"
                                    ></iframe>

                                    <iframe
                                        src={streetViewUrl}
                                        width="630"
                                        height="450"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Street View"
                                    ></iframe>
                                </div>
                            </div>

                            {/* Enrolment Info */}
                            <div className="card show-all-box gap-8" id="faq">
                                <h3 className="fs-xl d-flex align-items-center gap-2">Enrolment Info</h3>
                                <div className="d-flex flex-column">
                                    <p style={{ whiteSpace: 'pre-line' }}>{enrolmentInfo}</p>
                                </div>
                                {schoolId === "7" && (
                                    <iframe
                                        width="560"
                                        height="315"
                                        src="https://www.youtube.com/embed/_31YVqBXx9c?si=hKaxSm3KBwSZUC_M"
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    ></iframe>
                                )}
                                <div>
                                    <hr className="mt-0 mb-4" />
                                    <a href={enrolmentFormUrl} target="_blank" rel="noreferrer">Enrolment Form</a>

                                    {schoolZoneInfo && (
                                        schoolZoneInfo.match(/^https?:\/\//i) ? (
                                            <>
                                                <hr className="mt-4 mb-4" />
                                                <a href={schoolZoneInfo} target="_blank" rel="noreferrer">School Zone</a>
                                            </>
                                        ) : (
                                            <>
                                                <hr className="mt-4 mb-4" />
                                                <div>
                                                    <b>School Zone:</b>
                                                    <div style={{ whiteSpace: 'pre-line' }}>{schoolZoneInfo}</div>
                                                </div>
                                            </>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="card" id="contact">
                                <h3 className="fs-xl d-flex align-items-center gap-2">Contact</h3>
                                <div className="d-flex flex-column">
                                    <p>Email: <a href={`mailto:${schoolEmail}`}>{schoolEmail}</a></p>
                                    <p>Phone: <a href={`tel:${schoolPhone}`}>{schoolPhone}</a></p>
                                </div>
                            </div>

                            {/* Reviews */}
                            <div className="card" id="reviews">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="fs-xl mb-0">Reviews</h3>
                                </div>

                                <div className="list-group">
                                    {reviews.length === 0 ? (
                                        <div className="list-group-item text-muted">No reviews yet.</div>
                                    ) : (
                                        reviews.map(review => {
                                            const userInfo = users.find(u => u.id === review.userID);
                                            const avatar = userInfo?.avatarURL || "https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/default_avatar.jpg";
                                            const username = userInfo?.username || "User";
                                            return (
                                                <div className="list-group-item d-flex align-items-start" key={review.id}>
                                                    <img src={avatar} className="rounded-circle me-3" alt={username} style={{ width: 40, height: 40, objectFit: "cover" }} />
                                                    <div className="flex-grow-1">
                                                        <div className="fw-bold">{username}</div>
                                                        {review.comments}
                                                    </div>
                                                    <div className="text-end ms-3">
                                                        {review.isLiked && <i className="fas fa-thumbs-up text-success"></i>}
                                                        {review.isDisliked && <i className="fas fa-thumbs-down text-danger"></i>}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Leave a Comment */}
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h3 className="card-title">Leave a Comment</h3>
                                    <form id="commentForm" onSubmit={handleCommentSubmit}>
                                        <div className="mb-3">
                                            <textarea
                                                className="form-control"
                                                id="commentInput"
                                                rows="3"
                                                placeholder="Write your comment..."
                                                value={commentText}
                                                onChange={e => setCommentText(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="me-3">Rate the school:</div>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className={`btn btn-outline-success${isLiked ? " active" : ""}`}
                                                    onClick={handleLike}
                                                    type="button"
                                                >
                                                    <i className="fas fa-thumbs-up"></i>
                                                </button>
                                                <button
                                                    className={`btn btn-outline-danger${isDisliked ? " active" : ""}`}
                                                    onClick={handleDislike}
                                                    type="button"
                                                >
                                                    <i className="fas fa-thumbs-down"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Post
                                        </button>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* 回到顶部按钮 */}
            <BackToTop />
        </section>
    );
}

export default SchoolDetail;