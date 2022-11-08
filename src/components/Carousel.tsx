import './Carousel.scss';
import { useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

function Carousel({ className, images, videos }) {
    const carousel = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    function enforceArray(value) {
        return Array.isArray(value) ? value : [];
    }

    const back = useCallback(() => {
        if (activeIndex === 0) {
            carousel.current.scrollLeft = carousel.current.clientWidth * (enforceArray(images).length + enforceArray(videos).length - 1);
        } else {
            carousel.current.scrollLeft -= carousel.current.clientWidth;
        }
    }, [activeIndex, images, videos]);

    const next = useCallback(() => {
        if (activeIndex === enforceArray(images).length + enforceArray(videos).length - 1) {
            carousel.current.scrollLeft = 0;
        } else {
            carousel.current.scrollLeft += carousel.current.clientWidth;
        }
    }, [activeIndex, images, videos]);

    useEffect(() => {
        function handleKeydown(event) {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                back();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                next();
            }
        }

        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
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
                        enforceArray(images).length
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
                        enforceArray(videos).length
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
                enforceArray(images).length + enforceArray(videos).length > 1
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