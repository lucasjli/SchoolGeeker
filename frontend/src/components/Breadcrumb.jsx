import React from "react";

function Breadcrumb({ items }) {
  return (
    <nav aria-label="breadcrumb">
      <div className="breadcrumb d-flex gap-2 align-items-center fs-s">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            {item.link && idx !== items.length - 1 ? (
              <a href={item.link}>{item.icon && <i className={item.icon}></i>} {item.label}</a>
            ) : (
              <span className="active">{item.icon && <i className={item.icon}></i>} {item.label}</span>
            )}
            {idx < items.length - 1 && <i className="fas fa-angle-right grey-04"></i>}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

export default Breadcrumb;