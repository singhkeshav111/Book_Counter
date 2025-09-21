import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router";

gsap.registerPlugin(ScrollTrigger);

const bookImages = [
  "/Book_bg_1.avif",
  "/Book_image_2.avif",
  "/Book_image_3.avif",
  "/Book_bg_4.png",
  "/Book_image_5.jpg",
  "/Book_bg_6.jpg",
  "/Book_bg_7.jpg",
];

const Home = () => {
  const heroRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    const images = imagesRef.current;

    images.forEach((img) => gsap.set(img, { autoAlpha: 0, scale: 0.95 }));
    if (images.length > 0) gsap.set(images[0], { autoAlpha: 1, scale: 1 });

    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const index = Math.floor(self.progress * bookImages.length);
        images.forEach((img, i) => {
          gsap.to(img, {
            autoAlpha: i === index ? 1 : 0,
            scale: i === index ? 1 : 0.95,
            duration: 0.2,
          });
        });
      },
    });
  }, []);

  return (
    <div className="bg-[#f0f0f0] text-[#0F1012] relative">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="h-screen flex flex-col md:flex-row justify-center items-center px-5 relative  overflow-hidden"
      >
        {/* Left Text */}
        <div className="md:w-1/2 flex flex-col justify-center items-center text-center z-10 space-y-4 p-30">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-15">
            Discover Your Next Favorite Book
          </h1>
          <p className="text-2xl mt-10 md:text-xl max-w-lg">
            Explore thousands of books across genres. Whether you love
            adventures, romance, or mysteries — we have something for you.
          </p>
          <Link to="/books"
          className="mt-4 px-6 py-3 bg-[#CDCDCD] cursor-pointer rounded-full font-medium hover:bg-primary-dull transition">
            Browse Books <span className="ml-1 font-bold">→</span>
          </Link>
        </div>

        <div className="md:w-1/2 flex justify-center items-center relative mt-8 md:mt-0">
          <div className="relative w-[200px] h-[280px] sm:w-[250px] sm:h-[550px] md:w-[300px] md:h-[420px] rounded-tl-[40px] rounded-br-[40px] overflow-hidden shadow-lg">
            {bookImages.map((src, index) => (
              <img
                key={index}
                ref={(el) => (imagesRef.current[index] = el)}
                src={src}
                alt={`book-${index}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6">
        <h2 className="text-4xl font-bold mb-6">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
          <div className="p-6 bg-white rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-2">Vast Library</h3>
            <p>
              Thousands of titles from classics to new arrivals, across every
              genre.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-2">Personalized Picks</h3>
            <p>
              Recommendations tailored just for you based on your reading
              history.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-2">Easy Access</h3>
            <p>
              Read anywhere, anytime — on desktop, tablet, or mobile devices.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#e0e0e0] text-center">
        <p>© {new Date().getFullYear()} BookStore. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
