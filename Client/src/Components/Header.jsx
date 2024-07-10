// cards image link: https://www.pngwing.com/en/search?q=google+play+card
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import "./swiper.css";
import amazon from "../assets/amazon.png";
import itunes from "../assets/itunes.png";
import itunes_2 from "../assets/itunes-2.png";
import steam from "../assets/steam.png";
import gplay from "../assets/gplay.png";

const Header = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".text",
      {
        opacity: 0,
        x: 2000,
      },
      {
        opacity: 1,
        x: 0,
        stagger: 0.1,
        duration: 1,
      }
    );
    gsap.fromTo(
      ".to-top",
      {
        opacity: 0,
        y: 1000,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "bounce.in",
      }
    );
  });

  return (
    <div className="h-screen w-full px-5 flex flex-col lg:flex-row justify-around lg:justify-between items-center">
      <div className="flex flex-col">
        <p className="text text-5xl md:text-6xl lg:text-8xl max-w-4xl text-[#5956E9] font-bold leading-snug text-center md:text-start">
          Get your card now
        </p>

        <div
          className="flex flex-col pt-10 lg:items-start justify-start gap-5
            text-lg font-semibold"
        >
          <p className="text text-center text-wrap">
            Find your desired giftcard,
          </p>
          <p className="text text-center text-wrap">enter your details,</p>
          <p className="text text-center text-wrap">
            make the payment and it’s yours!
          </p>
        </div>
      </div>

      {/* <p>asba</p> */}

      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper m-0 to-top w-[200px] h-[300px] md:w-[235px] md:h-[340px]"
      >
        <SwiperSlide>
          <img src={steam} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={amazon} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={itunes_2} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={gplay} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={itunes} />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Header;
