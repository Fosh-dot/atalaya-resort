import "./PicturesqueMoments.css";

import spa1 from "../../assets/images/spa-skincare.webp";
import spa2 from "../../assets/images/spa-skincare2.webp";
import spa3 from "../../assets/images/spa-skincare3.webp";
import spa4 from "../../assets/images/spa-skincare4.webp";
import spa5 from "../../assets/images/spa-skincare5.webp";
import spa6 from "../../assets/images/spa-skincare6.webp";
import spa7 from "../../assets/images/spa-skincare7.webp";

import yoga1 from "../../assets/images/yoga-class.webp";
import yoga2 from "../../assets/images/yoga-class2.webp";
import yoga3 from "../../assets/images/yoga-class3.webp";
import yoga4 from "../../assets/images/yoga-class4.webp";
import yoga5 from "../../assets/images/yoga-class5.webp";
import yoga6 from "../../assets/images/yoga-class6.webp";
import yoga7 from "../../assets/images/yoga-class7.webp";

const spaImages = [spa1, spa2, spa3, spa4, spa5, spa6, spa7];

const yogaImages = [yoga1, yoga2, yoga3, yoga4, yoga5, yoga6, yoga7];

function MovingImageRow({ images, direction, label }) {
  // Duplicate the images to create a seamless animation loop.
  const loopImages = [...images, ...images];

  return (
    <div className={`picturesque-row picturesque-row-${direction}`}>
      <div className="picturesque-track">
        {loopImages.map((image, index) => (
          <div className="picturesque-image" key={`${label}-${index}`}>
            <img
              src={image}
              alt={`${label} resort gallery photo ${(index % images.length) + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PicturesqueMoments() {
  return (
    <section className="picturesque-section">
      <div className="picturesque-heading">
        <h2>Picturesque Moments</h2>
      </div>

      <div className="picturesque-gallery">
        <MovingImageRow
          images={spaImages}
          direction="left"
          label="Spa and skincare"
        />

        <MovingImageRow
          images={yogaImages}
          direction="right"
          label="Yoga and wellness"
        />
      </div>
    </section>
  );
}

export default PicturesqueMoments;
