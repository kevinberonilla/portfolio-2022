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
        <div className="kb-scope">
            <main className="kb-container">
                <div className="kb-hero">
                    <div className="kb-hero__sidebar">
                        <img src={logo} alt="Kevin Beronilla" className="kb-hero__logo" />
                        <ul className="kb-hero__links">
                            <li>
                                <a href="./downloads/kevin-beronilla-resume.pdf" target="_blank">
                                    <span className="icon fa fa-file-text"></span>
                                    <span className="kb-assistive-text">Resume</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/kevinberonilla" target="_blank" rel="noreferrer">
                                    <span className="icon fa fa-github"></span>
                                    <span className="kb-assistive-text">GitHub</span>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:kevin.beronilla@gmail.com">
                                    <span className="icon fa fa-linkedin"></span>
                                    <span className="kb-assistive-text">LinkedIn</span>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:kevin.beronilla@gmail.com">
                                    <span className="icon fa fa-envelope"></span>
                                    <span className="kb-assistive-text">Email</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="kb-hero__content">
                        <h1 className="kb-text-heading kb-text-heading--large">
                            My name is <span className="kb-font-color--brand">Kevin Beronilla</span> and I am a visual artist.
                        </h1>
                        <p className="kb-hero__description">With a multi-disciplinary background in graphic/UI/UX design, front-end development, photography, and video, I aim to create beautiful experiences in multi-media.</p>
                    </div>
                </div>
                
            </main>
        </div>
    );
}

export default App;
