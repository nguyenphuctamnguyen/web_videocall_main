import React from "react";
import { images } from "../../assets/index.tsx";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import PromotionItem from "../PromotionItem/index.tsx";

const dataPromotion: any = [
  {
    image: images.km1,
    name: "Khuyến mãi 1",
  },
  {
    image: images.km2,
    name: "Khuyến mãi 2",
  },
  {
    image: images.km3,
    name: "Khuyến mãi 3",
  },
  {
    image: images.km1,
    name: "Khuyến mãi 1",
  },
  {
    image: images.km2,
    name: "Khuyến mãi 2",
  },
  {
    image: images.km3,
    name: "Khuyến mãi 3",
  },
  {
    image: images.km1,
    name: "Khuyến mãi 1",
  },
  {
    image: images.km2,
    name: "Khuyến mãi 2",
  },
  {
    image: images.km3,
    name: "Khuyến mãi 3",
  },
];
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export type PromotionProps = {
  name: string;
  image: string;
};

const renderPromotion = (item: PromotionProps, index: number) => {
  return (
    <div>
      <PromotionItem key={index} item={item} />
    </div>
  );
};
function PromotionComponent(): React.JSX.Element {
  return (
    <div>
      <h1
        className="text-center
        text-5xl
        bg-gradient-to-b
        from-text 
        to-[#57511d] 
        text-transparent 
        bg-clip-text
        font-bold
        mt-10
        "
      >
        ƯU ĐÃI SIÊU HỜI
      </h1>
      <div className="flex justify-center mt-10">
        <div className="w-[940px] ">
          <Carousel
            swipeable={true}
            draggable={true}
            showDots={true}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            // deviceType={this.props.deviceType}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px mr-5"
          >
            {dataPromotion.map(renderPromotion)}
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default PromotionComponent;
