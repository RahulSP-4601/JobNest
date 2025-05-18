import React, { useRef, useEffect } from "react";
import "./../css/companies.css";

import apple from "./../assets/apple.svg";
import amazon from "./../assets/amazon.svg";
import netflix from "./../assets/netflix.svg";
import google from "./../assets/google.svg";
import adobe from "./../assets/adobe.svg";
import barclays from "./../assets/barclays.svg";
import oracle from "./../assets/oracle.svg";
import tesla from "./../assets/tesla.svg";

const logos = [apple, amazon, netflix, google, adobe, barclays, oracle, tesla];

function Companies() {
  const trackRef = useRef(null);

  useEffect(() => {
    let scrollPos = 0;
    const speed = 0.5; // pixels per frame
    const track = trackRef.current;

    const animate = () => {
      scrollPos -= speed;
      if (track) {
        // Reset position when halfway (1 set passed)
        if (Math.abs(scrollPos) >= track.scrollWidth / 2) {
          scrollPos = 0;
        }
        track.style.transform = `translateX(${scrollPos}px)`;
      }
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  // Repeat logos multiple times to make the scroll smooth
  const repeated = Array(1000).fill(logos).flat();


  return (
    <div className="carousel-container">
      <div className="carousel-track" ref={trackRef}>
        {repeated.map((src, index) => (
          <img key={index} src={src} alt={`Logo ${index}`} className="carousel-logo" />
        ))}
      </div>
    </div>
  );
}

export default Companies;
