import './ProjectModal.scss';
import { forwardRef, useState, useCallback, useEffect, useImperativeHandle  } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Carousel from './Carousel';

const ProjectModal = forwardRef(({ project, className, onHidden }, ref) => {
    const appRoot = document.getElementById('root');
    const [backdropPosition, setBackdropPosition] = useState({});
    const [shown, setShown] = useState(false);
    const hideModal = useCallback(() => {
        window.document.body.classList.remove('kb-freeze');
        setShown(false);

        if (typeof onHidden === 'function') {
            window.setTimeout(() => {
                onHidden();
            }, 100);
        }
    }, [setShown, onHidden]);

    useEffect(() => {
        function handleKeyUp(event) {
            if (shown && event.key === 'Escape') {
                hideModal();
            }
        }

        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [shown, hideModal]);


    function showModal() {
        window.document.body.classList.add('kb-freeze');
        const projectLinkBounds = window.document.querySelector('.kb-project-gallery__link[href="' + project.hash + '"]').getBoundingClientRect();

        setBackdropPosition({
            top: projectLinkBounds.top + 'px',
            right: projectLinkBounds.left + projectLinkBounds.width + 'px',
            bottom: projectLinkBounds.top + projectLinkBounds.height + 'px',
            left: projectLinkBounds.left + 'px',
            width: projectLinkBounds.width + 'px',
            height: projectLinkBounds.height + 'px',
        });

        setTimeout(() => {
            setBackdropPosition({
                inset: '0',
                width: '100vw',
                height: 'calc(var(--kb-vh) * 100)',
                opacity: '1'
            });

            setShown(true);
            window.setTimeout(() => {
                if (window.document.activeElement) {
                    window.document.activeElement.blur();
                }
            }, 100);
        }, 100);
    }

    useImperativeHandle(ref, () => ({
        show() {
            showModal();
        },
        hide() {
            hideModal();
        }
    }));

    return ReactDOM.createPortal(
        <div className={'kb-project-modal' + (shown ? ' kb-project-modal--shown' : '') + (className ? ' ' + className : '')} role="dialog" aria-labelledby="project-name" aria-describedby="project-details">
            <div className="kb-project-modal__backdrop" style={backdropPosition}>
                <img className="kb-project-modal__background" src={project.thumbnailUrl} alt={project.name} />
            </div>
            <div className={'kb-project-modal__content' + (shown ? ' kb-project-modal__content--shown' : '')}>
                <div className="kb-container kb-position--relative">
                    <button className="kb-project-modal__close fa-solid fa-close" onClick={hideModal}>
                        <span className="kb-text--assistive">Close</span>
                    </button>
                    <h2 id="project-name" className="kb-project-modal__header kb-text-heading--medium">{project.name}</h2>
                    <div className="kb-project-modal__body">
                        <ul id="project-details" className="kb-project-modal__detail-list">
                            <li className="kb-project-modal__detail">
                                <p className="kb-text-size--small kb-m-vertical--none"><strong>Year{project.startYear ? 's' : ''}</strong></p>
                                <p className="kb-m-vertical--none">{project.startYear ? project.startYear + '—' + project.endYear : project.endYear}</p>
                            </li>
                            <li className="kb-project-modal__detail">
                                <p className="kb-text-size--small kb-m-vertical--none"><strong>Project Owner</strong></p>
                                <p className="kb-m-vertical--none">{project.owner}</p>
                            </li>
                            {
                                project.recognition
                                ?
                                <li className="kb-project-modal__detail">
                                    <p className="kb-text-size--small kb-m-vertical--none"><strong>Recognition</strong></p>
                                    <p className="kb-m-vertical--none">{project.recognition}</p>
                                </li>
                                :
                                ''
                            }
                            {
                                project.githubRepository || project.demoSite || project.liveSite || project.appExchangeListing
                                ?
                                <li className="kb-project-modal__detail">
                                    <p className="kb-text-size--small kb-m-vertical--none"><strong>Links</strong></p>
                                    <ul className="kb-list--horizontal">
                                        {
                                            project.githubRepository
                                            ?
                                            <li>
                                                <a href={project.githubRepository} target="_blank" rel="noreferrer">GitHub Repository</a>
                                            </li>
                                            :
                                            ''
                                        }
                                        {
                                            project.demoSite
                                            ?
                                            <li>
                                                <a href={project.demoSite} target="_blank" rel="noreferrer">Demo Site</a>
                                            </li>
                                            :
                                            ''
                                        }
                                        {
                                            project.liveSite
                                            ?
                                            <li>
                                                <a href={project.liveSite} target="_blank" rel="noreferrer">Live Site</a>
                                            </li>
                                            :
                                            ''
                                        }
                                        {
                                            project.appExchangeListing
                                            ?
                                            <li>
                                                <a href={project.appExchangeListing} target="_blank" rel="noreferrer">AppExchange Listing</a>
                                            </li>
                                            :
                                            ''
                                        }
                                    </ul>
                                </li>
                                :
                                ''
                            }
                            <li className="kb-project-modal__detail">
                                <p className="kb-text-size--small kb-m-vertical--none"><strong>Contributions</strong></p>
                                <p className="kb-m-vertical--none">{project.contributions}</p>
                            </li>
                        </ul>
                        <Carousel
                            className="kb-project-modal__carousel"
                            images={project.imageUrls}
                            videos={project.videos} />
                    </div>
                </div>
            </div>
        </div>
    , appRoot);
});

ProjectModal.propTypes = {
    project: PropTypes.object.isRequired,
    className: PropTypes.string,
    onHidden: PropTypes.func
};

export default ProjectModal;