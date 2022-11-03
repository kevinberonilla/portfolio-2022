import './Carousel.scss';
import { useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

function Carousel({ className, images, videos }) {
    const carousel = useRef();
    const [activeIndex, setActiveIndex] = useState(0);

    const back = useCallback(() => {
        if (activeIndex === 0) {
            carousel.current.scrollLeft = carousel.current.clientWidth * ((Array.isArray(images) ? images.length : 0) + (Array.isArray(videos ? videos.length : 0)) - 1);
        } else {
            carousel.current.scrollLeft -= carousel.current.clientWidth;
        }
    }, [activeIndex, images, videos]);

    const next = useCallback(() => {
        if (activeIndex === (Array.isArray(images) ? images.length : 0) + (Array.isArray(videos ? videos.length : 0)) - 1) {
            carousel.current.scrollLeft = 0;
        } else {
            carousel.current.scrollLeft += carousel.current.clientWidth;
        }
    }, [activeIndex, images, videos]);

    useEffect(() => {
        function handleKeyup(event) {
            if (event.key === 'ArrowLeft') {
                back();
            } else if (event.key === 'ArrowRight') {
                next();
            }
        }

        window.addEventListener('keyup', handleKeyup);

        return () => {
            window.removeEventListener('keyup', handleKeyup);
        }
    }, [back, next]);

    function handleCarouselScroll() {
        setActiveIndex(Math.round(carousel.current.scrollLeft / carousel.current.clientWidth));
    }

    function handleNavigationClick(event) {
        const index = parseInt(event.currentTarget.dataset.index, 10);

        carousel.current.scrollLeft = carousel.current.clientWidth * index;
    }

    return (
        <div className={'kb-carousel__container' + (className ? ' ' + className : '')}>
            <div ref={carousel} className="kb-carousel" onScroll={handleCarouselScroll}>
                <div className="kb-carousel__rail">
                    {
                        Array.isArray(images) && images.length
                        ?
                        images.map(image => {
                            return (
                                <img key={image} className="kb-carousel__image" src={image} alt="" tabIndex="0" />
                            )
                        })
                        :
                        ''
                    }
                    {
                        Array.isArray(videos) && videos.length
                        ?
                        videos.map((video, videoIndex) => {
                            return (
                                <div key={video} className="kb-carousel__video-container" tabIndex="0">
                                    <iframe src={video} title={'Video ' + (videoIndex + 1)} frameBorder="0" allowFullScreen></iframe>
                                </div>
                            )
                        })
                        :
                        ''
                    }
                </div>
            </div>
            {
                (Array.isArray(images) ? images.length : 0) + (Array.isArray(videos) ? videos.length : 0) > 1
                ?
                <>
                    <div className="kb-carousel__nav">
                        {
                            (images || []).concat((videos || [])).map((slide, slideIndex) => {
                                return (
                                    <div key={slide} className={'kb-carousel__nav-item' + (slideIndex === activeIndex ? ' kb-carousel__nav-item--active' : '')} data-index={slideIndex} onClick={handleNavigationClick}></div>
                                )
                            })
                        }
                    </div>
                    <button className="kb-carousel__back fa-solid fa-chevron-left" onClick={back}>
                        <span className="kb-text--assistive">Back</span>
                    </button>
                    <button className="kb-carousel__next fa-solid fa-chevron-right" onClick={next}>
                        <span className="kb-text--assistive">Next</span>
                    </button>
                </>
                :
                ''
            }
        </div>
    );
}

Carousel.propTypes = {
    className: PropTypes.string,
    images: PropTypes.array,
    videos: PropTypes.array
};

export default Carousel;