import { forwardRef, useState, useCallback, useEffect, useImperativeHandle  } from 'react';
import PropTypes from 'prop-types';
import Carousel from './Carousel';

const ProjectModal = forwardRef((props, ref) => {
    const [backdropPosition, setBackdropPosition] = useState({});
    const [shown, setShown] = useState(false);
    const hideModal = useCallback(() => {
        window.document.body.classList.remove('kb-freeze');
        setShown(false);

        if (typeof props.onHidden === 'function') {
            window.setTimeout(() => {
                props.onHidden();
            }, 100);
        }
    }, [setShown, props]);

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
        const projectLinkBounds = window.document.querySelector('.kb-project__link[href="' + props.project.hash + '"]').getBoundingClientRect();

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

    return (
        <div className={'kb-project-modal' + (shown ? ' kb-project-modal--shown' : '') + (props.className ? ' ' + props.className : '')} role="dialog" aria-labelledby="project-name" aria-describedby="project-details">
            <div className="kb-project-modal__backdrop" style={backdropPosition}>
                <img className="kb-project-modal__background" src={props.project.thumbnailUrl} alt={props.project.name} />
            </div>
            <div className={'kb-project-modal__content' + (shown ? ' kb-project-modal__content--shown' : '')}>
                <div className="kb-container kb-position--relative">
                    <button className="kb-project-modal__close fa-solid fa-close" onClick={hideModal}>
                        <span className="kb-text--assistive">Close</span>
                    </button>
                    <h2 id="project-name" className="kb-project-modal__header kb-text-heading--medium">{props.project.name}</h2>
                    <div className="kb-project-modal__body">
                        <ul id="project-details" className="kb-project-modal__detail-list">
                            <li className="kb-project-modal__detail">
                                <p className="kb-text-size--small kb-m-vertical--none"><strong>Year{props.project.startYear ? 's' : ''}</strong></p>
                                <p className="kb-m-vertical--none">{props.project.startYear ? props.project.startYear + '—' + props.project.endYear : props.project.endYear}</p>
                            </li>
                            <li className="kb-project-modal__detail">
                                <p className="kb-text-size--small kb-m-vertical--none"><strong>Project Owner</strong></p>
                                <p className="kb-m-vertical--none">{props.project.owner}</p>
                            </li>
                            <li className="kb-project-modal__detail kb-flex--shrink">
                                <p className="kb-text-size--small kb-m-vertical--none"><strong>Contributions</strong></p>
                                <p className="kb-m-vertical--none">{props.project.contributions}</p>
                            </li>
                            {
                                props.project.recognition
                                ?
                                <li className="kb-project-modal__detail kb-flex--shrink">
                                    <p className="kb-text-size--small kb-m-vertical--none"><strong>Recognition</strong></p>
                                    <p className="kb-m-vertical--none">{props.project.recognition}</p>
                                </li>
                                :
                                ''
                            }
                            {
                                props.project.githubRepository || props.project.demoSite || props.project.liveSite
                                ?
                                <li className="kb-project-modal__detail">
                                    <p className="kb-text-size--small kb-m-vertical--none"><strong>Links</strong></p>
                                    <ul className="kb-list--horizontal">
                                        {
                                            props.project.githubRepository
                                            ?
                                            <li>
                                                <a href={props.project.githubRepository} target="_blank" rel="noreferrer">GitHub Repository</a>
                                            </li>
                                            :
                                            ''
                                        }
                                        {
                                            props.project.demoSite
                                            ?
                                            <li>
                                                <a href={props.project.demoSite} target="_blank" rel="noreferrer">Demo Site</a>
                                            </li>
                                            :
                                            ''
                                        }
                                        {
                                            props.project.liveSite
                                            ?
                                            <li>
                                                <a href={props.project.liveSite} target="_blank" rel="noreferrer">Live Site</a>
                                            </li>
                                            :
                                            ''
                                        }
                                    </ul>
                                </li>
                                :
                                ''
                            }
                        </ul>
                        <Carousel
                            className="kb-project-modal__carousel"
                            images={props.project.imageUrls}
                            videos={props.project.videos} />
                    </div>
                </div>
            </div>
        </div>
    );
});

ProjectModal.propTypes = {
    project: PropTypes.object.isRequired,
    className: PropTypes.string,
    onHidden: PropTypes.func
};

export default ProjectModal;