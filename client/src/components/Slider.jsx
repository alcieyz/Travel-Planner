import {React, useEffect} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Slider.css";
import ScheduleImage from '../assets/schedule_image.png';
import MapImage from '../assets/map_image.png';
import BudgetImage from '../assets/budget_image.png';
import NotesImage from '../assets/notes_image.png';
import SuggestionsImage from '../assets/suggestions_image.png';

const Slider = () => {

    useEffect(() => {
        const updateSlideHeight = () => {
            const slides = document.querySelectorAll(".swiper-slide");
            slides.forEach((slide) => (slide.style.height = "auto"));
            // Allow time for browser to render heights before measuring
            setTimeout(() => {
                let maxHeight = 0;
        
                // Find the tallest slide
                slides.forEach((slide) => {
                    maxHeight = Math.max(maxHeight, slide.scrollHeight);
                });
        
                // Apply max height to all slides
                slides.forEach((slide) => {
                    slide.style.height = `${maxHeight}px`;
                });
              }, 50); // Small delay to ensure proper height measurement
            };
        
            updateSlideHeight();
            window.addEventListener("resize", updateSlideHeight);
    
        return () => window.removeEventListener("resize", updateSlideHeight);
    }, []);

    return (
        <div className="slider-container">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                slidesPerView={3}
                spaceBetween={20} // Space between slides
                loop={true}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }}
            >
            <SwiperSlide>
                <div className="card">
                <img src={ScheduleImage} alt="My Schedule" />
                <h3>My Schedule</h3>
                <p>Plan and organize your trip activities and details in an event calendar!</p>
                <br/>
                </div>
            </SwiperSlide>
    
            <SwiperSlide>
                <div className="card">
                <img src={MapImage} alt="My Map" />
                <h3>My Map</h3>
                <p>View and mark your trip destinations and stops on the world map!</p>
                <br/>
                </div>
            </SwiperSlide>
    
            <SwiperSlide>
                <div className="card">
                <img src={BudgetImage} alt="My Budget"/>
                <h3>My Budget</h3>
                <p>Add travel expenses and track your total spendings!</p>
                <br/>
                </div>
            </SwiperSlide>

            <SwiperSlide>
                <div className="card">
                <img src={NotesImage} alt="My Notes" />
                <h3>My Notes</h3>
                <p>Add personal travel notes and brainstorming ideas here so you don't forget!</p>
                <br/>
                </div>
            </SwiperSlide>

            <SwiperSlide>
                <div className="card">
                <img src={SuggestionsImage} alt="My Suggestions" />
                <h3>My Suggestions</h3>
                <p>Ask Lily the Llama for travel suggestions customized for your trip!</p>
                <br/>
                </div>
            </SwiperSlide>

            <div className="swiper-button-prev">
                <FaChevronLeft size={15} />
            </div>
            <div className="swiper-button-next">
                <FaChevronRight size={15} />
            </div>

            </Swiper>
        </div>
    );
  };
  
  export default Slider;