import { useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

function Carousel(props) {
    const carousel = useRef();
    const [activeIndex, setActiveIndex] = useState(0);

    const back = useCallback(() => {
        if (activeIndex === 0) {
            carousel.current.scrollLeft = carousel.current.clientWidth * ((props.images?.length || 0) + (props.videos?.length || 0) - 1);
        } else {
            carousel.current.scrollLeft -= carousel.current.clientWidth;
        }
    }, [activeIndex, props.images?.length, props.videos?.length]);

    const next = useCallback(() => {
        if (activeIndex === (props.images?.length || 0) + (props.videos?.length || 0) - 1) {
            carousel.current.scrollLeft = 0;
        } else {
            carousel.current.scrollLeft += carousel.current.clientWidth;
        }
    }, [activeIndex, props.images?.length, props.videos?.length]);

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
        <div className={'kb-carousel__container' + (props.className ? ' ' + props.className : '')}>
            <div ref={carousel} className="kb-carousel" onScroll={handleCarouselScroll}>
                <div className="kb-carousel__rail">
                    {
                        props.images?.length
                        ?
                        props.images.map(image => {
                            return (
                                <img key={image} className="kb-carousel__image" src={image} alt="" tabIndex="0" />
                            )
                        })
                        :
                        ''
                    }
                    {
                        props.videos?.length
                        ?
                        props.videos.map((video, videoIndex) => {
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
                (props.images?.length || 0) + (props.videos?.length || 0) > 1
                ?
                <>
                    <div className="kb-carousel__nav">
                        {
                            (props.images || []).concat((props.videos || [])).map((slide, slideIndex) => {
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