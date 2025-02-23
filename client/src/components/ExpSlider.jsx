// import Slider from "react-slick";
// import ExpCard from "./ExpCard";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// export default function ExpSlider({expList, currentUser}){

//     function SampleNextArrow(props) {
//         const { className, style, onClick } = props;
//         return (
//           <div
//             className={className}
//             style={{ ...style, display: "block", background: "red" }}
//             onClick={onClick}
//           />
//         );
//       }
      
//       function SamplePrevArrow(props) {
//         const { className, style, onClick } = props;
//         return (
//           <div
//             className={className}
//             style={{ ...style, display: "block", background: "green" }}
//             onClick={onClick}
//           />
//         );
//       }

//     const settings = {
//         dots: true,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 3,
//         slidesToScroll: 1,
//         arrows: true, 
//         prevArrow: <SamplePrevArrow />,
//         nextArrow: <SampleNextArrow />,        
//       };

//     return(
//         <>
//             <div className="slider-container">
//                 <Slider {...settings}>
//                     { 
//                         expList.map((item,index)=>{
//                             return(
//                                 <>
//                                     <ExpCard item={item} currentUser={currentUser} />                  
//                                 </>
//                             )                    
//                         })
//                     }        
//                 </Slider>                
//             </div>

//         </>
//     )
// }