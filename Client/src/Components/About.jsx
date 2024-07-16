import gboy from "../assets/gboy.png";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const About = () => {
  // gsap.registerPlugin(ScrollTrigger);
  // useGSAP(() => {
  //   gsap.from(".touta", {
  //     autoAlpha: 0.7,
  //     duration: 1,
  //     y: -50,
  //     scale: 0.8,
  //     scrollTrigger: {
  //       trigger: ".touta",
  //       start: "top 90%",
  //       end: "bottom 10%",
  //       scrub: true,
  //     },
  //   });
  // });

  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center space-y-12 mt-14 md:mt-0 mb-10 px-5 touta"
      id="about"
      data-aos="fade-up"
    >
      <p className="text-5xl text-center font-bold text-violet-600">About Us</p>

      <div className="flex flex-col lg:flex-row">
        <p className="w-3/4 lg:text-lg text-center lg:text-justify font-semibold self-center">
          At <span className="text-[#5956E9]">DumuGames</span>, we&#39;re
          passionate about delivering convenience and joy through the perfect
          gift card solution. Whether you&#39;re looking to treat yourself or
          spread happiness to others, we offer a diverse selection of gift cards
          available for individual purchase or wholesale, catering to both
          personal and corporate needs. With a commitment to quality and
          customer satisfaction, we strive to make every gifting experience
          seamless and memorable. Welcome to a world of endless gifting
          possibilities at <span className="text-[#5956E9]">DumuGames</span>.
        </p>
        <img src={gboy} className="object-cover lg:w-1/2" />
      </div>
    </div>
  );
};

export default About;
