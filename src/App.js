import { useRef, useState, useEffect } from 'react';
import Checkbox from './Checkbox';
import ProjectModal from './ProjectModal';
import logo from './images/logo.svg';
import logoInverse from './images/logo-inverse.svg';

function App() {
    const year = new Date().getFullYear();
    const hero = useRef();
    const projectModal = useRef();
    const [filters] = useState({
        design: true,
        development: true,
        photography: true,
        video: true
    });
    const [isMediumScreen, setIsMediumScreen] = useState(true);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [viewedProject, setViewedProject] = useState({});
    const [allThumbnailsLoaded, setAllThumbnailsLoaded] = useState(false);
    const [enableProjects, setEnableProjects] = useState(false);

    const filterFieldset = (
        <fieldset className="kb-hero__controls">
            <legend>
                Filter Projects
                <span className="kb-text-size--small kb-opacity--50 kb-m-left--x-small">{filteredProjects.length} of {projects.length}</span>
            </legend>
            <div className="kb-hero__filters">
                <Checkbox className="kb-m-top--xx-small" label="Design" name="design" checked={filters.design} onChange={handleFilterChange} />
                <Checkbox className="kb-m-top--xx-small" label="Development" name="development" checked={filters.development} onChange={handleFilterChange} />
                <Checkbox className="kb-m-top--xx-small" label="Photography" name="photography" checked={filters.photography} onChange={handleFilterChange} />
                <Checkbox className="kb-m-top--xx-small" label="Video" name="video" checked={filters.video} onChange={handleFilterChange} />
            </div>
        </fieldset>
    );
    
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
        
                const response = await fetch('https://cdn.contentful.com/spaces/mskeskqf4sb9/entries?order=-fields.endYear,-fields.startYear,-sys.createdAt&content_type=project', requestOptions);
                const parsedResponse = JSON.parse(await response.text());
                let projects = [];

                parsedResponse.items.forEach(item => {
                    const imageUrls = item.fields.images?.length ? item.fields.images.map(image => parsedResponse.includes.Asset.find(asset => asset.sys.id === image.sys.id).fields.file.url) : [];

                    projects.push({
                        id: item.sys.id,
                        thumbnailUrl: parsedResponse.includes.Asset.find(asset => asset.sys.id === item.fields.thumbnail.sys.id).fields.file.url,
                        imageUrls: imageUrls,
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
            setIsMediumScreen(window.innerWidth <= 1024);
            window.document.body.style.setProperty('--kb-vh', window.innerHeight / 100 + 'px');
            hero.current.style.setProperty('--kb-hero-height', hero.current.clientHeight + 'px');
        }

        window.addEventListener('resize', handleWindowResize, {
            passive: true
        });
        handleWindowResize(); // Set initial values
        getProjects();

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    function handleThumbnailLoad(event) {
        const loadedImage = event.currentTarget;

        if (!allThumbnailsLoaded) {
            window.setTimeout(() => {
                loadedImage.closest('.kb-project').classList.add('kb-project--loaded');

                if (window.document.querySelectorAll('.kb-project--loaded').length === projects.length) {
                    const enableProjectsTimeout = isMediumScreen ? 0 : 750;

                    setAllThumbnailsLoaded(true);

                    window.setTimeout(() => {
                        setEnableProjects(true);
                        
                        if (window.location.hash) {
                            window.document.querySelector('.kb-project__link[href="' + window.location.hash + '"]').click();
                        }
                    }, enableProjectsTimeout);
                }
            }, Math.random() * 500);
        } else { // The load event came from filtering
            loadedImage.closest('.kb-project').classList.add('kb-project--revealed');
        }
    }

    function handleFilterChange(event) {
        const category = event.currentTarget.name;
        const value = event.currentTarget.checked;

        filters[category] = value;

        const enabledCategories = Object.keys(filters).filter(key => filters[key]);
        
        setFilteredProjects(
            projects.filter(project => {
                for (let i = 0; i < project.categories.length; i++) {
                    if (enabledCategories.includes(project.categories[i])) {
                        return true;
                    }
                }

                return false;
            })
        );
    }

    function handleProjectClick(event) {
        event.preventDefault();

        const projectIndex = parseInt(event.currentTarget.dataset.index, 10);
        const targetProject = filteredProjects[projectIndex];
        const newDocumentTitle = targetProject.name + ' | Kevin Beronilla';

        setViewedProject(targetProject);
        window.document.title = newDocumentTitle;
        window.history.replaceState(null, newDocumentTitle, window.location.pathname + targetProject.hash);

        window.setTimeout(() => {
            projectModal.current.show();
        }, 0);
    }

    function handleProjectModalHidden() {
        const newDocumentTitle = 'Kevin Beronilla';

        setViewedProject({});
        window.document.title = newDocumentTitle;
        window.history.replaceState(null, newDocumentTitle, window.location.pathname);
    }

    return (
        <>
            <main>
                <section ref={hero} className={'kb-hero' + (allThumbnailsLoaded ? ' kb-hero--loaded' : '')}>
                    <div className="kb-hero__layout kb-container">
                        <div className="kb-hero__sidebar">
                            <img className="kb-logo" src={logo} alt="Kevin Beronilla" />
                            <img className="kb-logo--inverse" src={logoInverse} alt="Kevin Beronilla" />
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
                            {!isMediumScreen ? filterFieldset : ''}
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
                        {isMediumScreen ? filterFieldset : ''}
                    </div>
                </section>
                {
                    filteredProjects.length
                    ?
                    <section className="kb-gallery">
                        <ul className={'kb-project-list' + (enableProjects ? ' kb-project-list--loaded' : '')}>
                            {
                                filteredProjects.map((project, projectIndex) => {
                                    return (
                                        <li key={project.id} className="kb-project">
                                            <a className="kb-project__link" href={project.hash} data-index={projectIndex} onClick={handleProjectClick}>
                                                <img className="kb-project__thumbnail" src={project.thumbnailUrl} alt={project.name} onLoad={handleThumbnailLoad} />
                                                <span className="kb-project__hover-tile">
                                                    <span className="kb-project__name kb-m-around--none">{project.name}</span>
                                                    <span className="kb-project__year kb-text-size--small kb-m-top--x-small kb-m-bottom--none">{project.startYear ? project.startYear + '—' + project.endYear : project.endYear}</span>
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
                <div className="kb-text-size--small kb-m-around--none">
                    <p>&copy; {year} Kevin Beronilla. All rights reserved.</p>
                    <p>All featured projects are copyrighted by the respective individuals and organizations of which they are a representation of.</p>
                    <p>This portfolio site was handcrafted using <a href="https://reactjs.org" target="_blank" rel="noreferrer">React</a>, <a href="https://sass-lang.com" target="_blank" rel="noreferrer">Sass</a>, and <a href="https://www.contentful.com" target="_blank" rel="noreferrer">Contentful</a>. Check out the <a href="https://github.com/kevinberonilla/portfolio" target="_blank" rel="noreferrer">GitHub respository</a>!</p>
                </div>
            </footer>
            {Object.keys(viewedProject).length ? <ProjectModal ref={projectModal} project={viewedProject} onHidden={handleProjectModalHidden} /> : ''}
        </>
    );
}

export default App;
