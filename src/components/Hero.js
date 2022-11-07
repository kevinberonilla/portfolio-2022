import './Hero.scss';
import PropTypes from 'prop-types';
import Checkbox from './Checkbox';
import logo from '../images/logo-inverse.svg';

function Hero({ isMediumScreen, shown, filters, filteredProjectCount, totalProjectCount, onFilterChange }) {
    function handleFilterChange(event) {
        if (typeof onFilterChange === 'function') {
            onFilterChange(event);
        }
    }

    const filterFieldset = (
        <fieldset className="kb-hero__controls">
            <legend>
                Projects
                <span className="kb-text-size--small kb-opacity--50 kb-m-left--x-small">{filteredProjectCount} / {totalProjectCount}</span>
            </legend>
            <div className="kb-hero__filters">
                {
                    Object.keys(filters).map(key => {
                        return (
                            <Checkbox
                                key={key}
                                className="kb-m-top--xx-small"
                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                name={key}
                                checked={filters[key]}
                                onChange={handleFilterChange} />
                        )
                    })
                }
            </div>
        </fieldset>
    );

    return (
        <div className={'kb-hero kb-container' + (shown ? ' kb-hero--shown' : '')}>
            <div className="kb-hero__sidebar">
                <img className="kb-hero__logo" src={logo} alt="Kevin Beronilla" />
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
                {filters && !isMediumScreen ? filterFieldset : ''}
            </div>
            <div className="kb-hero__content">
                <h1 className="kb-text-heading kb-text-heading--large">
                    <span className="kb-hero__wave-container">
                        <span className="kb-hero__wave">
                            👋&nbsp;
                        </span>
                    </span>
                    Hi! My name is <br /> <span className="kb-text-color--brand">Kevin Beronilla</span> and I <br /> craft visual experiences.
                </h1>
                <div className="kb-hero__description">
                    <p>With a multi-disciplinary background in design, development, photography, and video, my mission is to help others share knowledge and tell stories through visual media. When I'm not in front of a computer, you can find me tinkering on cars or relaxing with animals.</p>
                    <p>This portfolio site was created with <a href="https://reactjs.org" target="_blank" rel="noreferrer">React</a>, <a href="https://sass-lang.com" target="_blank" rel="noreferrer">Sass</a>, and <a href="https://www.contentful.com" target="_blank" rel="noreferrer">Contentful</a>. Check out the <a href="https://github.com/kevinberonilla/portfolio-2022" target="_blank" rel="noreferrer">GitHub respository</a>!</p>
                </div>
            </div>
            {filters && isMediumScreen ? filterFieldset : ''}
        </div>
    );
}

Hero.propTypes = {
    isMediumScreen: PropTypes.bool,
    shown: PropTypes.bool,
    filters: PropTypes.object,
    filteredProjectCount: PropTypes.number,
    totalProjectCount: PropTypes.number,
    onFilterChange: PropTypes.func
};

export default Hero;