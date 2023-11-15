import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import './ProjectGallery.scss';
import ProjectModal from './ProjectModal';

function ProjectGallery({
    projects = [],
    isMediumScreen = false,
    loaded = false,
    onThumbnailsLoaded,
}) {
    const projectModal = useRef(null);
    const [_totalThumbnailsLoaded, setTotalThumbnailsLoaded] = useState(0);
    const [enableProjects, setEnableProjects] = useState(loaded);
    const [viewedProject, setViewedProject] = useState({});

    function handleThumbnailLoad(event) {
        const loadedImage = event.currentTarget;

        if (!loaded) {
            window.setTimeout(() => {
                loadedImage
                    .closest('.kb-project-gallery__project')
                    .classList.add('kb-project-gallery__project--loaded');

                setTotalThumbnailsLoaded(previousTotal => {
                    const newTotal = previousTotal + 1;

                    if (newTotal === projects.length) {
                        const enableProjectsTimeout = isMediumScreen ? 0 : 750;

                        if (typeof onThumbnailsLoaded === 'function') {
                            window.setTimeout(onThumbnailsLoaded, 0);
                        }

                        window.setTimeout(() => {
                            setEnableProjects(true);

                            if (window.location.hash) {
                                const hash = window.location.hash.replace('#!/', '#'); // Update legacy hashes
                                const project = window.document.querySelector(
                                    `.kb-project-gallery__link[href="${hash}"]`,
                                );

                                if (project) {
                                    project.click();
                                }
                            }
                        }, enableProjectsTimeout);
                    }

                    return newTotal;
                });
            }, Math.random() * 500);
        } else {
            // The load event came from filtering
            loadedImage
                .closest('.kb-project-gallery__project')
                .classList.add('kb-project-gallery__project--shown');
        }
    }

    function handleProjectClick(event) {
        event.preventDefault();

        const projectIndex = parseInt(event.currentTarget.dataset.index, 10);
        const targetProject = projects[projectIndex];
        const newDocumentTitle = `${targetProject.name} | Kevin Beronilla`;

        setViewedProject(targetProject);
        window.document.title = newDocumentTitle;
        window.history.replaceState(
            null,
            newDocumentTitle,
            window.location.pathname + targetProject.hash,
        );

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
            <div className={`kb-project-gallery ${loaded ? '' : 'kb-project-gallery--shifted'}`}>
                <ul
                    className={`kb-project-gallery__list ${
                        enableProjects ? 'kb-project-gallery__list--enabled' : ''
                    }`}
                >
                    {projects.map((project, projectIndex) => {
                        return (
                            <li key={project.id} className="kb-project-gallery__project">
                                <a
                                    className="kb-project-gallery__link"
                                    href={project.hash}
                                    data-index={projectIndex}
                                    onClick={handleProjectClick}
                                >
                                    <img
                                        className="kb-project-gallery__thumbnail"
                                        src={project.thumbnailUrl}
                                        alt={project.name}
                                        onLoad={handleThumbnailLoad}
                                    />
                                    <span className="kb-project-gallery__hover-tile">
                                        <span className="kb-project-gallery__name kb-m-around--none">
                                            {project.name}
                                        </span>
                                        <ul className="kb-project-gallery__tags kb-text-transform--capitalize">
                                            {project.categories.map(category => {
                                                return <li key={category}>{category}</li>;
                                            })}
                                        </ul>
                                    </span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {Object.keys(viewedProject).length > 1 && (
                <ProjectModal
                    ref={projectModal}
                    project={viewedProject}
                    onHidden={handleProjectModalHidden}
                />
            )}
        </>
    );
}

ProjectGallery.propTypes = {
    projects: PropTypes.array.isRequired,
    isMediumScreen: PropTypes.bool,
    loaded: PropTypes.bool,
    onThumbnailsLoaded: PropTypes.func,
};

export default ProjectGallery;
