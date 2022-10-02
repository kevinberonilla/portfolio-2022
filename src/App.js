import { useRef, useState, useEffect } from 'react';
import Hero from './Hero';
import ProjectModal from './ProjectModal';

function App() {
    const year = new Date().getFullYear();
    const hero = useRef();
    const projectModal = useRef();
    const [filters, setFilters] = useState({
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

        function getDimensions() {
            setIsMediumScreen(window.innerWidth <= 1024);
            window.document.body.style.setProperty('--kb-vh', window.innerHeight / 100 + 'px');
            window.document.body.style.setProperty('--kb-hero-height', hero.current.clientHeight + 'px');
        }

        getProjects();
        getDimensions(); // Set initial values
        window.addEventListener('resize', getDimensions, {
            passive: true
        });

        return () => { // Clean up window
            window.removeEventListener('resize', getDimensions);
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
                            const hash = window.location.hash.replace('#!/', '#'); // Update legacy hashes
                            const project = window.document.querySelector('.kb-project__link[href="' + hash + '"]');

                            if (project) {
                                project.click();
                            }
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
        const updatedFilters = {...filters};

        updatedFilters[category] = value;
        setFilters(updatedFilters);

        const enabledCategories = Object.keys(updatedFilters).filter(key => updatedFilters[key]);
        
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
                    <Hero
                        isMediumScreen={isMediumScreen}
                        filters={filters}
                        filteredProjectCount={filteredProjects.length}
                        totalProjectCount={projects.length}
                        onFilterChange={handleFilterChange} />
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
                                                    <ul className="kb-project__tags kb-text-transform--capitalize">
                                                        {
                                                            project.categories.map(category => {
                                                                return (
                                                                    <li key={category}>{category}</li>
                                                                    )
                                                                })
                                                            }
                                                    </ul>
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
                    <p>This portfolio site was handcrafted using <a href="https://reactjs.org" target="_blank" rel="noreferrer">React</a>, <a href="https://sass-lang.com" target="_blank" rel="noreferrer">Sass</a>, and <a href="https://www.contentful.com" target="_blank" rel="noreferrer">Contentful</a>. Check out the <a href="https://github.com/kevinberonilla/portfolio-2022" target="_blank" rel="noreferrer">GitHub respository</a>!</p>
                </div>
            </footer>
            {
                Object.keys(viewedProject).length
                ?
                <ProjectModal
                    ref={projectModal}
                    project={viewedProject}
                    onHidden={handleProjectModalHidden} />
                :
                ''
            }
        </>
    );
}

export default App;
