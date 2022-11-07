import './App.scss';
import { useRef, useState, useEffect } from 'react';
import { getContentfulProjects } from '../utilities/requests';
import Hero from './Hero';
import ProjectModal from './ProjectModal';

function App() {
    const year = new Date().getFullYear();
    const heroContainer = useRef();
    const projectModal = useRef();
    const [filters, setFilters] = useState({});
    const [isMediumScreen, setIsMediumScreen] = useState(true);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [viewedProject, setViewedProject] = useState({});
    const [_totalThumbnailsLoaded, setTotalThumbnailsLoaded] = useState(0);
    const [allThumbnailsLoaded, setAllThumbnailsLoaded] = useState(false);
    const [enableProjects, setEnableProjects] = useState(false);
    
    useEffect(() => {
        async function getProjectsAndFilters() {
            const projectsResponse = await getContentfulProjects();
            
            if (!projectsResponse.error) {
                const responseData = projectsResponse.data;
                let projects = [];
                let categorySet = new Set();
                let categoryArray = [];
                let categoryFilters = {};

                responseData.items.forEach(item => {
                    const imageUrls = item.fields.images?.length ? item.fields.images.map(image => responseData.includes.Asset.find(asset => asset.sys.id === image.sys.id).fields.file.url) : [];

                    projects.push({
                        id: item.sys.id,
                        thumbnailUrl: responseData.includes.Asset.find(asset => asset.sys.id === item.fields.thumbnail.sys.id).fields.file.url,
                        imageUrls: imageUrls,
                        hash: '#' + encodeURIComponent(item.fields.name.toLowerCase().replaceAll(' ', '-')),
                        ...item.fields
                    });

                    item.fields.categories.forEach(category => categorySet.add(category));
                });

                categoryArray = Array.from(categorySet).sort();
                categoryArray.forEach(category => categoryFilters[category] = true);

                setProjects(projects);
                setFilteredProjects(projects);
                setFilters(categoryFilters);
            } else {
                console.error(projectsResponse.error);
            }
        }

        function getDimensions() {
            setIsMediumScreen(window.innerWidth <= 1024);
            window.document.body.style.setProperty('--kb-vh', window.innerHeight / 100 + 'px');
            window.document.body.style.setProperty('--kb-hero-height', heroContainer.current.clientHeight + 'px');
        }

        getProjectsAndFilters();
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

                setTotalThumbnailsLoaded(previousTotal => {
                    const newTotal = previousTotal + 1;

                    if (newTotal === projects.length) {
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

                    return newTotal;
                });
            }, Math.random() * 500);
        } else { // The load event came from filtering
            loadedImage.closest('.kb-project').classList.add('kb-project--shown');
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
                <section ref={heroContainer}>
                    <Hero
                        isMediumScreen={isMediumScreen}
                        shown={allThumbnailsLoaded}
                        filters={filters}
                        filteredProjectCount={filteredProjects.length}
                        totalProjectCount={projects.length}
                        onFilterChange={handleFilterChange} />
                </section>
                {
                    filteredProjects.length
                    ?
                    <section className={'kb-gallery' + (allThumbnailsLoaded ? '' : ' kb-gallery--shifted')}>
                        <ul className={'kb-project-list' + (enableProjects ? ' kb-project-list--enabled' : '')}>
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
            <footer className={'kb-footer' + (allThumbnailsLoaded ? ' kb-footer--shown' : '')}>
                <div className="kb-text-size--small kb-m-around--none">
                    <p>&copy; {year} Kevin Beronilla. All rights reserved.</p>
                    <p>All featured projects are copyrighted by the respective individuals and organizations of which they are a representation of.</p>
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
