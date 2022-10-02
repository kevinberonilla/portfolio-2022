import PropTypes from 'prop-types';
import Checkbox from './Checkbox';
import logo from './images/logo-inverse.svg';

function Hero(props) {
    function handleFilterChange(event) {
        if (typeof props.onFilterChange === 'function') {
            props.onFilterChange(event);
        }
    }

    const filterFieldset = (
        <fieldset className="kb-hero__controls">
            <legend>
                Filter Projects
                <span className="kb-text-size--small kb-opacity--50 kb-m-left--x-small">{props.filteredProjectCount} of {props.totalProjectCount}</span>
            </legend>
            <div className="kb-hero__filters">
                {
                    Object.keys(props.filters).map(key => {
                        return (
                            <Checkbox
                                className="kb-m-top--xx-small"
                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                name={key}
                                checked={props.filters[key]}
                                onChange={handleFilterChange} />
                        )
                    })
                }
            </div>
        </fieldset>
    );

    return (
        <div className="kb-hero__layout kb-container">
            <div className="kb-hero__sidebar">
                <img className="kb-logo" src={logo} alt="Kevin Beronilla" />
                <ul className="kb-hero__link-list">
                    <li className="kb-hero__link">
                        <a href="./downloads/kevin-beronilla-resume.pdf" target="_blank" aria-describedby="github">
                            <span className="fa-solid fa-file-text"></span>
                            <span className="kb-text--assistive">Resume</span>
                        </a>
                        <span id="resume" className="kb-hero__link-label" role="tooltip">Resume</span>
                    </li>
                    <li className="kb-hero__link">
                        <a href="https://github.com/kevinberonilla" target="_blank" rel="noreferrer" aria-describedby="github">
                            <span className="fa-brands fa-github"></span>
                            <span className="kb-text--assistive">GitHub</span>
                        </a>
                        <span id="github" className="kb-hero__link-label" role="tooltip">GitHub</span>
                    </li>
                    <li className="kb-hero__link">
                        <a href="https://www.linkedin.com/in/kevinberonilla" target="_blank" rel="noreferrer" aria-describedby="linkedin">
                            <span className="fa-brands fa-linkedin"></span>
                            <span className="kb-text--assistive">LinkedIn</span>
                        </a>
                        <span id="linkedin" className="kb-hero__link-label" role="tooltip">LinkedIn</span>
                    </li>
                    <li className="kb-hero__link">
                        <a href="mailto:kevin.beronilla@gmail.com" aria-describedby="email">
                            <span className="fa-solid fa-envelope"></span>
                            <span className="kb-text--assistive">Email</span>
                        </a>
                        <span id="email" className="kb-hero__link-label" role="tooltip">Email</span>
                    </li>
                </ul>
                {props.filters && !props.isMediumScreen ? filterFieldset : ''}
            </div>
            <div className="kb-hero__content">
                <h1 className="kb-text-heading kb-text-heading--large">
                    Hello! My name is <br /> <span className="kb-text-color--brand">Kevin Beronilla</span> <br /> and I am a visual artist.
                </h1>
                <div className="kb-hero__description">
                    <p>With a multi-disciplinary background in design, development, photography, and video, my mission is to create beautiful experiences in all forms of media.</p>
                    <p>When I'm not in front of a laptop, you can find me tinkering on cars or petting fluffy animals.</p>
                </div>
            </div>
            {props.filters && props.isMediumScreen ? filterFieldset : ''}
        </div>
    );
}

Hero.propTypes = {
    isMediumScreen: PropTypes.bool,
    filters: PropTypes.object,
    filteredProjectCount: PropTypes.number,
    totalProjectCount: PropTypes.number,
    onFilterChange: PropTypes.func
};

export default Hero;