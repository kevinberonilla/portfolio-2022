import logo from './images/logo.svg';
import { useEffect } from 'react';
import './App.css';

function App() {
    useEffect(() => {
        function handleWindowResize() {
            document.querySelector('.kb-scope').style.setProperty('--kb-vh', window.innerHeight / 100 + 'px');
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    return (
        <div className="kb">
            <main className="kb-container">
                <div className="kb-hero">
                    <div className="kb-hero__sidebar">
                        <img src={logo} alt="Kevin Beronilla" className="kb-hero__logo" />
                        <ul className="kb-hero__links">
                            <li className="kb-hero__link">
                                <a href="./downloads/kevin-beronilla-resume.pdf" target="_blank">
                                    <span className="icon fa fa-file-text"></span>
                                </a>
                                <span className="kb-hero__link-label">Resume</span>
                            </li>
                            <li className="kb-hero__link">
                                <a href="https://github.com/kevinberonilla" target="_blank" rel="noreferrer">
                                    <span className="icon fa fa-github"></span>
                                </a>
                                <span className="kb-hero__link-label">GitHub</span>
                            </li>
                            <li className="kb-hero__link">
                                <a href="mailto:kevin.beronilla@gmail.com">
                                    <span className="icon fa fa-linkedin"></span>
                                </a>
                                <span className="kb-hero__link-label">LinkedIn</span>
                            </li>
                            <li className="kb-hero__link">
                                <a href="mailto:kevin.beronilla@gmail.com">
                                    <span className="icon fa fa-envelope"></span>
                                </a>
                                <span className="kb-hero__link-label">Email</span>
                            </li>
                        </ul>
                    </div>
                    <div className="kb-hero__content">
                        <h1 className="kb-text-heading kb-text-heading--large">
                            My name is<br /><span className="kb-font-color--brand">Kevin Beronilla</span><br />and I am a visual artist.
                        </h1>
                        <p className="kb-hero__description">With a multi-disciplinary background in graphic/UI/UX design, front-end development, photography, and video, my mission is to create beautiful experiences in all forms of media.</p>
                    </div>
                </div>
                
            </main>
        </div>
    );
}

export default App;
