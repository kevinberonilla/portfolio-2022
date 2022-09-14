import './css/App.css';
import logo from './images/logo.svg';
import { useRef, useState, useEffect } from 'react';
import Checkbox from './Checkbox';

function App() {
    const year = new Date().getFullYear();
    const hero = useRef();
    const [filters] = useState({
        design: true,
        development: true,
        photography: true,
        video: true
    });
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [allThumbnailsLoaded, setAllThumbnailsLoaded] = useState(false);
    let thumbnailsLoaded = 0;
    
    useEffect(() => {
        async function getProjects() {
            try {
                const projectsHeaders = new Headers({
                    'Authorization': 'Bearer ' + process.env.REACT_APP_CONTENTFUL_API_KEY
                });
                const requestOptions = {
                    method: 'GET',
                    headers: projectsHeaders,
                    redirect: 'follow'
                };
        
                const response = await fetch('https://cdn.contentful.com/spaces/mskeskqf4sb9/entries?order=-fields.endYear,-fields.startYear&content_type=project', requestOptions);
                const parsedResponse = JSON.parse(await response.text());
                let projects = [];

                parsedResponse.items.forEach(item => {
                    projects.push({
                        id: item.sys.id,
                        thumbnailUrl: parsedResponse.includes.Asset.find(asset => asset.sys.id === item.fields.thumbnail.sys.id).fields.file.url,
                        imageUrls: item.fields.images.map(image => parsedResponse.includes.Asset.find(asset => asset.sys.id === image.sys.id).fields.file.url),
                        hash: '#' + encodeURIComponent(item.fields.name.toLowerCase().replaceAll(' ', '-')),
                        ...item.fields
                    });
                });

                setProjects(projects);
                setFilteredProjects(projects);
            } catch (error) {
                console.error(error);
            }
        }

        function handleWindowResize() {
            window.document.body.style.setProperty('--kb-vh', window.innerHeight / 100 + 'px');
            hero.current.style.setProperty('--kb-hero-height', hero.current.clientHeight + 'px');
        }

        window.addEventListener('resize', handleWindowResize, {
            passive: true
        });
        handleWindowResize();
        window.setTimeout(getProjects, 1);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    function handleThumbnailLoad(event) {
        const loadedImage = event.currentTarget;

        if (!allThumbnailsLoaded) {
            window.setTimeout(() => {
                thumbnailsLoaded++;
                loadedImage.closest('.kb-project').classList.add('kb-project--loaded');

                if (thumbnailsLoaded >= projects.length) {
                    setAllThumbnailsLoaded(true);
                }
            }, Math.random() * 1000);
        } else {
            loadedImage.closest('.kb-project').classList.add('kb-project--revealed');
        }
    }

    function handleFilterChange(event) {
        const category = event.currentTarget.name;
        const value = event.currentTarget.checked;

        filters[category] = value;

        let enabledCategories = Object.keys(filters).filter(key => filters[key]);
        
        setFilteredProjects(
            projects.filter(project => {
                const matchingFilters = enabledCategories.filter(category => project.categories.includes(category));

                return matchingFilters.length;
            })
        );
    }

    return (
        <>
            <main>
                <section ref={hero} className={'kb-hero' + (allThumbnailsLoaded ? ' kb-hero--loaded' : '')}>
                    <div className="kb-hero__layout kb-container">
                        <div className="kb-hero__sidebar">
                            <img src={logo} alt="Kevin Beronilla" className="kb-hero__logo" />
                            <ul className="kb-hero__link-list">
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
                                    <a href="https://www.linkedin.com/in/kevinberonilla" target="_blank" rel="noreferrer">
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
                            <div className="kb-hero__controls">
                                Filter Projects
                                <Checkbox label="Design" name="design" checked={filters.design} onChange={handleFilterChange} />
                                <Checkbox label="Development" name="development" checked={filters.development} onChange={handleFilterChange} />
                                <Checkbox label="Photography" name="photography" checked={filters.photography} onChange={handleFilterChange} />
                                <Checkbox label="Video" name="video" checked={filters.video} onChange={handleFilterChange} />
                            </div>
                        </div>
                        <div className="kb-hero__content">
                            <h1 className="kb-text-heading kb-text-heading--large">
                                Hello! My name is<br /><span className="kb-font-color--brand">Kevin Beronilla</span><br />and I am a visual artist.
                            </h1>
                            <div className="kb-hero__description">
                                <p>With a multi-disciplinary background in design, development, photography, and video, my mission is to create beautiful experiences in all forms of media.</p>
                                <p>When I'm not in front of a laptop, you can find me tinkering on cars or petting fluffy animals.</p>
                            </div>
                        </div>
                    </div>
                </section>
                {
                    projects.length
                    ?
                    <section className="kb-gallery">
                        <ul className="kb-project__list">
                            {
                                filteredProjects.map((project, projectIndex) => {
                                    return (
                                        <li key={project.id} className="kb-project" data-index={projectIndex}>
                                            <a className="kb-project__link" href={project.hash}>
                                                <img className="kb-project__thumbnail" src={project.thumbnailUrl} alt={project.name} onLoad={handleThumbnailLoad} />
                                                <span className="kb-project__hover-tile">
                                                    <span className="kb-project__name kb-text-heading kb-text-heading--small kb-m-around--none">{project.name}</span>
                                                    <small className="kb-project__year kb-m-top--small kb-m-bottom--none">{project.startYear ? project.startYear + '—' + project.endYear : project.endYear}</small>
                                                </span>
                                            </a>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </section>
                    :
                    ''
                }
            </main>
            <footer className={'kb-footer' + (allThumbnailsLoaded ? ' kb-footer--loaded' : '')}>
                <p className="kb-text--small kb-m-around--none">
                    &copy; {year} Kevin Beronilla. All works featured are copyrighted by the respective individuals and organizations of which they are a representation of.
                    <br />
                    This portfolio was lovingly handcrafted using React, Sass, and Contenful.
                </p>
            </footer>
        </>
    );
}

export default App;
