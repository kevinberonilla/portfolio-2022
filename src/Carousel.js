import PropTypes from 'prop-types';

function Carousel(props) {

    return (
        <div className={'kb-carousel' + (props.className ? ' ' + props.className : '')}>
            <ol className="kb-carousel__slider">
                {
                    props.images.map(image => {
                        return (
                            <li key={image} className="kb-carousel__slide">
                                <img src={image} alt="" />
                            </li>
                        )
                    })
                }
            </ol>
            {
                props.images.length > 1
                ?
                <div className="kb-carousel__controls">
                    <div className="kb-carousel__left">left</div>
                    <div className="kb-carousel__right">right</div>
                    <div className="kb-carousel__nav">nav</div>
                </div>

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