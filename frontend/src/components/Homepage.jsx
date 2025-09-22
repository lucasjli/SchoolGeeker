import React from "react";
import Navbar from "./Navbar";

function Homepage() {
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

        <div className="container" id="Slogan-search">
          <div className="portlet light section">
            <div className="flex j-center a-center">
              <div className="center-block hero-box">
                <h1 id="hero-title">Excellent schools, bright future</h1>
                <form
                  role="form"
                  className="d-flex justify-content-center"
                  onSubmit={e => {
                    e.preventDefault();
                    const typeMap = {
                      "1": "primary school",
                      "2": "intermediate school",
                      "3": "high school"
                    };
                    const schoolType = e.target.schooltype.value;
                    const city = e.target.city.value;
                    if (!schoolType || !city) return;
                    const typeStr = encodeURIComponent(typeMap[schoolType]);
                    const cityStr = encodeURIComponent(city.toLowerCase());
                    window.open(`/schools?type=${typeStr}&city=${cityStr}`, "_blank");
                  }}
                >
                  <div className="d-flex align-items-center gap-3 flex-nowrap">
                    {/* Education Level */}
                    <div className="form-group">
                      <select className="form-select" id="schooltype" name="schooltype" required>
                        <option value="" disabled selected hidden>Education Level</option>
                        <option value="1">Primary School</option>
                        <option value="2">Intermediate School</option>
                        <option value="3">High School</option>
                      </select>
                    </div>

                    {/* City */}
                    <div className="form-group">
                      <select className="form-select" id="city" name="city" required>
                        <option value="" disabled selected hidden>City</option>
                        <option value="Auckland">Auckland</option>
                        <option value="Wellington">Wellington</option>
                        <option value="Hamilton">Hamilton</option>
                        <option value="Tauranga">Tauranga</option>
                        <option value="Christchurch">Christchurch</option>
                        <option value="Dunedin">Dunedin</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <div className="form-group align-self-end">
                      <button type="submit" className="btn btn-primary">SEEK</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>


        <div className="container">
          <div className="portlet light section">

            <div className="portlet-body">

              <div className="flex j-center a-center gap-04 mb-12">
                <span className="badge btn-danger badge-danger badge-sm">Hot</span>
                <h3 className="m-0 mr-8"><b>Primary School</b></h3>
              </div>

              <div className="tab-content">
                <div className="row justify-content-center">
                  <div className="col-md-4">
                    <a className="ranking-school-item hover-shadow"
                      style={{ backgroundImage: "url('https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/Primary%20School/Hamilton/Hukanui%20School/homepage_banner.jpg')" }}
                      target="_blank" href="schools/7" alt="Hukanui Primary School">
                      <div className="school-text">
                        <div className="school-title fswhite-font">
                          <span>Hukanui School<br /></span>
                          <small>
                            <i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }}></i>
                            Hamilton
                          </small>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-md-4">
                    <a className="ranking-school-item hover-shadow"
                      style={{ backgroundImage: "url('https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/Primary%20School/Hamilton/Rototuna%20Primary%20School/homepage_banner.jpg')" }}
                      target="_blank" href="schools/28" alt="Rototuna Primary School">
                      <div className="school-text">
                        <div className="school-title fswhite-font">
                          <span>Rototuna Primary School<br /></span>
                          <small>
                            <i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }}></i>
                            Hamilton
                          </small>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-md-4">
                    <a className="ranking-school-item hover-shadow"
                      style={{ backgroundImage: "url('https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/Primary%20School/Hamilton/Knighton%20Normal%20School/homepage_banner.jpg')" }}
                      target="_blank" href="schools/29" alt="Knighton Normal School">
                      <div className="school-text">
                        <div className="school-title fswhite-font">
                          <span>Knighton Normal School<br /></span>
                          <small>
                            <i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }}></i>
                            Hamilton
                          </small>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-xs-12 margin-top-20 text-center">
                    <a href="schools?type=Primary School"
                      className="btn btn-outline-secondary">Explore All</a>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="portlet light section">

            <div className="portlet-body">

              <div className="flex j-center a-center gap-04 mb-12">
                <span className="badge btn-danger badge-danger badge-sm">Hot</span>
                <h3 className="m-0 mr-8"><b>Intermediate School</b></h3>
              </div>

              <div className="tab-content">
                <div className="row justify-content-center">
                  <div className="col-md-4">
                    <a className="ranking-school-item hover-shadow"
                      style={{ backgroundImage: "url('https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/Intermediate%20School/Hamilton/Maeroa%20Intermediate%20School/homepage_banner.jpg')" }}
                      target="_blank" href="schools/33" alt="Maeroa Intermediate School">
                      <div className="school-text">
                        <div className="school-title fswhite-font">
                          <span>Maeroa Intermediate School<br /></span>
                          <small>
                            <i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }}></i>
                            Hamilton
                          </small>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-md-4">
                    <a className="ranking-school-item hover-shadow"
                      style={{ backgroundImage: "url('https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/Intermediate%20School/Auckland/Northcote%20Intermediate%20School/homepage_banner.png')" }}
                      href="schools/34" alt="Northcote Intermediate School">
                      <div className="school-text">
                        <div className="school-title fswhite-font">
                          <span>Northcote Intermediate School<br /></span>
                          <small>
                            <i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }}></i>
                            Auckland
                          </small>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-md-4">
                    <a className="ranking-school-item hover-shadow"
                      style={{ backgroundImage: "url('https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/Intermediate%20School/Auckland/Bucklands%20Beach%20Intermediate%20School/homepage_banner.png')" }}
                      target="_blank" href="schools/35" alt="Bucklands Beach Intermediate School">
                      <div className="school-text">
                        <div className="school-title fswhite-font">
                          <span>Bucklands Beach Intermediate School<br /></span>
                          <small>
                            <i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }}></i>
                            Auckland
                          </small>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-xs-12 margin-top-20 text-center">
                    <a href="schools?type=Intermediate School"
                      className="btn btn-outline-secondary">Explore All</a>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="portlet light section">

            <div className="portlet-body">

              <div className="flex j-center a-center gap-04 mb-12">
                <span className="badge btn-danger badge-danger badge-sm">Hot</span>
                <h3 className="m-0 mr-8"><b>High School</b></h3>
              </div>

              <div className="tab-content">
                <div className="row justify-content-center">
                  <div className="col-md-4">
                    <a className="ranking-school-item hover-shadow"
                      style={{ backgroundImage: "url(https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/High%20School/Auckland/Auckland%20Grammar%20School/banner.png)" }}
                      target="_blank" href="schools/36" alt="Auckland Grammar School">
                      <div className="school-text">
                        <div className="school-title fswhite-font">
                          <span>Auckland Grammar School<br /></span>
                          <small>
                            <i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }}></i>
                            Auckland
                          </small>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-md-4">
                    <a className="ranking-school-item hover-shadow"
                      style={{ backgroundImage: "url(https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/High%20School%2FWellington%2FWellington%20College%2Fbanner.png)" }}
                      target="_blank" href="schools/37" alt="Wellington College">
                      <div className="school-text">
                        <div className="school-title fswhite-font">
                          <span>Wellington College<br /></span>
                          <small>
                            <i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }}></i>
                            Wellington
                          </small>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-md-4">
                    <a className="ranking-school-item hover-shadow"
                      style={{ backgroundImage: "url(https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/High%20School%2FHamilton%2FRototuna%20Junior%20High%20School%2Fbanner.jpg)" }}
                      target="_blank" href="schools/39" alt="Rototuna Junior High School">
                      <div className="school-text">
                        <div className="school-title fswhite-font">
                          <span>Rototuna Junior High School<br /></span>
                          <small>
                            <i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }}></i>
                            Hamilton
                          </small>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-xs-12 margin-top-20 text-center">
                    <a href="schools?type=High School"
                      className="btn btn-outline-secondary">Explore All</a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Homepage;