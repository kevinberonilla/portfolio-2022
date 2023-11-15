import React, { useEffect, useRef, useState } from 'react';
import { getContentfulProjects } from '../utilities/requests';
import './App.scss';
import Hero from './Hero';
import ProjectGallery from './ProjectGallery';

function App() {
    const year = new Date().getFullYear();
    const heroContainer = useRef(null);
    const [filters, setFilters] = useState({});
    const [isMediumScreen, setIsMediumScreen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [galleryLoaded, setGalleryLoaded] = useState(false);

    useEffect(() => {
        async function getProjectsAndFilters() {
            const projectsResponse = await getContentfulProjects();

            if (!projectsResponse.error) {
                const responseData = projectsResponse.data;
                const projects = [];
                const categorySet = new Set();
                const categoryFilters = {};

                responseData.items.forEach(item => {
                    const imageUrls = item.fields.images?.length
                        ? item.fields.images.map(
                              image =>
                                  responseData.includes.Asset.find(
                                      asset => asset.sys.id === image.sys.id,
                                  ).fields.file.url,
                          )
                        : [];

                    projects.push({
                        id: item.sys.id,
                        thumbnailUrl: responseData.includes.Asset.find(
                            asset => asset.sys.id === item.fields.thumbnail.sys.id,
                        ).fields.file.url,
                        imageUrls: imageUrls,
                        hash:
                            '#' +
                            encodeURIComponent(item.fields.name.toLowerCase().replaceAll(' ', '-')),
                        ...item.fields,
                    });

                    item.fields.categories.forEach(category => categorySet.add(category));
                });

                Array.from(categorySet).forEach(category => (categoryFilters[category] = true));

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
            window.document.body.style.setProperty(
                '--kb-hero-height',
                heroContainer.current.clientHeight + 'px',
            );
        }

        getProjectsAndFilters();
        getDimensions(); // Set initial values
        window.addEventListener('resize', getDimensions, {
            passive: true,
        });

        return () => {
            // Clean up window
            window.removeEventListener('resize', getDimensions);
        };
    }, []);

    function handleThumbnailsLoaded() {
        setGalleryLoaded(true);
    }

    function handleFilterChange(event) {
        const category = event.currentTarget.name;
        const value = event.currentTarget.checked;
        const updatedFilters = { ...filters };

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
            }),
        );
    }

    return (
        <>
            <main>
                <section ref={heroContainer}>
                    <Hero
                        isMediumScreen={isMediumScreen}
                        shown={galleryLoaded}
                        filters={filters}
                        filteredProjectCount={filteredProjects.length}
                        totalProjectCount={projects.length}
                        onFilterChange={handleFilterChange}
                    />
                </section>
                {filteredProjects.length > 0 && (
                    <section>
                        <ProjectGallery
                            projects={filteredProjects}
                            isMediumScreen={isMediumScreen}
                            loaded={galleryLoaded}
                            onThumbnailsLoaded={handleThumbnailsLoaded}
                        />
                    </section>
                )}
            </main>
            <footer className={`kb-footer ${galleryLoaded ? 'kb-footer--shown' : ''}`}>
                <div className="kb-text-size--small kb-m-around--none">
                    <p>&copy; {year} Kevin Beronilla. All rights reserved.</p>
                    <p>
                        All featured projects are copyrighted by the respective individuals and
                        organizations of which they are a representation of.
                    </p>
                </div>
            </footer>
        </>
    );
}

export default App;
