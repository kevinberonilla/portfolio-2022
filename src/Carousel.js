import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

function Carousel(props) {
    const carousel = useRef();
    const [activeIndex, setActiveIndex] = useState(0);

    function handleCarouselScroll() {
        setActiveIndex(Math.round(carousel.current.scrollLeft / carousel.current.clientWidth));
    }

    function next() {
        if (activeIndex === props.images.length - 1) {
            carousel.current.scrollLeft = 0;
        } else {
            carousel.current.scrollLeft += carousel.current.clientWidth;
        }
    }

    function back() {
        if (activeIndex === 0) {
            carousel.current.scrollLeft = carousel.current.clientWidth * (props.images.length - 1);
        } else {
            carousel.current.scrollLeft -= carousel.current.clientWidth;
        }
    }

    function goToIndex(event) {
        const index = parseInt(event.currentTarget.dataset.index, 10);

        carousel.current.scrollLeft = carousel.current.clientWidth * index;
    }

    return (
        <div className={'kb-carousel__container' + (props.className ? ' ' + props.className : '')}>
            <div ref={carousel} className="kb-carousel" onScroll={handleCarouselScroll}>
                <ol className="kb-carousel__rail">
                    {
                        props.images.map(image => {
                            return (
                                <img key={image} className="kb-carousel__image" src={image} alt="" />
                                )
                            })
                        }
                </ol>
            </div>
            {
                props.images.length > 1
                ?
                <>
                    <button className="kb-carousel__back fa-solid fa-chevron-left" onClick={back}></button>
                    <button className="kb-carousel__next fa-solid fa-chevron-right" onClick={next}></button>
                    <div className="kb-carousel__nav">
                        {
                            props.images.map((image, imageIndex) => {
                                return (
                                    <span key={image} data-index={imageIndex} onClick={goToIndex}>
                                        {imageIndex === activeIndex ? 'Yes' : 'No'}
                                    </span>
                                )
                            })
                        }
                    </div>
                </>
                :
                ''
            }
        </div>
    );
}

Carousel.propTypes = {
    images: PropTypes.array.isRequired,
    className: PropTypes.string
}

export default Carousel;